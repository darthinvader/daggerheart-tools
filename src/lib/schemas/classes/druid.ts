import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Druid Class Schema (reduced)
// ======================================================================================

export const DruidClassSchema = BaseClassSchema.extend({
  name: z.literal('Druid'),
  subclasses: z.array(BaseSubclassSchema),
});

export type DruidClass = z.infer<typeof DruidClassSchema>;
