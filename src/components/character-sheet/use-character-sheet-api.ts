import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  useCharacterState,
  useSessionState,
} from '@/components/demo/character-state-hooks';
import { processLevelUpResult } from '@/components/demo/level-up-handlers';
import {
  buildCharacterSheetHandlers,
  buildCharacterSheetState,
} from '@/components/demo/state-builders';
import type { LevelUpResult } from '@/components/level-up';
import { DEFAULT_RESOURCES_STATE } from '@/components/resources';
import type { HopeWithScarsState } from '@/components/scars';
import type { SessionEntry } from '@/components/session-tracker';
import type { CharacterRecord } from '@/lib/api/characters';
import { fetchCharacter } from '@/lib/api/characters';
import { characterQueryKeys } from '@/lib/api/query-client';

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
  mapResourcesToApi,
  mapSessionsToApi,
  mapThresholdsToApi,
  mapTraitsToApi,
} from './character-api-mappers';
import { hydrateCharacterState } from './hydrate-character';
import { useAutoSave } from './use-auto-save';

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

// eslint-disable-next-line max-lines-per-function -- complex hook with many handler wrappers
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

  // Auto-save hook
  const { isSaving, lastSaved, scheduleSave } = useAutoSave(characterId);

  // Build state object to pass to components
  const hopeWithScars: HopeWithScarsState = {
    current: charState.resources.hope.current,
    max: charState.resources.hope.max,
    scars: sessionState.scars,
    extraSlots: sessionState.extraHopeSlots,
    companionHopeFilled: sessionState.companionHopeFilled,
  };

  const state = buildCharacterSheetState(
    charState,
    sessionState,
    hopeWithScars
  );

  // Level up handler
  const handleLevelUp = useCallback(() => setIsLevelUpOpen(true), []);

  const handleLevelUpConfirm = useCallback(
    (result: LevelUpResult) => {
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
      scheduleSave({
        progression: {
          currentLevel: result.newLevel,
          currentTier: result.newTier,
          availablePoints: 0,
          spentOptions: {},
        },
      });
    },
    [charState, sessionState.setCompanion, scheduleSave]
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
  // The ref is only accessed inside returned handler functions (event handlers),
  // not during the useMemo render phase, so this is a false positive.
  /* eslint-disable react-hooks/refs, max-lines-per-function */
  const handlers = useMemo(
    () => ({
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
      setHopeWithScars: (newState: HopeWithScarsState) => {
        charState.setResources(prev => ({
          ...prev,
          hope: { current: newState.current, max: newState.max },
        }));
        sessionState.setScars(newState.scars);
        sessionState.setExtraHopeSlots(newState.extraSlots ?? 0);
        sessionState.setCompanionHopeFilled(
          newState.companionHopeFilled ?? false
        );
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
      },
      setCountdowns: createAutoSaveHandler(
        sessionState.setCountdowns,
        mapCountdownsToApi,
        scheduleSave,
        isHydratedRef
      ),
      setSessions: (s: SessionEntry[], id: string | null) => {
        sessionState.setSessions(s);
        sessionState.setCurrentSessionId(id);
        if (isHydratedRef.current) {
          scheduleSave(mapSessionsToApi(s, id));
        }
      },
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
    }),
    [baseHandlers, charState, sessionState, serverData, scheduleSave]
  );
  /* eslint-enable react-hooks/refs, max-lines-per-function */

  // Hydrate local state from server data when it arrives
  useEffect(() => {
    if (serverData && !isHydratedRef.current) {
      isHydratedRef.current = true;
      hydrateCharacterState(serverData, charState, sessionState);
      requestAnimationFrame(() => {
        setIsHydrated(true);
      });
    }
  }, [serverData, charState, sessionState]);

  const currentTraitsForModal = Object.entries(charState.traits).map(
    ([name, val]) => ({ name, marked: val.marked })
  );
  const currentExperiencesForModal = charState.experiences.items.map(exp => ({
    id: exp.id,
    name: exp.name,
    value: exp.value,
  }));
  const ownedCardNames = [
    ...charState.loadout.activeCards.map(c => c.name),
    ...charState.loadout.vaultCards.map(c => c.name),
  ];

  return {
    state,
    handlers,
    isLoading,
    isHydrated,
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
