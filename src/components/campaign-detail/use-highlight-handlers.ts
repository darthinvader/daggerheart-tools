/**
 * Hook for managing key highlights in entity cards
 * Extracted to reduce component complexity
 */
import { useCallback, useState } from 'react';

interface UseHighlightHandlersProps<T extends { keyHighlights?: string[] }> {
  setLocalEntity: React.Dispatch<React.SetStateAction<T>>;
  scheduleAutoSave: (updated: T) => void;
}

export function useHighlightHandlers<T extends { keyHighlights?: string[] }>({
  setLocalEntity,
  scheduleAutoSave,
}: UseHighlightHandlersProps<T>) {
  const [highlightInput, setHighlightInput] = useState('');

  const addHighlight = useCallback(() => {
    const trimmed = highlightInput.trim();
    if (!trimmed) return;
    setLocalEntity(current => {
      const newHighlights = [...(current.keyHighlights ?? []), trimmed];
      const updated = { ...current, keyHighlights: newHighlights };
      scheduleAutoSave(updated);
      return updated;
    });
    setHighlightInput('');
  }, [highlightInput, setLocalEntity, scheduleAutoSave]);

  const removeHighlight = useCallback(
    (index: number) => {
      setLocalEntity(current => {
        const newHighlights = (current.keyHighlights ?? []).filter(
          (_, i) => i !== index
        );
        const updated = { ...current, keyHighlights: newHighlights };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [setLocalEntity, scheduleAutoSave]
  );

  return {
    highlightInput,
    setHighlightInput,
    addHighlight,
    removeHighlight,
  };
}
