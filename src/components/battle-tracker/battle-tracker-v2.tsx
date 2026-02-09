import { Swords, User, Wand2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { AddCharacterDialog } from './add-character-dialog';
import { AddAdversaryDialogEnhanced } from './adversary-dialog-enhanced';
import { DetailSidebar } from './detail-sidebar';
import { EditAdversaryDialog, EditEnvironmentDialog } from './edit-dialogs';
import { AddEnvironmentDialogEnhanced } from './environment-dialog-enhanced';
import { FightBuilderWizard } from './fight-builder-wizard';
import { GMResourcesBar, QuickTipsBar } from './gm-resources-bar';
import { AdversaryCard, CharacterCard } from './roster-cards';
import { RosterColumn } from './roster-column';
import type { AdversaryTracker, EnvironmentTracker } from './types';
import {
  useBattleDialogState,
  useBattleRosterState,
} from './use-battle-tracker-state';
import { useSpendFear } from './use-spend-fear';
import { DEFAULT_CHARACTER_DRAFT } from './utils';

type RosterState = ReturnType<typeof useBattleRosterState>['rosterState'];
type RosterActions = ReturnType<typeof useBattleRosterState>['rosterActions'];
type DialogState = ReturnType<typeof useBattleDialogState>['dialogState'];
type DialogActions = ReturnType<typeof useBattleDialogState>['dialogActions'];

function TrackerHeader({
  characterCount,
  adversaryCount,
  onAddCharacter,
  onAddAdversary,
  onOpenFightBuilder,
}: {
  characterCount: number;
  adversaryCount: number;
  onAddCharacter: () => void;
  onAddAdversary: () => void;
  onOpenFightBuilder: () => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Battle Tracker</span>
          <Badge variant="outline" className="text-xs">
            GM View
          </Badge>
        </div>
        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <User className="size-4 text-blue-500" />
            <span>{characterCount} PCs</span>
          </div>
          <div className="flex items-center gap-1">
            <Swords className="size-4 text-red-500" />
            <span>{adversaryCount} Adversaries</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onAddCharacter}>
          <User className="mr-1.5 size-4 text-blue-500" /> Character
        </Button>
        <Button variant="outline" size="sm" onClick={onAddAdversary}>
          <Swords className="mr-1.5 size-4 text-red-500" /> Adversary
        </Button>
        <Button size="sm" onClick={onOpenFightBuilder} className="gap-1">
          <Wand2 className="size-4" /> Fight Builder
        </Button>
      </div>
    </div>
  );
}

