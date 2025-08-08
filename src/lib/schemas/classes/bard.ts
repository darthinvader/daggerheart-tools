import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Bard Subclass Schemas
// ======================================================================================

export const BardSubclassSchema = z.discriminatedUnion('name', [
  BaseSubclassSchema.extend({
    name: z.literal('Troubadour'),
    description: z.literal(
      'Play the Troubadour if you want to play music to bolster your allies.'
    ),
    spellcastTrait: z.literal('Presence'),
  }),
  BaseSubclassSchema.extend({
    name: z.literal('Wordsmith'),
    description: z.literal(
      'Play the Wordsmith if you want to use clever wordplay and captivate crowds.'
    ),
    spellcastTrait: z.literal('Presence'),
  }),
]);

// Bard Class Schema
// ======================================================================================

export const BardClassSchema = BaseClassSchema.extend({
  name: z.literal('Bard'),
  subclasses: z.array(BardSubclassSchema),
});

// Type exports for convenience
export type BardSubclass = z.infer<typeof BardSubclassSchema>;
export type BardClass = z.infer<typeof BardClassSchema>;
