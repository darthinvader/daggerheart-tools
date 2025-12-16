import { z } from 'zod';

import { CharacterTraitEnum, ScoreSchema } from './core';

// Armor score allows 0 for max (unarmored)
export const ArmorScoreSchema = z.object({
  current: z.number().int().min(0),
  max: z.number().int().min(0),
});

// Condition item (status effect)
export const ConditionItemSchema = z.object({
  name: z.string().min(1).max(40),
  description: z.string().optional(),
});
export const ConditionsSchema = z.array(ConditionItemSchema);

// Gold currency
export const GoldSchema = z.object({
  handfuls: z.number().int().min(0).default(1),
  bags: z.number().int().min(0).default(0),
  chests: z.number().int().min(0).default(0),
});

// Resources (hp, stress, hope, etc.)
export const ResourcesSchema = z.object({
  hp: ScoreSchema.default({ current: 10, max: 10 }),
  stress: ScoreSchema.default({ current: 0, max: 6 }),
  evasion: z.number().int().min(0).default(10),
  hope: ScoreSchema.default({ current: 2, max: 6 }),
  proficiency: z.number().int().min(1).default(1),
  armorScore: ArmorScoreSchema.default({ current: 0, max: 0 }),
  gold: GoldSchema.default({ handfuls: 1, bags: 0, chests: 0 }),
});

// Trait state (used by both store and PlayerCharacter)
export const TraitStateSchema = z.object({
  value: z.number().int().default(0),
  bonus: z.number().int().default(0),
  marked: z.boolean().default(false),
});
export const TraitsSchema = z.record(z.string(), TraitStateSchema);
export const CharacterTraitsSchema = z.record(
  CharacterTraitEnum,
  TraitStateSchema
);

// Experience entry
export const ExperienceEntrySchema = z.object({
  name: z.string().min(1),
  trait: z.string().optional(),
  bonus: z.number().int().min(1).default(2),
  notes: z.string().optional(),
});
export const ExperiencesSchema = z.array(ExperienceEntrySchema);

// Custom feature
export const CustomFeatureSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  level: z.number().int().min(1).max(10).default(1),
  tier: z
    .union([
      z.literal('1'),
      z.literal('2-4'),
      z.literal('5-7'),
      z.literal('8-10'),
    ])
    .optional(),
  unlockCondition: z.string().optional(),
});
export const CustomFeaturesSchema = z.array(CustomFeatureSchema);

// Thresholds settings
export const ThresholdsSettingsSchema = z.object({
  auto: z.boolean().default(true),
  values: z
    .object({
      major: z.number().int().min(0),
      severe: z.number().int().min(0),
      dsOverride: z.boolean().default(false),
      ds: z.number().int().min(0).default(0),
    })
    .refine(v => v.severe >= v.major, {
      message: 'Severe threshold must be >= Major',
    }),
  enableCritical: z.boolean().default(false),
});

// Background (freeform text or Q&A pairs)
export const BackgroundQAPairSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
export const BackgroundSchema = z.union([
  z.string(),
  z.array(BackgroundQAPairSchema),
]);

// Physical description details
export const DescriptionDetailsSchema = z.object({
  eyes: z.string().optional(),
  hair: z.string().optional(),
  skin: z.string().optional(),
  body: z.string().optional(),
  clothing: z.string().optional(),
  mannerisms: z.string().optional(),
  other: z.string().optional(),
});

// Connection (Q&A with optional player reference)
export const ConnectionSchema = z.object({
  prompt: z.string(),
  answer: z.string(),
  withPlayer: z
    .object({ id: z.string().optional(), name: z.string().optional() })
    .optional(),
});

// Level-up history entry
export const LevelUpEntrySchema = z.object({
  level: z.number().int().min(1).max(10),
  selections: z.record(z.string(), z.number().int().min(0)).default({}),
  notes: z.string().optional(),
});

// Inferred TypeScript types
export type Score = z.infer<typeof ScoreSchema>;
export type ArmorScore = z.infer<typeof ArmorScoreSchema>;
export type ConditionItem = z.infer<typeof ConditionItemSchema>;
export type ConditionsDraft = z.infer<typeof ConditionsSchema>;
export type Gold = z.infer<typeof GoldSchema>;
export type ResourcesDraft = z.infer<typeof ResourcesSchema>;
export type TraitState = z.infer<typeof TraitStateSchema>;
export type TraitsDraft = z.infer<typeof TraitsSchema>;
export type ExperienceDraft = z.infer<typeof ExperienceEntrySchema>;
export type ExperiencesDraft = z.infer<typeof ExperiencesSchema>;
export type CustomFeature = z.infer<typeof CustomFeatureSchema>;
export type CustomFeatures = z.infer<typeof CustomFeaturesSchema>;
export type ThresholdsSettings = z.infer<typeof ThresholdsSettingsSchema>;
export type BackgroundQAPair = z.infer<typeof BackgroundQAPairSchema>;
export type Background = z.infer<typeof BackgroundSchema>;
export type DescriptionDetails = z.infer<typeof DescriptionDetailsSchema>;
export type Connection = z.infer<typeof ConnectionSchema>;
export type LevelUpEntry = z.infer<typeof LevelUpEntrySchema>;

// Default values
export const DEFAULT_RESOURCES: ResourcesDraft = {
  hp: { current: 10, max: 10 },
  stress: { current: 0, max: 6 },
  evasion: 10,
  hope: { current: 2, max: 6 },
  proficiency: 1,
  armorScore: { current: 0, max: 0 },
  gold: { handfuls: 1, bags: 0, chests: 0 },
};

export const DEFAULT_TRAITS: TraitsDraft = {
  Agility: { value: 0, bonus: 0, marked: false },
  Strength: { value: 0, bonus: 0, marked: false },
  Finesse: { value: 0, bonus: 0, marked: false },
  Instinct: { value: 0, bonus: 0, marked: false },
  Presence: { value: 0, bonus: 0, marked: false },
  Knowledge: { value: 0, bonus: 0, marked: false },
};
