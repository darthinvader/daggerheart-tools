import { useQuery } from '@tanstack/react-query';
import {
  type Dispatch,
  type SetStateAction,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { CoreScoresState } from '@/components/core-scores';
import {
  useCharacterState,
  useSessionState,
} from '@/components/demo/character-state-hooks';
import {
  computeUpdatedCompanionFromLevelUpResult,
  processLevelUpResult,
} from '@/components/demo/level-up-handlers';
import {
  addNewExperience,
  applyTraitSelection,
  boostExperiences,
  clearTraitsMarks,
} from '@/components/demo/level-up-helpers';
import {
  buildCharacterSheetHandlers,
  buildCharacterSheetState,
} from '@/components/demo/state-builders';
import type { ExperiencesState } from '@/components/experiences';
import type { LevelUpResult } from '@/components/level-up';
import type { ResourcesState } from '@/components/resources';
import { DEFAULT_RESOURCES_STATE } from '@/components/resources';
import type { HopeWithScarsState } from '@/components/scars';
import type { SessionEntry } from '@/components/session-tracker';
import type { TraitsState } from '@/components/traits';
import { useLatestRef } from '@/hooks/use-latest-ref';
import type { CharacterRecord } from '@/lib/api/characters';
import { fetchCharacter } from '@/lib/api/characters';
import { characterQueryKeys } from '@/lib/api/query-client';
import { getSubclassByName } from '@/lib/data/classes';
import type { ThresholdsSettings } from '@/lib/schemas/character-state';

import {
  mapAncestryToApi,
  mapBeastformEnabledToApi,
  mapBeastformToApi,
  mapClassSelectionToApi,
  mapCommunityToApi,
  mapCompanionEnabledToApi,
  mapCompanionToApi,
  mapConditionsToApi,
  mapCoreScoresToApi,
  mapCountdownsToApi,
  mapDowntimeActivitiesToApi,
  mapEquipmentToApi,
  mapExperiencesToApi,
  mapGoldToApi,
  mapHopeWithScarsToApi,
  mapIdentityToApi,
  mapInventoryToApi,
  mapLoadoutToApi,
  mapNotesToApi,
  mapProgressionToApi,
  mapQuickViewToApi,
  mapResourcesToApi,
  mapSessionsToApi,
  mapThresholdsToApi,
  mapTraitsToApi,
} from './character-api-mappers';
import { hydrateCharacterState } from './hydrate-character';
import { useAutoSave } from './use-auto-save';

/**
 * Compute updated traits after level-up
 */
function computeUpdatedTraits(
  currentTraits: TraitsState,
  result: LevelUpResult
): TraitsState {
  let traits = { ...currentTraits };

  // Apply trait clearing if applicable
  if (result.automaticBenefits.traitsCleared) {
    traits = clearTraitsMarks(traits);
  }

  // Apply trait selections from level-up choices
  for (const selection of result.selections) {
    if (
      selection.optionId === 'traits' &&
      selection.details?.selectedTraits?.length
    ) {
      traits = applyTraitSelection(traits, selection.details.selectedTraits);
    }
  }

  return traits;
}

/**
 * Compute updated experiences after level-up
 */
function computeUpdatedExperiences(
  currentExperiences: ExperiencesState,
  result: LevelUpResult
): ExperiencesState {
  let experiences = {
    ...currentExperiences,
    items: [...currentExperiences.items],
  };

  // Add new experience if gained
  if (
    result.automaticBenefits.experienceGained &&
    result.automaticBenefits.experienceName
  ) {
    const expSelection = result.selections.find(
      s => s.optionId === 'experiences'
    );
    const boostedNewExp = expSelection?.details?.selectedExperiences?.some(
      id => id === `new-exp-${result.newLevel}`
    );
    experiences = addNewExperience(
      experiences,
      result.automaticBenefits.experienceName,
      !!boostedNewExp
    );
  }

  // Apply experience boosts from level-up choices
  for (const selection of result.selections) {
    if (
      selection.optionId === 'experiences' &&
      selection.details?.selectedExperiences?.length
    ) {
      const idsToBoost = selection.details.selectedExperiences.filter(
        id => !id.startsWith('new-exp-')
      );
      if (idsToBoost.length > 0) {
        experiences = boostExperiences(experiences, idsToBoost);
      }
    }
  }

  return experiences;
}

/**
 * Compute updated resources after level-up
 */
function computeUpdatedResources(
  currentResources: ResourcesState,
  result: LevelUpResult
): ResourcesState {
  const resources = { ...currentResources };

  for (const selection of result.selections) {
    if (selection.optionId === 'hp') {
      resources.hp = {
        ...resources.hp,
        max: resources.hp.max + selection.count,
      };
    }
    if (selection.optionId === 'stress') {
      resources.stress = {
        ...resources.stress,
        max: resources.stress.max + selection.count,
      };
    }
  }

  return resources;
}

/**
 * Compute updated core scores after level-up
 */
function computeUpdatedCoreScores(
  currentCoreScores: CoreScoresState,
  result: LevelUpResult
): CoreScoresState {
  const coreScores = { ...currentCoreScores };

  // Apply automatic proficiency gain
  if (result.automaticBenefits.proficiencyGained) {
    coreScores.proficiency = coreScores.proficiency + 1;
  }

  for (const selection of result.selections) {
    if (selection.optionId === 'evasion') {
      coreScores.evasion = coreScores.evasion + selection.count;
    }
    if (selection.optionId === 'proficiency') {
      coreScores.proficiency = coreScores.proficiency + selection.count;
    }
  }

  return coreScores;
}

/**
 * Compute updated thresholds after level-up
 */
function computeUpdatedThresholds(
  currentThresholds: ThresholdsSettings,
  _result: LevelUpResult
): ThresholdsSettings {
  return {
    ...currentThresholds,
    values: {
      ...currentThresholds.values,
      major: currentThresholds.values.major + 1,
      severe: currentThresholds.values.severe + 1,
    },
  };
}

/**
 * Creates a handler that wraps a setter with auto-save functionality.
 * Handles both direct values and function updaters.
 */
function createAutoSaveHandler<T>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  toApiUpdates: (v: T) => Partial<CharacterRecord>,
  scheduleSave: (updates: Partial<CharacterRecord>) => void,
  isHydrated: boolean
) {
  return (value: React.SetStateAction<T>) => {
    if (typeof value === 'function') {
      startTransition(() => {
        setter((prev: T) => {
          const next = (value as (prev: T) => T)(prev);
          // scheduleSave is debounced, so double-invocation in StrictMode is benign
          if (isHydrated) scheduleSave(toApiUpdates(next));
          return next;
        });
      });
    } else {
      startTransition(() => {
        setter(value);
      });
      if (isHydrated) scheduleSave(toApiUpdates(value));
    }
  };
}

