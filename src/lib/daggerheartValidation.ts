// Daggerheart Character Validation and Creation Utilities
// Provides validation functions and creation helpers for Daggerheart characters

import type {
  DaggerheartCharacter,
  CharacterValidation,
  TraitModifier,
  Heritage,
  AncestryFeature
} from './daggerheartCharacter';

import {
  STANDARD_CLASS_DOMAINS,
  CHARACTER_DEFAULTS,
  STANDARD_TRAIT_MODIFIERS,
  TOP_FEATURE_TYPES,
  BOTTOM_FEATURE_TYPES
} from './daggerheartCharacter';

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates trait assignment follows the standard rules (customizable for homebrew)
 * @param traits - Character traits to validate
 * @param expectedModifiers - Expected modifier distribution (defaults to standard)
 */
export function validateTraitAssignment(
  traits: Record<string, TraitModifier>,
  expectedModifiers: readonly number[] = STANDARD_TRAIT_MODIFIERS
): CharacterValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check that we have the expected number of traits
  const traitCount = Object.keys(traits).length;
  if (traitCount !== expectedModifiers.length) {
    errors.push(`Expected ${expectedModifiers.length} traits, got ${traitCount}`);
  }

  // Check that modifiers match expected distribution
  const assignedModifiers = Object.values(traits).sort((a, b) => b - a);
  const requiredModifiers = [...expectedModifiers].sort((a, b) => b - a);

  if (assignedModifiers.length === requiredModifiers.length) {
    for (let i = 0; i < assignedModifiers.length; i++) {
      if (assignedModifiers[i] !== requiredModifiers[i]) {
        warnings.push(`Trait modifiers don't match standard distribution: ${requiredModifiers.join(', ')}`);
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates that domain cards belong to the character's available domains
 * @param characterClass - Character's class name
 * @param domainCardDomains - Array of domain names from character's cards
 * @param classDomainMap - Map of class to available domains (defaults to standard)
 */
export function validateDomainCards(
  characterClass: string,
  domainCardDomains: string[],
  classDomainMap: Record<string, readonly string[]> = STANDARD_CLASS_DOMAINS
): CharacterValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const availableDomains = classDomainMap[characterClass];

  if (!availableDomains) {
    warnings.push(`No domain restrictions found for class "${characterClass}" - allowing all domains`);
    return { isValid: true, errors, warnings };
  }

  for (const domain of domainCardDomains) {
    if (!availableDomains.includes(domain)) {
      errors.push(`Domain "${domain}" is not available to ${characterClass} class`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates loadout size doesn't exceed maximum
 */
export function validateLoadout(
  loadoutSize: number,
  maxSize: number = CHARACTER_DEFAULTS.maxLoadoutSize
): CharacterValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (loadoutSize > maxSize) {
    errors.push(`Loadout cannot exceed ${maxSize} cards, got ${loadoutSize}`);
  }

  if (loadoutSize === 0) {
    warnings.push('Character has no domain cards in loadout');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates experiences meet creation requirements
 */
export function validateExperiences(
  experiences: { name: string; modifier: number }[],
  expectedCount: number = CHARACTER_DEFAULTS.numberOfStartingExperiences,
  expectedModifier: number = CHARACTER_DEFAULTS.startingExperienceModifier
): CharacterValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (experiences.length !== expectedCount) {
    warnings.push(`Expected ${expectedCount} experiences for starting character, got ${experiences.length}`);
  }

  for (const exp of experiences) {
    if (exp.modifier !== expectedModifier) {
      warnings.push(`Starting experiences typically have +${expectedModifier} modifier, "${exp.name}" has +${exp.modifier}`);
    }

    if (!exp.name || exp.name.trim().length === 0) {
      errors.push('Experience names cannot be empty');
    }

    // Check for overly broad experiences
    const broadExperiences = ['Lucky', 'Highly Skilled', 'Talented', 'Gifted'];
    if (broadExperiences.some(broad => exp.name.toLowerCase().includes(broad.toLowerCase()))) {
      warnings.push(`Experience "${exp.name}" may be too broadly applicable`);
    }

    // Check for magical abilities
    const magicalTerms = ['Flight', 'Invulnerable', 'Telepathy', 'Supersonic'];
    if (magicalTerms.some(term => exp.name.toLowerCase().includes(term.toLowerCase()))) {
      warnings.push(`Experience "${exp.name}" may grant mechanical benefits that should come from domain cards`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates complete character follows creation rules
 */
export function validateCharacter(character: DaggerheartCharacter): CharacterValidation {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Validate traits
  const traitValidation = validateTraitAssignment(character.traits);
  allErrors.push(...traitValidation.errors);
  allWarnings.push(...traitValidation.warnings);

  // Validate domain cards
  const domainCardDomains = character.loadout.concat(character.vault).map(card => card.domain);
  const domainValidation = validateDomainCards(character.class.name, domainCardDomains);
  allErrors.push(...domainValidation.errors);
  allWarnings.push(...domainValidation.warnings);

  // Validate loadout
  const loadoutValidation = validateLoadout(character.loadout.length);
  allErrors.push(...loadoutValidation.errors);
  allWarnings.push(...loadoutValidation.warnings);

  // Validate experiences
  const experienceValidation = validateExperiences(character.experiences);
  allErrors.push(...experienceValidation.errors);
  allWarnings.push(...experienceValidation.warnings);

  // Validate level constraints
  if (character.level < 1) {
    allErrors.push(`Character level must be at least 1, got ${character.level}`);
  }

  // Validate domain card levels
  for (const card of character.loadout.concat(character.vault)) {
    if (card.level > character.level) {
      allErrors.push(`Domain card "${card.name}" (level ${card.level}) exceeds character level ${character.level}`);
    }
  }

  // Validate hit points
  if (character.hitPoints.current > character.hitPoints.maximum) {
    allWarnings.push('Current hit points exceed maximum');
  }

  // Validate stress
  if (character.stress.current > character.stress.maximum) {
    allWarnings.push('Current stress exceeds maximum');
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}

// ============================================================================
// CHARACTER CREATION HELPERS
// ============================================================================

/**
 * Calculates derived stats based on character choices
 */
export function calculateDerivedStats(
  startingHitPoints: number,
  startingEvasion: number,
  level: number,
  armor: { baseThresholds: { minor: number; major: number }; baseScore: number }
) {
  return {
    hitPoints: startingHitPoints,
    evasion: startingEvasion,
    damageThresholds: {
      minor: armor.baseThresholds.minor + level,
      major: armor.baseThresholds.major + level
    },
    armorScore: armor.baseScore,
    proficiency: level,
    stress: {
      current: 0,
      maximum: CHARACTER_DEFAULTS.startingStressSlots
    },
    hope: CHARACTER_DEFAULTS.startingHope
  };
}

/**
 * Gets available domains for a class from the standard mapping
 */
export function getStandardAvailableDomains(characterClass: string): readonly string[] | undefined {
  return STANDARD_CLASS_DOMAINS[characterClass as keyof typeof STANDARD_CLASS_DOMAINS];
}

/**
 * Checks if a domain is available to a class in the standard mapping
 */
export function isStandardDomainAvailable(characterClass: string, domain: string): boolean {
  const domains = getStandardAvailableDomains(characterClass);
  return domains ? domains.includes(domain) : true; // Allow if no restrictions
}

/**
 * Gets the remaining trait modifiers that need to be assigned
 */
export function getRemainingTraitModifiers(
  assigned: Record<string, TraitModifier>,
  expectedModifiers: readonly number[] = STANDARD_TRAIT_MODIFIERS
): number[] {
  const assignedValues = Object.values(assigned);
  const remaining = [...expectedModifiers];

  for (const value of assignedValues) {
    const index = remaining.indexOf(value);
    if (index >= 0) {
      remaining.splice(index, 1);
    }
  }

  return remaining;
}

/**
 * Checks if trait assignment is complete
 */
export function isTraitAssignmentComplete(
  traits: Record<string, TraitModifier>,
  expectedCount: number = STANDARD_TRAIT_MODIFIERS.length
): boolean {
  return Object.keys(traits).length === expectedCount;
}

// ============================================================================
// EXAMPLE DATA FOR TESTING
// ============================================================================

/** Example experiences that are appropriately scoped */
export const EXAMPLE_EXPERIENCES = [
  'Assassin', 'Blacksmith', 'Bodyguard', 'Bounty Hunter', 'Chef to the Royal Family',
  'Circus Performer', 'Con Artist', 'Fallen Monarch', 'Field Medic', 'High Priestess',
  'Merchant', 'Noble', 'Pirate', 'Politician', 'Runaway', 'Scholar', 'Sellsword',
  'Soldier', 'Storyteller', 'Thief', 'World Traveler'
];

/** Example background questions (these would vary by class) */
export const EXAMPLE_BACKGROUND_QUESTIONS = [
  'What drove you to adventure?',
  'What is your greatest fear?',
  'Who do you trust most in the world?',
  'What is your most prized possession?',
  'What mistake haunts you?'
];

// ============================================================================
// HOMEBREW VALIDATION (from Homebrew Kit)
// ============================================================================

/**
 * Validates mixed ancestry combinations based on Homebrew Kit guidelines
 * Ensures balanced combinations of Top and Bottom features
 */
export function validateMixedAncestry(
  heritage: Heritage
): CharacterValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!heritage.isMixedAncestry) {
    return { isValid: true, errors, warnings };
  }

  const { firstFeature, secondFeature } = heritage.ancestry;

  // Check if we have proper top/bottom feature combination
  if (firstFeature.position && secondFeature.position) {
    if (firstFeature.position === secondFeature.position) {
      warnings.push(`Mixed ancestry has two ${firstFeature.position} features, which may create power imbalance`);
    }
  }

  // Check for potentially overpowered combinations
  if (firstFeature.featureType && secondFeature.featureType) {
    const powerfulTypes = ['hp_stress_bonus', 'damage_mitigation', 'flight', 'roll_manipulation'];
    if (powerfulTypes.includes(firstFeature.featureType) && 
        powerfulTypes.includes(secondFeature.featureType)) {
      warnings.push('This mixed ancestry combination may be very powerful - consider GM approval');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates domain card recall costs based on Homebrew Kit guidelines
 */
export function validateRecallCosts(
  domainCards: Array<{ recallCost: number; level: number; type: string; features: Array<{ vaultPlacement?: { canPlace: boolean } }> }>
): CharacterValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const card of domainCards) {
    // Basic cost validation
    if (card.recallCost < 0) {
      errors.push(`Domain card cannot have negative recall cost: ${card.recallCost}`);
    }

    if (card.recallCost > 4) {
      warnings.push(`Recall cost of ${card.recallCost} is unusually high - ensure this is intentional`);
    }

    // Grimoire cost validation
    if (card.type.toLowerCase() === 'grimoire' && card.recallCost < 2) {
      warnings.push(`Grimoires typically have recall cost of 2+ due to providing multiple options`);
    }

    // Vault placement tax validation
    const hasVaultPlacement = card.features.some(f => f.vaultPlacement?.canPlace);
    if (hasVaultPlacement && card.recallCost < 2) {
      warnings.push(`Cards with vault placement features should have higher recall costs`);
    }

    // Level-based cost validation
    if (card.level >= 7 && card.recallCost === 0) {
      warnings.push(`High-level cards (7+) typically have recall costs to balance their power`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates ancestry feature types follow Homebrew Kit design patterns
 */
export function validateAncestryFeatureTypes(
  ancestry: { firstFeature: AncestryFeature; secondFeature: AncestryFeature }
): CharacterValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const { firstFeature, secondFeature } = ancestry;

  // Check if features have position data
  if (!firstFeature.position || !secondFeature.position) {
    warnings.push('Ancestry features should specify position (top/bottom) for better mixed ancestry support');
  }

  // Check if features have type data for design guidance
  if (!firstFeature.featureType || !secondFeature.featureType) {
    warnings.push('Ancestry features should specify featureType for design validation');
  }

  // Validate position against typical patterns
  if (firstFeature.position === 'top' && firstFeature.featureType) {
    const topTypes = TOP_FEATURE_TYPES as readonly string[];
    if (!topTypes.includes(firstFeature.featureType)) {
      warnings.push(`First feature type "${firstFeature.featureType}" is unusual for top features`);
    }
  }

  if (secondFeature.position === 'bottom' && secondFeature.featureType) {
    const bottomTypes = BOTTOM_FEATURE_TYPES as readonly string[];
    if (!bottomTypes.includes(secondFeature.featureType)) {
      warnings.push(`Second feature type "${secondFeature.featureType}" is unusual for bottom features`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
