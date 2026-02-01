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
  Wand2,
} from 'lucide-react';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AddAdversaryDialogEnhanced } from '@/components/battle-tracker/adversary-dialog-enhanced';
import { CampaignCharacterDialog } from '@/components/battle-tracker/campaign-character-dialog';
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
  CharacterTracker,
  EnvironmentTracker,
} from '@/components/battle-tracker/types';
import {
  useBattleDialogState,
  useBattleRosterState,
} from '@/components/battle-tracker/use-battle-tracker-state';
import { useCampaignBattle } from '@/components/battle-tracker/use-campaign-battle';
import {
  useCharacterRealtimeSync,
  useRefreshLinkedCharacter,
} from '@/components/battle-tracker/use-character-realtime';
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
import type { Adversary } from '@/lib/schemas/adversaries';
import type { BattleState } from '@/lib/schemas/battle';
import type { Campaign } from '@/lib/schemas/campaign';

export const Route = createFileRoute('/gm/campaigns/$id/battle')({
  component: CampaignBattlePage,
  validateSearch: (
    search: Record<string, unknown>
  ): { battleId?: string; new?: boolean } => {
    return {
      battleId: search.battleId as string | undefined,
      new: search.new === true || search.new === 'true',
    };
  },
  loader: async ({ params }) => {
    const campaign = await getCampaign(params.id);
    return { campaign };
  },
});

function useSavedBattleIds(campaign: Campaign | null) {
  const savedBattleIdsRef = useRef<Set<string>>(
    new Set(campaign?.battles?.map(b => b.id) ?? [])
  );

  useEffect(() => {
    savedBattleIdsRef.current = new Set(
      campaign?.battles?.map(b => b.id) ?? []
    );
  }, [campaign]);

  return savedBattleIdsRef;
}

