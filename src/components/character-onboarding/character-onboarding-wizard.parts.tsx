/* eslint-disable react-refresh/only-export-components */
import { Check, Circle } from 'lucide-react';
import type { ChangeEvent, MutableRefObject, ReactNode } from 'react';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AncestrySelector } from '@/components/ancestry-selector';
import { ClassSelector } from '@/components/class-selector';
import { CommunitySelector } from '@/components/community-selector';
import {
  type CompanionState,
  DEFAULT_COMPANION_STATE,
} from '@/components/companion';
import {
  COMPANION_ATTACK_SUGGESTIONS,
  COMPANION_TYPE_SUGGESTIONS,
} from '@/components/companion/constants';
import { EXAMPLE_EXPERIENCES } from '@/components/companion/types';
import type { DemoHandlers, DemoState } from '@/components/demo/demo-types';
import { EquipmentDisplay } from '@/components/equipment';
import { ExperiencesCreationEditor } from '@/components/experiences';
import { IdentityForm } from '@/components/identity-editor';
import { LoadoutSelector } from '@/components/loadout-selector';
import { TraitAllocationEditor } from '@/components/traits';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type ClassDraft,
  type ClassSelection,
  DEFAULT_CLASS_DRAFT,
} from '@/lib/schemas/class-selection';
import { cn } from '@/lib/utils';

import {
  getFirstIncompleteStepId,
  getOnboardingCompletion,
  type OnboardingStepId,
} from './onboarding-utils';

export interface WizardStep {
  id: OnboardingStepId;
  title: string;
  description: string;
  content: ReactNode;
}

const STEP_HINTS: Record<OnboardingStepId, string> = {
  class: 'Choose a class and subclass to continue.',
  companion:
    'Enter a name, type, two experiences, and an attack name for your companion.',
  ancestry: 'Select an ancestry (standard, mixed, or homebrew).',
  community: 'Select a community (standard or homebrew).',
  traits: 'Assign the required trait modifiers.',
  identity: 'Optional — you can skip this step.',
  experiences: 'Add exactly two experiences at +2.',
  equipment: 'Select your starting weapons and armor.',
  domains: 'Select two level 1 domain cards.',
};

function ClassStep({
  classDraft,
  handlers,
  classCompleteRef,
  setClassCanProceed,
}: {
  classDraft: ClassDraft;
  handlers: DemoHandlers;
  classCompleteRef: MutableRefObject<{
    complete: () => ClassSelection | null;
  } | null>;
  setClassCanProceed: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <ClassSelector
      value={classDraft}
      onComplete={handlers.setClassSelection}
      hideCompleteButton
      completeRef={classCompleteRef}
      onValidityChange={setClassCanProceed}
    />
  );
}

function getCompanionState(
  companion: CompanionState | null | undefined
): CompanionState {
  return companion ?? DEFAULT_COMPANION_STATE;
}

function updateCompanionState(
  companion: CompanionState | null | undefined,
  update: Partial<CompanionState>
): CompanionState {
  return { ...getCompanionState(companion), ...update };
}

function updateCompanionExperience(
  companion: CompanionState | null | undefined,
  index: number,
  name: string
): CompanionState {
  const base = getCompanionState(companion);
  const experiences = base.experiences.map((experience, experienceIndex) =>
    experienceIndex === index ? { ...experience, name } : experience
  );
  return { ...base, experiences };
}

