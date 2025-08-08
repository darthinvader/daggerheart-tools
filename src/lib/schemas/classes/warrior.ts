import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Warrior Subclass Schemas
// ======================================================================================

export const WarriorSubclassSchema = z.discriminatedUnion('name', [
  BaseSubclassSchema.extend({
    name: z.literal('Berserker'),
    description: z.literal(
      'Play the Berserker if you want to unleash your fury to supercharge your physical capabilities.'
    ),
  }),
  BaseSubclassSchema.extend({
    name: z.literal('Warlord'),
    description: z.literal(
      'Play the Warlord if you want to lead allies with tactical discipline and battlefield control.'
    ),
  }),
]);

// Warrior Class Schema
// ======================================================================================

export const WarriorClassSchema = BaseClassSchema.extend({
  name: z.literal('Warrior'),
  subclasses: z.array(WarriorSubclassSchema),
});

// Type exports for convenience
export type WarriorSubclass = z.infer<typeof WarriorSubclassSchema>;
export type WarriorClass = z.infer<typeof WarriorClassSchema>;
