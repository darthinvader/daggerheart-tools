// Components
export { CountdownTracker } from './countdown-tracker';
export { CountdownCard } from './countdown-card';
export { CountdownSegments } from './countdown-segments';
export { AddCountdownDialog } from './add-countdown-dialog';

// Utilities
export {
  advanceByRollResult,
  advanceCountdown,
  advanceCountdownWithResult,
  calculateVarianceStart,
  createCountdown,
  getAdvancementForRollResult,
  getCountdownProgress,
  isCountdownComplete,
  resetCountdown,
  sortCountdowns,
  undoLastAdvancement,
} from './countdown-utils';
export type { AdvanceResult } from './countdown-utils';

// Constants
export {
  COUNTDOWN_BEHAVIOR_OPTIONS,
  COUNTDOWN_SEGMENT_OPTIONS,
  COUNTDOWN_TYPE_STYLES,
  COUNTDOWN_TYPES,
  ROLL_RESULT_OPTIONS,
  TRIGGER_ACTION_OPTIONS,
  VARIANCE_OPTIONS,
} from './constants';

// Types
export type {
  Countdown,
  CountdownBehavior,
  CountdownsState,
  CountdownTrigger,
  CountdownType,
  CreateCountdownOptions,
  RollResult,
  VarianceMode,
} from './types';
export { ROLL_RESULT_ADVANCEMENT, VARIANCE_RANGES } from './types';
