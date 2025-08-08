import { z } from 'zod';

import { RangerCompanionSchema } from './companion-system';
import {
  CharacterTierSchema,
  CharacterTraitEnum,
  DomainNameEnum,
  EquipmentFeatureTypeSchema,
  WeaponTraitEnum,
} from './enums';

// Base Feature Schemas
// ======================================================================================

// Unified base feature schema used across all systems
export const BaseFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  // Allow homebrew feature types beyond the standard three
  type: z
    .union([z.enum(['passive', 'active', 'triggered']), z.string()])
    .optional(),
  // Optional tag(s) for indexing or equipment feature categories
  tags: z.array(EquipmentFeatureTypeSchema).optional(),
  // Arbitrary metadata for homebrew module authors
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Feature availability based on character tier and specific unlock conditions
export const FeatureAvailabilitySchema = z.object({
  tier: CharacterTierSchema,
  minLevel: z.number().int().min(1).max(10),
  // Accept known strings or any custom condition label
  unlockCondition: z
    .union([
      z.enum([
        'Starting feature',
        'Take an upgraded subclass card',
        'Automatic at level',
        'Choose from level-up options',
      ]),
      z.string(),
    ])
    .optional(),
});

export const SubclassFeatureSchema = BaseFeatureSchema.extend({
  // Permit custom tiers/feature categories beyond the standard three
  type: z.union([
    z.enum(['foundation', 'specialization', 'mastery']),
    z.string(),
  ]),
  level: z.number().int().min(1).max(10).optional(),
  availability: FeatureAvailabilitySchema.optional(),
});

export const HopeFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  hopeCost: z.number().int().min(1),
});

// Base subclass schema to reduce duplication across class files
export const BaseSubclassSchema = z.object({
  name: z.string(),
  description: z.string(),
  spellcastTrait: z
    .union([
      CharacterTraitEnum,
      z.literal('Spellcast'),
      z.never(), // For non-spellcasting classes
      z.string(), // Allow custom/setting-specific spellcasting trait names
    ])
    .optional(),
  features: z.array(SubclassFeatureSchema),
  // Optional companion support (e.g., Ranger Beastbound)
  companion: RangerCompanionSchema.optional(),
});

// Base Class Schema
// ======================================================================================

export const BaseClassSchema = z.object({
  name: z.string(),
  description: z.string(),
  // Permit homebrew to add additional domains if a setting allows
  domains: z.array(DomainNameEnum).min(1).max(3),
  startingEvasion: z.number().int(),
  startingHitPoints: z.number().int(),
  classItems: z.array(z.string()),
  hopeFeature: HopeFeatureSchema,
  classFeatures: z.array(BaseFeatureSchema),
  backgroundQuestions: z.array(z.string()),
  connections: z.array(z.string()),
});

// Type exports for convenience
export type DomainName = z.infer<typeof DomainNameEnum>;
export type CharacterTrait = z.infer<typeof CharacterTraitEnum>;
export type WeaponTrait = z.infer<typeof WeaponTraitEnum>;
export type CharacterTier = z.infer<typeof CharacterTierSchema>;
export type BaseFeature = z.infer<typeof BaseFeatureSchema>;
export type SubclassFeature = z.infer<typeof SubclassFeatureSchema>;
export type HopeFeature = z.infer<typeof HopeFeatureSchema>;
export type BaseSubclass = z.infer<typeof BaseSubclassSchema>;
export type BaseClass = z.infer<typeof BaseClassSchema>;
