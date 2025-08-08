import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Sorcerer Class Schema (reduced)
// ======================================================================================

export const SorcererClassSchema = BaseClassSchema.extend({
  name: z.literal('Sorcerer'),
  subclasses: z.array(BaseSubclassSchema),
});

export type SorcererClass = z.infer<typeof SorcererClassSchema>;
