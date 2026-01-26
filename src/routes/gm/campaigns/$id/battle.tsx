// Campaign battle tracker route - auto-saves battles to campaign

import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  Leaf,
  Pause,
  Play,
  Save,
  Square,
  Swords,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { AddAdversaryDialogEnhanced } from '@/components/battle-tracker/adversary-dialog-enhanced';
import { BattleTrackerDialogs } from '@/components/battle-tracker/battle-tracker-dialogs';
import { DetailSidebar } from '@/components/battle-tracker/detail-sidebar';
import {
  EditAdversaryDialog,
  EditEnvironmentDialog,
} from '@/components/battle-tracker/edit-dialogs';
import { AddEnvironmentDialogEnhanced } from '@/components/battle-tracker/environment-dialog-enhanced';
import {
  AdversaryCard,
  CharacterCard,
  EnvironmentCard,
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
import { useCampaignBattle } from '@/components/battle-tracker/use-campaign-battle';
import { DEFAULT_CHARACTER_DRAFT } from '@/components/battle-tracker/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createBattle,
  getCampaign,
  updateBattle,
} from '@/features/campaigns/campaign-storage';
import type { BattleState } from '@/lib/schemas/battle';
import type { Campaign } from '@/lib/schemas/campaign';

export const Route = createFileRoute('/gm/campaigns/$id/battle')({
  component: CampaignBattlePage,
  validateSearch: (search: Record<string, unknown>): { battleId?: string } => {
    return { battleId: search.battleId as string | undefined };
  },
  loader: async ({ params }) => {
    const campaign = await getCampaign(params.id);
    return { campaign };
  },
});

