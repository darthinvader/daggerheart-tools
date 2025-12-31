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

interface ExperienceBoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedExperiences: string[]) => void;
  experiences: { id: string; name: string; value: number }[];
  requiredCount: number;
}

export function ExperienceBoostModal({
  isOpen,
  onClose,
  onConfirm,
  experiences,
  requiredCount,
}: ExperienceBoostModalProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = useCallback(
    (expId: string) => {
      setSelected(prev => {
        if (prev.includes(expId)) {
          return prev.filter(id => id !== expId);
        }
        if (prev.length >= requiredCount) {
          return prev;
        }
        return [...prev, expId];
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
      <DialogContent className="w-[98vw] max-w-xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Boost Experiences</DialogTitle>
          <DialogDescription>
            Choose {requiredCount} experiences to permanently gain +1.
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

          {experiences.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-muted-foreground">No experiences available.</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Add experiences first before boosting them.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {experiences.map(exp => {
                const isSelected = selected.includes(exp.id);
                const isDisabled =
                  !isSelected && selected.length >= requiredCount;

                return (
                  <button
                    key={exp.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleToggle(exp.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors',
                      isSelected && 'border-primary bg-primary/10',
                      isDisabled && 'cursor-not-allowed opacity-50',
                      !isSelected && !isDisabled && 'hover:border-primary/50'
                    )}
                  >
                    <div>
                      <span className="font-medium">{exp.name}</span>
                      <span className="text-muted-foreground ml-2 text-sm">
                        +{exp.value} → +{exp.value + 1}
                      </span>
                    </div>
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
