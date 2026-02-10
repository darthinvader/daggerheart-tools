import { Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { Power } from '@/lib/icons';
import type { FeatureStatModifiers } from '@/lib/schemas/core';
import { cn } from '@/lib/utils';
import type {
  BonusBreakdown,
  BonusSourceEntry,
} from '@/lib/utils/feature-modifiers';

/** Callback to toggle a bonus source's activation state */
export type ToggleBonusSourceCallback = (
  sourceType: BonusSourceEntry['type'],
  sourceName: string,
  detail?: string
) => void;

interface BonusSummaryDisplayProps {
  breakdown: BonusBreakdown;
  extraSources?: BonusSourceEntry[];
  className?: string;
  /** Callback to toggle a bonus source on/off - if provided, shows toggle buttons */
  onToggleSource?: ToggleBonusSourceCallback;
  /** Map of disabled source keys (type-sourceName-detail) */
  disabledSources?: Set<string>;
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
    case 'equipment-feature': {
      // detail format: "SlotLabel::FeatureName"
      const featureName = entry.detail?.includes('::')
        ? entry.detail.split('::')[1]
        : entry.detail;
      return `Equipment Feature: ${featureName ?? entry.sourceName}`;
    }
    case 'experience-bonus':
      return `Experience Bonus: ${entry.sourceName}`;
    case 'beastform':
      return `Beastform: ${entry.sourceName}`;
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

function getSourceKey(entry: BonusSourceEntry): string {
  return `${entry.type}-${entry.sourceName}-${entry.detail ?? 'base'}`;
}

interface BonusSourceCardProps {
  entry: BonusSourceEntry;
  isDisabled: boolean;
  onToggle?: () => void;
}

function displayDetail(entry: BonusSourceEntry): string | undefined {
  if (!entry.detail) return undefined;
  // equipment-feature detail is "SlotLabel::FeatureName" — show only the feature name
  if (entry.type === 'equipment-feature' && entry.detail.includes('::')) {
    return entry.detail.split('::')[1];
  }
  // equipment-item detail is the slot label — shown in sourceLabel, hide here
  if (entry.type === 'equipment-item') return undefined;
  return entry.detail;
}

function BonusSourceCard({
  entry,
  isDisabled,
  onToggle,
}: BonusSourceCardProps) {
  const modifiers = formatModifiers(entry.modifiers);
  const experienceBonus = formatExperienceBonus(entry);

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-all',
        isDisabled &&
          'border-muted-foreground/30 bg-muted/30 border-dashed opacity-60'
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {onToggle && (
            <SmartTooltip
              content={isDisabled ? 'Activate bonus' : 'Deactivate bonus'}
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'size-7 shrink-0',
                  isDisabled
                    ? 'text-muted-foreground'
                    : 'text-green-600 hover:text-green-700'
                )}
                onClick={onToggle}
              >
                <Power className="size-4" />
              </Button>
            </SmartTooltip>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold">
                {sourceLabel(entry)}
              </p>
              {isDisabled && (
                <Badge
                  variant="outline"
                  className="text-muted-foreground shrink-0 text-[10px]"
                >
                  Deactivated
                </Badge>
              )}
            </div>
            {displayDetail(entry) && (
              <p className="text-muted-foreground truncate text-xs">
                {displayDetail(entry)}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {modifiers.map(mod => (
            <Badge
              key={mod}
              variant="secondary"
              className={cn(isDisabled && 'line-through')}
            >
              {mod}
            </Badge>
          ))}
          {experienceBonus && (
            <Badge
              variant="secondary"
              className={cn(isDisabled && 'line-through')}
            >
              {experienceBonus}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export function BonusSummaryDisplay({
  breakdown,
  extraSources = [],
  className,
  onToggleSource,
  disabledSources = new Set(),
}: BonusSummaryDisplayProps) {
  const combinedSources = useMemo(
    () => [...breakdown.sources, ...extraSources],
    [breakdown.sources, extraSources]
  );

  const activeSources = useMemo(
    () =>
      combinedSources.filter(
        entry =>
          formatModifiers(entry.modifiers).length > 0 ||
          !!entry.experienceBonus ||
          !!entry.disabled ||
          disabledSources.has(getSourceKey(entry))
      ),
    [combinedSources, disabledSources]
  );

  const enabledCount = useMemo(
    () =>
      activeSources.filter(
        entry => !entry.disabled && !disabledSources.has(getSourceKey(entry))
      ).length,
    [activeSources, disabledSources]
  );

  return (
    <div className={cn('flex flex-col rounded-lg border p-4', className)}>
      <div className="mb-3 flex shrink-0 items-center gap-2">
        <Sparkles className="size-5 text-amber-500" />
        <div>
          <p className="text-sm font-semibold">Active Bonuses</p>
          <p className="text-muted-foreground text-xs">
            {activeSources.length > 0
              ? `${enabledCount} of ${activeSources.length} source${activeSources.length === 1 ? '' : 's'} active`
              : 'No bonus sources'}
          </p>
        </div>
      </div>

      {activeSources.length === 0 ? (
        <p className="text-muted-foreground py-2 text-center text-sm">
          No active bonuses from any source.
        </p>
      ) : (
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
          {activeSources.map(entry => {
            const key = getSourceKey(entry);
            const isDisabled = !!entry.disabled || disabledSources.has(key);
            return (
              <BonusSourceCard
                key={key}
                entry={entry}
                isDisabled={isDisabled}
                onToggle={
                  onToggleSource
                    ? () =>
                        onToggleSource(
                          entry.type,
                          entry.sourceName,
                          entry.detail
                        )
                    : undefined
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
