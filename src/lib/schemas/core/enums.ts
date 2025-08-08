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
  'Chaos',
  'Moon',
  'Sun',
  'Blood',
  'Fate',
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

// (moved to bottom)
// Explicit value enums for identity and class systems
// ======================================================================================

// Class names discriminator
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

// Subclass name enums (explicit string values only)
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

// Identity enums (explicit values). Includes 'Mixed' sentinel ancestry.
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

// Homebrew-friendly union wrappers (accept known enums or custom strings)
// ======================================================================================

export const DomainNameSchema = z.union([DomainNameEnum, z.string()]);
export const ClassNameSchema = z.union([ClassNameEnum, z.string()]);
export const AncestryNameSchema = z.union([AncestryNameEnum, z.string()]);
export const CommunityNameSchema = z.union([CommunityNameEnum, z.string()]);
export const EquipmentFeatureTypeSchema = z.union([
  EquipmentFeatureTypeEnum,
  z.string(),
]);
export const WeaponTraitSchema = z.union([WeaponTraitEnum, z.string()]);

// Subclass union across all classes (or custom)
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
