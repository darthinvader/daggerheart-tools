import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Guardian Class Schema (reduced)
// ======================================================================================

export const GuardianClassSchema = BaseClassSchema.extend({
  name: z.literal('Guardian'),
  subclasses: z.array(BaseSubclassSchema),
});

export type GuardianClass = z.infer<typeof GuardianClassSchema>;
