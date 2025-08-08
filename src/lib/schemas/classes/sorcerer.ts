import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Sorcerer Subclass Schemas
// ======================================================================================

export const SorcererSubclassSchema = z.discriminatedUnion('name', [
  BaseSubclassSchema.extend({
    name: z.literal('Elemental Origin'),
    description: z.literal(
      'Play the Elemental Origin if you want to channel raw magic to take the shape of a particular element.'
    ),
    spellcastTrait: z.literal('Instinct'),
  }),
  BaseSubclassSchema.extend({
    name: z.literal('Primal Origin'),
    description: z.literal(
      'Play the Primal Origin if you want to extend the versatility of your spells in powerful ways.'
    ),
    spellcastTrait: z.literal('Instinct'),
  }),
]);

// Sorcerer Class Schema
// ======================================================================================

export const SorcererClassSchema = BaseClassSchema.extend({
  name: z.literal('Sorcerer'),
  subclasses: z.array(SorcererSubclassSchema),
});

// Type exports for convenience
export type SorcererSubclass = z.infer<typeof SorcererSubclassSchema>;
export type SorcererClass = z.infer<typeof SorcererClassSchema>;
