/**
 * Shared adversary card components and constants used by both
 * the Add Adversary Dialog and Fight Builder Wizard
 */
import {
  ChevronDown,
  ChevronUp,
  Crosshair,
  Heart,
  Minus,
  Plus,
  Shield,
  Skull,
  Swords,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Adversary } from '@/lib/schemas/adversaries';

// ============== Constants ==============

export const TIER_COLORS: Record<string, string> = {
  '1': 'bg-green-500/20 text-green-700 dark:text-green-400',
  '2': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  '3': 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
  '4': 'bg-red-500/20 text-red-700 dark:text-red-400',
};

export const ROLE_ICONS: Record<string, string> = {
  Bruiser: '💪',
  Horde: '👥',
  Leader: '👑',
  Minion: '🐀',
  Ranged: '🎯',
  Skulk: '🥷',
  Social: '💬',
  Solo: '⭐',
  Standard: '⚔️',
  Support: '🛡️',
};

export const ROLE_CARD_COLORS: Record<
  string,
  { border: string; bg: string; badge: string }
> = {
  Solo: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-500/5',
    badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
  },
  Leader: {
    border: 'border-l-purple-500',
    bg: 'bg-purple-500/5',
    badge: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
  },
  Bruiser: {
    border: 'border-l-red-500',
    bg: 'bg-red-500/5',
    badge: 'bg-red-500/20 text-red-700 dark:text-red-400',
  },
  Standard: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-500/5',
    badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  },
  Support: {
    border: 'border-l-green-500',
    bg: 'bg-green-500/5',
    badge: 'bg-green-500/20 text-green-700 dark:text-green-400',
  },
  Ranged: {
    border: 'border-l-cyan-500',
    bg: 'bg-cyan-500/5',
    badge: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400',
  },
  Skulk: {
    border: 'border-l-slate-500',
    bg: 'bg-slate-500/5',
    badge: 'bg-slate-500/20 text-slate-700 dark:text-slate-400',
  },
  Social: {
    border: 'border-l-pink-500',
    bg: 'bg-pink-500/5',
    badge: 'bg-pink-500/20 text-pink-700 dark:text-pink-400',
  },
  Horde: {
    border: 'border-l-orange-500',
    bg: 'bg-orange-500/5',
    badge: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
  },
  Minion: {
    border: 'border-l-stone-500',
    bg: 'bg-stone-500/5',
    badge: 'bg-stone-500/20 text-stone-700 dark:text-stone-400',
  },
};

export const DEFAULT_ROLE_COLORS = {
  border: 'border-l-gray-500',
  bg: 'bg-gray-500/5',
  badge: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
};

export const ROLE_POINT_COSTS: Record<string, number> = {
  Solo: 4,
  Leader: 3,
  Bruiser: 2,
  Standard: 2,
  Support: 2,
  Ranged: 2,
  Skulk: 2,
  Social: 2,
  Horde: 1,
  Minion: 1,
};

export const FEATURE_TYPE_COLORS: Record<string, string> = {
  Passive: 'bg-gray-500/20 text-gray-700 dark:text-gray-300',
  Action: 'bg-green-500/20 text-green-700 dark:text-green-400',
  Reaction: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  Feature: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
};

// ============== Utility Functions ==============

export function getPointCost(role: string): number {
  return ROLE_POINT_COSTS[role] ?? 2;
}

export function getThresholdDisplay(
  thresholds: Adversary['thresholds']
): string {
  if (typeof thresholds === 'string') return thresholds;
  return `${thresholds.major}/${thresholds.severe}${thresholds.massive ? `/${thresholds.massive}` : ''}`;
}

// ============== Helper Components ==============

export function AdversaryAttackPanel({
  attack,
}: {
  attack: Adversary['attack'];
}) {
  return (
    <div className="rounded-md border border-red-500/20 bg-red-500/10 p-2">
      <p className="flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400">
        <Swords className="size-3" /> Attack
      </p>
      <p className="text-foreground mt-1 text-sm font-medium">{attack.name}</p>
      <p className="text-muted-foreground text-xs">
        {attack.modifier} · {attack.range} · {attack.damage}
      </p>
    </div>
  );
}

