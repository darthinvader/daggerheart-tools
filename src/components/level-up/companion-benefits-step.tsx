import { Check } from 'lucide-react';
import { useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
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

interface CompanionBenefitsStepProps {
  companionName: string;
  currentTraining: CompanionTraining | undefined;
  selectedTraining: string | null;
  onSelectTraining: (trainingId: string | null) => void;
  experiences: { name: string; bonus: number }[];
  selectedExperienceIndex: number | null;
  onSelectExperienceIndex: (index: number | null) => void;
}

interface TrainingOptionButtonProps {
  option: TrainingOption;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
}

function TrainingOptionButton({
  option,
  isSelected,
  onSelect,
}: TrainingOptionButtonProps) {
  const currentCount =
    typeof option.currentValue === 'number'
      ? option.currentValue
      : option.currentValue
        ? 1
        : 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={cn(
        'w-full rounded-lg border p-3 text-left transition-all',
        'hover:border-primary/50 hover:bg-accent/50',
        isSelected && 'border-primary bg-primary/10 ring-primary ring-1'
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
        {isSelected && <Check className="text-primary size-5 shrink-0" />}
      </div>
    </button>
  );
}

interface ExperienceSelectorProps {
  experiences: { name: string; bonus: number }[];
  selectedExperienceIndex: number | null;
  onSelectExperienceIndex: (index: number | null) => void;
}

function ExperienceSelector({
  experiences,
  selectedExperienceIndex,
  onSelectExperienceIndex,
}: ExperienceSelectorProps) {
  return (
    <div className="mt-4 space-y-2">
      <Label>Choose a companion experience to boost</Label>
      <Select
        value={
          selectedExperienceIndex !== null
            ? String(selectedExperienceIndex)
            : ''
        }
        onValueChange={value =>
          onSelectExperienceIndex(value ? Number(value) : null)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an experience" />
        </SelectTrigger>
        <SelectContent>
          {experiences.map((exp, index) => (
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
  );
}

export function CompanionBenefitsStep({
  companionName,
  currentTraining,
  selectedTraining,
  onSelectTraining,
  experiences,
  selectedExperienceIndex,
  onSelectExperienceIndex,
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
          availableOptions.map(option => (
            <TrainingOptionButton
              key={option.id}
              option={option}
              isSelected={selectedTraining === option.id}
              onSelect={handleSelect}
            />
          ))
        )}
      </div>

      {selectedTraining === 'intelligent' && experiences.length > 0 && (
        <ExperienceSelector
          experiences={experiences}
          selectedExperienceIndex={selectedExperienceIndex}
          onSelectExperienceIndex={onSelectExperienceIndex}
        />
      )}
    </div>
  );
}
