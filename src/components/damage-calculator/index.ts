// Components
export { DamageCalculator } from './damage-calculator';
export { DamageResultDisplay } from './damage-result-display';

// Utils
export {
  calculateDamage,
  formatDamageBreakdown,
  getDamageSeverity,
} from './damage-utils';

// Types
export type {
  ArmorState,
  DamageInput,
  DamageResult,
  DamageType,
  HealthState,
} from './types';

// Constants - renamed to avoid conflict with equipment/constants
export {
  DAMAGE_TYPES as CALCULATOR_DAMAGE_TYPES,
  SEVERITY_LEVELS,
} from './constants';