function CampaignBattlePage() {
  const { campaign: initialCampaign } = Route.useLoaderData();
  const { id: campaignId } = Route.useParams();
  const { battleId: initialBattleId } = Route.useSearch();

  const [campaign, setCampaign] = useState<Campaign | null>(
    initialCampaign ?? null
  );
  const [activeBattleId, setActiveBattleId] = useState<string | null>(
    initialBattleId ?? null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Core roster state
  const { rosterState, rosterActions } = useBattleRosterState();
  const { dialogState, dialogActions } = useBattleDialogState();

  // Edit dialog state
  const [editingAdversary, setEditingAdversary] =
    useState<AdversaryTracker | null>(null);
  const [editingEnvironment, setEditingEnvironment] =
    useState<EnvironmentTracker | null>(null);

  // Campaign battle integration
  const handleStateChange = useCallback(
    async (state: BattleState) => {
      if (!campaignId) return;
      setIsSaving(true);
      try {
        if (activeBattleId) {
          await updateBattle(campaignId, activeBattleId, state);
        } else {
          const created = await createBattle(campaignId, state);
          setActiveBattleId(created.id);
        }
        // Refresh campaign
        const updated = await getCampaign(campaignId);
        if (updated) setCampaign(updated);
      } catch (error) {
        console.error('Failed to save battle:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [campaignId, activeBattleId]
  );

  const campaignBattle = useCampaignBattle(rosterState, rosterActions, {
    campaignId,
    onStateChange: handleStateChange,
    autoSaveDebounceMs: 3000,
  });

  // Load existing battle if resuming
  useEffect(() => {
    if (!campaign) return;
    // Find most recent active/paused battle
    const activeBattle = campaign.battles?.find(
      b => b.status === 'active' || b.status === 'paused'
    );
    if (activeBattle) {
      setActiveBattleId(activeBattle.id);
      campaignBattle.loadBattleState(activeBattle);
      // TODO: Also need to load characters/adversaries/environments into roster
    }
  }, [campaign?.id]);

  // Handlers
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

  const handleManualSave = async () => {
    const state = campaignBattle.toBattleState();
    await handleStateChange(state);
  };

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Campaign not found.</p>
        <Button asChild className="mt-4">
          <Link to="/gm/campaigns">Back to Campaigns</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <CampaignBattleHeader
        campaign={campaign}
        battleName={campaignBattle.name}
        status={campaignBattle.status}
        isDirty={campaignBattle.isDirty}
        isSaving={isSaving}
        onNameChange={campaignBattle.setBattleName}
        onStart={campaignBattle.startBattle}
        onPause={campaignBattle.pauseBattle}
        onEnd={campaignBattle.endBattle}
        onSave={handleManualSave}
        onAddCharacter={() => dialogActions.setIsAddCharacterOpen(true)}
        onAddAdversary={() => dialogActions.setIsAddAdversaryOpen(true)}
        onAddEnvironment={() => dialogActions.setIsAddEnvironmentOpen(true)}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr_minmax(320px,400px)]">
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
              onSelect={() => rosterActions.handleSelect(char)}
              onRemove={() => rosterActions.handleRemove(char)}
              onSpotlight={() => rosterActions.handleSpotlight(char)}
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
              onSelect={() => rosterActions.handleSelect(adv)}
              onRemove={() => rosterActions.handleRemove(adv)}
              onSpotlight={() => rosterActions.handleSpotlight(adv)}
              onChange={rosterActions.updateAdversary}
              onEdit={() => setEditingAdversary(adv)}
            />
          ))}
        </RosterColumn>

        <RosterColumn
          title="Environments"
          icon={<Leaf className="size-4" />}
          count={rosterState.environments.length}
          emptyText="No environments added"
        >
          {rosterState.environments.map(env => (
            <EnvironmentCard
              key={env.id}
              environment={env}
              isSelected={
                rosterState.selection?.id === env.id &&
                rosterState.selection.kind === 'environment'
              }
              isSpotlight={
                rosterState.spotlight?.id === env.id &&
                rosterState.spotlight.kind === 'environment'
              }
              onSelect={() => rosterActions.handleSelect(env)}
              onRemove={() => rosterActions.handleRemove(env)}
              onSpotlight={() => rosterActions.handleSpotlight(env)}
              onChange={rosterActions.updateEnvironment}
              onEdit={() => setEditingEnvironment(env)}
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
          onClearSpotlight={() => rosterActions.setSpotlight(null)}
          onSetSpotlight={rosterActions.setSpotlight}
          onCharacterChange={rosterActions.updateCharacter}
          onAdversaryChange={rosterActions.updateAdversary}
          onEnvironmentChange={rosterActions.updateEnvironment}
        />
      </div>

      {/* Dialogs */}
      <BattleTrackerDialogs
        dialogState={dialogState}
        dialogActions={dialogActions}
        onAddCharacter={handleAddCharacter}
        onAddAdversary={handleAddAdversary}
        onAddEnvironment={handleAddEnvironment}
      />

      <AddAdversaryDialogEnhanced
        isOpen={dialogState.isAddAdversaryOpen}
        adversaries={dialogState.filteredAdversaries}
        onOpenChange={dialogActions.setIsAddAdversaryOpen}
        onAdd={handleAddAdversary}
      />

      <AddEnvironmentDialogEnhanced
        isOpen={dialogState.isAddEnvironmentOpen}
        environments={dialogState.filteredEnvironments}
        onOpenChange={dialogActions.setIsAddEnvironmentOpen}
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
    </div>
  );
}

// =====================================================================================
// Header Component
// =====================================================================================

interface CampaignBattleHeaderProps {
  campaign: Campaign;
  battleName: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  isDirty: boolean;
  isSaving: boolean;
  onNameChange: (name: string) => void;
  onStart: () => void;
  onPause: () => void;
  onEnd: () => void;
  onSave: () => void;
  onAddCharacter: () => void;
  onAddAdversary: () => void;
  onAddEnvironment: () => void;
}

function CampaignBattleHeader({
  campaign,
  battleName,
  status,
  isDirty,
  isSaving,
  onNameChange,
  onStart,
  onPause,
  onEnd,
  onSave,
  onAddCharacter,
  onAddAdversary,
  onAddEnvironment,
}: CampaignBattleHeaderProps) {
  const statusColors = {
    planning: 'bg-muted text-muted-foreground',
    active: 'bg-green-500/20 text-green-700 dark:text-green-400',
    paused: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    completed: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link
              to="/gm/campaigns/$id"
              params={{ id: campaign.id }}
              search={{ tab: 'overview' }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {campaign.name}
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Input
              value={battleName}
              onChange={e => onNameChange(e.target.value)}
              className="h-8 w-48 text-sm font-medium"
              placeholder="Battle name..."
            />
            <Badge className={statusColors[status]}>{status}</Badge>
            {isDirty && !isSaving && (
              <Badge variant="outline" className="text-xs">
                Unsaved
              </Badge>
            )}
            {isSaving && (
              <Badge variant="outline" className="text-xs">
                Saving...
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Status controls */}
          {status === 'planning' && (
            <Button size="sm" variant="default" onClick={onStart}>
              <Play className="mr-1.5 size-4" /> Start
            </Button>
          )}
          {status === 'active' && (
            <>
              <Button size="sm" variant="outline" onClick={onPause}>
                <Pause className="mr-1.5 size-4" /> Pause
              </Button>
              <Button size="sm" variant="destructive" onClick={onEnd}>
                <Square className="mr-1.5 size-4" /> End
              </Button>
            </>
          )}
          {status === 'paused' && (
            <>
              <Button size="sm" variant="default" onClick={onStart}>
                <Play className="mr-1.5 size-4" /> Resume
              </Button>
              <Button size="sm" variant="destructive" onClick={onEnd}>
                <Square className="mr-1.5 size-4" /> End
              </Button>
            </>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="mr-1.5 size-4" /> Save
          </Button>

          <div className="border-border flex gap-2 border-l pl-2">
            <Button size="sm" variant="outline" onClick={onAddCharacter}>
              <User className="mr-1.5 size-4" /> Character
            </Button>
            <Button size="sm" variant="outline" onClick={onAddAdversary}>
              <Swords className="mr-1.5 size-4" /> Adversary
            </Button>
            <Button size="sm" variant="outline" onClick={onAddEnvironment}>
              <Leaf className="mr-1.5 size-4" /> Environment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
