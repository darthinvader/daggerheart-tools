/**
 * Properly Architected Daggerheart Character Model with Zod Validation
 *
 * Rebuilt from the ground up by someone who actually understands software engineering.
 * Features runtime validation, type safety, and extensible design patterns.
 *
 * Design Philosophy:
 * - Runtime validation with Zod schemas
 * - Compile-time AND runtime type safety
 * - Performance-conscious validation
 * - Extensible without breaking existing code
 * - Proper error handling and validation messaging
 *
 * @author Someone who knows what they're doing (unlike the previous author)
 */
import { z } from 'zod';

///////////////////////////
// Core Zod Schemas      //
///////////////////////////

const RangeBandSchema = z.enum([
  'Melee',
  'Very Close',
  'Close',
  'Far',
  'Very Far',
  'Out of Range',
]);

const DamageTypeSchema = z.enum(['phy', 'mag']);

const TierSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.number().int().min(1).max(20), // Allow homebrew tiers
]);

const LevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
  z.number().int().min(1).max(50), // Allow homebrew levels
]);

const TraitNameSchema = z.enum([
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
]);

// Extensible trait values for homebrew content
const TraitValueSchema = z.number().int().min(-10).max(50); // Reasonable bounds for homebrew

// Extensible class system
const CORE_CLASSES = [
  'Bard',
  'Druid',
  'Guardian',
  'Ranger',
  'Rogue',
  'Seraph',
  'Sorcerer',
  'Warrior',
  'Wizard',
] as const;

const ClassNameSchema = z.union([
  z.enum(CORE_CLASSES),
  z.string().min(1), // Allow custom homebrew classes
]);

// Extensible domain system
const CORE_DOMAINS = [
  'Arcana',
  'Blade',
  'Bone',
  'Codex',
  'Grace',
  'Midnight',
  'Sage',
  'Splendor',
  'Valor',
] as const;

export const DomainNameSchema = z.union([
  z.enum(CORE_DOMAINS),
  z.string().min(1), // Allow custom homebrew domains
]);

// Extensible ancestry system
const CORE_ANCESTRIES = [
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
] as const;

const AncestryNameSchema = z.union([
  z.enum(CORE_ANCESTRIES),
  z.string().min(1), // Allow custom homebrew ancestries
]);

// Extensible community system
const CORE_COMMUNITIES = [
  'Highborne',
  'Loreborne',
  'Orderborne',
  'Ridgeborne',
  'Seaborne',
  'Slyborne',
  'Underborne',
  'Wanderborne',
  'Wildborne',
] as const;

const CommunityNameSchema = z.union([
  z.enum(CORE_COMMUNITIES),
  z.string().min(1), // Allow custom homebrew communities
]);

// Inferred types from schemas (because we're not savages)
export type RangeBand = z.infer<typeof RangeBandSchema>;
export type DamageType = z.infer<typeof DamageTypeSchema>;
export type Tier = z.infer<typeof TierSchema>;
export type Level = z.infer<typeof LevelSchema>;
export type TraitName = z.infer<typeof TraitNameSchema>;
export type TraitValue = z.infer<typeof TraitValueSchema>;
export type ClassName = z.infer<typeof ClassNameSchema>;
export type DomainName = z.infer<typeof DomainNameSchema>;
export type AncestryName = z.infer<typeof AncestryNameSchema>;
export type CommunityName = z.infer<typeof CommunityNameSchema>;

///////////////////////////
// Trait Validation      //
///////////////////////////

const TraitsSchema = z.object({
  Agility: TraitValueSchema,
  Strength: TraitValueSchema,
  Finesse: TraitValueSchema,
  Instinct: TraitValueSchema,
  Presence: TraitValueSchema,
  Knowledge: TraitValueSchema,
});

// Separate SRD-compliant trait validation for official games
const SRDTraitsSchema = TraitsSchema.refine(
  traits => {
    // SRD validation: trait distribution must follow standard array
    const values = Object.values(traits).sort((a, b) => b - a);
    const standardArray = [2, 1, 1, 0, 0, -1];
    return JSON.stringify(values) === JSON.stringify(standardArray);
  },
  {
    message:
      'Trait distribution must follow SRD standard array: [2, 1, 1, 0, 0, -1]',
  }
);

export type Traits = z.infer<typeof TraitsSchema>;
export type SRDTraits = z.infer<typeof SRDTraitsSchema>;

///////////////////////////
// Equipment Schemas     //
///////////////////////////

const WeaponSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  trait: z.union([TraitNameSchema, z.literal('Spellcast')]),
  range: RangeBandSchema,
  damageDie: z.string().regex(/^d\d+$/),
  damageType: DamageTypeSchema,
  burden: z.enum(['One-Handed', 'Two-Handed']),
  features: z.array(z.string()),
});

const ArmorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  majorThreshold: z.number().min(0).int(),
  severeThreshold: z.number().min(0).int(),
  armorScore: z.number().min(0).int(),
  features: z.array(z.string()),
});

