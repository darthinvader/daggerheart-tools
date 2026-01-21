import { useEffect, useMemo, useRef, useState } from 'react';

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

const TRAIT_NAMES: (keyof TraitsState)[] = [
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
];

const ALLOWED_VALUES = [2, 1, 0, -1] as const;
type AllowedValue = (typeof ALLOWED_VALUES)[number];

const ALLOCATION_COUNTS: Record<AllowedValue, number> = {
  2: 1,
  1: 2,
  0: 2,
  [-1]: 1,
};

interface TraitAllocationEditorProps {
  traits: TraitsState;
  onChange: (traits: TraitsState) => void;
  className?: string;
}

function buildAssignedCounts(traits: TraitsState) {
  const assigned: Record<AllowedValue, number> = {
    2: 0,
    1: 0,
    0: 0,
    [-1]: 0,
  };

  TRAIT_NAMES.forEach(name => {
    const val = traits[name].value as AllowedValue;
    if (ALLOWED_VALUES.includes(val)) {
      assigned[val] += 1;
    }
  });

  return assigned;
}

export function TraitAllocationEditor({
  traits,
  onChange,
  className,
}: TraitAllocationEditorProps) {
  const [error, setError] = useState<string | null>(null);
  const autoPresetAppliedRef = useRef(false);
  const preset = useMemo(() => getTraitPreset(className), [className]);
  const assigned = useMemo(() => buildAssignedCounts(traits), [traits]);
  const remaining = useMemo(() => {
    const next: Record<AllowedValue, number> = {
      2: ALLOCATION_COUNTS[2] - assigned[2],
      1: ALLOCATION_COUNTS[1] - assigned[1],
      0: ALLOCATION_COUNTS[0] - assigned[0],
      [-1]: ALLOCATION_COUNTS[-1] - assigned[-1],
    };
    return next;
  }, [assigned]);

  const isComplete =
    remaining[2] === 0 &&
    remaining[1] === 0 &&
    remaining[0] === 0 &&
    remaining[-1] === 0;

  useEffect(() => {
    autoPresetAppliedRef.current = false;
  }, [className]);

  useEffect(() => {
    if (!preset || autoPresetAppliedRef.current) return;
    const allZero = Object.values(traits).every(t => t.value === 0);
    if (!allZero) return;
    onChange(applyTraitPreset(traits, preset));
    autoPresetAppliedRef.current = true;
  }, [preset, traits, onChange]);

  const updateTrait = (name: keyof TraitsState, value: AllowedValue) => {
    const current = traits[name].value as AllowedValue;
    if (value === current) return;

    if (remaining[value] > 0) {
      setError(null);
      onChange({
        ...traits,
        [name]: { ...traits[name], value },
      });
      return;
    }

    const swapWith = TRAIT_NAMES.find(
      traitName => traitName !== name && traits[traitName].value === value
    );

    if (!swapWith) {
      setError('That value is already fully assigned.');
      return;
    }

    setError(null);
    onChange({
      ...traits,
      [name]: { ...traits[name], value },
      [swapWith]: { ...traits[swapWith], value: current },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={isComplete ? 'default' : 'secondary'}>
          {isComplete ? 'Completed' : 'In Progress'}
        </Badge>
        <span className="text-muted-foreground text-sm">
          Remaining: +2({remaining[2]}), +1({remaining[1]}), +0({remaining[0]}),
          -1({remaining[-1]})
        </span>
      </div>

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

      {error && <p className="text-destructive text-sm">{error}</p>}
      <p className="text-muted-foreground text-sm">
        Tip: selecting a value that’s already used will swap it with another
        trait.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {TRAIT_NAMES.map(name => {
          const currentValue = ALLOWED_VALUES.includes(
            traits[name].value as AllowedValue
          )
            ? (traits[name].value as AllowedValue)
            : 0;
          return (
            <div key={name} className="space-y-2">
              <label className="text-sm font-medium">{name}</label>
              <Select
                value={String(currentValue)}
                onValueChange={value =>
                  updateTrait(name, Number(value) as AllowedValue)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select modifier" />
                </SelectTrigger>
                <SelectContent>
                  {ALLOWED_VALUES.map(value => {
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
    </div>
  );
}
