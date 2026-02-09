import {
  Check,
  Crosshair,
  Dices,
  Heart,
  MapPin,
  Pencil,
  Shield,
  Sparkles,
  Star,
  Swords,
  TreePine,
  X,
  Zap,
} from 'lucide-react';
import {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { normalizeMinusSigns } from '@/lib/utils';
import { cn } from '@/lib/utils';

import {
  type EffectiveThresholds,
  getEffectiveAdversaryAttack,
  getEffectiveAdversaryFeatures,
  getEffectiveAdversaryThresholds,
} from './adversary-effective-values';
import { CountdownControl, StatMini } from './stat-controls';
import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
} from './types';
import { parseFearCost } from './utils';

// ============== Dice Parsing Utilities ==============

interface DiceExpression {
  count: number;
  sides: number;
  bonus: number;
}

/** Parse dice expression (e.g., "2d6+3" or "1d8" or "+2d4") */
function parseDiceExpression(expr: string | number): DiceExpression | null {
  if (typeof expr === 'number') return null;
  const match = String(expr).match(/([+-]?)(\d+)d(\d+)([+-]\d+)?/i);
  if (!match) return null;
  const sign = match[1] === '-' ? -1 : 1;
  return {
    count: sign * (parseInt(match[2]) || 1),
    sides: parseInt(match[3]) || 6,
    bonus: parseInt(match[4]) || 0,
  };
}

/** Parse damage dice (e.g., "2d6+3" or "1d8" or "3d6-1") */
function parseDamage(damageStr: string): DiceExpression {
  const match = damageStr.match(/(\d+)d(\d+)([+-]\d+)?/i);
  if (!match) return { count: 1, sides: 6, bonus: 0 };
  return {
    count: parseInt(match[1]) || 1,
    sides: parseInt(match[2]) || 6,
    bonus: parseInt(match[3]) || 0,
  };
}

/** Roll multiple dice of given sides */
function rollDice(count: number, sides: number): number[] {
  return Array.from(
    { length: count },
    () => Math.floor(Math.random() * sides) + 1
  );
}

/** Resolve a flat numeric attack modifier from a potentially complex expression */
function resolveAttackMod(
  modifier: string | number,
  modDice: DiceExpression | null
): number {
  if (modDice) return 0;
  if (typeof modifier === 'number') return modifier;
  return (
    parseInt(
      normalizeMinusSigns(String(modifier).replace(/[^\u2212\-\d]/g, ''))
    ) || 0
  );
}

/** Roll modifier dice (or format flat modifier) and return value + display string */
function computeModDiceRoll(
  modDice: DiceExpression | null,
  attackMod: number,
  attackModStr: string
): { value: number; str: string } {
  if (!modDice) {
    return {
      value: attackMod,
      str: `${attackMod >= 0 ? '+' : ''}${attackMod}`,
    };
  }
  const absCount = Math.abs(modDice.count);
  const sign = modDice.count < 0 ? -1 : 1;
  const rolls = rollDice(absCount, modDice.sides);
  const rollTotal = sign * rolls.reduce((a, b) => a + b, 0) + modDice.bonus;
  return {
    value: rollTotal,
    str: `${attackModStr} → ${rollTotal >= 0 ? '+' : ''}${rollTotal}`,
  };
}

/** Build a single damage roll result */
function buildDamageRollResult(
  diceCount: number,
  diceSides: number,
  damageBonus: number,
  diceFormula: string
): DamageRollResult {
  const rolls = rollDice(diceCount, diceSides);
  const total = rolls.reduce((a, b) => a + b, 0) + damageBonus;
  return { dice: diceFormula, rolls, bonus: damageBonus, total };
}

/** Build a single attack roll result (d20 + modifier) */
function buildAttackRollResult(
  modDice: DiceExpression | null,
  attackMod: number,
  attackModStr: string
): AttackRollResult {
  const roll = Math.floor(Math.random() * 20) + 1;
  const mod = computeModDiceRoll(modDice, attackMod, attackModStr);
  return { roll, total: roll + mod.value, modStr: mod.str };
}

/** Restore a persisted attack roll as initial state */
function initAttackRoll(
  adversary: AdversaryTracker,
  sourceAttackModifier: AdversaryTracker['source']['attack']['modifier']
): AttackRollResult | null {
  if (!adversary.lastAttackRoll) return null;
  return {
    roll: adversary.lastAttackRoll.roll,
    total: adversary.lastAttackRoll.total,
    modStr: String(adversary.attackOverride?.modifier ?? sourceAttackModifier),
  };
}

