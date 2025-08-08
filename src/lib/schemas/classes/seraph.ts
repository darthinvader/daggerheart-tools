import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Seraph Subclass Schemas
// ======================================================================================

export const SeraphSubclassSchema = z.discriminatedUnion('name', [
  BaseSubclassSchema.extend({
    name: z.literal('Divine Wielder'),
    description: z.literal(
      'Play the Divine Wielder if you want to dominate the battlefield with a legendary weapon.'
    ),
    spellcastTrait: z.literal('Strength'),
  }),
  BaseSubclassSchema.extend({
    name: z.literal('Winged Sentinel'),
    description: z.literal(
      'Play the Winged Sentinel if you want to take flight and strike crushing blows from the sky.'
    ),
    spellcastTrait: z.literal('Strength'),
  }),
]);

// Seraph Class Schema
// ======================================================================================

export const SeraphClassSchema = BaseClassSchema.extend({
  name: z.literal('Seraph'),
  subclasses: z.array(SeraphSubclassSchema),
});

// Type exports for convenience
export type SeraphSubclass = z.infer<typeof SeraphSubclassSchema>;
export type SeraphClass = z.infer<typeof SeraphClassSchema>;
