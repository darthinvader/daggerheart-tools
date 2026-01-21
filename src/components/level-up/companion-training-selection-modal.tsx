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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  onConfirm: (selection: {
    trainingId: string;
    experienceIndex?: number;
  }) => void;
  currentTraining: CompanionTraining | undefined;
  companionExperiences?: { name: string; bonus: number }[];
}

const TRAINING_OPTIONS: Omit<TrainingOption, 'currentValue'>[] = [
  {
    id: 'intelligent',
    label: 'Intelligent',
    description: '+1 to a Companion Experience',
    maxSelections: 3,
  },
  {
    id: 'vicious',
    label: 'Vicious',
    description: 'Increase damage die or range by one step',
    maxSelections: 3,
  },
  {
    id: 'resilient',
    label: 'Resilient',
    description: 'Gain an additional Stress slot',
    maxSelections: 3,
  },
  {
    id: 'aware',
    label: 'Aware',
    description: '+2 permanent Evasion bonus (stacks)',
    maxSelections: 3,
  },
  {
    id: 'lightInTheDark',
    label: 'Light in the Dark',
    description: 'Additional Hope slot for your character',
    maxSelections: 1,
  },
  {
    id: 'creatureComfort',
    label: 'Creature Comfort',
    description: 'Once per rest: gain Hope or both clear Stress',
    maxSelections: 1,
  },
  {
    id: 'armored',
    label: 'Armored',
    description: 'Mark your Armor Slot instead of companion Stress',
    maxSelections: 1,
  },
  {
    id: 'bonded',
    label: 'Bonded',
    description: 'Companion may help you up at last HP',
    maxSelections: 1,
  },
];

export function CompanionTrainingSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  currentTraining,
  companionExperiences = [],
}: CompanionTrainingSelectionModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<
    number | null
  >(null);

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
    if (optionId !== 'intelligent') {
      setSelectedExperienceIndex(null);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (selected) {
      onConfirm({
        trainingId: selected,
        experienceIndex:
          selected === 'intelligent'
            ? (selectedExperienceIndex ?? undefined)
            : undefined,
      });
      setSelected(null);
      setSelectedExperienceIndex(null);
    }
  }, [selected, onConfirm, selectedExperienceIndex]);

  const handleClose = useCallback(() => {
    setSelected(null);
    setSelectedExperienceIndex(null);
    onClose();
  }, [onClose]);

  const options = getTrainingOptions();
  const availableOptions = options.filter(isOptionAvailable);
  const requiresCompanionExperience =
    selected === 'intelligent' && companionExperiences.length > 0;
  const canConfirm =
    !!selected &&
    (!requiresCompanionExperience || selectedExperienceIndex !== null);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="w-[98vw] max-w-2xl sm:max-w-2xl">
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

        {selected === 'intelligent' && companionExperiences.length > 0 && (
          <div className="space-y-2">
            <Label>Choose a companion experience to boost</Label>
            <Select
              value={
                selectedExperienceIndex !== null
                  ? String(selectedExperienceIndex)
                  : ''
              }
              onValueChange={value =>
                setSelectedExperienceIndex(value ? Number(value) : null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an experience" />
              </SelectTrigger>
              <SelectContent>
                {companionExperiences.map((exp, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {exp.name || `Experience ${index + 1}`} (+{exp.bonus})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedExperienceIndex === null && (
              <p className="text-muted-foreground text-xs">
                Select an experience to apply the +1 bonus.
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!canConfirm}>
            Confirm Training
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