export function AdversaryThresholdsPanel({
  thresholds,
}: {
  thresholds: Adversary['thresholds'];
}) {
  return (
    <div className="rounded-md border border-blue-500/20 bg-blue-500/10 p-2">
      <p className="flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400">
        <Shield className="size-3" /> Damage Thresholds
      </p>
      <p className="text-foreground mt-1 text-sm font-medium">
        {typeof thresholds === 'string' ? (
          thresholds
        ) : (
          <>
            Major:{' '}
            <span className="text-yellow-600 dark:text-yellow-400">
              {thresholds.major}
            </span>
            {' / '}Severe:{' '}
            <span className="text-red-600 dark:text-red-400">
              {thresholds.severe}
            </span>
            {thresholds.massive && (
              <>
                {' '}
                / Massive:{' '}
                <span className="text-purple-600 dark:text-purple-400">
                  {thresholds.massive}
                </span>
              </>
            )}
          </>
        )}
      </p>
    </div>
  );
}

type AdversaryFeature =
  | string
  | { name: string; type?: string; description?: string };

function getFeatureType(f: AdversaryFeature): string {
  if (typeof f === 'string') {
    if (f.includes('Passive')) return 'Passive';
    if (f.includes('Action')) return 'Action';
    if (f.includes('Reaction')) return 'Reaction';
    return 'Feature';
  }
  return f.type ?? 'Feature';
}

export function AdversaryFeatureItem({
  feature,
}: {
  feature: AdversaryFeature;
}) {
  const featureName =
    typeof feature === 'string' ? feature.split(' - ')[0] : feature.name;
  const featureDesc =
    typeof feature === 'string' ? feature : feature.description;
  const featureType = getFeatureType(feature);

  return (
    <li className="bg-background/50 rounded-md border p-2">
      <div className="mb-1 flex items-center gap-2">
        <Badge
          className={`text-xs ${FEATURE_TYPE_COLORS[featureType] ?? FEATURE_TYPE_COLORS.Feature}`}
        >
          {featureType}
        </Badge>
        <span className="text-sm font-medium">{featureName}</span>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed">
        {featureDesc}
      </p>
    </li>
  );
}

// ============== Quantity Controls ==============

