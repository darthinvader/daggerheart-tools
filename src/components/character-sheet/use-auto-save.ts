import { useMutation, useQueryClient } from '@tanstack/react-query';
/**
 * Hook for debounced auto-save functionality.
 *
 * Features:
 * - Debounced saves to reduce API calls
 * - Deep merges pending updates to avoid losing concurrent changes
 * - Flushes pending updates on unmount to prevent data loss
 */
import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { CharacterRecord } from '@/lib/api/characters';
import { updateCharacter } from '@/lib/api/characters';
import { characterQueryKeys } from '@/lib/api/query-client';

// Debounce delay for auto-save (ms)
const SAVE_DELAY = 1000;

export interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
}

export interface UseAutoSaveReturn extends AutoSaveState {
  scheduleSave: (updates: Partial<CharacterRecord>) => void;
}

/**
 * Generic deep merge for nested objects.
 * Only merges plain objects, arrays and primitives are replaced.
 */
function deepMerge<T extends Record<string, unknown>>(
  target: Partial<T>,
  source: Partial<T>
): Partial<T> {
  const result = { ...target };
  for (const key of Object.keys(source) as (keyof T)[]) {
    const sourceVal = source[key];
    const targetVal = target[key];
    if (
      sourceVal !== undefined &&
      sourceVal !== null &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal !== undefined &&
      targetVal !== null &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      // Deep merge nested objects
      result[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>
      ) as T[keyof T];
    } else if (sourceVal !== undefined) {
      result[key] = sourceVal as T[keyof T];
    }
  }
  return result;
}

/** Accumulate new updates into the pending batch via deep merge. */
function accumulateUpdates(
  pendingRef: MutableRefObject<Partial<CharacterRecord>>,
  updates: Partial<CharacterRecord>
): void {
  pendingRef.current = deepMerge(
    pendingRef.current,
    updates as Record<string, unknown>
  ) as Partial<CharacterRecord>;
}

/** Flush any accumulated pending updates by calling mutate, then clear the buffer. */
function flushPendingUpdates(
  pendingRef: MutableRefObject<Partial<CharacterRecord>>,
  mutateFn: ((updates: Partial<CharacterRecord>) => void) | undefined
): void {
  const pending = pendingRef.current;
  if (Object.keys(pending).length > 0 && mutateFn) {
    mutateFn(pending);
    pendingRef.current = {};
  }
}

/**
 * Hook that provides debounced auto-save functionality for character data
 */
export function useAutoSave(characterId: string): UseAutoSaveReturn {
  const queryClient = useQueryClient();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingUpdatesRef = useRef<Partial<CharacterRecord>>({});
  const isMountedRef = useRef(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Stable reference to mutation function for cleanup
  const mutateRef =
    useRef<(updates: Partial<CharacterRecord>) => void>(undefined);

  // Mutation for saving to API
  const saveMutation = useMutation({
    mutationFn: (updates: Partial<CharacterRecord>) =>
      updateCharacter(characterId, updates),
    onSuccess: data => {
      if (!isMountedRef.current) return;
      queryClient.setQueryData(characterQueryKeys.detail(characterId), data);
      setLastSaved(new Date());
      setIsSaving(false);
    },
    onError: (error: Error) => {
      if (!isMountedRef.current) return;
      setIsSaving(false);
      console.error('[AutoSave] Failed to save character:', error);
    },
  });

  // Keep a stable ref to mutate for the cleanup function
  useEffect(() => {
    mutateRef.current = saveMutation.mutate;
  });

  // Debounced save function that merges pending updates
  const scheduleSave = useCallback(
    (updates: Partial<CharacterRecord>) => {
      accumulateUpdates(pendingUpdatesRef, updates);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      setIsSaving(true);
      saveTimeoutRef.current = setTimeout(() => {
        flushPendingUpdates(pendingUpdatesRef, mutateRef.current);
      }, SAVE_DELAY);
    },
    [] // mutateRef is stable
  );

  // Guard against tab close with unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(pendingUpdatesRef.current).length > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  // Cleanup: flush pending updates on unmount to prevent data loss
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Flush any pending updates before unmount
      flushPendingUpdates(pendingUpdatesRef, mutateRef.current);
    };
  }, []);

  return {
    isSaving,
    lastSaved,
    scheduleSave,
  };
}
