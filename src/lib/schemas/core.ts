import { z } from 'zod';

// Data imports used by core schemas
import { COMPANION_UPGRADES } from '../data/core/companion-upgrades';
import {
  LEVEL_PROGRESSION,
  LEVEL_UP_OPTIONS,
} from '../data/core/level-progression';

// =====================================================================================
// Enums and Basic Schemas (from core/enums.ts)
// =====================================================================================

// Per RAW (page 24): The following domains are included in this book:
// Arcana, Blade, Bone, Codex, Grace, Midnight, Sage, Splendor, and Valor
// Additional domains (Chaos, Moon, Sun, Blood, Fate) are homebrew/expansion content
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

// Homebrew domain names for expansion content
export const HomebrewDomainNameEnum = z.enum([
  'Chaos',
  'Moon',
  'Sun',
  'Blood',
  'Fate',
]);

// Combined list of all known domain names (standard + homebrew)
export const ALL_KNOWN_DOMAINS = [
  ...DomainNameEnum.options,
  ...HomebrewDomainNameEnum.options,
] as const;

export const CharacterTraitEnum = z.enum([
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
]);

export const WeaponTraitEnum = z.enum([
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
  'Spellcast',
]);

export const CharacterTierSchema = z.enum(['1', '2-4', '5-7', '8-10']);

export const EquipmentFeatureTypeEnum = z.enum([
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
  'Reliable',
  'Brutal',
  'Quick',
  'Paired',
  'Protective',
  'Barrier',
  'Startling',
  'Hooked',
  'Double Duty',
  'Parry',
  'Returning',
  'Deflecting',
  'Charged',
  'Versatile',
  'Sheltering',
  'Doubled Up',
  'Locked On',
]);

// -------------------------------------------------------------------------------------
// Extracted constants/enums for reuse (WHY: enable homebrew by reusing + widening)
// -------------------------------------------------------------------------------------

export const FeatureTypeEnum = z.enum(['passive', 'active', 'triggered']);
export const SubclassFeatureTypeEnum = z.enum([
  'foundation',
  'specialization',
  'mastery',
]);
export const UnlockConditionEnum = z.enum([
  'Starting feature',
  'Take an upgraded subclass card',
  'Automatic at level',
  'Choose from level-up options',
]);
// Standard polyhedral dice; pair with unionWithString to allow more
export const RallyDieEnum = z.enum(['d4', 'd6', 'd8', 'd10', 'd12']);

export const ClassNameEnum = z.enum([
  'Bard',
  'Druid',
  'Guardian',
  'Ranger',
  'Rogue',
  'Seraph',
  'Sorcerer',
  'Warrior',
  'Wizard',
]);

export const BardSubclassEnum = z.enum(['Troubadour', 'Wordsmith']);
export const DruidSubclassEnum = z.enum([
  'Warden of the Elements',
  'Warden of Renewal',
]);
export const GuardianSubclassEnum = z.enum(['Stalwart', 'Vengeance']);
export const RangerSubclassEnum = z.enum(['Beastbound', 'Wayfinder']);
export const RogueSubclassEnum = z.enum(['Nightwalker', 'Syndicate']);
export const SeraphSubclassEnum = z.enum(['Divine Wielder', 'Winged Sentinel']);
export const SorcererSubclassEnum = z.enum([
  'Elemental Origin',
  'Primal Origin',
]);
export const WarriorSubclassEnum = z.enum([
  'Call of the Brave',
  'Call of the Slayer',
]);
export const WizardSubclassEnum = z.enum([
  'School of Knowledge',
  'School of War',
]);

export const AncestryNameEnum = z.enum([
  'Clank',
  'Drakona',
  'Dwarf',
  'Elf',
  'Faerie',
  'Faun',
  'Firbolg',
  'Fungril',
  'Galapa',
  'Giant',
  'Goblin',
  'Halfling',
  'Human',
  'Infernis',
  'Katari',
  'Orc',
  'Ribbet',
  'Simiah',
  'Mixed',
]);

export const CommunityNameEnum = z.enum([
  'Highborne',
  'Loreborne',
  'Orderborne',
  'Ridgeborne',
  'Seaborne',
  'Slyborne',
  'Underborne',
  'Wanderborne',
  'Wildborne',
]);

// -------------------------------------------------------------------------------------
// Shared helpers to reduce duplication
// -------------------------------------------------------------------------------------

export const MetadataSchema = z.record(z.string(), z.unknown()).optional();

export const NameDescriptionSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const ScoreSchema = z.object({
  current: z.number().int(),
  max: z.number().int(),
});

export const unionWithString = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([schema, z.string()]);

export const DomainNameSchema = unionWithString(DomainNameEnum);
export const ClassNameSchema = unionWithString(ClassNameEnum);
export const CharacterTraitSchema = unionWithString(CharacterTraitEnum);
export const AncestryNameSchema = unionWithString(AncestryNameEnum);
export const CommunityNameSchema = unionWithString(CommunityNameEnum);
export const EquipmentFeatureTypeSchema = unionWithString(
  EquipmentFeatureTypeEnum
);
export const WeaponTraitSchema = unionWithString(WeaponTraitEnum);

// Status conditions that can affect a player character; kept minimal and extensible
export const ConditionNameEnum = z.enum([
  'Poisoned',
  'Restrained',
  'Vulnerable',
  'Distracted',
]);
export const ConditionNameSchema = unionWithString(ConditionNameEnum);

