import { z } from 'zod';

import {
  BackgroundSchema,
  CharacterTraitsSchema,
  ConnectionSchema,
  DescriptionDetailsSchema,
  ExperiencesSchema,
  GoldSchema,
  LevelUpEntrySchema,
} from './character-state';
import {
  AncestryNameSchema,
  BaseFeatureSchema,
  CharacterProgressionSchema,
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
import {
  ArmorSchema,
  ArmorStatusSchema,
  DamageThresholdsSchema,
  EquipmentLoadoutSchema,
  InventorySchema,
  WeaponSchema,
} from './equipment';

// Core Character Stats
// ======================================================================================

const HitPointsSchema = ScoreSchema.extend({
  thresholds: DamageThresholdsSchema,
});

const StressSchema = ScoreSchema;

const ArmorScoreSchema = ScoreSchema;

const PlayerDomainSchema = z.object({
  name: DomainNameSchema,
  cards: DomainCardCollectionSchema,
});

const AbilitySchema = NameDescriptionSchema;

const IdentitySchema = z.object({
  name: z.string(),
  pronouns: z.string(),
  ancestry: AncestryNameSchema,
  community: CommunityNameSchema,
  description: z.string(),
  calling: z.string(),
  background: BackgroundSchema.optional(),
  descriptionDetails: DescriptionDetailsSchema.optional(),
  connections: z.array(ConnectionSchema).optional(),
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
  evasion: z.number().int().min(0).default(10),
  hope: ScoreSchema.default({ current: 2, max: 6 }),
  proficiency: z.number().int().min(1).default(1),
  rallyDie: z.union([RallyDieEnum, z.string()]).default('d6').optional(),

  // Class & Domains
  classDetails: ClassDetailsSchema,
  multiclass: z.array(ClassNameSchema).optional(),

  // Domain card collections
  domainCards: DomainCardCollectionSchema,
  vault: DomainCardCollectionSchema,
  loadout: DomainCardCollectionSchema,

  // Equipment
  equipment: EquipmentLoadoutSchema,
  inventory: InventorySchema,
  armorStatus: ArmorStatusSchema.optional(),
  weapons: z.array(WeaponSchema),
  armor: z.array(ArmorSchema),
  gold: GoldSchema.default({
    handfuls: 1,
    bags: 0,
    chests: 0,
    coins: 0,
    showCoins: false,
    displayDenomination: 'handfuls',
  }),
  conditions: z.array(ConditionNameSchema).default([]),

  // Experience & Connections
  experience: z.number().int().min(0).default(0),
  experiences: ExperiencesSchema.default([]),
  connections: z.array(z.string()).optional(),
  progression: z
    .object({
      rules: LevelUpPointSystemSchema,
      state: CharacterProgressionSchema,
    })
    .optional(),
  leveling: z.array(LevelUpEntrySchema).default([]).optional(),

  // Ranger Companion
  companion: RangerCompanionSchema.optional(),
});

export type PlayerCharacter = z.infer<typeof PlayerCharacterSchema>;
