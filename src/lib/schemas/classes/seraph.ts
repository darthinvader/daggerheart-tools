import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Seraph Class Schema (reduced)
// ======================================================================================

export const SeraphClassSchema = BaseClassSchema.extend({
  name: z.literal('Seraph'),
  subclasses: z.array(BaseSubclassSchema),
});

export type SeraphClass = z.infer<typeof SeraphClassSchema>;
