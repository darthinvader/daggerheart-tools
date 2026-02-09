import { type SetStateAction, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useLatestRef } from '@/hooks/use-latest-ref';
import type { Adversary } from '@/lib/schemas/adversaries';
import type { Environment } from '@/lib/schemas/environments';
import { MAX_UNDO_DEPTH } from '@/lib/undo';
import type { UndoActions, UndoEntryMeta } from '@/lib/undo';
import { generateId } from '@/lib/utils';

import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
  NewCharacterDraft,
  RollHistoryEntry,
  SpotlightHistoryEntry,
  TrackerItem,
  TrackerSelection,
} from './types';
import { useBattleRosterState } from './use-battle-tracker-state';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Snapshot of every combat-relevant field that can be undone. */
interface UndoableSnapshot {
  characters: CharacterTracker[];
  adversaries: AdversaryTracker[];
  environments: EnvironmentTracker[];
  selection: TrackerSelection | null;
  spotlight: TrackerSelection | null;
  spotlightHistory: TrackerSelection[];
  spotlightHistoryTimeline: SpotlightHistoryEntry[];
  rollHistory: RollHistoryEntry[];
  currentRound: number;
  fearPool: number;
  maxFear: number | undefined;
  useMassiveThreshold: boolean;
}

interface UndoEntry {
  meta: UndoEntryMeta;
  snapshot: UndoableSnapshot;
}

// UndoActions is now imported from @/lib/undo

type RosterResult = ReturnType<typeof useBattleRosterState>;
type RosterActions = RosterResult['rosterActions'];
type RosterState = RosterResult['rosterState'];

// ---------------------------------------------------------------------------
// Snapshot helpers (pure functions — no hooks)
// ---------------------------------------------------------------------------

function captureSnapshot(state: RosterState): UndoableSnapshot {
  return structuredClone({
    characters: state.characters,
    adversaries: state.adversaries,
    environments: state.environments,
    selection: state.selection,
    spotlight: state.spotlight,
    spotlightHistory: state.spotlightHistory,
    spotlightHistoryTimeline: state.spotlightHistoryTimeline,
    rollHistory: state.rollHistory,
    currentRound: state.currentRound,
    fearPool: state.fearPool,
    maxFear: state.maxFear,
    useMassiveThreshold: state.useMassiveThreshold,
  });
}

function restoreSnapshot(snap: UndoableSnapshot, actions: RosterActions): void {
  actions.setCharacters(snap.characters);
  actions.setAdversaries(snap.adversaries);
  actions.setEnvironments(snap.environments);
  actions.setSelection(snap.selection);
  actions.setSpotlight(snap.spotlight);
  actions.setSpotlightHistory(snap.spotlightHistory);
  actions.setSpotlightHistoryTimeline(snap.spotlightHistoryTimeline);
  actions.setRollHistory(snap.rollHistory);
  actions.setCurrentRound(snap.currentRound);
  actions.setFearPool(snap.fearPool);
  actions.setMaxFear(snap.maxFear);
  actions.setUseMassiveThreshold(snap.useMassiveThreshold);
}

// ---------------------------------------------------------------------------
// Undo stack management hook (extracted to keep main hook short)
// ---------------------------------------------------------------------------

