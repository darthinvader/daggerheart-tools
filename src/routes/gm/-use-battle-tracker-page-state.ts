/**
 * Battle Tracker Page State Hook
 *
 * Extracted state management for BattleTrackerPage.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type {
  AdversaryTracker,
  EnvironmentTracker,
  TrackerSelection,
} from '@/components/battle-tracker/types';
import type { CharacterTracker } from '@/components/battle-tracker/types';
import { useBattleDialogState } from '@/components/battle-tracker/use-battle-tracker-state';
import {
  battleAdversariesToTrackers,
  battleCharactersToTrackers,
  battleEnvironmentsToTrackers,
} from '@/components/battle-tracker/use-campaign-battle';
import { useUndoableRosterState } from '@/components/battle-tracker/use-undoable-roster-state';
import type { ConditionsState } from '@/components/conditions';
import {
  createBattle,
  createStandaloneBattle,
  deleteStandaloneBattle,
  getStandaloneBattle,
  updateStandaloneBattle,
} from '@/features/campaigns/campaign-storage';
import { useCampaigns } from '@/features/campaigns/use-campaign-query';
import type { BattleState } from '@/lib/schemas/battle';
import { generateId } from '@/lib/utils';
import { useBattleEntityHandlers } from './-use-battle-entity-handlers';

// =====================================
// Payload Builders (pure functions)
// =====================================

function conditionsToRecord(
  conditions: ConditionsState | undefined
): Record<string, boolean> {
  if (!conditions?.items) return {};
  return Object.fromEntries(conditions.items.map(item => [item, true]));
}

function mapCharacterToPayload(character: CharacterTracker) {
  return {
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
  };
}

function mapAdversaryToPayload(adversary: AdversaryTracker) {
  return {
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
  };
}

function mapEnvironmentToPayload(environment: EnvironmentTracker) {
  return {
    id: environment.id,
    source: environment.source,
    notes: environment.notes,
    features: environment.features,
    countdown: environment.countdown,
  };
}

interface RosterStateForPayload {
  characters: CharacterTracker[];
  adversaries: AdversaryTracker[];
  environments: EnvironmentTracker[];
  spotlight: TrackerSelection | null;
  spotlightHistory: TrackerSelection[];
  fearPool: number;
  useMassiveThreshold: boolean;
}

function buildBattlePayload(
  rosterState: RosterStateForPayload,
  battleName: string,
  battleStatus: BattleState['status']
): Omit<BattleState, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: battleName.trim() || 'Untitled Battle',
    characters: rosterState.characters.map(mapCharacterToPayload),
    adversaries: rosterState.adversaries.map(mapAdversaryToPayload),
    environments: rosterState.environments.map(mapEnvironmentToPayload),
    spotlight: rosterState.spotlight ?? null,
    spotlightHistory: rosterState.spotlightHistory ?? [],
    spotlightHistoryTimeline: [],
    rollHistory: [],
    currentRound: 1,
    fearPool: rosterState.fearPool ?? 0,
    useMassiveThreshold: rosterState.useMassiveThreshold ?? false,
    notes: '',
    status: battleStatus,
  };
}

function buildRosterStatePayload(
  rosterState: RosterStateForPayload
): RosterStateForPayload {
  return {
    characters: rosterState.characters,
    adversaries: rosterState.adversaries,
    environments: rosterState.environments,
    spotlight: rosterState.spotlight,
    spotlightHistory: rosterState.spotlightHistory,
    fearPool: rosterState.fearPool,
    useMassiveThreshold: rosterState.useMassiveThreshold,
  };
}

// =====================================
// Sub-hooks
// =====================================

function useInitialBattleLoader(
  initialBattleId: string | undefined,
  onLoaded: (battle: BattleState) => void
) {
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  const { data: initialBattle } = useQuery({
    queryKey: ['standalone-battle', initialBattleId],
    queryFn: () =>
      initialBattleId ? getStandaloneBattle(initialBattleId) : null,
    enabled: !!initialBattleId && !hasLoadedInitial,
  });

  React.useEffect(() => {
    if (initialBattle && !hasLoadedInitial) {
      onLoaded(initialBattle);
      setHasLoadedInitial(true);
    }
  }, [initialBattle, hasLoadedInitial, onLoaded]);
}

interface LinkToCampaignParams {
  rosterState: RosterStateForPayload;
  battleName: string;
  battleStatus: BattleState['status'];
  activeBattleId: string | null;
}

function useLinkToCampaignDialog(params: LinkToCampaignParams) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');

  const linkToCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const payloadState = buildRosterStatePayload(params.rosterState);
      const battlePayload = buildBattlePayload(
        payloadState,
        params.battleName,
        params.battleStatus
      );
      const campaignBattle = await createBattle(campaignId, battlePayload);
      if (params.activeBattleId) {
        await deleteStandaloneBattle(params.activeBattleId);
      }
      return { campaignId, battleId: campaignBattle.id };
    },
    onSuccess: ({ campaignId, battleId }) => {
      void queryClient.invalidateQueries({ queryKey: ['standalone-battles'] });
      void queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
      void navigate({
        to: '/gm/campaigns/$id/battle',
        params: { id: campaignId },
        search: { battleId, tab: 'overview' as const },
      });
    },
    onError: () => toast.error('Failed to link battle to campaign'),
  });

  const handleLinkToCampaign = useCallback(() => {
    if (selectedCampaignId) {
      linkToCampaignMutation.mutate(selectedCampaignId);
      setIsLinkDialogOpen(false);
    }
  }, [selectedCampaignId, linkToCampaignMutation]);

  return {
    isLinkDialogOpen,
    setIsLinkDialogOpen,
    selectedCampaignId,
    setSelectedCampaignId,
    linkToCampaignMutation,
    handleLinkToCampaign,
  };
}

// =====================================
// Battle State Hook
// =====================================

export function useBattleTrackerPageState(initialBattleId?: string) {
  const queryClient = useQueryClient();
  const { rosterState, rosterActions, undoActions } = useUndoableRosterState();
  const { dialogState, dialogActions } = useBattleDialogState();

  // Store rosterActions in ref to avoid dependency on unstable object reference
  const rosterActionsRef = React.useRef(rosterActions);

  // Update ref in effect to satisfy react-hooks/refs rule
  React.useEffect(() => {
    rosterActionsRef.current = rosterActions;
  });

  const [editingAdversary, setEditingAdversary] =
    useState<AdversaryTracker | null>(null);
  const [editingEnvironment, setEditingEnvironment] =
    useState<EnvironmentTracker | null>(null);
  const [isFightBuilderOpen, setIsFightBuilderOpen] = useState(false);
  const [battleName, setBattleName] = useState('Untitled Battle');
  const [battleStatus, setBattleStatus] =
    useState<BattleState['status']>('planning');
  const [activeBattleId, setActiveBattleId] = useState<string | null>(null);

  const { data: campaigns = [] } = useCampaigns();

  // Load initial battle from standalone storage
  const handleBattleLoaded = useCallback((battle: BattleState) => {
    setActiveBattleId(battle.id);
    setBattleName(battle.name);
    setBattleStatus(battle.status ?? 'planning');
    rosterActionsRef.current.setCharacters(battleCharactersToTrackers(battle));
    rosterActionsRef.current.setAdversaries(
      battleAdversariesToTrackers(battle)
    );
    rosterActionsRef.current.setEnvironments(
      battleEnvironmentsToTrackers(battle)
    );
    rosterActionsRef.current.setSpotlight(battle.spotlight ?? null);
    rosterActionsRef.current.setSpotlightHistory(battle.spotlightHistory ?? []);
    rosterActionsRef.current.setFearPool(battle.fearPool ?? 0);
    rosterActionsRef.current.setUseMassiveThreshold(
      battle.useMassiveThreshold ?? false
    );
  }, []);
  useInitialBattleLoader(initialBattleId, handleBattleLoaded);

  // Link to campaign dialog state
  const {
    isLinkDialogOpen,
    setIsLinkDialogOpen,
    selectedCampaignId,
    setSelectedCampaignId,
    linkToCampaignMutation,
    handleLinkToCampaign,
  } = useLinkToCampaignDialog({
    rosterState,
    battleName,
    battleStatus,
    activeBattleId,
  });

  // Save mutation
  const saveBattleMutation = useMutation({
    mutationFn: async () => {
      const now = new Date().toISOString();
      const payloadState = buildRosterStatePayload(rosterState);
      const basePayload = buildBattlePayload(
        payloadState,
        battleName,
        battleStatus
      );
      const payload: BattleState = {
        ...basePayload,
        id: activeBattleId ?? generateId(),
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
    onError: () => toast.error('Failed to save battle'),
  });

  // Entity handlers (extracted to separate hook)
  const {
    handleAddCharacter,
    handleAddAdversary,
    handleAddEnvironment,
    handleAddFromWizard,
    handleSaveAdversary,
    handleSaveEnvironment,
    handleReduceAllCountdowns,
  } = useBattleEntityHandlers({
    rosterActions,
    rosterState,
    dialogState,
    dialogActions,
    editingAdversary,
    editingEnvironment,
  });

  const handleNewBattle = useCallback(() => {
    setActiveBattleId(null);
    setBattleName('Untitled Battle');
    setBattleStatus('planning');
    rosterActionsRef.current.setCharacters([]);
    rosterActionsRef.current.setAdversaries([]);
    rosterActionsRef.current.setEnvironments([]);
    rosterActionsRef.current.setSpotlight(null);
    rosterActionsRef.current.setSpotlightHistory([]);
    rosterActionsRef.current.setFearPool(0);
    rosterActionsRef.current.setUseMassiveThreshold(false);
  }, []);

  return {
    // State
    rosterState,
    rosterActions,
    undoActions,
    dialogState,
    dialogActions,
    battleName,
    setBattleName,
    battleStatus,
    setBattleStatus,
    activeBattleId,
    campaigns,
    editingAdversary,
    setEditingAdversary,
    editingEnvironment,
    setEditingEnvironment,
    isFightBuilderOpen,
    setIsFightBuilderOpen,
    isLinkDialogOpen,
    setIsLinkDialogOpen,
    selectedCampaignId,
    setSelectedCampaignId,

    // Mutations
    saveBattleMutation,
    linkToCampaignMutation,

    // Handlers
    handleAddCharacter,
    handleAddAdversary,
    handleAddEnvironment,
    handleAddFromWizard,
    handleSaveAdversary,
    handleSaveEnvironment,
    handleNewBattle,
    handleReduceAllCountdowns,
    handleLinkToCampaign,
  };
}
