import {
  Backpack,
  BookOpen,
  Coins,
  Crosshair,
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

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
  TrackerItem,
} from './types';

export function SelectedItemDetails({
  item,
  useMassiveThreshold,
  onCharacterChange,
  onAdversaryChange,
  onEnvironmentChange,
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
    return <AdversaryDetails item={item} onChange={onAdversaryChange} />;
  }
  return <EnvironmentDetails item={item} onChange={onEnvironmentChange} />;
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
  const hasLoadoutCards = item.loadout && item.loadout.length > 0;
  const hasVaultCards = item.vaultCards && item.vaultCards.length > 0;
  const hasExperiences = item.experiences && item.experiences.length > 0;
  const hasEquipment =
    item.equipment?.primary ||
    item.equipment?.secondary ||
    item.equipment?.armor;
  const hasInventory = item.inventory && item.inventory.length > 0;
  const hasCoreScores =
    item.coreScores &&
    Object.values(item.coreScores).some(v => v !== undefined);
  const isLinked = item.isLinkedCharacter === true;

  // Core score display config
  const coreScoreConfig = [
    {
      key: 'agility',
      label: 'AGI',
      color: 'text-green-600 dark:text-green-400',
    },
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
    {
      key: 'knowledge',
      label: 'KNO',
      color: 'text-cyan-600 dark:text-cyan-400',
    },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Linked character notice */}
      {isLinked && (
        <div className="bg-primary/10 text-primary border-primary/30 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <span className="text-base">🔗</span>
          <span>
            Stats sync live from player. Only your notes are editable.
          </span>
        </div>
      )}

      {/* Header with identity */}
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
          {/* Ancestry & Community */}
          {(item.ancestry || item.community) && (
            <p className="text-muted-foreground mt-0.5 text-xs">
              {item.ancestry}
              {item.ancestry && item.community && ' · '}
              {item.community}
              {item.pronouns && ` (${item.pronouns})`}
            </p>
          )}
        </div>
        {/* Level Badge */}
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

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help rounded-lg border-2 border-red-500/30 bg-gradient-to-b from-red-500/10 to-red-500/5 p-3 text-center">
                <Heart className="mx-auto mb-1 size-4 text-red-500" />
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {item.hp.current}
                </p>
                <p className="text-muted-foreground text-xs">
                  HP / {item.hp.max}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hit Points - Current health</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help rounded-lg border-2 border-purple-500/30 bg-gradient-to-b from-purple-500/10 to-purple-500/5 p-3 text-center">
                <Zap className="mx-auto mb-1 size-4 text-purple-500" />
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {item.stress.current}
                </p>
                <p className="text-muted-foreground text-xs">
                  Stress / {item.stress.max}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stress - Mental strain</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {item.hope && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help rounded-lg border-2 border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-amber-500/5 p-3 text-center">
                  <Star className="mx-auto mb-1 size-4 text-amber-500" />
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {item.hope.current}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Hope / {item.hope.max}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hope - Spend for abilities</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help rounded-lg border bg-gradient-to-b from-blue-500/10 to-blue-500/5 p-2 text-center">
                <Shield className="mx-auto mb-0.5 size-3.5 text-blue-500" />
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {item.evasion ?? 0}
                </p>
                <p className="text-muted-foreground text-[10px]">Evasion</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Evasion - Defense score</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {(item.armorSlots?.max ?? item.armorScore ?? 0) > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help rounded-lg border bg-gradient-to-b from-yellow-500/10 to-yellow-500/5 p-2 text-center">
                  <Shield className="mx-auto mb-0.5 size-3.5 text-yellow-600" />
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {item.armorSlots
                      ? `${item.armorSlots.current}/${item.armorSlots.max}`
                      : item.armorScore}
                  </p>
                  <p className="text-muted-foreground text-[10px]">Armor</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Armor Slots - Absorb damage before taking HP loss</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {item.thresholds && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help rounded-lg border bg-gradient-to-b from-orange-500/10 to-orange-500/5 p-2 text-center">
                  <Target className="mx-auto mb-0.5 size-3.5 text-orange-500" />
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {item.thresholds.major}/{item.thresholds.severe}
                    {useMassiveThreshold && item.thresholds.massive
                      ? `/${item.thresholds.massive}`
                      : ''}
                  </p>
                  <p className="text-muted-foreground text-[10px]">
                    Thresholds
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Damage Thresholds (Major / Severe
                  {useMassiveThreshold && item.thresholds.massive
                    ? ' / Massive'
                    : ''}
                  )
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {item.proficiency !== undefined && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help rounded-lg border bg-gradient-to-b from-green-500/10 to-green-500/5 p-2 text-center">
                  <TrendingUp className="mx-auto mb-0.5 size-3.5 text-green-500" />
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    +{item.proficiency}
                  </p>
                  <p className="text-muted-foreground text-[10px]">Prof</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Proficiency bonus</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {item.gold !== undefined && item.gold > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help rounded-lg border bg-gradient-to-b from-yellow-500/10 to-yellow-500/5 p-2 text-center">
                  <Coins className="mx-auto mb-0.5 size-3.5 text-yellow-500" />
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {item.gold}
                  </p>
                  <p className="text-muted-foreground text-[10px]">Gold</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gold pieces</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Core Scores */}
      {hasCoreScores && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Crosshair className="text-muted-foreground size-4" />
            <h4 className="text-sm font-medium">Core Scores</h4>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {coreScoreConfig.map(({ key, label, color }) => {
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
      )}

      {/* Conditions */}
      {item.conditions.items.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-red-500">Active Conditions</p>
          <div className="flex flex-wrap gap-1">
            {item.conditions.items.map(condition => (
              <Badge key={condition} variant="destructive" className="text-xs">
                {condition}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Massive Threshold Info - shown when enabled globally */}
      {useMassiveThreshold && item.thresholds?.massive && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2">
          <Target className="size-4 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Massive Threshold Active
            </p>
            <p className="text-muted-foreground text-xs">
              {item.thresholds.massive}+ damage = instant death
            </p>
          </div>
        </div>
      )}

      <Separator />

      {/* Equipment - Enhanced */}
      {hasEquipment && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sword className="text-muted-foreground size-4" />
            <h4 className="text-sm font-medium">Equipment</h4>
          </div>
          <div className="space-y-2">
            {item.equipment?.primary && (
              <div className="bg-muted/30 rounded-md border p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {item.equipment.primary.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Primary
                  </Badge>
                </div>
                <div className="text-muted-foreground mt-1 flex flex-wrap gap-2 text-xs">
                  {item.equipment.primary.damage && (
                    <span className="text-red-500">
                      {item.equipment.primary.damage}
                    </span>
                  )}
                  {item.equipment.primary.range && (
                    <span>{item.equipment.primary.range}</span>
                  )}
                </div>
                {item.equipment.primary.traits &&
                  item.equipment.primary.traits.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.equipment.primary.traits.map(trait => (
                        <Badge
                          key={trait}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  )}
              </div>
            )}
            {item.equipment?.secondary && (
              <div className="bg-muted/30 rounded-md border p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {item.equipment.secondary.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Secondary
                  </Badge>
                </div>
                <div className="text-muted-foreground mt-1 flex flex-wrap gap-2 text-xs">
                  {item.equipment.secondary.damage && (
                    <span className="text-red-500">
                      {item.equipment.secondary.damage}
                    </span>
                  )}
                  {item.equipment.secondary.range && (
                    <span>{item.equipment.secondary.range}</span>
                  )}
                </div>
                {item.equipment.secondary.traits &&
                  item.equipment.secondary.traits.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.equipment.secondary.traits.map(trait => (
                        <Badge
                          key={trait}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  )}
              </div>
            )}
            {item.equipment?.armor && (
              <div className="bg-muted/30 rounded-md border p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {item.equipment.armor.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-yellow-500/50 text-xs text-yellow-600"
                  >
                    Armor
                  </Badge>
                </div>
                {item.equipment.armor.feature && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    {item.equipment.armor.feature}
                  </p>
                )}
                {item.equipment.armor.thresholds && (
                  <div className="text-muted-foreground mt-1 text-xs">
                    Thresholds: {item.equipment.armor.thresholds.major}/
                    {item.equipment.armor.thresholds.severe}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experiences */}
      {hasExperiences && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="text-muted-foreground size-4" />
            <h4 className="text-sm font-medium">Experiences</h4>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.experiences!.map(exp => (
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
      )}

      {/* Domain Cards - Active Loadout */}
      {hasLoadoutCards && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ScrollText className="text-primary size-4" />
            <h4 className="text-sm font-medium">
              Active Cards ({item.loadout!.length})
            </h4>
          </div>
          <div className="space-y-1.5">
            {item.loadout!.map((card, index) => (
              <TooltipProvider key={`${card.name}-${index}`}>
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
                          <span className="text-amber-500">
                            {card.hopeCost} Hope
                          </span>
                        )}
                        {card.stressCost !== undefined &&
                          card.stressCost > 0 && (
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
            ))}
          </div>
        </div>
      )}

      {/* Vault Cards */}
      {hasVaultCards && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="text-muted-foreground size-4" />
            <h4 className="text-sm font-medium">
              Vault ({item.vaultCards!.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.vaultCards!.map((card, index) => (
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
      )}

      {/* Inventory / Stash */}
      {hasInventory && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Backpack className="text-muted-foreground size-4" />
            <h4 className="text-sm font-medium">
              Inventory ({item.inventory!.length})
            </h4>
          </div>
          <div className="bg-muted/30 rounded-md border p-2">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {item.inventory!.map((invItem, index) => (
                <span
                  key={`${invItem.name}-${index}`}
                  className="text-muted-foreground"
                >
                  {invItem.name}
                  {invItem.quantity > 1 && (
                    <span className="text-foreground ml-0.5 font-medium">
                      ×{invItem.quantity}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

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
  onChange,
}: {
  item: AdversaryTracker;
  onChange: (id: string, fn: (a: AdversaryTracker) => AdversaryTracker) => void;
}) {
  const tierColors: Record<string, string> = {
    '1': 'text-green-600 dark:text-green-400 bg-green-500/20 border-green-500/30',
    '2': 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    '3': 'text-orange-600 dark:text-orange-400 bg-orange-500/20 border-orange-500/30',
    '4': 'text-red-600 dark:text-red-400 bg-red-500/20 border-red-500/30',
  };

  const roleIcons: Record<string, string> = {
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

  // Use effective values (overrides if set)
  const effectiveAttack = {
    name: item.attackOverride?.name ?? item.source.attack.name,
    modifier: item.attackOverride?.modifier ?? item.source.attack.modifier,
    range: item.attackOverride?.range ?? item.source.attack.range,
    damage: item.attackOverride?.damage ?? item.source.attack.damage,
  };
  const effectiveThresholds = item.thresholdsOverride ?? item.source.thresholds;
  const effectiveFeatures = item.featuresOverride ?? item.source.features;
  const effectiveDifficulty = item.difficultyOverride ?? item.source.difficulty;

  const hasModifications = !!(
    item.attackOverride ||
    item.thresholdsOverride ||
    item.featuresOverride ||
    item.difficultyOverride
  );

  return (
    <div className="space-y-4">
      {/* Header with role icon */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'rounded-full p-2 text-lg',
            tierColors[item.source.tier] ?? 'bg-muted'
          )}
        >
          {roleIcons[item.source.role] ?? '⚔️'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold">
              {item.source.name}
            </h3>
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
            <Badge className={tierColors[item.source.tier]}>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help rounded-lg border-2 border-red-500/30 bg-gradient-to-b from-red-500/10 to-red-500/5 p-3 text-center">
                <Heart className="mx-auto mb-1 size-4 text-red-500" />
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {item.hp.current}
                </p>
                <p className="text-muted-foreground text-xs">
                  HP / {item.hp.max}
                </p>
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
                  {item.stress.current}
                </p>
                <p className="text-muted-foreground text-xs">
                  Stress / {item.stress.max}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stress - Used for special abilities</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Attack Info */}
      <div className="space-y-2 rounded-lg border-2 border-red-500/20 bg-gradient-to-r from-red-500/5 to-orange-500/5 p-3">
        <div className="flex items-center gap-2">
          <Sword className="size-4 text-red-500" />
          <span className="font-semibold text-red-600 dark:text-red-400">
            Attack
          </span>
          {item.attackOverride && (
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
                  <p className="font-medium">{effectiveAttack.name}</p>
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
                  <p className="font-mono font-medium">
                    {effectiveAttack.modifier}
                  </p>
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
                  <p className="font-medium">{effectiveAttack.range}</p>
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
                    {effectiveAttack.damage}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Damage dice</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Thresholds */}
      <div className="space-y-2 rounded-lg border-2 border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 p-3">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-amber-500" />
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            Damage Thresholds
          </span>
          {item.thresholdsOverride && (
            <Badge
              variant="secondary"
              className="bg-blue-500/20 text-[10px] text-blue-600"
            >
              Modified
            </Badge>
          )}
        </div>
        {typeof effectiveThresholds === 'string' ? (
          <p className="text-muted-foreground text-sm">{effectiveThresholds}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="cursor-help border-yellow-500/30 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                    Major: {effectiveThresholds.major}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Damage ≥ {effectiveThresholds.major} = Major result
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="cursor-help border-orange-500/30 bg-orange-500/20 text-orange-600 dark:text-orange-400">
                    Severe: {effectiveThresholds.severe}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Damage ≥ {effectiveThresholds.severe} = Severe result
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {effectiveThresholds.massive && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="cursor-help border-red-500/30 bg-red-500/20 text-red-600 dark:text-red-400">
                      Massive: {effectiveThresholds.massive}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    Damage ≥ {effectiveThresholds.massive} = Massive result
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>

      {/* Features */}
      {effectiveFeatures.length > 0 && (
        <div className="space-y-2 rounded-lg border-2 border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-violet-500/5 p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-purple-500" />
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Features
            </span>
            <Badge variant="secondary" className="text-xs">
              {effectiveFeatures.length}
            </Badge>
            {item.featuresOverride && (
              <Badge
                variant="secondary"
                className="bg-blue-500/20 text-[10px] text-blue-600"
              >
                Modified
              </Badge>
            )}
          </div>
          <ul className="space-y-2">
            {effectiveFeatures.map((f, i) => {
              const isString = typeof f === 'string';
              const name = isString ? f.split(':')[0].trim() : f.name;
              const type = isString ? null : f.type;
              const description = isString
                ? f.includes(':')
                  ? f.split(':').slice(1).join(':').trim()
                  : ''
                : f.description;
              const isCustom =
                !isString &&
                'isCustom' in f &&
                Boolean((f as { isCustom?: boolean }).isCustom);

              return (
                <li key={i} className="bg-background/50 rounded p-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{name}</span>
                    {type && (
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px]',
                          type === 'Passive' && 'bg-gray-500/20 text-gray-600',
                          type === 'Action' && 'bg-green-500/20 text-green-600',
                          type === 'Reaction' && 'bg-blue-500/20 text-blue-600'
                        )}
                      >
                        {type}
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
      )}

      <NotesField
        value={item.notes}
        onChange={v => onChange(item.id, a => ({ ...a, notes: v }))}
      />
    </div>
  );
}

function EnvironmentDetails({
  item,
  onChange,
}: {
  item: EnvironmentTracker;
  onChange: (
    id: string,
    fn: (e: EnvironmentTracker) => EnvironmentTracker
  ) => void;
}) {
  const typeIcons: Record<string, string> = {
    Exploration: '🗺️',
    Social: '💬',
    Event: '⚡',
    Traversal: '🚶',
  };

  const tierColors: Record<string, string> = {
    '1': 'bg-green-500/20 text-green-600 border-green-500/30',
    '2': 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
    '3': 'bg-orange-500/20 text-orange-600 border-orange-500/30',
    '4': 'bg-red-500/20 text-red-600 border-red-500/30',
  };

  const activeCount = item.features.filter(f => f.active).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-emerald-500/20 p-2 text-lg">
          {typeIcons[item.source.type] ?? '🌲'}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">{item.source.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge className={tierColors[item.source.tier]}>
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

      {/* Description */}
      <div className="bg-muted/50 rounded-lg p-3">
        <p className="text-muted-foreground text-sm italic">
          {item.source.description}
        </p>
      </div>

      {/* Impulses */}
      <div className="space-y-2 rounded-lg border-2 border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 p-3">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-amber-500" />
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            Impulses
          </span>
          <Badge variant="secondary" className="text-xs">
            {item.source.impulses.length}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.source.impulses.map(imp => (
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

      {/* Features with checkboxes */}
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
          {item.features.map(f => (
            <TooltipProvider key={f.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 text-sm transition-all',
                      f.active
                        ? 'border-emerald-400 bg-emerald-500/10 shadow-sm'
                        : 'border-muted-foreground/20 hover:border-emerald-400/50'
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
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      <NotesField
        value={item.notes}
        onChange={v => onChange(item.id, env => ({ ...env, notes: v }))}
      />
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
