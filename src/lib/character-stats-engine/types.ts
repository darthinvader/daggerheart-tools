/**
 * Character Stats Engine - Types
 *
 * Centralized type definitions for the character stats calculation engine.
 * This is the SINGLE source of truth for all stat calculations.
 */

/** Character trait names */
export type CharacterTrait =
  | 'Agility'
  | 'Strength'
  | 'Finesse'
  | 'Instinct'
  | 'Presence'
  | 'Knowledge';

/** All character traits */
export const CHARACTER_TRAITS: readonly CharacterTrait[] = [
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
] as const;

/** Trait modifiers from equipment or other sources */
export type TraitModifiers = Record<CharacterTrait, number>;

/** Individual trait state */
export interface TraitState {
  value: number;
  bonus: number;
  marked: boolean;
}

/** All traits state */
export type TraitsState = Record<CharacterTrait, TraitState>;

/** Damage thresholds */
export interface DamageThresholds {
  major: number;
  severe: number;
  critical?: number;
}

// ============================================
// Engine Input Types
// ============================================

/** Class-related inputs */
export interface ClassInput {
  /** Base hit points from class */
  baseHp: number;
  /** Base evasion from class */
  baseEvasion: number;
  /** Class tier (1-4), affects HP */
  tier: number;
}

/** Armor-related inputs */
export interface ArmorInput {
  /** Base armor score */
  baseScore: number;
  /** Evasion modifier from armor type (-2 to +1 typically) */
  evasionModifier: number;
  /** Agility modifier from armor (legacy field) */
  agilityModifier: number;
  /** Base damage thresholds from armor */
  baseThresholds: DamageThresholds;
}

/** Equipment modifier inputs (parsed from features or explicit) */
export interface EquipmentModifiersInput {
  evasion: number;
  proficiency: number;
  armorScore: number;
  majorThreshold: number;
  severeThreshold: number;
  attackRolls: number;
  spellcastRolls: number;
  traits: TraitModifiers;
}

/** Progression-related inputs */
export interface ProgressionInput {
  /** Current character level */
  level: number;
}

/** Traits-related inputs */
export interface TraitsInput {
  /** Current trait values with bonuses */
  traits: TraitsState;
}

/** Complete engine input */
export interface CharacterStatsInput {
  class: ClassInput;
  armor: ArmorInput;
  equipmentModifiers: EquipmentModifiersInput;
  progression: ProgressionInput;
  traits: TraitsInput;
}

// ============================================
// Engine Output Types
// ============================================

/** Calculated trait value with breakdown */
export interface CalculatedTrait {
  /** Base value from character */
  base: number;
  /** Bonus from various sources */
  bonus: number;
  /** Modifier from equipment */
  equipmentModifier: number;
  /** Total calculated value */
  total: number;
  /** Whether this trait is marked/highlighted */
  marked: boolean;
}

/** All calculated traits */
export type CalculatedTraits = Record<CharacterTrait, CalculatedTrait>;

/** Calculated threshold with breakdown */
export interface CalculatedThreshold {
  /** Base value from armor */
  base: number;
  /** Bonus from level */
  levelBonus: number;
  /** Modifier from equipment */
  equipmentModifier: number;
  /** Total calculated value */
  total: number;
}

/** Calculated thresholds */
export interface CalculatedThresholds {
  major: CalculatedThreshold;
  severe: CalculatedThreshold;
}

/** Calculated evasion with breakdown */
export interface CalculatedEvasion {
  /** Base value from class */
  classBase: number;
  /** Modifier from armor */
  armorModifier: number;
  /** Modifier from equipment features */
  equipmentModifier: number;
  /** Total calculated value */
  total: number;
}

/** Calculated armor score with breakdown */
export interface CalculatedArmorScore {
  /** Base value from armor */
  base: number;
  /** Modifier from equipment features */
  equipmentModifier: number;
  /** Total calculated value */
  total: number;
}

/** Calculated HP with breakdown */
export interface CalculatedHp {
  /** Base value from class */
  classBase: number;
  /** Bonus from tier */
  tierBonus: number;
  /** Total calculated value */
  total: number;
}

/** Calculated proficiency with breakdown */
export interface CalculatedProficiency {
  /** Base proficiency (typically from level/class) */
  base: number;
  /** Modifier from equipment features */
  equipmentModifier: number;
  /** Total calculated value */
  total: number;
}

/** Complete engine output */
export interface CharacterStatsOutput {
  hp: CalculatedHp;
  evasion: CalculatedEvasion;
  armorScore: CalculatedArmorScore;
  proficiency: CalculatedProficiency;
  thresholds: CalculatedThresholds;
  traits: CalculatedTraits;
  /** Roll modifiers from equipment */
  rollModifiers: {
    attack: number;
    spellcast: number;
  };
}

// ============================================
// Default Values
// ============================================

/** Default class stats when no class selected */
export const DEFAULT_CLASS_INPUT: ClassInput = {
  baseHp: 6,
  baseEvasion: 10,
  tier: 1,
};

/** Default armor stats when no armor equipped */
export const DEFAULT_ARMOR_INPUT: ArmorInput = {
  baseScore: 0,
  evasionModifier: 0,
  agilityModifier: 0,
  baseThresholds: { major: 5, severe: 11 },
};

/** Default equipment modifiers (no equipment) */
export const DEFAULT_EQUIPMENT_MODIFIERS: EquipmentModifiersInput = {
  evasion: 0,
  proficiency: 0,
  armorScore: 0,
  majorThreshold: 0,
  severeThreshold: 0,
  attackRolls: 0,
  spellcastRolls: 0,
  traits: {
    Agility: 0,
    Strength: 0,
    Finesse: 0,
    Instinct: 0,
    Presence: 0,
    Knowledge: 0,
  },
};

/** Default progression */
export const DEFAULT_PROGRESSION_INPUT: ProgressionInput = {
  level: 1,
};

/** Default trait state */
export const DEFAULT_TRAIT_STATE: TraitState = {
  value: 0,
  bonus: 0,
  marked: false,
};

/** Create default traits state */
export function createDefaultTraitsState(): TraitsState {
  return {
    Agility: { ...DEFAULT_TRAIT_STATE },
    Strength: { ...DEFAULT_TRAIT_STATE },
    Finesse: { ...DEFAULT_TRAIT_STATE },
    Instinct: { ...DEFAULT_TRAIT_STATE },
    Presence: { ...DEFAULT_TRAIT_STATE },
    Knowledge: { ...DEFAULT_TRAIT_STATE },
  };
}

/** Default traits input */
export const DEFAULT_TRAITS_INPUT: TraitsInput = {
  traits: createDefaultTraitsState(),
};
