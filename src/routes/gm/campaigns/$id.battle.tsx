// Campaign battle tracker route - auto-saves battles to campaign

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  Check,
  Loader2,
  Pause,
  Play,
  Save,
  Square,
  Swords,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AddAdversaryDialogEnhanced } from '@/components/battle-tracker/adversary-dialog-enhanced';
import { CampaignCharacterDialog } from '@/components/battle-tracker/campaign-character-dialog';
import { DetailSidebar } from '@/components/battle-tracker/detail-sidebar';
import {
  EditAdversaryDialog,
  EditEnvironmentDialog,
} from '@/components/battle-tracker/edit-dialogs';
import { AddEnvironmentDialogEnhanced } from '@/components/battle-tracker/environment-dialog-enhanced';
import { GMResourcesBar } from '@/components/battle-tracker/gm-resources-bar';
import {
  AdversaryCard,
  CharacterCard,
} from '@/components/battle-tracker/roster-cards';
import { RosterColumn } from '@/components/battle-tracker/roster-column';
import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
} from '@/components/battle-tracker/types';
import {
  useBattleDialogState,
  useBattleRosterState,
} from '@/components/battle-tracker/use-battle-tracker-state';
import { useCampaignBattle } from '@/components/battle-tracker/use-campaign-battle';
import { useCharacterRealtimeSync } from '@/components/battle-tracker/use-character-realtime';
import { DEFAULT_CHARACTER_DRAFT } from '@/components/battle-tracker/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<Campaign | null>(
    initialCampaign ?? null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Track if we've loaded the initial battle to prevent re-loading
  const [hasLoadedInitialBattle, setHasLoadedInitialBattle] = useState(false);

  // Reset state when campaign or battleId changes from route
  useEffect(() => {
    setCampaign(initialCampaign ?? null);
    setHasLoadedInitialBattle(false);
  }, [initialCampaign, initialBattleId]);

  // Core roster state
  const { rosterState, rosterActions } = useBattleRosterState();
  const { dialogState, dialogActions } = useBattleDialogState();

  // Subscribe to realtime character updates from players
  useCharacterRealtimeSync(
    rosterState.characters,
    rosterActions.updateCharacter
  );

  // Edit dialog state
  const [editingAdversary, setEditingAdversary] =
    useState<AdversaryTracker | null>(null);
  const [editingEnvironment, setEditingEnvironment] =
    useState<EnvironmentTracker | null>(null);

  // Track saved battle IDs to know whether to create or update
  const savedBattleIdsRef = useRef<Set<string>>(
    new Set(campaign?.battles?.map(b => b.id) ?? [])
  );

  // Update the ref when campaign changes
  useEffect(() => {
    savedBattleIdsRef.current = new Set(
      campaign?.battles?.map(b => b.id) ?? []
    );
  }, [campaign]);

  // Campaign battle integration
  const campaignBattle = useCampaignBattle(rosterState, rosterActions, {
    campaignId,
    battleId: initialBattleId,
    autoSaveDebounceMs: 3000,
  });

  // Handle save - use the hook's battleId to determine create vs update
  const handleStateChange = useCallback(
    async (state: BattleState) => {
      if (!campaignId) return;
      setIsSaving(true);
      try {
        const battleExists = savedBattleIdsRef.current.has(state.id);
        if (battleExists) {
          await updateBattle(campaignId, state.id, state);
        } else {
          // Create new battle using the state's ID
          const created = await createBattle(campaignId, state);
          savedBattleIdsRef.current.add(created.id);
          // Sync the ID if it changed (createBattle may generate a new one)
          if (created.id !== state.id) {
            campaignBattle.setBattleId(created.id);
          }
          // Update URL to include the new battle ID
          void navigate({
            to: '/gm/campaigns/$id/battle',
            params: { id: campaignId },
            search: { battleId: created.id, tab: 'gm-tools' },
            replace: true,
          });
        }
        // Mark as clean after successful save
        campaignBattle.markClean();
        // Refresh campaign
        const updated = await getCampaign(campaignId);
        if (updated) setCampaign(updated);
      } catch (error) {
        console.error('Failed to save battle:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [campaignId, campaignBattle, navigate]
  );

  // Connect the state change handler to the campaign battle hook
  useEffect(() => {
    // Set up auto-save via effect since we can't pass handleStateChange to hook before it's defined
    if (
      campaignBattle.isDirty &&
      (campaignBattle.status === 'active' || campaignBattle.status === 'paused')
    ) {
      const timeoutId = setTimeout(() => {
        void handleStateChange(campaignBattle.toBattleState());
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [
    campaignBattle.isDirty,
    campaignBattle.status,
    campaignBattle,
    handleStateChange,
  ]);

  // Load existing battle if resuming (by battleId from URL or most recent active/paused)
  // Using a ref for loadBattleState to avoid dependency issues
  const loadBattleStateRef = useRef(campaignBattle.loadBattleState);
  loadBattleStateRef.current = campaignBattle.loadBattleState;

  useEffect(() => {
    if (!campaign || hasLoadedInitialBattle) return;

    let battleToLoad: BattleState | undefined;

    // First, try to load battle by ID from URL
    if (initialBattleId) {
      battleToLoad = campaign.battles?.find(b => b.id === initialBattleId);
    }

    // If no battleId provided, find most recent active/paused battle
    if (!battleToLoad) {
      battleToLoad = campaign.battles?.find(
        b => b.status === 'active' || b.status === 'paused'
      );
    }

    if (battleToLoad) {
      loadBattleStateRef.current(battleToLoad);
      // Update URL if we loaded a battle that wasn't in the URL
      if (battleToLoad.id !== initialBattleId) {
        void navigate({
          to: '/gm/campaigns/$id/battle',
          params: { id: campaignId },
          search: { battleId: battleToLoad.id, tab: 'gm-tools' },
          replace: true,
        });
      }
    } else {
      // No battle to load - reset to clean state
      rosterActions.setCharacters([]);
      rosterActions.setAdversaries([]);
      rosterActions.setEnvironments([]);
      rosterActions.setSpotlightHistory([]);
      rosterActions.setSpotlight(null);
      rosterActions.setFearPool(0);
    }

    setHasLoadedInitialBattle(true);
  }, [
    campaign,
    initialBattleId,
    hasLoadedInitialBattle,
    rosterActions,
    navigate,
    campaignId,
  ]);

  // Get existing character IDs to filter out already-added characters
  const existingCharacterIds = useMemo(
    () =>
      rosterState.characters
        .map(c => c.sourceCharacterId)
        .filter((id): id is string => Boolean(id)),
    [rosterState.characters]
  );

  // Handlers
  const handleAddCharacter = () => {
    const newId = rosterActions.addCharacter(dialogState.characterDraft);
    if (!newId) return;
    dialogActions.setCharacterDraft(DEFAULT_CHARACTER_DRAFT);
    dialogActions.setIsAddCharacterOpen(false);
  };

  const handleAddCampaignCharacter = (tracker: CharacterTracker) => {
    rosterActions.setCharacters(prev => [...prev, tracker]);
    rosterActions.handleSelect(tracker);
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
      />

      <GMResourcesBar
        characterCount={rosterState.characters.length}
        environments={rosterState.environments}
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

      {/* Dialogs */}
      <CampaignCharacterDialog
        isOpen={dialogState.isAddCharacterOpen}
        onOpenChange={dialogActions.setIsAddCharacterOpen}
        campaignPlayers={campaign.players ?? []}
        existingCharacterIds={existingCharacterIds}
        onAddCampaignCharacter={handleAddCampaignCharacter}
        onAddManualCharacter={handleAddCharacter}
        characterDraft={dialogState.characterDraft}
        onDraftChange={dialogActions.setCharacterDraft}
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
}: CampaignBattleHeaderProps) {
  const statusColors = {
    planning: 'bg-muted text-muted-foreground',
    active: 'bg-green-500/20 text-green-700 dark:text-green-400',
    paused: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    completed: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  };

  const isAutoSaveEnabled = status === 'active' || status === 'paused';

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link
              to="/gm/campaigns/$id"
              params={{ id: campaign.id }}
              search={{ tab: 'gm-tools' }}
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className={statusColors[status]}>{status}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {status === 'planning' && (
                    <p>
                      Click "Start" to begin the battle and enable auto-save
                    </p>
                  )}
                  {status === 'active' && (
                    <p>
                      Battle in progress — changes auto-save every 3 seconds
                    </p>
                  )}
                  {status === 'paused' && (
                    <p>Battle paused — changes still auto-save</p>
                  )}
                  {status === 'completed' && (
                    <p>Battle ended — use manual save if needed</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Save status indicator */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    {isSaving ? (
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Loader2 className="size-3 animate-spin" />
                        Saving...
                      </Badge>
                    ) : isDirty && !isAutoSaveEnabled ? (
                      <Badge
                        variant="outline"
                        className="border-amber-300 text-xs text-amber-600"
                      >
                        Unsaved
                      </Badge>
                    ) : isAutoSaveEnabled ? (
                      <Badge
                        variant="outline"
                        className="gap-1 border-green-300 text-xs text-green-600"
                      >
                        <Check className="size-3" />
                        Auto-save
                      </Badge>
                    ) : null}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {isSaving && <p>Saving battle to campaign...</p>}
                  {isDirty && !isAutoSaveEnabled && (
                    <p>
                      You have unsaved changes. Start the battle for auto-save
                      or save manually.
                    </p>
                  )}
                  {isAutoSaveEnabled && !isSaving && (
                    <p>
                      Changes are automatically saved every 3 seconds while the
                      battle is active or paused.
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Status controls */}
          {status === 'planning' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="default" onClick={onStart}>
                    <Play className="mr-1.5 size-4" /> Start
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start the battle and enable auto-save</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          {status === 'completed' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="default" onClick={onStart}>
                    <Play className="mr-1.5 size-4" /> Restart
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Restart the battle and enable auto-save</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onSave}
                  disabled={isSaving}
                >
                  <Save className="mr-1.5 size-4" /> Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isAutoSaveEnabled ? (
                  <p>Force save now (auto-save is enabled)</p>
                ) : (
                  <p>Save battle to campaign</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="border-border flex gap-2 border-l pl-2">
            <Button size="sm" variant="outline" onClick={onAddCharacter}>
              <User className="mr-1.5 size-4" /> Character
            </Button>
            <Button size="sm" variant="outline" onClick={onAddAdversary}>
              <Swords className="mr-1.5 size-4" /> Adversary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
