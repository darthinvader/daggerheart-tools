import { useMutation, useQueryClient } from '@tanstack/react-query';
/**
 * Hook for debounced auto-save functionality
 */
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
 * Hook that provides debounced auto-save functionality for character data
 */
export function useAutoSave(characterId: string): UseAutoSaveReturn {
  const queryClient = useQueryClient();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingUpdatesRef = useRef<Partial<CharacterRecord>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Mutation for saving to API
  const saveMutation = useMutation({
    mutationFn: (updates: Partial<CharacterRecord>) =>
      updateCharacter(characterId, updates),
    onSuccess: data => {
      queryClient.setQueryData(characterQueryKeys.detail(characterId), data);
      setLastSaved(new Date());
      setIsSaving(false);
    },
    onError: () => {
      setIsSaving(false);
    },
  });

  // Debounced save function that merges pending updates
  const scheduleSave = useCallback(
    (updates: Partial<CharacterRecord>) => {
      // Merge new updates with any pending updates (deep merge for nested objects)
      const currentPending = pendingUpdatesRef.current;
      pendingUpdatesRef.current = {
        ...currentPending,
        ...updates,
        // Deep merge nested objects
        equipment: updates.equipment
          ? { ...currentPending.equipment, ...updates.equipment }
          : currentPending.equipment,
        resources: updates.resources
          ? { ...currentPending.resources, ...updates.resources }
          : currentPending.resources,
        identity: updates.identity
          ? { ...currentPending.identity, ...updates.identity }
          : currentPending.identity,
        domains: updates.domains
          ? { ...currentPending.domains, ...updates.domains }
          : currentPending.domains,
      };

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      setIsSaving(true);
      saveTimeoutRef.current = setTimeout(() => {
        const toSave = pendingUpdatesRef.current;
        pendingUpdatesRef.current = {}; // Clear pending updates
        saveMutation.mutate(toSave);
      }, SAVE_DELAY);
    },
    [saveMutation]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    lastSaved,
    scheduleSave,
  };
}
