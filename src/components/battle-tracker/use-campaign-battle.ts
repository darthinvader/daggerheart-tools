import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { BattleState } from '@/lib/schemas/battle';

import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
  TrackerSelection,
} from './types';
import { normalizeEnvironmentFeature } from './utils';

// =====================================================================================
// Types
// =====================================================================================

type BattleStatus = 'planning' | 'active' | 'paused' | 'completed';

interface UseCampaignBattleOptions {
  /** If provided, battles will be saved to this campaign */
  campaignId?: string;
  /** If provided, loads this specific battle */
  battleId?: string;
  /** Optional session ID for tracking which session the battle occurred in */
  sessionId?: string;
  /** Callback when battle state changes (for manual save implementations) */
  onStateChange?: (state: BattleState) => void;
  /** Auto-save debounce interval in ms (default: 2000) */
  autoSaveDebounceMs?: number;
}

interface CampaignBattleActions {
  /** Serialize current tracker state to BattleState */
  toBattleState: () => BattleState;
  /** Load a battle state into the tracker */
  loadBattleState: (state: BattleState) => void;
  /** Mark battle as active */
  startBattle: () => void;
  /** Mark battle as paused */
  pauseBattle: () => void;
  /** Mark battle as completed */
  endBattle: () => void;
  /** Set battle name */
  setBattleName: (name: string) => void;
  /** Set battle notes */
  setBattleNotes: (notes: string) => void;
  /** Set battle ID (for syncing after save) */
  setBattleId: (id: string) => void;
  /** Get current status */
  status: BattleStatus;
  /** Battle name */
  name: string;
  /** Battle notes */
  notes: string;
  /** Current battle ID */
  battleId: string;
  /** Whether there are unsaved changes */
  isDirty: boolean;
  /** Mark the battle as clean (no unsaved changes) */
  markClean: () => void;
}

// =====================================================================================
// Hook: useCampaignBattle
// =====================================================================================

/**
 * Hook that adds campaign integration to the battle tracker.
 * Handles serialization, loading, and auto-save of battle state.
 */
export function useCampaignBattle(
  rosterState: {
    characters: CharacterTracker[];
    adversaries: AdversaryTracker[];
    environments: EnvironmentTracker[];
    spotlight: TrackerSelection | null;
    spotlightHistory: TrackerSelection[];
    fearPool: number;
  },
  rosterActions: {
    setSpotlight: (selection: TrackerSelection | null) => void;
    setCharacters: React.Dispatch<React.SetStateAction<CharacterTracker[]>>;
    setAdversaries: React.Dispatch<React.SetStateAction<AdversaryTracker[]>>;
    setEnvironments: React.Dispatch<React.SetStateAction<EnvironmentTracker[]>>;
    setSpotlightHistory: React.Dispatch<
      React.SetStateAction<TrackerSelection[]>
    >;
    setFearPool: (value: number) => void;
  },
  options: UseCampaignBattleOptions = {}
): CampaignBattleActions {
  const {
    campaignId,
    sessionId,
    onStateChange,
    autoSaveDebounceMs = 2000,
  } = options;

  // Battle metadata
  const [battleId, setBattleId] = useState(
    () => options.battleId ?? `battle-${crypto.randomUUID()}`
  );
  const [name, setName] = useState('New Battle');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<BattleStatus>('planning');
  const [isDirty, setIsDirty] = useState(false);

  // Timestamps
  const createdAtRef = useRef(new Date().toISOString());

  // Convert ConditionsState { items: string[] } to Record<string, boolean>
  const conditionsToRecord = (
    conditions: { items: string[] } | undefined
  ): Record<string, boolean> => {
    if (!conditions?.items) return {};
    return Object.fromEntries(conditions.items.map(item => [item, true]));
  };

  // Convert current state to BattleState
  const toBattleState = useCallback((): BattleState => {
    return {
      id: battleId,
      name,
      campaignId,
      sessionId,
      characters: rosterState.characters.map(c => ({
        id: c.id,
        name: c.name,
        evasion: c.evasion ?? 10,
        hp: c.hp,
        stress: c.stress,
        conditions: conditionsToRecord(c.conditions),
        notes: c.notes,
        // Extended fields for campaign characters
        sourceCharacterId: c.sourceCharacterId,
        className: c.className,
        subclassName: c.subclassName,
        loadout: c.loadout,
        armorScore: c.armorScore,
        thresholds: c.thresholds,
        isLinkedCharacter: c.isLinkedCharacter,
        ancestry: c.ancestry,
        community: c.community,
        pronouns: c.pronouns,
        level: c.level,
        tier: c.tier,
        proficiency: c.proficiency,
        hope: c.hope,
        armorSlots: c.armorSlots,
        gold: c.gold,
        experiences: c.experiences,
        primaryWeapon: c.primaryWeapon,
        secondaryWeapon: c.secondaryWeapon,
        armor: c.armor,
        equipment: c.equipment,
        coreScores: c.coreScores,
        traits: c.traits,
        inventory: c.inventory,
        vaultCards: c.vaultCards,
      })),
      adversaries: rosterState.adversaries.map(a => ({
        id: a.id,
        source: a.source,
        hp: a.hp,
        stress: a.stress,
        conditions: conditionsToRecord(a.conditions),
        notes: a.notes,
      })),
      environments: rosterState.environments.map(e => ({
        id: e.id,
        source: e.source,
        notes: e.notes,
        features: e.features,
        countdown: e.countdown,
      })),
      spotlight: rosterState.spotlight,
      spotlightHistory: rosterState.spotlightHistory,
      fearPool: rosterState.fearPool,
      notes,
      status,
      createdAt: createdAtRef.current,
      updatedAt: new Date().toISOString(),
    };
  }, [
    battleId,
    name,
    campaignId,
    sessionId,
    rosterState.characters,
    rosterState.adversaries,
    rosterState.environments,
    rosterState.spotlight,
    rosterState.spotlightHistory,
    rosterState.fearPool,
    notes,
    status,
  ]);

  // Load a battle state
  const loadBattleState = useCallback(
    (state: BattleState) => {
      setBattleId(state.id);
      setName(state.name);
      setNotes(state.notes);
      setStatus(state.status);
      createdAtRef.current = state.createdAt;

      // Load characters, adversaries, environments into roster
      rosterActions.setCharacters(battleCharactersToTrackers(state));
      rosterActions.setAdversaries(battleAdversariesToTrackers(state));
      rosterActions.setEnvironments(battleEnvironmentsToTrackers(state));

      // Fear pool
      rosterActions.setFearPool(state.fearPool);

      // Spotlight - always set, even if null
      rosterActions.setSpotlight(state.spotlight);

      // Spotlight history - always set, even if empty
      rosterActions.setSpotlightHistory(state.spotlightHistory ?? []);

      setIsDirty(false);
    },
    [rosterActions]
  );

  // Status actions
  const startBattle = useCallback(() => {
    setStatus('active');
    setIsDirty(true);
  }, []);

  const pauseBattle = useCallback(() => {
    setStatus('paused');
    setIsDirty(true);
  }, []);

  const endBattle = useCallback(() => {
    setStatus('completed');
    setIsDirty(true);
  }, []);

  const setBattleName = useCallback((newName: string) => {
    setName(newName);
    setIsDirty(true);
  }, []);

  const setBattleNotes = useCallback((newNotes: string) => {
    setNotes(newNotes);
    setIsDirty(true);
  }, []);

  const markClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  // Mark dirty when roster changes
  const prevRosterRef = useRef(rosterState);
  /* eslint-disable react-hooks/set-state-in-effect -- Tracking roster changes to mark dirty is a valid pattern */
  useEffect(() => {
    if (prevRosterRef.current !== rosterState) {
      setIsDirty(true);
      prevRosterRef.current = rosterState;
    }
  }, [rosterState]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Auto-save debounced callback - only when battle is active or paused
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    // Only auto-save when battle is in progress (active or paused)
    const shouldAutoSave = status === 'active' || status === 'paused';
    if (!isDirty || !onStateChange || !shouldAutoSave) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      onStateChange(toBattleState());
      setIsDirty(false);
    }, autoSaveDebounceMs);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isDirty, onStateChange, toBattleState, autoSaveDebounceMs, status]);

  return useMemo(
    () => ({
      toBattleState,
      loadBattleState,
      startBattle,
      pauseBattle,
      endBattle,
      setBattleName,
      setBattleNotes,
      setBattleId,
      markClean,
      status,
      name,
      notes,
      battleId,
      isDirty,
    }),
    [
      toBattleState,
      loadBattleState,
      startBattle,
      pauseBattle,
      endBattle,
      setBattleName,
      setBattleNotes,
      setBattleId,
      markClean,
      status,
      name,
      notes,
      battleId,
      isDirty,
    ]
  );
}

