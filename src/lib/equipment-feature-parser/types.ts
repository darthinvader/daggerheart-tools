/**
 * Types for equipment feature stat modifiers.
 * These types define the structure of parsed stat effects from equipment features.
 */

/** Character traits that can be modified by equipment */
export type CharacterTrait =
  | 'Agility'
  | 'Strength'
  | 'Finesse'
  | 'Instinct'
  | 'Presence'
  | 'Knowledge';

/** All stats that can be modified by equipment features */
export type ModifiableStat =
  | 'evasion'
  | 'proficiency'
  | 'armorScore'
  | 'majorThreshold'
  | 'severeThreshold'
  | 'attackRolls'
  | 'spellcastRolls'
  | CharacterTrait;

/** A single stat modifier extracted from a feature description */
export interface StatModifier {
  /** The stat being modified */
  stat: ModifiableStat;
  /** The numeric modifier value (positive or negative) */
  value: number;
  /** Whether this applies to all traits (for "all character traits" patterns) */
  appliesToAllTraits?: boolean;
}

/** Parsed result from a single equipment feature */
export interface ParsedFeatureEffect {
  /** The original feature name */
  featureName: string;
  /** The original feature description */
  description: string;
  /** All stat modifiers extracted from this feature */
  modifiers: StatModifier[];
}

/** Aggregated stat modifiers from all equipment */
export interface AggregatedEquipmentStats {
  /** Total evasion modifier */
  evasion: number;
  /** Total proficiency modifier */
  proficiency: number;
  /** Total armor score modifier (from features, not base armor score) */
  armorScore: number;
  /** Major damage threshold modifier */
  majorThreshold: number;
  /** Severe damage threshold modifier */
  severeThreshold: number;
  /** Attack roll modifier */
  attackRolls: number;
  /** Spellcast roll modifier */
  spellcastRolls: number;
  /** Trait modifiers */
  traits: Record<CharacterTrait, number>;
  /** All parsed features for debugging/display */
  parsedFeatures: ParsedFeatureEffect[];
}

/** Feature object as it appears in equipment data */
export interface EquipmentFeature {
  name: string;
  description: string;
  type?: string;
  modifiers?: {
    evasion?: number;
    proficiency?: number;
    armorScore?: number;
    majorThreshold?: number;
    severeThreshold?: number;
    attackRolls?: number;
    spellcastRolls?: number;
    traits?: Partial<Record<CharacterTrait, number>>;
  };
}
