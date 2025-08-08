import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Guardian Subclass Schemas
// ======================================================================================

export const GuardianSubclassSchema = z.discriminatedUnion('name', [
  BaseSubclassSchema.extend({
    name: z.literal('Stalwart'),
    description: z.literal(
      'Play the Stalwart if you want to take heavy blows and keep fighting.'
    ),
    spellcastTrait: z.never().optional(),
  }),
  BaseSubclassSchema.extend({
    name: z.literal('Vengeance'),
    description: z.literal(
      'Play the Vengeance if you want to strike down enemies who harm you or your allies.'
    ),
    spellcastTrait: z.never().optional(),
  }),
]);

// Guardian Class Schema
// ======================================================================================

export const GuardianClassSchema = BaseClassSchema.extend({
  name: z.literal('Guardian'),
  subclasses: z.array(GuardianSubclassSchema),
});

// Type exports for convenience
export type GuardianSubclass = z.infer<typeof GuardianSubclassSchema>;
export type GuardianClass = z.infer<typeof GuardianClassSchema>;
