import {
  Crosshair,
  Dices,
  Heart,
  MapPin,
  Pencil,
  Shield,
  Sparkles,
  Swords,
  TreePine,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { CountdownControl, StatMini } from './stat-controls';
import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
} from './types';

export function CharacterCard({
  character,
  isSelected,
  isSpotlight,
  onSelect,
  onRemove,
  onSpotlight,
  onChange,
}: {
  character: CharacterTracker;
  isSelected: boolean;
  isSpotlight: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onSpotlight: () => void;
  onChange: (id: string, fn: (c: CharacterTracker) => CharacterTracker) => void;
}) {
  return (
    <div
      className={cn(
        'group relative rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 transition-all',
        isSelected && 'ring-primary ring-2',
        isSpotlight && 'shadow-lg ring-2 shadow-amber-400/20 ring-amber-400'
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <button onClick={onSelect} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🧙</span>
            <p className="truncate font-semibold">{character.name}</p>
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="h-5 text-xs">
                  <Shield className="mr-0.5 size-3" />
                  {character.evasion ?? '—'}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Evasion (Difficulty to hit)</TooltipContent>
            </Tooltip>
          </div>
        </button>
        <CardActions
          isSpotlight={isSpotlight}
          onSpotlight={onSpotlight}
          onRemove={onRemove}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <StatMini
          label="HP"
          value={character.hp.current}
          max={character.hp.max}
          colorClass="text-red-600 dark:text-red-400"
          icon={<Heart className="size-3" />}
          onChange={v =>
            onChange(character.id, c => ({
              ...c,
              hp: { ...c.hp, current: v },
            }))
          }
        />
        <StatMini
          label="Stress"
          value={character.stress.current}
          max={character.stress.max}
          colorClass="text-purple-600 dark:text-purple-400"
          icon={<Zap className="size-3" />}
          onChange={v =>
            onChange(character.id, c => ({
              ...c,
              stress: { ...c.stress, current: v },
            }))
          }
        />
      </div>
    </div>
  );
}

export function AdversaryCard({
  adversary,
  isSelected,
  isSpotlight,
  onSelect,
  onRemove,
  onSpotlight,
  onChange,
  onEdit,
}: {
  adversary: AdversaryTracker;
  isSelected: boolean;
  isSpotlight: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onSpotlight: () => void;
  onChange: (id: string, fn: (a: AdversaryTracker) => AdversaryTracker) => void;
  onEdit?: () => void;
}) {
  const source = adversary.source;
  const effectiveDifficulty = adversary.difficultyOverride ?? source.difficulty;

  // Effective attack (uses override if set)
  const effectiveAttack = {
    name: adversary.attackOverride?.name ?? source.attack.name,
    modifier: adversary.attackOverride?.modifier ?? source.attack.modifier,
    range: adversary.attackOverride?.range ?? source.attack.range,
    damage: adversary.attackOverride?.damage ?? source.attack.damage,
  };
  const hasAttackOverride = !!adversary.attackOverride;

  // Effective thresholds (uses override if set)
  const effectiveThresholds = adversary.thresholdsOverride ?? source.thresholds;
  const hasThresholdsOverride = !!adversary.thresholdsOverride;

  // Effective features (uses override if set)
  const effectiveFeatures = adversary.featuresOverride ?? source.features;
  const hasFeaturesOverride = !!adversary.featuresOverride;

  const [isRolling, setIsRolling] = useState(false);
  const [attackRoll, setAttackRoll] = useState<{
    roll: number;
    total: number;
    modStr: string;
  } | null>(
    adversary.lastAttackRoll
      ? {
          roll: adversary.lastAttackRoll.roll,
          total: adversary.lastAttackRoll.total,
          modStr: String(
            adversary.attackOverride?.modifier ?? source.attack.modifier
          ),
        }
      : null
  );

  const [isDamageRolling, setIsDamageRolling] = useState(false);
  const [damageRoll, setDamageRoll] = useState<{
    dice: string;
    rolls: number[];
    bonus: number;
    total: number;
  } | null>(
    adversary.lastDamageRoll
      ? {
          dice: adversary.lastDamageRoll.dice,
          rolls: adversary.lastDamageRoll.rolls,
          bonus: 0, // Will be parsed from dice string
          total: adversary.lastDamageRoll.total,
        }
      : null
  );

  const tierColors: Record<string, string> = {
    '1': 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
    '2': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
    '3': 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30',
    '4': 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
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

  // Parse dice expression (e.g., "2d6+3" or "1d8" or "+2d4")
  const parseDiceExpression = (
    expr: string | number
  ): { count: number; sides: number; bonus: number } | null => {
    if (typeof expr === 'number') return null; // Just a flat number
    const match = String(expr).match(/([+-]?)(\d+)d(\d+)([+-]\d+)?/i);
    if (!match) return null;
    const sign = match[1] === '-' ? -1 : 1;
    return {
      count: sign * (parseInt(match[2]) || 1),
      sides: parseInt(match[3]) || 6,
      bonus: parseInt(match[4]) || 0,
    };
  };

  // Parse attack modifier - can be a number, "+5", or dice like "+2d4"
  const attackModStr = String(effectiveAttack.modifier);
  const attackModDice = parseDiceExpression(effectiveAttack.modifier);
  const attackMod = attackModDice
    ? 0 // Will roll dice instead
    : typeof effectiveAttack.modifier === 'number'
      ? effectiveAttack.modifier
      : parseInt(attackModStr.replace(/[^-\d]/g, '')) || 0;

  // Parse damage dice (e.g., "2d6+3" or "1d8" or "3d6-1")
  const parseDamage = (damageStr: string) => {
    const match = damageStr.match(/(\d+)d(\d+)([+-]\d+)?/i);
    if (!match) return { count: 1, sides: 6, bonus: 0 };
    return {
      count: parseInt(match[1]) || 1,
      sides: parseInt(match[2]) || 6,
      bonus: parseInt(match[3]) || 0,
    };
  };

  const {
    count: diceCount,
    sides: diceSides,
    bonus: damageBonus,
  } = parseDamage(effectiveAttack.damage);
  const diceFormula = effectiveAttack.damage;

  const rollDamage = () => {
    setIsDamageRolling(true);
    setDamageRoll(null);

    let count = 0;
    const interval = setInterval(() => {
      const tempRolls = Array.from(
        { length: diceCount },
        () => Math.floor(Math.random() * diceSides) + 1
      );
      const tempTotal = tempRolls.reduce((a, b) => a + b, 0) + damageBonus;
      setDamageRoll({
        dice: diceFormula,
        rolls: tempRolls,
        bonus: damageBonus,
        total: tempTotal,
      });
      count++;
      if (count >= 6) {
        clearInterval(interval);
        const finalRolls = Array.from(
          { length: diceCount },
          () => Math.floor(Math.random() * diceSides) + 1
        );
        const finalTotal = finalRolls.reduce((a, b) => a + b, 0) + damageBonus;
        const result = {
          dice: diceFormula,
          rolls: finalRolls,
          bonus: damageBonus,
          total: finalTotal,
        };
        setDamageRoll(result);
        setIsDamageRolling(false);
        // Save to adversary state
        onChange(adversary.id, a => ({
          ...a,
          lastDamageRoll: {
            dice: diceFormula,
            rolls: finalRolls,
            total: finalTotal,
            timestamp: Date.now(),
          },
        }));
      }
    }, 60);
  };

  // Roll dice for attack modifier if it's a dice expression
  const rollModDice = (): { value: number; str: string } => {
    if (!attackModDice)
      return {
        value: attackMod,
        str: `${attackMod >= 0 ? '+' : ''}${attackMod}`,
      };
    const absCount = Math.abs(attackModDice.count);
    const sign = attackModDice.count < 0 ? -1 : 1;
    const rolls = Array.from(
      { length: absCount },
      () => Math.floor(Math.random() * attackModDice.sides) + 1
    );
    const rollTotal =
      sign * rolls.reduce((a, b) => a + b, 0) + attackModDice.bonus;
    const diceStr = `${attackModStr} → ${rollTotal >= 0 ? '+' : ''}${rollTotal}`;
    return { value: rollTotal, str: diceStr };
  };

  const rollAttack = () => {
    setIsRolling(true);
    setAttackRoll(null);

    let count = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 20) + 1;
      const tempMod = rollModDice();
      setAttackRoll({
        roll: tempRoll,
        total: tempRoll + tempMod.value,
        modStr: tempMod.str,
      });
      count++;
      if (count >= 6) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        const finalMod = rollModDice();
        const result = {
          roll: finalRoll,
          total: finalRoll + finalMod.value,
          modStr: finalMod.str,
        };
        setAttackRoll(result);
        setIsRolling(false);
        // Save to adversary state
        onChange(adversary.id, a => ({
          ...a,
          lastAttackRoll: { ...result, timestamp: Date.now() },
        }));
      }
    }, 60);
  };

  return (
    <div
      className={cn(
        'group relative rounded-lg border p-3 transition-all',
        tierColors[source.tier] ?? 'border-border',
        isSelected && 'ring-primary ring-2',
        isSpotlight && 'shadow-lg ring-2 shadow-amber-400/20 ring-amber-400'
      )}
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <button onClick={onSelect} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-sm" title={source.role}>
              {roleIcons[source.role] ?? '⚔️'}
            </span>
            <p className="truncate font-semibold">{source.name}</p>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1">
            <Badge variant="outline" className="h-5 text-xs">
              T{source.tier} {source.role}
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={cn(
                    'h-5 text-xs',
                    adversary.difficultyOverride &&
                      'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                  )}
                >
                  <Crosshair className="mr-0.5 size-3" />
                  {effectiveDifficulty}
                  {adversary.difficultyOverride && (
                    <span className="ml-0.5 text-[10px]">*</span>
                  )}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Difficulty to hit
                {adversary.difficultyOverride &&
                  ` (modified from ${source.difficulty})`}
              </TooltipContent>
            </Tooltip>
          </div>
        </button>
        <CardActions
          isSpotlight={isSpotlight}
          onSpotlight={onSpotlight}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      </div>

      {/* Stats Row */}
      <div className="mb-2 grid grid-cols-2 gap-2">
        <StatMini
          label="HP"
          value={adversary.hp.current}
          max={adversary.hp.max}
          colorClass="text-red-600 dark:text-red-400"
          icon={<Heart className="size-3" />}
          onChange={v =>
            onChange(adversary.id, a => ({
              ...a,
              hp: { ...a.hp, current: v },
            }))
          }
        />
        <StatMini
          label="Stress"
          value={adversary.stress.current}
          max={adversary.stress.max}
          colorClass="text-purple-600 dark:text-purple-400"
          icon={<Zap className="size-3" />}
          onChange={v =>
            onChange(adversary.id, a => ({
              ...a,
              stress: { ...a.stress, current: v },
            }))
          }
        />
      </div>

      {/* Attack & Thresholds Info Bar */}
      <div className="bg-muted/50 mb-2 space-y-1 rounded-md p-1.5 text-xs">
        {/* Attack row with dice roller */}
        <div className="flex items-center justify-between gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'text-muted-foreground flex min-w-0 flex-1 items-center gap-1',
                  hasAttackOverride && 'text-blue-600 dark:text-blue-400'
                )}
              >
                <Swords className="size-3 shrink-0 text-red-500" />
                <span className="text-foreground truncate font-medium">
                  {effectiveAttack.name}
                </span>
                {hasAttackOverride && <span className="text-[10px]">*</span>}
                <span className="shrink-0">·</span>
                <span className="shrink-0">{effectiveAttack.modifier}</span>
                <span className="shrink-0">·</span>
                <span className="shrink-0">{effectiveAttack.range}</span>
                <span className="shrink-0">·</span>
                <span className="shrink-0 text-red-600 dark:text-red-400">
                  {effectiveAttack.damage}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Attack: {effectiveAttack.name} ({effectiveAttack.modifier},{' '}
              {effectiveAttack.range}, {effectiveAttack.damage})
              {hasAttackOverride && (
                <span className="block text-xs text-blue-400">Modified</span>
              )}
            </TooltipContent>
          </Tooltip>

          {/* Attack Dice Roller Button & Result */}
          <div className="flex shrink-0 items-center gap-1.5">
            {attackRoll && !isRolling && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'min-w-10 rounded px-1.5 py-0.5 text-center font-mono text-xs font-bold transition-all',
                      attackRoll.roll === 20 &&
                        'animate-pulse bg-green-500 text-white',
                      attackRoll.roll === 1 &&
                        'animate-pulse bg-red-500 text-white',
                      attackRoll.roll !== 20 &&
                        attackRoll.roll !== 1 &&
                        'bg-primary/20 text-primary'
                    )}
                  >
                    {attackRoll.total}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div className="font-mono">
                      🎲 {attackRoll.roll} ({attackRoll.modStr}) ={' '}
                      {attackRoll.total}
                    </div>
                    {attackRoll.roll === 20 && (
                      <div className="font-bold text-green-400">CRITICAL!</div>
                    )}
                    {attackRoll.roll === 1 && (
                      <div className="font-bold text-red-400">Fumble!</div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={rollAttack}
                  disabled={isRolling}
                >
                  <Dices
                    className={cn(
                      'size-4 text-red-500',
                      isRolling && 'animate-spin'
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Roll attack (d20{attackMod >= 0 ? '+' : ''}
                {attackMod})
              </TooltipContent>
            </Tooltip>

            {/* Damage Dice Roller */}
            {damageRoll && !isDamageRolling && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'min-w-10 rounded px-1.5 py-0.5 text-center font-mono text-xs font-bold transition-all',
                      'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                    )}
                  >
                    {damageRoll.total}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <div className="font-mono">
                      🎲 [{damageRoll.rolls.join(', ')}]{' '}
                      {damageRoll.bonus !== 0
                        ? (damageRoll.bonus > 0 ? '+' : '') + damageRoll.bonus
                        : ''}{' '}
                      = {damageRoll.total}
                    </div>
                    <div className="text-xs text-orange-400">
                      Damage ({damageRoll.dice})
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={rollDamage}
                  disabled={isDamageRolling}
                >
                  <Dices
                    className={cn(
                      'size-4 text-orange-500',
                      isDamageRolling && 'animate-spin'
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Roll damage ({effectiveAttack.damage})
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'text-muted-foreground flex items-center gap-1',
                hasThresholdsOverride && 'text-blue-600 dark:text-blue-400'
              )}
            >
              <Shield className="size-3 text-blue-500" />
              <span>Thresholds:</span>
              <span className="text-yellow-600 dark:text-yellow-400">
                {typeof effectiveThresholds === 'string'
                  ? effectiveThresholds
                  : effectiveThresholds.major}
              </span>
              {typeof effectiveThresholds !== 'string' && (
                <>
                  <span>/</span>
                  <span className="text-red-600 dark:text-red-400">
                    {effectiveThresholds.severe}
                  </span>
                  {effectiveThresholds.massive && (
                    <>
                      <span>/</span>
                      <span className="text-purple-600 dark:text-purple-400">
                        {effectiveThresholds.massive}
                      </span>
                    </>
                  )}
                </>
              )}
              {hasThresholdsOverride && <span className="text-[10px]">*</span>}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            Major / Severe
            {typeof effectiveThresholds !== 'string' &&
            effectiveThresholds.massive
              ? ' / Massive'
              : ''}{' '}
            damage thresholds
            {hasThresholdsOverride && (
              <span className="block text-xs text-blue-400">Modified</span>
            )}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Features Tooltip */}
      {effectiveFeatures.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'mb-2 cursor-help rounded-md border border-purple-500/20 bg-purple-500/10 p-1.5 text-xs',
                hasFeaturesOverride && 'border-blue-500/30'
              )}
            >
              <div className="flex items-center gap-1 text-purple-700 dark:text-purple-400">
                <Zap className="size-3" />
                <span className="font-medium">
                  {effectiveFeatures.length} Features
                </span>
                {hasFeaturesOverride && (
                  <span className="text-[10px] text-blue-400">*</span>
                )}
                <span className="text-muted-foreground ml-1">
                  · hover for details
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-sm p-3">
            <div className="space-y-2">
              {effectiveFeatures.map((feature, idx) => {
                // Handle string, object features, or AdversaryFeatureOverride
                const isString = typeof feature === 'string';
                const isOverride = !isString && 'id' in feature;
                const name = isString ? feature : feature.name;
                const type = isString ? null : feature.type;
                const description = isString ? '' : feature.description;
                const isCustom =
                  isOverride && (feature as { isCustom?: boolean }).isCustom;

                return (
                  <div key={idx} className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          'rounded px-1 text-[10px] font-medium',
                          type === 'Passive' &&
                            'bg-gray-500/20 text-gray-600 dark:text-gray-400',
                          type === 'Action' &&
                            'bg-green-500/20 text-green-600 dark:text-green-400',
                          type === 'Reaction' &&
                            'bg-blue-500/20 text-blue-600 dark:text-blue-400',
                          !type &&
                            'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                        )}
                      >
                        {type || 'Feature'}
                      </span>
                      <span className="font-semibold">{name}</span>
                      {isCustom && (
                        <span className="rounded bg-blue-500/20 px-1 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                          Custom
                        </span>
                      )}
                    </div>
                    {description && (
                      <p className="text-muted-foreground mt-0.5 leading-snug">
                        {description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </TooltipContent>
        </Tooltip>
      )}

      <QuickDamageButtons adversary={adversary} onChange={onChange} />
    </div>
  );
}

function QuickDamageButtons({
  adversary,
  onChange,
}: {
  adversary: AdversaryTracker;
  onChange: (id: string, fn: (a: AdversaryTracker) => AdversaryTracker) => void;
}) {
  return (
    <div className="mt-2 flex gap-1">
      <Button
        size="sm"
        variant="outline"
        className="h-7 flex-1 text-xs"
        onClick={() =>
          onChange(adversary.id, a => ({
            ...a,
            hp: { ...a.hp, current: Math.max(0, a.hp.current - 1) },
          }))
        }
      >
        -1 HP
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-7 flex-1 text-xs"
        onClick={() =>
          onChange(adversary.id, a => ({
            ...a,
            hp: { ...a.hp, current: Math.max(0, a.hp.current - 5) },
          }))
        }
      >
        -5 HP
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-7 flex-1 text-xs"
        onClick={() =>
          onChange(adversary.id, a => ({
            ...a,
            stress: { ...a.stress, current: Math.max(0, a.stress.current - 1) },
          }))
        }
      >
        -1 Str
      </Button>
    </div>
  );
}

export function EnvironmentCard({
  environment,
  isSelected,
  isSpotlight,
  onSelect,
  onRemove,
  onSpotlight,
  onChange,
  onEdit,
}: {
  environment: EnvironmentTracker;
  isSelected: boolean;
  isSpotlight: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onSpotlight: () => void;
  onChange: (
    id: string,
    fn: (e: EnvironmentTracker) => EnvironmentTracker
  ) => void;
  onEdit?: () => void;
}) {
  const source = environment.source;
  const activeFeatures = environment.features.filter(f => f.active).length;
  const countdown = environment.countdown ?? 0;

  const tierColors: Record<string, string> = {
    '1': 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
    '2': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
    '3': 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30',
    '4': 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
  };

  const typeIcons: Record<string, string> = {
    Wilderness: '🌲',
    Urban: '🏛️',
    Dungeon: '🏰',
    Supernatural: '✨',
    Aquatic: '🌊',
    Social: '💬',
  };

  return (
    <div
      className={cn(
        'group relative rounded-lg border p-3 transition-all',
        tierColors[source.tier] ?? 'border-border',
        isSelected && 'ring-primary ring-2',
        isSpotlight && 'shadow-lg ring-2 shadow-amber-400/20 ring-amber-400'
      )}
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <button onClick={onSelect} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-sm" title={source.type}>
              {typeIcons[source.type] ?? <TreePine className="size-3" />}
            </span>
            <p className="truncate font-semibold">{source.name}</p>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1">
            <Badge variant="outline" className="h-5 text-xs">
              T{source.tier}
            </Badge>
            <Badge variant="outline" className="h-5 text-xs">
              <MapPin className="mr-0.5 size-3" />
              {source.type}
            </Badge>
          </div>
        </button>
        <CardActions
          isSpotlight={isSpotlight}
          onSpotlight={onSpotlight}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      </div>

      {/* Features & Impulses Summary */}
      <div className="bg-muted/50 mb-2 space-y-1 rounded-md p-1.5 text-xs">
        <div className="text-muted-foreground flex items-center gap-1">
          <Zap className="size-3 text-purple-500" />
          <span className="text-foreground font-medium">
            {activeFeatures}/{environment.features.length}
          </span>
          <span>features active</span>
        </div>
        {source.impulses && source.impulses.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-muted-foreground flex items-center gap-1 truncate">
                <Sparkles className="size-3 shrink-0 text-amber-500" />
                <span className="truncate">
                  {source.impulses.slice(0, 2).join(', ')}
                </span>
                {source.impulses.length > 2 && (
                  <span>+{source.impulses.length - 2}</span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Impulses: {source.impulses.join(', ')}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <CountdownControl
        value={countdown}
        onChange={v => onChange(environment.id, e => ({ ...e, countdown: v }))}
      />
    </div>
  );
}

function CardActions({
  isSpotlight,
  onSpotlight,
  onRemove,
  onEdit,
}: {
  isSpotlight: boolean;
  onSpotlight: () => void;
  onRemove: () => void;
  onEdit?: () => void;
}) {
  return (
    <div className="flex gap-1">
      {isSpotlight && (
        <Badge variant="secondary" className="text-xs">
          ★
        </Badge>
      )}
      <Button
        size="icon"
        variant="ghost"
        className={cn('size-6', isSpotlight && 'text-amber-500')}
        onClick={onSpotlight}
        title="Set spotlight"
      >
        <Sparkles className="size-3" />
      </Button>
      {onEdit && (
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          onClick={onEdit}
          title="Edit"
        >
          <Pencil className="size-3" />
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        className="text-destructive size-6"
        onClick={onRemove}
      >
        <X className="size-3" />
      </Button>
    </div>
  );
}
