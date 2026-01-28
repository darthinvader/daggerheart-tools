import type { DemoHandlers, DemoState } from '@/components/demo/demo-types';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import {
  useWizardState,
  WizardBody,
  WizardFooter,
  WizardHeader,
  WizardSidebar,
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
    allComplete,
    handleBack,
    handleNext,
    handleSkipStep,
    goToStep,
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
      <DialogContent
        className="grid max-h-[95vh] w-[98vw] max-w-[98vw] grid-cols-1 grid-rows-[auto_1fr_auto] gap-0 overflow-hidden p-0 sm:max-h-[90vh] sm:max-w-[95vw] md:grid-cols-[1fr_auto] lg:max-w-[1400px]"
        onInteractOutside={e => e.preventDefault()}
      >
        <WizardHeader
          currentStep={currentStep}
          stepIndex={stepIndex}
          totalSteps={steps.length}
          isComplete={completion[currentStep.id]}
        />
        <div className="row-span-2 row-start-1 hidden md:col-start-2 md:block">
          <WizardSidebar
            steps={steps}
            stepIndex={stepIndex}
            completion={completion}
            onGoToStep={goToStep}
          />
        </div>
        <WizardBody
          currentStep={currentStep}
          isComplete={completion[currentStep.id]}
        />
        <WizardFooter
          stepIndex={stepIndex}
          stepError={stepError}
          isLastStep={isLastStep}
          canProceed={canProceed}
          allComplete={allComplete}
          onBack={handleBack}
          onSkipWizard={onSkipWizard}
          onSkipStep={handleSkipStep}
          onNext={handleNext}
          onFinish={onFinish}
        />
      </DialogContent>
    </Dialog>
  );
}
