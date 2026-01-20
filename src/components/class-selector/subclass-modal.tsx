import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { GameClass, GameSubclass } from '@/lib/data/classes';
import { CLASS_COLORS, CLASS_EMOJIS } from '@/lib/schemas/class-selection';
import { cn } from '@/lib/utils';

import { SubclassCard } from './subclass-card';

interface SubclassModalContentProps {
  gameClass: GameClass;
  selectedSubclass: GameSubclass | undefined;
  onConfirm: (className: string, subclass: GameSubclass) => void;
  onCancel: () => void;
}

// Inner component that resets when key changes
function SubclassModalContent({
  gameClass,
  selectedSubclass,
  onConfirm,
  onCancel,
}: SubclassModalContentProps) {
  const [tempSelection, setTempSelection] = useState<GameSubclass | null>(
    selectedSubclass ?? null
  );

  const emoji = CLASS_EMOJIS[gameClass.name] ?? '⚔️';
  const colorClass = CLASS_COLORS[gameClass.name] ?? 'text-foreground';

  const handleConfirm = useCallback(() => {
    if (tempSelection) {
      onConfirm(gameClass.name, tempSelection);
    }
  }, [gameClass.name, tempSelection, onConfirm]);

  return (
    <DialogContent className="flex max-h-[90vh] w-[95vw] flex-col sm:max-w-4xl lg:max-w-5xl">
      <DialogHeader>
        <DialogTitle className={cn('flex items-center gap-2', colorClass)}>
          <span>{emoji}</span>
          <span>Choose Your {gameClass.name} Subclass</span>
        </DialogTitle>
        <DialogDescription>
          Select a subclass to specialize your {gameClass.name}. Each subclass
          offers unique features and abilities.
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="flex-1 pr-4">
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
          {gameClass.subclasses.map(subclass => (
            <SubclassCard
              key={subclass.name}
              subclass={subclass}
              className={gameClass.name}
              isSelected={tempSelection?.name === subclass.name}
              onSelect={() => setTempSelection(subclass)}
            />
          ))}
        </div>
      </ScrollArea>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={!tempSelection}>
          {tempSelection ? (
            <span className="flex items-center gap-2">
              <span>Select {tempSelection.name}</span>
            </span>
          ) : (
            'Select a Subclass'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

interface SubclassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameClass: GameClass | null;
  selectedSubclass: GameSubclass | undefined;
  onConfirm: (className: string, subclass: GameSubclass) => void;
}

export function SubclassModal({
  open,
  onOpenChange,
  gameClass,
  selectedSubclass,
  onConfirm,
}: SubclassModalProps) {
  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleConfirm = useCallback(
    (className: string, subclass: GameSubclass) => {
      onConfirm(className, subclass);
      onOpenChange(false);
    },
    [onConfirm, onOpenChange]
  );

  if (!gameClass) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Key ensures state resets when class changes */}
      <SubclassModalContent
        key={gameClass.name}
        gameClass={gameClass}
        selectedSubclass={selectedSubclass}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Dialog>
  );
}
