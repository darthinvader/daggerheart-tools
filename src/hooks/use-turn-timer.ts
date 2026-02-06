import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_DURATION_SECONDS = 3 * 60;
const TICK_INTERVAL_MS = 100;

interface UseTurnTimerOptions {
  /** Initial duration in seconds (default: 180 = 3 minutes) */
  initialDuration?: number;
  /** Called when timer reaches zero */
  onExpire?: () => void;
}

interface UseTurnTimerReturn {
  /** Time remaining in seconds (fractional) */
  timeRemaining: number;
  /** Whether the timer is actively counting down */
  isRunning: boolean;
  /** Start or resume the timer */
  start: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Reset the timer to the current duration */
  reset: () => void;
  /** Set a new duration in seconds and reset */
  setDuration: (seconds: number) => void;
  /** Progress from 0 (expired) to 1 (full time remaining) */
  progress: number;
  /** Whether the timer has reached zero */
  isExpired: boolean;
  /** The configured total duration in seconds */
  totalDuration: number;
}

export function useTurnTimer({
  initialDuration = DEFAULT_DURATION_SECONDS,
  onExpire,
}: UseTurnTimerOptions = {}): UseTurnTimerReturn {
  const [totalDuration, setTotalDuration] = useState(initialDuration);
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(0);
  const onExpireRef = useRef(onExpire);
  const hasExpiredRef = useRef(false);

  // Keep onExpire callback ref current without re-triggering effects
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (hasExpiredRef.current) return;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setTimeRemaining(totalDuration);
    hasExpiredRef.current = false;
  }, [totalDuration, clearTimer]);

  const setDuration = useCallback(
    (seconds: number) => {
      const clamped = Math.max(60, Math.min(600, seconds));
      clearTimer();
      setIsRunning(false);
      setTotalDuration(clamped);
      setTimeRemaining(clamped);
      hasExpiredRef.current = false;
    },
    [clearTimer]
  );

  // Core timer tick
  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    lastTickRef.current = performance.now();

    intervalRef.current = setInterval(() => {
      const now = performance.now();
      const elapsed = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setTimeRemaining(prev => {
        const next = Math.max(0, prev - elapsed);
        if (next <= 0 && !hasExpiredRef.current) {
          hasExpiredRef.current = true;
          onExpireRef.current?.();
        }
        return next;
      });

      // Auto-pause when expired (inside callback, not synchronous in effect)
      if (hasExpiredRef.current) {
        setIsRunning(false);
        clearTimer();
      }
    }, TICK_INTERVAL_MS);

    return clearTimer;
  }, [isRunning, clearTimer]);

  const progress = totalDuration > 0 ? timeRemaining / totalDuration : 0;
  const isExpired = timeRemaining <= 0;

  return {
    timeRemaining,
    isRunning,
    start,
    pause,
    reset,
    setDuration,
    progress,
    isExpired,
    totalDuration,
  };
}
