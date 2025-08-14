// Lightweight helpers to keep threshold validation and derivation consistent across UIs

/**
 * Validate manual thresholds. Returns null when valid, else an error message.
 */
export function validateThresholdsManual(
  majorInput: string,
  severeInput: string,
  dsOverride: boolean,
  dsInput: string
): string | null {
  const mj = Number.parseInt(majorInput, 10);
  const sv = Number.parseInt(severeInput, 10);
  if (!Number.isFinite(mj) || !Number.isFinite(sv)) {
    return 'Severe must be ≥ Major and both values must be set.';
  }
  if (mj < 0 || sv < 0) return 'Thresholds cannot be negative.';
  if (sv < mj) return 'Severe must be ≥ Major.';
  if (dsOverride) {
    const ds = Number.parseInt(dsInput, 10);
    if (!Number.isFinite(ds) || ds < 0)
      return 'Major Damage must be a non-negative number.';
    if (ds < sv) return 'Major Damage must be ≥ Severe.';
  }
  return null;
}

/**
 * Compute the DS value given a severe value and an optional custom override.
 */
export function computeDsValue(
  severe: number,
  dsOverride: boolean,
  dsInput?: string
) {
  if (!dsOverride) return Math.max(0, severe * 2);
  const n = Number.parseInt((dsInput ?? '').trim(), 10);
  return Math.max(0, Number.isFinite(n) ? n : severe * 2);
}
