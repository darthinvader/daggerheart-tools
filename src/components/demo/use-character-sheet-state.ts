import { useCallback, useState } from 'react';

import type { LevelUpResult } from '@/components/level-up';
import { DEFAULT_RESOURCES_STATE } from '@/components/resources';
import type { HopeWithScarsState } from '@/components/scars';

import { useCharacterState, useSessionState } from './character-state-hooks';
import { processLevelUpResult } from './level-up-handlers';
import {
  buildCharacterSheetHandlers,
  buildCharacterSheetState,
} from './state-builders';

export function useCharacterSheetState() {
  const charState = useCharacterState(DEFAULT_RESOURCES_STATE);
  const sessionState = useSessionState();
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);

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
    },
    [charState, sessionState.setCompanion]
  );

  const hopeWithScars: HopeWithScarsState = {
    current: charState.resources.hope.current,
    max: charState.resources.hope.max,
    scars: sessionState.scars,
    extraSlots: sessionState.extraHopeSlots,
    companionHopeFilled: sessionState.companionHopeFilled,
  };

  const handleSetHopeWithScars = (newState: HopeWithScarsState) => {
    charState.setResources(prev => ({
      ...prev,
      hope: { current: newState.current, max: newState.max },
    }));
    sessionState.setScars(newState.scars);
    sessionState.setExtraHopeSlots(newState.extraSlots ?? 0);
    sessionState.setCompanionHopeFilled(newState.companionHopeFilled ?? false);
  };

  const state = buildCharacterSheetState(
    charState,
    sessionState,
    hopeWithScars
  );
  const handlers = buildCharacterSheetHandlers(
    charState,
    sessionState,
    handleLevelUp,
    handleSetHopeWithScars
  );

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
    isLevelUpOpen,
    setIsLevelUpOpen,
    handleLevelUpConfirm,
    currentTraitsForModal,
    currentExperiencesForModal,
    ownedCardNames,
  };
}