function BattleTrackerLayout({
  rosterState,
  rosterActions,
  onAddEnvironment,
  onEditEnvironment,
  onEditAdversary,
}: {
  rosterState: RosterState;
  rosterActions: RosterActions;
  onAddEnvironment: () => void;
  onEditEnvironment: (environment: EnvironmentTracker) => void;
  onEditAdversary: (adversary: AdversaryTracker) => void;
}) {
  const handleReduceAllCountdowns = useCallback(() => {
    // Reduce all enabled environment countdowns
    rosterState.environments.forEach(env => {
      if (env.countdownEnabled && (env.countdown ?? 0) > 0) {
        rosterActions.updateEnvironment(env.id, e => ({
          ...e,
          countdown: Math.max(0, (e.countdown ?? 0) - 1),
        }));
      }
    });
    // Reduce all enabled adversary countdowns
    rosterState.adversaries.forEach(adv => {
      if (adv.countdownEnabled && (adv.countdown ?? 0) > 0) {
        rosterActions.updateAdversary(adv.id, a => ({
          ...a,
          countdown: Math.max(0, (a.countdown ?? 0) - 1),
        }));
      }
    });
  }, [rosterState.environments, rosterState.adversaries, rosterActions]);

  const handleSpendFear = useSpendFear(rosterState, rosterActions);

  return (
    <>
      <GMResourcesBar
        characterCount={rosterState.characters.length}
        environments={rosterState.environments}
        adversaries={rosterState.adversaries}
        fearPool={rosterState.fearPool}
        maxFear={rosterState.maxFear}
        selection={rosterState.selection}
        spotlight={rosterState.spotlight}
        useMassiveThreshold={rosterState.useMassiveThreshold}
        onFearChange={rosterActions.setFearPool}
        onUseMassiveThresholdChange={rosterActions.setUseMassiveThreshold}
        onAddEnvironment={onAddEnvironment}
        onSelectEnvironment={rosterActions.handleSelect}
        onRemoveEnvironment={rosterActions.handleRemove}
        onSpotlightEnvironment={rosterActions.handleSpotlight}
        onEditEnvironment={onEditEnvironment}
        onEnvironmentChange={rosterActions.updateEnvironment}
        onAdversaryChange={rosterActions.updateAdversary}
        onReduceAllCountdowns={handleReduceAllCountdowns}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_minmax(320px,400px)]">
        <RosterColumn
          title="Characters"
          icon={<User className="size-4" />}
          count={rosterState.characters.length}
          emptyText="No characters added"
        >
          {rosterState.characters.map(char => (
            <CharacterCard
              key={char.id}
              character={char}
              isSelected={
                rosterState.selection?.id === char.id &&
                rosterState.selection.kind === 'character'
              }
              isSpotlight={
                rosterState.spotlight?.id === char.id &&
                rosterState.spotlight.kind === 'character'
              }
              useMassiveThreshold={rosterState.useMassiveThreshold}
              onSelect={rosterActions.handleSelect}
              onRemove={rosterActions.handleRemove}
              onSpotlight={rosterActions.handleSpotlight}
              onChange={rosterActions.updateCharacter}
            />
          ))}
        </RosterColumn>

        <RosterColumn
          title="Adversaries"
          icon={<Swords className="size-4" />}
          count={rosterState.adversaries.length}
          emptyText="No adversaries added"
        >
          {rosterState.adversaries.map(adv => (
            <AdversaryCard
              key={adv.id}
              adversary={adv}
              isSelected={
                rosterState.selection?.id === adv.id &&
                rosterState.selection.kind === 'adversary'
              }
              isSpotlight={
                rosterState.spotlight?.id === adv.id &&
                rosterState.spotlight.kind === 'adversary'
              }
              useMassiveThreshold={rosterState.useMassiveThreshold}
              onSelect={rosterActions.handleSelect}
              onRemove={rosterActions.handleRemove}
              onSpotlight={rosterActions.handleSpotlight}
              onChange={rosterActions.updateAdversary}
              onEdit={onEditAdversary}
            />
          ))}
        </RosterColumn>

        <DetailSidebar
          item={rosterState.selectedItem}
          spotlight={rosterState.spotlight}
          spotlightHistory={rosterState.spotlightHistory}
          spotlightHistoryTimeline={rosterState.spotlightHistoryTimeline}
          rollHistory={rosterState.rollHistory}
          currentRound={rosterState.currentRound}
          characters={rosterState.characters}
          adversaries={rosterState.adversaries}
          environments={rosterState.environments}
          useMassiveThreshold={rosterState.useMassiveThreshold}
          fearPool={rosterState.fearPool}
          onSpendFear={handleSpendFear}
          onClearSpotlight={() => rosterActions.setSpotlight(null)}
          onSetSpotlight={rosterActions.setSpotlight}
          onClearSpotlightHistoryTimeline={
            rosterActions.clearSpotlightHistoryTimeline
          }
          onClearRollHistory={rosterActions.clearRollHistory}
          onCharacterChange={rosterActions.updateCharacter}
          onAdversaryChange={rosterActions.updateAdversary}
          onEnvironmentChange={rosterActions.updateEnvironment}
        />
      </div>
    </>
  );
}

