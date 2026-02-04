import { useCallback, useMemo, useState } from 'react';

import { LEVEL_UP_OPTIONS } from '@/lib/data/core/level-progression';
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
  shouldGetNewExperience,
} from './level-up-state-utils';
import { type LevelUpSelection, type LevelUpStep } from './types';
import { useLevelUpComputed } from './use-level-up-computed';

const { POINTS_PER_LEVEL } = LEVEL_UP_OPTIONS;

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
  const [pendingOption, setPendingOption] = useState<
    ReturnType<typeof useLevelUpComputed>['availableOptions'][number] | null
  >(null);
  const [freeDomainCard, setFreeDomainCard] = useState<string | null>(null);
  const [newExperienceName, setNewExperienceName] = useState<string | null>(
    null
  );
  const [showFreeDomainCardModal, setShowFreeDomainCardModal] = useState(false);
  const [showNewExperienceModal, setShowNewExperienceModal] = useState(false);

  const getsNewExperience = shouldGetNewExperience(targetLevel);
  const effectiveTierHistory = tierChanged ? {} : tierHistory;

  const computed = useLevelUpComputed({
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
  });

  const pointsRemaining = POINTS_PER_LEVEL - computed.pointsSpent;
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
  }, [
    setCurrentStep,
    setSelections,
    setFreeDomainCard,
    setNewExperienceName,
    setPendingOption,
    setShowFreeDomainCardModal,
    setShowNewExperienceModal,
  ]);

  const handleSelectOption = useMemo(
    () => createSelectOptionHandler(setSelections, setPendingOption),
    [setSelections, setPendingOption]
  );
  const handleRemoveSelection = useMemo(
    () => createRemoveSelectionHandler(setSelections),
    [setSelections]
  );
  const handleSubModalConfirm = useMemo(
    () =>
      createSubModalConfirmHandler(
        setSelections,
        setPendingOption,
        pendingOption
      ),
    [setSelections, setPendingOption, pendingOption]
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
    pointsSpent: computed.pointsSpent,
    pointsRemaining,
    pointsPerLevel: POINTS_PER_LEVEL,
    classPairs: computed.classPairs,
    allOwnedCardNames: computed.allOwnedCardNames,
    availableOptions: computed.availableOptions,
    availableTraitsForSelection: computed.availableTraitsForSelection,
    availableExperiencesForSelection: computed.availableExperiencesForSelection,
    canProceedToOptions,
    resetState,
    handleSelectOption,
    handleRemoveSelection,
    handleSubModalConfirm,
  };
}
