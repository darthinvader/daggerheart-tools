import { Check } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface TraitSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedTraits: string[]) => void;
  unmarkedTraits: { name: string; marked: boolean }[];
  requiredCount: number;
}

export function TraitSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  unmarkedTraits,
  requiredCount,
}: TraitSelectionModalProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = useCallback(
    (traitName: string) => {
      setSelected(prev => {
        if (prev.includes(traitName)) {
          return prev.filter(t => t !== traitName);
        }
        if (prev.length >= requiredCount) {
          return prev;
        }
        return [...prev, traitName];
      });
    },
    [requiredCount]
  );

  const handleConfirm = useCallback(() => {
    onConfirm(selected);
    setSelected([]);
  }, [selected, onConfirm]);

  const handleClose = useCallback(() => {
    setSelected([]);
    onClose();
  }, [onClose]);

  const canConfirm = selected.length === requiredCount;

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="w-[98vw] max-w-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Traits to Boost</DialogTitle>
          <DialogDescription>
            Choose {requiredCount} unmarked traits to gain +1 and mark them.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Selected: {selected.length} / {requiredCount}
            </span>
            {selected.length === requiredCount && (
              <Badge variant="default" className="text-xs">
                Ready
              </Badge>
            )}
          </div>

          {unmarkedTraits.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-muted-foreground">
                No unmarked traits available.
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                All traits have already been marked this tier.
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {unmarkedTraits.map(trait => {
                const isSelected = selected.includes(trait.name);
                const isDisabled =
                  !isSelected && selected.length >= requiredCount;

                return (
                  <button
                    key={trait.name}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleToggle(trait.name)}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-3 text-left transition-colors',
                      isSelected && 'border-primary bg-primary/10',
                      isDisabled && 'cursor-not-allowed opacity-50',
                      !isSelected && !isDisabled && 'hover:border-primary/50'
                    )}
                  >
                    <span className="font-medium">{trait.name}</span>
                    {isSelected && <Check className="text-primary size-4" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!canConfirm}>
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
