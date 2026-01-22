/**
 * Equipment Normalizer
 *
 * Converts raw equipment data into a unified modifier format.
 * This is the SINGLE source of truth for how equipment modifiers are extracted.
 *
 * Rules:
 * 1. Armor: Uses legacy fields (evasionModifier, agilityModifier), NOT feature text
 * 2. Weapons: Uses explicit statModifiers if present, otherwise parses feature text
 * 3. Wheelchair: Same as weapons
 * 4. Any equipment with statModifiers: Uses those, skips feature parsing
 */

import { parseFeatures } from './parse-feature';
import type { CharacterTrait, EquipmentFeature } from './types';

/** Normalized equipment modifiers - the unified format */
export interface NormalizedModifiers {
  evasion: number;
  proficiency: number;
  armorScore: number;
  majorThreshold: number;
  severeThreshold: number;
  attackRolls: number;
  spellcastRolls: number;
  traits: Record<CharacterTrait, number>;
  /** Source of the modifiers for debugging/display */
  source: 'legacy-armor' | 'explicit' | 'parsed' | 'none';
  /** Equipment name for display */
  equipmentName?: string;
}

/** Create empty normalized modifiers */
export function createEmptyModifiers(
  source: NormalizedModifiers['source'] = 'none'
): NormalizedModifiers {
  return {
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
    source,
  };
}

/** Trait modifiers from explicit statModifiers */
interface TraitModifiers {
  Agility?: number;
  Strength?: number;
  Finesse?: number;
  Instinct?: number;
  Presence?: number;
  Knowledge?: number;
}

/** Explicit stat modifiers (from schema) */
interface ExplicitStatModifiers {
  evasion?: number;
  proficiency?: number;
  armorScore?: number;
  majorThreshold?: number;
  severeThreshold?: number;
  attackRolls?: number;
  spellcastRolls?: number;
  traits?: TraitModifiers;
}

/** Armor-like equipment with legacy fields */
interface ArmorLike {
  name?: string;
  evasionModifier?: number;
  agilityModifier?: number;
  features?: EquipmentFeature[];
  statModifiers?: ExplicitStatModifiers;
}

/** Weapon-like equipment (no legacy fields) */
interface WeaponLike {
  name?: string;
  features?: EquipmentFeature[];
  statModifiers?: ExplicitStatModifiers;
}

/** Check if equipment has legacy armor fields */
function hasLegacyArmorFields(equipment: unknown): equipment is ArmorLike {
  if (!equipment || typeof equipment !== 'object') return false;
  const e = equipment as Record<string, unknown>;
  return 'evasionModifier' in e || 'agilityModifier' in e;
}

/** Check if equipment has explicit stat modifiers */
function hasExplicitModifiers(
  equipment: unknown
): equipment is { statModifiers: ExplicitStatModifiers } {
  if (!equipment || typeof equipment !== 'object') return false;
  const e = equipment as Record<string, unknown>;
  return (
    'statModifiers' in e &&
    e.statModifiers !== undefined &&
    e.statModifiers !== null
  );
}

/**
 * Normalize armor modifiers using legacy fields.
 *
 * IMPORTANT: Armor base stats (evasionModifier, agilityModifier) are NOT
 * "feature modifiers" - they are base armor stats that are already applied
 * separately via getArmorStats(). Including them here would cause double-counting.
 *
 * This function returns EMPTY modifiers for standard armor to prevent double-counting.
 * Homebrew armor with explicit statModifiers will be handled by normalizeFromExplicit().
 */
function normalizeFromLegacyArmor(armor: ArmorLike): NormalizedModifiers {
  // Return empty modifiers - armor base stats are handled separately
  // by getArmorStats() in overview-grids.parts.tsx and other components.
  // Only parse additional features that go beyond the base stats.
  const mods = createEmptyModifiers('legacy-armor');
  mods.equipmentName = armor.name;
  // DO NOT add evasionModifier or agilityModifier here - they are base armor stats
  // that are already accounted for in armorStats.evasionMod and trait calculations.
  return mods;
}

/**
 * Normalize modifiers from explicit statModifiers field.
 */
