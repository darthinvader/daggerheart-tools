export type DamageType = 'physical' | 'magic';

export interface DamageInput {
  amount: number;
  type: DamageType;
  ignoreArmor: boolean;
  armorSlotsSacrificed?: number;
}

export interface DamageResult {
  incoming: number;
  hpLost: number;
  armorSlotsSacrificed: number;
  severity: 'minor' | 'major' | 'severe' | 'critical';
  isDeadly: boolean;
  finalHp: number;
}

export interface ArmorState {
  current: number;
  max: number;
}

export interface HealthState {
  current: number;
  max: number;
  thresholds: {
    major: number;
    severe: number;
    critical?: number;
  };
  enableCritical?: boolean;
}
