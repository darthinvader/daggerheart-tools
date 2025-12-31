import { getTierForLevel, LEVEL_UP_OPTIONS } from '@/lib/schemas/core';
import type { Armor } from '@/lib/schemas/equipment';
import { getEffectiveDamageThresholds } from '@/lib/schemas/equipment';

/**
 * Compute damage thresholds (Major/Severe) from max HP.
 * Major ≤ floor(max/4), Severe ≤ floor(max/2). Minimum 0.
 */
export function getThresholds(maxHp: number) {
  const major = Math.max(0, Math.floor(maxHp / 4));
  const severe = Math.max(0, Math.floor(maxHp / 2));
  return { major, severe } as const;
}

/**
 * Re-exported tier helper; kept here for a single import site for UI/logic.
 */
export { getTierForLevel };

/**
 * Points available per level according to SRD progression.
 */
export function getPointsForLevel(): number {
  return LEVEL_UP_OPTIONS.POINTS_PER_LEVEL;
}

/**
 * Return the level-up options table for the given tier label.
 */
export function getOptionsForTier(tier: ReturnType<typeof getTierForLevel>) {
  switch (tier) {
    case '1':
      return {} as const; // No spendable options at level 1
    case '2-4':
      return LEVEL_UP_OPTIONS.TIER_2;
    case '5-7':
      return LEVEL_UP_OPTIONS.TIER_3;
    case '8-10':
      return LEVEL_UP_OPTIONS.TIER_4;
  }
}

export type LevelUpDecisions = Record<string, number>;

/**
 * Light validator: ensure summed cost ≤ points and counts ≤ maxSelections.
 */
export function validateLevelUpDecisions(
  decisions: LevelUpDecisions,
  tier: ReturnType<typeof getTierForLevel>
) {
  const table = getOptionsForTier(tier);
  const entries = Object.entries(decisions);
  let costSum = 0;
  for (const [name, count] of entries) {
    if (!name || !Number.isFinite(count) || count <= 0) continue;
    const def = (
      table as Record<string, { cost: number; maxSelections: number }>
    )[name];
    if (!def) throw new Error(`Unknown level-up option: ${name}`);
    if (count > def.maxSelections) {
      throw new Error(
        `Option "${name}" exceeds max selections (${count} > ${def.maxSelections})`
      );
    }
    costSum += count * def.cost;
  }
  const budget = getPointsForLevel();
  if (costSum > budget) {
    throw new Error(`Total cost ${costSum} exceeds available points ${budget}`);
  }
  return { totalCost: costSum } as const;
}

export type DamageThresholds = { major: number; severe: number };

/**
 * Classify an incoming hit value against thresholds and return HP to lose.
 * - If hit < major → 1 (Minor)
 * - If major ≤ hit < severe → 2 (Major)
 * - If hit ≥ severe → 3 (Severe)
 */
export function classifyDamage(
  hit: number,
  thresholds: DamageThresholds,
  opts?: { critical?: boolean; doubleSevereOverride?: number }
): 1 | 2 | 3 | 4 {
  const { major, severe } = thresholds;
  if (!Number.isFinite(hit)) return 1;
  const critEnabled = opts?.critical === true;
  const ds = Number.isFinite(opts?.doubleSevereOverride as number)
    ? Math.max(0, opts!.doubleSevereOverride as number)
    : Math.max(0, severe * 2);
  if (critEnabled && hit >= ds) return 4;
  if (hit < Math.max(0, major)) return 1;
  if (hit < Math.max(0, severe)) return 2;
  return 3;
}

/**
 * Compute thresholds from equipped armor and level using SRD rule: +1 to each
 * threshold per character level on top of armor base thresholds.
 */
export function computeAutoThresholds(
  armor: Armor | undefined,
  level: number
): DamageThresholds {
  if (!armor)
    return {
      major: 1 + Math.max(0, Math.floor(level)),
      severe: 2 + Math.max(0, Math.floor(level)),
    };
  return getEffectiveDamageThresholds(level, armor.baseThresholds);
}
