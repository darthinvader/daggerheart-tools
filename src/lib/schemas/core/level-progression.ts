import { z } from 'zod';

import {
  LEVEL_PROGRESSION,
  LEVEL_UP_OPTIONS,
} from '../../data/core/level-progression';
import { CharacterTierSchema } from './enums';

// Level Progression Constants
// ======================================================================================

export { LEVEL_PROGRESSION, LEVEL_UP_OPTIONS };

// Level-Up Point System Schemas
// ======================================================================================

export const LevelUpOptionSchema = z.object({
  cost: z.number().int().min(1),
  maxSelections: z.number().int().min(1),
});

export const TierLevelUpOptionsSchema = z.record(
  z.string(),
  LevelUpOptionSchema
);

export const LevelUpPointSystemSchema = z.object({
  POINTS_PER_LEVEL: z.literal(2),
  TIER_2: TierLevelUpOptionsSchema,
  TIER_3: TierLevelUpOptionsSchema,
  TIER_4: TierLevelUpOptionsSchema,
});

// Character Progression Tracking
export const CharacterProgressionSchema = z.object({
  currentLevel: z.number().int().min(1).max(10),
  currentTier: CharacterTierSchema,
  availablePoints: z.number().int().min(0),
  spentOptions: z.record(z.string(), z.number().int().min(0)),
});

// Type exports for convenience
export type LevelUpOption = z.infer<typeof LevelUpOptionSchema>;
export type TierLevelUpOptions = z.infer<typeof TierLevelUpOptionsSchema>;
export type LevelUpPointSystem = z.infer<typeof LevelUpPointSystemSchema>;
export type CharacterProgression = z.infer<typeof CharacterProgressionSchema>;

// Utility: derive tier from level (string enum alignment)
export function getTierForLevel(level: number) {
  if (level <= 1) return '1' as const;
  if (level <= 4) return '2-4' as const;
  if (level <= 7) return '5-7' as const;
  return '8-10' as const;
}
