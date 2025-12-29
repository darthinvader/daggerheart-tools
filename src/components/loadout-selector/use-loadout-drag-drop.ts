import { useCallback, useRef, useState } from 'react';

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

  const handleDragEnd = useCallback(() => {
    dragSourceRef.current = null;
    setDragSource(null);
    setDragOverTarget(null);
  }, []);

  const handleDrop = useCallback(
    (toLocation: 'active' | 'vault', toIndex: number) => {
      const source = swapSource ?? dragSourceRef.current;
      if (!source) return;

      const isSameCard =
        source.location === toLocation && source.index === toIndex;
      if (isSameCard) {
        setSwapSource(null);
        handleDragEnd();
        return;
      }

      onMoveCard?.(source, { location: toLocation, index: toIndex });
      setSwapSource(null);
      handleDragEnd();
    },
    [onMoveCard, handleDragEnd, swapSource]
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
    handleDragEnd,
    handleDrop,
    handleSelectForSwap,
    handleCancelSwap,
  };
}
