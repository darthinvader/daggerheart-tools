import { Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { FeatureStatModifiers } from '@/lib/schemas/core';
import { cn } from '@/lib/utils';
import type {
  BonusBreakdown,
  BonusSourceEntry,
} from '@/lib/utils/feature-modifiers';

interface BonusSummaryDisplayProps {
  breakdown: BonusBreakdown;
  extraSources?: BonusSourceEntry[];
  className?: string;
}

const MODIFIER_LABELS: Array<[keyof FeatureStatModifiers, string]> = [
  ['evasion', 'Evasion'],
  ['proficiency', 'Proficiency'],
  ['armorScore', 'Armor Score'],
  ['majorThreshold', 'Major Threshold'],
  ['severeThreshold', 'Severe Threshold'],
  ['attackRolls', 'Attack Rolls'],
  ['spellcastRolls', 'Spellcast Rolls'],
];

const TRAITS: Array<keyof NonNullable<FeatureStatModifiers['traits']>> = [
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
];

function formatModifierValue(value: number, label: string) {
  const sign = value >= 0 ? '+' : '−';
  return `${sign}${Math.abs(value)} ${label}`;
}

function formatModifiers(modifiers: FeatureStatModifiers): string[] {
  const results: string[] = [];
  for (const [key, label] of MODIFIER_LABELS) {
    const value = modifiers[key];
    if (typeof value === 'number' && value !== 0) {
      results.push(formatModifierValue(value, label));
    }
  }
  if (modifiers.traits) {
    for (const trait of TRAITS) {
      const value = modifiers.traits[trait];
      if (typeof value === 'number' && value !== 0) {
        results.push(formatModifierValue(value, trait));
      }
    }
  }
  return results;
}

function sourceLabel(entry: BonusSourceEntry) {
  switch (entry.type) {
    case 'class-feature':
      return `Class: ${entry.sourceName}`;
    case 'subclass-feature':
      return `Subclass: ${entry.sourceName}`;
    case 'ancestry-feature':
      return `Ancestry: ${entry.sourceName}`;
    case 'community-feature':
      return `Community: ${entry.sourceName}`;
    case 'domain-card':
      return `Domain Card: ${entry.sourceName}`;
    case 'inventory-item':
      return `Item: ${entry.sourceName}`;
    case 'inventory-feature':
      return `Item Feature: ${entry.sourceName}`;
    case 'equipment-item':
      return `Equipment: ${entry.sourceName}`;
    case 'equipment-feature':
      return `Equipment Feature: ${entry.sourceName}`;
    case 'experience-bonus':
      return `Experience Bonus: ${entry.sourceName}`;
    default:
      return entry.sourceName;
  }
}

function formatExperienceBonus(entry: BonusSourceEntry) {
  if (!entry.experienceBonus) return null;
  const bonus = entry.experienceBonus.bonus;
  const experience = entry.experienceBonus.experience;
  return `+${bonus} ${experience}`;
}

export function BonusSummaryDisplay({
  breakdown,
  extraSources = [],
  className,
}: BonusSummaryDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  const combinedSources = useMemo(
    () => [...breakdown.sources, ...extraSources],
    [breakdown.sources, extraSources]
  );

  const activeSources = useMemo(
    () =>
      combinedSources.filter(
        entry =>
          formatModifiers(entry.modifiers).length > 0 || !!entry.experienceBonus
      ),
    [combinedSources]
  );

  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-amber-500" />
          <div>
            <p className="text-sm font-semibold">Bonuses</p>
            <p className="text-muted-foreground text-xs">
              {activeSources.length > 0
                ? `${activeSources.length} active source${activeSources.length === 1 ? '' : 's'}`
                : 'No active bonuses'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          disabled={activeSources.length === 0}
        >
          View
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bonus Sources</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {activeSources.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No active bonuses.
              </p>
            ) : (
              activeSources.map(entry => {
                const modifiers = formatModifiers(entry.modifiers);
                const experienceBonus = formatExperienceBonus(entry);
                return (
                  <div
                    key={`${entry.type}-${entry.sourceName}-${entry.detail ?? 'base'}`}
                    className="rounded-lg border p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">
                          {sourceLabel(entry)}
                        </p>
                        {entry.detail && (
                          <p className="text-muted-foreground text-xs">
                            {entry.detail}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {modifiers.map(mod => (
                          <Badge key={mod} variant="secondary">
                            {mod}
                          </Badge>
                        ))}
                        {experienceBonus && (
                          <Badge variant="secondary">{experienceBonus}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
