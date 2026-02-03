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
import type { GameClass, GameSubclass } from '@/lib/data/classes';
import { ClassIcons, HelpCircle, ICON_SIZE_LG } from '@/lib/icons';
import { CLASS_COLORS } from '@/lib/schemas/class-selection';
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

  const ClassIcon = ClassIcons[gameClass.name] ?? HelpCircle;
  const colorClass = CLASS_COLORS[gameClass.name] ?? 'text-foreground';

  const handleConfirm = useCallback(() => {
    if (tempSelection) {
      onConfirm(gameClass.name, tempSelection);
    }
  }, [gameClass.name, tempSelection, onConfirm]);

  return (
    <DialogContent className="flex h-full w-full flex-col gap-4 overflow-hidden p-4 sm:h-auto sm:max-h-[85vh] sm:w-[95vw] sm:max-w-4xl sm:p-6 lg:max-w-5xl">
      <DialogHeader className="shrink-0">
        <DialogTitle className={cn('flex items-center gap-2', colorClass)}>
          <ClassIcon size={ICON_SIZE_LG} />
          <span>Choose Your {gameClass.name} Subclass</span>
        </DialogTitle>
        <DialogDescription>
          Select a subclass to specialize your {gameClass.name}. Each subclass
          offers unique features and abilities.
        </DialogDescription>
      </DialogHeader>

      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
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
      </div>

      <DialogFooter className="shrink-0">
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
