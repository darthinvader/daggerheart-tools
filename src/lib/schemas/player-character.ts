import { z } from 'zod';

import { ANCESTRIES } from './ancestry';
import { COMMUNITIES } from './community';
// Import shared schemas from core
import { CharacterTraitEnum, ClassFeatureSchema } from './core/base-schemas';
import { RangerCompanionSchema } from './core/companion-system';
import {
  ARCANA_DOMAIN_CARDS,
  BLADE_DOMAIN_CARDS,
  BONE_DOMAIN_CARDS,
  CODEX_DOMAIN_CARDS,
  DomainCardCollectionSchema,
  DomainNameEnum,
  GRACE_DOMAIN_CARDS,
  MIDNIGHT_DOMAIN_CARDS,
  SAGE_DOMAIN_CARDS,
  SPLENDOR_DOMAIN_CARDS,
  VALOR_DOMAIN_CARDS,
} from './domains';

// Create enums that align with the subclass schemas from the classes system
// NOTE: These enum values must match the discriminated union schemas in each class file
// TODO: Consider creating utility to automatically extract these values from class schemas
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

const DamageThresholdsSchema = z.object({
  major: z.number().int(),
  severe: z.number().int(),
});

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

const AncestrySchema = z.object({
  name: AncestryEnum,
  abilities: z.array(AbilitySchema),
});

const CommunitySchema = z.object({
  name: CommunityEnum,
  abilities: z.array(AbilitySchema),
});

const ExperienceSchema = z.object({
  name: z.string(),
  modifier: z.number().int(),
});

const CharacterDescriptionSchema = z.object({
  clothes: z.string().optional(),
  eyes: z.string().optional(),
  body: z.string().optional(),
  skin: z.string().optional(),
  attitude: z.string().optional(),
});

// Class, Abilities & Equipment
// ======================================================================================

const DomainSchema = z.object({
  name: DomainNameEnum,
  cards: z.array(z.string()),
});

const WeaponSchema = z.object({
  name: z.string(),
  type: z.enum(['primary', 'secondary']),
  trait: CharacterTraitEnum,
  range: z.string(),
  damage: z.string(),
  damageType: z.enum(['physical', 'magic']),
  burden: z.enum(['one-handed', 'two-handed']),
  feature: z.string().optional(),
  properties: z.array(z.string()).optional(),
});

const ArmorSchema = z.object({
  name: z.string(),
  baseThresholds: DamageThresholdsSchema,
  baseScore: z.number().int(),
  feature: z.string().optional(),
});

const InventoryItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
});

// Advancement
// ======================================================================================

const TierOptionSchema = z.object({
  description: z.string(),
  selected: z.boolean().default(false),
});

const TierAdvancementSchema = z.object({
  levelRange: z.string(),
  options: z.array(TierOptionSchema),
});

// Player Character Schema
// ======================================================================================

const BaseCharacterSchema = z.object({
  name: z.string(),
  pronouns: z.string().optional(),
  level: z.number().int().min(1).max(10),
  ancestry: AncestrySchema,
  community: CommunitySchema,
  traits: CharacterTraitsSchema,
  hp: HitPointsSchema,
  stress: StressSchema,
  armorScore: ArmorScoreSchema,
  evasion: z.number().int(),
  hope: z.number().int().min(0),
  proficiency: z.number().int().min(1),

  // Domain card collections
  domainCards: DomainCardCollectionSchema, // All available domain cards
  vault: DomainCardCollectionSchema, // Stored/inactive domain cards
  loadout: DomainCardCollectionSchema, // Active domain cards ready for use

  // Legacy domains field for backward compatibility
  domains: z.array(DomainSchema).optional(),

  weapons: z.array(WeaponSchema),
  armor: z.array(ArmorSchema),
  inventory: z.array(InventoryItemSchema),
  gold: GoldSchema,
  experience: z.array(ExperienceSchema),
  connections: z.array(z.string()).optional(),
  backgroundQuestions: z.array(z.string()).optional(),
  characterDescription: CharacterDescriptionSchema.optional(),
  tierAdvancement: z.record(z.string(), TierAdvancementSchema), // e.g. "Tier 2", "Tier 3"
});

