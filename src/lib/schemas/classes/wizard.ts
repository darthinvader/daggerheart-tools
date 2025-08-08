import { z } from 'zod';

import { BaseClassSchema, BaseSubclassSchema } from '../core';

// Wizard Class Schema (reduced)
// ======================================================================================

export const WizardClassSchema = BaseClassSchema.extend({
  name: z.literal('Wizard'),
  subclasses: z.array(BaseSubclassSchema),
});

export type WizardClass = z.infer<typeof WizardClassSchema>;
