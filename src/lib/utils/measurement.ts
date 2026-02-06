import type { MeasurementUnit, RangeBand } from '@/lib/types/measurement';

/** Base distances in feet for each Daggerheart range band. */
const RANGE_DISTANCES_FT: Record<RangeBand, number> = {
  Melee: 5,
  'Very Close': 15,
  Close: 30,
  Far: 60,
  'Very Far': 120,
};

/** Conversion factors from feet to other units. */
const CONVERSION_FACTORS: Record<MeasurementUnit, number> = {
  feet: 1,
  meters: 0.3048,
  yards: 1 / 3,
};

const UNIT_ABBREVIATIONS: Record<MeasurementUnit, string> = {
  feet: 'ft',
  meters: 'm',
  yards: 'yd',
};

const RANGE_BANDS = new Set<string>(Object.keys(RANGE_DISTANCES_FT));

function isRangeBand(range: string): range is RangeBand {
  return RANGE_BANDS.has(range);
}

/** Convert a range band distance to the given unit. */
export function convertRange(range: RangeBand, unit: MeasurementUnit): number {
  const feet = RANGE_DISTANCES_FT[range];
  return Math.round(feet * CONVERSION_FACTORS[unit]);
}

/**
 * Format a range string with an appended distance annotation.
 * Returns e.g. "Close (~30 ft)". Unknown ranges pass through unchanged.
 */
export function formatRangeWithDistance(
  range: string,
  unit: MeasurementUnit
): string {
  if (!isRangeBand(range)) return range;
  const distance = convertRange(range, unit);
  const abbr = UNIT_ABBREVIATIONS[unit];
  return `${range} (~${distance} ${abbr})`;
}

/**
 * Return just the distance annotation string, e.g. "~30 ft".
 * Returns null for unknown range values.
 */
export function formatDistance(
  range: string,
  unit: MeasurementUnit
): string | null {
  if (!isRangeBand(range)) return null;
  const distance = convertRange(range, unit);
  const abbr = UNIT_ABBREVIATIONS[unit];
  return `~${distance} ${abbr}`;
}
