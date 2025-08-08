import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Ranger Class Schema (reduced)
// ======================================================================================

export const RangerClassSchema = BaseClassSchema.extend({
  name: z.literal('Ranger'),
  subclasses: z.array(BaseSubclassSchema),
});

export type RangerClass = z.infer<typeof RangerClassSchema>;
