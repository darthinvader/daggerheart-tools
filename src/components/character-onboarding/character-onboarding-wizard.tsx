import { type ReactNode, useCallback, useMemo, useRef, useState } from 'react';

import { AncestrySelector } from '@/components/ancestry-selector';
import { ClassSelector } from '@/components/class-selector';
import { CommunitySelector } from '@/components/community-selector';
import { DEFAULT_COMPANION_STATE } from '@/components/companion';
import type { DemoHandlers, DemoState } from '@/components/demo/demo-types';
import { EquipmentDisplay } from '@/components/equipment';
import { ExperiencesCreationEditor } from '@/components/experiences';
import { IdentityForm } from '@/components/identity-editor';
import { InventoryDisplay } from '@/components/inventory';
import { LoadoutSelector } from '@/components/loadout-selector';
import { TraitAllocationEditor } from '@/components/traits';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { ClassDraft, ClassSelection } from '@/lib/schemas/class-selection';

import {
  getFirstIncompleteStepId,
  getOnboardingCompletion,
  ONBOARDING_STEP_ORDER,
  type OnboardingStepId,
} from './onboarding-utils';

interface CharacterOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSkipWizard: () => void;
  onFinish: () => void;
  state: DemoState;
  handlers: DemoHandlers;
}

interface WizardStep {
  id: OnboardingStepId;
  title: string;
  description: string;
  content: ReactNode;
}

