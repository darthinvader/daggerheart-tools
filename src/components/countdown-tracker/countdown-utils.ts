import { generateId } from '@/lib/utils';

import type {
  Countdown,
  CountdownTrigger,
  CreateCountdownOptions,
  RollResult,
  VarianceMode,
} from './types';
import { ROLL_RESULT_ADVANCEMENT, VARIANCE_RANGES } from './types';

/**
 * Calculate randomized starting position based on variance mode
 */
export function calculateVarianceStart(
  segments: number,
  variance: VarianceMode
): number {
  if (variance === 'none') return 0;
  const maxVariance = Math.floor(segments * VARIANCE_RANGES[variance]);
  return Math.floor(Math.random() * (maxVariance + 1));
}

/**
 * Create a new countdown with enhanced options
 */
export function createCountdown(options: CreateCountdownOptions): Countdown;
export function createCountdown(
  name: string,
  segments?: number,
  type?: 'threat' | 'opportunity' | 'neutral'
): Countdown;
export function createCountdown(
  nameOrOptions: string | CreateCountdownOptions,
  segments: number = 6,
  type: 'threat' | 'opportunity' | 'neutral' = 'neutral'
): Countdown {
  // Handle legacy signature
  if (typeof nameOrOptions === 'string') {
    return {
      id: generateId(),
      name: nameOrOptions,
      segments,
      filled: 0,
      type,
      createdAt: new Date().toISOString(),
      dynamicAdvancement: false,
      behavior: 'once',
      loopCount: 0,
      variance: 'none',
    };
  }

  // Handle options object
  const opts = nameOrOptions;
  const countdownSegments = opts.segments ?? 6;
  const variance = opts.variance ?? 'none';
  const startingFilled = calculateVarianceStart(countdownSegments, variance);

  const countdown: Countdown = {
    id: generateId(),
    name: opts.name,
    description: opts.description,
    segments: countdownSegments,
    filled: startingFilled,
    type: opts.type ?? 'neutral',
    createdAt: new Date().toISOString(),
    dynamicAdvancement: opts.dynamicAdvancement ?? false,
    behavior: opts.behavior ?? 'once',
    loopCount: 0,
    variance,
    advancementHistory: [],
  };

  // Add trigger if provided
  if (opts.trigger) {
    countdown.trigger = {
      id: generateId(),
      description: opts.trigger.description,
      action: opts.trigger.action,
      fired: false,
    };
  }

  return countdown;
}

/**
 * Result of advancing a countdown
 */
export interface AdvanceResult {
  countdown: Countdown;
  /** Whether the countdown just completed (reached max) */
  completed: boolean;
  /** Whether the trigger fired */
  triggerFired: boolean;
  /** Whether the countdown looped */
  looped: boolean;
  /** The trigger that fired, if any */
  trigger?: CountdownTrigger;
}

/**
 * Advance a countdown by a specified amount with full tracking
 */
export function advanceCountdown(
  countdown: Countdown,
  amount: number = 1,
  rollResult?: RollResult
): Countdown {
  const result = advanceCountdownWithResult(countdown, amount, rollResult);
  return result.countdown;
}

/**
 * Advance a countdown and return detailed result information
 */
export function advanceCountdownWithResult(
  countdown: Countdown,
  amount: number = 1,
  rollResult?: RollResult
): AdvanceResult {
  const newFilled = Math.min(
    countdown.segments,
    Math.max(0, countdown.filled + amount)
  );

  const wasComplete = countdown.filled >= countdown.segments;
  const isNowComplete = newFilled >= countdown.segments;
  const justCompleted = !wasComplete && isNowComplete;

  // Track advancement history
  const historyEntry = {
    amount,
    rollResult,
    timestamp: new Date().toISOString(),
  };

  let updatedCountdown: Countdown = {
    ...countdown,
    filled: newFilled,
    advancementHistory: [...(countdown.advancementHistory ?? []), historyEntry],
  };

  let looped = false;
  let triggerFired = false;
  let firedTrigger: CountdownTrigger | undefined;

  // Handle completion
  if (justCompleted) {
    // Fire trigger if exists and hasn't fired
    if (updatedCountdown.trigger && !updatedCountdown.trigger.fired) {
      triggerFired = true;
      firedTrigger = { ...updatedCountdown.trigger, fired: true };
      updatedCountdown = {
        ...updatedCountdown,
        trigger: firedTrigger,
      };
    }

    // Handle loop behavior
    if (updatedCountdown.behavior === 'loop') {
      looped = true;
      const newStart = calculateVarianceStart(
        updatedCountdown.segments,
        updatedCountdown.variance
      );
      updatedCountdown = {
        ...updatedCountdown,
        filled: newStart,
        loopCount: updatedCountdown.loopCount + 1,
        // Reset trigger for next loop
        trigger: updatedCountdown.trigger
          ? { ...updatedCountdown.trigger, fired: false }
          : undefined,
      };
    }
  }

  return {
    countdown: updatedCountdown,
    completed: justCompleted,
    triggerFired,
    looped,
    trigger: firedTrigger,
  };
}

/**
 * Advance countdown based on a roll result (for dynamic countdowns)
 */
export function advanceByRollResult(
  countdown: Countdown,
  rollResult: RollResult
): AdvanceResult {
  const amount = ROLL_RESULT_ADVANCEMENT[rollResult];
  return advanceCountdownWithResult(countdown, amount, rollResult);
}

/**
 * Get the advancement amount for a given roll result
 */
export function getAdvancementForRollResult(rollResult: RollResult): number {
  return ROLL_RESULT_ADVANCEMENT[rollResult];
}

export function isCountdownComplete(countdown: Countdown): boolean {
  return countdown.filled >= countdown.segments;
}

export function getCountdownProgress(countdown: Countdown): number {
  return countdown.filled / countdown.segments;
}

/**
 * Reset a countdown to its initial state
 */
export function resetCountdown(countdown: Countdown): Countdown {
  const newStart = calculateVarianceStart(
    countdown.segments,
    countdown.variance
  );
  return {
    ...countdown,
    filled: newStart,
    loopCount: 0,
    advancementHistory: [],
    trigger: countdown.trigger
      ? { ...countdown.trigger, fired: false }
      : undefined,
  };
}

/**
 * Undo the last advancement
 */
export function undoLastAdvancement(countdown: Countdown): Countdown {
  const history = countdown.advancementHistory ?? [];
  if (history.length === 0) return countdown;

  const lastEntry = history[history.length - 1];
  const newHistory = history.slice(0, -1);

  return {
    ...countdown,
    filled: Math.max(0, countdown.filled - lastEntry.amount),
    advancementHistory: newHistory,
  };
}

export function sortCountdowns(countdowns: Countdown[]): Countdown[] {
  return [...countdowns].sort((a, b) => {
    // Complete ones at the end (unless they loop)
    const aComplete = isCountdownComplete(a) && a.behavior !== 'loop';
    const bComplete = isCountdownComplete(b) && b.behavior !== 'loop';
    if (aComplete !== bComplete) return aComplete ? 1 : -1;
    // Then by progress (higher first)
    const progressDiff = getCountdownProgress(b) - getCountdownProgress(a);
    if (progressDiff !== 0) return progressDiff;
    // Then by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
