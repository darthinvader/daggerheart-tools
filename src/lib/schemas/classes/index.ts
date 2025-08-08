import { z } from 'zod';

// Import schemas for discriminated union (no data imports here)
import { BardClassSchema } from './bard';
import { DruidClassSchema } from './druid';
import { GuardianClassSchema } from './guardian';
import { RangerClassSchema } from './ranger';
import { RogueClassSchema } from './rogue';
import { SeraphClassSchema } from './seraph';
import { SorcererClassSchema } from './sorcerer';
import { WarriorClassSchema } from './warrior';
import { WizardClassSchema } from './wizard';

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
// Type export for main class schema
export type DaggerheartClass = z.infer<typeof ClassSchema>;
