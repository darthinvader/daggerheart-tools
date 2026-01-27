import { z } from 'zod';

import { ClassNameEnum, SubclassNameSchema } from '@/lib/schemas/core';

// Legacy schema for backward compatibility
export const ClassDraftSchema = z.object({
  className: ClassNameEnum,
  subclass: SubclassNameSchema,
});
export type ClassDraft = z.infer<typeof ClassDraftSchema>;
export const DEFAULT_CLASS: ClassDraft = {
  className: 'Warrior',
  subclass: 'Call of the Brave',
};