function useInitialBattleLoad({
  campaign,
  initialBattleId,
  isNewBattle,
  campaignId,
  hasLoadedInitialBattle,
  setHasLoadedInitialBattle,
  rosterActions,
  loadBattleState,
  resetBattle,
  navigate,
}: {
  campaign: Campaign | null;
  initialBattleId?: string;
  isNewBattle?: boolean;
  campaignId: string;
  hasLoadedInitialBattle: boolean;
  setHasLoadedInitialBattle: (value: boolean) => void;
  rosterActions: ReturnType<typeof useBattleRosterState>['rosterActions'];
  loadBattleState: (state: BattleState) => void;
  resetBattle: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  useEffect(() => {
    if (!campaign || hasLoadedInitialBattle) return;

    let battleToLoad: BattleState | undefined;

    if (initialBattleId) {
      battleToLoad = campaign.battles?.find(b => b.id === initialBattleId);
    }

    // Only auto-load active/paused battles if not explicitly creating a new one
    if (!battleToLoad && !isNewBattle) {
      battleToLoad = campaign.battles?.find(
        b => b.status === 'active' || b.status === 'paused'
      );
    }

    if (battleToLoad) {
      loadBattleState(battleToLoad);
      if (battleToLoad.id !== initialBattleId) {
        void navigate({
          to: '/gm/campaigns/$id/battle',
          params: { id: campaignId },
          search: { battleId: battleToLoad.id, tab: 'gm-tools' },
          replace: true,
        });
      }
    } else {
      rosterActions.setCharacters([]);
      rosterActions.setAdversaries([]);
      rosterActions.setEnvironments([]);
      rosterActions.setSpotlightHistory([]);
      rosterActions.setSpotlight(null);
      rosterActions.setFearPool(0);
      rosterActions.setUseMassiveThreshold(false);
      resetBattle();
    }

    setHasLoadedInitialBattle(true);
  }, [
    campaign,
    initialBattleId,
    isNewBattle,
    hasLoadedInitialBattle,
    rosterActions,
    navigate,
    campaignId,
    loadBattleState,
    resetBattle,
    setHasLoadedInitialBattle,
  ]);
}

function BattleRosterLayout({
  rosterState,
  rosterActions,
  setEditingAdversary,
}: {
  rosterState: ReturnType<typeof useBattleRosterState>['rosterState'];
  rosterActions: ReturnType<typeof useBattleRosterState>['rosterActions'];
  setEditingAdversary: (value: AdversaryTracker | null) => void;
}) {
  return (
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
            useMassiveThreshold={rosterState.useMassiveThreshold}
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
  );
}

function BattleDialogs({
  dialogState,
  dialogActions,
  campaignPlayers,
  existingCharacterIds,
  selectedAdversary,
  selectedEnvironment,
  isFightBuilderOpen,
  currentCharacterCount,
  onAddCampaignCharacter,
  onAddManualCharacter,
  onAddAdversary,
  onAddEnvironment,
  onSaveAdversary,
  onSaveEnvironment,
  onCloseAdversaryEdit,
  onCloseEnvironmentEdit,
  onCloseFightBuilder,
  onAddFromWizard,
}: {
  dialogState: ReturnType<typeof useBattleDialogState>['dialogState'];
  dialogActions: ReturnType<typeof useBattleDialogState>['dialogActions'];
  campaignPlayers: Campaign['players'];
  existingCharacterIds: string[];
  selectedAdversary: AdversaryTracker | null;
  selectedEnvironment: EnvironmentTracker | null;
  isFightBuilderOpen: boolean;
  currentCharacterCount: number;
  onAddCampaignCharacter: (tracker: CharacterTracker) => void;
  onAddManualCharacter: () => void;
  onAddAdversary: (
    adversary: Parameters<
      ReturnType<typeof useBattleRosterState>['rosterActions']['addAdversary']
    >[0]
  ) => void;
  onAddEnvironment: (
    environment: Parameters<
      ReturnType<typeof useBattleRosterState>['rosterActions']['addEnvironment']
    >[0]
  ) => void;
  onSaveAdversary: (updates: Partial<AdversaryTracker>) => void;
  onSaveEnvironment: (updates: Partial<EnvironmentTracker>) => void;
  onCloseAdversaryEdit: () => void;
  onCloseEnvironmentEdit: () => void;
  onCloseFightBuilder: () => void;
  onAddFromWizard: (
    adversaries: { adversary: Adversary; count: number }[]
  ) => void;
}) {
  return (
    <>
      <CampaignCharacterDialog
        isOpen={dialogState.isAddCharacterOpen}
        onOpenChange={dialogActions.setIsAddCharacterOpen}
        campaignPlayers={campaignPlayers ?? []}
        existingCharacterIds={existingCharacterIds}
        onAddCampaignCharacter={onAddCampaignCharacter}
        onAddManualCharacter={onAddManualCharacter}
        characterDraft={dialogState.characterDraft}
        onDraftChange={dialogActions.setCharacterDraft}
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
        adversary={selectedAdversary}
        isOpen={selectedAdversary !== null}
        onOpenChange={open => !open && onCloseAdversaryEdit()}
        onSave={onSaveAdversary}
      />

      <EditEnvironmentDialog
        environment={selectedEnvironment}
        isOpen={selectedEnvironment !== null}
        onOpenChange={open => !open && onCloseEnvironmentEdit()}
        onSave={onSaveEnvironment}
      />

      <FightBuilderWizard
        isOpen={isFightBuilderOpen}
        onOpenChange={open => !open && onCloseFightBuilder()}
        onAddAdversaries={onAddFromWizard}
        currentCharacterCount={currentCharacterCount}
      />
    </>
  );
}

async function refreshCampaignState(
  campaignId: string,
  setCampaign: (campaign: Campaign) => void
) {
  const updated = await getCampaign(campaignId);
  if (updated) setCampaign(updated);
}

async function saveExistingBattle(campaignId: string, state: BattleState) {
  await updateBattle(campaignId, state.id, state);
}

async function createNewBattle({
  campaignId,
  state,
  savedBattleIdsRef,
  justSavedBattleIdRef,
  navigate,
}: {
  campaignId: string;
  state: BattleState;
  savedBattleIdsRef: MutableRefObject<Set<string>>;
  justSavedBattleIdRef: MutableRefObject<string | null>;
  navigate: ReturnType<typeof useNavigate>;
}): Promise<string> {
  const created = await createBattle(campaignId, state);
  savedBattleIdsRef.current.add(created.id);
  justSavedBattleIdRef.current = created.id;
  void navigate({
    to: '/gm/campaigns/$id/battle',
    params: { id: campaignId },
    search: { battleId: created.id, tab: 'gm-tools' },
    replace: true,
  });
  return created.id;
}

function useBattleDialogHandlers({
  rosterActions,
  dialogState,
  dialogActions,
  campaignBattle,
  handleStateChange,
  editingAdversary,
  editingEnvironment,
}: {
  rosterActions: ReturnType<typeof useBattleRosterState>['rosterActions'];
  dialogState: ReturnType<typeof useBattleDialogState>['dialogState'];
  dialogActions: ReturnType<typeof useBattleDialogState>['dialogActions'];
  campaignBattle: ReturnType<typeof useCampaignBattle>;
  handleStateChange: (state: BattleState) => Promise<void>;
  editingAdversary: AdversaryTracker | null;
  editingEnvironment: EnvironmentTracker | null;
}) {
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

  return {
    handleAddCharacter,
    handleAddCampaignCharacter,
    handleAddAdversary,
    handleAddEnvironment,
    handleSaveAdversary,
    handleSaveEnvironment,
    handleManualSave,
  };
}

function CampaignBattlePage() {
  const { campaign: initialCampaign } = Route.useLoaderData();
  const { id: campaignId } = Route.useParams();
  const { battleId: initialBattleId, new: isNewBattle } = Route.useSearch();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<Campaign | null>(
    initialCampaign ?? null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Track if we've loaded the initial battle to prevent re-loading
  const [hasLoadedInitialBattle, setHasLoadedInitialBattle] = useState(false);

  // Track when we saved a battle - don't reset state after our own save
  const justSavedBattleIdRef = useRef<string | null>(null);

  // Reset state when campaign changes from route (different campaign ID)
  // Skip reset if we just saved a battle ourselves
  useEffect(() => {
    if (justSavedBattleIdRef.current === initialBattleId) {
      // We triggered this navigation after saving - don't reset
      justSavedBattleIdRef.current = null;
      return;
    }
    setCampaign(initialCampaign ?? null);
    setHasLoadedInitialBattle(false);
  }, [initialCampaign, initialBattleId]);

  // Core roster state
  const { rosterState, rosterActions } = useBattleRosterState();
  const { dialogState, dialogActions } = useBattleDialogState(campaignId);

  // Subscribe to realtime character updates from players
  useCharacterRealtimeSync(
    rosterState.characters,
    rosterActions.updateCharacter
  );

  const refreshLinkedCharacter = useRefreshLinkedCharacter();
  const refreshedCharacterIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!hasLoadedInitialBattle) return;

    rosterState.characters.forEach(character => {
      if (!character.isLinkedCharacter || !character.sourceCharacterId) return;

      const sourceId = character.sourceCharacterId;
      if (refreshedCharacterIdsRef.current.has(sourceId)) return;

      refreshedCharacterIdsRef.current.add(sourceId);
      void refreshLinkedCharacter(
        sourceId,
        character.id,
        rosterActions.updateCharacter
      );
    });
  }, [
    hasLoadedInitialBattle,
    refreshLinkedCharacter,
    rosterActions.updateCharacter,
    rosterState.characters,
  ]);

  // Edit dialog state
  const [editingAdversary, setEditingAdversary] =
    useState<AdversaryTracker | null>(null);
  const [editingEnvironment, setEditingEnvironment] =
    useState<EnvironmentTracker | null>(null);
  const [isFightBuilderOpen, setIsFightBuilderOpen] = useState(false);

  const savedBattleIdsRef = useSavedBattleIds(campaign);
  const campaignBattleRef = useRef<ReturnType<typeof useCampaignBattle> | null>(
    null
  );

  // Handle save - use the hook's battleId to determine create vs update
  const handleStateChange = useCallback(
    async (state: BattleState) => {
      if (!campaignId) return;
      setIsSaving(true);
      try {
        const battleExists = savedBattleIdsRef.current.has(state.id);
        if (battleExists) {
          await saveExistingBattle(campaignId, state);
        } else {
          const createdId = await createNewBattle({
            campaignId,
            state,
            savedBattleIdsRef,
            justSavedBattleIdRef,
            navigate,
          });
          if (createdId !== state.id) {
            campaignBattleRef.current?.setBattleId(createdId);
          }
        }
        // Mark as clean after successful save
        campaignBattleRef.current?.markClean();
        await refreshCampaignState(campaignId, setCampaign);
      } catch (error) {
        console.error('Failed to save battle:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [campaignId, navigate, savedBattleIdsRef]
  );

  // Campaign battle integration
  const campaignBattle = useCampaignBattle(rosterState, rosterActions, {
    campaignId,
    battleId: initialBattleId,
    autoSaveDebounceMs: 3000,
    onStateChange: handleStateChange,
  });
  campaignBattleRef.current = campaignBattle;

  useInitialBattleLoad({
    campaign,
    initialBattleId,
    isNewBattle,
    campaignId,
    hasLoadedInitialBattle,
    setHasLoadedInitialBattle,
    rosterActions,
    loadBattleState: campaignBattle.loadBattleState,
    resetBattle: campaignBattle.resetBattle,
    navigate,
  });

  // Get existing character IDs to filter out already-added characters
  const existingCharacterIds = useMemo(
    () =>
      rosterState.characters
        .map(c => c.sourceCharacterId)
        .filter((id): id is string => Boolean(id)),
    [rosterState.characters]
  );

  const {
    handleAddCharacter,
    handleAddCampaignCharacter,
    handleAddAdversary,
    handleAddEnvironment,
    handleSaveAdversary,
    handleSaveEnvironment,
    handleManualSave,
  } = useBattleDialogHandlers({
    rosterActions,
    dialogState,
    dialogActions,
    campaignBattle,
    handleStateChange,
    editingAdversary,
    editingEnvironment,
  });

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
        onOpenFightBuilder={() => setIsFightBuilderOpen(true)}
      />

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

      <BattleRosterLayout
        rosterState={rosterState}
        rosterActions={rosterActions}
        setEditingAdversary={setEditingAdversary}
      />

      <BattleDialogs
        dialogState={dialogState}
        dialogActions={dialogActions}
        campaignPlayers={campaign.players ?? []}
        existingCharacterIds={existingCharacterIds}
        selectedAdversary={editingAdversary}
        selectedEnvironment={editingEnvironment}
        isFightBuilderOpen={isFightBuilderOpen}
        currentCharacterCount={rosterState.characters.length}
        onAddCampaignCharacter={handleAddCampaignCharacter}
        onAddManualCharacter={handleAddCharacter}
        onAddAdversary={handleAddAdversary}
        onAddEnvironment={handleAddEnvironment}
        onSaveAdversary={handleSaveAdversary}
        onSaveEnvironment={handleSaveEnvironment}
        onCloseAdversaryEdit={() => setEditingAdversary(null)}
        onCloseEnvironmentEdit={() => setEditingEnvironment(null)}
        onCloseFightBuilder={() => setIsFightBuilderOpen(false)}
        onAddFromWizard={adversaries => {
          for (const { adversary, count } of adversaries) {
            for (let i = 0; i < count; i++) {
              handleAddAdversary(adversary);
            }
          }
        }}
      />
    </div>
  );
}

// =====================================================================================
// Header Component
// =====================================================================================

const STATUS_COLORS = {
  planning: 'bg-muted text-muted-foreground',
  active: 'bg-green-500/20 text-green-700 dark:text-green-400',
  paused: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  completed: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
} as const;

type BattleStatus = keyof typeof STATUS_COLORS;

function SaveStatusIndicator({
  isSaving,
  isDirty,
  isAutoSaveEnabled,
}: {
  isSaving: boolean;
  isDirty: boolean;
  isAutoSaveEnabled: boolean;
}) {
  if (isSaving) {
    return (
      <Badge variant="outline" className="gap-1 text-xs">
        <Loader2 className="size-3 animate-spin" />
        Saving...
      </Badge>
    );
  }
  if (isDirty && !isAutoSaveEnabled) {
    return (
      <Badge
        variant="outline"
        className="border-amber-300 text-xs text-amber-600"
      >
        Unsaved
      </Badge>
    );
  }
  if (isAutoSaveEnabled) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-green-300 text-xs text-green-600"
      >
        <Check className="size-3" />
        Auto-save
      </Badge>
    );
  }
  return null;
}

