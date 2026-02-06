import {
  Backpack,
  BookOpen,
  Coins,
  Crosshair,
  Dna,
  Heart,
  ScrollText,
  Shield,
  Sparkles,
  Star,
  Sword,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  deriveFeatureUnlocks,
  getUnlockedFeatures,
} from '@/features/characters/logic/features';
import { getAncestryByName, getCommunityByName } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import {
  type AdversaryThresholdsValue,
  getAdversaryEffectiveValues,
} from './adversary-effective-values';
import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
  TrackerItem,
} from './types';
import { parseFearCost } from './utils';

// ============== Style Constants ==============

const TIER_COLORS: Record<string, string> = {
  '1': 'text-green-600 dark:text-green-400 bg-green-500/20 border-green-500/30',
  '2': 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  '3': 'text-orange-600 dark:text-orange-400 bg-orange-500/20 border-orange-500/30',
  '4': 'text-red-600 dark:text-red-400 bg-red-500/20 border-red-500/30',
};

const ROLE_ICONS: Record<string, string> = {
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

const TYPE_ICONS: Record<string, string> = {
  Exploration: '🗺️',
  Social: '💬',
  Event: '⚡',
  Traversal: '🚶',
};

const CORE_SCORE_CONFIG = [
  { key: 'agility', label: 'AGI', color: 'text-green-600 dark:text-green-400' },
  { key: 'strength', label: 'STR', color: 'text-red-600 dark:text-red-400' },
  { key: 'finesse', label: 'FIN', color: 'text-blue-600 dark:text-blue-400' },
  {
    key: 'instinct',
    label: 'INS',
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    key: 'presence',
    label: 'PRE',
    color: 'text-amber-600 dark:text-amber-400',
  },
  { key: 'knowledge', label: 'KNO', color: 'text-cyan-600 dark:text-cyan-400' },
] as const;

const FEATURE_TYPE_STYLES: Record<string, string> = {
  Passive: 'bg-gray-500/20 text-gray-600',
  Action: 'bg-green-500/20 text-green-600',
  Reaction: 'bg-blue-500/20 text-blue-600',
};

// ============== Stat Display Components ==============

interface PrimaryStatProps {
  icon: React.ReactNode;
  value: number;
  max: number;
  label: string;
  tooltip: string;
  colorClass: string;
  borderClass: string;
}

function PrimaryStat({
  icon,
  value,
  max,
  label,
  tooltip,
  colorClass,
  borderClass,
}: PrimaryStatProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'cursor-help rounded-lg border-2 bg-gradient-to-b p-3 text-center',
              borderClass
            )}
          >
            <div className="mx-auto mb-1 flex size-4 items-center justify-center [&>svg]:size-4 [&>svg]:shrink-0">
              {icon}
            </div>
            <p className={cn('text-2xl font-bold', colorClass)}>{value}</p>
            <p className="text-muted-foreground text-xs">
              {label} / {max}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface SecondaryStatProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  tooltip: string;
  colorClass: string;
  bgClass: string;
}

function SecondaryStat({
  icon,
  value,
  label,
  tooltip,
  colorClass,
  bgClass,
}: SecondaryStatProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'cursor-help rounded-lg border bg-gradient-to-b p-2 text-center',
              bgClass
            )}
          >
            <div className="mx-auto mb-0.5 flex size-3.5 items-center justify-center [&>svg]:size-3.5 [&>svg]:shrink-0">
              {icon}
            </div>
            <p className={cn('text-lg font-bold', colorClass)}>{value}</p>
            <p className="text-muted-foreground text-[10px]">{label}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============== Weapon/Armor Display Components ==============

type WeaponSummary =
  | {
      name: string;
      damage?: string;
      range?: string;
      traits?: string[];
      features?: string[];
    }
  | undefined;

