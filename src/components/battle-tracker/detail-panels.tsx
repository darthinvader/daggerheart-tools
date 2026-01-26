import {
  Crosshair,
  Heart,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  Target,
  User,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
  onCharacterChange,
  onAdversaryChange,
  onEnvironmentChange,
}: {
  item: TrackerItem;
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
    return <CharacterDetails item={item} onChange={onCharacterChange} />;
  }
  if (item.kind === 'adversary') {
    return <AdversaryDetails item={item} onChange={onAdversaryChange} />;
  }
  return <EnvironmentDetails item={item} onChange={onEnvironmentChange} />;
}

function CharacterDetails({
  item,
  onChange,
}: {
  item: CharacterTracker;
  onChange: (id: string, fn: (c: CharacterTracker) => CharacterTracker) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Header with icon */}
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-blue-500/20 p-2">
          <User className="size-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-muted-foreground flex items-center gap-1 text-sm">
            <Sparkles className="size-3 text-amber-500" />
            Player Character
          </p>
        </div>
      </div>

      {/* Stats Grid with enhanced visuals */}
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help rounded-lg border-2 border-blue-500/30 bg-gradient-to-b from-blue-500/10 to-blue-500/5 p-3 text-center">
                <Shield className="mx-auto mb-1 size-4 text-blue-500" />
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {item.evasion ?? 0}
                </p>
                <p className="text-muted-foreground text-xs">Evasion</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Evasion - Defense score</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

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
          <Swords className="size-4 text-red-500" />
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