function SaveStatusTooltipContent({
  isSaving,
  isDirty,
  isAutoSaveEnabled,
}: {
  isSaving: boolean;
  isDirty: boolean;
  isAutoSaveEnabled: boolean;
}) {
  if (isSaving) return <p>Saving battle to campaign...</p>;
  if (isDirty && !isAutoSaveEnabled) {
    return (
      <p>
        You have unsaved changes. Start the battle for auto-save or save
        manually.
      </p>
    );
  }
  if (isAutoSaveEnabled) {
    return (
      <p>
        Changes are automatically saved every 3 seconds while the battle is
        active or paused.
      </p>
    );
  }
  return null;
}

function StatusTooltipContent({ status }: { status: BattleStatus }) {
  switch (status) {
    case 'planning':
      return <p>Click "Start" to begin the battle and enable auto-save</p>;
    case 'active':
      return <p>Battle in progress — changes auto-save every 3 seconds</p>;
    case 'paused':
      return <p>Battle paused — changes still auto-save</p>;
    case 'completed':
      return <p>Battle ended — use manual save if needed</p>;
  }
}

interface StatusControlsProps {
  status: BattleStatus;
  onStart: () => void;
  onPause: () => void;
  onEnd: () => void;
}

function StatusControls({
  status,
  onStart,
  onPause,
  onEnd,
}: StatusControlsProps) {
  switch (status) {
    case 'planning':
      return (
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
      );
    case 'active':
      return (
        <>
          <Button size="sm" variant="outline" onClick={onPause}>
            <Pause className="mr-1.5 size-4" /> Pause
          </Button>
          <Button size="sm" variant="destructive" onClick={onEnd}>
            <Square className="mr-1.5 size-4" /> End
          </Button>
        </>
      );
    case 'paused':
      return (
        <>
          <Button size="sm" variant="default" onClick={onStart}>
            <Play className="mr-1.5 size-4" /> Resume
          </Button>
          <Button size="sm" variant="destructive" onClick={onEnd}>
            <Square className="mr-1.5 size-4" /> End
          </Button>
        </>
      );
    case 'completed':
      return (
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
      );
  }
}

interface CampaignBattleHeaderProps {
  campaign: Campaign;
  battleName: string;
  status: BattleStatus;
  isDirty: boolean;
  isSaving: boolean;
  onNameChange: (name: string) => void;
  onStart: () => void;
  onPause: () => void;
  onEnd: () => void;
  onSave: () => void;
  onAddCharacter: () => void;
  onAddAdversary: () => void;
  onOpenFightBuilder: () => void;
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
  onOpenFightBuilder,
}: CampaignBattleHeaderProps) {
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
                  <Badge className={STATUS_COLORS[status]}>{status}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <StatusTooltipContent status={status} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <SaveStatusIndicator
                      isSaving={isSaving}
                      isDirty={isDirty}
                      isAutoSaveEnabled={isAutoSaveEnabled}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <SaveStatusTooltipContent
                    isSaving={isSaving}
                    isDirty={isDirty}
                    isAutoSaveEnabled={isAutoSaveEnabled}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusControls
            status={status}
            onStart={onStart}
            onPause={onPause}
            onEnd={onEnd}
          />

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
            <Button size="sm" onClick={onOpenFightBuilder} className="gap-1">
              <Wand2 className="size-4" /> Fight Builder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
