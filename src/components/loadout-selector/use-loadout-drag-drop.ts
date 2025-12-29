import { useCallback, useEffect, useRef, useState } from 'react';

import type { DragSource } from './domain-card-mini';

export function useLoadoutDragDrop(
  onMoveCard?: (
    from: { location: 'active' | 'vault'; index: number },
    to: { location: 'active' | 'vault'; index: number }
  ) => void
) {
  const dragSourceRef = useRef<DragSource>(null);
  const [dragSource, setDragSource] = useState<DragSource>(null);
  const [dragOverTarget, setDragOverTarget] = useState<DragSource>(null);
  const [swapSource, setSwapSource] = useState<DragSource>(null);

  const clearDragState = useCallback(() => {
    dragSourceRef.current = null;
    setDragSource(null);
    setDragOverTarget(null);
  }, []);

  // Safety net: document-level dragend ensures state is always cleared
  // even if the element's onDragEnd doesn't fire (can happen with fast drags)
  useEffect(() => {
    const handleDocumentDragEnd = () => {
      clearDragState();
    };

    document.addEventListener('dragend', handleDocumentDragEnd);
    return () => {
      document.removeEventListener('dragend', handleDocumentDragEnd);
    };
  }, [clearDragState]);

  const handleDragStart = useCallback(
    (location: 'active' | 'vault', index: number) => {
      dragSourceRef.current = { location, index };
      setDragSource({ location, index });
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, location: 'active' | 'vault', index: number) => {
      e.preventDefault();
      setDragOverTarget({ location, index });
    },
    []
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear if we're leaving to outside (not to a child element)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverTarget(null);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    clearDragState();
  }, [clearDragState]);

  const handleDrop = useCallback(
    (toLocation: 'active' | 'vault', toIndex: number) => {
      const source = swapSource ?? dragSourceRef.current;

      // Clear state first to prevent visual glitches on fast operations
      clearDragState();
      setSwapSource(null);

      if (!source) return;

      const isSameCard =
        source.location === toLocation && source.index === toIndex;
      if (isSameCard) return;

      onMoveCard?.(source, { location: toLocation, index: toIndex });
    },
    [onMoveCard, clearDragState, swapSource]
  );

  const handleSelectForSwap = useCallback(
    (location: 'active' | 'vault', index: number) => {
      setSwapSource({ location, index });
    },
    []
  );

  const handleCancelSwap = useCallback(() => {
    setSwapSource(null);
  }, []);

  return {
    dragSource,
    dragOverTarget,
    swapSource,
    isSwapMode: swapSource !== null,
    isDragging: dragSource !== null,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDrop,
    handleSelectForSwap,
    handleCancelSwap,
  };
}