function CompanionStep({
  state,
  handlers,
}: {
  state: DemoState;
  handlers: DemoHandlers;
}) {
  const handleCompanionUpdate = useCallback(
    (next: CompanionState) => {
      handlers.setCompanion(next);
      handlers.setCompanionEnabled(true);
    },
    [handlers]
  );

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleCompanionUpdate(
        updateCompanionState(state.companion, { name: event.target.value })
      );
    },
    [handleCompanionUpdate, state.companion]
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      handleCompanionUpdate(
        updateCompanionState(state.companion, { type: value })
      );
    },
    [handleCompanionUpdate, state.companion]
  );

  const handleExperienceOneChange = useCallback(
    (value: string) => {
      handleCompanionUpdate(
        updateCompanionExperience(state.companion, 0, value)
      );
    },
    [handleCompanionUpdate, state.companion]
  );

  const handleExperienceTwoChange = useCallback(
    (value: string) => {
      handleCompanionUpdate(
        updateCompanionExperience(state.companion, 1, value)
      );
    },
    [handleCompanionUpdate, state.companion]
  );

  const handleAttackChange = useCallback(
    (value: string) => {
      handleCompanionUpdate(
        updateCompanionState(state.companion, { standardAttack: value })
      );
    },
    [handleCompanionUpdate, state.companion]
  );

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Beastbound Rangers start with an animal companion. Set their name, type,
        and key details.
      </p>
      <Input
        placeholder="Companion name"
        value={state.companion?.name ?? ''}
        onChange={handleNameChange}
      />
      <Select
        value={state.companion?.type ?? ''}
        onValueChange={handleTypeChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a creature type" />
        </SelectTrigger>
        <SelectContent>
          {COMPANION_TYPE_SUGGESTIONS.map(type => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          value={state.companion?.experiences?.[0]?.name ?? ''}
          onValueChange={handleExperienceOneChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Companion experience #1" />
          </SelectTrigger>
          <SelectContent>
            {EXAMPLE_EXPERIENCES.map(exp => (
              <SelectItem key={exp} value={exp}>
                {exp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={state.companion?.experiences?.[1]?.name ?? ''}
          onValueChange={handleExperienceTwoChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Companion experience #2" />
          </SelectTrigger>
          <SelectContent>
            {EXAMPLE_EXPERIENCES.map(exp => (
              <SelectItem key={exp} value={exp}>
                {exp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Select
        value={state.companion?.standardAttack ?? ''}
        onValueChange={handleAttackChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an attack" />
        </SelectTrigger>
        <SelectContent>
          {COMPANION_ATTACK_SUGGESTIONS.map(attack => (
            <SelectItem key={attack} value={attack}>
              {attack}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function AncestryStep({
  state,
  handlers,
}: {
  state: DemoState;
  handlers: DemoHandlers;
}) {
  return (
    <AncestrySelector value={state.ancestry} onChange={handlers.setAncestry} />
  );
}

function CommunityStep({
  state,
  handlers,
}: {
  state: DemoState;
  handlers: DemoHandlers;
}) {
  return (
    <CommunitySelector
      value={state.community}
      onChange={handlers.setCommunity}
    />
  );
}

function TraitsStep({
  state,
  handlers,
}: {
  state: DemoState;
  handlers: DemoHandlers;
}) {
  return (
    <TraitAllocationEditor
      traits={state.traits}
      onChange={handlers.setTraits}
      className={state.classSelection?.className}
    />
  );
}

function IdentityStep({
  state,
  handlers,
  identityFormRef,
}: {
  state: DemoState;
  handlers: DemoHandlers;
  identityFormRef: MutableRefObject<{ submit: () => void } | null>;
}) {
  return (
    <IdentityForm
      key={state.identity.name || 'identity'}
      defaultValues={state.identity}
      onSubmit={handlers.setIdentity}
      hideButtons
      formRef={identityFormRef}
    />
  );
}

function ExperiencesStep({
  state,
  handlers,
}: {
  state: DemoState;
  handlers: DemoHandlers;
}) {
  return (
    <ExperiencesCreationEditor
      experiences={state.experiences}
      onChange={handlers.setExperiences}
    />
  );
}

function EquipmentStep({
  state,
  handlers,
}: {
  state: DemoState;
  handlers: DemoHandlers;
}) {
  return (
    <EquipmentDisplay
      equipment={state.equipment}
      onChange={handlers.setEquipment}
      allowedTiers={['1']}
    />
  );
}

function DomainsStep({
  state,
  handlers,
}: {
  state: DemoState;
  handlers: DemoHandlers;
}) {
  return (
    <LoadoutSelector
      value={state.loadout}
      onChange={handlers.setLoadout}
      classDomains={state.classSelection?.domains ?? ['Arcana', 'Codex']}
      tier={state.progression.currentTier}
      hideHeader
    />
  );
}

export function buildWizardSteps({
  classDraft,
  handlers,
  isBeastbound,
  state,
  classCompleteRef,
  setClassCanProceed,
  identityFormRef,
}: {
  classDraft: ClassDraft;
  handlers: DemoHandlers;
  isBeastbound: boolean;
  state: DemoState;
  classCompleteRef: MutableRefObject<{
    complete: () => ClassSelection | null;
  } | null>;
  setClassCanProceed: Dispatch<SetStateAction<boolean>>;
  identityFormRef: MutableRefObject<{ submit: () => void } | null>;
}): WizardStep[] {
  const baseSteps: WizardStep[] = [
    {
      id: 'class',
      title: 'Choose Class & Subclass',
      description:
        'Select a class and subclass to define your character’s core abilities.',
      content: (
        <ClassStep
          classDraft={classDraft}
          handlers={handlers}
          classCompleteRef={classCompleteRef}
          setClassCanProceed={setClassCanProceed}
        />
      ),
    },
    {
      id: 'companion',
      title: 'Name Your Companion',
      description: 'Give your Beastbound companion a name.',
      content: <CompanionStep state={state} handlers={handlers} />,
    },
    {
      id: 'ancestry',
      title: 'Choose Ancestry',
      description:
        'Select your ancestry or craft a mixed or homebrew heritage.',
      content: <AncestryStep state={state} handlers={handlers} />,
    },
    {
      id: 'community',
      title: 'Choose Community',
      description:
        'Select the community that shaped your character’s upbringing.',
      content: <CommunityStep state={state} handlers={handlers} />,
    },
    {
      id: 'traits',
      title: 'Assign Traits',
      description:
        'Distribute your trait modifiers. At creation, assign +2, +1, +1, +0, +0, and -1.',
      content: <TraitsStep state={state} handlers={handlers} />,
    },
    {
      id: 'identity',
      title: 'Identity & Background',
      description:
        'Add your name, background, and any connections you already know.',
      content: (
        <IdentityStep
          state={state}
          handlers={handlers}
          identityFormRef={identityFormRef}
        />
      ),
    },
    {
      id: 'experiences',
      title: 'Create Experiences',
      description: 'Add at least two experiences that start at +2 each.',
      content: <ExperiencesStep state={state} handlers={handlers} />,
    },
    {
      id: 'equipment',
      title: 'Starting Equipment',
      description:
        'Choose tier 1 weapons and armor, then add your starting inventory items.',
      content: <EquipmentStep state={state} handlers={handlers} />,
    },
    {
      id: 'domains',
      title: 'Choose Domain Cards',
      description:
        'Select at least two level 1 domain cards from your class domains.',
      content: <DomainsStep state={state} handlers={handlers} />,
    },
  ];

  return isBeastbound
    ? baseSteps
    : baseSteps.filter(step => step.id !== 'companion');
}

export function WizardHeader({
  currentStep,
  stepIndex,
  totalSteps,
  isComplete,
}: {
  currentStep: WizardStep;
  stepIndex: number;
  totalSteps: number;
  isComplete: boolean;
}) {
  return (
    <DialogHeader className="border-b p-3 sm:p-6">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <DialogTitle className="text-base sm:text-lg">
          New Character Setup
        </DialogTitle>
        <Badge variant="secondary" className="text-xs">
          Step {stepIndex + 1} of {totalSteps}
        </Badge>
        {isComplete && (
          <Badge variant="default" className="text-xs">
            Completed
          </Badge>
        )}
      </div>
      <DialogDescription className="mt-1 text-xs sm:mt-2 sm:text-sm">
        {currentStep.description}
      </DialogDescription>
    </DialogHeader>
  );
}

export function WizardBody({
  currentStep,
  isComplete,
}: {
  currentStep: WizardStep;
  isComplete: boolean;
}) {
  return (
    <div className="min-h-0 overflow-y-auto p-3 sm:p-6">
      <div className="mb-3 space-y-0.5 sm:mb-4 sm:space-y-1">
        <h2 className="text-base font-semibold sm:text-lg">
          {currentStep.title}
        </h2>
        {!isComplete && currentStep.id !== 'identity' && (
          <p className="text-muted-foreground text-xs sm:text-sm">
            This step is required before finishing.
          </p>
        )}
      </div>
      {currentStep.content}
    </div>
  );
}

export function WizardSidebar({
  steps,
  stepIndex,
  completion,
  onGoToStep,
}: {
  steps: WizardStep[];
  stepIndex: number;
  completion: Record<OnboardingStepId, boolean>;
  onGoToStep: (index: number) => void;
}) {
  return (
    <ScrollArea className="bg-muted/30 hidden w-80 border-l md:block">
      <div className="space-y-1 p-4">
        <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
          Progress
        </h3>
        {steps.map((step, index) => {
          const isComplete = completion[step.id];
          const isCurrent = index === stepIndex;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onGoToStep(index)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                isCurrent && 'bg-primary/10 text-primary font-medium',
                !isCurrent && 'hover:bg-muted'
              )}
            >
              {isComplete ? (
                <Check className="h-4 w-4 shrink-0 text-green-500" />
              ) : (
                <Circle className="text-muted-foreground h-4 w-4 shrink-0" />
              )}
              <span className="truncate">{step.title}</span>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export function WizardFooter({
  stepIndex,
  stepError,
  isLastStep,
  canProceed,
  allComplete,
  onBack,
  onSkipWizard,
  onSkipStep,
  onNext,
  onFinish,
}: {
  stepIndex: number;
  stepError: string | null;
  isLastStep: boolean;
  canProceed: boolean;
  allComplete: boolean;
  onBack: () => void;
  onSkipWizard: () => void;
  onSkipStep: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  return (
    <DialogFooter className="border-t p-2 sm:p-4">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            onClick={onSkipWizard}
            size="sm"
            className="text-xs sm:text-sm"
          >
            Skip Setup
          </Button>
        </div>
        <div className="text-destructive text-xs sm:text-sm">
          {stepError ?? ''}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          {stepIndex > 0 && (
            <Button
              variant="outline"
              onClick={onBack}
              size="sm"
              className="text-xs sm:text-sm"
            >
              Back
            </Button>
          )}
          {!isLastStep && (
            <Button
              variant="outline"
              onClick={onSkipStep}
              size="sm"
              className="text-xs sm:text-sm"
            >
              Skip Step
            </Button>
          )}
          {!isLastStep && (
            <Button
              onClick={onNext}
              disabled={!canProceed}
              size="sm"
              className="text-xs sm:text-sm"
            >
              Continue
            </Button>
          )}
          {isLastStep && !allComplete && (
            <Button
              onClick={onNext}
              disabled={!canProceed}
              size="sm"
              className="text-xs sm:text-sm"
            >
              Mark Complete
            </Button>
          )}
          {allComplete && (
            <Button onClick={onFinish} size="sm" className="text-xs sm:text-sm">
              Apply Character
            </Button>
          )}
        </div>
      </div>
    </DialogFooter>
  );
}

function resolveNextStep({
  currentStepId,
  completion,
  isLastStep,
  classCompleteRef,
}: {
  currentStepId: OnboardingStepId;
  completion: Record<OnboardingStepId, boolean>;
  isLastStep: boolean;
  classCompleteRef: MutableRefObject<{
    complete: () => ClassSelection | null;
  } | null>;
}) {
  if (currentStepId === 'class') {
    const selection = classCompleteRef.current?.complete() ?? null;
    return selection
      ? { selection, shouldAdvance: !isLastStep, shouldFinish: isLastStep }
      : { error: STEP_HINTS.class };
  }

  if (!completion[currentStepId]) {
    return {
      error: STEP_HINTS[currentStepId] ?? 'Complete this step to continue.',
    };
  }

  if (isLastStep) {
    return { shouldFinish: true };
  }

  return { shouldAdvance: true };
}

export function useWizardState({
  state,
  handlers,
  onFinish,
}: {
  state: DemoState;
  handlers: DemoHandlers;
  onFinish: () => void;
}) {
  const classCompleteRef = useRef<{
    complete: () => ClassSelection | null;
  } | null>(null);
  const identityFormRef = useRef<{ submit: () => void } | null>(null);
  const [classCanProceed, setClassCanProceed] = useState(false);
  const [manualStepIndex, setManualStepIndex] = useState<number | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  const classDraft = useMemo<ClassDraft>(() => {
    if (!state.classSelection) {
      return DEFAULT_CLASS_DRAFT;
    }
    return {
      mode: state.classSelection.isHomebrew ? 'homebrew' : 'standard',
      className: state.classSelection.className ?? undefined,
      subclassName: state.classSelection.subclassName ?? undefined,
      homebrewClass: state.classSelection.homebrewClass ?? undefined,
    };
  }, [state.classSelection]);

  const isBeastbound = useMemo(() => {
    const className = state.classSelection?.className?.toLowerCase() ?? '';
    const subclassName =
      state.classSelection?.subclassName?.toLowerCase() ?? '';
    return className.includes('ranger') && subclassName.includes('beastbound');
  }, [state.classSelection]);

  const completion = useMemo(() => getOnboardingCompletion(state), [state]);
  const firstIncomplete = useMemo(
    () => getFirstIncompleteStepId(state),
    [state]
  );
  const steps = useMemo<WizardStep[]>(
    () =>
      // eslint-disable-next-line react-hooks/refs
      buildWizardSteps({
        classDraft,
        handlers,
        state,
        identityFormRef,
        classCompleteRef,
        setClassCanProceed,
        isBeastbound,
      }),
    [
      classDraft,
      handlers,
      state,
      identityFormRef,
      classCompleteRef,
      setClassCanProceed,
      isBeastbound,
    ]
  );

  const stepIndex = useMemo(() => {
    if (manualStepIndex !== null) {
      return manualStepIndex;
    }
    const firstIndex = steps.findIndex(step => step.id === firstIncomplete);
    return firstIndex >= 0 ? firstIndex : 0;
  }, [manualStepIndex, steps, firstIncomplete]);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const canProceed =
    currentStep.id === 'class' ? classCanProceed : completion[currentStep.id];

  const handleBack = useCallback(() => {
    setManualStepIndex(Math.max(0, stepIndex - 1));
  }, [stepIndex]);

  const handleNext = useCallback(() => {
    setStepError(null);
    const nextStep = resolveNextStep({
      currentStepId: currentStep.id,
      completion,
      isLastStep,
      classCompleteRef,
    });

    if (nextStep.selection) {
      handlers.setClassSelection(nextStep.selection);
    }

    if (currentStep.id === 'identity') {
      identityFormRef.current?.submit();
    }

    if (nextStep.error) {
      setStepError(nextStep.error);
      return;
    }

    if (nextStep.shouldFinish) {
      onFinish();
      return;
    }

    if (nextStep.shouldAdvance) {
      setManualStepIndex(Math.min(steps.length - 1, stepIndex + 1));
    }
  }, [
    completion,
    currentStep.id,
    handlers,
    isLastStep,
    onFinish,
    stepIndex,
    steps.length,
  ]);

  const handleSkipStep = useCallback(() => {
    if (isLastStep) {
      return;
    }
    setManualStepIndex(Math.min(steps.length - 1, stepIndex + 1));
  }, [isLastStep, stepIndex, steps.length]);

  const goToStep = useCallback(
    (index: number) => {
      setManualStepIndex(Math.max(0, Math.min(steps.length - 1, index)));
    },
    [steps.length]
  );

  const resetStepIndex = useCallback(() => {
    setManualStepIndex(null);
  }, []);

  const allComplete = useMemo(
    () => steps.every(step => completion[step.id]),
    [steps, completion]
  );

  return {
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
  };
}
