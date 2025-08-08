import { z } from 'zod';

import { COMPANION_UPGRADES } from '../../data/core/companion-upgrades';

// Ranger Companion System
// ======================================================================================

export { COMPANION_UPGRADES };

export const CompanionUpgradeSchema = z.object({
  name: z.enum([
    'Intelligent',
    'Light in the Dark',
    'Creature Comfort',
    'Armored',
    'Vicious',
    'Resilient',
    'Bonded',
    'Aware',
  ]),
  description: z.string(),
  benefit: z.string(),
});

export const RangerCompanionSchema = z.object({
  name: z.string(),
  type: z.string(), // e.g., "Wolf", "Bear", "Hawk"
  hitPoints: z.number().int().min(1),
  armor: z.number().int().min(0),
  evasion: z.number().int().min(0),
  stress: z.number().int().min(0).max(6),

  // Companion action
  action: z.object({
    name: z.string(),
    description: z.string(),
    damage: z.string().optional(),
  }),

  // Companion progression based on character tier
  upgrades: z.array(CompanionUpgradeSchema).max(8), // Up to 8 upgrades available

  // Inventory specific to companion
  inventory: z.array(z.string()).optional(),
});

// Type exports for convenience
export type CompanionUpgrade = z.infer<typeof CompanionUpgradeSchema>;
export type RangerCompanion = z.infer<typeof RangerCompanionSchema>;
