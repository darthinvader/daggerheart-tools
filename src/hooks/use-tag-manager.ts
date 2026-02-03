// Hook for managing tag state in entity cards
// Used by NPC, Location, Organization, Quest cards

import { useCallback, useState } from 'react';

// =====================================================================================
// Types
// =====================================================================================

interface UseTagManagerOptions<T extends { tags: string[] }> {
  /** Current entity state */
  entity: T;
  /** Setter for entity state */
  setEntity: React.Dispatch<React.SetStateAction<T>>;
  /** Auto-save scheduler function */
  scheduleAutoSave: (entity: T) => void;
}

interface UseTagManagerResult {
  /** Current tag input value */
  tagInput: string;
  /** Set tag input value */
  setTagInput: (value: string) => void;
  /** Add the current tag input to the entity */
  addTag: () => void;
  /** Remove a specific tag from the entity */
  removeTag: (tag: string) => void;
}

// =====================================================================================
// useTagManager Hook
// =====================================================================================

/**
 * Hook to manage tag state for entity cards.
 * Provides consistent tag add/remove logic with auto-save integration.
 */
export function useTagManager<T extends { tags: string[] }>({
  entity,
  setEntity,
  scheduleAutoSave,
}: UseTagManagerOptions<T>): UseTagManagerResult {
  const [tagInput, setTagInput] = useState('');

  const addTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (!trimmed || entity.tags.includes(trimmed)) return;
    setEntity(current => {
      const updated = { ...current, tags: [...current.tags, trimmed] };
      scheduleAutoSave(updated);
      return updated;
    });
    setTagInput('');
  }, [entity.tags, tagInput, scheduleAutoSave, setEntity]);

  const removeTag = useCallback(
    (tag: string) => {
      setEntity(current => {
        const updated = {
          ...current,
          tags: current.tags.filter(t => t !== tag),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave, setEntity]
  );

  return { tagInput, setTagInput, addTag, removeTag };
}
