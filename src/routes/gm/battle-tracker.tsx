import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import {
  ArrowLeft,
  LinkIcon,
  Pause,
  Play,
  Plus,
  Save,
  Square,
  Swords,
  User,
  Wand2,
} from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { z } from 'zod';

import { AddCharacterDialog } from '@/components/battle-tracker/add-character-dialog';
import { AddAdversaryDialogEnhanced } from '@/components/battle-tracker/adversary-dialog-enhanced';
import { DetailSidebar } from '@/components/battle-tracker/detail-sidebar';
import {
  EditAdversaryDialog,
  EditEnvironmentDialog,
} from '@/components/battle-tracker/edit-dialogs';
import { AddEnvironmentDialogEnhanced } from '@/components/battle-tracker/environment-dialog-enhanced';
import { FightBuilderWizard } from '@/components/battle-tracker/fight-builder-wizard';
import { GMResourcesBar } from '@/components/battle-tracker/gm-resources-bar';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createBattle,
  createStandaloneBattle,
  deleteStandaloneBattle,
  getStandaloneBattle,
  updateStandaloneBattle,
} from '@/features/campaigns/campaign-storage';
import { useCampaigns } from '@/features/campaigns/use-campaign-query';
import type { BattleState } from '@/lib/schemas/battle';

const searchSchema = z.object({
  battleId: z.string().optional(),
});

export const Route = createFileRoute('/gm/battle-tracker')({
  component: BattleTrackerPage,
  validateSearch: search => searchSchema.parse(search),
});

function BattleTrackerPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { battleId: initialBattleId } = useSearch({
    from: '/gm/battle-tracker',
  });
  const { rosterState, rosterActions } = useBattleRosterState();
  const { dialogState, dialogActions } = useBattleDialogState();
  const [editingAdversary, setEditingAdversary] =
    useState<AdversaryTracker | null>(null);
  const [editingEnvironment, setEditingEnvironment] =
    useState<EnvironmentTracker | null>(null);
  const [isFightBuilderOpen, setIsFightBuilderOpen] = useState(false);
  const [battleName, setBattleName] = useState('Untitled Battle');
  const [battleStatus, setBattleStatus] = useState<
    'planning' | 'active' | 'paused' | 'completed'
  >('planning');
  const [activeBattleId, setActiveBattleId] = useState<string | null>(null);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const { data: campaigns = [] } = useCampaigns();

  const conditionsToRecord = (
    conditions: ConditionsState | undefined
  ): Record<string, boolean> => {
    if (!conditions?.items) return {};
    return Object.fromEntries(conditions.items.map(item => [item, true]));
  };

  // Load initial battle if battleId is provided in search params
  const { data: initialBattle } = useQuery({
    queryKey: ['standalone-battle', initialBattleId],
    queryFn: () =>
      initialBattleId ? getStandaloneBattle(initialBattleId) : null,
    enabled: !!initialBattleId && !hasLoadedInitial,
  });

  // Load initial battle into state once fetched
  React.useEffect(() => {
    if (initialBattle && !hasLoadedInitial) {
      setActiveBattleId(initialBattle.id);
      setBattleName(initialBattle.name);
      setBattleStatus(initialBattle.status ?? 'planning');
      rosterActions.setCharacters(battleCharactersToTrackers(initialBattle));
      rosterActions.setAdversaries(battleAdversariesToTrackers(initialBattle));
      rosterActions.setEnvironments(
        battleEnvironmentsToTrackers(initialBattle)
      );
      rosterActions.setSpotlight(initialBattle.spotlight ?? null);
      rosterActions.setSpotlightHistory(initialBattle.spotlightHistory ?? []);
      rosterActions.setFearPool(initialBattle.fearPool ?? 0);
      rosterActions.setUseMassiveThreshold(
        initialBattle.useMassiveThreshold ?? false
      );
      setHasLoadedInitial(true);
    }
  }, [initialBattle, hasLoadedInitial, rosterActions]);

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
          countdown: adversary.countdown,
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
        status: battleStatus,
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

  const linkToCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const battlePayload = {
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
          countdown: adversary.countdown,
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
        status: battleStatus,
      };

      // Create battle in campaign
      const campaignBattle = await createBattle(campaignId, battlePayload);

      // Delete standalone battle if it existed
      if (activeBattleId) {
        await deleteStandaloneBattle(activeBattleId);
      }

      return { campaignId, battleId: campaignBattle.id };
    },
    onSuccess: ({ campaignId, battleId }) => {
      void queryClient.invalidateQueries({ queryKey: ['standalone-battles'] });
      void queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
      // Navigate to campaign battle page
      void navigate({
        to: '/gm/campaigns/$id/battle',
        params: { id: campaignId },
        search: { battleId, tab: 'overview' as const },
      });
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

  const STATUS_COLORS: Record<string, string> = {
    planning:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    active:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    paused:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    completed:
      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  };

  const handleStartBattle = () => setBattleStatus('active');
  const handlePauseBattle = () => setBattleStatus('paused');
  const handleEndBattle = () => setBattleStatus('completed');

  const handleNewBattle = () => {
    setActiveBattleId(null);
    setBattleName('Untitled Battle');
    setBattleStatus('planning');
    rosterActions.setCharacters([]);
    rosterActions.setAdversaries([]);
    rosterActions.setEnvironments([]);
    rosterActions.setSpotlight(null);
    rosterActions.setSpotlightHistory([]);
    rosterActions.setFearPool(0);
    rosterActions.setUseMassiveThreshold(false);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Header - matches campaign battle layout */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Button variant="ghost" size="sm" asChild className="w-fit">
              <Link to="/gm/saved-encounters">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Saved Encounters
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Input
                value={battleName}
                onChange={e => setBattleName(e.target.value)}
                className="h-8 w-48 text-sm font-medium"
                placeholder="Battle name..."
              />
              <Badge className={STATUS_COLORS[battleStatus]}>
                {battleStatus}
              </Badge>
              {activeBattleId && (
                <span className="text-muted-foreground text-xs">Saved</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Status Controls */}
            {battleStatus === 'planning' && (
              <Button size="sm" variant="default" onClick={handleStartBattle}>
                <Play className="mr-1.5 size-4" /> Start
              </Button>
            )}
            {battleStatus === 'active' && (
              <>
                <Button size="sm" variant="outline" onClick={handlePauseBattle}>
                  <Pause className="mr-1.5 size-4" /> Pause
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleEndBattle}
                >
                  <Square className="mr-1.5 size-4" /> End
                </Button>
              </>
            )}
            {battleStatus === 'paused' && (
              <>
                <Button size="sm" variant="default" onClick={handleStartBattle}>
                  <Play className="mr-1.5 size-4" /> Resume
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleEndBattle}
                >
                  <Square className="mr-1.5 size-4" /> End
                </Button>
              </>
            )}
            {battleStatus === 'completed' && (
              <Button size="sm" variant="outline" onClick={handleNewBattle}>
                <Plus className="mr-1.5 size-4" /> New Battle
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => saveBattleMutation.mutate()}
              disabled={saveBattleMutation.isPending}
            >
              <Save className="mr-1.5 size-4" />
              {saveBattleMutation.isPending ? 'Saving...' : 'Save'}
            </Button>

            {campaigns.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLinkDialogOpen(true)}
                disabled={linkToCampaignMutation.isPending}
              >
                <LinkIcon className="mr-1.5 size-4" />
                Link to Campaign
              </Button>
            )}

            <div className="border-border flex gap-2 border-l pl-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => dialogActions.setIsAddCharacterOpen(true)}
              >
                <User className="mr-1.5 size-4" /> Character
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => dialogActions.setIsAddAdversaryOpen(true)}
              >
                <Swords className="mr-1.5 size-4" /> Adversary
              </Button>
              <Button
                size="sm"
                onClick={() => setIsFightBuilderOpen(true)}
                className="gap-1"
              >
                <Wand2 className="size-4" /> Fight Builder
              </Button>
            </div>
          </div>
        </div>
      </div>

      <GMResourcesBar
        characterCount={rosterState.characters.length}
        environments={rosterState.environments}
        adversaries={rosterState.adversaries}
        fearPool={rosterState.fearPool}
        selection={rosterState.selection}
        spotlight={rosterState.spotlight}
        useMassiveThreshold={rosterState.useMassiveThreshold}
        onFearChange={rosterActions.setFearPool}
        onUseMassiveThresholdChange={rosterActions.setUseMassiveThreshold}
        onAddEnvironment={() => dialogActions.setIsAddEnvironmentOpen(true)}
        onSelectEnvironment={rosterActions.handleSelect}
        onRemoveEnvironment={rosterActions.handleRemove}
        onSpotlightEnvironment={rosterActions.handleSpotlight}
        onEditEnvironment={setEditingEnvironment}
        onEnvironmentChange={rosterActions.updateEnvironment}
        onAdversaryChange={rosterActions.updateAdversary}
        onReduceAllCountdowns={() => {
          rosterState.environments.forEach(env => {
            if (env.countdownEnabled && (env.countdown ?? 0) > 0) {
              rosterActions.updateEnvironment(env.id, e => ({
                ...e,
                countdown: Math.max(0, (e.countdown ?? 0) - 1),
              }));
            }
          });
          rosterState.adversaries.forEach(adv => {
            if (adv.countdownEnabled && (adv.countdown ?? 0) > 0) {
              rosterActions.updateAdversary(adv.id, a => ({
                ...a,
                countdown: Math.max(0, (a.countdown ?? 0) - 1),
              }));
            }
          });
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_minmax(320px,400px)]">
        <RosterColumn
          title="Characters"
          icon={<User className="size-4" />}
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
          icon={<Swords className="size-4" />}
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

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link to Campaign</DialogTitle>
            <DialogDescription>
              Copy this battle to a campaign. The standalone battle will be
              deleted and you'll be redirected to the campaign battle tracker.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-select">Select Campaign</Label>
              <Select
                value={selectedCampaignId}
                onValueChange={setSelectedCampaignId}
              >
                <SelectTrigger id="campaign-select">
                  <SelectValue placeholder="Choose a campaign..." />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedCampaignId) {
                  linkToCampaignMutation.mutate(selectedCampaignId);
                  setIsLinkDialogOpen(false);
                }
              }}
              disabled={!selectedCampaignId || linkToCampaignMutation.isPending}
            >
              {linkToCampaignMutation.isPending
                ? 'Linking...'
                : 'Link to Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
