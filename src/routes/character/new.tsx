import { useCallback, useState } from 'react';

import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { ClassSelector } from '@/components/class-selector';
import { LoadoutSelector } from '@/components/loadout-selector';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { LoadoutSelection } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/character/new')({
  component: NewCharacter,
});

type CreationStep = 'class' | 'loadout' | 'review';

const STEP_INFO: Record<
  CreationStep,
  { title: string; emoji: string; description: string }
> = {
  class: {
    title: 'Choose Your Class',
    emoji: '⚔️',
    description:
      "Select your class and subclass to define your character's core abilities.",
  },
  loadout: {
    title: 'Build Your Loadout',
    emoji: '📜',
    description: 'Choose domain cards for your active loadout and vault.',
  },
  review: {
    title: 'Review & Create',
    emoji: '✨',
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
              <span>{isComplete ? '✓' : info.emoji}</span>
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

// eslint-disable-next-line max-lines-per-function
function NewCharacter() {
  const navigate = useNavigate();
  const [step, setStep] = useState<CreationStep>('class');
  const [classSelection, setClassSelection] = useState<ClassSelection | null>(
    null
  );
  const [loadout, setLoadout] = useState<LoadoutSelection | null>(null);

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

  const handleCreateCharacter = useCallback(() => {
    // TODO: Generate character ID and persist to storage
    const characterId = crypto.randomUUID();
    // TODO: Persist character data before navigating
    void classSelection;
    void loadout;
    // Navigate to the character page
    navigate({ to: '/character', search: { id: characterId } });
  }, [classSelection, loadout, navigate]);

  const stepInfo = STEP_INFO[step];

  return (
    <div className="container mx-auto max-w-5xl p-4">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <span>🎭</span>
          <span>Create New Character</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Build your hero step by step.
        </p>
      </div>

      <StepIndicator currentStep={step} />

      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <span>{stepInfo.emoji}</span>
          <span>{stepInfo.title}</span>
        </h2>
        <p className="text-muted-foreground">{stepInfo.description}</p>
      </div>

      {step !== 'class' && (
        <div className="mb-4">
          <Button variant="ghost" onClick={handleBack}>
            ← Back
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
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>⚔️</span>
                  <span>Class & Subclass</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Class:</strong>{' '}
                    {classSelection.isHomebrew
                      ? `${classSelection.className} (Homebrew)`
                      : classSelection.className}
                  </p>
                  <p>
                    <strong>Subclass:</strong> {classSelection.subclassName}
                  </p>
                  <p>
                    <strong>Domains:</strong> {classDomains.join(', ')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>📜</span>
                  <span>Domain Loadout</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Active Cards:</strong>{' '}
                    {loadout.activeCards.length > 0
                      ? loadout.activeCards.map(c => c.name).join(', ')
                      : 'None selected'}
                  </p>
                  <p>
                    <strong>Vault Cards:</strong>{' '}
                    {loadout.vaultCards.length > 0
                      ? loadout.vaultCards.map(c => c.name).join(', ')
                      : 'None selected'}
                  </p>
                  {loadout.homebrewCards.length > 0 && (
                    <p>
                      <strong>Homebrew Cards:</strong>{' '}
                      {loadout.homebrewCards.map(c => c.name).join(', ')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>✨</span>
                <span>Ready to Create!</span>
              </CardTitle>
              <CardDescription>
                Your character selections are complete. Click below to create
                your character and start your adventure!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleCreateCharacter}
                size="lg"
                className="w-full"
              >
                🎉 Create Character
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
