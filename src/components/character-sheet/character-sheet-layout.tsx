import { Link } from '@tanstack/react-router';
import { ArrowLeft, Cloud, CloudOff, Loader2 } from 'lucide-react';

import { CharacterOnboardingWizard } from '@/components/character-onboarding';
import {
  CombatTab,
  IdentityTab,
  ItemsTab,
  OverviewTab,
  QuickViewTab,
  SessionTab,
} from '@/components/demo/demo-tabs';
import type { LevelUpResult } from '@/components/level-up';
import { LevelUpModal } from '@/components/level-up';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Backpack, BarChart3, Dice5, User } from '@/lib/icons';
import { cn } from '@/lib/utils';

import { ResponsiveTabsList } from './responsive-tabs';
import type { CharacterSheetHandlers, CharacterSheetState } from './types.ts';

interface CharacterSheetLayoutProps {
  activeTab: string;
  handlers: CharacterSheetHandlers;
  isHydrated: boolean;
  isLevelUpOpen: boolean;
  isOnboardingOpen: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  onDismissOnboarding: () => void;
  onLevelUpClose: () => void;
  onTabChange: (tab: string) => void;
  readOnly: boolean;
  setIsNewCharacter: (value: boolean) => void;
  state: CharacterSheetState;
  handleLevelUpConfirm: (result: LevelUpResult) => void;
  currentTraitsForModal: { name: string; marked: boolean }[];
  currentExperiencesForModal: { id: string; name: string; value: number }[];
  ownedCardNames: string[];
}

export function CharacterSheetLayout({
  activeTab,
  handlers,
  isHydrated,
  isLevelUpOpen,
  isOnboardingOpen,
  isSaving,
  lastSaved,
  onDismissOnboarding,
  onLevelUpClose,
  onTabChange,
  readOnly,
  setIsNewCharacter,
  state,
  handleLevelUpConfirm,
  currentTraitsForModal,
  currentExperiencesForModal,
  ownedCardNames,
}: CharacterSheetLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="space-y-6">
        <CharacterOnboardingSection
          isOpen={isOnboardingOpen}
          readOnly={readOnly}
          onDismiss={onDismissOnboarding}
          setIsNewCharacter={setIsNewCharacter}
          state={state}
          handlers={handlers}
        />
        <CharacterSheetHeader
          characterName={state.identity.name || 'New Character'}
          level={state.progression.currentLevel}
          readOnly={readOnly}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />
        <CharacterSheetTabs
          activeTab={activeTab}
          handlers={handlers}
          isHydrated={isHydrated}
          onTabChange={onTabChange}
          readOnly={readOnly}
          state={state}
        />
        <LevelUpSection
          readOnly={readOnly}
          isOpen={isLevelUpOpen}
          onClose={onLevelUpClose}
          onConfirm={handleLevelUpConfirm}
          state={state}
          currentTraits={currentTraitsForModal}
          currentExperiences={currentExperiencesForModal}
          ownedCardNames={ownedCardNames}
        />
      </div>
    </div>
  );
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

function CharacterOnboardingSection({
  isOpen,
  readOnly,
  onDismiss,
  setIsNewCharacter,
  state,
  handlers,
}: {
  isOpen: boolean;
  readOnly: boolean;
  onDismiss: () => void;
  setIsNewCharacter: (value: boolean) => void;
  state: CharacterSheetState;
  handlers: CharacterSheetHandlers;
}) {
  if (readOnly) return null;

  const handleSkip = () => {
    onDismiss();
    setIsNewCharacter(false);
  };

  return (
    <CharacterOnboardingWizard
      isOpen={isOpen}
      onClose={onDismiss}
      onSkipWizard={handleSkip}
      onFinish={handleSkip}
      state={state}
      handlers={handlers}
    />
  );
}

function CharacterSheetHeader({
  characterName,
  level,
  readOnly,
  isSaving,
  lastSaved,
}: {
  characterName: string;
  level: number;
  readOnly: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}) {
  return (
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
            Level {level} Character
          </p>
        </div>
      </div>
      {readOnly ? (
        <Badge variant="outline">Read-only</Badge>
      ) : (
        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
      )}
    </div>
  );
}

function CharacterSheetTabs({
  activeTab,
  handlers,
  isHydrated,
  onTabChange,
  readOnly,
  state,
}: {
  activeTab: string;
  handlers: CharacterSheetHandlers;
  isHydrated: boolean;
  onTabChange: (tab: string) => void;
  readOnly: boolean;
  state: CharacterSheetState;
}) {
  const primaryTabs = [
    { value: 'quick', label: '⚡ Quick' },
    {
      value: 'overview',
      label: 'Overview',
      icon: <BarChart3 className="size-4" />,
    },
  ];

  const secondaryTabs = [
    { value: 'identity', label: 'Identity', icon: <User className="size-4" /> },
    { value: 'combat', label: '⚔️ Combat' },
    { value: 'items', label: 'Items', icon: <Backpack className="size-4" /> },
    { value: 'session', label: 'Session', icon: <Dice5 className="size-4" /> },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <ResponsiveTabsList
        primaryTabs={primaryTabs}
        secondaryTabs={secondaryTabs}
        value={activeTab}
        onValueChange={onTabChange}
      />

      <div
        className={cn(
          readOnly &&
            '[&_button]:pointer-events-none [&_button]:opacity-60 [&_input]:pointer-events-none [&_input]:opacity-70 [&_select]:pointer-events-none [&_select]:opacity-70 [&_textarea]:pointer-events-none [&_textarea]:opacity-70 **:[[role=button]]:pointer-events-none **:[[role=button]]:opacity-60'
        )}
      >
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
          <ItemsTab state={state} handlers={handlers} isHydrated={isHydrated} />
        </TabsContent>
        <TabsContent value="session">
          <SessionTab
            state={state}
            handlers={handlers}
            isHydrated={isHydrated}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}

function LevelUpSection({
  readOnly,
  isOpen,
  onClose,
  onConfirm,
  state,
  currentTraits,
  currentExperiences,
  ownedCardNames,
}: {
  readOnly: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: LevelUpResult) => void;
  state: CharacterSheetState;
  currentTraits: { name: string; marked: boolean }[];
  currentExperiences: { id: string; name: string; value: number }[];
  ownedCardNames: string[];
}) {
  if (readOnly) return null;

  return (
    <LevelUpModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      currentLevel={state.progression.currentLevel}
      currentTier={state.progression.currentTier}
      currentTraits={currentTraits}
      currentExperiences={currentExperiences}
      tierHistory={state.progression.tierHistory}
      classSelection={state.classSelection}
      unlockedSubclassFeatures={state.unlockedSubclassFeatures}
      ownedCardNames={ownedCardNames}
      currentCompanionTraining={state.companion?.training}
      hasCompanion={!!state.companion}
      companionName={state.companion?.name}
      companionExperiences={state.companion?.experiences ?? []}
    />
  );
}
