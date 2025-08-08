import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Rogue Subclass Schemas
// ======================================================================================

export const RogueSubclassSchema = z.discriminatedUnion('name', [
  BaseSubclassSchema.extend({
    name: z.literal('Nightwalker'),
    description: z.literal(
      'Play the Nightwalker if you want to manipulate shadows to maneuver through the environment.'
    ),
    spellcastTrait: z.literal('Finesse'),
  }),
  BaseSubclassSchema.extend({
    name: z.literal('Syndicate'),
    description: z.literal(
      'Play the Syndicate if you want to have a web of contacts everywhere you go.'
    ),
    spellcastTrait: z.literal('Finesse'),
  }),
]);

// Rogue Class Schema
// ======================================================================================

export const RogueClassSchema = BaseClassSchema.extend({
  name: z.literal('Rogue'),
  subclasses: z.array(RogueSubclassSchema),
});

// Type exports for convenience
export type RogueSubclass = z.infer<typeof RogueSubclassSchema>;
export type RogueClass = z.infer<typeof RogueClassSchema>;
