import { z } from 'zod';

// Import schemas for discriminated union
import {
  BARD,
  type BardClass,
  BardClassSchema,
  type BardSubclass,
  BardSubclassSchema,
} from './bard';
import {
  DRUID,
  type DruidClass,
  DruidClassSchema,
  type DruidSubclass,
  DruidSubclassSchema,
} from './druid';
import {
  GUARDIAN,
  type GuardianClass,
  GuardianClassSchema,
  type GuardianSubclass,
  GuardianSubclassSchema,
} from './guardian';
import {
  RANGER,
  type RangerClass,
  RangerClassSchema,
  type RangerSubclass,
  RangerSubclassSchema,
} from './ranger';
import {
  ROGUE,
  type RogueClass,
  RogueClassSchema,
  type RogueSubclass,
  RogueSubclassSchema,
} from './rogue';
import {
  SERAPH,
  type SeraphClass,
  SeraphClassSchema,
  type SeraphSubclass,
  SeraphSubclassSchema,
} from './seraph';
import {
  SORCERER,
  type SorcererClass,
  SorcererClassSchema,
  type SorcererSubclass,
  SorcererSubclassSchema,
} from './sorcerer';
import {
  WARRIOR,
  type WarriorClass,
  WarriorClassSchema,
  type WarriorSubclass,
  WarriorSubclassSchema,
} from './warrior';
import {
  WIZARD,
  type WizardClass,
  WizardClassSchema,
  type WizardSubclass,
  WizardSubclassSchema,
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

// Abstract Generic Schemas
// ======================================================================================

// Generic subclass schema that any subclass can conform to
export const GenericSubclassSchema = z.object({
  name: z.string(),
  description: z.string(),
  spellcastTrait: z
    .union([
      z.literal('Agility'),
      z.literal('Strength'),
      z.literal('Finesse'),
      z.literal('Instinct'),
      z.literal('Presence'),
      z.literal('Knowledge'),
      z.never(),
    ])
    .optional(),
  features: z.array(z.any()),
});

// Generic class schema that any class can conform to
export const GenericClassSchema = z.object({
  name: z.string(),
  description: z.string(),
  domains: z.array(z.string()),
  startingEvasion: z.number(),
  startingHitPoints: z.number(),
  classItems: z.array(z.string()),
  hopeFeature: z.object({
    name: z.string(),
    description: z.string(),
    hopeCost: z.number(),
  }),
  subclasses: z.array(GenericSubclassSchema),
  classFeatures: z.array(z.any()),
});

// Generic class selection schema for character creation
export const GenericClassSelectionSchema = z.object({
  className: z.string(),
  selectedSubclass: z.string(),
  spellcastingTrait: z
    .union([
      z.literal('Agility'),
      z.literal('Strength'),
      z.literal('Finesse'),
      z.literal('Instinct'),
      z.literal('Presence'),
      z.literal('Knowledge'),
      z.never(),
    ])
    .optional(),
});

// Specific subclass union for type checking
export const SubclassSchema = z.union([
  BardSubclassSchema,
  DruidSubclassSchema,
  GuardianSubclassSchema,
  RangerSubclassSchema,
  RogueSubclassSchema,
  SeraphSubclassSchema,
  SorcererSubclassSchema,
  WarriorSubclassSchema,
  WizardSubclassSchema,
]);

// Type exports
// ======================================================================================

export type DaggerheartClass = z.infer<typeof ClassSchema>;
export type GeneralSubclass = z.infer<typeof GenericSubclassSchema>;
export type GeneralClass = z.infer<typeof GenericClassSchema>;
export type GeneralClassSelection = z.infer<typeof GenericClassSelectionSchema>;
export type SpecificSubclass = z.infer<typeof SubclassSchema>;

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
