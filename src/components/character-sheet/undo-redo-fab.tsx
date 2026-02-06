import { Redo2, Undo2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UndoRedoFabProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

/**
 * Floating action buttons for undo/redo on mobile.
 * Positioned above the MobileBottomNav (h-14 = 3.5rem + 0.75rem gap).
 * Hidden on desktop (md:hidden) where the compact header controls are used.
 */
export function UndoRedoFab({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: UndoRedoFabProps) {
  const visible = canUndo || canRedo;

  return (
    <div
      className={cn(
        'fixed right-3 z-[51] flex flex-col gap-1.5 md:hidden',
        'bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))]',
        'transition-all duration-200',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0'
      )}
      role="toolbar"
      aria-label="Undo and redo"
    >
      <Button
        variant="secondary"
        size="icon"
        className="size-10 rounded-full shadow-md"
        disabled={!canRedo}
        onClick={onRedo}
        aria-label="Redo"
      >
        <Redo2 className="size-[18px]" />
      </Button>
      <Button
        variant="default"
        size="icon"
        className="size-10 rounded-full shadow-lg"
        disabled={!canUndo}
        onClick={onUndo}
        aria-label="Undo"
      >
        <Undo2 className="size-[18px]" />
      </Button>
    </div>
  );
}
