/**
 * Roll result types for dynamic countdown advancement
 * Based on Daggerheart Chapter 3 rules:
 * - Critical Success: Advance by 3
 * - Success with Hope: Advance by 2
 * - Success with Fear: Advance by 1
 * - Failure: May not advance (or advance enemy countdown)
 */
export type RollResult =
  | 'critical_success'
  | 'success_with_hope'
  | 'success_with_fear'
  | 'failure';

/**
 * Advancement amounts based on roll results (Daggerheart rulebook)
 */
export const ROLL_RESULT_ADVANCEMENT: Record<RollResult, number> = {
  critical_success: 3,
  success_with_hope: 2,
  success_with_fear: 1,
  failure: 0,
};

/**
 * Behavior when countdown reaches completion
 */
export type CountdownBehavior = 'once' | 'loop' | 'pause';

/**
 * Variance mode for starting position
 */
export type VarianceMode = 'none' | 'low' | 'medium' | 'high';

/**
 * Variance ranges (percentage of segments to randomize)
 */
export const VARIANCE_RANGES: Record<VarianceMode, number> = {
  none: 0,
  low: 0.25, // Start 0-25% filled
  medium: 0.5, // Start 0-50% filled
  high: 0.75, // Start 0-75% filled
};

/**
 * Trigger condition for when countdown fires
 */
export interface CountdownTrigger {
  /** Unique identifier for the trigger */
  id: string;
  /** Human-readable description of what happens */
  description: string;
  /** Optional: Action to take (for programmatic use) */
  action?: 'notify' | 'spawn_adversary' | 'environment_change' | 'custom';
  /** Whether the trigger has fired */
  fired: boolean;
}

export interface Countdown {
  id: string;
  name: string;
  description?: string;
  segments: number;
  filled: number;
  type: CountdownType;
  createdAt: string;

  // === Dynamic Advancement ===
  /** Whether to use dynamic advancement based on roll results */
  dynamicAdvancement: boolean;

  // === Loop Behavior ===
  /** Behavior when countdown completes */
  behavior: CountdownBehavior;
  /** Number of times the countdown has looped (for loop behavior) */
  loopCount: number;

  // === Variance ===
  /** Variance mode for randomized starting position */
  variance: VarianceMode;

  // === Triggers ===
  /** Optional trigger that fires when countdown reaches 0 */
  trigger?: CountdownTrigger;

  // === Tracking ===
  /** History of advancement for undo/review */
  advancementHistory?: {
    amount: number;
    rollResult?: RollResult;
    timestamp: string;
  }[];
}

export type CountdownType = 'threat' | 'opportunity' | 'neutral';

export interface CountdownsState {
  countdowns: Countdown[];
}

/**
 * Options for creating a new countdown
 */
export interface CreateCountdownOptions {
  name: string;
  segments?: number;
  type?: CountdownType;
  description?: string;
  dynamicAdvancement?: boolean;
  behavior?: CountdownBehavior;
  variance?: VarianceMode;
  trigger?: Omit<CountdownTrigger, 'id' | 'fired'>;
}
