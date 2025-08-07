import { z } from 'zod';

// Import schemas for discriminated union
import {
  BARD,
  type BardClass,
  BardClassSchema,
  type BardSubclass,
} from './bard';
import {
  DRUID,
  type DruidClass,
  DruidClassSchema,
  type DruidSubclass,
} from './druid';
import {
  GUARDIAN,
  type GuardianClass,
  GuardianClassSchema,
  type GuardianSubclass,
} from './guardian';
import {
  RANGER,
  type RangerClass,
  RangerClassSchema,
  type RangerSubclass,
} from './ranger';
import {
  ROGUE,
  type RogueClass,
  RogueClassSchema,
  type RogueSubclass,
} from './rogue';
import {
  SERAPH,
  type SeraphClass,
  SeraphClassSchema,
  type SeraphSubclass,
} from './seraph';
import {
  SORCERER,
  type SorcererClass,
  SorcererClassSchema,
  type SorcererSubclass,
} from './sorcerer';
import {
  WARRIOR,
  type WarriorClass,
  WarriorClassSchema,
  type WarriorSubclass,
} from './warrior';
import {
  WIZARD,
  type WizardClass,
  WizardClassSchema,
  type WizardSubclass,
} from './wizard';

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

// Type exports
// ======================================================================================

export type DaggerheartClass = z.infer<typeof ClassSchema>;

// Union types for subclasses
export type AnySubclass =
  | BardSubclass
  | DruidSubclass
  | GuardianSubclass
  | RangerSubclass
  | RogueSubclass
  | SeraphSubclass
  | SorcererSubclass
  | WarriorSubclass
  | WizardSubclass;

// Union types for classes
export type AnyClass =
  | BardClass
  | DruidClass
  | GuardianClass
  | RangerClass
  | RogueClass
  | SeraphClass
  | SorcererClass
  | WarriorClass
  | WizardClass;
