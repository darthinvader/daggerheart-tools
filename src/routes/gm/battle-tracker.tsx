import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { AddCharacterDialog } from '@/components/battle-tracker/add-character-dialog';
import { AddAdversaryDialogEnhanced } from '@/components/battle-tracker/adversary-dialog-enhanced';
import { DetailSidebar } from '@/components/battle-tracker/detail-sidebar';
import {
  EditAdversaryDialog,
  EditEnvironmentDialog,
} from '@/components/battle-tracker/edit-dialogs';
import { AddEnvironmentDialogEnhanced } from '@/components/battle-tracker/environment-dialog-enhanced';
import { FightBuilderWizard } from '@/components/battle-tracker/fight-builder-wizard';
import {
  GMResourcesBar,
  QuickTipsBar,
} from '@/components/battle-tracker/gm-resources-bar';
import {
  AdversaryCard,
  CharacterCard,
} from '@/components/battle-tracker/roster-cards';
import { RosterColumn } from '@/components/battle-tracker/roster-column';
import type {
  AdversaryTracker,
  EnvironmentTracker,
} from '@/components/battle-tracker/types';
import {
  useBattleDialogState,
  useBattleRosterState,
} from '@/components/battle-tracker/use-battle-tracker-state';
import {
  battleAdversariesToTrackers,
  battleCharactersToTrackers,
  battleEnvironmentsToTrackers,
} from '@/components/battle-tracker/use-campaign-battle';
import { DEFAULT_CHARACTER_DRAFT } from '@/components/battle-tracker/utils';
import type { ConditionsState } from '@/components/conditions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  createStandaloneBattle,
  deleteStandaloneBattle,
  getStandaloneBattle,
  listStandaloneBattles,
  updateStandaloneBattle,
} from '@/features/campaigns/campaign-storage';
import type { BattleState } from '@/lib/schemas/battle';

export const Route = createFileRoute('/gm/battle-tracker')({
  component: BattleTrackerPage,
});

