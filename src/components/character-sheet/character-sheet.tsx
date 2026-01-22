import { Link } from '@tanstack/react-router';
import { ArrowLeft, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  CharacterOnboardingWizard,
  isOnboardingComplete,
} from '@/components/character-onboarding';
import {
  CombatTab,
  IdentityTab,
  ItemsTab,
  OverviewTab,
  QuickViewTab,
  SessionTab,
} from '@/components/demo/demo-tabs';
import { LevelUpModal } from '@/components/level-up';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { ResponsiveTabsList } from './responsive-tabs';
import { useCharacterSheetWithApi } from './use-character-sheet-api';

interface CharacterSheetProps {
  characterId: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function SaveIndicator({
  isSaving,
  lastSaved,
}: {
  isSaving: boolean;
  lastSaved: Date | null;
}) {
  if (isSaving) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Cloud className="h-4 w-4 text-green-500" />
        <span>Saved</span>
      </div>
    );
  }

  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <CloudOff className="h-4 w-4" />
      <span>Not saved</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

function ErrorDisplay({
  error,
  characterId,
}: {
  error: Error;
  characterId: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="mb-2 text-xl font-semibold text-red-800 dark:text-red-200">
          Failed to load character
        </h2>
        <p className="mb-4 text-red-600 dark:text-red-300">{error.message}</p>
        <p className="mb-4 text-sm text-red-500 dark:text-red-400">
          Character ID: {characterId}
        </p>
        <div className="flex justify-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/character">← Back to Characters</Link>
          </Button>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line max-lines-per-function
export function CharacterSheet({
  characterId,
  activeTab,
  onTabChange,
}: CharacterSheetProps) {
  const [hasDismissedOnboarding, setHasDismissedOnboarding] = useState(false);
  const {
    state,
    handlers,
    isLoading,
    error,
    isNewCharacter,
    setIsNewCharacter,
    isLevelUpOpen,
    setIsLevelUpOpen,
    handleLevelUpConfirm,
    currentTraitsForModal,
    currentExperiencesForModal,
    ownedCardNames,
    isSaving,
    lastSaved,
    isHydrated,
  } = useCharacterSheetWithApi(characterId);

  const onboardingComplete = useMemo(
    () => isOnboardingComplete(state),
    [state]
  );

  const shouldAutoOpenOnboarding =
    isHydrated && isNewCharacter && !onboardingComplete && !isLevelUpOpen;
  const isOnboardingOpen = shouldAutoOpenOnboarding && !hasDismissedOnboarding;

  const primaryTabs = [
    { value: 'quick', label: '⚡ Quick' },
    { value: 'overview', label: '📊 Overview' },
  ];

  const secondaryTabs = [
    { value: 'identity', label: '👤 Identity' },
    { value: 'combat', label: '⚔️ Combat' },
    { value: 'items', label: '🎒 Items' },
    { value: 'session', label: '🎲 Session' },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <ErrorDisplay error={error as Error} characterId={characterId} />
      </div>
    );
  }

  const characterName = state.identity.name || 'New Character';

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="space-y-6">
        <CharacterOnboardingWizard
          isOpen={isOnboardingOpen}
          onClose={() => setHasDismissedOnboarding(true)}
          onSkipWizard={() => {
            setHasDismissedOnboarding(true);
            setIsNewCharacter(false);
          }}
          onFinish={() => {
            setHasDismissedOnboarding(true);
            setIsNewCharacter(false);
          }}
          state={state}
          handlers={handlers}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Button variant="ghost" size="sm" asChild className="w-fit">
              <Link to="/character">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {characterName || 'Untitled Character'}
              </h1>
              <p className="text-muted-foreground text-sm">
                Level {state.progression.currentLevel} Character
              </p>
            </div>
          </div>
          <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
        </div>

        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <ResponsiveTabsList
            primaryTabs={primaryTabs}
            secondaryTabs={secondaryTabs}
            value={activeTab}
            onValueChange={onTabChange}
          />

          <TabsContent value="quick">
            <QuickViewTab state={state} handlers={handlers} />
          </TabsContent>
          <TabsContent value="overview">
            <OverviewTab
              state={state}
              handlers={handlers}
              isHydrated={isHydrated}
            />
          </TabsContent>
          <TabsContent value="identity">
            <IdentityTab
              state={state}
              handlers={handlers}
              isHydrated={isHydrated}
            />
          </TabsContent>
          <TabsContent value="combat">
            <CombatTab
              state={state}
              handlers={handlers}
              isHydrated={isHydrated}
            />
          </TabsContent>
          <TabsContent value="items">
            <ItemsTab
              state={state}
              handlers={handlers}
              isHydrated={isHydrated}
            />
          </TabsContent>
          <TabsContent value="session">
            <SessionTab
              state={state}
              handlers={handlers}
              isHydrated={isHydrated}
            />
          </TabsContent>
        </Tabs>

        <LevelUpModal
          isOpen={isLevelUpOpen}
          onClose={() => setIsLevelUpOpen(false)}
          onConfirm={handleLevelUpConfirm}
          currentLevel={state.progression.currentLevel}
          currentTier={state.progression.currentTier}
          currentTraits={currentTraitsForModal}
          currentExperiences={currentExperiencesForModal}
          tierHistory={state.progression.tierHistory}
          classSelection={state.classSelection}
          unlockedSubclassFeatures={state.unlockedSubclassFeatures}
          ownedCardNames={ownedCardNames}
          currentCompanionTraining={state.companion?.training}
          hasCompanion={!!state.companion}
          companionName={state.companion?.name}
          companionExperiences={state.companion?.experiences ?? []}
        />
      </div>
    </div>
  );
}