function useUndoStacks(state: RosterState, actions: RosterActions) {
  const [past, setPast] = useState<UndoEntry[]>([]);
  const [future, setFuture] = useState<UndoEntry[]>([]);

  // Keep refs to always-current values so callbacks are stable
  const stateRef = useLatestRef(state);
  const actionsRef = useLatestRef(actions);
  const pastRef = useLatestRef(past);

  const pushUndo = useCallback(
    (label: string) => {
      const snapshot = captureSnapshot(stateRef.current);
      const meta: UndoEntryMeta = {
        id: generateId(),
        label,
        timestamp: Date.now(),
      };
      setPast(prev => [{ meta, snapshot }, ...prev].slice(0, MAX_UNDO_DEPTH));
      setFuture([]);
    },
    [stateRef]
  );

  /** Pop undo entry and discard — used to roll back no-op actions. */
  const popUndo = useCallback(() => {
    setPast(prev => prev.slice(1));
  }, []);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const [entry, ...remaining] = pastRef.current;
    const current = captureSnapshot(stateRef.current);
    const currentMeta: UndoEntryMeta = {
      id: generateId(),
      label: entry.meta.label,
      timestamp: Date.now(),
    };

    // Update stacks before side effects — safe for StrictMode
    pastRef.current = remaining;
    setPast(remaining);
    setFuture(prevFuture =>
      [{ meta: currentMeta, snapshot: current }, ...prevFuture].slice(
        0,
        MAX_UNDO_DEPTH
      )
    );

    // Side effects outside updaters
    restoreSnapshot(entry.snapshot, actionsRef.current);
    toast(`Undone: ${entry.meta.label}`);
  }, [pastRef, stateRef, actionsRef]);

  const redo = useCallback(() => {
    setFuture(prevFuture => {
      if (prevFuture.length === 0) return prevFuture;
      const [entry, ...remaining] = prevFuture;
      const current = captureSnapshot(stateRef.current);
      const currentMeta: UndoEntryMeta = {
        id: generateId(),
        label: entry.meta.label,
        timestamp: Date.now(),
      };
      setPast(prevPast =>
        [{ meta: currentMeta, snapshot: current }, ...prevPast].slice(
          0,
          MAX_UNDO_DEPTH
        )
      );

      // Side effects: schedule outside the updater via microtask
      queueMicrotask(() => {
        restoreSnapshot(entry.snapshot, actionsRef.current);
        toast(`Redone: ${entry.meta.label}`);
      });

      return remaining;
    });
  }, [stateRef, actionsRef]);

  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);

  return { past, future, pushUndo, popUndo, undo, redo, clearHistory };
}

// ---------------------------------------------------------------------------
// Wrapped action builders (extracted to keep main hook short)
// ---------------------------------------------------------------------------