function normalizeFromExplicit(equipment: {
  name?: string;
  statModifiers: ExplicitStatModifiers;
}): NormalizedModifiers {
  const mods = createEmptyModifiers('explicit');
  const sm = equipment.statModifiers;
  mods.equipmentName = equipment.name;

  mods.evasion = sm.evasion ?? 0;
  mods.proficiency = sm.proficiency ?? 0;
  mods.armorScore = sm.armorScore ?? 0;
  mods.majorThreshold = sm.majorThreshold ?? 0;
  mods.severeThreshold = sm.severeThreshold ?? 0;
  mods.attackRolls = sm.attackRolls ?? 0;
  mods.spellcastRolls = sm.spellcastRolls ?? 0;

  if (sm.traits) {
    mods.traits.Agility = sm.traits.Agility ?? 0;
    mods.traits.Strength = sm.traits.Strength ?? 0;
    mods.traits.Finesse = sm.traits.Finesse ?? 0;
    mods.traits.Instinct = sm.traits.Instinct ?? 0;
    mods.traits.Presence = sm.traits.Presence ?? 0;
    mods.traits.Knowledge = sm.traits.Knowledge ?? 0;
  }

  return mods;
}

/** Simple stat keys that can be directly incremented */
const SIMPLE_STAT_KEYS = new Set([
  'evasion',
  'proficiency',
  'armorScore',
  'majorThreshold',
  'severeThreshold',
  'attackRolls',
  'spellcastRolls',
]);

/**
 * Apply a parsed modifier to the normalized modifiers object.
 */
function applyModifier(
  mods: NormalizedModifiers,
  stat: string,
  value: number
): void {
  // Handle simple stats
  if (SIMPLE_STAT_KEYS.has(stat)) {
    const key = stat as keyof Pick<
      NormalizedModifiers,
      | 'evasion'
      | 'proficiency'
      | 'armorScore'
      | 'majorThreshold'
      | 'severeThreshold'
      | 'attackRolls'
      | 'spellcastRolls'
    >;
    mods[key] += value;
    return;
  }

  // Handle trait stats
  if (stat in mods.traits) {
    mods.traits[stat as CharacterTrait] += value;
  }
}

/**
 * Normalize modifiers by parsing feature text.
 */
function normalizeFromFeatures(equipment: WeaponLike): NormalizedModifiers {
  const mods = createEmptyModifiers('parsed');
  mods.equipmentName = equipment.name;

  if (!equipment.features || equipment.features.length === 0) {
    mods.source = 'none';
    return mods;
  }

  const effects = parseFeatures(equipment.features);

  for (const effect of effects) {
    for (const modifier of effect.modifiers) {
      applyModifier(mods, modifier.stat, modifier.value);
    }
  }

  return mods;
}

/**
 * Normalize any equipment to unified modifiers.
 *
 * Priority:
 * 1. If equipment has explicit statModifiers → use those
 * 2. If equipment has legacy armor fields → use those (skip feature parsing)
 * 3. Otherwise → parse features
 */
export function normalizeEquipment(equipment: unknown): NormalizedModifiers {
  if (!equipment) {
    return createEmptyModifiers('none');
  }

  // Priority 1: Explicit stat modifiers (homebrew with configured modifiers)
  if (hasExplicitModifiers(equipment)) {
    return normalizeFromExplicit(
      equipment as { name?: string; statModifiers: ExplicitStatModifiers }
    );
  }

  // Priority 2: Legacy armor fields (standard armor)
  if (hasLegacyArmorFields(equipment)) {
    return normalizeFromLegacyArmor(equipment);
  }

  // Priority 3: Parse features (weapons, wheelchair, etc.)
  return normalizeFromFeatures(equipment as WeaponLike);
}

/**
 * Check if normalized modifiers have any non-zero values.
 */
export function hasAnyModifiers(mods: NormalizedModifiers): boolean {
  if (mods.evasion !== 0) return true;
  if (mods.proficiency !== 0) return true;
  if (mods.armorScore !== 0) return true;
  if (mods.majorThreshold !== 0) return true;
  if (mods.severeThreshold !== 0) return true;
  if (mods.attackRolls !== 0) return true;
  if (mods.spellcastRolls !== 0) return true;

  for (const value of Object.values(mods.traits)) {
    if (value !== 0) return true;
  }

  return false;
}
