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

export const CharacterTraitEnum = z.enum([
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
]);

// Character tier levels (based on character sheet analysis)
export const CharacterTierSchema = z.enum(['1', '2-4', '5-7', '8-10']);

// Base Feature Schemas
// ======================================================================================

export const ClassFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['passive', 'active', 'triggered']).optional(),
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

export const SubclassFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['foundation', 'specialization', 'mastery']),
  level: z.number().int().min(1).max(10).optional(),
  availability: FeatureAvailabilitySchema.optional(),
});

export const HopeFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  hopeCost: z.number().int().min(1),
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
export type CharacterTier = z.infer<typeof CharacterTierSchema>;
export type ClassFeature = z.infer<typeof ClassFeatureSchema>;
export type SubclassFeature = z.infer<typeof SubclassFeatureSchema>;
export type HopeFeature = z.infer<typeof HopeFeatureSchema>;
export type BaseClass = z.infer<typeof BaseClassSchema>;
