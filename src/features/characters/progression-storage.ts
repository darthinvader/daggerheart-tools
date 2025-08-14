import { z } from 'zod';

import {
  CharacterProgressionSchema,
  getTierForLevel,
} from '@/lib/schemas/core';
import { characterKeys as keys, storage } from '@/lib/storage';

export type CharacterProgressionDraft = {
  currentLevel: number;
  currentTier: ReturnType<typeof getTierForLevel>;
  availablePoints: number;
  spentOptions: Record<string, number>;
};

export function readLevelFromStorage(id: string): number {
  const n = storage.read<number>(keys.level(id), 1);
  return Number.isFinite(n) && n >= 1 && n <= 10 ? n : 1;
}
export function writeLevelToStorage(id: string, value: number) {
  const v = Math.max(1, Math.min(10, Math.floor(value)));
  storage.write(keys.level(id), v);
}

export function readProgressionFromStorage(
  id: string
): CharacterProgressionDraft {
  const level = readLevelFromStorage(id);
  const fallback: CharacterProgressionDraft = {
    currentLevel: level,
    currentTier: getTierForLevel(level),
    availablePoints: 2,
    spentOptions: {},
  };
  try {
    const raw = storage.read(keys.progression(id), fallback);
    // Validate against schema shape but coerce to draft
    const parsed = CharacterProgressionSchema.parse(raw);
    return {
      currentLevel: parsed.currentLevel,
      currentTier: parsed.currentTier,
      availablePoints: parsed.availablePoints,
      spentOptions: parsed.spentOptions,
    };
  } catch {
    return fallback;
  }
}
export function writeProgressionToStorage(
  id: string,
  value: CharacterProgressionDraft
) {
  storage.write(keys.progression(id), value);
}

// Level-up history entries (lightweight and decoupled from full PlayerCharacter)
export const LevelUpEntrySchema = z.object({
  level: z.number().int().min(1).max(10),
  selections: z.record(z.string(), z.number().int().min(0)).default({}),
  notes: z.string().optional(),
});
export type LevelUpEntry = z.infer<typeof LevelUpEntrySchema>;

export function readLevelingFromStorage(id: string): LevelUpEntry[] {
  const fallback: LevelUpEntry[] = [];
  try {
    const raw = storage.read(keys.leveling(id), fallback);
    const parsed = z.array(LevelUpEntrySchema).safeParse(raw);
    if (parsed.success) return parsed.data;
    return fallback;
  } catch {
    return fallback;
  }
}

export function writeLevelingToStorage(id: string, entries: LevelUpEntry[]) {
  storage.write(keys.leveling(id), entries);
}