function buildHopeWithScarsState(
  charState: ReturnType<typeof useCharacterState>,
  sessionState: ReturnType<typeof useSessionState>
): HopeWithScarsState {
  return {
    current: charState.resources.hope.current,
    max: charState.resources.hope.max,
    scars: sessionState.scars,
    extraSlots: sessionState.extraHopeSlots,
    companionHopeFilled: sessionState.companionHopeFilled,
  };
}

function createLevelUpConfirmHandler({
  charState,
  sessionState,
  setIsLevelUpOpen,
  scheduleSave,
}: {
  charState: ReturnType<typeof useCharacterState>;
  sessionState: ReturnType<typeof useSessionState>;
  setIsLevelUpOpen: Dispatch<SetStateAction<boolean>>;
  scheduleSave: (updates: Partial<CharacterRecord>) => void;
}) {
  return (result: LevelUpResult) => {
    const updatedTraits = computeUpdatedTraits(charState.traits, result);
    const updatedExperiences = computeUpdatedExperiences(
      charState.experiences,
      result
    );
    const updatedResources = computeUpdatedResources(
      charState.resources,
      result
    );
    const updatedCoreScores = computeUpdatedCoreScores(
      charState.coreScores,
      result
    );
    const updatedThresholds = computeUpdatedThresholds(
      charState.thresholds,
      result
    );

    processLevelUpResult(
      result,
      {
        setProgression: charState.setProgression,
        setThresholds: charState.setThresholds,
        setIsLevelUpOpen,
        setTraits: charState.setTraits,
        setExperiences: charState.setExperiences,
        setResources: charState.setResources,
        setCoreScores: charState.setCoreScores,
        setLoadout: charState.setLoadout,
        setClassSelection: charState.setClassSelection,
        setUnlockedSubclassFeatures: charState.setUnlockedSubclassFeatures,
        setCompanion: sessionState.setCompanion,
      },
      charState.progression.currentTier,
      charState.progression.tierHistory
    );

    const shouldUpdateCompanion =
      Boolean(result.companionTrainingSelection) ||
      result.selections.some(sel => sel.optionId === 'companion-training');
    const updatedCompanion = shouldUpdateCompanion
      ? computeUpdatedCompanionFromLevelUpResult(sessionState.companion, result)
      : undefined;

    scheduleSave({
      progression: {
        currentLevel: result.newLevel,
        currentTier: result.newTier,
        availablePoints: 0,
        spentOptions: {},
      },
      traits: updatedTraits as unknown as CharacterRecord['traits'],
      experiences: updatedExperiences,
      resources: updatedResources as unknown as CharacterRecord['resources'],
      coreScores: updatedCoreScores,
      thresholds: updatedThresholds,
      ...(shouldUpdateCompanion ? { companion: updatedCompanion ?? null } : {}),
    });
  };
}

