import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Warrior Class Schema (reduced)
// ======================================================================================

export const WarriorClassSchema = BaseClassSchema.extend({
  name: z.literal('Warrior'),
  subclasses: z.array(BaseSubclassSchema),
});

export type WarriorClass = z.infer<typeof WarriorClassSchema>;
