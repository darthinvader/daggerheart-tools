// Combined list for convenience
import { BARD } from './bard';
import { DRUID } from './druid';
import { GUARDIAN } from './guardian';
import { RANGER } from './ranger';
import { ROGUE } from './rogue';
import { SERAPH } from './seraph';
import { SORCERER } from './sorcerer';
import { WARRIOR } from './warrior';
import { WIZARD } from './wizard';

// Aggregated class data exports
// ======================================================================================

export * from './bard';
export * from './druid';
export * from './guardian';
export * from './ranger';
export * from './rogue';
export * from './seraph';
export * from './sorcerer';
export * from './warrior';
export * from './wizard';

export const ALL_CLASSES = [
  BARD,
  DRUID,
  GUARDIAN,
  RANGER,
  ROGUE,
  SERAPH,
  SORCERER,
  WARRIOR,
  WIZARD,
] as const;
