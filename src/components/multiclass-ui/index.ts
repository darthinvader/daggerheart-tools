// Components
export { ClassLevelCard } from './class-level-card';
export { MulticlassDisplay } from './multiclass-display';

// Utils
export {
  canAddSecondary,
  formatClassDisplay,
  getMaxPrimaryLevel,
  getMaxSecondaryLevel,
  getTotalLevel,
  validateMulticlassConfig,
} from './multiclass-utils';

// Types
export type {
  MulticlassConfig,
  MulticlassFeature,
  MulticlassState,
} from './types';

// Constants
export {
  AVAILABLE_CLASSES,
  DEFAULT_MULTICLASS_CONFIG,
  MAX_TOTAL_LEVEL,
  MIN_PRIMARY_LEVEL,
  MIN_SECONDARY_LEVEL,
  MULTICLASS_RULES,
} from './constants';
