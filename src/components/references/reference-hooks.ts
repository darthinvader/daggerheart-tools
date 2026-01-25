import * as React from 'react';

/**
 * Hook for keyboard navigation in detail panels
 * - ArrowLeft/ArrowUp: Navigate to previous item
 * - ArrowRight/ArrowDown: Navigate to next item
 * - Escape: Close the panel
 */
export function useKeyboardNavigation<T>({
  items,
  selectedItem,
  onSelect,
  onClose,
}: {
  items: T[];
  selectedItem: T | null;
  onSelect: (item: T | null) => void;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle navigation when an item is selected
      if (!selectedItem) return;

      // Ignore if user is typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const currentIndex = items.indexOf(selectedItem);
      if (currentIndex === -1) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          if (currentIndex < items.length - 1) {
            onSelect(items[currentIndex + 1]);
          }
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          if (currentIndex > 0) {
            onSelect(items[currentIndex - 1]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedItem, onSelect, onClose]);
}

/**
 * Hook for managing sort state
 */
export function useSortState<T extends string>(defaultSort: T) {
  const [sortBy, setSortBy] = React.useState<T>(defaultSort);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'asc'
  );

  return {
    sortBy,
    sortDirection,
    setSortBy,
    setSortDirection,
  };
}
