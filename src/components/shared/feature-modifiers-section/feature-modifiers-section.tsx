/**
 * Feature Modifiers Section
 *
 * A reusable collapsible section for editing FeatureStatModifiers.
 * Used across all homebrew and custom content forms.
 */
import { ChevronRight, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { FeatureStatModifiers } from '@/lib/schemas/core';

interface FeatureModifiersSectionProps {
  /** Current modifier values */
  modifiers: FeatureStatModifiers | undefined;
  /** Callback when modifiers change */
  onChange: (modifiers: FeatureStatModifiers | undefined) => void;
  /** Optional title override */
  title?: string;
  /** Optional custom color class for styling */
  colorClass?: string;
  /** Show trait modifiers (Agility, Strength, etc.) */
  showTraits?: boolean;
}

type SimpleStatKey = Exclude<keyof FeatureStatModifiers, 'traits'>;

const SIMPLE_STAT_CONFIG: { key: SimpleStatKey; label: string }[] = [
  { key: 'evasion', label: 'Evasion' },
  { key: 'proficiency', label: 'Proficiency' },
  { key: 'armorScore', label: 'Armor Score' },
  { key: 'attackRolls', label: 'Attack Rolls' },
  { key: 'spellcastRolls', label: 'Spellcast Rolls' },
  { key: 'majorThreshold', label: 'Major Threshold' },
  { key: 'severeThreshold', label: 'Severe Threshold' },
];

const TRAIT_NAMES = [
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
] as const;

type TraitName = (typeof TRAIT_NAMES)[number];

function hasAnyModifiers(mods: FeatureStatModifiers | undefined): boolean {
  if (!mods) return false;

  for (const { key } of SIMPLE_STAT_CONFIG) {
    if (mods[key] && mods[key] !== 0) return true;
  }

  if (mods.traits) {
    for (const trait of TRAIT_NAMES) {
      if (mods.traits[trait] && mods.traits[trait] !== 0) return true;
    }
  }

  return false;
}

function ModifierInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="h-8"
      />
    </div>
  );
}

export function FeatureModifiersSection({
  modifiers,
  onChange,
  title = 'Stat Modifiers',
  colorClass = 'text-emerald-500',
  showTraits = false,
}: FeatureModifiersSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasModifiers, setHasModifiers] = useState(hasAnyModifiers(modifiers));

  const handleToggle = (enabled: boolean) => {
    setHasModifiers(enabled);
    if (!enabled) {
      onChange(undefined);
    } else {
      onChange({});
    }
  };

  const updateModifier = (key: SimpleStatKey, value: number) => {
    const current = modifiers ?? {};
    if (value === 0) {
      const rest = { ...current } as Record<string, unknown>;
      delete rest[key];
      onChange(
        Object.keys(rest).length > 0 ||
          (rest.traits && Object.keys(rest.traits as object).length > 0)
          ? (rest as FeatureStatModifiers)
          : undefined
      );
    } else {
      onChange({ ...current, [key]: value });
    }
  };

  const updateTraitModifier = (trait: TraitName, value: number) => {
    const current = modifiers ?? {};
    const currentTraits = current.traits ?? {};

    if (value === 0) {
      const restTraits = { ...currentTraits };
      delete restTraits[trait];
      const newTraits =
        Object.keys(restTraits).length > 0 ? restTraits : undefined;
      const restMods = { ...current };
      delete restMods.traits;
      const newMods = {
        ...restMods,
        ...(newTraits ? { traits: newTraits } : {}),
      };
      onChange(Object.keys(newMods).length > 0 ? newMods : undefined);
    } else {
      onChange({
        ...current,
        traits: { ...currentTraits, [trait]: value },
      });
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start gap-2"
        >
          <ChevronRight
            className={`size-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          />
          <TrendingUp className={`size-4 ${colorClass}`} />
          {title}
          {hasModifiers && (
            <Badge variant="secondary" className="ml-auto text-xs">
              Active
            </Badge>
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <Label>Enable Stat Modifiers</Label>
          <Switch checked={hasModifiers} onCheckedChange={handleToggle} />
        </div>

        {hasModifiers && (
          <div className="space-y-4">
            {/* Core Stats */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SIMPLE_STAT_CONFIG.map(({ key, label }) => (
                <ModifierInput
                  key={key}
                  label={label}
                  value={modifiers?.[key] ?? 0}
                  onChange={v => updateModifier(key, v)}
                />
              ))}
            </div>

            {/* Trait Modifiers */}
            {showTraits && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Trait Bonuses</Label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {TRAIT_NAMES.map(trait => (
                    <ModifierInput
                      key={trait}
                      label={trait}
                      value={modifiers?.traits?.[trait] ?? 0}
                      onChange={v => updateTraitModifier(trait, v)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
