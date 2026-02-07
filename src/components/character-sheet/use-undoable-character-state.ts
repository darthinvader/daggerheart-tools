import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { MAX_UNDO_DEPTH } from '@/lib/undo';
import type { UndoActions, UndoEntryMeta } from '@/lib/undo';

import type { CharacterSheetHandlers, CharacterSheetState } from './types';

// ---------------------------------------------------------------------------
// Single source of truth for undoable fields
// ---------------------------------------------------------------------------

/**
 * All undoable state keys + their human-readable labels and setter names.
 * This is the ONLY place to add/remove undoable fields — capture, restore,
 * and wrapper generation all derive from this list.
 *
 * Excluded (non-undoable / transient):
 *   - restState (transient timestamps)
 *   - sessions / currentSessionId (separate CRUD domain)
 *   - quickView (UI preference)
 *   - deathState (transient, not persisted)
 *   - activeEffects (not auto-save wrapped)
 *   - unlockedSubclassFeatures (no public handler — only set internally)
 */
const UNDOABLE_FIELDS = [
  { key: 'identity', setter: 'setIdentity', label: 'Update identity' },
  { key: 'ancestry', setter: 'setAncestry', label: 'Update ancestry' },
  { key: 'community', setter: 'setCommunity', label: 'Update community' },
  {
    key: 'classSelection',
    setter: 'setClassSelection',
    label: 'Update class selection',
  },
  {
    key: 'progression',
    setter: 'setProgression',
    label: 'Update progression',
  },
  { key: 'gold', setter: 'setGold', label: 'Update gold' },
  {
    key: 'thresholds',
    setter: 'setThresholds',
    label: 'Update thresholds',
  },
  { key: 'equipment', setter: 'setEquipment', label: 'Update equipment' },
  { key: 'inventory', setter: 'setInventory', label: 'Update inventory' },
  { key: 'loadout', setter: 'setLoadout', label: 'Update loadout' },
  {
    key: 'experiences',
    setter: 'setExperiences',
    label: 'Update experiences',
  },
  {
    key: 'conditions',
    setter: 'setConditions',
    label: 'Update conditions',
  },
  { key: 'traits', setter: 'setTraits', label: 'Update traits' },
  {
    key: 'coreScores',
    setter: 'setCoreScores',
    label: 'Update core scores',
  },
  { key: 'resources', setter: 'setResources', label: 'Update resources' },
  {
    key: 'hopeWithScars',
    setter: 'setHopeWithScars',
    label: 'Update hope & scars',
  },
  { key: 'companion', setter: 'setCompanion', label: 'Update companion' },
  {
    key: 'companionEnabled',
    setter: 'setCompanionEnabled',
    label: 'Update companion enabled',
  },
  { key: 'notes', setter: 'setNotes', label: 'Update notes' },
  {
    key: 'countdowns',
    setter: 'setCountdowns',
    label: 'Update countdowns',
  },
  {
    key: 'downtimeActivities',
    setter: 'setDowntimeActivities',
    label: 'Update downtime activities',
  },
  {
    key: 'beastform',
    setter: 'setBeastform',
    label: 'Update beastform',
  },
] as const;

type UndoableKey = (typeof UNDOABLE_FIELDS)[number]['key'];
type UndoableSetterName = (typeof UNDOABLE_FIELDS)[number]['setter'];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Snapshot containing only the undoable character-sheet fields. */
type CharacterUndoSnapshot = Pick<CharacterSheetState, UndoableKey>;

interface CharacterUndoEntry {
  meta: UndoEntryMeta;
  snapshot: CharacterUndoSnapshot;
}

/** Public return type for the undoable character state hook. */
export interface UndoableCharacterStateResult {
  undoHandlers: CharacterSheetHandlers;
  undoActions: UndoActions;
  /** Push an undo snapshot before a compound operation (e.g. level-up). */
  pushUndo: (label: string) => void;
}

// ---------------------------------------------------------------------------
// Snapshot helpers (pure functions — no hooks)
// ---------------------------------------------------------------------------

function captureCharacterSnapshot(
  state: CharacterSheetState
): CharacterUndoSnapshot {
  const snap = {} as CharacterUndoSnapshot;
  for (const { key } of UNDOABLE_FIELDS) {
    // companionEnabled is a plain boolean — no need for structuredClone
    (snap as Record<string, unknown>)[key] =
      typeof state[key] === 'boolean'
        ? state[key]
        : structuredClone(state[key]);
  }
  return snap;
}

function restoreCharacterSnapshot(
  snap: CharacterUndoSnapshot,
  handlers: CharacterSheetHandlers
): void {
  // setResources runs before setHopeWithScars — hopeWithScars' internal
  // function updater overlays resources.hope with the snapshot values.
  for (const { key, setter } of UNDOABLE_FIELDS) {
    const setFn = handlers[setter as UndoableSetterName] as (
      v: unknown
    ) => void;
    setFn(snap[key]);
  }
}

// ---------------------------------------------------------------------------
// Undo stack management hook
// ---------------------------------------------------------------------------

/** No-op pushUndo for disabled/read-only mode. */
const NOOP_PUSH_UNDO = (_label: string): void => {};

const NO_OP_UNDO_ACTIONS: UndoActions = {
  undo: () => {},
  redo: () => {},
  canUndo: false,
  canRedo: false,
  undoStack: [],
  redoStack: [],
  clearHistory: () => {},
};

