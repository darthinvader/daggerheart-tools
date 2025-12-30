import { useMemo } from 'react';

import type { ClassSelection } from '@/lib/schemas/class-selection';

import {
  computeAllOwnedCardNames,
  computeAvailableExperiencesForSelection,
  computeAvailableTraitsForSelection,
  computeCardsSelectedThisSession,
  computeClassPairs,
  computePointsSpent,
  extractBoostedExperiencesThisSession,
  extractSelectedTraitsThisSession,
  getAvailableOptionsForTier,
} from './level-up-state-utils';
import type { LevelUpOptionConfig, LevelUpSelection } from './types';

interface UseLevelUpComputedProps {
  targetTier: string;
  classSelection: ClassSelection | null;
  ownedCardNames: string[];
  freeDomainCard: string | null;
  selections: LevelUpSelection[];
  currentTraits: { name: string; marked: boolean }[];
  currentExperiences: { id: string; name: string; value: number }[];
  getsNewExperience: boolean;
  newExperienceName: string | null;
  targetLevel: number;
}

export function useLevelUpComputed(props: UseLevelUpComputedProps) {
  const {
    targetTier,
    classSelection,
    ownedCardNames,
    freeDomainCard,
    selections,
    currentTraits,
    currentExperiences,
    getsNewExperience,
    newExperienceName,
    targetLevel,
  } = props;

  const classPairs = useMemo(
    () => computeClassPairs(classSelection),
    [classSelection]
  );

  const cardsSelectedThisSession = useMemo(
    () => computeCardsSelectedThisSession(freeDomainCard, selections),
    [freeDomainCard, selections]
  );

  const allOwnedCardNames = useMemo(
    () => computeAllOwnedCardNames(ownedCardNames, cardsSelectedThisSession),
    [ownedCardNames, cardsSelectedThisSession]
  );

  const availableOptions = useMemo(
    () =>
      getAvailableOptionsForTier(
        targetTier as Parameters<typeof getAvailableOptionsForTier>[0],
        classSelection?.className
      ),
    [targetTier, classSelection?.className]
  );

  const pointsSpent = useMemo(
    () =>
      computePointsSpent(selections, availableOptions as LevelUpOptionConfig[]),
    [selections, availableOptions]
  );

  const alreadySelectedTraits = useMemo(
    () => extractSelectedTraitsThisSession(selections),
    [selections]
  );

  const alreadyBoostedExperiences = useMemo(
    () => extractBoostedExperiencesThisSession(selections),
    [selections]
  );

  const availableTraitsForSelection = useMemo(
    () =>
      computeAvailableTraitsForSelection(currentTraits, alreadySelectedTraits),
    [currentTraits, alreadySelectedTraits]
  );

  const availableExperiencesForSelection = useMemo(
    () =>
      computeAvailableExperiencesForSelection(
        currentExperiences,
        alreadyBoostedExperiences,
        getsNewExperience,
        newExperienceName,
        targetLevel
      ),
    [
      currentExperiences,
      alreadyBoostedExperiences,
      getsNewExperience,
      newExperienceName,
      targetLevel,
    ]
  );

  return {
    classPairs,
    allOwnedCardNames,
    availableOptions,
    pointsSpent,
    availableTraitsForSelection,
    availableExperiencesForSelection,
  };
}
