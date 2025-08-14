// Centralized helpers for formatting threshold chip labels
// Migration: support both 'md' (Major Damage) and legacy 'ds' (Double Severe)
export type ThresholdKind = 'major' | 'severe' | 'md' | 'ds';

export const THRESHOLD_PREFIX: Record<ThresholdKind, string> = {
  major: 'M',
  severe: 'S',
  md: 'MD',
  // legacy alias
  ds: 'MD',
} as const;

export function formatThresholdChip(
  kind: ThresholdKind,
  value: string | number
): string {
  return `${THRESHOLD_PREFIX[kind]}:${String(value)}`;
}
