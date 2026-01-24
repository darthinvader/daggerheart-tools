import { Check, Minus, Plus, RotateCcw, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import {
  applyTraitPreset,
  getTraitPreset,
  type TraitPreset,
} from './trait-presets';
import type { TraitsState } from './traits-display';

/** Format modifier as +N, 0, or -N */
function formatModifier(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}

/** Get color classes based on modifier value */
function getModifierColor(value: number): string {
  if (value > 0) return 'text-emerald-600 dark:text-emerald-400';
  if (value < 0) return 'text-rose-600 dark:text-rose-400';
  return 'text-muted-foreground';
}

/** Build a short summary of the preset (e.g., "+2 Presence, +1 Finesse, +1 Knowledge, -1 Strength") */
function formatPresetSummary(preset: TraitPreset): string {
  const entries = Object.entries(preset) as [string, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  return sorted
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => `${formatModifier(v)} ${k}`)
    .join(', ');
}

export function TraitAllocationHeader({
  isComplete,
  remaining,
}: {
  isComplete: boolean;
  remaining: Record<number, number>;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Badge
        variant={isComplete ? 'default' : 'secondary'}
        className="w-fit gap-1"
      >
        {isComplete ? (
          <>
            <Check className="size-3" /> Complete
          </>
        ) : (
          'Allocating...'
        )}
      </Badge>
      <div className="flex flex-wrap gap-2">
        {[2, 1, 0, -1].map(mod => (
          <Badge
            key={mod}
            variant="outline"
            className={cn('tabular-nums', remaining[mod] === 0 && 'opacity-40')}
          >
            <span className={getModifierColor(mod)}>{formatModifier(mod)}</span>
            <span className="text-muted-foreground ml-1">
              × {remaining[mod]}
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function TraitAllocationActions({
  traits,
  preset,
  className,
  onChange,
}: {
  traits: TraitsState;
  preset: ReturnType<typeof getTraitPreset>;
  className?: string;
  onChange: (traits: TraitsState) => void;
}) {
  const classDisplayName = className?.split('/')[0]?.trim() ?? 'Class';

  return (
    <div className="space-y-3">
      {preset && (
        <div className="bg-primary/5 border-primary/20 rounded-lg border p-3">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="text-primary h-4 w-4" />
            <span className="text-sm font-medium">
              {classDisplayName} Recommended Traits
            </span>
          </div>
          <p className="text-muted-foreground mb-3 text-xs">
            {formatPresetSummary(preset)}
          </p>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onChange(applyTraitPreset(traits, preset))}
          >
            <Sparkles className="mr-1 h-3 w-3" />
            Apply {classDisplayName} Preset
          </Button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange(
              applyTraitPreset(traits, {
                Agility: 0,
                Strength: 0,
                Finesse: 0,
                Instinct: 0,
                Presence: 0,
                Knowledge: 0,
              })
            )
          }
        >
          <RotateCcw className="mr-1 h-3 w-3" />
          Reset All
        </Button>
      </div>
    </div>
  );
}

export function TraitAllocationGrid({
  traits,
  traitNames,
  allowedValues,
  remaining,
  getTraitValue,
  onUpdate,
}: {
  traits: TraitsState;
  traitNames: (keyof TraitsState)[];
  allowedValues: readonly number[];
  remaining: Record<number, number>;
  getTraitValue: (traits: TraitsState, name: keyof TraitsState) => number;
  onUpdate: (
    name: keyof TraitsState,
    value: number,
    forceSet?: boolean
  ) => void;
}) {
  const minVal = Math.min(...allowedValues);
  const maxVal = Math.max(...allowedValues);

  /** Check if we can increment to nextVal */
  const canStep = (currentVal: number, delta: number) => {
    const nextVal = currentVal + delta;
    if (nextVal < minVal || nextVal > maxVal) return false;
    // Can step to nextVal if there's a slot remaining
    return remaining[nextVal] > 0;
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {traitNames.map(name => {
        const currentValue = getTraitValue(traits, name);
        const canDecrement = canStep(currentValue, -1);
        const canIncrement = canStep(currentValue, +1);

        return (
          <div
            key={name}
            className={cn(
              'flex items-center justify-between rounded-lg border p-3',
              'bg-card transition-colors',
              currentValue !== 0 && 'ring-1 ring-inset',
              currentValue > 0 && 'ring-emerald-500/30',
              currentValue < 0 && 'ring-rose-500/30'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{name}</span>
              {currentValue !== 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground size-6"
                      onClick={() => onUpdate(name, 0, true)}
                      aria-label={`Reset ${name} to 0`}
                    >
                      <RotateCcw className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Reset to 0</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Stepper control */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
                disabled={!canDecrement}
                onClick={() => onUpdate(name, currentValue - 1)}
                aria-label={`Decrease ${name}`}
              >
                <Minus className="size-4" />
              </Button>

              <span
                className={cn(
                  'w-10 text-center text-lg font-bold tabular-nums',
                  getModifierColor(currentValue)
                )}
              >
                {formatModifier(currentValue)}
              </span>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
                disabled={!canIncrement}
                onClick={() => onUpdate(name, currentValue + 1)}
                aria-label={`Increase ${name}`}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
