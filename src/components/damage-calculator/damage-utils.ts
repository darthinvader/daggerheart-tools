import type {
  ArmorState,
  DamageInput,
  DamageResult,
  HealthState,
} from './types';

type Severity = 'minor' | 'major' | 'severe' | 'critical';

/**
 * Classify incoming damage value against thresholds and return HP to lose.
 * Thresholds are: Major, Severe, (and optionally Massive Damage/Critical)
 * Outcomes/Severity names are: Minor (1 HP), Major (2 HP), Severe (3 HP), Massive/Critical (4 HP)
 *
 * - damage below Major threshold = 1 HP (Minor outcome)
 * - damage from Major to (but not including) Severe = 2 HP (Major outcome)
 * - damage >= Severe = 3 HP (Severe outcome)
 * - If Massive Damage enabled: damage >= Massive Damage threshold = 4 HP (Critical outcome)
 */
function classifyDamageToHp(
  damage: number,
  thresholds: HealthState['thresholds'],
  enableCritical?: boolean
): { hpLost: number; severity: Severity } {
  const { major, severe, critical } = thresholds;

  if (damage <= 0) {
    return { hpLost: 0, severity: 'minor' };
  }

  // Critical damage (if enabled and threshold exists)
  if (enableCritical && critical && damage >= critical) {
    return { hpLost: 4, severity: 'critical' };
  }

  // Severe damage
  if (damage >= severe) {
    return { hpLost: 3, severity: 'severe' };
  }

  // Major damage
  if (damage >= major) {
    return { hpLost: 2, severity: 'major' };
  }

  // Minor damage (1 to but not including major)
  return { hpLost: 1, severity: 'minor' };
}

export function calculateDamage(
  input: DamageInput,
  _armor: ArmorState,
  health: HealthState
): DamageResult {
  const { amount, armorSlotsSacrificed = 0 } = input;

  // Classify the raw damage amount to determine base HP loss
  const { hpLost: baseHpLost, severity } = classifyDamageToHp(
    amount,
    health.thresholds,
    health.enableCritical
  );

  // Sacrifice armor slots to reduce HP loss (1 armor slot = 1 less HP lost)
  const effectiveArmorSacrifice = Math.min(armorSlotsSacrificed, baseHpLost);
  const hpLost = Math.max(0, baseHpLost - effectiveArmorSacrifice);

  const finalHp = Math.max(0, health.current - hpLost);
  const isDeadly = finalHp <= 0;

  return {
    incoming: amount,
    hpLost,
    armorSlotsSacrificed: effectiveArmorSacrifice,
    severity,
    isDeadly,
    finalHp,
  };
}

export function getDamageSeverity(
  damage: number,
  thresholds: HealthState['thresholds'],
  enableCritical?: boolean
): Severity | 'none' {
  if (damage <= 0) return 'none';
  if (enableCritical && thresholds.critical && damage >= thresholds.critical)
    return 'critical';
  if (damage >= thresholds.severe) return 'severe';
  if (damage >= thresholds.major) return 'major';
  return 'minor';
}

export function formatDamageBreakdown(result: DamageResult): string[] {
  const lines: string[] = [];

  lines.push(`Incoming damage: ${result.incoming}`);
  lines.push(`Severity: ${result.severity}`);
  lines.push(`HP lost: ${result.hpLost}`);

  if (result.armorSlotsSacrificed > 0) {
    lines.push(`Armor slots sacrificed: ${result.armorSlotsSacrificed}`);
  }

  if (result.isDeadly) {
    lines.push('WARNING: This damage would reduce HP to 0 or below!');
  }

  return lines;
}
