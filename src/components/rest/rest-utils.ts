/**
 * Utility functions for the rest system.
 * Per SRD: Short rest recovery is 1d4+Tier.
 * Per Chapter 3: GM gains Fear when party rests.
 */
import type {
  FearGainResult,
  RestMove,
  RestMoveResult,
  RestResult,
  RestType,
} from './types';

/**
 * Roll 1d4.
 */
function rollD4(): number {
  return Math.floor(Math.random() * 4) + 1;
}

/**
 * Calculate Fear gain for GM when party takes a rest.
 * Per Daggerheart Chapter 3 rulebook:
 * - Short Rest: GM gains 1d4 Fear
 * - Long Rest: GM gains (number of PCs + 1d4) Fear
 *
 * @param restType The type of rest being taken
 * @param partySize Number of player characters in the party (only used for long rest)
 * @returns Object with dice roll, party bonus (if applicable), and total Fear gained
 */
export function calculateFearGain(
  restType: RestType,
  partySize: number = 0
): FearGainResult {
  const diceRoll = rollD4();

  if (restType === 'short') {
    return {
      diceRoll,
      partyBonus: 0,
      total: diceRoll,
      restType,
    };
  }

  // Long rest: party size + 1d4
  return {
    diceRoll,
    partyBonus: partySize,
    total: partySize + diceRoll,
    restType,
  };
}

/**
 * Get a human-readable summary of Fear gain from rest.
 */
export function getFearGainSummary(fearGain: FearGainResult): string {
  if (fearGain.restType === 'short') {
    return `GM gains ${fearGain.total} Fear (1d4: ${fearGain.diceRoll})`;
  }
  return `GM gains ${fearGain.total} Fear (${fearGain.partyBonus} PCs + 1d4: ${fearGain.diceRoll})`;
}

/**
 * Roll 1d4+tier for short rest recovery.
 * @param tier Character's current tier (1-4)
 * @returns Object with dice roll, tier bonus, and total
 */
export function rollRestRecovery(tier: number): {
  diceRoll: number;
  tierBonus: number;
  total: number;
} {
  const diceRoll = rollD4();
  return {
    diceRoll,
    tierBonus: tier,
    total: diceRoll + tier,
  };
}

/**
 * Execute a rest move and get the result.
 * @param move The rest move to execute
 * @param tier Character's tier (for 1d4+tier calculations)
 * @param currentValue Current value of the resource (for capping)
 * @param target Target name (self or ally)
 * @param preparingWithParty Whether preparing with party (for Hope bonus)
 */
export function executeRestMove(
  move: RestMove,
  tier: number,
  currentValue: number,
  target: string = 'Self',
  preparingWithParty: boolean = false
): RestMoveResult {
  // Handle "Prepare" move specially
  if (move.id === 'prepare') {
    const hopeGained = preparingWithParty ? 2 : 1;
    return {
      moveId: move.id,
      moveName: move.name,
      amount: hopeGained,
      isFullClear: false,
      target,
    };
  }

  // Handle "Work on a Project" - no numeric recovery
  if (move.id === 'work-on-project') {
    return {
      moveId: move.id,
      moveName: move.name,
      amount: 1, // Represents advancing the countdown
      isFullClear: false,
      target,
    };
  }

  // Full clear (long rest recovery moves)
  if (move.isFullClear) {
    return {
      moveId: move.id,
      moveName: move.name,
      amount: currentValue, // Clear all marked (which equals current marked amount)
      isFullClear: true,
      target,
    };
  }

  // 1d4+Tier recovery (short rest)
  const { diceRoll, tierBonus, total } = rollRestRecovery(tier);
  // Cap at how much can actually be recovered
  const actualRecovery = Math.min(total, currentValue);

  return {
    moveId: move.id,
    moveName: move.name,
    diceRoll,
    tierBonus,
    amount: actualRecovery,
    isFullClear: false,
    target,
  };
}

/**
 * Create a full rest result from move results.
 * @param restType The type of rest taken
 * @param moveResults Results of the moves executed during rest
 * @param fearGain Optional Fear gain result for GM tracking
 */
export function createRestResult(
  restType: RestType,
  moveResults: RestMoveResult[],
  fearGain?: FearGainResult
): RestResult {
  return {
    restType,
    moveResults,
    timestamp: new Date().toISOString(),
    fearGain,
  };
}

/**
 * Get a human-readable summary of a rest move result.
 */
export function getRestMoveResultSummary(result: RestMoveResult): string {
  if (result.moveId === 'prepare') {
    return `Gained ${result.amount} Hope`;
  }

  if (result.moveId === 'work-on-project') {
    return 'Advanced project countdown';
  }

  if (result.isFullClear) {
    return `Cleared all (${result.amount})`;
  }

  const rollPart =
    result.diceRoll !== undefined && result.tierBonus !== undefined
      ? ` (${result.diceRoll} + ${result.tierBonus})`
      : '';

  return `Cleared ${result.amount}${rollPart}`;
}

/**
 * Format a rest result for display/logging.
 */
export function formatRestResult(result: RestResult): string {
  const restTypeLabel =
    result.restType === 'short' ? 'Short Rest' : 'Long Rest';
  const moveSummaries = result.moveResults
    .map(r => `  - ${r.moveName}: ${getRestMoveResultSummary(r)}`)
    .join('\n');

  let output = `${restTypeLabel}\n${moveSummaries}`;

  // Add Fear gain information if present
  if (result.fearGain) {
    output += `\n  - ${getFearGainSummary(result.fearGain)}`;
  }

  return output;
}
