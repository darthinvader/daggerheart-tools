import { useState } from 'react';

import { ResponsiveTabsList } from '@/components/character-sheet/responsive-tabs';
import { LevelUpModal } from '@/components/level-up';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import {
  CombatTab,
  IdentityTab,
  ItemsTab,
  OverviewTab,
  QuickViewTab,
  SessionTab,
} from './demo-tabs';
import { useCharacterSheetState } from './use-character-sheet-state';

const PRIMARY_TABS = [
  { value: 'quick', label: '⚡ Quick' },
  { value: 'overview', label: '📊 Overview' },
];

const SECONDARY_TABS = [
  { value: 'identity', label: '👤 Identity' },
  { value: 'combat', label: '⚔️ Combat' },
  { value: 'items', label: '🎒 Items' },
  { value: 'session', label: '🎲 Session' },
];

export function CharacterSheetDemo() {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    state,
    handlers,
    isLevelUpOpen,
    setIsLevelUpOpen,
    handleLevelUpConfirm,
    currentTraitsForModal,
    currentExperiencesForModal,
    ownedCardNames,
  } = useCharacterSheetState();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">📋 Character Sheet Demo</h1>
        <p className="text-muted-foreground">
          A complete character sheet showing all display components with edit
          capabilities. Click the ✏️ Edit button on any section to modify it.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ResponsiveTabsList
          primaryTabs={PRIMARY_TABS}
          secondaryTabs={SECONDARY_TABS}
          value={activeTab}
          onValueChange={setActiveTab}
        />

        <TabsContent value="quick">
          <QuickViewTab state={state} handlers={handlers} />
        </TabsContent>
        <TabsContent value="overview">
          <OverviewTab state={state} handlers={handlers} />
        </TabsContent>
        <TabsContent value="identity">
          <IdentityTab state={state} handlers={handlers} />
        </TabsContent>
        <TabsContent value="combat">
          <CombatTab state={state} handlers={handlers} />
        </TabsContent>
        <TabsContent value="items">
          <ItemsTab state={state} handlers={handlers} />
        </TabsContent>
        <TabsContent value="session">
          <SessionTab state={state} handlers={handlers} />
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
  );
}
