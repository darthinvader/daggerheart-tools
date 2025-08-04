/**
 * Enhanced Daggerheart Validation System
 * 
 * Provides comprehensive validation for Daggerheart characters with customizable rules.
 * Combines strict SRD compliance with flexibility for homebrew content.
 */

import type {
  PlayerCharacter,
  TraitValue,
  Level,
  Tier,
  ClassName,
  DomainName,
  Equipment,
} from './daggerheartCharacter';

import {
  DEFAULT_TRAIT_DISTRIBUTION,
  deriveTier,
  canUseDeathMove,
  hasAdvancementChoice,
} from './daggerheartCharacter';

///////////////////////////
// Validation Results    //
///////////////////////////

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

export interface ValidationOptions {
  strict?: boolean; // Enforce strict SRD compliance
  allowHomebrew?: boolean; // Allow non-SRD content
  skipOptional?: boolean; // Skip validation of optional fields
  customRules?: ValidationRule[];
}

export interface ValidationRule {
  name: string;
  check: (character: PlayerCharacter) => ValidationResult;
  severity: 'error' | 'warning' | 'info';
  category: 'core' | 'srd' | 'homebrew' | 'optional';
}

///////////////////////////
// Core Validation Rules //
///////////////////////////

export const STANDARD_CLASS_DOMAINS: Record<ClassName, DomainName[]> = {
  Bard: ["Codex", "Grace"],
  Druid: ["Arcana", "Sage"],
  Guardian: ["Splendor", "Valor"],
  Ranger: ["Bone", "Sage"],
  Rogue: ["Midnight", "Blade"],
  Seraph: ["Grace", "Splendor"],
  Sorcerer: ["Arcana", "Midnight"],
  Warrior: ["Blade", "Bone"],
  Wizard: ["Codex", "Arcana"],
};

export const LEVEL_PROFICIENCY_MAP: Record<Level, number> = {
  1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 4, 7: 4, 8: 5, 9: 5, 10: 6
};

export const TIER_LEVEL_RANGES: Record<Tier, Level[]> = {
  1: [1],
  2: [2, 3, 4],
  3: [5, 6, 7],
  4: [8, 9, 10],
};

///////////////////////////
// Core Validation Functions //
///////////////////////////

export function validateTraitAssignment(
  traits: Record<string, TraitValue>,
  allowedDistribution: readonly number[] = DEFAULT_TRAIT_DISTRIBUTION,
  options: ValidationOptions = {}
): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };

  const values = Object.values(traits).sort((a, b) => b - a);
  const expected = [...allowedDistribution].sort((a, b) => b - a);

  // Check if distribution matches allowed pattern
  if (options.strict !== false) {
    if (values.length !== expected.length) {
      result.valid = false;
      result.errors.push(
        `Expected ${expected.length} traits, got ${values.length}`
      );
    }

    for (let i = 0; i < Math.min(values.length, expected.length); i++) {
      if (values[i] !== expected[i]) {
        result.valid = false;
        result.errors.push(
          `Trait distribution doesn't match SRD standard: expected ${expected}, got ${values}`
        );
        break;
      }
    }
  }

  // Validate trait value ranges
  for (const [traitName, value] of Object.entries(traits)) {
    if (value < -3 || value > 4) {
      result.valid = false;
      result.errors.push(
        `Trait ${traitName} value ${value} outside valid range (-3 to +4)`
      );
    }
  }

  return result;
}

export function validateCharacterLevel(character: PlayerCharacter): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };

  // Validate level-tier consistency
  const expectedTier = deriveTier(character.level);
  if (character.tier !== expectedTier) {
    result.valid = false;
    result.errors.push(
      `Character tier ${character.tier} doesn't match level ${character.level} (expected ${expectedTier})`
    );
  }

  // Validate proficiency
  const expectedProficiency = LEVEL_PROFICIENCY_MAP[character.level];
  if (character.proficiency !== expectedProficiency) {
    result.warnings.push(
      `Proficiency ${character.proficiency} unusual for level ${character.level} (expected ${expectedProficiency})`
    );
  }

  return result;
}

