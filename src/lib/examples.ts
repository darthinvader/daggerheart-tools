/**
 * Example Character Creation
 * Demonstrates how to use the clean schema architecture
 */
import {
  createBasicCharacter,
  createSRDTraits,
  validateCharacter,
  validateSRDCharacter,
} from './schemas';

// Create a basic SRD-compliant character
export function createExampleWarrior() {
  const srdTraits = createSRDTraits([2, 1, 1, 0, 0, -1]);

  return createBasicCharacter({
    name: 'Kael the Bold',
    level: 3,
    ancestry: 'Human',
    community: 'Wildborne',
    className: 'Warrior',
    traits: srdTraits,
  });
}

// Create a homebrew character with custom traits
export function createHomebrewMage() {
  return createBasicCharacter({
    name: 'Zara Starweaver',
    level: 5,
    ancestry: 'Mystic Elf',
    community: 'Starborne',
    className: 'Arcane Scholar',
    traits: {
      Agility: 1,
      Strength: -1,
      Finesse: 2,
      Instinct: 3,
      Presence: 1,
      Knowledge: 4,
    },
    homebrewMode: true,
  });
}

// Validate characters and return results
export function exampleValidation() {
  const warrior = createExampleWarrior();
  const mage = createHomebrewMage();

  return {
    warrior,
    mage,
    validation: {
      warriorValid: validateCharacter(warrior).success,
      mageValid: validateCharacter(mage).success,
      warriorSRD: validateSRDCharacter(warrior).success,
      mageSRD: validateSRDCharacter(mage).success,
    },
  };
}

// Example usage:
// const result = exampleValidation();
// result.validation.warriorValid === true
// result.validation.mageSRD === false (homebrew not allowed in SRD)