function QuantityControls({
  selectedCount,
  canAfford,
  onIncrement,
  onDecrement,
}: {
  selectedCount: number;
  canAfford: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const isSelected = selectedCount > 0;

  if (isSelected) {
    return (
      <div className="flex shrink-0 items-center gap-1">
        <Button
          size="icon"
          variant="outline"
          onClick={e => {
            e.stopPropagation();
            onDecrement();
          }}
          className="size-7"
        >
          <Minus className="size-3" />
        </Button>
        <span className="bg-primary text-primary-foreground min-w-[1.75rem] rounded px-1 text-center text-sm font-bold">
          {selectedCount}
        </span>
        <Button
          size="icon"
          variant="outline"
          onClick={e => {
            e.stopPropagation();
            onIncrement();
          }}
          className="size-7"
          disabled={!canAfford}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button
        size="icon"
        onClick={e => {
          e.stopPropagation();
          onIncrement();
        }}
        className="size-8 shrink-0"
        disabled={!canAfford}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}

// ============== Quick Stats Row ==============

function AdversaryQuickStats({
  adversary,
  thresholdDisplay,
  showExpandedDetails,
  isExpanded,
  onToggleExpand,
}: {
  adversary: Adversary;
  thresholdDisplay: string;
  showExpandedDetails: boolean;
  isExpanded: boolean;
  onToggleExpand?: () => void;
}) {
  return (
    <div className="bg-background/60 flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
      <div className="flex items-center gap-3 text-xs">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
              <Heart className="size-3" />
              {adversary.hp}
            </span>
          </TooltipTrigger>
          <TooltipContent>HP</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-muted-foreground flex items-center gap-1">
              <Crosshair className="size-3" />
              {adversary.difficulty}
            </span>
          </TooltipTrigger>
          <TooltipContent>Difficulty to hit</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Shield className="size-3" />
              {thresholdDisplay}
            </span>
          </TooltipTrigger>
          <TooltipContent>Thresholds (Major/Severe)</TooltipContent>
        </Tooltip>
      </div>
      {showExpandedDetails && onToggleExpand && (
        <CollapsibleTrigger asChild>
          <button className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors">
            {isExpanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </button>
        </CollapsibleTrigger>
      )}
    </div>
  );
}

// ============== Main Card Component ==============

interface AdversarySelectCardProps {
  adversary: Adversary;
  selectedCount: number;
  isExpanded?: boolean;
  canAfford?: boolean;
  showExpandedDetails?: boolean;
  onToggleExpand?: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function AdversarySelectCard({
  adversary,
  selectedCount,
  isExpanded = false,
  canAfford = true,
  showExpandedDetails = true,
  onToggleExpand,
  onIncrement,
  onDecrement,
}: AdversarySelectCardProps) {
  const isSelected = selectedCount > 0;
  const roleColors = ROLE_CARD_COLORS[adversary.role] ?? DEFAULT_ROLE_COLORS;
  const pointCost = getPointCost(adversary.role);
  const thresholdDisplay = getThresholdDisplay(adversary.thresholds);

  return (
    <Card
      className={`overflow-hidden border-l-4 transition-all hover:shadow-md ${roleColors.border} ${isSelected ? 'ring-primary shadow-md ring-2' : ''} ${!canAfford && !isSelected ? 'opacity-50' : ''}`}
    >
      <CardContent className={`p-0 ${roleColors.bg}`}>
        <Collapsible
          open={isExpanded && showExpandedDetails}
          onOpenChange={onToggleExpand}
        >
          {/* Header */}
          <div className="p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm leading-tight font-bold">
                  {adversary.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Badge className={`text-xs ${roleColors.badge}`}>
                    {ROLE_ICONS[adversary.role] ?? '⚔️'} {adversary.role}
                  </Badge>
                  <Badge
                    className={`text-xs ${TIER_COLORS[adversary.tier] ?? ''}`}
                  >
                    Tier {adversary.tier}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {pointCost} pt{pointCost !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
              <QuantityControls
                selectedCount={selectedCount}
                canAfford={canAfford}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
              />
            </div>

            <AdversaryQuickStats
              adversary={adversary}
              thresholdDisplay={thresholdDisplay}
              showExpandedDetails={showExpandedDetails}
              isExpanded={isExpanded}
              onToggleExpand={onToggleExpand}
            />
          </div>

          {/* Expanded Content */}
          {showExpandedDetails && (
            <CollapsibleContent>
              <Separator />
              <div className="bg-muted/30 space-y-3 p-3 pt-3">
                <p className="text-muted-foreground text-sm">
                  {adversary.description}
                </p>

                {adversary.motivesAndTactics && (
                  <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-2">
                    <p className="flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                      <Skull className="size-3" /> Motives & Tactics
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {adversary.motivesAndTactics}
                    </p>
                  </div>
                )}

                <div className="grid gap-2 sm:grid-cols-2">
                  <AdversaryAttackPanel attack={adversary.attack} />
                  <AdversaryThresholdsPanel thresholds={adversary.thresholds} />
                </div>

                {adversary.experiences && adversary.experiences.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-medium">Experiences</p>
                    <div className="flex flex-wrap gap-1">
                      {adversary.experiences.map((exp, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {typeof exp === 'string'
                            ? exp
                            : `${exp.name} +${exp.bonus}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {adversary.features.length > 0 && (
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-xs font-medium">
                      <Zap className="size-3" /> Features (
                      {adversary.features.length})
                    </p>
                    <ul className="space-y-2">
                      {adversary.features.map((f, i) => (
                        <AdversaryFeatureItem key={i} feature={f} />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </CardContent>
    </Card>
  );
}
