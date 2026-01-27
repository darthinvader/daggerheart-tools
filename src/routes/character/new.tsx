import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Check, LogIn, type LucideIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { ClassSelector } from '@/components/class-selector';
import { LoadoutSelector } from '@/components/loadout-selector';
import { useAuth } from '@/components/providers';
import { ReviewStep } from '@/components/shared/review-step';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { createCharacter, createDefaultCharacter } from '@/lib/api/characters';
import { characterQueryKeys } from '@/lib/api/query-client';
import { Scroll, Sparkles, Swords, Theater } from '@/lib/icons';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { LoadoutSelection } from '@/lib/schemas/loadout';
import { cn, generateId } from '@/lib/utils';

export const Route = createFileRoute('/character/new')({
  component: NewCharacter,
});

type CreationStep = 'class' | 'loadout' | 'review';

const STEP_INFO: Record<
  CreationStep,
  { title: string; icon: LucideIcon; description: string }
> = {
  class: {
    title: 'Choose Your Class',
    icon: Swords,
    description:
      "Select your class and subclass to define your character's core abilities.",
  },
  loadout: {
    title: 'Build Your Loadout',
    icon: Scroll,
    description: 'Choose domain cards for your active loadout and vault.',
  },
  review: {
    title: 'Review & Create',
    icon: Sparkles,
    description: 'Review your selections and create your character.',
  },
};

function StepIndicator({ currentStep }: { currentStep: CreationStep }) {
  const steps: CreationStep[] = ['class', 'loadout', 'review'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const info = STEP_INFO[step];
        const isActive = step === currentStep;
        const isComplete = index < currentIndex;

        return (
          <div key={step} className="flex items-center gap-2">
            {index > 0 && (
              <div
                className={cn(
                  'h-0.5 w-8 sm:w-12',
                  isComplete ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
            <div
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-2 transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : isComplete
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
              )}
            >
              {isComplete ? (
                <Check className="size-4" />
              ) : (
                <info.icon className="size-4" />
              )}
              <span className="hidden text-sm font-medium sm:inline">
                {info.title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NewCharacter() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<CreationStep>('class');
  const [classSelection, setClassSelection] = useState<ClassSelection | null>(
    null
  );
  const [loadout, setLoadout] = useState<LoadoutSelection | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const classDomains = classSelection?.domains ?? [];

  const handleClassComplete = useCallback((selection: ClassSelection) => {
    setClassSelection(selection);
    setStep('loadout');
  }, []);

  const handleLoadoutComplete = useCallback((selection: LoadoutSelection) => {
    setLoadout(selection);
    setStep('review');
  }, []);

  const handleBack = useCallback(() => {
    if (step === 'loadout') {
      setStep('class');
    } else if (step === 'review') {
      setStep('loadout');
    }
  }, [step]);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!classSelection || !loadout) {
        throw new Error('Character data is incomplete.');
      }

      const characterId = generateId();
      const character = createDefaultCharacter(characterId);

      character.classDraft = {
        mode: classSelection.mode,
        className: classSelection.className,
        subclassName: classSelection.subclassName,
        homebrewClass: classSelection.homebrewClass,
      };

      character.domains = {
        loadout: loadout.activeCards,
        vault: loadout.vaultCards,
        creationComplete: loadout.creationComplete,
      };

      return createCharacter(character);
    },
    onSuccess: data => {
      setCreateError(null);
      void queryClient.invalidateQueries({
        queryKey: characterQueryKeys.all,
      });
      navigate({
        to: '/character/$characterId',
        params: { characterId: data.id },
        search: { tab: 'quick' },
      });
    },
    onError: error => {
      setCreateError(
        error instanceof Error ? error.message : 'Failed to create character.'
      );
    },
  });

  const handleCreateCharacter = useCallback(() => {
    if (createMutation.isPending) return;
    setCreateError(null);
    createMutation.mutate();
  }, [createMutation]);

  const stepInfo = STEP_INFO[step];

  return (
    <div className="container mx-auto max-w-5xl p-4">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <Theater className="size-8" />
          <span>Create New Character</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Build your hero step by step.
        </p>
      </div>

      {!isAuthLoading && !isAuthenticated && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <LogIn className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">
            Account Required
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            You need to{' '}
            <Link
              to="/login"
              className="font-medium underline hover:no-underline"
            >
              sign in
            </Link>{' '}
            to create and save characters. Characters created without an account
            cannot be saved.
          </AlertDescription>
        </Alert>
      )}

      <StepIndicator currentStep={step} />

      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <stepInfo.icon className="size-5" />
          <span>{stepInfo.title}</span>
        </h2>
        <p className="text-muted-foreground">{stepInfo.description}</p>
      </div>

      {step !== 'class' && (
        <div className="mb-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-1 size-4" />
            Back
          </Button>
        </div>
      )}

      {step === 'class' && <ClassSelector onComplete={handleClassComplete} />}

      {step === 'loadout' && classSelection && (
        <LoadoutSelector
          value={loadout ?? undefined}
          onChange={setLoadout}
          onComplete={handleLoadoutComplete}
          classDomains={classDomains}
          tier="1"
        />
      )}

      {step === 'review' && classSelection && loadout && (
        <div className="space-y-4">
          {createError && (
            <p className="text-destructive text-sm" role="alert">
              {createError}
            </p>
          )}
          <ReviewStep
            classSelection={classSelection}
            loadout={loadout}
            onCreateCharacter={handleCreateCharacter}
            isCreating={createMutation.isPending}
          />
        </div>
      )}
    </div>
  );
}
