import type {
  ArmorState,
  DamageInput,
  DamageResult,
  HealthState,
} from './types';

export function calculateDamage(
  input: DamageInput,
  armor: ArmorState,
  health: HealthState
): DamageResult {
  let remaining = input.amount;
  let armorUsed = 0;

  // Armor only absorbs physical damage and only if not ignored
  if (input.type === 'physical' && !input.ignoreArmor && armor.current > 0) {
    armorUsed = Math.min(armor.current, remaining);
    remaining -= armorUsed;
  }

  const hpDamage = remaining;
  const newHp = health.current - hpDamage;
  const isDeadly = newHp <= 0;

  // Stress is gained based on severity thresholds
  let stressGained = 0;
  if (hpDamage >= health.thresholds.severe) {
    stressGained = 3;
  } else if (hpDamage >= health.thresholds.major) {
    stressGained = 2;
  } else if (hpDamage >= health.thresholds.minor) {
    stressGained = 1;
  }

  return {
    incoming: input.amount,
    absorbed: armorUsed,
    armorUsed,
    hpDamage,
    stressGained,
    isDeadly,
  };
}

export function getDamageSeverity(
  damage: number,
  thresholds: HealthState['thresholds']
): 'none' | 'minor' | 'major' | 'severe' {
  if (damage >= thresholds.severe) return 'severe';
  if (damage >= thresholds.major) return 'major';
  if (damage >= thresholds.minor) return 'minor';
  return 'none';
}

export function formatDamageBreakdown(result: DamageResult): string[] {
  const lines: string[] = [];

  lines.push(`Incoming damage: ${result.incoming}`);

  if (result.absorbed > 0) {
    lines.push(`Absorbed by armor: ${result.absorbed}`);
  }

  lines.push(`HP damage: ${result.hpDamage}`);

  if (result.stressGained > 0) {
    lines.push(`Stress gained: ${result.stressGained}`);
  }

  if (result.isDeadly) {
    lines.push('⚠️ This damage would reduce HP to 0 or below!');
  }

  return lines;
}
