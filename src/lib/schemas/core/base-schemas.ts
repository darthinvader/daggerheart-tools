import { z } from 'zod';

// Domain and Trait Enums
// ======================================================================================

export const DomainNameEnum = z.enum([
  'Arcana',
  'Blade',
  'Bone',
  'Codex',
  'Grace',
  'Midnight',
  'Sage',
  'Splendor',
  'Valor',
]);

// Core character traits used for rolls and abilities
export const CharacterTraitEnum = z.enum([
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
]);

// Extended trait enum for weapons and equipment (includes Spellcast)
export const WeaponTraitEnum = z.enum([
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
  'Spellcast',
]);

// Character tier levels (based on character sheet analysis)
export const CharacterTierSchema = z.enum(['1', '2-4', '5-7', '8-10']);

// Base Feature Schemas
// ======================================================================================

// Unified base feature schema used across all systems
export const BaseFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['passive', 'active', 'triggered']).optional(),
});

// Specialized feature schemas extending base
export const ClassFeatureSchema = BaseFeatureSchema.extend({
  // Class features inherit all base properties
});

export const EquipmentFeatureSchema = BaseFeatureSchema.extend({
  // Equipment features inherit all base properties
});

// Feature availability based on character tier and specific unlock conditions
export const FeatureAvailabilitySchema = z.object({
  tier: CharacterTierSchema,
  minLevel: z.number().int().min(1).max(10),
  unlockCondition: z
    .enum([
      'Starting feature',
      'Take an upgraded subclass card',
      'Automatic at level',
      'Choose from level-up options',
    ])
    .optional(),
});

export const SubclassFeatureSchema = BaseFeatureSchema.extend({
  type: z.enum(['foundation', 'specialization', 'mastery']),
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
    ])
    .optional(),
  features: z.array(SubclassFeatureSchema),
});

// Base Class Schema
// ======================================================================================

export const BaseClassSchema = z.object({
  name: z.string(),
  description: z.string(),
  domains: z.array(DomainNameEnum).length(2),
  startingEvasion: z.number().int(),
  startingHitPoints: z.number().int(),
  classItems: z.array(z.string()),
  hopeFeature: HopeFeatureSchema,
  classFeatures: z.array(ClassFeatureSchema),
  backgroundQuestions: z.array(z.string()),
  connections: z.array(z.string()),
});

// Type exports for convenience
export type DomainName = z.infer<typeof DomainNameEnum>;
export type CharacterTrait = z.infer<typeof CharacterTraitEnum>;
export type WeaponTrait = z.infer<typeof WeaponTraitEnum>;
export type CharacterTier = z.infer<typeof CharacterTierSchema>;
export type BaseFeature = z.infer<typeof BaseFeatureSchema>;
export type ClassFeature = z.infer<typeof ClassFeatureSchema>;
export type EquipmentFeature = z.infer<typeof EquipmentFeatureSchema>;
export type SubclassFeature = z.infer<typeof SubclassFeatureSchema>;
export type HopeFeature = z.infer<typeof HopeFeatureSchema>;
export type BaseSubclass = z.infer<typeof BaseSubclassSchema>;
export type BaseClass = z.infer<typeof BaseClassSchema>;