function createHopeWithScarsHandler({
  charState,
  sessionState,
  scheduleSave,
  isHydrated,
  serverData,
}: {
  charState: ReturnType<typeof useCharacterState>;
  sessionState: ReturnType<typeof useSessionState>;
  scheduleSave: (updates: Partial<CharacterRecord>) => void;
  isHydrated: boolean;
  serverData: CharacterRecord | undefined;
}) {
  return (newState: HopeWithScarsState) => {
    charState.setResources(prev => ({
      ...prev,
      hope: { current: newState.current, max: newState.max },
    }));
    sessionState.setScars(newState.scars);
    sessionState.setExtraHopeSlots(newState.extraSlots ?? 0);
    sessionState.setCompanionHopeFilled(newState.companionHopeFilled ?? false);
    if (isHydrated) {
      scheduleSave(
        mapHopeWithScarsToApi(
          { current: newState.current, max: newState.max },
          newState.scars,
          newState.extraSlots ?? 0,
          newState.companionHopeFilled ?? false,
          serverData?.resources
        )
      );
    }
  };
}

function createSessionsHandler({
  sessionState,
  scheduleSave,
  isHydrated,
}: {
  sessionState: ReturnType<typeof useSessionState>;
  scheduleSave: (updates: Partial<CharacterRecord>) => void;
  isHydrated: boolean;
}) {
  return (sessions: SessionEntry[], id: string | null) => {
    sessionState.setSessions(sessions);
    sessionState.setCurrentSessionId(id);
    if (isHydrated) {
      scheduleSave(mapSessionsToApi(sessions, id));
    }
  };
}

