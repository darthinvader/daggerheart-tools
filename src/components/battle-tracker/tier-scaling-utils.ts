import type { Adversary } from '@/lib/schemas/adversaries';

// ============== Types ==============

export interface TierScaleOverrides {
  difficulty: number;
  hp: number;
  stress: number;
  attackModifier: number;
  thresholds: { major: number; severe: number; massive?: number };
}

// ============== Helpers ==============

function parseModifier(modifier: string | number): number {
  if (typeof modifier === 'number') return modifier;
  const parsed = parseInt(modifier, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function parseThresholds(thresholds: Adversary['thresholds']): {
  major: number;
  severe: number;
  massive?: number;
} {
  if (typeof thresholds === 'string') {
    return { major: 0, severe: 0 };
  }
  return {
    major: thresholds.major ?? 0,
    severe: thresholds.severe ?? 0,
    ...(thresholds.massive != null ? { massive: thresholds.massive } : {}),
  };
}

// ============== Pure Scaling Function ==============

/**
 * Computes tier-scaled stat overrides for an adversary.
 *
 * Per tier step up: difficulty +3, HP ×1.5, stress +1, attack modifier +2,
 * major threshold +2, severe/massive threshold +3.
 * Scaling down applies the inverse.
 */
export function computeTierScaling(
  adversary: Adversary,
  targetTier: number
): TierScaleOverrides {
  const originalTier = Number(adversary.tier);
  const tierDiff = targetTier - originalTier;
  const baseThresholds = parseThresholds(adversary.thresholds);
  const baseModifier = parseModifier(adversary.attack.modifier);

  if (tierDiff === 0) {
    return {
      difficulty: adversary.difficulty,
      hp: adversary.hp,
      stress: adversary.stress,
      attackModifier: baseModifier,
      thresholds: baseThresholds,
    };
  }

  const hpMultiplier =
    tierDiff > 0
      ? Math.pow(1.5, tierDiff)
      : Math.pow(2 / 3, Math.abs(tierDiff));

  return {
    difficulty: adversary.difficulty + tierDiff * 3,
    hp: Math.ceil(adversary.hp * hpMultiplier),
    stress: Math.max(0, adversary.stress + tierDiff),
    attackModifier: baseModifier + tierDiff * 2,
    thresholds: {
      major: Math.max(0, baseThresholds.major + tierDiff * 2),
      severe: Math.max(0, baseThresholds.severe + tierDiff * 3),
      ...(baseThresholds.massive != null
        ? { massive: Math.max(0, baseThresholds.massive + tierDiff * 3) }
        : {}),
    },
  };
}

/** Parse the raw modifier field from an Adversary's attack. */
export { parseModifier, parseThresholds };
