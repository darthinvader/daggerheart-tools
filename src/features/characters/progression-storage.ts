import {
  type LevelUpEntry,
  LevelUpEntrySchema,
} from '@/lib/schemas/character-state';
import { getTierForLevel } from '@/lib/schemas/core';
import { characterKeys as keys, storage } from '@/lib/storage';

export { LevelUpEntrySchema };
export type { LevelUpEntry };

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
