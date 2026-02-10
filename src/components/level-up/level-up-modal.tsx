import { useCallback, useState } from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { CharacterTier, CompanionTraining } from '@/lib/schemas/core';

import { useLevelUpNavigation } from './level-up-navigation';
import { LevelUpSubModals } from './level-up-sub-modals';
import { ModalFooter, ModalHeader } from './modal-parts';
import { StepContent } from './step-content';
import type { LevelUpSelection } from './types';
import { useLevelUpState } from './use-level-up-state';

export interface LevelUpResult {
  newLevel: number;
  newTier: CharacterTier;
  automaticBenefits: {
    experienceGained: boolean;
    experienceName?: string;
    proficiencyGained: boolean;
    traitsCleared: boolean;
    freeDomainCard?: string;
  };
  selections: LevelUpSelection[];
  companionTrainingSelection?: string;
  companionTrainingExperienceIndex?: number;
}

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: LevelUpResult) => void;
  currentLevel: number;
  currentTier: string;
  currentTraits: { name: string; marked: boolean }[];
  currentExperiences: { id: string; name: string; value: number }[];
  tierHistory: Record<string, number>;
  classSelection: ClassSelection | null;
  unlockedSubclassFeatures: Record<string, string[]>;
  ownedCardNames: string[];
  currentCompanionTraining?: CompanionTraining;
  hasCompanion?: boolean;
  companionName?: string;
  companionExperiences?: { name: string; bonus: number }[];
}

function buildLevelUpResult(
  state: ReturnType<typeof useLevelUpState>,
  companionTrainingSelection: string | null,
  companionTrainingExperienceIndex: number | null
): LevelUpResult {
  return {
    newLevel: state.targetLevel,
    newTier: state.targetTier,
    automaticBenefits: {
      experienceGained: state.getsNewExperience,
      experienceName: state.newExperienceName ?? undefined,
      proficiencyGained: state.getsNewExperience,
      traitsCleared: state.targetLevel === 5 || state.targetLevel === 8,
      freeDomainCard: state.freeDomainCard ?? undefined,
    },
    selections: state.selections,
    companionTrainingSelection: companionTrainingSelection ?? undefined,
    companionTrainingExperienceIndex:
      companionTrainingExperienceIndex ?? undefined,
  };
}

function LevelUpModalSubModals({
  state,
  unlockedSubclassFeatures,
  currentCompanionTraining,
  companionExperiences,
}: {
  state: ReturnType<typeof useLevelUpState>;
  unlockedSubclassFeatures: Record<string, string[]>;
  currentCompanionTraining?: CompanionTraining;
  companionExperiences: { name: string; bonus: number }[];
}) {
  return (
    <LevelUpSubModals
      pendingOption={state.pendingOption}
      onPendingClose={() => state.setPendingOption(null)}
      onSubModalConfirm={state.handleSubModalConfirm}
      showFreeDomainCardModal={state.showFreeDomainCardModal}
      onFreeDomainCardClose={() => state.setShowFreeDomainCardModal(false)}
      onFreeDomainCardConfirm={cardName => {
        state.setFreeDomainCard(cardName);
        state.setShowFreeDomainCardModal(false);
      }}
      showNewExperienceModal={state.showNewExperienceModal}
      onNewExperienceClose={() => state.setShowNewExperienceModal(false)}
      onNewExperienceConfirm={name => {
        state.setNewExperienceName(name);
        state.setShowNewExperienceModal(false);
      }}
      targetLevel={state.targetLevel}
      targetTier={state.targetTier}
      allOwnedCardNames={state.allOwnedCardNames}
      availableTraits={state.availableTraitsForSelection}
      availableExperiences={state.availableExperiencesForSelection}
      classPairs={state.classPairs}
      unlockedSubclassFeatures={unlockedSubclassFeatures}
      currentCompanionTraining={currentCompanionTraining}
      companionExperiences={companionExperiences}
    />
  );
}

export function LevelUpModal({
  isOpen,
  onClose,
  onConfirm,
  currentLevel,
  currentTier,
  currentTraits,
  currentExperiences,
  tierHistory,
  classSelection,
  unlockedSubclassFeatures,
  ownedCardNames,
  currentCompanionTraining,
  hasCompanion = false,
  companionName = '',
  companionExperiences = [],
}: LevelUpModalProps) {
  const [selectedCompanionTraining, setSelectedCompanionTraining] = useState<
    string | null
  >(null);
  const [
    selectedCompanionExperienceIndex,
    setSelectedCompanionExperienceIndex,
  ] = useState<number | null>(null);
  const resetCompanionTrainingSelection = useCallback(() => {
    setSelectedCompanionTraining(null);
    setSelectedCompanionExperienceIndex(null);
  }, []);

  const handleSelectCompanionTraining = useCallback(
    (training: string | null) => {
      setSelectedCompanionTraining(training);
      if (training !== 'intelligent') {
        setSelectedCompanionExperienceIndex(null);
      }
    },
    []
  );

  const state = useLevelUpState({
    currentLevel,
    currentTier,
    currentTraits,
    currentExperiences,
    tierHistory,
    classSelection,
    ownedCardNames,
  });

  const { handleConfirm, handleClose, handleNext, handleBack } =
    useLevelUpNavigation({
      state,
      hasCompanion,
      onClose,
      onConfirmResult: () =>
        onConfirm(
          buildLevelUpResult(
            state,
            selectedCompanionTraining,
            selectedCompanionExperienceIndex
          )
        ),
      resetCompanionTraining: resetCompanionTrainingSelection,
    });

  const requiresCompanionExperience =
    selectedCompanionTraining === 'intelligent' &&
    companionExperiences.length > 0;
  const canProceedFromCompanion =
    !requiresCompanionExperience || selectedCompanionExperienceIndex !== null;

  const mainDialogOpen =
    isOpen &&
    !state.pendingOption &&
    !state.showFreeDomainCardModal &&
    !state.showNewExperienceModal;

  return (
    <>
      <Dialog
        open={mainDialogOpen}
        onOpenChange={open => !open && handleClose()}
      >
        <DialogContent
          aria-describedby={undefined}
          className="grid h-full w-full grid-rows-[auto_1fr_auto] gap-0 overflow-hidden p-0 sm:h-auto sm:max-h-[90vh] sm:w-[98vw] sm:max-w-4xl"
        >
          <ModalHeader
            targetLevel={state.targetLevel}
            targetTier={state.targetTier}
            currentStep={state.currentStep}
            hasCompanion={hasCompanion}
          />

          <StepContent
            currentStep={state.currentStep}
            state={state}
            companionName={companionName}
            currentCompanionTraining={currentCompanionTraining}
            selectedCompanionTraining={selectedCompanionTraining}
            onSelectCompanionTraining={handleSelectCompanionTraining}
            companionExperiences={companionExperiences}
            selectedCompanionExperienceIndex={selectedCompanionExperienceIndex}
            onSelectCompanionExperienceIndex={
              setSelectedCompanionExperienceIndex
            }
          />

          <ModalFooter
            currentStep={state.currentStep}
            canProceedFromAutomatic={state.canProceedToOptions}
            canProceedFromCompanion={canProceedFromCompanion}
            pointsRemaining={state.pointsRemaining}
            onClose={handleClose}
            onConfirm={handleConfirm}
            onNext={handleNext}
            onBack={handleBack}
          />
        </DialogContent>
      </Dialog>

      <LevelUpModalSubModals
        state={state}
        unlockedSubclassFeatures={unlockedSubclassFeatures}
        currentCompanionTraining={currentCompanionTraining}
        companionExperiences={companionExperiences}
      />
    </>
  );
}
