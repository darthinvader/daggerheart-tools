import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Bard Class Schema (reduced - subclasses use BaseSubclassSchema)
// ======================================================================================

export const BardClassSchema = BaseClassSchema.extend({
  name: z.literal('Bard'),
  subclasses: z.array(BaseSubclassSchema),
});

// Type export for convenience
export type BardClass = z.infer<typeof BardClassSchema>;
