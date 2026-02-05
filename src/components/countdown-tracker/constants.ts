import type {
  CountdownBehavior,
  CountdownType,
  RollResult,
  VarianceMode,
} from './types';

export const COUNTDOWN_TYPES: {
  value: CountdownType;
  label: string;
  color: string;
}[] = [
  { value: 'threat', label: 'Threat', color: 'text-red-500' },
  { value: 'opportunity', label: 'Opportunity', color: 'text-green-500' },
  { value: 'neutral', label: 'Neutral', color: 'text-slate-500' },
];

export const COUNTDOWN_SEGMENT_OPTIONS = [4, 6, 8, 10, 12];

export const COUNTDOWN_TYPE_STYLES: Record<
  CountdownType,
  { ring: string; fill: string; bg: string }
> = {
  threat: {
    ring: 'ring-red-500/50',
    fill: 'bg-red-500',
    bg: 'bg-red-500/10',
  },
  opportunity: {
    ring: 'ring-green-500/50',
    fill: 'bg-green-500',
    bg: 'bg-green-500/10',
  },
  neutral: {
    ring: 'ring-slate-500/50',
    fill: 'bg-slate-500',
    bg: 'bg-slate-500/10',
  },
};

/**
 * Roll result options for dynamic advancement
 * Based on Daggerheart Chapter 3 rules
 */
export const ROLL_RESULT_OPTIONS: {
  value: RollResult;
  label: string;
  shortLabel: string;
  advancement: number;
  color: string;
  description: string;
}[] = [
  {
    value: 'critical_success',
    label: 'Critical Success',
    shortLabel: 'Crit',
    advancement: 3,
    color: 'text-yellow-500',
    description: 'Both dice match on a success',
  },
  {
    value: 'success_with_hope',
    label: 'Success with Hope',
    shortLabel: 'Hope',
    advancement: 2,
    color: 'text-blue-500',
    description: 'Hope die higher than Fear die',
  },
  {
    value: 'success_with_fear',
    label: 'Success with Fear',
    shortLabel: 'Fear',
    advancement: 1,
    color: 'text-purple-500',
    description: 'Fear die higher than Hope die',
  },
  {
    value: 'failure',
    label: 'Failure',
    shortLabel: 'Fail',
    advancement: 0,
    color: 'text-red-500',
    description: 'Roll below difficulty',
  },
];

/**
 * Behavior options for countdown completion
 */
export const COUNTDOWN_BEHAVIOR_OPTIONS: {
  value: CountdownBehavior;
  label: string;
  description: string;
}[] = [
  {
    value: 'once',
    label: 'Once',
    description: 'Countdown completes and stops',
  },
  {
    value: 'loop',
    label: 'Loop',
    description: 'Countdown restarts when complete',
  },
  {
    value: 'pause',
    label: 'Pause',
    description: 'Countdown pauses at completion until manually reset',
  },
];

/**
 * Variance options for randomized starting positions
 */
export const VARIANCE_OPTIONS: {
  value: VarianceMode;
  label: string;
  description: string;
}[] = [
  {
    value: 'none',
    label: 'None',
    description: 'Always starts at 0',
  },
  {
    value: 'low',
    label: 'Low (0-25%)',
    description: 'Starts 0-25% filled',
  },
  {
    value: 'medium',
    label: 'Medium (0-50%)',
    description: 'Starts 0-50% filled',
  },
  {
    value: 'high',
    label: 'High (0-75%)',
    description: 'Starts 0-75% filled',
  },
];

/**
 * Trigger action options
 */
export const TRIGGER_ACTION_OPTIONS: {
  value: 'notify' | 'spawn_adversary' | 'environment_change' | 'custom';
  label: string;
  description: string;
}[] = [
  {
    value: 'notify',
    label: 'Notify',
    description: 'Show a notification when triggered',
  },
  {
    value: 'spawn_adversary',
    label: 'Spawn Adversary',
    description: 'Add adversaries to the battle',
  },
  {
    value: 'environment_change',
    label: 'Environment Change',
    description: 'Change the environment or hazard',
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Custom trigger action',
  },
];
