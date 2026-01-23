/**
 * Character Stats Engine - Core Calculations
 *
 * This is the SINGLE source of truth for all character stat calculations.
 * All components should use this engine instead of performing their own calculations.
 *
 * Calculation Rules (per SRD):
 * - HP: Class base HP + (Tier - 1)
 * - Evasion: Class base + Armor modifier + Equipment feature modifiers
 * - Armor Score: Armor base + Equipment feature modifiers
 * - Thresholds: Armor base + Level + Equipment feature modifiers
 * - Traits: Base value + Bonus + Armor agility modifier + Equipment trait modifiers
 * - Proficiency: Base (from level/class) + Equipment feature modifiers
 */

import {
  type ArmorInput,
  type CalculatedArmorScore,
  type CalculatedEvasion,
  type CalculatedHp,
  type CalculatedProficiency,
  type CalculatedThreshold,
  type CalculatedThresholds,
  type CalculatedTrait,
  type CalculatedTraits,
  CHARACTER_TRAITS,
  type CharacterStatsInput,
  type CharacterStatsOutput,
  type CharacterTrait,
  type ClassInput,
  DEFAULT_ARMOR_INPUT,
  DEFAULT_CLASS_INPUT,
  DEFAULT_EQUIPMENT_MODIFIERS,
  DEFAULT_PROGRESSION_INPUT,
  DEFAULT_TRAITS_INPUT,
  type EquipmentModifiersInput,
  type ProgressionInput,
  type TraitsInput,
} from './types';
// ============================================
// Individual Stat Calculators
// ============================================

/**
 * Calculate HP with breakdown.
 * Formula: Class base HP + (Tier - 1)
 */
export function calculateHp(classInput: ClassInput): CalculatedHp {
  const tierBonus = Math.max(0, classInput.tier - 1);
  return {
    classBase: classInput.baseHp,
    tierBonus,
    total: classInput.baseHp + tierBonus,
  };
}

/**
 * Calculate Evasion with breakdown.
 * Formula: Class base + Armor modifier + Equipment feature modifiers
 */
export function calculateEvasion(
  classInput: ClassInput,
  armorInput: ArmorInput,
  equipmentModifiers: EquipmentModifiersInput
): CalculatedEvasion {
  return {
    classBase: classInput.baseEvasion,
    armorModifier: armorInput.evasionModifier,
    equipmentModifier: equipmentModifiers.evasion,
    total:
      classInput.baseEvasion +
      armorInput.evasionModifier +
      equipmentModifiers.evasion,
  };
}

/**
 * Calculate Armor Score with breakdown.
 * Formula: Armor base + Equipment feature modifiers
 */
export function calculateArmorScore(
  armorInput: ArmorInput,
  equipmentModifiers: EquipmentModifiersInput
): CalculatedArmorScore {
  return {
    base: armorInput.baseScore,
    equipmentModifier: equipmentModifiers.armorScore,
    total: armorInput.baseScore + equipmentModifiers.armorScore,
  };
}

/**
 * Calculate Proficiency with breakdown.
 * Formula: Base (typically 1 at level 1) + Equipment feature modifiers
 */
export function calculateProficiency(
  equipmentModifiers: EquipmentModifiersInput,
  baseProficiency: number = 1
): CalculatedProficiency {
  return {
    base: baseProficiency,
    equipmentModifier: equipmentModifiers.proficiency,
    total: baseProficiency + equipmentModifiers.proficiency,
  };
}

/**
 * Calculate a single threshold with breakdown.
 * Formula: Armor base + Level + Equipment feature modifiers
 */
function calculateThreshold(
  baseValue: number,
  level: number,
  equipmentModifier: number
): CalculatedThreshold {
  const levelBonus = Math.max(0, level);
  return {
    base: baseValue,
    levelBonus,
    equipmentModifier,
    total: baseValue + levelBonus + equipmentModifier,
  };
}

/**
 * Calculate all thresholds with breakdown.
 */
export function calculateThresholds(
  armorInput: ArmorInput,
  progressionInput: ProgressionInput,
  equipmentModifiers: EquipmentModifiersInput
): CalculatedThresholds {
  return {
    major: calculateThreshold(
      armorInput.baseThresholds.major,
      progressionInput.level,
      equipmentModifiers.majorThreshold
    ),
    severe: calculateThreshold(
      armorInput.baseThresholds.severe,
      progressionInput.level,
      equipmentModifiers.severeThreshold
    ),
  };
}

