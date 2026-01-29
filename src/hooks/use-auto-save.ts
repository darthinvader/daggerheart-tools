import { useCallback, useEffect, useRef } from 'react';

const AUTO_SAVE_DELAY = 1000;

interface UseAutoSaveOptions<T> {
  /** Function to perform the save */
  onSave: (data: T) => Promise<void>;
  /** Called when save starts (for UI indicators) */
  onSaveStart?: () => void;
  /** Called when there are pending unsaved changes */
  onPendingChange?: () => void;
  /** Delay in ms before auto-save triggers (default: 1000) */
  delay?: number;
}

/**
 * Hook for auto-saving data with debounce.
 * Resets the timer on every data change and triggers save after delay.
 * Also provides a flush function to save immediately (useful for blur).
 */
export function useAutoSave<T>({
  onSave,
  onSaveStart,
  onPendingChange,
  delay = AUTO_SAVE_DELAY,
}: UseAutoSaveOptions<T>) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDataRef = useRef<T | null>(null);
  const isMountedRef = useRef(true);
  const onSaveRef = useRef(onSave);
  const onSaveStartRef = useRef(onSaveStart);
  const onPendingChangeRef = useRef(onPendingChange);

  // Keep stable references
  useEffect(() => {
    onSaveRef.current = onSave;
    onSaveStartRef.current = onSaveStart;
    onPendingChangeRef.current = onPendingChange;
  });

  // Track changes and schedule auto-save
  const scheduleAutoSave = useCallback(
    (newData: T) => {
      pendingDataRef.current = newData;

      // Notify that there are unsaved changes
      onPendingChangeRef.current?.();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current || pendingDataRef.current === null) return;

        const dataToSave = pendingDataRef.current;
        pendingDataRef.current = null;

        onSaveStartRef.current?.();
        onSaveRef.current(dataToSave).catch(error => {
          if (isMountedRef.current) {
            console.error('[useAutoSave] Failed to save:', error);
          }
        });
      }, delay);
    },
    [delay]
  );

  // Flush pending save immediately (for blur events)
  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (pendingDataRef.current === null) return;

    const dataToSave = pendingDataRef.current;
    pendingDataRef.current = null;

    onSaveStartRef.current?.();
    onSaveRef.current(dataToSave).catch(error => {
      if (isMountedRef.current) {
        console.error('[useAutoSave] Failed to save on flush:', error);
      }
    });
  }, []);

  // Clear pending save without saving
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    pendingDataRef.current = null;
  }, []);

  // Check if there are unsaved changes
  const hasPendingChanges = useCallback(() => {
    return pendingDataRef.current !== null;
  }, []);

  // Cleanup on unmount - flush pending changes
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Attempt to save pending changes on unmount
      if (pendingDataRef.current !== null) {
        const dataToSave = pendingDataRef.current;
        onSaveRef.current(dataToSave).catch(() => {
          // Silently ignore errors on unmount
        });
      }
    };
  }, []);

  return {
    scheduleAutoSave,
    flush,
    cancel,
    hasPendingChanges,
  };
}
