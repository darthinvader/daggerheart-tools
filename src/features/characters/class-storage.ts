import { z } from 'zod';

import {
  DEFAULT_CLASS_DRAFT,
  type HomebrewClass,
  HomebrewClassSchema,
  type ClassDraft as NewClassDraft,
  ClassDraftSchema as NewClassDraftSchema,
} from '@/lib/schemas/class-selection';
import { ClassNameEnum, SubclassNameSchema } from '@/lib/schemas/core';
import { characterKeys as keys, storage } from '@/lib/storage';

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

// Legacy read/write functions for existing code
export function readClassFromStorage(id: string): ClassDraft {
  return storage.read(keys.class(id), DEFAULT_CLASS, ClassDraftSchema);
}
export function writeClassToStorage(id: string, value: ClassDraft) {
  storage.write(keys.class(id), value);
}

// New class draft functions with homebrew support
export function readClassDraftFromStorage(id: string): NewClassDraft {
  const raw = storage.read(keys.classDraft(id), DEFAULT_CLASS_DRAFT);
  const parsed = NewClassDraftSchema.safeParse(raw);
  return parsed.success ? parsed.data : DEFAULT_CLASS_DRAFT;
}

export function writeClassDraftToStorage(id: string, value: NewClassDraft) {
  storage.write(keys.classDraft(id), value);
}

// Homebrew classes storage
export function readHomebrewClassesFromStorage(id: string): HomebrewClass[] {
  const raw = storage.read(keys.homebrewClasses(id), []);
  const parsed = z.array(HomebrewClassSchema).safeParse(raw);
  return parsed.success ? parsed.data : [];
}

export function writeHomebrewClassesToStorage(
  id: string,
  value: HomebrewClass[]
) {
  storage.write(keys.homebrewClasses(id), value);
}

export function addHomebrewClass(id: string, homebrewClass: HomebrewClass) {
  const existing = readHomebrewClassesFromStorage(id);
  const filtered = existing.filter(c => c.name !== homebrewClass.name);
  writeHomebrewClassesToStorage(id, [...filtered, homebrewClass]);
}

export function removeHomebrewClass(id: string, className: string) {
  const existing = readHomebrewClassesFromStorage(id);
  writeHomebrewClassesToStorage(
    id,
    existing.filter(c => c.name !== className)
  );
}