export function CharacterOnboardingWizard({
  isOpen,
  onClose,
  onSkipWizard,
  onFinish,
  state,
  handlers,
}: CharacterOnboardingWizardProps) {
  const completion = useMemo(() => getOnboardingCompletion(state), [state]);
  const firstIncomplete = useMemo(
    () => getFirstIncompleteStepId(state),
    [state]
  );
  const initialStepIndex = useMemo(() => {
    const stepId = firstIncomplete ?? 'class';
    const nextIndex = ONBOARDING_STEP_ORDER.indexOf(stepId);
    return Math.max(0, nextIndex);
  }, [firstIncomplete]);
  const [manualStepIndex, setManualStepIndex] = useState<number | null>(null);
  const stepIndex = manualStepIndex ?? initialStepIndex;
  const [stepError, setStepError] = useState<string | null>(null);
  const [classCanProceed, setClassCanProceed] = useState(false);

  const classCompleteRef = useRef<{
    complete: () => ClassSelection | null;
  } | null>(null);
  const identityFormRef = useRef<{ submit: () => void } | null>(null);

  const classDraft = useMemo<ClassDraft>(
    () => ({
      mode: state.classSelection?.mode ?? 'standard',
      className: state.classSelection?.className,
      subclassName: state.classSelection?.subclassName,
      homebrewClass: state.classSelection?.homebrewClass,
    }),
    [state.classSelection]
  );

  const isBeastbound = useMemo(
    () =>
      state.classSelection?.className?.toLowerCase().includes('ranger') &&
      state.classSelection?.subclassName?.toLowerCase().includes('beastbound'),
    [state.classSelection]
  );

  const steps = useMemo<WizardStep[]>(() => {
    const baseSteps: WizardStep[] = [
      {
        id: 'class',
        title: 'Choose Class & Subclass',
        description:
          'Select a class and subclass to define your character’s core abilities.',
        content: (
          <ClassSelector
            value={classDraft}
            onComplete={handlers.setClassSelection}
            hideCompleteButton
            completeRef={classCompleteRef}
            onValidityChange={setClassCanProceed}
          />
        ),
      },
      {
        id: 'companion',
        title: 'Name Your Companion',
        description: 'Give your Beastbound companion a name.',
        content: (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Beastbound Rangers start with an animal companion. For now, just
              name them.
            </p>
            <Input
              placeholder="Companion name"
              value={state.companion?.name ?? ''}
              onChange={event => {
                const name = event.target.value;
                handlers.setCompanion({
                  ...(state.companion ?? DEFAULT_COMPANION_STATE),
                  name,
                });
                handlers.setCompanionEnabled(true);
              }}
            />
            <Input
              placeholder="Creature type (e.g., Wolf, Hawk)"
              value={state.companion?.type ?? ''}
              onChange={event => {
                const type = event.target.value;
                handlers.setCompanion({
                  ...(state.companion ?? DEFAULT_COMPANION_STATE),
                  type,
                });
                handlers.setCompanionEnabled(true);
              }}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Companion experience #1"
                value={state.companion?.experiences?.[0]?.name ?? ''}
                onChange={event => {
                  const exp1 = event.target.value;
                  const companion = state.companion ?? DEFAULT_COMPANION_STATE;
                  const experiences = companion.experiences.map((exp, index) =>
                    index === 0 ? { ...exp, name: exp1 } : exp
                  );
                  handlers.setCompanion({ ...companion, experiences });
                  handlers.setCompanionEnabled(true);
                }}
              />
              <Input
                placeholder="Companion experience #2"
                value={state.companion?.experiences?.[1]?.name ?? ''}
                onChange={event => {
                  const exp2 = event.target.value;
                  const companion = state.companion ?? DEFAULT_COMPANION_STATE;
                  const experiences = companion.experiences.map((exp, index) =>
                    index === 1 ? { ...exp, name: exp2 } : exp
                  );
                  handlers.setCompanion({ ...companion, experiences });
                  handlers.setCompanionEnabled(true);
                }}
              />
            </div>
            <Input
              placeholder="Attack name (e.g., Bite)"
              value={state.companion?.standardAttack ?? ''}
              onChange={event => {
                const standardAttack = event.target.value;
                handlers.setCompanion({
                  ...(state.companion ?? DEFAULT_COMPANION_STATE),
                  standardAttack,
                });
                handlers.setCompanionEnabled(true);
              }}
            />
          </div>
        ),
      },
      {
        id: 'ancestry',
        title: 'Choose Ancestry',
        description:
          'Select your ancestry or craft a mixed or homebrew heritage.',
        content: (
          <AncestrySelector
            value={state.ancestry}
            onChange={handlers.setAncestry}
          />
        ),
      },
      {
        id: 'community',
        title: 'Choose Community',
        description:
          'Select the community that shaped your character’s upbringing.',
        content: (
          <CommunitySelector
            value={state.community}
            onChange={handlers.setCommunity}
          />
        ),
      },
      {
        id: 'traits',
        title: 'Assign Traits',
        description:
          'Distribute your trait modifiers. At creation, assign +2, +1, +1, +0, +0, and -1.',
        content: (
          <TraitAllocationEditor
            traits={state.traits}
            onChange={handlers.setTraits}
            className={state.classSelection?.className}
          />
        ),
      },
      {
        id: 'identity',
        title: 'Identity & Background',
        description:
          'Add your name, background, and any connections you already know.',
        content: (
          <IdentityForm
            key={state.identity.name || 'identity'}
            defaultValues={state.identity}
            onSubmit={handlers.setIdentity}
            hideButtons
            formRef={identityFormRef}
          />
        ),
      },
      {
        id: 'experiences',
        title: 'Create Experiences',
        description: 'Add at least two experiences that start at +2 each.',
        content: (
          <ExperiencesCreationEditor
            experiences={state.experiences}
            onChange={handlers.setExperiences}
          />
        ),
      },
      {
        id: 'equipment',
        title: 'Starting Equipment',
        description:
          'Choose tier 1 weapons and armor, then add your starting inventory items.',
        content: (
          <div className="space-y-6">
            <EquipmentDisplay
              equipment={state.equipment}
              onChange={handlers.setEquipment}
              allowedTiers={['1']}
            />
            <Separator />
            <InventoryDisplay
              inventory={state.inventory}
              onChange={handlers.setInventory}
              allowedTiers={['1']}
            />
          </div>
        ),
      },
      {
        id: 'domains',
        title: 'Choose Domain Cards',
        description:
          'Select at least two level 1 domain cards from your class domains.',
        content: (
          <LoadoutSelector
            value={state.loadout}
            onChange={handlers.setLoadout}
            classDomains={state.classSelection?.domains ?? ['Arcana', 'Codex']}
            tier={state.progression.currentTier}
            hideHeader
          />
        ),
      },
    ];

    return isBeastbound
      ? baseSteps
      : baseSteps.filter(step => step.id !== 'companion');
  }, [
    classDraft,
    handlers,
    isBeastbound,
    state.ancestry,
    state.classSelection?.className,
    state.community,
    state.companion,
    state.traits,
    state.identity,
    state.experiences,
    state.equipment,
    state.inventory,
    state.loadout,
    state.classSelection?.domains,
    state.progression.currentTier,
  ]);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const canProceed =
    currentStep.id === 'class' ? classCanProceed : completion[currentStep.id];

  const stepHints: Record<string, string> = {
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

  const handleBack = useCallback(() => {
    setManualStepIndex(Math.max(0, stepIndex - 1));
  }, [stepIndex]);

  const handleNext = useCallback(() => {
    setStepError(null);
    if (currentStep.id === 'class') {
      const selection = classCompleteRef.current?.complete() ?? null;
      if (selection) {
        handlers.setClassSelection(selection);
      } else {
        setStepError(stepHints.class);
        return;
      }
    }

    if (currentStep.id === 'identity') {
      identityFormRef.current?.submit();
    }

    if (currentStep.id !== 'class' && !completion[currentStep.id]) {
      setStepError(
        stepHints[currentStep.id] ?? 'Complete this step to continue.'
      );
      return;
    }

    if (isLastStep) {
      onFinish();
      return;
    }

    setManualStepIndex(Math.min(steps.length - 1, stepIndex + 1));
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
      onFinish();
      return;
    }
    setManualStepIndex(Math.min(steps.length - 1, stepIndex + 1));
  }, [isLastStep, onFinish, stepIndex, steps.length]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          setManualStepIndex(null);
          onClose();
          onSkipWizard();
        }
      }}
    >
      <DialogContent className="grid max-h-[90vh] w-[98vw] max-w-5xl grid-rows-[auto_1fr_auto] gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b p-6">
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle>New Character Setup</DialogTitle>
            <Badge variant="secondary">
              Step {stepIndex + 1} of {steps.length}
            </Badge>
            {completion[currentStep.id] && (
              <Badge variant="default">Completed</Badge>
            )}
          </div>
          <DialogDescription className="mt-2">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto p-6">
          <div className="mb-4 space-y-1">
            <h2 className="text-lg font-semibold">{currentStep.title}</h2>
            {!completion[currentStep.id] && currentStep.id !== 'identity' && (
              <p className="text-muted-foreground text-sm">
                This step is required before finishing.
              </p>
            )}
          </div>
          {currentStep.content}
        </div>

        <DialogFooter className="border-t p-4">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onSkipWizard}>
                Skip Wizard
              </Button>
            </div>
            <div className="text-destructive text-sm">{stepError ?? ''}</div>
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button variant="outline" onClick={handleSkipStep}>
                Skip Step
              </Button>
              <Button onClick={handleNext} disabled={!canProceed}>
                {isLastStep ? 'Finish' : 'Continue'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
