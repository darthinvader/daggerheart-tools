/**
 * Utility functions for the rest system.
 * Per SRD: Short rest recovery is 1d4+Tier.
 */
import type { RestMove, RestMoveResult, RestResult, RestType } from './types';

/**
 * Roll 1d4.
 */
function rollD4(): number {
  return Math.floor(Math.random() * 4) + 1;
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
 */
export function createRestResult(
  restType: RestType,
  moveResults: RestMoveResult[]
): RestResult {
  return {
    restType,
    moveResults,
    timestamp: new Date().toISOString(),
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

  return `${restTypeLabel}\n${moveSummaries}`;
}