function BattleTrackerDialogs({
  dialogState,
  dialogActions,
  editingAdversary,
  editingEnvironment,
  isFightBuilderOpen,
  currentCharacterCount,
  setEditingAdversary,
  setEditingEnvironment,
  setIsFightBuilderOpen,
  onAddCharacter,
  onAddAdversary,
  onAddEnvironment,
  onAddFromWizard,
  onSaveAdversary,
  onSaveEnvironment,
}: {
  dialogState: DialogState;
  dialogActions: DialogActions;
  editingAdversary: AdversaryTracker | null;
  editingEnvironment: EnvironmentTracker | null;
  isFightBuilderOpen: boolean;
  currentCharacterCount: number;
  setEditingAdversary: (value: AdversaryTracker | null) => void;
  setEditingEnvironment: (value: EnvironmentTracker | null) => void;
  setIsFightBuilderOpen: (value: boolean) => void;
  onAddCharacter: () => void;
  onAddAdversary: (
    adversary: Parameters<RosterActions['addAdversary']>[0]
  ) => void;
  onAddEnvironment: (
    environment: Parameters<RosterActions['addEnvironment']>[0]
  ) => void;
  onAddFromWizard: (
    adversaries: {
      adversary: Parameters<RosterActions['addAdversary']>[0];
      count: number;
    }[]
  ) => void;
  onSaveAdversary: (updates: Partial<AdversaryTracker>) => void;
  onSaveEnvironment: (updates: Partial<EnvironmentTracker>) => void;
}) {
  return (
    <>
      <AddCharacterDialog
        isOpen={dialogState.isAddCharacterOpen}
        characterDraft={dialogState.characterDraft}
        onOpenChange={dialogActions.setIsAddCharacterOpen}
        onDraftChange={dialogActions.setCharacterDraft}
        onAdd={onAddCharacter}
        onCancel={() => {
          dialogActions.setIsAddCharacterOpen(false);
          dialogActions.setCharacterDraft(DEFAULT_CHARACTER_DRAFT);
        }}
      />

      <AddAdversaryDialogEnhanced
        isOpen={dialogState.isAddAdversaryOpen}
        adversaries={dialogState.filteredAdversaries}
        onOpenChange={dialogActions.setIsAddAdversaryOpen}
        onAdd={onAddAdversary}
      />

      <AddEnvironmentDialogEnhanced
        isOpen={dialogState.isAddEnvironmentOpen}
        environments={dialogState.filteredEnvironments}
        onOpenChange={dialogActions.setIsAddEnvironmentOpen}
        onAdd={onAddEnvironment}
      />

      <EditAdversaryDialog
        adversary={editingAdversary}
        isOpen={editingAdversary !== null}
        onOpenChange={open => !open && setEditingAdversary(null)}
        onSave={onSaveAdversary}
      />

      <EditEnvironmentDialog
        environment={editingEnvironment}
        isOpen={editingEnvironment !== null}
        onOpenChange={open => !open && setEditingEnvironment(null)}
        onSave={onSaveEnvironment}
      />

      <FightBuilderWizard
        isOpen={isFightBuilderOpen}
        onOpenChange={setIsFightBuilderOpen}
        onAddAdversaries={onAddFromWizard}
        currentCharacterCount={currentCharacterCount}
      />
    </>
  );
}

export function BattleTrackerV2() {
  const { rosterState, rosterActions } = useBattleRosterState();
  const { dialogState, dialogActions } = useBattleDialogState();

  const [editingAdversary, setEditingAdversary] =
    useState<AdversaryTracker | null>(null);
  const [editingEnvironment, setEditingEnvironment] =
    useState<EnvironmentTracker | null>(null);
  const [isFightBuilderOpen, setIsFightBuilderOpen] = useState(false);

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

  const handleAddFromWizard = (
    adversaries: {
      adversary: Parameters<typeof rosterActions.addAdversary>[0];
      count: number;
    }[]
  ) => {
    adversaries.forEach(({ adversary, count }) => {
      Array.from({ length: count }).forEach(() =>
        rosterActions.addAdversary(adversary)
      );
    });
  };

  const handleSaveAdversary = (updates: Partial<AdversaryTracker>) => {
    if (!editingAdversary) return;
    rosterActions.updateAdversary(editingAdversary.id, prev => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSaveEnvironment = (updates: Partial<EnvironmentTracker>) => {
    if (!editingEnvironment) return;
    rosterActions.updateEnvironment(editingEnvironment.id, prev => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <TrackerHeader
        characterCount={rosterState.characters.length}
        adversaryCount={rosterState.adversaries.length}
        onAddCharacter={() => dialogActions.setIsAddCharacterOpen(true)}
        onAddAdversary={() => dialogActions.setIsAddAdversaryOpen(true)}
        onOpenFightBuilder={() => setIsFightBuilderOpen(true)}
      />

      <QuickTipsBar />
      <BattleTrackerLayout
        rosterState={rosterState}
        rosterActions={rosterActions}
        onAddEnvironment={() => dialogActions.setIsAddEnvironmentOpen(true)}
        onEditEnvironment={setEditingEnvironment}
        onEditAdversary={setEditingAdversary}
      />

      <BattleTrackerDialogs
        dialogState={dialogState}
        dialogActions={dialogActions}
        editingAdversary={editingAdversary}
        editingEnvironment={editingEnvironment}
        isFightBuilderOpen={isFightBuilderOpen}
        currentCharacterCount={rosterState.characters.length}
        setEditingAdversary={setEditingAdversary}
        setEditingEnvironment={setEditingEnvironment}
        setIsFightBuilderOpen={setIsFightBuilderOpen}
        onAddCharacter={handleAddCharacter}
        onAddAdversary={handleAddAdversary}
        onAddEnvironment={handleAddEnvironment}
        onAddFromWizard={handleAddFromWizard}
        onSaveAdversary={handleSaveAdversary}
        onSaveEnvironment={handleSaveEnvironment}
      />
    </div>
  );
}