// =====================================================================================
// Utilities: Convert BattleState back to tracker entries
// =====================================================================================

/**
 * Convert Record<string, boolean> conditions back to { items: string[] }
 */
function recordToConditions(record: Record<string, boolean> | undefined): {
  items: string[];
} {
  if (!record) return { items: [] };
  return {
    items: Object.entries(record)
      .filter(([, v]) => v)
      .map(([k]) => k),
  };
}

/**
 * Convert a BattleState's characters back to CharacterTracker[]
 */
export function battleCharactersToTrackers(
  battle: BattleState
): CharacterTracker[] {
  return battle.characters.map(c => ({
    id: c.id,
    kind: 'character' as const,
    name: c.name,
    evasion: c.evasion ?? 10,
    hp: c.hp,
    stress: c.stress,
    conditions: recordToConditions(c.conditions),
    notes: c.notes,
    // Extended fields for campaign characters
    sourceCharacterId: c.sourceCharacterId,
    className: c.className,
    subclassName: c.subclassName,
    loadout: c.loadout,
    armorScore: c.armorScore,
    thresholds: c.thresholds,
    isLinkedCharacter: c.isLinkedCharacter,
    ancestry: c.ancestry,
    community: c.community,
    pronouns: c.pronouns,
    level: c.level,
    tier: c.tier,
    proficiency: c.proficiency,
    hope: c.hope,
    armorSlots: c.armorSlots,
    gold: c.gold,
    experiences: c.experiences,
    primaryWeapon: c.primaryWeapon,
    secondaryWeapon: c.secondaryWeapon,
    armor: c.armor,
    equipment: c.equipment,
    coreScores: c.coreScores,
    traits: c.traits,
    inventory: c.inventory,
    vaultCards: c.vaultCards,
  }));
}

/**
 * Convert a BattleState's adversaries back to AdversaryTracker[]
 */
export function battleAdversariesToTrackers(
  battle: BattleState
): AdversaryTracker[] {
  return battle.adversaries.map(a => ({
    id: a.id,
    kind: 'adversary' as const,
    source: a.source,
    hp: a.hp,
    stress: a.stress,
    conditions: recordToConditions(a.conditions),
    notes: a.notes,
  }));
}

/**
 * Convert a BattleState's environments back to EnvironmentTracker[]
 */
export function battleEnvironmentsToTrackers(
  battle: BattleState
): EnvironmentTracker[] {
  return battle.environments.map(e => ({
    id: e.id,
    kind: 'environment' as const,
    source: e.source,
    notes: e.notes,
    features:
      e.features ??
      e.source.features.map((f, i) => normalizeEnvironmentFeature(f, i)),
    countdown: e.countdown,
  }));
}
