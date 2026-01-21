/* eslint-disable max-lines */
import { useQuery } from '@tanstack/react-query';
import {
  type Dispatch,
  type SetStateAction,
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
import type { CharacterRecord } from '@/lib/api/characters';
import { fetchCharacter } from '@/lib/api/characters';
import { characterQueryKeys } from '@/lib/api/query-client';
import { getSubclassByName } from '@/lib/data/classes';
import type { ThresholdsSettings } from '@/lib/schemas/character-state';

import {
  mapAncestryToApi,
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
 * Only saves when state is hydrated and value is not a function updater.
 */
function createAutoSaveHandler<T>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  toApiUpdates: (v: T) => Partial<CharacterRecord>,
  scheduleSave: (updates: Partial<CharacterRecord>) => void,
  isHydratedRef: React.RefObject<boolean | null>
) {
  return (value: React.SetStateAction<T>) => {
    setter(value);
    if (isHydratedRef.current && typeof value !== 'function') {
      scheduleSave(toApiUpdates(value));
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
  isHydratedRef,
  serverData,
}: {
  charState: ReturnType<typeof useCharacterState>;
  sessionState: ReturnType<typeof useSessionState>;
  scheduleSave: (updates: Partial<CharacterRecord>) => void;
  isHydratedRef: React.RefObject<boolean | null>;
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
    if (isHydratedRef.current) {
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
  isHydratedRef,
}: {
  sessionState: ReturnType<typeof useSessionState>;
  scheduleSave: (updates: Partial<CharacterRecord>) => void;
  isHydratedRef: React.RefObject<boolean | null>;
}) {
  return (sessions: SessionEntry[], id: string | null) => {
    sessionState.setSessions(sessions);
    sessionState.setCurrentSessionId(id);
    if (isHydratedRef.current) {
      scheduleSave(mapSessionsToApi(sessions, id));
    }
  };
}

// eslint-disable-next-line max-lines-per-function -- centralizes auto-save handler wiring
function buildAutoSaveHandlers({
  baseHandlers,
  charState,
  sessionState,
  serverData,
  scheduleSave,
  isHydratedRef,
}: {
  baseHandlers: ReturnType<typeof buildCharacterSheetHandlers>;
  charState: ReturnType<typeof useCharacterState>;
  sessionState: ReturnType<typeof useSessionState>;
  serverData: CharacterRecord | undefined;
  scheduleSave: (updates: Partial<CharacterRecord>) => void;
  isHydratedRef: React.RefObject<boolean | null>;
}) {
  return {
    ...baseHandlers,
    setIdentity: createAutoSaveHandler(
      charState.setIdentity,
      v => mapIdentityToApi(v, serverData?.identity),
      scheduleSave,
      isHydratedRef
    ),
    setAncestry: createAutoSaveHandler(
      charState.setAncestry,
      v => mapAncestryToApi(v, serverData?.identity),
      scheduleSave,
      isHydratedRef
    ),
    setCommunity: createAutoSaveHandler(
      charState.setCommunity,
      v => mapCommunityToApi(v, serverData?.identity),
      scheduleSave,
      isHydratedRef
    ),
    setClassSelection: createAutoSaveHandler(
      charState.setClassSelection,
      mapClassSelectionToApi,
      scheduleSave,
      isHydratedRef
    ),
    setTraits: createAutoSaveHandler(
      charState.setTraits,
      mapTraitsToApi,
      scheduleSave,
      isHydratedRef
    ),
    setEquipment: createAutoSaveHandler(
      charState.setEquipment,
      mapEquipmentToApi,
      scheduleSave,
      isHydratedRef
    ),
    setInventory: createAutoSaveHandler(
      charState.setInventory,
      mapInventoryToApi,
      scheduleSave,
      isHydratedRef
    ),
    setLoadout: createAutoSaveHandler(
      charState.setLoadout,
      v => mapLoadoutToApi(v, serverData?.domains),
      scheduleSave,
      isHydratedRef
    ),
    setProgression: createAutoSaveHandler(
      charState.setProgression,
      mapProgressionToApi,
      scheduleSave,
      isHydratedRef
    ),
    setGold: createAutoSaveHandler(
      charState.setGold,
      v => mapGoldToApi(v, serverData?.resources),
      scheduleSave,
      isHydratedRef
    ),
    setThresholds: createAutoSaveHandler(
      charState.setThresholds,
      mapThresholdsToApi,
      scheduleSave,
      isHydratedRef
    ),
    setConditions: createAutoSaveHandler(
      charState.setConditions,
      mapConditionsToApi,
      scheduleSave,
      isHydratedRef
    ),
    setExperiences: createAutoSaveHandler(
      charState.setExperiences,
      mapExperiencesToApi,
      scheduleSave,
      isHydratedRef
    ),
    setResources: createAutoSaveHandler(
      charState.setResources,
      v => mapResourcesToApi(v, charState.gold),
      scheduleSave,
      isHydratedRef
    ),
    setCoreScores: createAutoSaveHandler(
      charState.setCoreScores,
      mapCoreScoresToApi,
      scheduleSave,
      isHydratedRef
    ),
    setCompanion: createAutoSaveHandler(
      sessionState.setCompanion,
      mapCompanionToApi,
      scheduleSave,
      isHydratedRef
    ),
    setCompanionEnabled: createAutoSaveHandler(
      sessionState.setCompanionEnabled,
      mapCompanionEnabledToApi,
      scheduleSave,
      isHydratedRef
    ),
    setHopeWithScars: createHopeWithScarsHandler({
      charState,
      sessionState,
      scheduleSave,
      isHydratedRef,
      serverData,
    }),
    setCountdowns: createAutoSaveHandler(
      sessionState.setCountdowns,
      mapCountdownsToApi,
      scheduleSave,
      isHydratedRef
    ),
    setSessions: createSessionsHandler({
      sessionState,
      scheduleSave,
      isHydratedRef,
    }),
    setNotes: createAutoSaveHandler(
      sessionState.setNotes,
      mapNotesToApi,
      scheduleSave,
      isHydratedRef
    ),
    setDowntimeActivities: createAutoSaveHandler(
      sessionState.setDowntimeActivities,
      mapDowntimeActivitiesToApi,
      scheduleSave,
      isHydratedRef
    ),
    setQuickView: createAutoSaveHandler(
      sessionState.setQuickView,
      mapQuickViewToApi,
      scheduleSave,
      isHydratedRef
    ),
  };
}

function useHasCompanionFeature(
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
  useEffect(() => {
    if (!isHydrated) return;
    if (!state.companionEnabled && (hasCompanionFeature || state.companion)) {
      handlers.setCompanionEnabled(true);
    }
  }, [
    hasCompanionFeature,
    handlers,
    handlers.setCompanionEnabled,
    isHydrated,
    state.companion,
    state.companionEnabled,
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

export function useCharacterSheetWithApi(characterId: string) {
  // Fetch character data from API
  const {
    data: serverData,
    isLoading,
    error,
  } = useQuery({
    queryKey: characterQueryKeys.detail(characterId),
    queryFn: () => fetchCharacter(characterId),
    enabled: Boolean(characterId),
  });

  // Local state hooks (starting with empty defaults)
  const charState = useCharacterState(DEFAULT_RESOURCES_STATE);
  const sessionState = useSessionState();
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const isHydratedRef = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isNewCharacter, setIsNewCharacterState] = useState(false);

  // Auto-save hook
  const { isSaving, lastSaved, scheduleSave } = useAutoSave(characterId);

  // Build state object to pass to components
  const hopeWithScars = buildHopeWithScarsState(charState, sessionState);

  const state = buildCharacterSheetState(
    charState,
    sessionState,
    hopeWithScars
  );

  // Level up handler
  const handleLevelUp = useCallback(() => setIsLevelUpOpen(true), []);

  const handleLevelUpConfirm = useCallback(
    (result: LevelUpResult) => {
      createLevelUpConfirmHandler({
        charState,
        sessionState,
        setIsLevelUpOpen,
        scheduleSave,
      })(result);
    },
    [charState, sessionState, scheduleSave, setIsLevelUpOpen]
  );

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

  // Build handlers with auto-save capability
  const baseHandlers = buildCharacterSheetHandlers(
    charState,
    sessionState,
    handleLevelUp,
    handleSetHopeWithScars
  );

  // Wrap setters with auto-save functionality using useMemo
  const handlers = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs -- ref only read inside handlers (event-time)
      buildAutoSaveHandlers({
        baseHandlers,
        charState,
        sessionState,
        serverData,
        scheduleSave,
        isHydratedRef,
      }),
    [baseHandlers, charState, sessionState, serverData, scheduleSave]
  );

  const hasCompanionFeature = useHasCompanionFeature(state);

  useAutoEnableCompanion({
    isHydrated,
    state,
    hasCompanionFeature,
    handlers,
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

  const currentTraitsForModal = buildTraitModalItems(charState.traits);
  const currentExperiencesForModal = buildExperienceModalItems(
    charState.experiences
  );
  const ownedCardNames = buildOwnedCardNames(charState.loadout);

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
