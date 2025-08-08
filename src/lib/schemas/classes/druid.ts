import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Druid Subclass Schemas
// ======================================================================================

export const DruidSubclassSchema = z.discriminatedUnion('name', [
  BaseSubclassSchema.extend({
    name: z.literal('Warden of the Elements'),
    description: z.literal(
      'Play the Warden of the Elements if you want to embody the natural elements of the wild.'
    ),
    spellcastTrait: z.literal('Instinct'),
  }),
  BaseSubclassSchema.extend({
    name: z.literal('Warden of Renewal'),
    description: z.literal(
      'Play the Warden of Renewal if you want to use powerful magic to heal your party.'
    ),
    spellcastTrait: z.literal('Instinct'),
  }),
]);

// Druid Class Schema
// ======================================================================================

export const DruidClassSchema = BaseClassSchema.extend({
  name: z.literal('Druid'),
  subclasses: z.array(DruidSubclassSchema),
});

// Type exports for convenience
export type DruidSubclass = z.infer<typeof DruidSubclassSchema>;
export type DruidClass = z.infer<typeof DruidClassSchema>;
