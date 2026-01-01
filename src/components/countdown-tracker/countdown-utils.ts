import { generateId } from '@/lib/utils';

import type { Countdown, CountdownType } from './types';

export function createCountdown(
  name: string,
  segments: number = 6,
  type: CountdownType = 'neutral'
): Countdown {
  return {
    id: generateId(),
    name,
    segments,
    filled: 0,
    type,
    createdAt: new Date().toISOString(),
  };
}

export function advanceCountdown(
  countdown: Countdown,
  amount: number = 1
): Countdown {
  return {
    ...countdown,
    filled: Math.min(
      countdown.segments,
      Math.max(0, countdown.filled + amount)
    ),
  };
}

export function isCountdownComplete(countdown: Countdown): boolean {
  return countdown.filled >= countdown.segments;
}

export function getCountdownProgress(countdown: Countdown): number {
  return countdown.filled / countdown.segments;
}

export function sortCountdowns(countdowns: Countdown[]): Countdown[] {
  return [...countdowns].sort((a, b) => {
    // Complete ones at the end
    const aComplete = isCountdownComplete(a);
    const bComplete = isCountdownComplete(b);
    if (aComplete !== bComplete) return aComplete ? 1 : -1;
    // Then by progress (higher first)
    const progressDiff = getCountdownProgress(b) - getCountdownProgress(a);
    if (progressDiff !== 0) return progressDiff;
    // Then by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
