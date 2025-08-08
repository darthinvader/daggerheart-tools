import { z } from 'zod';

import {
  BaseClassSchema,
  BaseSubclassSchema,
  RangerCompanionSchema,
} from '../core';

// Ranger Subclass Schemas
// ======================================================================================

export const RangerSubclassSchema = z.discriminatedUnion('name', [
  BaseSubclassSchema.extend({
    name: z.literal('Beastbound'),
    description: z.literal(
      'Play the Beastbound if you want to form a deep bond with an animal ally.'
    ),
    spellcastTrait: z.literal('Agility'),
    companion: RangerCompanionSchema.optional(), // Companion for Beastbound rangers
  }),
  BaseSubclassSchema.extend({
    name: z.literal('Wayfinder'),
    description: z.literal(
      'Play the Wayfinder if you want to hunt your prey and strike with deadly force.'
    ),
    spellcastTrait: z.literal('Agility'),
  }),
]);

// Ranger Class Schema
// ======================================================================================

export const RangerClassSchema = BaseClassSchema.extend({
  name: z.literal('Ranger'),
  subclasses: z.array(RangerSubclassSchema),
});

// Type exports for convenience
export type RangerSubclass = z.infer<typeof RangerSubclassSchema>;
export type RangerClass = z.infer<typeof RangerClassSchema>;