function useCharacterUndoStacks(
  state: CharacterSheetState,
  handlers: CharacterSheetHandlers
) {
  const [past, setPast] = useState<CharacterUndoEntry[]>([]);
  const [future, setFuture] = useState<CharacterUndoEntry[]>([]);

  // Refs avoid closure staleness in stable callbacks (empty deps).
  // Assigned in useEffect to satisfy react-hooks/refs — event handlers
  // always fire after effects, so refs are up-to-date when read.
  const stateRef = useRef(state);
  const handlersRef = useRef(handlers);
  const pastRef = useRef(past);
  const futureRef = useRef(future);

  useEffect(() => {
    stateRef.current = state;
    handlersRef.current = handlers;
    pastRef.current = past;
    futureRef.current = future;
  });

  const pushUndo = useCallback((label: string) => {
    const snapshot = captureCharacterSnapshot(stateRef.current);
    const meta: UndoEntryMeta = {
      id: crypto.randomUUID(),
      label,
      timestamp: Date.now(),
    };
    setPast(prev => [{ meta, snapshot }, ...prev].slice(0, MAX_UNDO_DEPTH));
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    const prevPast = pastRef.current;
    if (prevPast.length === 0) return;

    const [entry, ...remaining] = prevPast;
    pastRef.current = remaining; // close the race window for rapid-fire undo
    const current = captureCharacterSnapshot(stateRef.current);
    const currentMeta: UndoEntryMeta = {
      id: crypto.randomUUID(),
      label: entry.meta.label,
      timestamp: Date.now(),
    };

    // Pure state updates — no side-effects inside updaters
    setPast(remaining);
    setFuture(prev =>
      [{ meta: currentMeta, snapshot: current }, ...prev].slice(
        0,
        MAX_UNDO_DEPTH
      )
    );

    // Side-effects outside updaters — safe for StrictMode
    restoreCharacterSnapshot(entry.snapshot, handlersRef.current);
    toast(`Undone: ${entry.meta.label}`);
  }, []);

  const redo = useCallback(() => {
    const prevFuture = futureRef.current;
    if (prevFuture.length === 0) return;

    const [entry, ...remaining] = prevFuture;
    futureRef.current = remaining; // close the race window for rapid-fire redo
    const current = captureCharacterSnapshot(stateRef.current);
    const currentMeta: UndoEntryMeta = {
      id: crypto.randomUUID(),
      label: entry.meta.label,
      timestamp: Date.now(),
    };

    // Pure state updates — no side-effects inside updaters
    setFuture(remaining);
    setPast(prev =>
      [{ meta: currentMeta, snapshot: current }, ...prev].slice(
        0,
        MAX_UNDO_DEPTH
      )
    );

    // Side-effects outside updaters — safe for StrictMode
    restoreCharacterSnapshot(entry.snapshot, handlersRef.current);
    toast(`Redone: ${entry.meta.label}`);
  }, []);

  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);

  // Memoize meta arrays so downstream components get stable references
  const undoStack = useMemo(() => past.map(e => e.meta), [past]);
  const redoStack = useMemo(() => future.map(e => e.meta), [future]);

  // Build wrapped handlers inside the hook so they can read handlersRef.
  // pushUndo has empty deps → this useMemo fires once on mount.
  const wrappedSetters = useMemo(() => {
    const result = {} as Pick<CharacterSheetHandlers, UndoableSetterName>;
    for (const { setter, label } of UNDOABLE_FIELDS) {
      (result as Record<string, unknown>)[setter] = (value: unknown) => {
        pushUndo(label);
        const setFn = handlersRef.current[setter as UndoableSetterName] as (
          v: unknown
        ) => void;
        setFn(value);
      };
    }
    return result;
  }, [pushUndo]);

  return {
    past,
    future,
    pushUndo,
    undo,
    redo,
    clearHistory,
    undoStack,
    redoStack,
    wrappedSetters,
  };
}

// ---------------------------------------------------------------------------
// Main hook
// ---------------------------------------------------------------------------

/**
 * Wraps character sheet state + handlers with snapshot-based undo/redo.
 * When disabled (e.g. readOnly mode), returns original handlers unchanged.
 */
export function useUndoableCharacterState(
  state: CharacterSheetState,
  handlers: CharacterSheetHandlers,
  options: { enabled: boolean }
): UndoableCharacterStateResult {
  const {
    past,
    future,
    pushUndo,
    undo,
    redo,
    clearHistory,
    undoStack,
    redoStack,
    wrappedSetters,
  } = useCharacterUndoStacks(state, handlers);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // Memoize so downstream consumers (e.g. UndoRedoControls, UndoRedoFab)
  // get a stable reference unless the stacks actually change.
  const undoActions = useMemo<UndoActions>(
    () => ({
      undo,
      redo,
      canUndo,
      canRedo,
      undoStack,
      redoStack,
      clearHistory,
    }),
    [undo, redo, canUndo, canRedo, undoStack, redoStack, clearHistory]
  );

  // undoHandlers is memoized with the 6 pass-through handler refs as deps.
  // The 21 wrapped setters inside are mount-stable via useMemo in
  // useCharacterUndoStacks.
  const undoHandlers = useMemo<CharacterSheetHandlers>(
    () => ({
      // Non-undoable — pass through unchanged
      onLevelUp: handlers.onLevelUp,
      setRestState: handlers.setRestState,
      setSessions: handlers.setSessions,
      setQuickView: handlers.setQuickView,
      setActiveEffects: handlers.setActiveEffects,
      setDeathState: handlers.setDeathState,
      // Undoable wrappers (memoized, read handlers via ref)
      ...wrappedSetters,
    }),

    [
      handlers.onLevelUp,
      handlers.setRestState,
      handlers.setSessions,
      handlers.setQuickView,
      handlers.setActiveEffects,
      handlers.setDeathState,
      wrappedSetters,
    ]
  );

  if (!options.enabled) {
    return {
      undoHandlers: handlers,
      undoActions: NO_OP_UNDO_ACTIONS,
      pushUndo: NOOP_PUSH_UNDO,
    };
  }

  return { undoHandlers, undoActions, pushUndo };
}
