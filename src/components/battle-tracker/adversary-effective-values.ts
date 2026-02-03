import type { AdversaryTracker } from './types';

/**
 * Represents the effective thresholds for an adversary,
 * either as a parsed object or unparseable raw string.
 */
export interface EffectiveThresholds {
  major: number | null;
  severe: number | null;
  massive?: number | null;
}

export type AdversaryThresholdsValue = string | EffectiveThresholds;

/**
 * Normalizes attack modifier values, handling unicode minus signs.
 */
export function normalizeAttackModifier(value: string | number): number {
  if (typeof value === 'number') return value;
  // Handle unicode minus sign (U+2212) and regular hyphen-minus
  const normalized = value.replace(/−/g, '-');
  const parsed = Number.parseInt(normalized, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Gets the effective attack values for an adversary, applying overrides.
 */
export function getEffectiveAdversaryAttack(adversary: AdversaryTracker) {
  const source = adversary.source;
  return {
    name: adversary.attackOverride?.name ?? source.attack.name,
    modifier: normalizeAttackModifier(
      adversary.attackOverride?.modifier ?? source.attack.modifier
    ),
    range: adversary.attackOverride?.range ?? source.attack.range,
    damage: adversary.attackOverride?.damage ?? source.attack.damage,
  };
}

/**
 * Parses a threshold string like "8/15" into major/severe values.
 * Returns null if the string is not parseable.
 */
function parseThresholdString(
  thresholds: string
): { major: number; severe: number } | null {
  const parts = thresholds.split('/').map(s => parseInt(s.trim(), 10));
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { major: parts[0], severe: parts[1] };
  }
  return null;
}

/**
 * Computes the massive threshold (2× severe if not explicitly set).
 */
function computeMassiveThreshold(
  severe: number | null | undefined,
  explicit: number | null | undefined
): number | null {
  if (explicit != null) return explicit;
  return severe != null ? severe * 2 : null;
}

/**
 * Gets the effective threshold values for an adversary.
 * Parses string thresholds (e.g., "8/15") into object with computed massive.
 */
export function getEffectiveAdversaryThresholds(
  adversary: AdversaryTracker
): AdversaryThresholdsValue {
  const source = adversary.source;
  const override = adversary.thresholdsOverride;

  // Handle string thresholds (e.g., "8/15")
  if (typeof source.thresholds === 'string') {
    const parsed = parseThresholdString(source.thresholds);
    if (!parsed) return source.thresholds; // Return unparseable string as-is

    const major = override?.major ?? parsed.major;
    const severe = override?.severe ?? parsed.severe;
    return {
      major,
      severe,
      massive: computeMassiveThreshold(severe, override?.massive),
    };
  }

  // Handle object thresholds
  const major = override?.major ?? source.thresholds.major;
  const severe = override?.severe ?? source.thresholds.severe;
  return {
    major,
    severe,
    massive: computeMassiveThreshold(
      severe,
      override?.massive ?? source.thresholds.massive
    ),
  };
}

/**
 * Gets the effective features for an adversary, applying overrides.
 */
export function getEffectiveAdversaryFeatures(adversary: AdversaryTracker) {
  return adversary.featuresOverride ?? adversary.source.features;
}

/**
 * Gets the effective difficulty for an adversary, applying overrides.
 */
export function getEffectiveAdversaryDifficulty(adversary: AdversaryTracker) {
  return adversary.difficultyOverride ?? adversary.source.difficulty;
}

/**
 * Checks if an adversary has any modifications applied.
 */
export function hasAdversaryModifications(
  adversary: AdversaryTracker
): boolean {
  return Boolean(
    adversary.attackOverride ||
    adversary.thresholdsOverride ||
    adversary.featuresOverride ||
    adversary.difficultyOverride
  );
}

/**
 * Gets all effective values for an adversary in a single call.
 */
export function getAdversaryEffectiveValues(adversary: AdversaryTracker) {
  return {
    effectiveAttack: getEffectiveAdversaryAttack(adversary),
    effectiveThresholds: getEffectiveAdversaryThresholds(adversary),
    effectiveFeatures: getEffectiveAdversaryFeatures(adversary),
    effectiveDifficulty: getEffectiveAdversaryDifficulty(adversary),
    hasModifications: hasAdversaryModifications(adversary),
  };
}