export function validateDomainAccess(
  characterClass: ClassName,
  domains: DomainName[],
  allowHomebrew: boolean = false
): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };

  const standardDomains = STANDARD_CLASS_DOMAINS[characterClass];

  if (!allowHomebrew && standardDomains) {
    const invalidDomains = domains.filter(
      domain => !standardDomains.includes(domain)
    );

    if (invalidDomains.length > 0) {
      result.valid = false;
      result.errors.push(
        `Class ${characterClass} cannot access domains: ${invalidDomains.join(', ')}. ` +
        `Valid domains: ${standardDomains.join(', ')}`
      );
    }
  }

  return result;
}

export function validateDomainCards(character: PlayerCharacter): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };

  const classKit = character.classKit;
  const deck = character.domains.deck;
  const loadout = character.domains.loadout;

  // Validate domain access
  for (const card of Object.values(deck)) {
    if (!classKit.domains.includes(card.domain)) {
      result.valid = false;
      result.errors.push(
        `Character has access to card "${card.title}" from domain "${card.domain}" ` +
        `but class ${classKit.className} only has access to: ${classKit.domains.join(', ')}`
      );
    }

    // Validate card level vs character level
    if (card.level > character.level) {
      result.valid = false;
      result.errors.push(
        `Card "${card.title}" is level ${card.level} but character is only level ${character.level}`
      );
    }
  }

  // Validate loadout size
  if (loadout.active.length > 5) {
    result.valid = false;
    result.errors.push(
      `Active loadout has ${loadout.active.length} cards but maximum is 5`
    );
  }

  // Validate loadout cards exist
  for (const cardId of loadout.active) {
    if (!deck[cardId]) {
      result.valid = false;
      result.errors.push(`Active loadout references unknown card: ${cardId}`);
    }
  }

  return result;
}

export function validateEquipment(equipment: Equipment): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };

  // Validate weapon burden
  const primary = equipment.activeWeapons.primary;
  const secondary = equipment.activeWeapons.secondary;

  if (primary?.burden === "Two-Handed" && secondary) {
    result.valid = false;
    result.errors.push(
      "Cannot equip secondary weapon when primary weapon is two-handed"
    );
  }

  // Validate weapon categories
  if (primary && primary.category !== "Primary") {
    result.warnings.push(
      `Primary weapon "${primary.name}" has category "${primary.category}"`
    );
  }

  if (secondary && secondary.category !== "Secondary") {
    result.warnings.push(
      `Secondary weapon "${secondary.name}" has category "${secondary.category}"`
    );
  }

  // Validate inventory limits
  if (equipment.inventoryWeapons.length > 2) {
    result.warnings.push(
      `Character has ${equipment.inventoryWeapons.length} inventory weapons ` +
      `(SRD recommends maximum 2)`
    );
  }

  return result;
}

export function validateMortality(character: PlayerCharacter): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };

  const mortality = character.mortality;
  const hp = character.resources.hp;

  // Validate death state consistency
  if (mortality.dying && !mortality.lastHitPointMarked) {
    result.valid = false;
    result.errors.push("Character is dying but last hit point not marked");
  }

  if (mortality.stabilized && !mortality.dying) {
    result.warnings.push("Character is stabilized but not marked as dying");
  }

  if (hp.marked >= hp.maxSlots && !mortality.lastHitPointMarked) {
    result.valid = false;
    result.errors.push("All hit points marked but character not at death's door");
  }

  // Validate death move availability
  if (canUseDeathMove(character)) {
    result.info.push("Character can use a death move");
  }

  return result;
}

