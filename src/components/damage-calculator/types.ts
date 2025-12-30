export type DamageType = 'physical' | 'magic';

export interface DamageInput {
  amount: number;
  type: DamageType;
  ignoreArmor: boolean;
}

export interface DamageResult {
  incoming: number;
  absorbed: number;
  armorUsed: number;
  hpDamage: number;
  stressGained: number;
  isDeadly: boolean;
}

export interface ArmorState {
  current: number;
  max: number;
}

export interface HealthState {
  current: number;
  max: number;
  thresholds: {
    minor: number;
    major: number;
    severe: number;
  };
}