function WeaponCard({
  weapon,
  label,
}: {
  weapon: WeaponSummary;
  label: string;
}) {
  if (!weapon) return null;
  const hasFeatures = weapon.features && weapon.features.length > 0;

  const cardContent = (
    <div className="bg-muted/30 hover:bg-muted/50 rounded-md border p-2 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{weapon.name}</span>
        <Badge variant="outline" className="text-xs">
          {label}
        </Badge>
      </div>
      <div className="text-muted-foreground mt-1 flex flex-wrap gap-2 text-xs">
        {weapon.damage && <span className="text-red-500">{weapon.damage}</span>}
        {weapon.range && <span>{weapon.range}</span>}
      </div>
      {weapon.traits && weapon.traits.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {weapon.traits.map(trait => (
            <Badge key={trait} variant="secondary" className="text-[10px]">
              {trait}
            </Badge>
          ))}
        </div>
      )}
      {hasFeatures && (
        <div className="text-muted-foreground mt-1 text-xs italic">
          Hover for features
        </div>
      )}
    </div>
  );

  if (!hasFeatures) return cardContent;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">{cardContent}</div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <div className="space-y-1">
            {weapon.features!.map((feature, idx) => (
              <p key={idx} className="text-sm">
                {feature}
              </p>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ArmorCard({
  armor,
}: {
  armor: NonNullable<CharacterTracker['equipment']>['armor'];
}) {
  if (!armor) return null;
  const featuresToShow =
    armor.features ?? (armor.feature ? [armor.feature] : []);
  const hasFeatures = featuresToShow.length > 0;

  const cardContent = (
    <div className="bg-muted/30 hover:bg-muted/50 rounded-md border p-2 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{armor.name}</span>
        <Badge
          variant="outline"
          className="border-yellow-500/50 text-xs text-yellow-600"
        >
          Armor
        </Badge>
      </div>
      {armor.thresholds && (
        <div className="text-muted-foreground mt-1 text-xs">
          Thresholds: {armor.thresholds.major}/{armor.thresholds.severe}
        </div>
      )}
      {hasFeatures && (
        <div className="text-muted-foreground mt-1 text-xs italic">
          Hover for features
        </div>
      )}
    </div>
  );

  if (!hasFeatures) return cardContent;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">{cardContent}</div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <div className="space-y-1">
            {featuresToShow.map((feature, idx) => (
              <p key={idx} className="text-sm">
                {feature}
              </p>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============== Domain Card Display ==============

function DomainCardItem({
  card,
}: {
  card: NonNullable<CharacterTracker['loadout']>[number];
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-muted/50 hover:bg-muted cursor-help rounded-md border p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{card.name}</span>
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-xs">
                  {card.domain}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Lv {card.level}
                </Badge>
              </div>
            </div>
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
              <span>{card.type}</span>
              {card.hopeCost !== undefined && card.hopeCost > 0 && (
                <span className="text-amber-500">{card.hopeCost} Hope</span>
              )}
              {card.stressCost !== undefined && card.stressCost > 0 && (
                <span className="text-purple-500">
                  {card.stressCost} Stress
                </span>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <p className="text-sm">{card.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============== Adversary Detail Components ==============

interface AdversaryStatGridProps {
  hp: { current: number; max: number };
  stress: { current: number; max: number };
}

function AdversaryStatGrid({ hp, stress }: AdversaryStatGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help rounded-lg border-2 border-red-500/30 bg-gradient-to-b from-red-500/10 to-red-500/5 p-3 text-center">
              <Heart className="mx-auto mb-1 size-4 text-red-500" />
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {hp.current}
              </p>
              <p className="text-muted-foreground text-xs">HP / {hp.max}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hit Points</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help rounded-lg border-2 border-purple-500/30 bg-gradient-to-b from-purple-500/10 to-purple-500/5 p-3 text-center">
              <Zap className="mx-auto mb-1 size-4 text-purple-500" />
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stress.current}
              </p>
              <p className="text-muted-foreground text-xs">
                Stress / {stress.max}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Stress - Used for special abilities</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

interface AdversaryAttack {
  name: string;
  modifier: number;
  range: string;
  damage: string;
}

function AdversaryAttackInfo({
  attack,
  isModified,
}: {
  attack: AdversaryAttack;
  isModified: boolean;
}) {
  return (
    <div className="space-y-2 rounded-lg border-2 border-red-500/20 bg-gradient-to-r from-red-500/5 to-orange-500/5 p-3">
      <div className="flex items-center gap-2">
        <Sword className="size-4 text-red-500" />
        <span className="font-semibold text-red-600 dark:text-red-400">
          Attack
        </span>
        {isModified && (
          <Badge
            variant="secondary"
            className="bg-blue-500/20 text-[10px] text-blue-600"
          >
            Modified
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-background/50 cursor-help rounded p-2">
                <p className="text-muted-foreground text-xs">Name</p>
                <p className="font-medium">{attack.name}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>Attack name</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-background/50 cursor-help rounded p-2">
                <p className="text-muted-foreground text-xs">Modifier</p>
                <p className="font-mono font-medium">{attack.modifier}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>Roll d20 + this modifier</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-background/50 cursor-help rounded p-2">
                <p className="text-muted-foreground text-xs">Range</p>
                <p className="font-medium">{attack.range}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>Attack range</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-background/50 cursor-help rounded p-2">
                <p className="text-muted-foreground text-xs">Damage</p>
                <p className="font-mono font-medium text-red-600 dark:text-red-400">
                  {attack.damage}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent>Damage dice</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

function AdversaryThresholdsDisplay({
  thresholds,
  isModified,
  useMassiveThreshold,
}: {
  thresholds: AdversaryThresholdsValue;
  isModified: boolean;
  useMassiveThreshold?: boolean;
}) {
  const formatValue = (value: number | null | undefined) => value ?? '—';
  const showMassive =
    useMassiveThreshold &&
    typeof thresholds !== 'string' &&
    thresholds.massive != null;
  return (
    <div className="space-y-2 rounded-lg border-2 border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 p-3">
      <div className="flex items-center gap-2">
        <Target className="size-4 text-amber-500" />
        <span className="font-semibold text-amber-600 dark:text-amber-400">
          Damage Thresholds
        </span>
        {isModified && (
          <Badge
            variant="secondary"
            className="bg-blue-500/20 text-[10px] text-blue-600"
          >
            Modified
          </Badge>
        )}
      </div>
      {typeof thresholds === 'string' ? (
        <p className="text-muted-foreground text-sm">{thresholds}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="cursor-help border-yellow-500/30 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                  Major: {formatValue(thresholds.major)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Damage ≥ {formatValue(thresholds.major)} = Major result
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="cursor-help border-orange-500/30 bg-orange-500/20 text-orange-600 dark:text-orange-400">
                  Severe: {formatValue(thresholds.severe)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Damage ≥ {formatValue(thresholds.severe)} = Severe result
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {showMassive && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="cursor-help border-red-500/30 bg-red-500/20 text-red-600 dark:text-red-400">
                    Massive: {formatValue(thresholds.massive)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Damage ≥ {formatValue(thresholds.massive)} = Massive result
                  (mark 4 HP)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
    </div>
  );
}

type AdversaryFeature =
  | string
  | { name: string; type?: string; description?: string; isCustom?: boolean };

function AdversaryFeatureList({
  features,
  isModified,
  fearPool,
  onSpendFear,
}: {
  features: AdversaryFeature[];
  isModified: boolean;
  fearPool?: number;
  onSpendFear?: (cost: number, featureName: string) => void;
}) {
  if (features.length === 0) return null;
  return (
    <div className="space-y-2 rounded-lg border-2 border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-violet-500/5 p-3">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-purple-500" />
        <span className="font-semibold text-purple-600 dark:text-purple-400">
          Features
        </span>
        <Badge variant="secondary" className="text-xs">
          {features.length}
        </Badge>
        {isModified && (
          <Badge
            variant="secondary"
            className="bg-blue-500/20 text-[10px] text-blue-600"
          >
            Modified
          </Badge>
        )}
      </div>
      <ul className="space-y-2">
        {features.map((f, i) => {
          const isString = typeof f === 'string';
          const name = isString ? f.split(':')[0].trim() : f.name;
          const type = isString ? null : f.type;
          const description = isString
            ? f.includes(':')
              ? f.split(':').slice(1).join(':').trim()
              : ''
            : f.description;
          const isCustom = !isString && 'isCustom' in f && Boolean(f.isCustom);
          const fearCost = description ? parseFearCost(description) : 0;
          const canAfford =
            fearCost > 0 && fearPool !== undefined && fearPool >= fearCost;
          const isClickable = fearCost > 0 && onSpendFear;

          return (
            <li
              key={i}
              className={cn(
                'bg-background/50 rounded p-2 text-sm',
                isClickable &&
                  (canAfford
                    ? 'cursor-pointer transition-colors hover:bg-purple-500/10'
                    : 'cursor-not-allowed opacity-50')
              )}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-disabled={isClickable && !canAfford ? true : undefined}
              aria-label={
                isClickable
                  ? `Spend ${fearCost} fear to activate ${name}`
                  : undefined
              }
              onClick={
                isClickable && canAfford
                  ? () => onSpendFear(fearCost, name)
                  : undefined
              }
              onKeyDown={
                isClickable && canAfford
                  ? (e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSpendFear(fearCost, name);
                      }
                    }
                  : undefined
              }
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{name}</span>
                {type && (
                  <Badge
                    variant="outline"
                    className={cn('text-[10px]', FEATURE_TYPE_STYLES[type])}
                  >
                    {type}
                  </Badge>
                )}
                {fearCost > 0 && (
                  <Badge
                    variant="outline"
                    className="border-purple-500/40 bg-purple-500/20 text-[10px] text-purple-600 dark:text-purple-400"
                  >
                    💀 {fearCost}
                  </Badge>
                )}
                {isCustom && (
                  <Badge
                    variant="outline"
                    className="bg-blue-500/20 text-[10px] text-blue-600"
                  >
                    Custom
                  </Badge>
                )}
              </div>
              {description && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {description}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SelectedItemDetails({
  item,
  useMassiveThreshold,
  onCharacterChange,
  onAdversaryChange,
  onEnvironmentChange,
  fearPool,
  onSpendFear,
}: {
  item: TrackerItem;
  useMassiveThreshold?: boolean;
  onCharacterChange: (
    id: string,
    fn: (c: CharacterTracker) => CharacterTracker
  ) => void;
  onAdversaryChange: (
    id: string,
    fn: (a: AdversaryTracker) => AdversaryTracker
  ) => void;
  onEnvironmentChange: (
    id: string,
    fn: (e: EnvironmentTracker) => EnvironmentTracker
  ) => void;
  fearPool?: number;
  onSpendFear?: (cost: number, featureName: string) => void;
}) {
  if (item.kind === 'character') {
    return (
      <CharacterDetails
        item={item}
        useMassiveThreshold={useMassiveThreshold}
        onChange={onCharacterChange}
      />
    );
  }
  if (item.kind === 'adversary') {
    return (
      <AdversaryDetails
        item={item}
        useMassiveThreshold={useMassiveThreshold}
        onChange={onAdversaryChange}
        fearPool={fearPool}
        onSpendFear={onSpendFear}
      />
    );
  }
  return (
    <EnvironmentDetails
      item={item}
      onChange={onEnvironmentChange}
      fearPool={fearPool}
      onSpendFear={onSpendFear}
    />
  );
}

function CharacterLinkedNotice({ isLinked }: { isLinked: boolean }) {
  if (!isLinked) return null;
  return (
    <div className="bg-primary/10 text-primary border-primary/30 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
      <span className="text-base">🔗</span>
      <span>Stats sync live from player. Only your notes are editable.</span>
    </div>
  );
}

function CharacterIdentityHeader({ item }: { item: CharacterTracker }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-full bg-blue-500/20 p-2">
        <User className="size-5 text-blue-500" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-muted-foreground flex items-center gap-1 text-sm">
          <Sparkles className="size-3 text-amber-500" />
          {item.className ? (
            <>
              {item.className}
              {item.subclassName && ` · ${item.subclassName}`}
            </>
          ) : (
            'Player Character'
          )}
        </p>
        {(item.ancestry || item.community) && (
          <p className="text-muted-foreground mt-0.5 text-xs">
            {item.ancestry}
            {item.ancestry && item.community && ' · '}
            {item.community}
            {item.pronouns && ` (${item.pronouns})`}
          </p>
        )}
      </div>
      {item.level && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                Lv {item.level}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Level {item.level} · Tier {item.tier}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

type FeatureBadge = {
  name: string;
  description: string;
  enabled?: boolean;
  unlockLevel?: number;
  source?: 'class' | 'subclass' | 'ancestry' | 'community' | 'custom';
};

function buildAncestryFeatures(ancestryName?: string): FeatureBadge[] {
  if (!ancestryName) return [];
  const ancestry = getAncestryByName(ancestryName);
  if (!ancestry) return [];
  const badges: FeatureBadge[] = [
    {
      name: ancestry.primaryFeature.name,
      description: ancestry.primaryFeature.description,
      source: 'ancestry' as const,
      enabled: true,
    },
    {
      name: ancestry.secondaryFeature.name,
      description: ancestry.secondaryFeature.description,
      source: 'ancestry' as const,
      enabled: true,
    },
  ];
  return badges.filter(feature => feature.name.trim().length > 0);
}

function buildCommunityFeatures(communityName?: string): FeatureBadge[] {
  if (!communityName) return [];
  const community = getCommunityByName(communityName);
  if (!community) return [];
  const badges: FeatureBadge[] = [
    {
      name: community.feature.name,
      description: community.feature.description,
      source: 'community' as const,
      enabled: true,
    },
  ];
  return badges.filter(feature => feature.name.trim().length > 0);
}

function buildClassFeatures(item: CharacterTracker): FeatureBadge[] {
  if (!item.className) return [];
  const subclassName = item.subclassName ?? '';
  const all = deriveFeatureUnlocks(item.className, subclassName);
  const { current, future } = getUnlockedFeatures(all, item.level ?? 1);
  const toBadge = (
    feature: (typeof all)[number],
    enabled: boolean
  ): FeatureBadge => ({
    name: feature.name,
    description: feature.description,
    source: feature.source,
    enabled,
    unlockLevel: feature.level,
  });
  return [
    ...current.map(feature => toBadge(feature, true)),
    ...future.map(feature => toBadge(feature, false)),
  ];
}

function FeatureBadges({ features }: { features: FeatureBadge[] }) {
  if (features.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {features.map(feature => (
        <TooltipProvider key={`${feature.source ?? 'feature'}-${feature.name}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={cn(
                  'cursor-help text-[10px] leading-none',
                  feature.enabled
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {feature.name}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-1">
                <p className="text-sm font-semibold">{feature.name}</p>
                <p className="text-muted-foreground text-xs">
                  {feature.description}
                </p>
                {feature.unlockLevel !== undefined && (
                  <p className="text-muted-foreground text-[10px]">
                    {feature.enabled
                      ? `Enabled (level ${feature.unlockLevel})`
                      : `Unlocks at level ${feature.unlockLevel}`}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}

function CharacterHeritageClassSection({ item }: { item: CharacterTracker }) {
  const ancestryFeatures = buildAncestryFeatures(item.ancestry);
  const communityFeatures = buildCommunityFeatures(item.community);
  const classFeatures = buildClassFeatures(item);

  if (
    !item.ancestry &&
    !item.community &&
    !item.className &&
    ancestryFeatures.length === 0 &&
    communityFeatures.length === 0 &&
    classFeatures.length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ScrollText className="text-muted-foreground size-4" />
        <h4 className="text-sm font-medium">Heritage & Class</h4>
      </div>
      <div className="space-y-2">
        {item.ancestry && (
          <div className="rounded-md border p-2">
            <div className="mb-1 flex items-center gap-2">
              <Dna className="size-3 text-cyan-500" />
              <span className="text-xs font-semibold">{item.ancestry}</span>
            </div>
            <FeatureBadges features={ancestryFeatures} />
          </div>
        )}
        {item.community && (
          <div className="rounded-md border p-2">
            <div className="mb-1 flex items-center gap-2">
              <Users className="size-3 text-emerald-500" />
              <span className="text-xs font-semibold">{item.community}</span>
            </div>
            <FeatureBadges features={communityFeatures} />
          </div>
        )}
        {item.className && (
          <div className="rounded-md border p-2">
            <div className="mb-1 flex items-center gap-2">
              <BookOpen className="size-3 text-amber-500" />
              <span className="text-xs font-semibold">
                {item.className}
                {item.subclassName && ` · ${item.subclassName}`}
              </span>
            </div>
            <FeatureBadges features={classFeatures} />
          </div>
        )}
      </div>
    </div>
  );
}

function CharacterPrimaryStatsGrid({ item }: { item: CharacterTracker }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <PrimaryStat
        icon={<Heart className="text-red-500" />}
        value={item.hp.current}
        max={item.hp.max}
        label="HP"
        tooltip="Hit Points - Current health"
        colorClass="text-red-600 dark:text-red-400"
        borderClass="border-red-500/30 from-red-500/10 to-red-500/5"
      />
      <PrimaryStat
        icon={<Zap className="text-purple-500" />}
        value={item.stress.current}
        max={item.stress.max}
        label="Stress"
        tooltip="Stress - Mental strain"
        colorClass="text-purple-600 dark:text-purple-400"
        borderClass="border-purple-500/30 from-purple-500/10 to-purple-500/5"
      />
      {item.hope && (
        <PrimaryStat
          icon={<Star className="text-amber-500" />}
          value={item.hope.current}
          max={item.hope.max}
          label="Hope"
          tooltip="Hope - Spend for abilities"
          colorClass="text-amber-600 dark:text-amber-400"
          borderClass="border-amber-500/30 from-amber-500/10 to-amber-500/5"
        />
      )}
    </div>
  );
}

function CharacterSecondaryStatsGrid({
  item,
  useMassiveThreshold,
}: {
  item: CharacterTracker;
  useMassiveThreshold?: boolean;
}) {
  const stats = getSecondaryStats(item, useMassiveThreshold);
  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map(stat => (
        <SecondaryStat
          key={stat.key}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          tooltip={stat.tooltip}
          colorClass={stat.colorClass}
          bgClass={stat.bgClass}
        />
      ))}
    </div>
  );
}

type SecondaryStatConfig = {
  key: string;
  icon: ReactNode;
  value: number | string;
  label: string;
  tooltip: string;
  colorClass: string;
  bgClass: string;
};

function getSecondaryStats(
  item: CharacterTracker,
  useMassiveThreshold?: boolean
): SecondaryStatConfig[] {
  return [
    getEvasionStat(item),
    getArmorStat(item),
    getThresholdStat(item, useMassiveThreshold),
    getProficiencyStat(item),
    getGoldStat(item),
  ].filter((stat): stat is SecondaryStatConfig => Boolean(stat));
}

function getEvasionStat(item: CharacterTracker): SecondaryStatConfig {
  return {
    key: 'evasion',
    icon: <Shield className="text-blue-500" />,
    value: item.evasion ?? 0,
    label: 'Evasion',
    tooltip: 'Evasion - Defense score',
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'from-blue-500/10 to-blue-500/5',
  };
}

function getArmorStat(item: CharacterTracker): SecondaryStatConfig | null {
  if ((item.armorSlots?.max ?? item.armorScore ?? 0) <= 0) return null;
  return {
    key: 'armor',
    icon: <Shield className="text-yellow-600" />,
    value: item.armorSlots
      ? `${item.armorSlots.current}/${item.armorSlots.max}`
      : (item.armorScore ?? 0),
    label: 'Armor',
    tooltip: 'Armor Slots - Absorb damage before taking HP loss',
    colorClass: 'text-yellow-600 dark:text-yellow-400',
    bgClass: 'from-yellow-500/10 to-yellow-500/5',
  };
}

function getThresholdStat(
  item: CharacterTracker,
  useMassiveThreshold?: boolean
): SecondaryStatConfig | null {
  if (!item.thresholds) return null;
  const massiveSuffix =
    useMassiveThreshold && item.thresholds.massive
      ? `/${item.thresholds.massive}`
      : '';
  const massiveLabel =
    useMassiveThreshold && item.thresholds.massive ? ' / Massive' : '';
  return {
    key: 'thresholds',
    icon: <Target className="text-orange-500" />,
    value: `${item.thresholds.major}/${item.thresholds.severe}${massiveSuffix}`,
    label: 'Thresholds',
    tooltip: `Damage Thresholds (Major / Severe${massiveLabel})`,
    colorClass: 'text-orange-600 dark:text-orange-400',
    bgClass: 'from-orange-500/10 to-orange-500/5',
  };
}

function getProficiencyStat(
  item: CharacterTracker
): SecondaryStatConfig | null {
  if (item.proficiency === undefined) return null;
  return {
    key: 'proficiency',
    icon: <TrendingUp className="text-green-500" />,
    value: `+${item.proficiency}`,
    label: 'Prof',
    tooltip: 'Proficiency bonus',
    colorClass: 'text-green-600 dark:text-green-400',
    bgClass: 'from-green-500/10 to-green-500/5',
  };
}

function getGoldStat(item: CharacterTracker): SecondaryStatConfig | null {
  if (item.gold === undefined || item.gold <= 0) return null;
  return {
    key: 'gold',
    icon: <Coins className="text-yellow-500" />,
    value: item.gold,
    label: 'Gold',
    tooltip: 'Gold pieces',
    colorClass: 'text-yellow-600 dark:text-yellow-400',
    bgClass: 'from-yellow-500/10 to-yellow-500/5',
  };
}

function CharacterCoreScoresSection({ item }: { item: CharacterTracker }) {
  const hasCoreScores =
    item.coreScores &&
    Object.values(item.coreScores).some(v => v !== undefined);
  if (!hasCoreScores) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Crosshair className="text-muted-foreground size-4" />
        <h4 className="text-sm font-medium">Core Scores</h4>
      </div>
      <div className="grid grid-cols-6 gap-1">
        {CORE_SCORE_CONFIG.map(({ key, label, color }) => {
          const value = item.coreScores?.[key];
          if (value === undefined) return null;
          const isPositive = value >= 0;
          return (
            <div
              key={key}
              className="bg-muted/30 rounded border p-1.5 text-center"
            >
              <p className={cn('text-sm font-bold', color)}>
                {isPositive ? '+' : ''}
                {value}
              </p>
              <p className="text-muted-foreground text-[9px] font-medium uppercase">
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CharacterConditionsSection({
  conditions,
}: {
  conditions: CharacterTracker['conditions'];
}) {
  if (!conditions.items.length) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-red-500">Active Conditions</p>
      <div className="flex flex-wrap gap-1">
        {conditions.items.map(condition => (
          <Badge key={condition} variant="destructive" className="text-xs">
            {condition}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function CharacterMassiveThresholdNotice({
  thresholds,
  useMassiveThreshold,
}: {
  thresholds?: CharacterTracker['thresholds'];
  useMassiveThreshold?: boolean;
}) {
  if (!useMassiveThreshold || !thresholds?.massive) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2">
      <Target className="size-4 text-red-500" />
      <div>
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Massive Threshold Active
        </p>
        <p className="text-muted-foreground text-xs">
          {thresholds.massive}+ damage = mark 4 HP
        </p>
      </div>
    </div>
  );
}

function AdversaryMassiveThresholdNotice({
  massiveThreshold,
  useMassiveThreshold,
}: {
  massiveThreshold?: number | null;
  useMassiveThreshold?: boolean;
}) {
  if (!useMassiveThreshold || massiveThreshold == null) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2">
      <Target className="size-4 text-red-500" />
      <div>
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Massive Threshold Active
        </p>
        <p className="text-muted-foreground text-xs">
          {massiveThreshold}+ damage = mark 4 HP
        </p>
      </div>
    </div>
  );
}

function CharacterEquipmentSection({
  equipment,
}: {
  equipment?: CharacterTracker['equipment'];
}) {
  const hasEquipment =
    equipment?.primary || equipment?.secondary || equipment?.armor;
  if (!hasEquipment) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Sword className="text-muted-foreground size-4" />
        <h4 className="text-sm font-medium">Equipment</h4>
      </div>
      <div className="space-y-2">
        <WeaponCard weapon={equipment?.primary} label="Primary" />
        <WeaponCard weapon={equipment?.secondary} label="Secondary" />
        <ArmorCard armor={equipment?.armor} />
      </div>
    </div>
  );
}

function CharacterExperiencesSection({
  experiences,
}: {
  experiences?: CharacterTracker['experiences'];
}) {
  if (!experiences || experiences.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Users className="text-muted-foreground size-4" />
        <h4 className="text-sm font-medium">Experiences</h4>
      </div>
      <div className="flex flex-wrap gap-1">
        {experiences.map(exp => (
          <TooltipProvider key={exp.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="text-xs">
                  {exp.name} +{exp.value}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>+{exp.value} to rolls when this applies</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}

function CharacterLoadoutSection({
  loadout,
}: {
  loadout?: CharacterTracker['loadout'];
}) {
  if (!loadout || loadout.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ScrollText className="text-primary size-4" />
        <h4 className="text-sm font-medium">Active Cards ({loadout.length})</h4>
      </div>
      <div className="space-y-1.5">
        {loadout.map((card, index) => (
          <DomainCardItem key={`${card.name}-${index}`} card={card} />
        ))}
      </div>
    </div>
  );
}

function CharacterVaultSection({
  vaultCards,
}: {
  vaultCards?: CharacterTracker['vaultCards'];
}) {
  if (!vaultCards || vaultCards.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <BookOpen className="text-muted-foreground size-4" />
        <h4 className="text-sm font-medium">Vault ({vaultCards.length})</h4>
      </div>
      <div className="flex flex-wrap gap-1">
        {vaultCards.map((card, index) => (
          <TooltipProvider key={`vault-${card.name}-${index}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-help text-xs opacity-70"
                >
                  {card.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="font-medium">
                  {card.name} (Lv {card.level})
                </p>
                <p className="text-muted-foreground text-xs">
                  {card.domain} · {card.type}
                </p>
                <p className="mt-1 text-sm">{card.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}

function CharacterInventorySection({
  inventory,
}: {
  inventory?: CharacterTracker['inventory'];
}) {
  if (!inventory || inventory.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Backpack className="text-muted-foreground size-4" />
        <h4 className="text-sm font-medium">Inventory ({inventory.length})</h4>
      </div>
      <div className="bg-muted/30 rounded-md border p-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {inventory.map((invItem, index) => (
            <TooltipProvider key={`${invItem.name}-${index}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground hover:text-foreground cursor-help transition-colors">
                    {invItem.name}
                    {invItem.quantity > 1 && (
                      <span className="text-foreground ml-0.5 font-medium">
                        ×{invItem.quantity}
                      </span>
                    )}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="font-medium">{invItem.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {[
                      invItem.category,
                      invItem.tier ? `Tier ${invItem.tier}` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || 'Item'}
                    {invItem.quantity > 1 && ` · Qty: ${invItem.quantity}`}
                  </p>
                  {invItem.description && (
                    <p className="mt-1 text-sm">{invItem.description}</p>
                  )}
                  {invItem.features && invItem.features.length > 0 && (
                    <div className="mt-2 space-y-1 border-t pt-2">
                      {invItem.features.map((feature, idx) => (
                        <div key={idx}>
                          <p className="text-xs font-semibold">
                            {feature.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {feature.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}

function CharacterDetails({
  item,
  useMassiveThreshold,
  onChange,
}: {
  item: CharacterTracker;
  useMassiveThreshold?: boolean;
  onChange: (id: string, fn: (c: CharacterTracker) => CharacterTracker) => void;
}) {
  const isLinked = item.isLinkedCharacter === true;

  return (
    <div className="space-y-4">
      <CharacterLinkedNotice isLinked={isLinked} />
      <CharacterIdentityHeader item={item} />
      <CharacterHeritageClassSection item={item} />
      <CharacterPrimaryStatsGrid item={item} />
      <CharacterSecondaryStatsGrid
        item={item}
        useMassiveThreshold={useMassiveThreshold}
      />
      <CharacterCoreScoresSection item={item} />
      <CharacterConditionsSection conditions={item.conditions} />
      <CharacterMassiveThresholdNotice
        thresholds={item.thresholds}
        useMassiveThreshold={useMassiveThreshold}
      />
      <Separator />
      <CharacterEquipmentSection equipment={item.equipment} />
      <CharacterExperiencesSection experiences={item.experiences} />
      <CharacterLoadoutSection loadout={item.loadout} />
      <CharacterVaultSection vaultCards={item.vaultCards} />
      <CharacterInventorySection inventory={item.inventory} />
      <Separator />
      <NotesField
        value={item.notes}
        onChange={v => onChange(item.id, c => ({ ...c, notes: v }))}
      />
    </div>
  );
}

function AdversaryDetails({
  item,
  useMassiveThreshold,
  onChange,
  fearPool,
  onSpendFear,
}: {
  item: AdversaryTracker;
  useMassiveThreshold?: boolean;
  onChange: (id: string, fn: (a: AdversaryTracker) => AdversaryTracker) => void;
  fearPool?: number;
  onSpendFear?: (cost: number, featureName: string) => void;
}) {
  const {
    effectiveAttack,
    effectiveThresholds,
    effectiveFeatures,
    effectiveDifficulty,
    hasModifications,
  } = getAdversaryEffectiveValues(item);

  // Get massive threshold value for display
  const massiveThreshold =
    typeof effectiveThresholds === 'string'
      ? null
      : effectiveThresholds.massive;

  return (
    <div className="space-y-4">
      <AdversaryHeaderSection
        item={item}
        effectiveDifficulty={effectiveDifficulty}
        hasModifications={hasModifications}
      />

      <AdversaryStatGrid hp={item.hp} stress={item.stress} />
      <AdversaryAttackInfo
        attack={effectiveAttack}
        isModified={!!item.attackOverride}
      />
      <AdversaryThresholdsDisplay
        thresholds={effectiveThresholds}
        isModified={!!item.thresholdsOverride}
        useMassiveThreshold={useMassiveThreshold}
      />
      <AdversaryMassiveThresholdNotice
        massiveThreshold={massiveThreshold}
        useMassiveThreshold={useMassiveThreshold}
      />
      <AdversaryFeatureList
        features={effectiveFeatures}
        isModified={!!item.featuresOverride}
        fearPool={fearPool}
        onSpendFear={onSpendFear}
      />

      <NotesField
        value={item.notes}
        onChange={v => onChange(item.id, a => ({ ...a, notes: v }))}
      />
    </div>
  );
}

function AdversaryHeaderSection({
  item,
  effectiveDifficulty,
  hasModifications,
}: {
  item: AdversaryTracker;
  effectiveDifficulty: number;
  hasModifications: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-full text-lg',
          TIER_COLORS[item.source.tier] ?? 'bg-muted'
        )}
      >
        {ROLE_ICONS[item.source.role] ?? '⚔️'}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-lg font-semibold">{item.source.name}</h3>
          {hasModifications && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/20 text-xs text-blue-600"
                  >
                    Modified
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This adversary has been customized</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge className={TIER_COLORS[item.source.tier]}>
            T{item.source.tier}
          </Badge>
          <Badge variant="outline">{item.source.role}</Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="flex cursor-help items-center gap-1"
                >
                  <Crosshair className="size-3" />
                  {effectiveDifficulty}
                  {item.difficultyOverride && (
                    <span className="text-blue-500">*</span>
                  )}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Difficulty to hit</p>
                {item.difficultyOverride && (
                  <p className="text-blue-400">
                    Modified from {item.source.difficulty}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

function EnvironmentDetails({
  item,
  onChange,
  fearPool,
  onSpendFear,
}: {
  item: EnvironmentTracker;
  onChange: (
    id: string,
    fn: (e: EnvironmentTracker) => EnvironmentTracker
  ) => void;
  fearPool?: number;
  onSpendFear?: (cost: number, featureName: string) => void;
}) {
  const activeCount = item.features.filter(f => f.active).length;

  return (
    <div className="space-y-4">
      <EnvironmentHeader item={item} />
      <EnvironmentDescription description={item.source.description} />
      <EnvironmentImpulses impulses={item.source.impulses} />
      <EnvironmentFeaturesList
        item={item}
        activeCount={activeCount}
        onChange={onChange}
        fearPool={fearPool}
        onSpendFear={onSpendFear}
      />

      <NotesField
        value={item.notes}
        onChange={v => onChange(item.id, env => ({ ...env, notes: v }))}
      />
    </div>
  );
}

function EnvironmentHeader({ item }: { item: EnvironmentTracker }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-full bg-emerald-500/20 p-2 text-lg">
        {TYPE_ICONS[item.source.type] ?? '🌲'}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-semibold">{item.source.name}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge className={TIER_COLORS[item.source.tier]}>
            T{item.source.tier}
          </Badge>
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
          >
            {item.source.type}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="flex cursor-help items-center gap-1"
                >
                  <Crosshair className="size-3" />
                  {item.source.difficulty}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Difficulty for environment checks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

function EnvironmentDescription({ description }: { description: string }) {
  return (
    <div className="bg-muted/50 rounded-lg p-3">
      <p className="text-muted-foreground text-sm italic">{description}</p>
    </div>
  );
}

function EnvironmentImpulses({ impulses }: { impulses: string[] }) {
  return (
    <div className="space-y-2 rounded-lg border-2 border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 p-3">
      <div className="flex items-center gap-2">
        <Zap className="size-4 text-amber-500" />
        <span className="font-semibold text-amber-600 dark:text-amber-400">
          Impulses
        </span>
        <Badge variant="secondary" className="text-xs">
          {impulses.length}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {impulses.map(imp => (
          <TooltipProvider key={imp}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="secondary"
                  className="cursor-help border-amber-500/30 bg-amber-500/20 text-amber-700 dark:text-amber-400"
                >
                  {imp}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Environmental impulse - use to guide narration</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}

function EnvironmentFeaturesList({
  item,
  activeCount,
  onChange,
  fearPool,
  onSpendFear,
}: {
  item: EnvironmentTracker;
  activeCount: number;
  onChange: (
    id: string,
    fn: (e: EnvironmentTracker) => EnvironmentTracker
  ) => void;
  fearPool?: number;
  onSpendFear?: (cost: number, featureName: string) => void;
}) {
  return (
    <div className="space-y-2 rounded-lg border-2 border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 p-3">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-emerald-500" />
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          Features
        </span>
        <Badge
          variant="secondary"
          className={cn(
            'text-xs',
            activeCount === item.features.length &&
              'bg-emerald-500/20 text-emerald-600'
          )}
        >
          {activeCount}/{item.features.length} active
        </Badge>
      </div>
      <div className="space-y-2">
        {item.features.map(f => {
          const fearCost = parseFearCost(f.description);
          const canAfford =
            fearCost > 0 && fearPool !== undefined && fearPool >= fearCost;
          const isClickable = fearCost > 0 && onSpendFear;

          return (
            <TooltipProvider key={f.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 text-sm transition-all',
                      f.active
                        ? 'border-emerald-400 bg-emerald-500/10 shadow-sm'
                        : 'border-muted-foreground/20 hover:border-emerald-400/50',
                      isClickable &&
                        !canAfford &&
                        'cursor-not-allowed opacity-50'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={f.active}
                      onChange={e =>
                        onChange(item.id, env => ({
                          ...env,
                          features: env.features.map(ef =>
                            ef.id === f.id
                              ? { ...ef, active: e.target.checked }
                              : ef
                          ),
                        }))
                      }
                      className="mt-1 accent-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            'font-medium',
                            f.active && 'text-emerald-700 dark:text-emerald-400'
                          )}
                        >
                          {f.name}
                        </p>
                        {fearCost > 0 && (
                          <Badge
                            variant="outline"
                            className={cn(
                              'border-purple-500/40 bg-purple-500/20 text-[10px] text-purple-600 dark:text-purple-400',
                              isClickable &&
                                canAfford &&
                                'cursor-pointer hover:bg-purple-500/30'
                            )}
                            onClick={
                              isClickable && canAfford
                                ? e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onSpendFear(fearCost, f.name);
                                  }
                                : undefined
                            }
                          >
                            💀 {fearCost}
                          </Badge>
                        )}
                        {f.active && (
                          <Badge className="bg-emerald-500/30 text-[10px] text-emerald-700 dark:text-emerald-400">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {f.description}
                      </p>
                    </div>
                  </label>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>
                    Click to {f.active ? 'deactivate' : 'activate'} this feature
                  </p>
                  {fearCost > 0 && (
                    <p className="text-purple-400">
                      Click 💀 badge to spend {fearCost} Fear
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}

function NotesField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <ScrollText className="text-muted-foreground size-4" />
        Notes
      </label>
      <textarea
        className="bg-background border-muted-foreground/20 focus:border-primary/50 w-full rounded-lg border-2 p-3 text-sm transition-colors"
        rows={3}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Add combat notes, status effects, tactics..."
      />
    </div>
  );
}
