import type { DemoHandlers, DemoState } from '@/components/demo/demo-types';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import {
  useWizardState,
  WizardBody,
  WizardFooter,
  WizardHeader,
} from './character-onboarding-wizard.parts';

interface CharacterOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSkipWizard: () => void;
  onFinish: () => void;
  state: DemoState;
  handlers: DemoHandlers;
}

export function CharacterOnboardingWizard({
  isOpen,
  onClose,
  onSkipWizard,
  onFinish,
  state,
  handlers,
}: CharacterOnboardingWizardProps) {
  const {
    completion,
    currentStep,
    stepIndex,
    stepError,
    isLastStep,
    canProceed,
    steps,
    handleBack,
    handleNext,
    handleSkipStep,
    resetStepIndex,
  } = useWizardState({ state, handlers, onFinish });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          resetStepIndex();
          onClose();
          onSkipWizard();
        }
      }}
    >
      <DialogContent className="grid max-h-[90vh] w-[98vw] max-w-5xl grid-rows-[auto_1fr_auto] gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <WizardHeader
          currentStep={currentStep}
          stepIndex={stepIndex}
          totalSteps={steps.length}
          isComplete={completion[currentStep.id]}
        />
        <WizardBody
          currentStep={currentStep}
          isComplete={completion[currentStep.id]}
        />
        <WizardFooter
          stepIndex={stepIndex}
          stepError={stepError}
          isLastStep={isLastStep}
          canProceed={canProceed}
          onBack={handleBack}
          onSkipWizard={onSkipWizard}
          onSkipStep={handleSkipStep}
          onNext={handleNext}
        />
      </DialogContent>
    </Dialog>
  );
}
