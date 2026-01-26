import { Leaf, Shield, Swords, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { BattleDetailPanel } from './battle-detail-panel';
import { BattleRoster } from './battle-roster';
import { BattleSpotlight } from './battle-spotlight';
import { BattleTrackerDialogs } from './battle-tracker-dialogs';
import {
  useBattleDialogState,
  useBattleRosterState,
} from './use-battle-tracker-state';
import { DEFAULT_CHARACTER_DRAFT } from './utils';

export function BattleTracker() {
  const { rosterState, rosterActions } = useBattleRosterState();
  const { dialogState, dialogActions } = useBattleDialogState();

  const handleAddCharacter = () => {
    const newId = rosterActions.addCharacter(dialogState.characterDraft);
    if (!newId) return;
    dialogActions.setCharacterDraft(DEFAULT_CHARACTER_DRAFT);
    dialogActions.setIsAddCharacterOpen(false);
  };

  const handleAddAdversary = (
    adversary: Parameters<typeof rosterActions.addAdversary>[0]
  ) => {
    rosterActions.addAdversary(adversary);
    dialogActions.setIsAddAdversaryOpen(false);
  };

  const handleAddEnvironment = (
    environment: Parameters<typeof rosterActions.addEnvironment>[0]
  ) => {
    rosterActions.addEnvironment(environment);
    dialogActions.setIsAddEnvironmentOpen(false);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">Battle Tracker</h1>
            <Badge variant="outline" className="gap-1">
              <Shield className="size-3" /> Desktop & tablet optimized
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2 text-lg">
            Spotlight-first combat tracker for Daggerheart encounters.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => dialogActions.setIsAddCharacterOpen(true)}
          >
            <User className="mr-2 h-4 w-4" /> Add Character
          </Button>
          <Button
            variant="outline"
            onClick={() => dialogActions.setIsAddAdversaryOpen(true)}
          >
            <Swords className="mr-2 h-4 w-4" /> Add Adversary
          </Button>
          <Button
            variant="outline"
            onClick={() => dialogActions.setIsAddEnvironmentOpen(true)}
          >
            <Leaf className="mr-2 h-4 w-4" /> Add Environment
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <section className="flex flex-col gap-6">
          <BattleRoster
            characters={rosterState.characters}
            adversaries={rosterState.adversaries}
            environments={rosterState.environments}
            selection={rosterState.selection}
            spotlight={rosterState.spotlight}
            activeTab={rosterState.activeRosterTab}
            onTabChange={rosterActions.setActiveRosterTab}
            onSelect={rosterActions.handleSelect}
            onRemove={rosterActions.handleRemove}
            onSpotlight={rosterActions.handleSpotlight}
            availableAdversaries={dialogState.filteredAdversaries}
            availableEnvironments={dialogState.filteredEnvironments}
            adversarySearch={dialogState.adversarySearch}
            environmentSearch={dialogState.environmentSearch}
            onAdversarySearchChange={dialogActions.setAdversarySearch}
            onEnvironmentSearchChange={dialogActions.setEnvironmentSearch}
            onAddAdversary={rosterActions.addAdversary}
            onAddEnvironment={rosterActions.addEnvironment}
          />
          <BattleSpotlight
            spotlight={rosterState.spotlight}
            spotlightHistory={rosterState.spotlightHistory}
            characters={rosterState.characters}
            adversaries={rosterState.adversaries}
            environments={rosterState.environments}
            onClear={() => rosterActions.setSpotlight(null)}
            onSelect={rosterActions.setSpotlight}
          />
        </section>
        <section className="flex flex-col gap-6">
          <BattleDetailPanel
            item={rosterState.selectedItem}
            activeTab={rosterState.activeDetailTab}
            onTabChange={rosterActions.setActiveDetailTab}
            onCharacterChange={rosterActions.updateCharacter}
            onAdversaryChange={rosterActions.updateAdversary}
            onEnvironmentChange={rosterActions.updateEnvironment}
          />
        </section>
      </div>
      <BattleTrackerDialogs
        dialogState={dialogState}
        dialogActions={dialogActions}
        onAddCharacter={handleAddCharacter}
        onAddAdversary={handleAddAdversary}
        onAddEnvironment={handleAddEnvironment}
      />
    </div>
  );
}
