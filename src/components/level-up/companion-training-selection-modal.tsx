import { Check, Dog } from 'lucide-react';
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
import type { CompanionTraining } from '@/lib/schemas/core';
import { cn } from '@/lib/utils';

interface TrainingOption {
  id: keyof CompanionTraining;
  label: string;
  description: string;
  maxSelections: number;
  currentValue: number | boolean;
}

interface CompanionTrainingSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (trainingId: string) => void;
  currentTraining: CompanionTraining | undefined;
}

const TRAINING_OPTIONS: Omit<TrainingOption, 'currentValue'>[] = [
  {
    id: 'intelligent',
    label: 'Intelligent',
    description: '+1 Companion Experience bonus (max +3 total)',
    maxSelections: 3,
  },
  {
    id: 'vicious',
    label: 'Vicious',
    description: 'Upgrade damage die by one step (max 3 upgrades)',
    maxSelections: 3,
  },
  {
    id: 'resilient',
    label: 'Resilient',
    description: '+1 Stress Slot (max 3 extra slots)',
    maxSelections: 3,
  },
  {
    id: 'aware',
    label: 'Aware',
    description: '+2 Evasion (max +6 total)',
    maxSelections: 3,
  },
  {
    id: 'lightInTheDark',
    label: 'Light in the Dark',
    description:
      'Gain an additional Hope slot while your companion is with you',
    maxSelections: 1,
  },
  {
    id: 'creatureComfort',
    label: 'Creature Comfort',
    description: 'Clear +1 Stress when taking a short rest with your companion',
    maxSelections: 1,
  },
  {
    id: 'armored',
    label: 'Armored',
    description: 'Companion gains +2 Armor',
    maxSelections: 1,
  },
  {
    id: 'bonded',
    label: 'Bonded',
    description: 'Telepathic communication with your companion',
    maxSelections: 1,
  },
];

export function CompanionTrainingSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  currentTraining,
}: CompanionTrainingSelectionModalProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const getTrainingOptions = useCallback((): TrainingOption[] => {
    return TRAINING_OPTIONS.map(opt => ({
      ...opt,
      currentValue:
        currentTraining?.[opt.id] ?? (opt.maxSelections === 1 ? false : 0),
    }));
  }, [currentTraining]);

  const isOptionAvailable = useCallback((option: TrainingOption): boolean => {
    if (option.maxSelections === 1) {
      return option.currentValue !== true;
    }
    return (option.currentValue as number) < option.maxSelections;
  }, []);

  const handleSelect = useCallback((optionId: string) => {
    setSelected(prev => (prev === optionId ? null : optionId));
  }, []);

  const handleConfirm = useCallback(() => {
    if (selected) {
      onConfirm(selected);
      setSelected(null);
    }
  }, [selected, onConfirm]);

  const handleClose = useCallback(() => {
    setSelected(null);
    onClose();
  }, [onClose]);

  const options = getTrainingOptions();
  const availableOptions = options.filter(isOptionAvailable);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dog className="size-5" />
            Companion Training
          </DialogTitle>
          <DialogDescription>
            Choose a training upgrade for your companion.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 space-y-2 overflow-y-auto py-2">
          {availableOptions.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              All training options have been maxed out.
            </p>
          ) : (
            availableOptions.map(option => {
              const isSelected = selected === option.id;
              const currentCount =
                typeof option.currentValue === 'number'
                  ? option.currentValue
                  : option.currentValue
                    ? 1
                    : 0;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    'w-full rounded-lg border p-3 text-left transition-all',
                    'hover:border-primary/50 hover:bg-accent/50',
                    isSelected &&
                      'border-primary bg-primary/10 ring-primary ring-1'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.label}</span>
                        {option.maxSelections > 1 && (
                          <Badge variant="outline" className="text-xs">
                            {currentCount}/{option.maxSelections}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="text-primary size-5 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selected}>
            Confirm Training
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
