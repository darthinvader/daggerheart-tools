import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Rogue Class Schema (reduced)
// ======================================================================================

export const RogueClassSchema = BaseClassSchema.extend({
  name: z.literal('Rogue'),
  subclasses: z.array(BaseSubclassSchema),
});

export type RogueClass = z.infer<typeof RogueClassSchema>;
