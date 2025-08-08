import { z } from 'zod';

import { ANCESTRIES } from './ancestry';
import { COMMUNITIES } from './community';
// Import shared schemas from core
import { BaseFeatureSchema } from './core/base-schemas';
import { RangerCompanionSchema } from './core/companion-system';
import { CharacterTraitEnum, DomainNameEnum } from './core/enums';
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

// Create enums that align with the subclass schemas from the classes system
// NOTE: These enum values must match the discriminated union schemas in each class file
const BardSubclassEnum = z.enum(['Troubadour', 'Wordsmith']);
const DruidSubclassEnum = z.enum([
  'Warden of the Elements',
  'Warden of Renewal',
]);
const GuardianSubclassEnum = z.enum(['Stalwart', 'Vengeance']);
const RangerSubclassEnum = z.enum(['Beastbound', 'Wayfinder']);
const RogueSubclassEnum = z.enum(['Nightwalker', 'Syndicate']);
const SeraphSubclassEnum = z.enum(['Divine Wielder', 'Winged Sentinel']);
const SorcererSubclassEnum = z.enum(['Elemental Origin', 'Primal Origin']);
const WarriorSubclassEnum = z.enum(['Call of the Brave', 'Call of the Slayer']);
const WizardSubclassEnum = z.enum(['School of Knowledge', 'School of War']);

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

// Identity & Background
// ======================================================================================

// Create enums from imported ancestry and community data
const ancestryNames = ANCESTRIES.map(ancestry => ancestry.name).concat([
  'Mixed',
]);
const AncestryEnum = z.enum([ancestryNames[0], ...ancestryNames.slice(1)] as [
  string,
  ...string[],
]);

const communityNames = COMMUNITIES.map(community => community.name);
const CommunityEnum = z.enum([
  communityNames[0],
  ...communityNames.slice(1),
] as [string, ...string[]]);

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
  name: z.enum([
    'Bard',
    'Druid',
    'Guardian',
    'Ranger',
    'Rogue',
    'Seraph',
    'Sorcerer',
    'Warrior',
    'Wizard',
  ]),
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
  evasion: z.number().int(),
  hope: z.number().int().min(0),
  proficiency: z.number().int().min(1),

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
  experience: z.number().int().min(0).default(0),
  connections: z.array(z.string()).optional(),

  // Ranger Companion
  companion: RangerCompanionSchema.optional(), // Optional for Beastbound subclass
});

export type PlayerCharacter = z.infer<typeof PlayerCharacterSchema>;
