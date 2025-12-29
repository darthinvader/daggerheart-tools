import { ArrowRight, ChevronUp } from 'lucide-react';

import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { CharacterTier } from '@/lib/schemas/core';

import { AdvancementOptionsStep } from './advancement-options-step';
import { AutomaticBenefitsStep } from './automatic-benefits-step';
import { LevelUpSubModals } from './level-up-sub-modals';
import type { LevelUpSelection, LevelUpStep } from './types';
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
}

const TIER_NUMBERS: Record<string, number> = {
  '1': 1,
  '2-4': 2,
  '5-7': 3,
  '8-10': 4,
};

interface ModalHeaderProps {
  targetLevel: number;
  targetTier: CharacterTier;
  currentStep: LevelUpStep;
}

function ModalHeader({
  targetLevel,
  targetTier,
  currentStep,
}: ModalHeaderProps) {
  return (
    <DialogHeader className="shrink-0 border-b p-6 pb-4">
      <DialogTitle className="flex items-center gap-2">
        <ChevronUp className="size-5" />
        Level Up to {targetLevel}
      </DialogTitle>
      <DialogDescription>
        {currentStep === 'automatic-benefits'
          ? 'Complete your automatic level-up benefits'
          : `Choose your advancements for Tier ${TIER_NUMBERS[targetTier] ?? targetTier}`}
      </DialogDescription>
    </DialogHeader>
  );
}

interface ModalFooterProps {
  currentStep: LevelUpStep;
  setCurrentStep: (step: LevelUpStep) => void;
  canProceedToOptions: boolean;
  pointsRemaining: number;
  onClose: () => void;
  onConfirm: () => void;
}

function ModalFooter({
  currentStep,
  setCurrentStep,
  canProceedToOptions,
  pointsRemaining,
  onClose,
  onConfirm,
}: ModalFooterProps) {
  if (currentStep === 'automatic-benefits') {
    return (
      <DialogFooter className="shrink-0 border-t p-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => setCurrentStep('advancement-options')}
          disabled={!canProceedToOptions}
          className="gap-2"
        >
          Continue
          <ArrowRight className="size-4" />
        </Button>
      </DialogFooter>
    );
  }

  return (
    <DialogFooter className="shrink-0 border-t p-4">
      <Button
        variant="outline"
        onClick={() => setCurrentStep('automatic-benefits')}
      >
        Back
      </Button>
      <Button
        onClick={onConfirm}
        disabled={pointsRemaining !== 0}
        className="gap-2"
      >
        <ChevronUp className="size-4" />
        Confirm Level Up
      </Button>
    </DialogFooter>
  );
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
}

function buildLevelUpResult(
  state: ReturnType<typeof useLevelUpState>
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
  };
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
}: LevelUpModalProps) {
  const state = useLevelUpState({
    currentLevel,
    currentTier,
    currentTraits,
    currentExperiences,
    tierHistory,
    classSelection,
    ownedCardNames,
  });

  const handleConfirm = useCallback(() => {
    onConfirm(buildLevelUpResult(state));
    state.resetState();
  }, [state, onConfirm]);

  const handleClose = useCallback(() => {
    state.resetState();
    onClose();
  }, [onClose, state]);

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
        <DialogContent className="grid max-h-[90vh] grid-rows-[auto_1fr_auto] gap-0 overflow-hidden p-0 sm:max-w-150">
          <ModalHeader
            targetLevel={state.targetLevel}
            targetTier={state.targetTier}
            currentStep={state.currentStep}
          />

          {state.currentStep === 'automatic-benefits' && (
            <AutomaticBenefitsStep
              targetLevel={state.targetLevel}
              getsNewExperience={state.getsNewExperience}
              freeDomainCard={state.freeDomainCard}
              newExperienceName={state.newExperienceName}
              onSelectFreeDomainCard={() =>
                state.setShowFreeDomainCardModal(true)
              }
              onSelectNewExperience={() =>
                state.setShowNewExperienceModal(true)
              }
            />
          )}

          {state.currentStep === 'advancement-options' && (
            <AdvancementOptionsStep
              options={state.availableOptions}
              selections={state.selections}
              effectiveTierHistory={state.effectiveTierHistory}
              pointsRemaining={state.pointsRemaining}
              pointsPerLevel={state.pointsPerLevel}
              availableTraitsCount={state.availableTraitsForSelection.length}
              availableExperiencesCount={
                state.availableExperiencesForSelection.length
              }
              onSelect={state.handleSelectOption}
              onRemove={state.handleRemoveSelection}
            />
          )}

          <ModalFooter
            currentStep={state.currentStep}
            setCurrentStep={state.setCurrentStep}
            canProceedToOptions={state.canProceedToOptions}
            pointsRemaining={state.pointsRemaining}
            onClose={handleClose}
            onConfirm={handleConfirm}
          />
        </DialogContent>
      </Dialog>

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
      />
    </>
  );
}