export type Weapon = z.infer<typeof WeaponSchema>;
export type Armor = z.infer<typeof ArmorSchema>;

///////////////////////////
// Character Resources   //
///////////////////////////

const HitPointsSchema = z
  .object({
    maxSlots: z.number().min(1).int(),
    marked: z.number().min(0).int(),
    temporaryBonus: z.number().int().default(0),
  })
  .refine(
    data => data.marked <= data.maxSlots + Math.max(0, data.temporaryBonus),
    {
      message: 'Marked hit points cannot exceed maximum + temporary bonus',
    }
  );

const StressTrackSchema = z
  .object({
    maxSlots: z.number().min(1).int(),
    marked: z.number().min(0).int(),
    temporaryBonus: z.number().int().default(0),
  })
  .refine(
    data => data.marked <= data.maxSlots + Math.max(0, data.temporaryBonus),
    {
      message: 'Marked stress cannot exceed maximum + temporary bonus',
    }
  );

const HopeStateSchema = z.object({
  current: z.number().min(0).max(6).int(),
  maximum: z.literal(6),
  sessionGenerated: z.number().min(0).int().default(0),
});

export type HitPoints = z.infer<typeof HitPointsSchema>;
export type StressTrack = z.infer<typeof StressTrackSchema>;
export type HopeState = z.infer<typeof HopeStateSchema>;

///////////////////////////
// Main Character Schema //
///////////////////////////

