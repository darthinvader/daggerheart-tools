import type { CompanionTraining } from '@/lib/schemas/core';

import { AdvancementOptionsStep } from './advancement-options-step';
import { AutomaticBenefitsStep } from './automatic-benefits-step';
import { CompanionBenefitsStep } from './companion-benefits-step';
import type { LevelUpStep } from './types';
import type { useLevelUpState } from './use-level-up-state';

type LevelUpStateReturn = ReturnType<typeof useLevelUpState>;

interface StepContentProps {
  currentStep: LevelUpStep;
  state: LevelUpStateReturn;
  companionName: string;
  currentCompanionTraining?: CompanionTraining;
  selectedCompanionTraining: string | null;
  onSelectCompanionTraining: (training: string | null) => void;
}

export function StepContent({
  currentStep,
  state,
  companionName,
  currentCompanionTraining,
  selectedCompanionTraining,
  onSelectCompanionTraining,
}: StepContentProps) {
  switch (currentStep) {
    case 'automatic-benefits':
      return (
        <AutomaticBenefitsStep
          targetLevel={state.targetLevel}
          getsNewExperience={state.getsNewExperience}
          freeDomainCard={state.freeDomainCard}
          newExperienceName={state.newExperienceName}
          onSelectFreeDomainCard={() => state.setShowFreeDomainCardModal(true)}
          onSelectNewExperience={() => state.setShowNewExperienceModal(true)}
        />
      );
    case 'companion-benefits':
      return (
        <CompanionBenefitsStep
          companionName={companionName}
          currentTraining={currentCompanionTraining}
          selectedTraining={selectedCompanionTraining}
          onSelectTraining={onSelectCompanionTraining}
        />
      );
    case 'advancement-options':
      return (
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
      );
  }
}