export const SubclassNameSchema = z.union([
  z.union([
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
  z.string(),
]);

// =====================================================================================
// Companion System (from core/companion-system.ts)
// =====================================================================================

export { COMPANION_UPGRADES };

export const CompanionUpgradeNameEnum = z.enum([
  'Intelligent',
  'Light in the Dark',
  'Creature Comfort',
  'Armored',
  'Vicious',
  'Resilient',
  'Bonded',
  'Aware',
]);

export const CompanionUpgradeSchema = z.object({
  name: z.union([CompanionUpgradeNameEnum, z.string()]),
  description: z.string(),
  benefit: z.string(),
});

export const RangerCompanionSchema = z.object({
  name: z.string(),
  type: z.string(),
  hitPoints: z.number().int().min(1),
  armor: z.number().int().min(0),
  evasion: z.number().int().min(0),
  stress: z.number().int().min(0).max(6),
  action: z.object({
    name: z.string(),
    description: z.string(),
    damage: z.string().optional(),
  }),
  // Remove strict cap to allow homebrew companions with more upgrades
  upgrades: z.array(CompanionUpgradeSchema),
  inventory: z.array(z.string()).optional(),
});

export type CompanionUpgrade = z.infer<typeof CompanionUpgradeSchema>;
export type RangerCompanion = z.infer<typeof RangerCompanionSchema>;

// =====================================================================================
// Base Schemas (from core/base-schemas.ts)
// =====================================================================================

export const FeatureAvailabilitySchema = z.object({
  tier: CharacterTierSchema,
  minLevel: z.number().int().min(1).max(10),
  unlockCondition: z.union([UnlockConditionEnum, z.string()]).optional(),
});

export const BaseFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  // Feature type generalized via extracted enum + open union for homebrew
  type: z.union([FeatureTypeEnum, z.string()]).optional(),
  // Tags are free-form to allow broader categorization than equipment traits
  tags: z.array(z.string()).optional(),
  availability: FeatureAvailabilitySchema.optional(),
  metadata: MetadataSchema,
});

export const SubclassFeatureSchema = BaseFeatureSchema.extend({
  type: z.union([SubclassFeatureTypeEnum, z.string()]),
  level: z.number().int().min(1).max(10).optional(),
  availability: FeatureAvailabilitySchema.optional(),
});

export const HopeFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  hopeCost: z.number().int().min(1),
});

export const BaseSubclassSchema = z.object({
  name: z.string(),
  description: z.string(),
  spellcastTrait: z
    .union([CharacterTraitEnum, z.literal('Spellcast'), z.never(), z.string()])
    .optional(),
  features: z.array(SubclassFeatureSchema),
  companion: RangerCompanionSchema.optional(),
});

export const BaseClassSchema = z.object({
  name: z.string(),
  description: z.string(),
  // Allow homebrew domain names via open union
  domains: z.array(DomainNameSchema).length(2),
  startingEvasion: z.number().int(),
  startingHitPoints: z.number().int(),
  classItems: z.array(z.string()),
  hopeFeature: HopeFeatureSchema,
  classFeatures: z.array(BaseFeatureSchema),
  backgroundQuestions: z.array(z.string()),
  connections: z.array(z.string()),
});

export type DomainName = z.infer<typeof DomainNameEnum>;
export type CharacterTrait = z.infer<typeof CharacterTraitEnum>;
export type WeaponTrait = z.infer<typeof WeaponTraitEnum>;
export type ConditionName = z.infer<typeof ConditionNameSchema>;
export type CharacterTier = z.infer<typeof CharacterTierSchema>;
export type BaseFeature = z.infer<typeof BaseFeatureSchema>;
export type ClassFeature = BaseFeature;
export type SubclassFeature = z.infer<typeof SubclassFeatureSchema>;
export type HopeFeature = z.infer<typeof HopeFeatureSchema>;
export type BaseSubclass = z.infer<typeof BaseSubclassSchema>;
export type BaseClass = z.infer<typeof BaseClassSchema>;

// =====================================================================================
// Level Progression (from core/level-progression.ts)
// =====================================================================================

export { LEVEL_PROGRESSION, LEVEL_UP_OPTIONS };

export const LevelUpOptionSchema = z.object({
  cost: z.number().int().min(1),
  maxSelections: z.number().int().min(1),
});

export const TierLevelUpOptionsSchema = z.record(
  z.string(),
  LevelUpOptionSchema
);

export const LevelUpPointSystemSchema = z.object({
  POINTS_PER_LEVEL: z.literal(2),
  TIER_2: TierLevelUpOptionsSchema,
  TIER_3: TierLevelUpOptionsSchema,
  TIER_4: TierLevelUpOptionsSchema,
});

export const CharacterProgressionSchema = z.object({
  currentLevel: z.number().int().min(1).max(10),
  currentTier: CharacterTierSchema,
  availablePoints: z.number().int().min(0),
  spentOptions: z.record(z.string(), z.number().int().min(0)),
});

export type LevelUpOption = z.infer<typeof LevelUpOptionSchema>;
export type TierLevelUpOptions = z.infer<typeof TierLevelUpOptionsSchema>;
export type LevelUpPointSystem = z.infer<typeof LevelUpPointSystemSchema>;
export type CharacterProgression = z.infer<typeof CharacterProgressionSchema>;

export function getTierForLevel(level: number) {
  if (level <= 1) return '1' as const;
  if (level <= 4) return '2-4' as const;
  if (level <= 7) return '5-7' as const;
  return '8-10' as const;
}