function buildAutoSaveHandlers({
  baseHandlers,
  charState,
  sessionState,
  serverData,
  scheduleSave,
  isHydrated,
}: {
  baseHandlers: ReturnType<typeof buildCharacterSheetHandlers>;
  charState: ReturnType<typeof useCharacterState>;
  sessionState: ReturnType<typeof useSessionState>;
  serverData: CharacterRecord | undefined;
  scheduleSave: (updates: Partial<CharacterRecord>) => void;
  isHydrated: boolean;
}) {
  return {
    ...baseHandlers,
    setIdentity: createAutoSaveHandler(
      charState.setIdentity,
      v => mapIdentityToApi(v, serverData?.identity),
      scheduleSave,
      isHydrated
    ),
    setAncestry: createAutoSaveHandler(
      charState.setAncestry,
      v => mapAncestryToApi(v, serverData?.identity),
      scheduleSave,
      isHydrated
    ),
    setCommunity: createAutoSaveHandler(
      charState.setCommunity,
      v => mapCommunityToApi(v, serverData?.identity),
      scheduleSave,
      isHydrated
    ),
    setClassSelection: createAutoSaveHandler(
      charState.setClassSelection,
      mapClassSelectionToApi,
      scheduleSave,
      isHydrated
    ),
    setTraits: createAutoSaveHandler(
      charState.setTraits,
      mapTraitsToApi,
      scheduleSave,
      isHydrated
    ),
    setEquipment: createAutoSaveHandler(
      charState.setEquipment,
      mapEquipmentToApi,
      scheduleSave,
      isHydrated
    ),
    setInventory: createAutoSaveHandler(
      charState.setInventory,
      mapInventoryToApi,
      scheduleSave,
      isHydrated
    ),
    setLoadout: createAutoSaveHandler(
      charState.setLoadout,
      v => mapLoadoutToApi(v, serverData?.domains),
      scheduleSave,
      isHydrated
    ),
    setProgression: createAutoSaveHandler(
      charState.setProgression,
      mapProgressionToApi,
      scheduleSave,
      isHydrated
    ),
    setGold: createAutoSaveHandler(
      charState.setGold,
      v => mapGoldToApi(v, serverData?.resources),
      scheduleSave,
      isHydrated
    ),
    setThresholds: createAutoSaveHandler(
      charState.setThresholds,
      mapThresholdsToApi,
      scheduleSave,
      isHydrated
    ),
    setConditions: createAutoSaveHandler(
      charState.setConditions,
      mapConditionsToApi,
      scheduleSave,
      isHydrated
    ),
    setExperiences: createAutoSaveHandler(
      charState.setExperiences,
      mapExperiencesToApi,
      scheduleSave,
      isHydrated
    ),
    setResources: createAutoSaveHandler(
      charState.setResources,
      v => mapResourcesToApi(v, charState.gold),
      scheduleSave,
      isHydrated
    ),
    setCoreScores: createAutoSaveHandler(
      charState.setCoreScores,
      mapCoreScoresToApi,
      scheduleSave,
      isHydrated
    ),
    setCompanion: createAutoSaveHandler(
      sessionState.setCompanion,
      mapCompanionToApi,
      scheduleSave,
      isHydrated
    ),
    setCompanionEnabled: createAutoSaveHandler(
      sessionState.setCompanionEnabled,
      mapCompanionEnabledToApi,
      scheduleSave,
      isHydrated
    ),
    setBeastformEnabled: createAutoSaveHandler(
      sessionState.setBeastformEnabled,
      mapBeastformEnabledToApi,
      scheduleSave,
      isHydrated
    ),
    setHopeWithScars: createHopeWithScarsHandler({
      charState,
      sessionState,
      scheduleSave,
      isHydrated,
      serverData,
    }),
    setCountdowns: createAutoSaveHandler(
      sessionState.setCountdowns,
      mapCountdownsToApi,
      scheduleSave,
      isHydrated
    ),
    setSessions: createSessionsHandler({
      sessionState,
      scheduleSave,
      isHydrated,
    }),
    setNotes: createAutoSaveHandler(
      sessionState.setNotes,
      mapNotesToApi,
      scheduleSave,
      isHydrated
    ),
    setDowntimeActivities: createAutoSaveHandler(
      sessionState.setDowntimeActivities,
      mapDowntimeActivitiesToApi,
      scheduleSave,
      isHydrated
    ),
    setQuickView: createAutoSaveHandler(
      sessionState.setQuickView,
      mapQuickViewToApi,
      scheduleSave,
      isHydrated
    ),
    setBeastform: createAutoSaveHandler(
      sessionState.setBeastform,
      mapBeastformToApi,
      scheduleSave,
      isHydrated
    ),
  };
}

export function useHasCompanionFeature(
  state: ReturnType<typeof buildCharacterSheetState>
) {
  return useMemo(() => {
    const hasCompanionFlag = (
      value: unknown
    ): value is { companion?: boolean } =>
      Boolean(value && typeof value === 'object' && 'companion' in value);
    const selection = state.classSelection;
    if (!selection?.className || !selection?.subclassName) return false;
    if (selection.isHomebrew && selection.homebrewClass) {
      const homebrewSubclass = selection.homebrewClass.subclasses.find(
        s => s.name === selection.subclassName
      );
      return Boolean(homebrewSubclass?.companion);
    }
    const subclass = getSubclassByName(
      selection.className,
      selection.subclassName
    );
    return hasCompanionFlag(subclass) && Boolean(subclass.companion);
  }, [state.classSelection]);
}

function useAutoEnableCompanion({
  isHydrated,
  state,
  hasCompanionFeature,
  handlers,
}: {
  isHydrated: boolean;
  state: ReturnType<typeof buildCharacterSheetState>;
  hasCompanionFeature: boolean;
  handlers: ReturnType<typeof buildAutoSaveHandlers>;
}) {
  // Store handler in ref to avoid dependency on unstable object reference
  const setCompanionEnabledRef = useLatestRef(handlers.setCompanionEnabled);

  useEffect(() => {
    if (!isHydrated) return;
    if (!state.companionEnabled && (hasCompanionFeature || state.companion)) {
      setCompanionEnabledRef.current(true);
    }
  }, [
    hasCompanionFeature,
    isHydrated,
    state.companion,
    state.companionEnabled,
    setCompanionEnabledRef,
  ]);
}

