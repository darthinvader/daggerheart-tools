import type {
  DiceRollResult,
  DualityRollOptions,
  DualityRollResult,
  EffectDieResult,
  ResolvedDualityRoll,
} from '../schemas/dice';

// =====================================================================================
// Dice Utilities
// =====================================================================================

/**
 * Parse dice notation string into count and sides.
 * @example parseDiceNotation('2d6') → { count: 2, sides: 6 }
 */
export function parseDiceNotation(notation: string): {
  count: number;
  sides: number;
} {
  const match = notation.match(/^(\d+)d(\d+)$/);
  if (!match) {
    throw new Error(
      `Invalid dice notation: "${notation}". Expected NdS format.`
    );
  }
  return { count: Number(match[1]), sides: Number(match[2]) };
}

/**
 * Roll one or more dice of the same type.
 * Uses crypto.getRandomValues for better randomness when available.
 *
 * @param sides - Number of sides per die (e.g., 6, 12, 20)
 * @param count - Number of dice to roll (default: 1)
 */
export function rollDice(sides: number, count = 1): DiceRollResult {
  if (sides < 1 || count < 1) {
    throw new Error(`Invalid dice parameters: ${count}d${sides}`);
  }

  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(randomInt(1, sides));
  }

  return {
    sides,
    rolls,
    total: rolls.reduce((sum, r) => sum + r, 0),
  };
}

/**
 * Roll effect/damage dice from notation string.
 * @example rollEffectDie('2d6') → { notation: '2d6', rolls: [3, 5], total: 8 }
 */
export function rollEffectDie(notation: string): EffectDieResult {
  const { count, sides } = parseDiceNotation(notation);
  const result = rollDice(sides, count);
  return {
    notation,
    rolls: result.rolls,
    total: result.total,
  };
}

/**
 * Perform a Duality Roll (2d12 + modifier).
 *
 * Per SRD Page 28:
 * "When you make an action roll, roll your two Duality Dice (2d12).
 *  One represents Hope, the other Fear."
 *
 * @param modifier - Total modifier to add (trait + experience bonuses)
 * @param options - Optional advantage/disadvantage/effect die
 */
export function rollDuality(
  modifier = 0,
  options?: Partial<DualityRollOptions>
): DualityRollResult {
  const hopeDie = randomInt(1, 12);
  const fearDie = randomInt(1, 12);

  let total = hopeDie + fearDie + modifier;
  let advantageDie: number | undefined;
  let disadvantageDie: number | undefined;

  // Per SRD Page 30: Advantage adds a d6, Disadvantage subtracts a d6
  // If both, they cancel out
  if (options?.advantage && !options?.disadvantage) {
    advantageDie = randomInt(1, 6);
    total += advantageDie;
  } else if (options?.disadvantage && !options?.advantage) {
    disadvantageDie = randomInt(1, 6);
    total -= disadvantageDie;
  }

  let effectDieResult: EffectDieResult | undefined;
  if (options?.effectDie) {
    effectDieResult = rollEffectDie(options.effectDie);
  }

  return {
    hopeDie,
    fearDie,
    modifier,
    advantageDie,
    disadvantageDie,
    total,
    effectDieResult,
    isMatching: hopeDie === fearDie,
    timestamp: Date.now(),
  };
}

/**
 * Resolve a Duality Roll against a difficulty value.
 *
 * Per SRD Page 28-29:
 * - Critical Success: Both dice show the same number → always success with Hope, clear 1 Stress
 * - Success with Hope: Total >= difficulty AND Hope die > Fear die → player gains 1 Hope
 * - Success with Fear: Total >= difficulty AND Fear die > Hope die → GM gains 1 Fear
 * - Failure with Fear: Total < difficulty → GM gains 1 Fear
 *
 * @param roll - The raw duality roll result
 * @param difficulty - The target difficulty number
 */
export function resolveDualityRoll(
  roll: DualityRollResult,
  difficulty: number
): ResolvedDualityRoll {
  const isSuccess = roll.total >= difficulty;

  // Per SRD Page 29: Matching dice (doubles) = Critical Success
  if (roll.isMatching) {
    return {
      ...roll,
      difficulty,
      outcome: 'critical_success',
      hopeGenerated: 1,
      fearGenerated: 0,
      clearsStress: true,
    };
  }

  if (isSuccess) {
    const isHopeHigher = roll.hopeDie > roll.fearDie;
    return {
      ...roll,
      difficulty,
      outcome: isHopeHigher ? 'success_with_hope' : 'success_with_fear',
      hopeGenerated: isHopeHigher ? 1 : 0,
      fearGenerated: isHopeHigher ? 0 : 1,
      clearsStress: false,
    };
  }

  // Failure — GM always gains Fear
  return {
    ...roll,
    difficulty,
    outcome: 'failure_with_fear',
    hopeGenerated: 0,
    fearGenerated: 1,
    clearsStress: false,
  };
}

// =====================================================================================
// Internal Helpers
// =====================================================================================

/**
 * Generate a random integer between min and max (inclusive).
 * Uses crypto.getRandomValues when available for better entropy.
 */
function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const array = new Uint32Array(1);
    globalThis.crypto.getRandomValues(array);
    return min + (array[0] % range);
  }
  return min + Math.floor(Math.random() * range);
}
