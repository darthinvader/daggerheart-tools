import { z } from 'zod';

import { ClassNameEnum, SubclassNameSchema } from '@/lib/schemas/core';
import { characterKeys as keys, storage } from '@/lib/storage';

export const ClassDraftSchema = z.object({
  className: ClassNameEnum,
  subclass: SubclassNameSchema,
});
export type ClassDraft = z.infer<typeof ClassDraftSchema>;
export const DEFAULT_CLASS: ClassDraft = {
  className: 'Warrior',
  subclass: 'Call of the Brave',
};
export function readClassFromStorage(id: string): ClassDraft {
  return storage.read(keys.class(id), DEFAULT_CLASS, ClassDraftSchema);
}
export function writeClassToStorage(id: string, value: ClassDraft) {
  storage.write(keys.class(id), value);
}
