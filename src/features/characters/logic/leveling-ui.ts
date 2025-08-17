import { getTierForLevel } from '@/features/characters/logic/progression';
import type { LevelUpEntry } from '@/features/characters/progression-storage';

export type PriorTierFlags = {
  hadSubclassUpgradeInTier: boolean;
  hadMulticlassInTier: boolean;
  hadMulticlassEver: boolean;
};

// Key predicates used in gating and labeling
export function isSubclassUpgradeKey(key: string) {
  return key.startsWith('Take an upgraded subclass card');
}

export function isMulticlassKey(key: string) {
  return key.startsWith('Multiclass:');
}

// Gating: determines if an option should be disabled based on current selections and history flags
export function computeGatedDisabled(
  key: string,
  flags: {
    selectedMulticlassThisLevel: boolean;
    selectedSubclassThisLevel: boolean;
  },
  priorTierFlags: PriorTierFlags
) {
  const isSubclassUpgrade = isSubclassUpgradeKey(key);
  const isMulti = isMulticlassKey(key);
  if (isSubclassUpgrade) {
    return (
      priorTierFlags.hadMulticlassInTier || flags.selectedMulticlassThisLevel
    );
  }
  if (isMulti) {
    return (
      priorTierFlags.hadSubclassUpgradeInTier ||
      priorTierFlags.hadMulticlassEver ||
      flags.selectedSubclassThisLevel
    );
  }
  return false;
}

// Tier display note
export function getTierNote(tier: string) {
  if (tier === '2-4') return 'Tier 2: choose any two options from this list.';
  if (tier === '5-7')
    return 'Tier 3: choose any two options from this or previous tiers.';
  if (tier === '8-10')
    return 'Tier 4: choose any two options from this or previous tiers.';
  return '';
}

// Level milestones text list
export function computeAchievements(targetLevel: number): string[] {
  const arr: string[] = [];
  if (targetLevel === 2) arr.push('+2 Experience, +1 Proficiency');
  if (targetLevel === 5)
    arr.push('+2 Experience, +1 Proficiency, clear trait marks');
  if (targetLevel === 8)
    arr.push('+2 Experience, +1 Proficiency, clear trait marks');
  return arr;
}

// History-derived tier flags
export function computePriorTierFlags(
  history: LevelUpEntry[] | undefined,
  targetLevel: number,
  tier: string
): PriorTierFlags {
  const all = history ?? [];
  const inSameTier = all.filter(e => getTierForLevel(e.level) === tier);
  const beforeThisLevel = inSameTier.filter(e => e.level < targetLevel);
  let hadSubclassUpgradeInTier = false;
  let hadMulticlassInTier = false;
  const hadMulticlassEver = (history ?? []).some(e =>
    Object.entries(e.selections || {}).some(
      ([k, v]) => isMulticlassKey(k) && Number(v) > 0
    )
  );
  for (const e of beforeThisLevel) {
    for (const [k, v] of Object.entries(e.selections || {})) {
      if (isSubclassUpgradeKey(k) && Number(v) > 0)
        hadSubclassUpgradeInTier = true;
      if (isMulticlassKey(k) && Number(v) > 0) hadMulticlassInTier = true;
    }
  }
  return { hadSubclassUpgradeInTier, hadMulticlassInTier, hadMulticlassEver };
}

// Tally prior selections within the same tier before the target level
export function computePriorTaken(
  history: LevelUpEntry[] | undefined,
  targetLevel: number,
  tier: string
) {
  const all = history ?? [];
  const inSameTier = all.filter(e => getTierForLevel(e.level) === tier);
  const before = inSameTier.filter(e => e.level < targetLevel);
  const tally: Record<string, number> = {};
  for (const e of before) {
    for (const [k, v] of Object.entries(e.selections || {})) {
      tally[k] = (tally[k] ?? 0) + (Number(v) || 0);
    }
  }
  return tally;
}

// Compute total cost of current selections
export function computeTotalCost(
  selections: Record<string, number> | undefined,
  options: Record<string, { cost: number }>
) {
  const sel = selections || {};
  let sum = 0;
  for (const [k, v] of Object.entries(sel)) {
    const def = options[k];
    if (!def) continue;
    sum += (Number(v) || 0) * def.cost;
  }
  return sum;
}