/**
 * Calculate a single trait with breakdown.
 * Formula: Base value + Bonus + Armor agility modifier (for Agility only) + Equipment trait modifiers
 */
function calculateTrait(
  trait: CharacterTrait,
  baseValue: number,
  bonus: number,
  marked: boolean,
  armorInput: ArmorInput,
  equipmentModifiers: EquipmentModifiersInput
): CalculatedTrait {
  // Agility also gets the armor agility modifier
  const armorAgility = trait === 'Agility' ? armorInput.agilityModifier : 0;
  const equipmentModifier = equipmentModifiers.traits[trait] + armorAgility;

  return {
    base: baseValue,
    bonus,
    equipmentModifier,
    total: baseValue + bonus + equipmentModifier,
    marked,
  };
}

/**
 * Calculate all traits with breakdown.
 */
export function calculateTraits(
  traitsInput: TraitsInput,
  armorInput: ArmorInput,
  equipmentModifiers: EquipmentModifiersInput
): CalculatedTraits {
  const result = {} as CalculatedTraits;

  for (const trait of CHARACTER_TRAITS) {
    const traitState = traitsInput.traits[trait];
    result[trait] = calculateTrait(
      trait,
      traitState.value,
      traitState.bonus,
      traitState.marked,
      armorInput,
      equipmentModifiers
    );
  }

  return result;
}

// ============================================
// Main Engine Function
// ============================================

/**
 * Calculate all character stats from inputs.
 * This is the main entry point for stat calculations.
 *
 * @param input - Complete input with class, armor, equipment, progression, and traits
 * @returns Complete calculated stats with breakdowns
 */
export function calculateCharacterStats(
  input: Partial<CharacterStatsInput>
): CharacterStatsOutput {
  // Apply defaults for any missing inputs
  const classInput = input.class ?? DEFAULT_CLASS_INPUT;
  const armorInput = input.armor ?? DEFAULT_ARMOR_INPUT;
  const equipmentModifiers =
    input.equipmentModifiers ?? DEFAULT_EQUIPMENT_MODIFIERS;
  const progressionInput = input.progression ?? DEFAULT_PROGRESSION_INPUT;
  const traitsInput = input.traits ?? DEFAULT_TRAITS_INPUT;

  return {
    hp: calculateHp(classInput),
    evasion: calculateEvasion(classInput, armorInput, equipmentModifiers),
    armorScore: calculateArmorScore(armorInput, equipmentModifiers),
    proficiency: calculateProficiency(equipmentModifiers),
    thresholds: calculateThresholds(
      armorInput,
      progressionInput,
      equipmentModifiers
    ),
    traits: calculateTraits(traitsInput, armorInput, equipmentModifiers),
    rollModifiers: {
      attack: equipmentModifiers.attackRolls,
      spellcast: equipmentModifiers.spellcastRolls,
    },
  };
}

// ============================================
// Convenience Functions
// ============================================

/**
 * Get just the total values without breakdowns.
 * Useful for simple display components.
 */
export function getStatTotals(output: CharacterStatsOutput) {
  return {
    hp: output.hp.total,
    evasion: output.evasion.total,
    armorScore: output.armorScore.total,
    proficiency: output.proficiency.total,
    thresholdsMajor: output.thresholds.major.total,
    thresholdsSevere: output.thresholds.severe.total,
    traits: Object.fromEntries(
      CHARACTER_TRAITS.map(t => [t, output.traits[t].total])
    ) as Record<CharacterTrait, number>,
  };
}

/**
 * Check if any equipment modifiers are active.
 */
export function hasEquipmentModifiers(output: CharacterStatsOutput): boolean {
  if (output.evasion.equipmentModifier !== 0) return true;
  if (output.armorScore.equipmentModifier !== 0) return true;
  if (output.proficiency.equipmentModifier !== 0) return true;
  if (output.thresholds.major.equipmentModifier !== 0) return true;
  if (output.thresholds.severe.equipmentModifier !== 0) return true;
  if (output.rollModifiers.attack !== 0) return true;
  if (output.rollModifiers.spellcast !== 0) return true;

  for (const trait of CHARACTER_TRAITS) {
    if (output.traits[trait].equipmentModifier !== 0) return true;
  }

  return false;
}
