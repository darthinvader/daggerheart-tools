import { Check } from 'lucide-react';
import { useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import type { CompanionTraining } from '@/lib/schemas/core';
import { cn } from '@/lib/utils';

interface TrainingOption {
  id: keyof CompanionTraining;
  label: string;
  description: string;
  maxSelections: number;
  currentValue: number | boolean;
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

interface CompanionBenefitsStepProps {
  companionName: string;
  currentTraining: CompanionTraining | undefined;
  selectedTraining: string | null;
  onSelectTraining: (trainingId: string | null) => void;
}

export function CompanionBenefitsStep({
  companionName,
  currentTraining,
  selectedTraining,
  onSelectTraining,
}: CompanionBenefitsStepProps) {
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

  const handleSelect = useCallback(
    (optionId: string) => {
      onSelectTraining(selectedTraining === optionId ? null : optionId);
    },
    [selectedTraining, onSelectTraining]
  );

  const options = getTrainingOptions();
  const availableOptions = options.filter(isOptionAvailable);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <p className="text-muted-foreground mb-4 text-sm">
        Choose one training upgrade for {companionName || 'your companion'}.
      </p>

      <div className="space-y-2">
        {availableOptions.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            All training options have been maxed out.
          </p>
        ) : (
          availableOptions.map(option => {
            const isSelected = selectedTraining === option.id;
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
    </div>
  );
}