/** Restore a persisted damage roll as initial state */
function initDamageRoll(adversary: AdversaryTracker): DamageRollResult | null {
  if (!adversary.lastDamageRoll) return null;
  return {
    dice: adversary.lastDamageRoll.dice,
    rolls: adversary.lastDamageRoll.rolls,
    bonus: 0,
    total: adversary.lastDamageRoll.total,
  };
}

// ============== Style Constants ==============

const TIER_COLORS: Record<string, string> = {
  '1': 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
  '2': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  '3': 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30',
  '4': 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
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
  Wilderness: '🌲',
  Urban: '🏛️',
  Dungeon: '🏰',
  Supernatural: '✨',
  Aquatic: '🌊',
  Social: '💬',
};

// ============== Dice Roll Display Components ==============

interface AttackRollResult {
  roll: number;
  total: number;
  modStr: string;
}

interface DamageRollResult {
  dice: string;
  rolls: number[];
  bonus: number;
  total: number;
}

function AttackRollDisplay({ result }: { result: AttackRollResult }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'min-w-10 rounded px-1.5 py-0.5 text-center font-mono text-xs font-bold transition-all',
            result.roll === 20 && 'animate-pulse bg-green-500 text-white',
            result.roll === 1 && 'animate-pulse bg-red-500 text-white',
            result.roll !== 20 &&
              result.roll !== 1 &&
              'bg-primary/20 text-primary'
          )}
        >
          {result.total}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-center">
          <div className="font-mono">
            🎲 {result.roll} ({result.modStr}) = {result.total}
          </div>
          {result.roll === 20 && (
            <div className="font-bold text-green-400">CRITICAL!</div>
          )}
          {result.roll === 1 && (
            <div className="font-bold text-red-400">Fumble!</div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function DamageRollDisplay({ result }: { result: DamageRollResult }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="min-w-10 rounded bg-orange-500/20 px-1.5 py-0.5 text-center font-mono text-xs font-bold text-orange-600 transition-all dark:text-orange-400">
          {result.total}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-center">
          <div className="font-mono">
            🎲 [{result.rolls.join(', ')}]{' '}
            {result.bonus !== 0
              ? (result.bonus > 0 ? '+' : '') + result.bonus
              : ''}{' '}
            = {result.total}
          </div>
          <div className="text-xs text-orange-400">Damage ({result.dice})</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// ============== Feature Item Display ==============

const FEATURE_TYPE_STYLES: Record<string, string> = {
  Passive: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
  Action: 'bg-green-500/20 text-green-600 dark:text-green-400',
  Reaction: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
};

function FeatureItem({
  feature,
}: {
  feature:
    | string
    | {
        name: string;
        type?: string;
        description?: string;
        id?: string;
        isCustom?: boolean;
      };
}) {
  const isString = typeof feature === 'string';
  const name = isString ? feature : feature.name;
  const type = isString ? null : feature.type;
  const description = isString ? '' : feature.description;
  const isCustom = !isString && 'isCustom' in feature && feature.isCustom;

  // Detect fear cost from description
  const fearCost = description ? parseFearCost(description) : 0;

  return (
    <div className="text-xs">
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            'rounded px-1 text-[10px] font-medium',
            type
              ? FEATURE_TYPE_STYLES[type]
              : 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
          )}
        >
          {type || 'Feature'}
        </span>
        <span className="font-semibold">{name}</span>
        {fearCost > 0 && (
          <span className="rounded bg-purple-600/20 px-1 text-[10px] font-medium text-purple-500">
            💀 {fearCost}
          </span>
        )}
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
}

// ============== Helper Sub-Components ==============

function StatBadge({
  icon,
  value,
  tooltip,
  className,
}: {
  icon: ReactNode;
  value: ReactNode;
  tooltip: ReactNode;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={cn('h-5 text-xs', className)}>
          {icon}
          {value}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

// ============== Effective Adversary Values ==============

function useEffectiveAdversaryValues(adversary: AdversaryTracker) {
  return useMemo(() => {
    const source = adversary.source;
    const attack = getEffectiveAdversaryAttack(adversary);
    const thresholds = getEffectiveAdversaryThresholds(adversary);
    const features = getEffectiveAdversaryFeatures(adversary);
    return {
      difficulty: adversary.difficultyOverride ?? source.difficulty,
      hasDifficultyOverride: !!adversary.difficultyOverride,
      attack,
      hasAttackOverride: !!adversary.attackOverride,
      thresholds,
      hasThresholdsOverride: !!adversary.thresholdsOverride,
      features,
      hasFeaturesOverride: !!adversary.featuresOverride,
    };
  }, [adversary]);
}

function ThresholdsDisplay({
  thresholds,
  hasOverride,
  useMassive,
}: {
  thresholds: string | EffectiveThresholds;
  hasOverride: boolean;
  useMassive?: boolean;
}) {
  const isString = typeof thresholds === 'string';
  const formatValue = (value: number | null | undefined) => value ?? '—';
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'text-muted-foreground flex items-center gap-1',
            hasOverride && 'text-blue-600 dark:text-blue-400'
          )}
        >
          <Shield className="size-3 text-blue-500" />
          <span>Thresholds:</span>
          <span className="text-yellow-600 dark:text-yellow-400">
            {isString ? thresholds : formatValue(thresholds.major)}
          </span>
          {!isString && (
            <>
              <span>/</span>
              <span className="text-red-600 dark:text-red-400">
                {formatValue(thresholds.severe)}
              </span>
              {useMassive && thresholds.massive != null && (
                <>
                  <span>/</span>
                  <span className="text-purple-600 dark:text-purple-400">
                    {formatValue(thresholds.massive)}
                  </span>
                </>
              )}
            </>
          )}
          {hasOverride && <span className="text-[10px]">*</span>}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Major / Severe
        {useMassive && !isString && thresholds.massive ? ' / Massive' : ''}{' '}
        damage thresholds
        {hasOverride && (
          <span className="block text-xs text-blue-400">Modified</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

export const CharacterCard = memo(function CharacterCard({
  character,
  isSelected,
  isSpotlight,
  useMassiveThreshold,
  onSelect,
  onRemove,
  onSpotlight,
  onChange,
}: {
  character: CharacterTracker;
  isSelected: boolean;
  isSpotlight: boolean;
  useMassiveThreshold?: boolean;
  onSelect: (character: CharacterTracker) => void;
  onRemove: (character: CharacterTracker) => void;
  onSpotlight: (character: CharacterTracker) => void;
  onChange: (id: string, fn: (c: CharacterTracker) => CharacterTracker) => void;
}) {
  // Linked characters are read-only (stats sync from player)
  const isReadOnly = character.isLinkedCharacter === true;

  const handleSelectClick = useCallback(
    () => onSelect(character),
    [onSelect, character]
  );
  const handleRemoveClick = useCallback(
    () => onRemove(character),
    [onRemove, character]
  );
  const handleSpotlightClick = useCallback(
    () => onSpotlight(character),
    [onSpotlight, character]
  );

  const handleHpChange = useCallback(
    (v: number) =>
      onChange(character.id, c => ({ ...c, hp: { ...c.hp, current: v } })),
    [character.id, onChange]
  );

  const handleStressChange = useCallback(
    (v: number) =>
      onChange(character.id, c => ({
        ...c,
        stress: { ...c.stress, current: v },
      })),
    [character.id, onChange]
  );

  return (
    <div
      className={cn(
        'group relative rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 transition-all',
        isSelected && 'ring-primary ring-2',
        isSpotlight && 'shadow-lg ring-2 shadow-amber-400/20 ring-amber-400'
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <button
          onClick={handleSelectClick}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{isReadOnly ? '👤' : '🧙'}</span>
            <p className="truncate font-semibold">{character.name}</p>
            {isReadOnly && (
              <Badge variant="secondary" className="ml-1 text-[10px]">
                Live
              </Badge>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            <StatBadge
              icon={<Shield className="mr-0.5 size-3" />}
              value={character.evasion ?? '—'}
              tooltip="Evasion (Difficulty to hit)"
            />
            {character.armorScore !== undefined && character.armorScore > 0 && (
              <StatBadge
                icon={<Shield className="mr-0.5 size-3" />}
                value={
                  character.armorSlots
                    ? `${character.armorSlots.current}/${character.armorSlots.max}`
                    : character.armorScore
                }
                tooltip="Armor Slots (Current / Max)"
                className="border-yellow-500/50 text-yellow-600 dark:text-yellow-400"
              />
            )}
            {character.thresholds && (
              <StatBadge
                icon={<Crosshair className="mr-0.5 size-3" />}
                value={
                  <>
                    {character.thresholds.major}/{character.thresholds.severe}
                    {useMassiveThreshold &&
                      character.thresholds.massive &&
                      `/${character.thresholds.massive}`}
                  </>
                }
                tooltip={`Thresholds (Major / Severe${useMassiveThreshold ? ' / Massive' : ''})`}
                className="border-orange-500/50 text-orange-600 dark:text-orange-400"
              />
            )}
            {character.hope && (
              <StatBadge
                icon={<Star className="mr-0.5 size-3" />}
                value={`${character.hope.current}/${character.hope.max}`}
                tooltip="Hope (Current / Max)"
                className="border-amber-500/50 text-amber-600 dark:text-amber-400"
              />
            )}
          </div>
        </button>
        <CardActions
          isSpotlight={isSpotlight}
          onSpotlight={handleSpotlightClick}
          onRemove={handleRemoveClick}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <StatMini
          label="HP"
          value={character.hp.current}
          max={character.hp.max}
          colorClass="text-red-600 dark:text-red-400"
          icon={<Heart className="size-3" />}
          readOnly={isReadOnly}
          onChange={handleHpChange}
        />
        <StatMini
          label="Stress"
          value={character.stress.current}
          max={character.stress.max}
          colorClass="text-purple-600 dark:text-purple-400"
          icon={<Zap className="size-3" />}
          readOnly={isReadOnly}
          onChange={handleStressChange}
        />
      </div>
    </div>
  );
});

interface AdversaryRollState {
  attackMod: number;
  isRolling: boolean;
  isDamageRolling: boolean;
  attackRoll: AttackRollResult | null;
  damageRoll: DamageRollResult | null;
  rollAttackAction: () => void;
  rollDamageAction: () => void;
}

function useAdversaryRollState({
  adversary,
  effectiveAttack,
  sourceAttackModifier,
  onChange,
}: {
  adversary: AdversaryTracker;
  effectiveAttack: AdversaryTracker['source']['attack'];
  sourceAttackModifier: AdversaryTracker['source']['attack']['modifier'];
  onChange: (id: string, fn: (a: AdversaryTracker) => AdversaryTracker) => void;
}): AdversaryRollState {
  const attackModStr = String(effectiveAttack.modifier);
  const attackModDice = parseDiceExpression(effectiveAttack.modifier);
  const attackMod = resolveAttackMod(effectiveAttack.modifier, attackModDice);

  const {
    count: diceCount,
    sides: diceSides,
    bonus: damageBonus,
  } = parseDamage(effectiveAttack.damage);
  const diceFormula = effectiveAttack.damage;

  const [isRolling, setIsRolling] = useState(false);
  const [attackRoll, setAttackRoll] = useState<AttackRollResult | null>(
    initAttackRoll(adversary, sourceAttackModifier)
  );

  const [isDamageRolling, setIsDamageRolling] = useState(false);
  const [damageRoll, setDamageRoll] = useState<DamageRollResult | null>(
    initDamageRoll(adversary)
  );

  // Refs to store interval IDs for cleanup
  const attackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const damageIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (attackIntervalRef.current) clearInterval(attackIntervalRef.current);
      if (damageIntervalRef.current) clearInterval(damageIntervalRef.current);
    };
  }, []);

  const rollDamageAction = useCallback(() => {
    // Clear any existing interval
    if (damageIntervalRef.current) clearInterval(damageIntervalRef.current);

    setIsDamageRolling(true);
    setDamageRoll(null);

    let count = 0;
    damageIntervalRef.current = setInterval(() => {
      setDamageRoll(
        buildDamageRollResult(diceCount, diceSides, damageBonus, diceFormula)
      );
      count++;
      if (count >= 6) {
        clearInterval(damageIntervalRef.current!);
        damageIntervalRef.current = null;
        const finalResult = buildDamageRollResult(
          diceCount,
          diceSides,
          damageBonus,
          diceFormula
        );
        setDamageRoll(finalResult);
        setIsDamageRolling(false);
        onChange(adversary.id, a => ({
          ...a,
          lastDamageRoll: {
            dice: finalResult.dice,
            rolls: finalResult.rolls,
            total: finalResult.total,
            timestamp: Date.now(),
          },
        }));
      }
    }, 60);
  }, [diceCount, diceSides, damageBonus, diceFormula, adversary.id, onChange]);

  const rollAttackAction = useCallback(() => {
    // Clear any existing interval
    if (attackIntervalRef.current) clearInterval(attackIntervalRef.current);

    setIsRolling(true);
    setAttackRoll(null);

    let count = 0;
    attackIntervalRef.current = setInterval(() => {
      setAttackRoll(
        buildAttackRollResult(attackModDice, attackMod, attackModStr)
      );
      count++;
      if (count >= 6) {
        clearInterval(attackIntervalRef.current!);
        attackIntervalRef.current = null;
        const result = buildAttackRollResult(
          attackModDice,
          attackMod,
          attackModStr
        );
        setAttackRoll(result);
        setIsRolling(false);
        onChange(adversary.id, a => ({
          ...a,
          lastAttackRoll: { ...result, timestamp: Date.now() },
        }));
      }
    }, 60);
  }, [attackModDice, attackMod, attackModStr, adversary.id, onChange]);

  return {
    attackMod,
    isRolling,
    isDamageRolling,
    attackRoll,
    damageRoll,
    rollAttackAction,
    rollDamageAction,
  };
}

function AdversaryHeader({
  source,
  isSpotlight,
  effectiveDifficulty,
  hasDifficultyOverride,
  effectiveThresholds,
  hasThresholdsOverride,
  useMassiveThreshold,
  onSelect,
  onSpotlight,
  onRemove,
  onEdit,
}: {
  source: AdversaryTracker['source'];
  isSpotlight: boolean;
  effectiveDifficulty: number;
  hasDifficultyOverride: boolean;
  effectiveThresholds: string | EffectiveThresholds;
  hasThresholdsOverride: boolean;
  useMassiveThreshold?: boolean;
  onSelect: () => void;
  onSpotlight: () => void;
  onRemove: () => void;
  onEdit?: () => void;
}) {
  const formatThreshold = (value: number | null | undefined) => value ?? '—';
  const isStringThresholds = typeof effectiveThresholds === 'string';

  return (
    <div className="mb-2 flex items-start justify-between gap-2">
      <button onClick={onSelect} className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-sm" title={source.role}>
            {ROLE_ICONS[source.role] ?? '⚔️'}
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
                  hasDifficultyOverride &&
                    'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                )}
              >
                <Crosshair className="mr-0.5 size-3" />
                {effectiveDifficulty}
                {hasDifficultyOverride && (
                  <span className="ml-0.5 text-[10px]">*</span>
                )}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Difficulty to hit
              {hasDifficultyOverride && ` (modified from ${source.difficulty})`}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={cn(
                  'h-5 border-orange-500/50 text-xs text-orange-600 dark:text-orange-400',
                  hasThresholdsOverride && 'bg-blue-500/20'
                )}
              >
                <Shield className="mr-0.5 size-3" />
                {isStringThresholds
                  ? effectiveThresholds
                  : `${formatThreshold(effectiveThresholds.major)}/${formatThreshold(effectiveThresholds.severe)}${useMassiveThreshold && effectiveThresholds.massive != null ? `/${formatThreshold(effectiveThresholds.massive)}` : ''}`}
                {hasThresholdsOverride && (
                  <span className="ml-0.5 text-[10px]">*</span>
                )}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Thresholds (Major / Severe
              {useMassiveThreshold ? ' / Massive' : ''})
              {hasThresholdsOverride && (
                <span className="block text-xs text-blue-400">Modified</span>
              )}
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
  );
}

function AdversaryStatsRow({
  adversary,
  onChange,
}: {
  adversary: AdversaryTracker;
  onChange: (id: string, fn: (a: AdversaryTracker) => AdversaryTracker) => void;
}) {
  return (
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
  );
}

function AdversaryAttackBar({
  effectiveAttack,
  hasAttackOverride,
  hasThresholdsOverride,
  effectiveThresholds,
  useMassiveThreshold,
  attackRoll,
  damageRoll,
  isRolling,
  isDamageRolling,
  rollAttackAction,
  rollDamageAction,
  attackMod,
}: {
  effectiveAttack: AdversaryTracker['source']['attack'];
  hasAttackOverride: boolean;
  hasThresholdsOverride: boolean;
  effectiveThresholds: AdversaryTracker['source']['thresholds'];
  useMassiveThreshold?: boolean;
  attackRoll: AttackRollResult | null;
  damageRoll: DamageRollResult | null;
  isRolling: boolean;
  isDamageRolling: boolean;
  rollAttackAction: () => void;
  rollDamageAction: () => void;
  attackMod: number;
}) {
  return (
    <div className="bg-muted/50 mb-2 space-y-1 rounded-md p-1.5 text-xs">
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

        <div className="flex shrink-0 items-center gap-1.5">
          {attackRoll && !isRolling && (
            <AttackRollDisplay result={attackRoll} />
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={rollAttackAction}
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

          {damageRoll && !isDamageRolling && (
            <DamageRollDisplay result={damageRoll} />
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={rollDamageAction}
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
      <ThresholdsDisplay
        thresholds={effectiveThresholds}
        hasOverride={hasThresholdsOverride}
        useMassive={useMassiveThreshold}
      />
    </div>
  );
}

function AdversaryFeaturesTooltip({
  features,
  hasOverride,
}: {
  features: AdversaryTracker['source']['features'];
  hasOverride: boolean;
}) {
  if (features.length === 0) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'mb-2 cursor-help rounded-md border border-purple-500/20 bg-purple-500/10 p-1.5 text-xs',
            hasOverride && 'border-blue-500/30'
          )}
        >
          <div className="flex items-center gap-1 text-purple-700 dark:text-purple-400">
            <Zap className="size-3" />
            <span className="font-medium">{features.length} Features</span>
            {hasOverride && (
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
          {features.map((feature, idx) => (
            <FeatureItem key={idx} feature={feature} />
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function AdversaryActionFooter({
  countdown,
  countdownEnabled,
  hasActedThisRound,
  onCountdownChange,
  onCountdownEnabledChange,
  onToggleActed,
}: {
  countdown: number;
  countdownEnabled: boolean;
  hasActedThisRound: boolean;
  onCountdownChange: (v: number) => void;
  onCountdownEnabledChange: (enabled: boolean) => void;
  onToggleActed: () => void;
}) {
  return (
    <>
      <CountdownControl
        value={countdown}
        enabled={countdownEnabled}
        onChange={onCountdownChange}
        onEnabledChange={onCountdownEnabledChange}
      />
      <div className="mt-2 flex items-center">
        <Button
          size="sm"
          variant={hasActedThisRound ? 'secondary' : 'outline'}
          className={cn(
            'h-7 gap-1.5 text-xs',
            hasActedThisRound &&
              'border-green-500/50 bg-green-500/20 text-green-700 dark:text-green-400'
          )}
          onClick={onToggleActed}
        >
          <Check className="size-3" />
          {hasActedThisRound ? 'Acted' : 'Mark acted'}
        </Button>
      </div>
    </>
  );
}

export const AdversaryCard = memo(function AdversaryCard({
  adversary,
  isSelected,
  isSpotlight,
  useMassiveThreshold,
  onSelect,
  onRemove,
  onSpotlight,
  onChange,
  onEdit,
}: {
  adversary: AdversaryTracker;
  isSelected: boolean;
  isSpotlight: boolean;
  useMassiveThreshold?: boolean;
  onSelect: (adversary: AdversaryTracker) => void;
  onRemove: (adversary: AdversaryTracker) => void;
  onSpotlight: (adversary: AdversaryTracker) => void;
  onChange: (id: string, fn: (a: AdversaryTracker) => AdversaryTracker) => void;
  onEdit?: (adversary: AdversaryTracker) => void;
}) {
  const source = adversary.source;
  const countdown = adversary.countdown ?? 0;
  const {
    difficulty: effectiveDifficulty,
    hasDifficultyOverride,
    attack: effectiveAttack,
    hasAttackOverride,
    thresholds: effectiveThresholds,
    hasThresholdsOverride,
    features: effectiveFeatures,
    hasFeaturesOverride,
  } = useEffectiveAdversaryValues(adversary);
  const rollState = useAdversaryRollState({
    adversary,
    effectiveAttack,
    sourceAttackModifier: source.attack.modifier,
    onChange,
  });

  const handleSelectClick = useCallback(
    () => onSelect(adversary),
    [onSelect, adversary]
  );
  const handleRemoveClick = useCallback(
    () => onRemove(adversary),
    [onRemove, adversary]
  );
  const handleSpotlightClick = useCallback(
    () => onSpotlight(adversary),
    [onSpotlight, adversary]
  );
  const handleEditClick = useCallback(
    () => onEdit?.(adversary),
    [onEdit, adversary]
  );

  const handleCountdownChange = useCallback(
    (v: number) => onChange(adversary.id, a => ({ ...a, countdown: v })),
    [adversary.id, onChange]
  );

  const handleCountdownEnabledChange = useCallback(
    (enabled: boolean) =>
      onChange(adversary.id, a => ({ ...a, countdownEnabled: enabled })),
    [adversary.id, onChange]
  );

  const handleToggleActed = useCallback(
    () =>
      onChange(adversary.id, a => ({
        ...a,
        hasActedThisRound: !a.hasActedThisRound,
      })),
    [adversary.id, onChange]
  );

  return (
    <div
      className={cn(
        'group relative rounded-lg border p-3 transition-all',
        TIER_COLORS[source.tier] ?? 'border-border',
        isSelected && 'ring-primary ring-2',
        isSpotlight && 'shadow-lg ring-2 shadow-amber-400/20 ring-amber-400',
        adversary.hasActedThisRound && 'opacity-50'
      )}
    >
      <AdversaryHeader
        source={source}
        isSpotlight={isSpotlight}
        effectiveDifficulty={effectiveDifficulty}
        hasDifficultyOverride={hasDifficultyOverride}
        effectiveThresholds={effectiveThresholds}
        hasThresholdsOverride={hasThresholdsOverride}
        useMassiveThreshold={useMassiveThreshold}
        onSelect={handleSelectClick}
        onSpotlight={handleSpotlightClick}
        onRemove={handleRemoveClick}
        onEdit={onEdit ? handleEditClick : undefined}
      />
      <AdversaryStatsRow adversary={adversary} onChange={onChange} />
      <AdversaryAttackBar
        effectiveAttack={effectiveAttack}
        hasAttackOverride={hasAttackOverride}
        hasThresholdsOverride={hasThresholdsOverride}
        effectiveThresholds={effectiveThresholds}
        useMassiveThreshold={useMassiveThreshold}
        attackRoll={rollState.attackRoll}
        damageRoll={rollState.damageRoll}
        isRolling={rollState.isRolling}
        isDamageRolling={rollState.isDamageRolling}
        rollAttackAction={rollState.rollAttackAction}
        rollDamageAction={rollState.rollDamageAction}
        attackMod={rollState.attackMod}
      />
      <AdversaryFeaturesTooltip
        features={effectiveFeatures}
        hasOverride={hasFeaturesOverride}
      />
      <AdversaryActionFooter
        countdown={countdown}
        countdownEnabled={adversary.countdownEnabled ?? false}
        hasActedThisRound={adversary.hasActedThisRound ?? false}
        onCountdownChange={handleCountdownChange}
        onCountdownEnabledChange={handleCountdownEnabledChange}
        onToggleActed={handleToggleActed}
      />
    </div>
  );
});

export const EnvironmentCard = memo(function EnvironmentCard({
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

  const handleCountdownChange = useCallback(
    (v: number) => onChange(environment.id, e => ({ ...e, countdown: v })),
    [environment.id, onChange]
  );

  const handleCountdownEnabledChange = useCallback(
    (enabled: boolean) =>
      onChange(environment.id, e => ({ ...e, countdownEnabled: enabled })),
    [environment.id, onChange]
  );

  return (
    <div
      className={cn(
        'group relative rounded-lg border p-3 transition-all',
        TIER_COLORS[source.tier] ?? 'border-border',
        isSelected && 'ring-primary ring-2',
        isSpotlight && 'shadow-lg ring-2 shadow-amber-400/20 ring-amber-400'
      )}
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <button onClick={onSelect} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-sm" title={source.type}>
              {TYPE_ICONS[source.type] ?? <TreePine className="size-3" />}
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
        enabled={environment.countdownEnabled ?? false}
        onChange={handleCountdownChange}
        onEnabledChange={handleCountdownEnabledChange}
      />
    </div>
  );
});

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
        aria-label="Set spotlight"
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
          aria-label="Edit"
        >
          <Pencil className="size-3" />
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        className="text-destructive size-6"
        onClick={onRemove}
        aria-label="Remove"
      >
        <X className="size-3" />
      </Button>
    </div>
  );
}
