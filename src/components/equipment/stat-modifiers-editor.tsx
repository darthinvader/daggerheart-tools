/**
 * Stat Modifiers Editor
 *
 * Allows homebrew equipment to have explicit stat modifiers
 * that affect character traits, evasion, proficiency, etc.
 */

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import type { EquipmentStatModifiers } from '@/lib/schemas/equipment';

import { NumberField } from './form';

interface StatModifiersEditorProps {
  value: Partial<EquipmentStatModifiers> | undefined;
  onChange: (value: EquipmentStatModifiers | undefined) => void;
  /** Show threshold modifiers (typically for armor) */
  showThresholds?: boolean;
  /** Show attack/spellcast roll modifiers (typically for weapons) */
  showRolls?: boolean;
}

const TRAIT_NAMES = [
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
] as const;

type TraitName = (typeof TRAIT_NAMES)[number];

type SimpleStatKey = Exclude<keyof EquipmentStatModifiers, 'traits'>;

const DEFAULT_TRAITS: EquipmentStatModifiers['traits'] = {
  Agility: 0,
  Strength: 0,
  Finesse: 0,
  Instinct: 0,
  Presence: 0,
  Knowledge: 0,
};

function createDefaultModifiers(): EquipmentStatModifiers {
  return {
    evasion: 0,
    proficiency: 0,
    armorScore: 0,
    majorThreshold: 0,
    severeThreshold: 0,
    attackRolls: 0,
    spellcastRolls: 0,
    traits: { ...DEFAULT_TRAITS },
  };
}

const SIMPLE_STAT_KEYS: SimpleStatKey[] = [
  'evasion',
  'proficiency',
  'armorScore',
  'majorThreshold',
  'severeThreshold',
  'attackRolls',
  'spellcastRolls',
];

function hasAnyModifiers(
  mods: Partial<EquipmentStatModifiers> | undefined
): boolean {
  if (!mods) return false;

  for (const key of SIMPLE_STAT_KEYS) {
    if (mods[key] && mods[key] !== 0) return true;
  }

  if (mods.traits) {
    for (const trait of TRAIT_NAMES) {
      if (mods.traits[trait] && mods.traits[trait] !== 0) return true;
    }
  }

  return false;
}

/** Merge partial modifiers with defaults to get a complete object */
function mergeWithDefaults(
  partial: Partial<EquipmentStatModifiers> | undefined
): EquipmentStatModifiers {
  const defaults = createDefaultModifiers();
  return {
    ...defaults,
    ...partial,
    traits: { ...defaults.traits, ...partial?.traits },
  };
}

/** Section with a labeled group of fields */
function ModifierSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{label}</Label>
      {children}
    </div>
  );
}

export function StatModifiersEditor({
  value,
  onChange,
  showThresholds = false,
  showRolls = true,
}: StatModifiersEditorProps) {
  const [isOpen, setIsOpen] = useState(hasAnyModifiers(value));

  const handleEnable = () => {
    setIsOpen(true);
    if (!value) {
      onChange(createDefaultModifiers());
    }
  };

  const handleClear = () => {
    onChange(undefined);
    setIsOpen(false);
  };

  const updateField = (key: SimpleStatKey, fieldValue: number) => {
    onChange({ ...mergeWithDefaults(value), [key]: fieldValue });
  };

  const updateTrait = (trait: TraitName, traitValue: number) => {
    const current = mergeWithDefaults(value);
    onChange({
      ...current,
      traits: { ...current.traits, [trait]: traitValue },
    });
  };

  const hasModifiers = hasAnyModifiers(value);

  if (!isOpen && !hasModifiers) {
    return (
      <div className="flex items-center justify-between rounded border border-dashed p-3">
        <span className="text-muted-foreground text-sm">
          Add stat modifiers to this equipment?
        </span>
        <Button variant="outline" size="sm" onClick={handleEnable}>
          Add Modifiers
        </Button>
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <span>⚔️ Stat Modifiers</span>
            {hasModifiers && (
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            )}
          </span>
          <span className="text-muted-foreground">{isOpen ? '▼' : '▶'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-3">
        {/* Core Scores */}
        <ModifierSection label="Core Scores">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              label="Evasion"
              value={value?.evasion ?? 0}
              onChange={v => updateField('evasion', v)}
            />
            <NumberField
              label="Proficiency"
              value={value?.proficiency ?? 0}
              onChange={v => updateField('proficiency', v)}
            />
          </div>
        </ModifierSection>

        {/* Armor Score */}
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField
            label="Armor Score"
            value={value?.armorScore ?? 0}
            onChange={v => updateField('armorScore', v)}
          />
        </div>

        {/* Thresholds (optional) */}
        {showThresholds && (
          <ModifierSection label="Damage Thresholds">
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberField
                label="Major Threshold"
                value={value?.majorThreshold ?? 0}
                onChange={v => updateField('majorThreshold', v)}
              />
              <NumberField
                label="Severe Threshold"
                value={value?.severeThreshold ?? 0}
                onChange={v => updateField('severeThreshold', v)}
              />
            </div>
          </ModifierSection>
        )}

        {/* Roll Modifiers (optional) */}
        {showRolls && (
          <ModifierSection label="Roll Modifiers">
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberField
                label="Attack Rolls"
                value={value?.attackRolls ?? 0}
                onChange={v => updateField('attackRolls', v)}
              />
              <NumberField
                label="Spellcast Rolls"
                value={value?.spellcastRolls ?? 0}
                onChange={v => updateField('spellcastRolls', v)}
              />
            </div>
          </ModifierSection>
        )}

        {/* Trait Modifiers */}
        <ModifierSection label="Trait Modifiers">
          <div className="grid gap-3 sm:grid-cols-3">
            {TRAIT_NAMES.map(trait => (
              <NumberField
                key={trait}
                label={trait}
                value={value?.traits?.[trait] ?? 0}
                onChange={v => updateTrait(trait, v)}
              />
            ))}
          </div>
        </ModifierSection>

        {/* Clear button */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-destructive"
          >
            Clear All Modifiers
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