function buildWrappedActions(
  pushUndo: (label: string) => void,
  popUndo: () => void,
  rosterActions: RosterActions,
  currentRound: number
) {
  // -- Spotlight -----------------------------------------------------------
  const setSpotlight = (value: TrackerSelection | null) => {
    pushUndo('Set spotlight');
    rosterActions.setSpotlight(value);
  };
  const handleSpotlight = (item: TrackerItem) => {
    pushUndo('Change spotlight');
    rosterActions.handleSpotlight(item);
  };

  // -- Fear ----------------------------------------------------------------
  const setFearPool = (value: number) => {
    pushUndo('Set fear pool');
    rosterActions.setFearPool(value);
  };
  const spendFear = (amount: number): boolean => {
    pushUndo(`Spend ${amount} Fear`);
    const result = rosterActions.spendFear(amount);
    if (!result) popUndo();
    return result;
  };

  // -- Max fear / massive threshold ----------------------------------------
  const setMaxFear = (value: number | undefined) => {
    pushUndo('Set max fear');
    rosterActions.setMaxFear(value);
  };
  const setUseMassiveThreshold = (value: boolean) => {
    pushUndo(value ? 'Enable massive threshold' : 'Disable massive threshold');
    rosterActions.setUseMassiveThreshold(value);
  };

  // -- Remove --------------------------------------------------------------
  const handleRemove = (item: TrackerItem) => {
    pushUndo(`Remove ${item.kind}`);
    rosterActions.handleRemove(item);
  };

  // -- Add entities --------------------------------------------------------
  const addCharacter = (draft: NewCharacterDraft) => {
    pushUndo('Add character');
    const result = rosterActions.addCharacter(draft);
    if (result === null) popUndo();
    return result;
  };
  const addAdversary = (adversary: Adversary) => {
    pushUndo(`Add adversary: ${adversary.name}`);
    rosterActions.addAdversary(adversary);
  };
  const addEnvironment = (environment: Environment) => {
    pushUndo(`Add environment: ${environment.name}`);
    rosterActions.addEnvironment(environment);
  };

  // -- Update entities -----------------------------------------------------
  const updateCharacter = (
    id: string,
    updater: (prev: CharacterTracker) => CharacterTracker
  ) => {
    pushUndo('Update character');
    rosterActions.updateCharacter(id, updater);
  };
  const updateAdversary = (
    id: string,
    updater: (prev: AdversaryTracker) => AdversaryTracker
  ) => {
    pushUndo('Update adversary');
    rosterActions.updateAdversary(id, updater);
  };
  const updateEnvironment = (
    id: string,
    updater: (prev: EnvironmentTracker) => EnvironmentTracker
  ) => {
    pushUndo('Update environment');
    rosterActions.updateEnvironment(id, updater);
  };

  // -- Rounds --------------------------------------------------------------
  const setCurrentRound = (value: number) => {
    pushUndo(`Set round to ${value}`);
    rosterActions.setCurrentRound(value);
  };
  const advanceRound = () => {
    pushUndo(`Advance to round ${currentRound + 1}`);
    rosterActions.advanceRound();
  };

  // -- Roll history --------------------------------------------------------
  const addRollToHistory = (entry: RollHistoryEntry) => {
    pushUndo('Add roll to history');
    rosterActions.addRollToHistory(entry);
  };
  const clearRollHistory = () => {
    pushUndo('Clear roll history');
    rosterActions.clearRollHistory();
  };
  const setRollHistory = (value: SetStateAction<RollHistoryEntry[]>) => {
    pushUndo('Set roll history');
    rosterActions.setRollHistory(value);
  };

  // -- Spotlight history timeline ------------------------------------------
  const clearSpotlightHistoryTimeline = () => {
    pushUndo('Clear spotlight history timeline');
    rosterActions.clearSpotlightHistoryTimeline();
  };
  const setSpotlightHistoryTimeline = (
    value: SetStateAction<SpotlightHistoryEntry[]>
  ) => {
    pushUndo('Set spotlight history timeline');
    rosterActions.setSpotlightHistoryTimeline(value);
  };

  // -- Bulk setters (loading) ----------------------------------------------
  const setCharacters = (value: SetStateAction<CharacterTracker[]>) => {
    pushUndo('Set characters');
    rosterActions.setCharacters(value);
  };
  const setAdversaries = (value: SetStateAction<AdversaryTracker[]>) => {
    pushUndo('Set adversaries');
    rosterActions.setAdversaries(value);
  };
  const setEnvironments = (value: SetStateAction<EnvironmentTracker[]>) => {
    pushUndo('Set environments');
    rosterActions.setEnvironments(value);
  };
  const setSpotlightHistory = (value: SetStateAction<TrackerSelection[]>) => {
    pushUndo('Set spotlight history');
    rosterActions.setSpotlightHistory(value);
  };

  return {
    setSpotlight,
    handleSpotlight,
    setFearPool,
    spendFear,
    setMaxFear,
    setUseMassiveThreshold,
    handleRemove,
    addCharacter,
    addAdversary,
    addEnvironment,
    updateCharacter,
    updateAdversary,
    updateEnvironment,
    setCurrentRound,
    advanceRound,
    addRollToHistory,
    clearRollHistory,
    setRollHistory,
    clearSpotlightHistoryTimeline,
    setSpotlightHistoryTimeline,
    setCharacters,
    setAdversaries,
    setEnvironments,
    setSpotlightHistory,
  };
}

// ---------------------------------------------------------------------------
// Main hook
// ---------------------------------------------------------------------------

export function useUndoableRosterState() {
  const { rosterState, rosterActions } = useBattleRosterState();

  const { past, future, pushUndo, popUndo, undo, redo, clearHistory } =
    useUndoStacks(rosterState, rosterActions);

  const wrappedActions = useMemo(
    () =>
      buildWrappedActions(
        pushUndo,
        popUndo,
        rosterActions,
        rosterState.currentRound
      ),
    [pushUndo, popUndo, rosterActions, rosterState.currentRound]
  );

  const undoActions: UndoActions = useMemo(
    () => ({
      undo,
      redo,
      canUndo: past.length > 0,
      canRedo: future.length > 0,
      undoStack: past.map(e => e.meta),
      redoStack: future.map(e => e.meta),
      clearHistory,
    }),
    [undo, redo, past, future, clearHistory]
  );

  return {
    rosterState,
    rosterActions: {
      // Non-undoable — pass through unchanged
      setActiveRosterTab: rosterActions.setActiveRosterTab,
      setActiveDetailTab: rosterActions.setActiveDetailTab,
      handleSelect: rosterActions.handleSelect,
      setSelection: rosterActions.setSelection,
      // Undoable wrappers
      ...wrappedActions,
    },
    undoActions,
  };
}
