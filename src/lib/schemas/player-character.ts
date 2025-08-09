import { z } from 'zod';

// identity data imports no longer needed here; using explicit enums instead
// Import shared schemas from consolidated core module
import {
  AncestryNameSchema,
  BaseFeatureSchema,
  CharacterProgressionSchema,
  CharacterTraitEnum,
  CharacterTraitSchema,
  ClassNameSchema,
  CommunityNameSchema,
  ConditionNameSchema,
  DomainNameSchema,
  LevelUpPointSystemSchema,
  NameDescriptionSchema,
  RallyDieEnum,
  RangerCompanionSchema,
  ScoreSchema,
  SubclassNameSchema,
} from './core';
import { DomainCardCollectionSchema } from './domains';
// Import equipment schemas
import {
  ArmorSchema,
  ArmorStatusSchema,
  DamageThresholdsSchema,
  EquipmentLoadoutSchema,
  InventorySchema,
  WeaponSchema,
} from './equipment';

// Subclass enums are consolidated in core.ts

// Core Character Stats
// ======================================================================================

const HitPointsSchema = ScoreSchema.extend({
  thresholds: DamageThresholdsSchema,
});

const StressSchema = ScoreSchema;

const ArmorScoreSchema = ScoreSchema;

const GoldSchema = z.object({
  handfuls: z.number().int().min(0).default(0),
  bags: z.number().int().min(0).default(0),
  chests: z.number().int().min(0).default(0),
});

const PlayerDomainSchema = z.object({
  name: DomainNameSchema,
  cards: DomainCardCollectionSchema,
});

const CharacterTraitStateSchema = z.object({
  value: z.number().int(),
  marked: z.boolean().default(false),
});

const CharacterTraitsSchema = z.record(
  CharacterTraitEnum,
  CharacterTraitStateSchema
);

// Experiences: named narrative edges tied to a trait and optional notes
const ExperienceSchema = z.object({
  name: z.string(),
  trait: CharacterTraitSchema.optional(),
  bonus: z.number().int().min(1).max(2).default(2), // SRD often uses +2 starting experiences
  notes: z.string().optional(),
});
const ExperienceCollectionSchema = z.array(ExperienceSchema);

// Identity & Background
// ======================================================================================

// Use flexible name schemas directly (allowing homebrew)

const AbilitySchema = NameDescriptionSchema;

const IdentitySchema = z.object({
  name: z.string(),
  pronouns: z.string(),
  ancestry: AncestryNameSchema,
  community: CommunityNameSchema,
  description: z.string(),
  calling: z.string(),
  abilities: z.array(AbilitySchema),
});

// Class & Subclass
// ======================================================================================

const ClassDetailsSchema = z.object({
  name: ClassNameSchema,
  subclass: SubclassNameSchema,
  features: z.array(BaseFeatureSchema),
  domains: z.array(PlayerDomainSchema),
});

// Full Player Character Schema
// ======================================================================================

export const PlayerCharacterSchema = z.object({
  // Core Identity
  identity: IdentitySchema,
  level: z.number().int().min(1).max(10),

  // Core Stats
  traits: CharacterTraitsSchema,
  hp: HitPointsSchema,
  stress: StressSchema.default({ current: 0, max: 6 }),
  armorScore: ArmorScoreSchema,
  evasion: z.number().int().min(0).default(10), // SRD: Start at 10
  hope: ScoreSchema.default({ current: 2, max: 6 }),
  proficiency: z.number().int().min(1).default(1),
  rallyDie: z.union([RallyDieEnum, z.string()]).default('d6').optional(),

  // Class & Domains
  classDetails: ClassDetailsSchema,
  multiclass: z.array(ClassNameSchema).optional(),

  // Domain card collections
  domainCards: DomainCardCollectionSchema, // All available domain cards
  vault: DomainCardCollectionSchema, // Stored/inactive domain cards
  loadout: DomainCardCollectionSchema, // Active domain cards ready for use

  // Equipment
  equipment: EquipmentLoadoutSchema,
  inventory: InventorySchema,
  armorStatus: ArmorStatusSchema.optional(),
  weapons: z.array(WeaponSchema),
  armor: z.array(ArmorSchema),
  gold: GoldSchema.default({ handfuls: 1, bags: 0, chests: 0 }),
  conditions: z.array(ConditionNameSchema).default([]),

  // Experience & Connections
  // XP total for leveling
  experience: z.number().int().min(0).default(0),
  // Narrative experiences usable with Hope
  experiences: ExperienceCollectionSchema.default([]),
  connections: z.array(z.string()).optional(),
  // Level progression tracking (optional; rules engine can compute if omitted)
  progression: z
    .object({
      rules: LevelUpPointSystemSchema,
      state: CharacterProgressionSchema,
    })
    .optional(),

  // Ranger Companion
  companion: RangerCompanionSchema.optional(), // Optional for Beastbound subclass
});

export type PlayerCharacter = z.infer<typeof PlayerCharacterSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
