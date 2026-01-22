import { useEffect, useMemo, useRef, useState } from 'react';

import {
  TraitAllocationActions,
  TraitAllocationGrid,
  TraitAllocationHeader,
} from './trait-allocation-parts';
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

function getTraitValue(traits: TraitsState, name: keyof TraitsState) {
  const value = traits[name].value as AllowedValue;
  return ALLOWED_VALUES.includes(value) ? value : 0;
}

function resolveTraitUpdate({
  traits,
  name,
  value,
  remaining,
  forceSet = false,
}: {
  traits: TraitsState;
  name: keyof TraitsState;
  value: AllowedValue;
  remaining: Record<AllowedValue, number>;
  forceSet?: boolean;
}): { nextTraits: TraitsState; error: string | null } {
  const current = getTraitValue(traits, name);
  if (value === current) {
    return { nextTraits: traits, error: null };
  }

  // When forceSet is true (e.g., reset button), just set the value directly
  // The remaining count will be recalculated from the new state
  if (forceSet || remaining[value] > 0) {
    return {
      nextTraits: {
        ...traits,
        [name]: { ...traits[name], value },
      },
      error: null,
    };
  }

  const swapWith = TRAIT_NAMES.find(
    traitName =>
      traitName !== name && getTraitValue(traits, traitName) === value
  );

  if (!swapWith) {
    return {
      nextTraits: traits,
      error: 'That value is already fully assigned.',
    };
  }

  return {
    nextTraits: {
      ...traits,
      [name]: { ...traits[name], value },
      [swapWith]: { ...traits[swapWith], value: current },
    },
    error: null,
  };
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

  const updateTrait = (
    name: keyof TraitsState,
    value: AllowedValue,
    forceSet = false
  ) => {
    const { nextTraits, error: updateError } = resolveTraitUpdate({
      traits,
      name,
      value,
      remaining,
      forceSet,
    });
    setError(updateError);
    if (updateError) return;
    if (nextTraits !== traits) {
      onChange(nextTraits);
    }
  };

  return (
    <div className="space-y-4">
      <TraitAllocationHeader
        isComplete={isComplete}
        remaining={remaining as Record<number, number>}
      />
      <TraitAllocationActions
        traits={traits}
        preset={preset}
        className={className}
        onChange={onChange}
      />

      {error && <p className="text-destructive text-sm">{error}</p>}
      <p className="text-muted-foreground text-sm">
        Tip: selecting a value that’s already used will swap it with another
        trait.
      </p>

      <TraitAllocationGrid
        traits={traits}
        traitNames={TRAIT_NAMES}
        allowedValues={ALLOWED_VALUES}
        remaining={remaining}
        getTraitValue={getTraitValue}
        onUpdate={(name, value, forceSet) =>
          updateTrait(name, value as AllowedValue, forceSet)
        }
      />
    </div>
  );
}
