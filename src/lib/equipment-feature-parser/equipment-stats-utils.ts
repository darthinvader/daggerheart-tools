/**
 * Equipment Stats Utilities
 *
 * Provides helper functions to extract aggregated stat modifiers from
 * equipment state, suitable for use in auto-calculation contexts.
 */

import type { EquipmentState } from '@/components/equipment';

import { aggregateEquipmentStats } from './aggregate-stats';
import type { AggregatedEquipmentStats } from './types';

/**
 * Get the active armor from equipment state (considering homebrew mode)
 */
function getActiveArmor(equipment: EquipmentState) {
  if (equipment.armorMode === 'homebrew') {
    return equipment.homebrewArmor;
  }
  return equipment.armor;
}

/**
 * Get the active weapon from equipment state (considering homebrew mode)
 */
function getActivePrimaryWeapon(equipment: EquipmentState) {
  if (equipment.primaryWeaponMode === 'homebrew') {
    return equipment.homebrewPrimaryWeapon;
  }
  return equipment.primaryWeapon;
}

/**
 * Get the active secondary weapon from equipment state (considering homebrew mode)
 */
function getActiveSecondaryWeapon(equipment: EquipmentState) {
  if (equipment.secondaryWeaponMode === 'homebrew') {
    return equipment.homebrewSecondaryWeapon;
  }
  return equipment.secondaryWeapon;
}

/**
 * Get the active combat wheelchair if enabled
 */
function getActiveCombatWheelchair(equipment: EquipmentState) {
  if (!equipment.useCombatWheelchair) return null;
  if (equipment.wheelchairMode === 'homebrew') {
    return equipment.homebrewWheelchair;
  }
  return equipment.combatWheelchair;
}

/**
 * Get aggregated stat modifiers from all equipped items.
 *
 * Uses a unified approach:
 * - For standard equipment: uses structured fields (evasionModifier, agilityModifier)
 * - For homebrew equipment: uses explicit statModifiers if set, otherwise parses features
 * - Falls back to parsing feature descriptions when no structured data available
 *
 * @param equipment - The equipment state containing all equipped items
 * @returns Aggregated stat modifiers from all equipment
 */
export function getEquipmentFeatureModifiers(
  equipment: EquipmentState
): AggregatedEquipmentStats {
  const armor = getActiveArmor(equipment);
  const primaryWeapon = getActivePrimaryWeapon(equipment);
  const secondaryWeapon = getActiveSecondaryWeapon(equipment);
  const wheelchair = getActiveCombatWheelchair(equipment);

  // Collect activated custom equipment slots
  const activeCustomSlots = (equipment.customSlots ?? []).filter(
    slot => slot.activated !== false
  );

  // Unified aggregator handles:
  // - Explicit statModifiers (homebrew)
  // - Legacy armor fields (evasionModifier, agilityModifier)
  // - Feature parsing (fallback)
  // - Custom equipment feature descriptions (parsed for modifiers)
  return aggregateEquipmentStats(
    armor,
    primaryWeapon,
    secondaryWeapon,
    wheelchair,
    activeCustomSlots
  );
}

/**
 * Extended auto-calculate context that includes equipment feature modifiers.
 */
export interface ExtendedAutoCalculateContext {
  /** Class base HP */
  classHp: number;
  /** Class tier (1-4), for tier-based features (not HP per SRD) */
  classTier: number;
  /** Class base evasion */
  classEvasion: number;
  /** Character level */
  level: number;
  /** Armor base score */
  armorScore: number;
  /** Armor base evasion modifier (from armor type) */
  armorEvasionModifier: number;
  /** Armor base thresholds major */
  armorThresholdsMajor: number;
  /** Armor base thresholds severe */
  armorThresholdsSevere: number;
  /** Equipment feature modifiers (parsed from all equipment) */
  equipmentFeatureModifiers: AggregatedEquipmentStats;
}

/**
 * Build an extended auto-calculate context from class selection and equipment.
 */
export function buildAutoCalculateContext(
  classStats: { hp: number; evasion: number },
  armorStats: {
    score: number;
    evasionMod: number;
    major: number;
    severe: number;
  },
  level: number,
  tier: number,
  equipment: EquipmentState
): ExtendedAutoCalculateContext {
  return {
    classHp: classStats.hp,
    classTier: tier,
    classEvasion: classStats.evasion,
    level,
    armorScore: armorStats.score,
    armorEvasionModifier: armorStats.evasionMod,
    armorThresholdsMajor: armorStats.major,
    armorThresholdsSevere: armorStats.severe,
    equipmentFeatureModifiers: getEquipmentFeatureModifiers(equipment),
  };
}

/**
 * Compute extended auto values including equipment feature modifiers.
 * Per SRD: HP is only gained through class base + level-up selections.
 *
 * @param ctx - Extended auto-calculate context
 * @returns Computed auto values with equipment feature modifiers applied
 */
export function computeExtendedAutoValues(ctx: ExtendedAutoCalculateContext) {
  const levelBonus = Math.max(0, ctx.level);
  const featureMods = ctx.equipmentFeatureModifiers;

  return {
    // HP: class base only (level-up selections tracked separately)
    maxHp: ctx.classHp,

    // Evasion: class base + armor modifier + equipment feature modifiers
    evasion: ctx.classEvasion + ctx.armorEvasionModifier + featureMods.evasion,

    // Armor Score: base armor score + equipment feature modifiers
    armorScore: ctx.armorScore + featureMods.armorScore,

    // Proficiency modifier from equipment
    proficiencyModifier: featureMods.proficiency,

    // Thresholds: armor base + level + equipment feature modifiers
    thresholdsMajor:
      ctx.armorThresholdsMajor + levelBonus + featureMods.majorThreshold,
    thresholdsSevere:
      ctx.armorThresholdsSevere + levelBonus + featureMods.severeThreshold,

    // Trait modifiers from equipment
    traitModifiers: featureMods.traits,

    // Roll modifiers from equipment
    attackRollModifier: featureMods.attackRolls,
    spellcastRollModifier: featureMods.spellcastRolls,

    // Raw feature modifiers for display
    featureModifiers: featureMods,
  };
}