function useHydrateCharacterState({
  serverData,
  charState,
  sessionState,
  isHydratedRef,
  setIsHydrated,
  setIsNewCharacterState,
}: {
  serverData: CharacterRecord | undefined;
  charState: ReturnType<typeof useCharacterState>;
  sessionState: ReturnType<typeof useSessionState>;
  isHydratedRef: React.RefObject<boolean | null>;
  setIsHydrated: (value: boolean) => void;
  setIsNewCharacterState: (value: boolean) => void;
}) {
  useEffect(() => {
    if (serverData && !isHydratedRef.current) {
      isHydratedRef.current = true;
      hydrateCharacterState(serverData, charState, sessionState);
      setIsNewCharacterState(Boolean(serverData.isNewCharacter));
      requestAnimationFrame(() => {
        setIsHydrated(true);
      });
    }
  }, [
    charState,
    isHydratedRef,
    serverData,
    sessionState,
    setIsHydrated,
    setIsNewCharacterState,
  ]);
}

function buildTraitModalItems(traits: TraitsState) {
  return Object.entries(traits).map(([name, val]) => ({
    name,
    marked: val.marked,
  }));
}

function buildExperienceModalItems(experiences: ExperiencesState) {
  return experiences.items.map(exp => ({
    id: exp.id,
    name: exp.name,
    value: exp.value,
  }));
}

function buildOwnedCardNames(
  loadout: ReturnType<typeof useCharacterState>['loadout']
) {
  return [
    ...loadout.activeCards.map(c => c.name),
    ...loadout.vaultCards.map(c => c.name),
  ];
}

const buildReadOnlyHandlers = (): ReturnType<
  typeof buildCharacterSheetHandlers
> => ({
  setIdentity: () => {},
  setAncestry: () => {},
  setCommunity: () => {},
  setClassSelection: () => {},
  setProgression: () => {},
  setGold: () => {},
  setThresholds: () => {},
  setEquipment: () => {},
  setInventory: () => {},
  setLoadout: () => {},
  setExperiences: () => {},
  setConditions: () => {},
  setTraits: () => {},
  setCoreScores: () => {},
  setResources: () => {},
  onLevelUp: () => {},
  setHopeWithScars: () => {},
  setDeathState: () => {},
  setCompanion: () => {},
  setCompanionEnabled: () => {},
  setBeastformEnabled: () => {},
  setNotes: () => {},
  setRestState: () => {},
  setCountdowns: () => {},
  setDowntimeActivities: () => {},
  setSessions: () => {},
  setQuickView: () => {},
  setActiveEffects: () => {},
  setBeastform: () => {},
});

function useAutoSaveConfig(characterId: string, readOnly?: boolean) {
  const autoSave = useAutoSave(characterId);
  const scheduleSave = useMemo(
    () => (readOnly ? () => {} : autoSave.scheduleSave),
    [readOnly, autoSave.scheduleSave]
  );
  const isSaving = readOnly ? false : autoSave.isSaving;
  const lastSaved = readOnly ? null : autoSave.lastSaved;
  return { scheduleSave, isSaving, lastSaved };
}

function useLevelUpHandlers(
  charState: ReturnType<typeof useCharacterState>,
  sessionState: ReturnType<typeof useSessionState>,
  scheduleSave: (updates: Partial<CharacterRecord>) => void
) {
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const handleLevelUp = useCallback(() => setIsLevelUpOpen(true), []);

  const charStateRef = useLatestRef(charState);
  const sessionStateRef = useLatestRef(sessionState);

  const handleLevelUpConfirm = useCallback(
    (result: LevelUpResult) => {
      createLevelUpConfirmHandler({
        charState: charStateRef.current,
        sessionState: sessionStateRef.current,
        setIsLevelUpOpen,
        scheduleSave,
      })(result);
    },
    [charStateRef, sessionStateRef, scheduleSave]
  );

  return {
    isLevelUpOpen,
    setIsLevelUpOpen,
    handleLevelUp,
    handleLevelUpConfirm,
  };
}

