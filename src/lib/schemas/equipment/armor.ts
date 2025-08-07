import { z } from 'zod';

import { ArmorSchema } from './base-equipment';

// Extended armor schemas for specific armor types
export const StandardArmorSchema = ArmorSchema.extend({
  armorType: z.enum(['Gambeson', 'Leather', 'Chainmail', 'Full Plate']),
  isStandard: z.literal(true),
});

export const SpecialArmorSchema = ArmorSchema.extend({
  armorType: z.string(), // Custom armor type name
  isStandard: z.literal(false),
  materialType: z.string().optional(), // e.g., "Elundrian", "Harrowbone", etc.
  originDescription: z.string().optional(),
});

// Armor feature types
export const ArmorFeatureTypeEnum = z.enum([
  'Flexible',
  'Heavy',
  'Very Heavy',
  'Warded',
  'Resilient',
  'Reinforced',
  'Shifting',
  'Quiet',
  'Hopeful',
  'Gilded',
  'Impenetrable',
  'Sharp',
  'Physical',
  'Magic',
  'Painful',
  'Timeslowing',
  'Channeling',
  'Burning',
  'Fortified',
  'Truthseeking',
  'Difficult',
]);

// Armor slot mechanics
export const ArmorSlotSchema = z.object({
  used: z.boolean().default(false),
  damageReduced: z.number().min(0).default(0),
});

export const ArmorStatusSchema = z.object({
  currentScore: z.number().min(0),
  slots: z.array(ArmorSlotSchema),
  needsRepair: z.boolean().default(false),
  damageThresholds: z.object({
    minor: z.number(),
    major: z.number(),
    severe: z.number(),
  }),
});

// Complete armor collection schema
export const ArmorCollectionSchema = z.object({
  standardArmor: z.array(StandardArmorSchema).default([]),
  specialArmor: z.array(SpecialArmorSchema).default([]),
});

// Type exports
export type StandardArmor = z.infer<typeof StandardArmorSchema>;
export type SpecialArmor = z.infer<typeof SpecialArmorSchema>;
export type ArmorFeatureType = z.infer<typeof ArmorFeatureTypeEnum>;
export type ArmorSlot = z.infer<typeof ArmorSlotSchema>;
export type ArmorStatus = z.infer<typeof ArmorStatusSchema>;
export type ArmorCollection = z.infer<typeof ArmorCollectionSchema>;
