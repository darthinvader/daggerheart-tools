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

// Re-export class schemas
export { BardClassSchema } from './bard';
export { DruidClassSchema } from './druid';
export { GuardianClassSchema } from './guardian';
export { RangerClassSchema } from './ranger';
export { RogueClassSchema } from './rogue';
export { SeraphClassSchema } from './seraph';
export { SorcererClassSchema } from './sorcerer';
export { WarriorClassSchema } from './warrior';
export { WizardClassSchema } from './wizard';

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
