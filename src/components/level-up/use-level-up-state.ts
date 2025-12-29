import { useCallback, useMemo, useState } from 'react';

import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { CharacterTier } from '@/lib/schemas/core';
import { getTierForLevel } from '@/lib/schemas/core';

import {
  createRemoveSelectionHandler,
  createSelectOptionHandler,
  createSubModalConfirmHandler,
} from './level-up-selection-handlers';
import {
  canProceedToOptions as checkCanProceed,
  computeAllOwnedCardNames,
  computeAvailableExperiencesForSelection,
  computeAvailableTraitsForSelection,
  computeCardsSelectedThisSession,
  computeClassPairs,
  computePointsSpent,
  extractBoostedExperiencesThisSession,
  extractSelectedTraitsThisSession,
  getAvailableOptionsForTier,
  shouldGetNewExperience,
} from './level-up-state-utils';
import {
  type LevelUpOptionConfig,
  type LevelUpSelection,
  type LevelUpStep,
} from './types';

const POINTS_PER_LEVEL = 2;

interface UseLevelUpStateProps {
  currentLevel: number;
  currentTier: string;
  currentTraits: { name: string; marked: boolean }[];
  currentExperiences: { id: string; name: string; value: number }[];
  tierHistory: Record<string, number>;
  classSelection: ClassSelection | null;
  ownedCardNames: string[];
}

export function useLevelUpState(props: UseLevelUpStateProps) {
  const {
    currentLevel,
    currentTier,
    currentTraits,
    currentExperiences,
    tierHistory,
    classSelection,
    ownedCardNames,
  } = props;
  const targetLevel = currentLevel + 1;
  const targetTier = getTierForLevel(targetLevel) as CharacterTier;
  const tierChanged = targetTier !== currentTier;

  const [currentStep, setCurrentStep] =
    useState<LevelUpStep>('automatic-benefits');
  const [selections, setSelections] = useState<LevelUpSelection[]>([]);
  const [pendingOption, setPendingOption] =
    useState<LevelUpOptionConfig | null>(null);
  const [freeDomainCard, setFreeDomainCard] = useState<string | null>(null);
  const [newExperienceName, setNewExperienceName] = useState<string | null>(
    null
  );
  const [showFreeDomainCardModal, setShowFreeDomainCardModal] = useState(false);
  const [showNewExperienceModal, setShowNewExperienceModal] = useState(false);

  const getsNewExperience = shouldGetNewExperience(targetLevel);
  const effectiveTierHistory = tierChanged ? {} : tierHistory;
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
    () => getAvailableOptionsForTier(targetTier),
    [targetTier]
  );
  const pointsSpent = useMemo(
    () => computePointsSpent(selections, availableOptions),
    [selections, availableOptions]
  );
  const pointsRemaining = POINTS_PER_LEVEL - pointsSpent;
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
  const canProceedToOptions = checkCanProceed(
    freeDomainCard,
    getsNewExperience,
    newExperienceName
  );

  const resetState = useCallback(() => {
    setCurrentStep('automatic-benefits');
    setSelections([]);
    setFreeDomainCard(null);
    setNewExperienceName(null);
    setPendingOption(null);
    setShowFreeDomainCardModal(false);
    setShowNewExperienceModal(false);
  }, []);
  const handleSelectOption = useMemo(
    () => createSelectOptionHandler(setSelections, setPendingOption),
    []
  );
  const handleRemoveSelection = useMemo(
    () => createRemoveSelectionHandler(setSelections),
    []
  );
  const handleSubModalConfirm = useMemo(
    () =>
      createSubModalConfirmHandler(
        setSelections,
        setPendingOption,
        pendingOption
      ),
    [pendingOption]
  );

  return {
    targetLevel,
    targetTier,
    tierChanged,
    currentStep,
    setCurrentStep,
    selections,
    pendingOption,
    setPendingOption,
    freeDomainCard,
    setFreeDomainCard,
    newExperienceName,
    setNewExperienceName,
    showFreeDomainCardModal,
    setShowFreeDomainCardModal,
    showNewExperienceModal,
    setShowNewExperienceModal,
    getsNewExperience,
    effectiveTierHistory,
    classPairs,
    allOwnedCardNames,
    availableOptions,
    pointsSpent,
    pointsRemaining,
    pointsPerLevel: POINTS_PER_LEVEL,
    availableTraitsForSelection,
    availableExperiencesForSelection,
    canProceedToOptions,
    resetState,
    handleSelectOption,
    handleRemoveSelection,
    handleSubModalConfirm,
  };
}