export const PlayerCharacterSchema = z
  .discriminatedUnion('characterClass', [
    BaseCharacterSchema.extend({
      characterClass: z.literal('Bard'),
      subclass: BardSubclassEnum,
      classFeatures: z.array(ClassFeatureSchema),
      spellcastingTrait: z.literal('Presence'),
    }),
    BaseCharacterSchema.extend({
      characterClass: z.literal('Druid'),
      subclass: DruidSubclassEnum,
      classFeatures: z.array(ClassFeatureSchema),
      spellcastingTrait: z.literal('Instinct'),
    }),
    BaseCharacterSchema.extend({
      characterClass: z.literal('Guardian'),
      subclass: GuardianSubclassEnum,
      classFeatures: z.array(ClassFeatureSchema),
      spellcastingTrait: z.never().optional(),
    }),
    BaseCharacterSchema.extend({
      characterClass: z.literal('Ranger'),
      subclass: RangerSubclassEnum,
      classFeatures: z.array(ClassFeatureSchema),
      spellcastingTrait: z.literal('Agility'),
      companion: RangerCompanionSchema.optional(), // Optional for Beastbound subclass
    }),
    BaseCharacterSchema.extend({
      characterClass: z.literal('Rogue'),
      subclass: RogueSubclassEnum,
      classFeatures: z.array(ClassFeatureSchema),
      spellcastingTrait: z.literal('Finesse'),
    }),
    BaseCharacterSchema.extend({
      characterClass: z.literal('Seraph'),
      subclass: SeraphSubclassEnum,
      classFeatures: z.array(ClassFeatureSchema),
      spellcastingTrait: z.literal('Strength'),
    }),
    BaseCharacterSchema.extend({
      characterClass: z.literal('Sorcerer'),
      subclass: SorcererSubclassEnum,
      classFeatures: z.array(ClassFeatureSchema),
      spellcastingTrait: z.literal('Instinct'),
    }),
    BaseCharacterSchema.extend({
      characterClass: z.literal('Warrior'),
      subclass: WarriorSubclassEnum,
      classFeatures: z.array(ClassFeatureSchema),
      spellcastingTrait: z.never().optional(),
    }),
    BaseCharacterSchema.extend({
      characterClass: z.literal('Wizard'),
      subclass: WizardSubclassEnum,
      classFeatures: z.array(ClassFeatureSchema),
      spellcastingTrait: z.literal('Knowledge'),
    }),
  ])
  .superRefine((val, ctx) => {
    // Legacy domains validation for backward compatibility
    if (val.domains) {
      val.domains.forEach((domain, index) => {
        let cardNames: string[] = [];
        switch (domain.name) {
          case 'Arcana':
            cardNames = ARCANA_DOMAIN_CARDS.map(card => card.name);
            break;
          case 'Blade':
            cardNames = BLADE_DOMAIN_CARDS.map(card => card.name);
            break;
          case 'Bone':
            cardNames = BONE_DOMAIN_CARDS.map(card => card.name);
            break;
          case 'Codex':
            cardNames = CODEX_DOMAIN_CARDS.map(card => card.name);
            break;
          case 'Grace':
            cardNames = GRACE_DOMAIN_CARDS.map(card => card.name);
            break;
          case 'Sage':
            cardNames = SAGE_DOMAIN_CARDS.map(card => card.name);
            break;
          case 'Midnight':
            cardNames = MIDNIGHT_DOMAIN_CARDS.map(card => card.name);
            break;
          case 'Splendor':
            cardNames = SPLENDOR_DOMAIN_CARDS.map(card => card.name);
            break;
          case 'Valor':
            cardNames = VALOR_DOMAIN_CARDS.map(card => card.name);
            break;
          case 'Chaos':
          case 'Moon':
          case 'Sun':
          case 'Blood':
          case 'Fate':
            // These domains have no cards yet, so any card name is invalid
            cardNames = [];
            break;
        }

        domain.cards.forEach((card, cardIndex) => {
          if (cardNames.length > 0 && !cardNames.includes(card)) {
            ctx.addIssue({
              code: 'custom',
              message: `Invalid card "${card}" for domain "${domain.name}"`,
              path: ['domains', index, 'cards', cardIndex],
            });
          }
        });
      });
    }
  });

export type PlayerCharacter = z.infer<typeof PlayerCharacterSchema>;