function BattleTrackerPage() {
  const queryClient = useQueryClient();
  const { rosterState, rosterActions } = useBattleRosterState();
  const { dialogState, dialogActions } = useBattleDialogState();
  const [editingAdversary, setEditingAdversary] =
    useState<AdversaryTracker | null>(null);
  const [editingEnvironment, setEditingEnvironment] =
    useState<EnvironmentTracker | null>(null);
  const [isFightBuilderOpen, setIsFightBuilderOpen] = useState(false);
  const [battleName, setBattleName] = useState('Untitled Battle');
  const [activeBattleId, setActiveBattleId] = useState<string | null>(null);

  const conditionsToRecord = (
    conditions: ConditionsState | undefined
  ): Record<string, boolean> => {
    if (!conditions?.items) return {};
    return Object.fromEntries(conditions.items.map(item => [item, true]));
  };

  const { data: savedBattles = [] } = useQuery({
    queryKey: ['standalone-battles'],
    queryFn: listStandaloneBattles,
  });

  const loadBattleMutation = useMutation({
    mutationFn: getStandaloneBattle,
    onSuccess: battle => {
      if (!battle) return;
      setActiveBattleId(battle.id);
      setBattleName(battle.name);
      rosterActions.setCharacters(battleCharactersToTrackers(battle));
      rosterActions.setAdversaries(battleAdversariesToTrackers(battle));
      rosterActions.setEnvironments(battleEnvironmentsToTrackers(battle));
      rosterActions.setSpotlight(battle.spotlight ?? null);
      rosterActions.setSpotlightHistory(battle.spotlightHistory ?? []);
      rosterActions.setFearPool(battle.fearPool ?? 0);
      rosterActions.setUseMassiveThreshold(battle.useMassiveThreshold ?? false);
    },
  });

  const saveBattleMutation = useMutation({
    mutationFn: async () => {
      const now = new Date().toISOString();
      const payload: BattleState = {
        id: activeBattleId ?? crypto.randomUUID(),
        name: battleName.trim() || 'Untitled Battle',
        characters: rosterState.characters.map(character => ({
          id: character.id,
          name: character.name,
          evasion: character.evasion ?? 10,
          hp: character.hp,
          stress: character.stress,
          conditions: conditionsToRecord(character.conditions),
          notes: character.notes,
          sourceCharacterId: character.sourceCharacterId,
          className: character.className,
          subclassName: character.subclassName,
          loadout: character.loadout,
          armorScore: character.armorScore,
          thresholds: character.thresholds,
          isLinkedCharacter: character.isLinkedCharacter,
          ancestry: character.ancestry,
          community: character.community,
          pronouns: character.pronouns,
          level: character.level,
          tier: character.tier,
          proficiency: character.proficiency,
          hope: character.hope,
          armorSlots: character.armorSlots,
          gold: character.gold,
          experiences: character.experiences,
          primaryWeapon: character.primaryWeapon,
          secondaryWeapon: character.secondaryWeapon,
          armor: character.armor,
          equipment: character.equipment,
          coreScores: character.coreScores,
          traits: character.traits,
          inventory: character.inventory,
          vaultCards: character.vaultCards,
        })),
        adversaries: rosterState.adversaries.map(adversary => ({
          id: adversary.id,
          source: adversary.source,
          hp: adversary.hp,
          stress: adversary.stress,
          conditions: conditionsToRecord(adversary.conditions),
          notes: adversary.notes,
          difficultyOverride: adversary.difficultyOverride,
          attackOverride: adversary.attackOverride,
          thresholdsOverride: adversary.thresholdsOverride,
          featuresOverride: adversary.featuresOverride,
          lastAttackRoll: adversary.lastAttackRoll,
          lastDamageRoll: adversary.lastDamageRoll,
        })),
        environments: rosterState.environments.map(environment => ({
          id: environment.id,
          source: environment.source,
          notes: environment.notes,
          features: environment.features,
          countdown: environment.countdown,
        })),
        spotlight: rosterState.spotlight ?? null,
        spotlightHistory: rosterState.spotlightHistory ?? [],
        fearPool: rosterState.fearPool ?? 0,
        useMassiveThreshold: rosterState.useMassiveThreshold ?? false,
        notes: '',
        status: 'planning',
        createdAt: now,
        updatedAt: now,
      };

      if (activeBattleId) {
        return updateStandaloneBattle(activeBattleId, payload);
      }

      return createStandaloneBattle(payload);
    },
    onSuccess: battle => {
      if (battle) {
        setActiveBattleId(battle.id);
        setBattleName(battle.name);
      }
      void queryClient.invalidateQueries({ queryKey: ['standalone-battles'] });
    },
  });

  const deleteBattleMutation = useMutation({
    mutationFn: deleteStandaloneBattle,
    onSuccess: (_, battleId) => {
      if (battleId === activeBattleId) {
        setActiveBattleId(null);
        setBattleName('Untitled Battle');
        rosterActions.setCharacters([]);
        rosterActions.setAdversaries([]);
        rosterActions.setEnvironments([]);
        rosterActions.setSpotlight(null);
        rosterActions.setSpotlightHistory([]);
        rosterActions.setFearPool(0);
        rosterActions.setUseMassiveThreshold(false);
      }
      void queryClient.invalidateQueries({ queryKey: ['standalone-battles'] });
    },
  });

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

  const activeBattleName = useMemo(
    () => battleName.trim() || 'Untitled Battle',
    [battleName]
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold">Battle Tracker</h1>
        <p className="text-muted-foreground text-sm">
          Run one-off encounters without linking to a campaign.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base">One-off Encounter</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveBattleId(null);
                    setBattleName('Untitled Battle');
                    rosterActions.setCharacters([]);
                    rosterActions.setAdversaries([]);
                    rosterActions.setEnvironments([]);
                    rosterActions.setSpotlight(null);
                    rosterActions.setSpotlightHistory([]);
                    rosterActions.setFearPool(0);
                    rosterActions.setUseMassiveThreshold(false);
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  New
                </Button>
                <Button
                  size="sm"
                  onClick={() => saveBattleMutation.mutate()}
                  disabled={saveBattleMutation.isPending}
                >
                  <Save className="mr-1 h-4 w-4" />
                  {saveBattleMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
            <Input
              value={battleName}
              onChange={event => setBattleName(event.target.value)}
              placeholder="Encounter name"
            />
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge variant="outline">Standalone</Badge>
              {activeBattleId && (
                <span className="text-muted-foreground text-xs">
                  Saved as {activeBattleName}
                </span>
              )}
            </div>

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
                    <span>{rosterState.characters.length} PCs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{rosterState.adversaries.length} Adversaries</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dialogActions.setIsAddCharacterOpen(true)}
                >
                  Add Character
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dialogActions.setIsAddAdversaryOpen(true)}
                >
                  Add Adversary
                </Button>
                <Button size="sm" onClick={() => setIsFightBuilderOpen(true)}>
                  Fight Builder
                </Button>
              </div>
            </div>

            <QuickTipsBar />
            <GMResourcesBar
              characterCount={rosterState.characters.length}
              environments={rosterState.environments}
              fearPool={rosterState.fearPool}
              selection={rosterState.selection}
              spotlight={rosterState.spotlight}
              useMassiveThreshold={rosterState.useMassiveThreshold}
              onFearChange={rosterActions.setFearPool}
              onUseMassiveThresholdChange={rosterActions.setUseMassiveThreshold}
              onAddEnvironment={() =>
                dialogActions.setIsAddEnvironmentOpen(true)
              }
              onSelectEnvironment={rosterActions.handleSelect}
              onRemoveEnvironment={rosterActions.handleRemove}
              onSpotlightEnvironment={rosterActions.handleSpotlight}
              onEditEnvironment={setEditingEnvironment}
            />

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr_minmax(320px,400px)]">
              <RosterColumn
                title="Characters"
                icon={null}
                count={rosterState.characters.length}
                emptyText="No characters added"
              >
                {rosterState.characters.map(character => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    isSelected={
                      rosterState.selection?.id === character.id &&
                      rosterState.selection.kind === 'character'
                    }
                    isSpotlight={
                      rosterState.spotlight?.id === character.id &&
                      rosterState.spotlight.kind === 'character'
                    }
                    useMassiveThreshold={rosterState.useMassiveThreshold}
                    onSelect={() => rosterActions.handleSelect(character)}
                    onRemove={() => rosterActions.handleRemove(character)}
                    onSpotlight={() => rosterActions.handleSpotlight(character)}
                    onChange={rosterActions.updateCharacter}
                  />
                ))}
              </RosterColumn>

              <RosterColumn
                title="Adversaries"
                icon={null}
                count={rosterState.adversaries.length}
                emptyText="No adversaries added"
              >
                {rosterState.adversaries.map(adversary => (
                  <AdversaryCard
                    key={adversary.id}
                    adversary={adversary}
                    isSelected={
                      rosterState.selection?.id === adversary.id &&
                      rosterState.selection.kind === 'adversary'
                    }
                    isSpotlight={
                      rosterState.spotlight?.id === adversary.id &&
                      rosterState.spotlight.kind === 'adversary'
                    }
                    useMassiveThreshold={rosterState.useMassiveThreshold}
                    onSelect={() => rosterActions.handleSelect(adversary)}
                    onRemove={() => rosterActions.handleRemove(adversary)}
                    onSpotlight={() => rosterActions.handleSpotlight(adversary)}
                    onChange={rosterActions.updateAdversary}
                    onEdit={() => setEditingAdversary(adversary)}
                  />
                ))}
              </RosterColumn>

              <DetailSidebar
                item={rosterState.selectedItem}
                spotlight={rosterState.spotlight}
                spotlightHistory={rosterState.spotlightHistory}
                characters={rosterState.characters}
                adversaries={rosterState.adversaries}
                environments={rosterState.environments}
                useMassiveThreshold={rosterState.useMassiveThreshold}
                onClearSpotlight={() => rosterActions.setSpotlight(null)}
                onSetSpotlight={rosterActions.setSpotlight}
                onCharacterChange={rosterActions.updateCharacter}
                onAdversaryChange={rosterActions.updateAdversary}
                onEnvironmentChange={rosterActions.updateEnvironment}
              />
            </div>

            <AddCharacterDialog
              isOpen={dialogState.isAddCharacterOpen}
              onOpenChange={dialogActions.setIsAddCharacterOpen}
              characterDraft={dialogState.characterDraft}
              onDraftChange={dialogActions.setCharacterDraft}
              onAdd={handleAddCharacter}
              onCancel={() => dialogActions.setIsAddCharacterOpen(false)}
            />

            <AddAdversaryDialogEnhanced
              isOpen={dialogState.isAddAdversaryOpen}
              onOpenChange={dialogActions.setIsAddAdversaryOpen}
              adversaries={dialogState.filteredAdversaries}
              onAdd={handleAddAdversary}
            />

            <AddEnvironmentDialogEnhanced
              isOpen={dialogState.isAddEnvironmentOpen}
              onOpenChange={dialogActions.setIsAddEnvironmentOpen}
              environments={dialogState.filteredEnvironments}
              onAdd={handleAddEnvironment}
            />

            <EditAdversaryDialog
              adversary={editingAdversary}
              isOpen={editingAdversary !== null}
              onOpenChange={open => !open && setEditingAdversary(null)}
              onSave={handleSaveAdversary}
            />

            <EditEnvironmentDialog
              environment={editingEnvironment}
              isOpen={editingEnvironment !== null}
              onOpenChange={open => !open && setEditingEnvironment(null)}
              onSave={handleSaveEnvironment}
            />

            <FightBuilderWizard
              isOpen={isFightBuilderOpen}
              onOpenChange={setIsFightBuilderOpen}
              onAddAdversaries={handleAddFromWizard}
              currentCharacterCount={rosterState.characters.length}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Saved Encounters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {savedBattles.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No saved encounters yet.
              </p>
            ) : (
              savedBattles.map(battle => (
                <div
                  key={battle.id}
                  className="flex items-center justify-between gap-2 rounded-md border p-2"
                >
                  <div>
                    <div className="text-sm font-medium">{battle.name}</div>
                    <div className="text-muted-foreground text-xs">
                      Updated {new Date(battle.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadBattleMutation.mutate(battle.id)}
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteBattleMutation.mutate(battle.id)}
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            <Separator />
            <p className="text-muted-foreground text-xs">
              Campaign battles are still managed from each campaign’s GM Tools
              tab.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
