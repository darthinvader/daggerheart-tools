/**
 * Character Stats Engine - State Adapters
 *
 * Converts component state (from DemoState, EquipmentState, etc.)
 * into the engine's input format.
 */

import type { EquipmentState } from '@/components/equipment';
import type { TraitsState as ComponentTraitsState } from '@/components/traits';
import { getBeastformById } from '@/lib/data/beastforms';
import { getClassByName } from '@/lib/data/classes';
import { getEquipmentFeatureModifiers } from '@/lib/equipment-feature-parser';
import type { BeastformState } from '@/lib/schemas/beastform';

import {
  type ArmorInput,
  type CharacterStatsInput,
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

/** Class selection state from components */
interface ClassSelectionState {
  className: string | null;
  isHomebrew?: boolean;
  homebrewClass?: {
    startingHitPoints: number;
    startingEvasion: number;
  };
}

/** Progression state from components */
interface ProgressionState {
  currentLevel: number;
  tier?: number;
}

/**
 * Extract class input from class selection state.
 */
export function extractClassInput(
  classSelection: ClassSelectionState | null | undefined
): ClassInput {
  if (!classSelection) {
    return DEFAULT_CLASS_INPUT;
  }

  // Homebrew class
  if (classSelection.isHomebrew && classSelection.homebrewClass) {
    return {
      baseHp: classSelection.homebrewClass.startingHitPoints,
      baseEvasion: classSelection.homebrewClass.startingEvasion,
      tier: 1, // Tier is determined by level, not class
    };
  }

  // Standard class
  const gameClass = classSelection.className
    ? getClassByName(classSelection.className)
    : null;

  return {
    baseHp: gameClass?.startingHitPoints ?? DEFAULT_CLASS_INPUT.baseHp,
    baseEvasion: gameClass?.startingEvasion ?? DEFAULT_CLASS_INPUT.baseEvasion,
    tier: 1,
  };
}

/**
 * Extract armor input from equipment state.
 */
export function extractArmorInput(
  equipment: EquipmentState | null | undefined
): ArmorInput {
  if (!equipment) {
    return DEFAULT_ARMOR_INPUT;
  }

  const armor =
    equipment.armorMode === 'homebrew'
      ? equipment.homebrewArmor
      : equipment.armor;

  if (!armor) {
    return DEFAULT_ARMOR_INPUT;
  }

  return {
    baseScore: armor.baseScore ?? DEFAULT_ARMOR_INPUT.baseScore,
    evasionModifier:
      armor.evasionModifier ?? DEFAULT_ARMOR_INPUT.evasionModifier,
    agilityModifier:
      armor.agilityModifier ?? DEFAULT_ARMOR_INPUT.agilityModifier,
    baseThresholds: armor.baseThresholds ?? DEFAULT_ARMOR_INPUT.baseThresholds,
    isUnarmored: false, // Explicitly armored when armor is equipped
  };
}

/**
 * Extract equipment modifiers from equipment state.
 * Uses the equipment feature parser/normalizer.
 */
export function extractEquipmentModifiers(
  equipment: EquipmentState | null | undefined
): EquipmentModifiersInput {
  if (!equipment) {
    return DEFAULT_EQUIPMENT_MODIFIERS;
  }

  const aggregated = getEquipmentFeatureModifiers(equipment);

  return {
    evasion: aggregated.evasion,
    proficiency: aggregated.proficiency,
    armorScore: aggregated.armorScore,
    majorThreshold: aggregated.majorThreshold,
    severeThreshold: aggregated.severeThreshold,
    attackRolls: aggregated.attackRolls,
    spellcastRolls: aggregated.spellcastRolls,
    traits: aggregated.traits,
  };
}

/**
 * Extract progression input from progression state.
 */
export function extractProgressionInput(
  progression: ProgressionState | null | undefined
): ProgressionInput {
  if (!progression) {
    return DEFAULT_PROGRESSION_INPUT;
  }

  return {
    level: progression.currentLevel ?? DEFAULT_PROGRESSION_INPUT.level,
  };
}

/**
 * Extract traits input from traits state.
 */
export function extractTraitsInput(
  traits: ComponentTraitsState | null | undefined
): TraitsInput {
  if (!traits) {
    return DEFAULT_TRAITS_INPUT;
  }

  return {
    traits,
  };
}

/**
 * Get tier from level per SRD:
 * - Tier 1: Level 1 only
 * - Tier 2: Levels 2-4
 * - Tier 3: Levels 5-7
 * - Tier 4: Levels 8-10
 */
export function getTierFromLevel(level: number): number {
  if (level <= 1) return 1;
  if (level <= 4) return 2;
  if (level <= 7) return 3;
  return 4;
}

/**
 * Build equipment-style modifiers from active beastform state.
 * Returns DEFAULT_EQUIPMENT_MODIFIERS when beastform is inactive or invalid.
 */
export function buildBeastformModifiers(
  beastform: BeastformState | null | undefined
): EquipmentModifiersInput {
  if (!beastform?.active || !beastform.formId) {
    return DEFAULT_EQUIPMENT_MODIFIERS;
  }

  const form = getBeastformById(beastform.formId);
  if (!form) {
    return DEFAULT_EQUIPMENT_MODIFIERS;
  }

  const traits = { ...DEFAULT_EQUIPMENT_MODIFIERS.traits };
  traits[form.traitBonus.trait] += form.traitBonus.value;

  // Evolution activation grants an additional +1 to a chosen trait
  if (
    beastform.activationMethod === 'evolution' &&
    beastform.evolutionBonusTrait
  ) {
    traits[beastform.evolutionBonusTrait.trait] +=
      beastform.evolutionBonusTrait.value;
  }

  return {
    ...DEFAULT_EQUIPMENT_MODIFIERS,
    evasion: form.evasionBonus,
    traits,
  };
}

/**
 * Merge two EquipmentModifiersInput objects by summing their values.
 */
function mergeEquipmentModifiers(
  a: EquipmentModifiersInput,
  b: EquipmentModifiersInput
): EquipmentModifiersInput {
  return {
    evasion: a.evasion + b.evasion,
    proficiency: a.proficiency + b.proficiency,
    armorScore: a.armorScore + b.armorScore,
    majorThreshold: a.majorThreshold + b.majorThreshold,
    severeThreshold: a.severeThreshold + b.severeThreshold,
    attackRolls: a.attackRolls + b.attackRolls,
    spellcastRolls: a.spellcastRolls + b.spellcastRolls,
    traits: {
      Agility: a.traits.Agility + b.traits.Agility,
      Strength: a.traits.Strength + b.traits.Strength,
      Finesse: a.traits.Finesse + b.traits.Finesse,
      Instinct: a.traits.Instinct + b.traits.Instinct,
      Presence: a.traits.Presence + b.traits.Presence,
      Knowledge: a.traits.Knowledge + b.traits.Knowledge,
    },
  };
}

/**
 * Build complete engine input from component states.
 * This is the main function to use in components.
 */
export function buildEngineInput(
  classSelection: ClassSelectionState | null | undefined,
  equipment: EquipmentState | null | undefined,
  progression: ProgressionState | null | undefined,
  traits: ComponentTraitsState | null | undefined,
  beastform?: BeastformState | null
): CharacterStatsInput {
  const classInput = extractClassInput(classSelection);
  const progressionInput = extractProgressionInput(progression);

  // Update class tier based on level
  classInput.tier = getTierFromLevel(progressionInput.level);

  const equipmentMods = extractEquipmentModifiers(equipment);
  const beastformMods = buildBeastformModifiers(beastform);
  const combinedModifiers = mergeEquipmentModifiers(
    equipmentMods,
    beastformMods
  );

  return {
    class: classInput,
    armor: extractArmorInput(equipment),
    equipmentModifiers: combinedModifiers,
    progression: progressionInput,
    traits: extractTraitsInput(traits),
  };
}
