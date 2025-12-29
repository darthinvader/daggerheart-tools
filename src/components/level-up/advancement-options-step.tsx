import { Lock, Minus, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  type LevelUpOptionConfig,
  type LevelUpSelection,
  getSelectionCount,
  isOptionDisabled,
} from './types';

interface AdvancementOptionsStepProps {
  options: LevelUpOptionConfig[];
  selections: LevelUpSelection[];
  effectiveTierHistory: Record<string, number>;
  pointsRemaining: number;
  pointsPerLevel: number;
  availableTraitsCount: number;
  availableExperiencesCount: number;
  onSelect: (option: LevelUpOptionConfig) => void;
  onRemove: (optionId: string) => void;
}

interface OptionStatus {
  currentSelectionCount: number;
  totalCount: number;
  isDisabled: boolean;
  isMaxed: boolean;
  cantAffordMore: boolean;
  notEnoughResources: boolean;
  cantAdd: boolean;
}

function getOptionStatus(
  option: LevelUpOptionConfig,
  selections: LevelUpSelection[],
  effectiveTierHistory: Record<string, number>,
  pointsRemaining: number,
  availableTraitsCount: number,
  availableExperiencesCount: number
): OptionStatus {
  const currentSelectionCount = getSelectionCount(option.id, selections);
  const historyCount = effectiveTierHistory[option.id] ?? 0;
  const totalCount = currentSelectionCount + historyCount;
  const isDisabled = isOptionDisabled(option, selections, effectiveTierHistory);
  const isMaxed = totalCount >= option.maxSelectionsPerTier;
  const cantAffordMore = option.cost > pointsRemaining;
  const notEnoughResources =
    (option.id === 'traits' && availableTraitsCount < 2) ||
    (option.id === 'experiences' && availableExperiencesCount < 2);
  const cantAdd = isDisabled || isMaxed || cantAffordMore || notEnoughResources;

  return {
    currentSelectionCount,
    totalCount,
    isDisabled,
    isMaxed,
    cantAffordMore,
    notEnoughResources,
    cantAdd,
  };
}

export function AdvancementOptionsStep({
  options,
  selections,
  effectiveTierHistory,
  pointsRemaining,
  pointsPerLevel,
  availableTraitsCount,
  availableExperiencesCount,
  onSelect,
  onRemove,
}: AdvancementOptionsStepProps) {
  return (
    <div className="space-y-6 overflow-y-auto p-6">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold">🎯 Choose Advancements</h4>
          <Badge
            variant={pointsRemaining > 0 ? 'default' : 'secondary'}
            className="text-sm"
          >
            {pointsRemaining} / {pointsPerLevel} points
          </Badge>
        </div>

        <div className="space-y-2">
          {options.map(option => (
            <AdvancementOptionRow
              key={option.id}
              option={option}
              selections={selections}
              effectiveTierHistory={effectiveTierHistory}
              pointsRemaining={pointsRemaining}
              availableTraitsCount={availableTraitsCount}
              availableExperiencesCount={availableExperiencesCount}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

interface AdvancementOptionRowProps {
  option: LevelUpOptionConfig;
  selections: LevelUpSelection[];
  effectiveTierHistory: Record<string, number>;
  pointsRemaining: number;
  availableTraitsCount: number;
  availableExperiencesCount: number;
  onSelect: (option: LevelUpOptionConfig) => void;
  onRemove: (optionId: string) => void;
}

function AdvancementOptionRow({
  option,
  selections,
  effectiveTierHistory,
  pointsRemaining,
  availableTraitsCount,
  availableExperiencesCount,
  onSelect,
  onRemove,
}: AdvancementOptionRowProps) {
  const status = getOptionStatus(
    option,
    selections,
    effectiveTierHistory,
    pointsRemaining,
    availableTraitsCount,
    availableExperiencesCount
  );

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border p-3 transition-colors',
        status.currentSelectionCount > 0 && 'border-primary bg-primary/10',
        status.cantAdd && status.currentSelectionCount === 0 && 'opacity-50'
      )}
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{option.label}</span>
          <Badge variant="outline" className="text-xs">
            {option.cost} {option.cost === 1 ? 'pt' : 'pts'}
          </Badge>
          <Badge
            variant={status.isMaxed ? 'destructive' : 'secondary'}
            className="text-xs"
            title={
              (effectiveTierHistory[option.id] ?? 0) > 0
                ? `${effectiveTierHistory[option.id] ?? 0} from previous level-ups this tier`
                : undefined
            }
          >
            Tier: {status.totalCount}/{option.maxSelectionsPerTier}
          </Badge>
          {status.isDisabled && (
            <Lock className="text-muted-foreground size-3" />
          )}
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {option.description}
        </p>
      </div>

      <div className="ml-4 flex items-center gap-2">
        {status.currentSelectionCount > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(option.id)}
          >
            <Minus className="size-4" />
          </Button>
        )}
        {status.currentSelectionCount > 0 && (
          <span className="min-w-6 text-center font-medium">
            {status.currentSelectionCount}
          </span>
        )}
        <Button
          variant={status.currentSelectionCount > 0 ? 'secondary' : 'outline'}
          size="icon"
          disabled={status.cantAdd}
          onClick={() => onSelect(option)}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
