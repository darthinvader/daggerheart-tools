import { z } from 'zod';

// Import schemas for discriminated union
import { BARD, BardClassSchema } from './bard';
import { DRUID, DruidClassSchema } from './druid';
import { GUARDIAN, GuardianClassSchema } from './guardian';
import { RANGER, RangerClassSchema } from './ranger';
import { ROGUE, RogueClassSchema } from './rogue';
import { SERAPH, SeraphClassSchema } from './seraph';
import { SORCERER, SorcererClassSchema } from './sorcerer';
import { WARRIOR, WarriorClassSchema } from './warrior';
import { WIZARD, WizardClassSchema } from './wizard';

// Import all individual class modules
export * from './bard';
export * from './druid';
export * from './guardian';
export * from './ranger';
export * from './rogue';
export * from './seraph';
export * from './sorcerer';
export * from './warrior';
export * from './wizard';

// Main Class Schema - Discriminated Union
// ======================================================================================

export const ClassSchema = z.discriminatedUnion('name', [
  BardClassSchema,
  DruidClassSchema,
  GuardianClassSchema,
  RangerClassSchema,
  RogueClassSchema,
  SeraphClassSchema,
  SorcererClassSchema,
  WarriorClassSchema,
  WizardClassSchema,
]);

// Export all class constants
// ======================================================================================

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

// Individual class exports for convenience
export {
  BARD,
  DRUID,
  GUARDIAN,
  RANGER,
  ROGUE,
  SERAPH,
  SORCERER,
  WARRIOR,
  WIZARD,
};

// Type export for main class schema
export type DaggerheartClass = z.infer<typeof ClassSchema>;
