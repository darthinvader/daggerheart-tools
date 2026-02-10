/**
 * Adversary Form Validation
 *
 * Validates damage thresholds, modifier format, and damage notation.
 */

const MODIFIER_REGEX = /^[+-]\d+$/;
const DAMAGE_REGEX = /^(\d+d\d+)(\s*\+\s*(\d+d\d+|\d+))*$/;

/**
 * Validates that major threshold is less than severe threshold.
 * Returns an error message string or null if valid.
 */
export function validateThresholds(thresholds: unknown): string | null {
  if (typeof thresholds === 'string') return null;
  if (typeof thresholds !== 'object' || thresholds === null) return null;

  const t = thresholds as { major?: number | null; severe?: number | null };
  if (t.major == null || t.severe == null) return null;

  if (t.major >= t.severe) {
    return 'Major threshold must be smaller than severe threshold.';
  }

  return null;
}

/**
 * Validates that modifier is in +N or -N format.
 * Returns an error message string or null if valid.
 */
export function validateModifierFormat(value: string): string | null {
  if (!value.trim()) return null;
  if (!MODIFIER_REGEX.test(value.trim())) {
    return 'Modifier must be in +N or -N format (e.g. +2, -1).';
  }
  return null;
}

/**
 * Validates that damage follows dice notation: XdY + XdY + ... + Z
 * Examples: "1d6", "2d8+3", "1d6 + 1d4 + 2"
 * Returns an error message string or null if valid.
 */
export function validateDamageFormat(value: string): string | null {
  if (!value.trim()) return null;
  const normalized = value.trim().replace(/\s+/g, '');
  if (!DAMAGE_REGEX.test(normalized)) {
    return 'Damage must use dice notation (e.g. 1d6, 2d8+3, 1d6+1d4+2).';
  }
  return null;
}
