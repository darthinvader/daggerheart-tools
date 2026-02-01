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
  /** Callback when battle state changes (for manual save implementations). Call markClean() on success. */
  onStateChange?: (state: BattleState) => void | Promise<void>;
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
  /** Reset battle metadata to defaults */
  resetBattle: () => void;
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
    useMassiveThreshold: boolean;
    rosterVersion: number;
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
    setUseMassiveThreshold: (value: boolean) => void;
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
        difficultyOverride: a.difficultyOverride,
        attackOverride: a.attackOverride,
        thresholdsOverride: a.thresholdsOverride,
        featuresOverride: a.featuresOverride,
        lastAttackRoll: a.lastAttackRoll,
        lastDamageRoll: a.lastDamageRoll,
        countdown: a.countdown,
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
      useMassiveThreshold: rosterState.useMassiveThreshold,
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
    rosterState.useMassiveThreshold,
    notes,
    status,
  ]);

  // Flag to skip the next dirty check (set after markClean or loadBattleState)
  const skipNextDirtyCheckRef = useRef(false);

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

      // Massive threshold toggle
      rosterActions.setUseMassiveThreshold(state.useMassiveThreshold ?? false);

      // Spotlight - always set, even if null
      rosterActions.setSpotlight(state.spotlight);

      // Spotlight history - always set, even if empty
      rosterActions.setSpotlightHistory(state.spotlightHistory ?? []);

      // Skip the dirty check on next effect run and mark clean
      skipNextDirtyCheckRef.current = true;
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
    if (onStateChange) {
      const state = toBattleState();
      void onStateChange({
        ...state,
        status: 'completed',
        updatedAt: new Date().toISOString(),
      });
    }
  }, [onStateChange, toBattleState]);

  const setBattleName = useCallback((newName: string) => {
    setName(newName);
    setIsDirty(true);
  }, []);

  const setBattleNotes = useCallback((newNotes: string) => {
    setNotes(newNotes);
    setIsDirty(true);
  }, []);

  const resetBattle = useCallback(() => {
    setBattleId(`battle-${crypto.randomUUID()}`);
    setName('New Battle');
    setNotes('');
    setStatus('planning');
    createdAtRef.current = new Date().toISOString();
    skipNextDirtyCheckRef.current = true;
    setIsDirty(false);
  }, []);

  // Track roster version when last marked clean
  const cleanRosterVersionRef = useRef<number>(0);
  const prevRosterVersionRef = useRef<number>(rosterState.rosterVersion);

  const markClean = useCallback(() => {
    setIsDirty(false);
    // Tell the effect to update the clean hash on next run instead of marking dirty
    skipNextDirtyCheckRef.current = true;
  }, []);

  // Mark dirty when roster content actually changes from clean state
  const currentVersion = rosterState.rosterVersion;
  /* eslint-disable react-hooks/set-state-in-effect -- Tracking roster changes to mark dirty is a valid pattern */
  useEffect(() => {
    // If we were told to skip, just update the clean baseline
    if (skipNextDirtyCheckRef.current) {
      skipNextDirtyCheckRef.current = false;
      cleanRosterVersionRef.current = currentVersion;
      prevRosterVersionRef.current = currentVersion;
      return;
    }

    // Skip if version hasn't changed from previous
    if (prevRosterVersionRef.current === currentVersion) {
      return;
    }
    prevRosterVersionRef.current = currentVersion;

    // Only mark dirty if content differs from clean state
    if (cleanRosterVersionRef.current !== currentVersion) {
      setIsDirty(true);
    }
  }, [currentVersion]);
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
      // Fire and forget - caller is responsible for calling markClean() on success
      void onStateChange(toBattleState());
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
      resetBattle,
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
      resetBattle,
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
    difficultyOverride: a.difficultyOverride,
    attackOverride: a.attackOverride,
    thresholdsOverride: a.thresholdsOverride,
    featuresOverride: a.featuresOverride,
    lastAttackRoll: a.lastAttackRoll,
    lastDamageRoll: a.lastDamageRoll,
    countdown: a.countdown,
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