function useCharacterSheetHandlers({
  charState,
  sessionState,
  serverData,
  scheduleSave,
  isHydrated,
  readOnly,
  handleLevelUp,
}: {
  charState: ReturnType<typeof useCharacterState>;
  sessionState: ReturnType<typeof useSessionState>;
  serverData: CharacterRecord | undefined;
  scheduleSave: (updates: Partial<CharacterRecord>) => void;
  isHydrated: boolean;
  readOnly?: boolean;
  handleLevelUp: () => void;
}) {
  const handleSetHopeWithScars = useCallback(
    (newState: HopeWithScarsState) => {
      charState.setResources(prev => ({
        ...prev,
        hope: { current: newState.current, max: newState.max },
      }));
      sessionState.setScars(newState.scars);
      sessionState.setExtraHopeSlots(newState.extraSlots ?? 0);
      sessionState.setCompanionHopeFilled(
        newState.companionHopeFilled ?? false
      );
    },
    [charState, sessionState]
  );

  const baseHandlers = useMemo(
    () =>
      buildCharacterSheetHandlers(
        charState,
        sessionState,
        handleLevelUp,
        handleSetHopeWithScars
      ),
    [charState, sessionState, handleLevelUp, handleSetHopeWithScars]
  );

  const readOnlyHandlers = useMemo(() => buildReadOnlyHandlers(), []);

  const handlers = useMemo(() => {
    if (readOnly) {
      return readOnlyHandlers;
    }
    return buildAutoSaveHandlers({
      baseHandlers,
      charState,
      sessionState,
      serverData,
      scheduleSave,
      isHydrated,
    });
  }, [
    baseHandlers,
    charState,
    sessionState,
    serverData,
    scheduleSave,
    isHydrated,
    readOnly,
    readOnlyHandlers,
  ]);

  return { handlers, readOnlyHandlers };
}

function useDerivedModalData(charState: ReturnType<typeof useCharacterState>) {
  const currentTraitsForModal = useMemo(
    () => buildTraitModalItems(charState.traits),
    [charState.traits]
  );
  const currentExperiencesForModal = useMemo(
    () => buildExperienceModalItems(charState.experiences),
    [charState.experiences]
  );
  const ownedCardNames = useMemo(
    () => buildOwnedCardNames(charState.loadout),
    [charState.loadout]
  );
  return { currentTraitsForModal, currentExperiencesForModal, ownedCardNames };
}

export function useCharacterSheetWithApi(
  characterId: string,
  options?: { readOnly?: boolean }
) {
  const {
    data: serverData,
    isLoading,
    error,
  } = useQuery({
    queryKey: characterQueryKeys.detail(characterId),
    queryFn: () => fetchCharacter(characterId),
    enabled: Boolean(characterId),
  });

  const charState = useCharacterState(DEFAULT_RESOURCES_STATE);
  const sessionState = useSessionState();
  const isHydratedRef = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isNewCharacter, setIsNewCharacterState] = useState(false);

  const { scheduleSave, isSaving, lastSaved } = useAutoSaveConfig(
    characterId,
    options?.readOnly
  );

  const hopeWithScars = useMemo(
    () => buildHopeWithScarsState(charState, sessionState),
    [charState, sessionState]
  );

  const state = useMemo(
    () => buildCharacterSheetState(charState, sessionState, hopeWithScars),
    [charState, sessionState, hopeWithScars]
  );

  const {
    isLevelUpOpen,
    setIsLevelUpOpen,
    handleLevelUp,
    handleLevelUpConfirm,
  } = useLevelUpHandlers(charState, sessionState, scheduleSave);

  const { handlers, readOnlyHandlers } = useCharacterSheetHandlers({
    charState,
    sessionState,
    serverData,
    scheduleSave,
    isHydrated,
    readOnly: options?.readOnly,
    handleLevelUp,
  });

  const hasCompanionFeature = useHasCompanionFeature(state);

  useAutoEnableCompanion({
    isHydrated,
    state,
    hasCompanionFeature,
    handlers: options?.readOnly ? readOnlyHandlers : handlers,
  });

  useHydrateCharacterState({
    serverData,
    charState,
    sessionState,
    isHydratedRef,
    setIsHydrated,
    setIsNewCharacterState,
  });

  const setIsNewCharacter = useCallback(
    (value: boolean) => {
      setIsNewCharacterState(value);
      if (isHydratedRef.current) {
        scheduleSave({ isNewCharacter: value });
      }
    },
    [scheduleSave]
  );

  const { currentTraitsForModal, currentExperiencesForModal, ownedCardNames } =
    useDerivedModalData(charState);

  return {
    state,
    handlers,
    isLoading,
    isHydrated,
    isNewCharacter,
    setIsNewCharacter,
    error,
    isLevelUpOpen,
    setIsLevelUpOpen,
    handleLevelUpConfirm,
    currentTraitsForModal,
    currentExperiencesForModal,
    ownedCardNames,
    isSaving,
    lastSaved,
    characterId,
  };
}
