import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { applyTraitPreset, getTraitPreset } from './trait-presets';
import type { TraitsState } from './traits-display';

export function TraitAllocationHeader({
  isComplete,
  remaining,
}: {
  isComplete: boolean;
  remaining: Record<number, number>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={isComplete ? 'default' : 'secondary'}>
        {isComplete ? 'Completed' : 'In Progress'}
      </Badge>
      <span className="text-muted-foreground text-sm">
        Remaining: +2({remaining[2]}), +1({remaining[1]}), +0({remaining[0]}),
        -1({remaining[-1]})
      </span>
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
  return (
    <div className="flex flex-wrap gap-2">
      {preset && (
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange(applyTraitPreset(traits, preset))}
        >
          Apply {className?.split('/')[0]?.trim() ?? 'Class'} Preset
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
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
        Reset All
      </Button>
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
  onUpdate: (name: keyof TraitsState, value: number) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {traitNames.map(name => {
        const currentValue = getTraitValue(traits, name);
        return (
          <div key={name} className="space-y-2">
            <label className="text-sm font-medium">{name}</label>
            <Select
              value={String(currentValue)}
              onValueChange={value => onUpdate(name, Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select modifier" />
              </SelectTrigger>
              <SelectContent>
                {allowedValues.map(value => {
                  const isAvailable =
                    value === currentValue || remaining[value] > 0;
                  return (
                    <SelectItem
                      key={value}
                      value={String(value)}
                      disabled={!isAvailable}
                    >
                      {value > 0 ? `+${value}` : value}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
}
