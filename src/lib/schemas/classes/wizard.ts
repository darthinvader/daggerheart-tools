import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Wizard Subclass Schemas
// ======================================================================================

export const WizardSubclassSchema = z.discriminatedUnion('name', [
  BaseSubclassSchema.extend({
    name: z.literal('School of Knowledge'),
    description: z.literal(
      'Play the School of Knowledge if you want a keen understanding of the world around you.'
    ),
    spellcastTrait: z.literal('Knowledge'),
  }),
  BaseSubclassSchema.extend({
    name: z.literal('School of War'),
    description: z.literal(
      'Play the School of War if you want to utilize trained magic for violence.'
    ),
    spellcastTrait: z.literal('Knowledge'),
  }),
]);

// Wizard Class Schema
// ======================================================================================

export const WizardClassSchema = BaseClassSchema.extend({
  name: z.literal('Wizard'),
  subclasses: z.array(WizardSubclassSchema),
});

// Type exports for convenience
export type WizardSubclass = z.infer<typeof WizardSubclassSchema>;
export type WizardClass = z.infer<typeof WizardClassSchema>;