export function validateAdvancement(character: PlayerCharacter): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };

  const advancement = character.advancement;
  const level = character.level;

  // Check for available advancement choices
  if (hasAdvancementChoice(character, level)) {
    result.info.push(`Character has unused advancement choices for level ${level}`);
  }

  // Validate advancement choice consistency
  for (const choice of advancement.choicesMade) {
    if (choice.level > level) {
      result.valid = false;
      result.errors.push(
        `Advancement choice "${choice.description}" is for level ${choice.level} ` +
        `but character is only level ${level}`
      );
    }

    if (!choice.taken) {
      result.warnings.push(
        `Advancement choice "${choice.description}" is in choicesMade but not marked as taken`
      );
    }
  }

  // Validate multiclass requirements
  if (character.multiclass?.isMulticlassed) {
    if (level < 5) {
      result.valid = false;
      result.errors.push("Multiclassing not available until level 5");
    }
  }

  return result;
}

export function validateResources(character: PlayerCharacter): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };

  const resources = character.resources;

  // Validate hit points
  if (resources.hp.marked > resources.hp.maxSlots) {
    result.valid = false;
    result.errors.push(
      `Hit points marked (${resources.hp.marked}) exceeds maximum (${resources.hp.maxSlots})`
    );
  }

  // Validate stress
  if (resources.stress.marked > resources.stress.maxSlots) {
    result.valid = false;
    result.errors.push(
      `Stress marked (${resources.stress.marked}) exceeds maximum (${resources.stress.maxSlots})`
    );
  }

  // Validate armor
  if (resources.armor.markedSlots > resources.armor.armorScore) {
    result.valid = false;
    result.errors.push(
      `Armor slots marked (${resources.armor.markedSlots}) exceeds armor score (${resources.armor.armorScore})`
    );
  }

  // Validate hope
  if (resources.hope.current > resources.hope.maximum) {
    result.valid = false;
    result.errors.push(
      `Current hope (${resources.hope.current}) exceeds maximum (${resources.hope.maximum})`
    );
  }

  if (resources.hope.current < 0) {
    result.valid = false;
    result.errors.push("Hope cannot be negative");
  }

  return result;
}

///////////////////////////
// Comprehensive Validation //
///////////////////////////

export function validateCharacter(
  character: PlayerCharacter,
  options: ValidationOptions = {}
): ValidationResult {
  const results: ValidationResult[] = [];

  // Core validations
  results.push(validateCharacterLevel(character));
  results.push(validateTraitAssignment(character.traits, DEFAULT_TRAIT_DISTRIBUTION, options));
  results.push(validateDomainCards(character));
  results.push(validateEquipment(character.equipment));
  results.push(validateResources(character));
  results.push(validateMortality(character));
  results.push(validateAdvancement(character));

  // Domain access validation
  results.push(validateDomainAccess(
    character.classKit.className,
    character.classKit.domains,
    options.allowHomebrew
  ));

  // Custom rules
  if (options.customRules) {
    for (const rule of options.customRules) {
      results.push(rule.check(character));
    }
  }

  // Combine all results
  const combined: ValidationResult = {
    valid: results.every(r => r.valid),
    errors: results.flatMap(r => r.errors),
    warnings: results.flatMap(r => r.warnings),
    info: results.flatMap(r => r.info),
  };

  return combined;
}

///////////////////////////
// Validation Helpers    //
///////////////////////////

export function createCustomRule(
  name: string,
  check: (character: PlayerCharacter) => ValidationResult,
  severity: 'error' | 'warning' | 'info' = 'error',
  category: 'core' | 'srd' | 'homebrew' | 'optional' = 'core'
): ValidationRule {
  return { name, check, severity, category };
}

export function isValidForCampaign(
  character: PlayerCharacter,
  campaignRules: ValidationOptions
): ValidationResult {
  return validateCharacter(character, campaignRules);
}

export function getSRDCompliance(character: PlayerCharacter): ValidationResult {
  return validateCharacter(character, {
    strict: true,
    allowHomebrew: false,
    skipOptional: false,
  });
}

export function getHomebrewFriendlyValidation(character: PlayerCharacter): ValidationResult {
  return validateCharacter(character, {
    strict: false,
    allowHomebrew: true,
    skipOptional: true,
  });
}
