import { z } from 'zod';

// identity data imports no longer needed here; using explicit enums instead
// Import shared schemas from consolidated core module
import {
  AncestryNameEnum,
  BardSubclassEnum,
  BaseFeatureSchema,
  CharacterTraitEnum,
  ClassNameEnum,
  CommunityNameEnum,
  DomainNameEnum,
  DruidSubclassEnum,
  GuardianSubclassEnum,
  RangerCompanionSchema,
  RangerSubclassEnum,
  RogueSubclassEnum,
  SeraphSubclassEnum,
  SorcererSubclassEnum,
  WarriorSubclassEnum,
  WizardSubclassEnum,
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

const HitPointsSchema = z.object({
  current: z.number().int(),
  max: z.number().int(),
  thresholds: DamageThresholdsSchema,
});

const StressSchema = z.object({
  current: z.number().int(),
  max: z.number().int(),
});

const ArmorScoreSchema = z.object({
  current: z.number().int(),
  max: z.number().int(),
});

const GoldSchema = z.object({
  handfuls: z.number().int().min(0).default(0),
  bags: z.number().int().min(0).default(0),
  chests: z.number().int().min(0).default(0),
});

const PlayerDomainSchema = z.object({
  name: DomainNameEnum,
  cards: DomainCardCollectionSchema,
});

const CharacterTraitSchema = z.object({
  value: z.number().int(),
  marked: z.boolean().default(false),
});

const CharacterTraitsSchema = z.record(
  CharacterTraitEnum,
  CharacterTraitSchema
);

// Experiences: named narrative edges tied to a trait and optional notes
const ExperienceSchema = z.object({
  name: z.string(),
  trait: CharacterTraitEnum,
  bonus: z.number().int().min(1).max(2).default(2), // SRD often uses +2 starting experiences
  notes: z.string().optional(),
});
const ExperienceCollectionSchema = z.array(ExperienceSchema);

// Identity & Background
// ======================================================================================

// Use explicit enums to avoid runtime coupling to data arrays
const AncestryEnum = AncestryNameEnum;
const CommunityEnum = CommunityNameEnum;

const AbilitySchema = z.object({
  name: z.string(),
  description: z.string(),
});

const IdentitySchema = z.object({
  name: z.string(),
  pronouns: z.string(),
  ancestry: AncestryEnum,
  community: CommunityEnum,
  description: z.string(),
  calling: z.string(),
  abilities: z.array(AbilitySchema),
});

// Class & Subclass
// ======================================================================================

const ClassDetailsSchema = z.object({
  name: ClassNameEnum,
  subclass: z.union([
    BardSubclassEnum,
    DruidSubclassEnum,
    GuardianSubclassEnum,
    RangerSubclassEnum,
    RogueSubclassEnum,
    SeraphSubclassEnum,
    SorcererSubclassEnum,
    WarriorSubclassEnum,
    WizardSubclassEnum,
  ]),
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
  stress: StressSchema,
  armorScore: ArmorScoreSchema,
  evasion: z.number().int().min(0).default(10), // SRD: Start at 10
  hope: z.number().int().min(0).default(0),
  proficiency: z.number().int().min(1).default(1),

  // Class & Domains
  classDetails: ClassDetailsSchema,

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
  gold: GoldSchema,

  // Experience & Connections
  // XP total for leveling
  experience: z.number().int().min(0).default(0),
  // Narrative experiences usable with Hope
  experiences: ExperienceCollectionSchema.default([]),
  connections: z.array(z.string()).optional(),

  // Ranger Companion
  companion: RangerCompanionSchema.optional(), // Optional for Beastbound subclass
});

export type PlayerCharacter = z.infer<typeof PlayerCharacterSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
