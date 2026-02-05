/**
 * Hook for managing rest state and flow.
 */
import { useCallback, useState } from 'react';

import { getMovesForRestType } from './constants';
import {
  calculateFearGain,
  createRestResult,
  executeRestMove,
} from './rest-utils';
import type {
  FearGainResult,
  RestMove,
  RestMoveResult,
  RestMoveSelection,
  RestResult,
  RestType,
} from './types';

export type RestPhase = 'select-type' | 'select-moves' | 'results';

interface UseRestOptions {
  /** Character's current tier (1-4) */
  tier: number;
  /** Current marked HP */
  currentHp: number;
  /** Max HP */
  maxHp: number;
  /** Current stress */
  currentStress: number;
  /** Max stress */
  maxStress: number;
  /** Current marked armor slots */
  currentArmorMarked: number;
  /** Total armor slots */
  totalArmorSlots: number;
  /** Callback when rest is complete */
  onComplete: (result: RestResult) => void;
  /**
   * Number of PCs in the party (for Fear gain calculation).
   * Per Chapter 3: Long Rest Fear gain = partySize + 1d4
   */
  partySize?: number;
  /**
   * Whether to calculate and include Fear gain in results.
   * When true, Fear gain will be calculated per Chapter 3 rules.
   */
  showFearGain?: boolean;
}

interface UseRestReturn {
  /** Current phase of rest flow */
  phase: RestPhase;
  /** Selected rest type */
  restType: RestType | null;
  /** Available moves for selected rest type */
  availableMoves: RestMove[];
  /** Current move selection */
  selection: RestMoveSelection;
  /** Rest results (after completion) */
  results: RestMoveResult[];
  /** Fear gain result (after completion, if showFearGain was enabled) */
  fearGain: FearGainResult | null;
  /** Whether preparing with party */
  preparingWithParty: boolean;
  /** Set rest type and advance to move selection */
  selectRestType: (type: RestType) => void;
  /** Select a move for slot 1 or 2 */
  selectMove: (slot: 1 | 2, move: RestMove | null) => void;
  /** Set target for a move */
  setTarget: (slot: 1 | 2, target: string) => void;
  /** Toggle preparing with party */
  togglePreparingWithParty: () => void;
  /** Execute the rest and get results */
  executeRest: () => void;
  /** Reset to start a new rest */
  reset: () => void;
  /** Go back to previous phase */
  goBack: () => void;
  /** Whether the current selection is valid (2 moves selected) */
  canExecute: boolean;
}

const initialSelection: RestMoveSelection = {
  move1: null,
  move2: null,
  target1: 'Self',
  target2: 'Self',
};

export function useRest(options: UseRestOptions): UseRestReturn {
  const {
    tier,
    currentHp,
    currentStress,
    currentArmorMarked,
    onComplete,
    partySize = 0,
    showFearGain = false,
  } = options;

  const [phase, setPhase] = useState<RestPhase>('select-type');
  const [restType, setRestType] = useState<RestType | null>(null);
  const [selection, setSelection] =
    useState<RestMoveSelection>(initialSelection);
  const [results, setResults] = useState<RestMoveResult[]>([]);
  const [fearGain, setFearGain] = useState<FearGainResult | null>(null);
  const [preparingWithParty, setPreparingWithParty] = useState(false);

  const availableMoves = restType ? getMovesForRestType(restType) : [];

  const selectRestType = useCallback((type: RestType) => {
    setRestType(type);
    setPhase('select-moves');
  }, []);

  const selectMove = useCallback((slot: 1 | 2, move: RestMove | null) => {
    setSelection(prev => ({
      ...prev,
      [slot === 1 ? 'move1' : 'move2']: move,
    }));
  }, []);

  const setTarget = useCallback((slot: 1 | 2, target: string) => {
    setSelection(prev => ({
      ...prev,
      [slot === 1 ? 'target1' : 'target2']: target,
    }));
  }, []);

  const togglePreparingWithParty = useCallback(() => {
    setPreparingWithParty(prev => !prev);
  }, []);

  const getResourceValue = useCallback(
    (move: RestMove): { current: number; max: number } => {
      switch (move.category) {
        case 'healing':
          return { current: currentHp, max: options.maxHp };
        case 'stress':
          return { current: currentStress, max: options.maxStress };
        case 'armor':
          return { current: currentArmorMarked, max: options.totalArmorSlots };
        default:
          return { current: 0, max: 0 };
      }
    },
    [
      currentHp,
      currentStress,
      currentArmorMarked,
      options.maxHp,
      options.maxStress,
      options.totalArmorSlots,
    ]
  );

  const executeRest = useCallback(() => {
    if (!restType || !selection.move1 || !selection.move2) return;

    const moveResults: RestMoveResult[] = [];

    // Execute move 1
    const res1 = getResourceValue(selection.move1);
    const result1 = executeRestMove(
      selection.move1,
      tier,
      res1.current,
      selection.target1,
      preparingWithParty
    );
    moveResults.push(result1);

    // Execute move 2
    const res2 = getResourceValue(selection.move2);
    const result2 = executeRestMove(
      selection.move2,
      tier,
      res2.current,
      selection.target2,
      preparingWithParty
    );
    moveResults.push(result2);

    // Calculate Fear gain for GM if enabled
    // Per Chapter 3: Short Rest = 1d4, Long Rest = PCs + 1d4
    let fearGainResult: FearGainResult | undefined;
    if (showFearGain) {
      fearGainResult = calculateFearGain(restType, partySize);
      setFearGain(fearGainResult);
    }

    setResults(moveResults);
    setPhase('results');

    const fullResult = createRestResult(restType, moveResults, fearGainResult);
    onComplete(fullResult);
  }, [
    restType,
    selection,
    tier,
    preparingWithParty,
    getResourceValue,
    onComplete,
    showFearGain,
    partySize,
  ]);

  const reset = useCallback(() => {
    setPhase('select-type');
    setRestType(null);
    setSelection(initialSelection);
    setResults([]);
    setFearGain(null);
    setPreparingWithParty(false);
  }, []);

  const goBack = useCallback(() => {
    if (phase === 'select-moves') {
      setRestType(null);
      setSelection(initialSelection);
      setPhase('select-type');
    } else if (phase === 'results') {
      setResults([]);
      setFearGain(null);
      setPhase('select-moves');
    }
  }, [phase]);

  const canExecute = selection.move1 !== null && selection.move2 !== null;

  return {
    phase,
    restType,
    availableMoves,
    selection,
    results,
    fearGain,
    preparingWithParty,
    selectRestType,
    selectMove,
    setTarget,
    togglePreparingWithParty,
    executeRest,
    reset,
    goBack,
    canExecute,
  };
}
