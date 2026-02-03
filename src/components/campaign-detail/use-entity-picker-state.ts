/**
 * Generic hook for entity picker modal state.
 * Consolidates common state management for LocationPickerModal, QuestPickerModal, OrganizationPickerModal.
 */
import { useCallback, useState } from 'react';

interface UseEntityPickerStateOptions<TType extends string> {
  multiSelect: boolean;
  onSelectSingle: (id: string) => void;
  onSelectMultiple?: (ids: string[]) => void;
  onClose: () => void;
  defaultType?: TType;
}

export function useEntityPickerState<TType extends string>({
  multiSelect,
  onSelectSingle,
  onSelectMultiple,
  onClose,
  defaultType,
}: UseEntityPickerStateOptions<TType>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<TType | undefined>(defaultType);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const resetState = useCallback(() => {
    setSearchQuery('');
    setNewName('');
    setNewType(defaultType);
    setSelectedIds([]);
    setIsCreating(false);
  }, [defaultType]);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handleToggleSelection = useCallback(
    (id: string) => {
      if (multiSelect) {
        setSelectedIds(prev =>
          prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
      } else {
        onSelectSingle(id);
        handleClose();
      }
    },
    [multiSelect, onSelectSingle, handleClose]
  );

  const handleConfirmMultiple = useCallback(() => {
    if (multiSelect && onSelectMultiple && selectedIds.length > 0) {
      onSelectMultiple(selectedIds);
      handleClose();
    }
  }, [multiSelect, selectedIds, onSelectMultiple, handleClose]);

  const createAndAdd = useCallback(
    async (createFn: () => Promise<string>) => {
      if (!newName.trim()) return;
      setIsCreating(true);
      try {
        const newId = await createFn();
        if (multiSelect && onSelectMultiple) {
          onSelectMultiple([...selectedIds, newId]);
        } else {
          onSelectSingle(newId);
        }
        handleClose();
      } finally {
        setIsCreating(false);
      }
    },
    [
      newName,
      multiSelect,
      selectedIds,
      onSelectMultiple,
      onSelectSingle,
      handleClose,
    ]
  );

  return {
    // State
    searchQuery,
    setSearchQuery,
    newName,
    setNewName,
    newType,
    setNewType,
    selectedIds,
    isCreating,
    // Handlers
    handleClose,
    handleToggleSelection,
    handleConfirmMultiple,
    createAndAdd,
  };
}

/**
 * Filter entities by search query on name field
 */
export function filterByName<T extends { name: string }>(
  entities: T[],
  query: string
): T[] {
  const normalizedQuery = query.toLowerCase();
  if (!normalizedQuery) return entities;
  return entities.filter(e => e.name.toLowerCase().includes(normalizedQuery));
}

/**
 * Filter entities by search query on title field (for quests)
 */
export function filterByTitle<T extends { title: string }>(
  entities: T[],
  query: string
): T[] {
  const normalizedQuery = query.toLowerCase();
  if (!normalizedQuery) return entities;
  return entities.filter(e => e.title.toLowerCase().includes(normalizedQuery));
}

/**
 * Exclude already selected items
 */
export function excludeSelected<T extends { id: string }>(
  entities: T[],
  selectedIds: string[]
): T[] {
  return entities.filter(e => !selectedIds.includes(e.id));
}
