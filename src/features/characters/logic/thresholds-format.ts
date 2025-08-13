// Centralized helpers for formatting threshold chip labels
export type ThresholdKind = 'major' | 'severe' | 'ds';

export const THRESHOLD_PREFIX: Record<ThresholdKind, string> = {
  major: 'M',
  severe: 'S',
  ds: 'DS',
} as const;

export function formatThresholdChip(
  kind: ThresholdKind,
  value: string | number
): string {
  return `${THRESHOLD_PREFIX[kind]}:${String(value)}`;
}