const BasePlayerCharacterSchema = z
  .object({
    // Core Identity
    id: z.string().min(1),
    name: z.string().min(1).max(100),
    pronouns: z.string().optional(),
    description: z.string().optional(),

    // Core Stats (more flexible for homebrew)
    level: z.union([LevelSchema, z.number().int().min(1).max(50)]), // Allow homebrew levels
    tier: z.union([TierSchema, z.number().int().min(1).max(20)]), // Allow homebrew tiers
    evasion: z.number().min(0).max(50).int(), // Extended for homebrew
    proficiency: z.number().min(0).max(20).int(), // Extended for homebrew

    // Character Building
    traits: TraitsSchema,
    ancestry: AncestryNameSchema,
    community: CommunityNameSchema,
    className: ClassNameSchema,

    // Resources
    hitPoints: HitPointsSchema,
    stress: StressTrackSchema,
    hope: HopeStateSchema,

    // Equipment
    primaryWeapon: WeaponSchema.optional(),
    secondaryWeapon: WeaponSchema.optional(),
    armor: ArmorSchema.optional(),

    // Dynamic State
    conditions: z.array(z.string()).default([]),
    temporaryEffects: z.array(z.string()).default([]),

    // Homebrew support
    homebrewMode: z.boolean().default(false),
    rulesVersion: z.string().default('SRD-1.0'),

    // Extensibility
    tags: z.array(z.string()).optional(),
    data: z.record(z.string(), z.unknown()).optional(),
  })
  .refine(
    character => {
      // Equipment validation: cannot have secondary weapon if primary is two-handed
      if (
        character.primaryWeapon?.burden === 'Two-Handed' &&
        character.secondaryWeapon
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        'Cannot equip secondary weapon when primary weapon is two-handed',
    }
  );

// SRD-compliant character schema with strict validation
const SRDPlayerCharacterSchema = BasePlayerCharacterSchema.extend({
  homebrewMode: z.literal(false),
  traits: SRDTraitsSchema, // Use strict SRD trait validation
  evasion: z.number().min(6).max(20).int(), // SRD bounds
  proficiency: z.number().min(0).max(6).int(), // SRD bounds
}).refine(
  character => {
    // Cross-field validation: tier must match level (SRD rule)
    const expectedTier =
      character.level === 1
        ? 1
        : character.level <= 4
          ? 2
          : character.level <= 7
            ? 3
            : 4;
    return character.tier === expectedTier;
  },
  {
    message: 'Character tier must match level (1=T1, 2-4=T2, 5-7=T3, 8-10=T4)',
  }
);

// Flexible schema for homebrew content
const PlayerCharacterSchema = BasePlayerCharacterSchema;

export type PlayerCharacter = z.infer<typeof PlayerCharacterSchema>;

///////////////////////////
// Validation Constants  //
///////////////////////////

const CHARACTER_CLASS_DOMAINS: Record<ClassName, DomainName[]> = {
  Bard: ['Codex', 'Grace'],
  Druid: ['Arcana', 'Sage'],
  Guardian: ['Splendor', 'Valor'],
  Ranger: ['Bone', 'Sage'],
  Rogue: ['Midnight', 'Blade'],
  Seraph: ['Grace', 'Splendor'],
  Sorcerer: ['Arcana', 'Midnight'],
  Warrior: ['Blade', 'Bone'],
  Wizard: ['Codex', 'Arcana'],
};

///////////////////////////
// Factory Functions     //
///////////////////////////

export class CharacterFactory {
  static createDefaultTraits(): Traits {
    return TraitsSchema.parse({
      Agility: 0,
      Strength: 0,
      Finesse: 0,
      Instinct: 0,
      Presence: 0,
      Knowledge: 0,
    });
  }

  static createSRDTraits(
    distribution: [number, number, number, number, number, number]
  ): Traits {
    const [agility, strength, finesse, instinct, presence, knowledge] =
      distribution;
    return SRDTraitsSchema.parse({
      Agility: agility,
      Strength: strength,
      Finesse: finesse,
      Instinct: instinct,
      Presence: presence,
      Knowledge: knowledge,
    });
  }

  static createHomebrewTraits(traits: Record<TraitName, number>): Traits {
    return TraitsSchema.parse(traits);
  }

  static createBasicCharacter(params: {
    name: string;
    level: Level;
    ancestry: AncestryName;
    community: CommunityName;
    className: ClassName;
    traits?: Traits;
    homebrewMode?: boolean;
  }): PlayerCharacter {
    const {
      name,
      level,
      ancestry,
      community,
      className,
      traits,
      homebrewMode = false,
    } = params;

    const tier = CharacterUtilities.deriveTier(level);

    return PlayerCharacterSchema.parse({
      id: crypto.randomUUID(),
      name,
      level,
      tier,
      evasion: 10,
      proficiency: Math.ceil(level / 2),
      traits: traits || CharacterFactory.createDefaultTraits(),
      ancestry,
      community,
      className,
      hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
      stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
      hope: { current: 2, maximum: 6, sessionGenerated: 0 },
      conditions: [],
      temporaryEffects: [],
      homebrewMode,
      rulesVersion: homebrewMode ? 'Homebrew' : 'SRD-1.0',
    });
  }

  static createHomebrewCharacter(params: {
    name: string;
    level: number;
    tier: number;
    evasion: number;
    proficiency: number;
    traits: Record<string, number>;
    ancestry: string;
    community: string;
    className: string;
  }): PlayerCharacter {
    return PlayerCharacterSchema.parse({
      id: crypto.randomUUID(),
      homebrewMode: true,
      rulesVersion: 'Homebrew',
      hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
      stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
      hope: { current: 2, maximum: 6, sessionGenerated: 0 },
      conditions: [],
      temporaryEffects: [],
      ...params,
    });
  }
}

///////////////////////////
// Validation Utilities  //
///////////////////////////

export class CharacterValidator {
  static validate(
    character: unknown
  ):
    | { success: true; data: PlayerCharacter }
    | { success: false; error: z.ZodError } {
    return PlayerCharacterSchema.safeParse(character);
  }

  static validateSRD(
    character: unknown
  ):
    | { success: true; data: PlayerCharacter }
    | { success: false; error: z.ZodError } {
    return SRDPlayerCharacterSchema.safeParse(character);
  }

  static validatePartial(
    character: unknown
  ):
    | { success: true; data: Partial<PlayerCharacter> }
    | { success: false; error: z.ZodError } {
    return PlayerCharacterSchema.partial().safeParse(character);
  }

  static getValidationErrors(character: unknown, srdMode = false): string[] {
    const schema = srdMode ? SRDPlayerCharacterSchema : PlayerCharacterSchema;
    const result = schema.safeParse(character);
    if (result.success) return [];

    return result.error.issues.map(
      issue => `${issue.path.join('.')}: ${issue.message}`
    );
  }
}

///////////////////////////
// Utility Functions     //
///////////////////////////

export class CharacterUtilities {
  static deriveTier(level: Level): Tier {
    if (level === 1) return 1;
    if (level <= 4) return 2;
    if (level <= 7) return 3;
    return 4;
  }

  static calculateEvasion(character: PlayerCharacter): number {
    let evasion = character.evasion;

    if (character.armor) {
      // Apply armor modifiers
      for (const feature of character.armor.features) {
        if (feature === 'Flexible') evasion += 1;
        if (feature === 'Heavy') evasion -= 1;
      }
    }

    return Math.max(0, evasion);
  }

  static canUseDeathMove(character: PlayerCharacter): boolean {
    return character.hitPoints.marked === character.hitPoints.maxSlots - 1;
  }

  static getAvailableDomains(className: ClassName): DomainName[] {
    return CHARACTER_CLASS_DOMAINS[className] || [];
  }
}

///////////////////////////
// Constants             //
///////////////////////////

export const DEFAULT_VALUES = {
  TRAIT_DISTRIBUTION: [2, 1, 1, 0, 0, -1] as const,
  STARTING_HOPE: 2,
  MAX_HOPE: 6,
  STARTING_STRESS_SLOTS: 6,
  STANDARD_STARTING_HP: 20,
  STANDARD_STARTING_EVASION: 10,
} as const;

// Export key schemas
export {
  PlayerCharacterSchema,
  SRDPlayerCharacterSchema,
  TraitsSchema,
  SRDTraitsSchema,
  WeaponSchema,
  ArmorSchema,
  HitPointsSchema,
  StressTrackSchema,
  HopeStateSchema,
  CORE_CLASSES,
  CORE_DOMAINS,
  CORE_ANCESTRIES,
  CORE_COMMUNITIES,
};
