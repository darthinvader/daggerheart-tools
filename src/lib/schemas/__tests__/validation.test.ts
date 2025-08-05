/**
 * Tests for Validation Utilities
 */
import { describe, expect, test } from 'vitest';

import {
  createBasicCharacter,
  createDefaultTraits,
  createSRDTraits,
  deriveTier,
  getValidationErrors,
  validateCharacter,
  validateSRDCharacter,
} from '../validation';

describe('Validation Functions', () => {
  const validCharacter = {
    id: 'char-123',
    name: 'Test Character',
    level: 1,
    tier: 1,
    evasion: 10,
    proficiency: 1,
    traits: {
      Agility: 2,
      Strength: 1,
      Finesse: 1,
      Instinct: 0,
      Presence: 0,
      Knowledge: -1,
    },
    ancestry: 'Human',
    community: 'Wildborne',
    className: 'Warrior',
    hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
    stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
    hope: { current: 2, maximum: 6, sessionGenerated: 0 },
    conditions: [],
    temporaryEffects: [],
    homebrewMode: false,
    rulesVersion: 'SRD-1.0',
  };

  describe('validateCharacter', () => {
    test('returns success for valid character', () => {
      const result = validateCharacter(validCharacter);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
      }
    });

    test('returns failure for invalid character', () => {
      const invalidCharacter = {
        ...validCharacter,
        level: 'invalid',
      };

      const result = validateCharacter(invalidCharacter);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    test('allows homebrew characters', () => {
      const homebrewCharacter = {
        ...validCharacter,
        homebrewMode: true,
        traits: {
          Agility: 5,
          Strength: 3,
          Finesse: 2,
          Instinct: 1,
          Presence: 0,
          Knowledge: -2,
        },
      };

      const result = validateCharacter(homebrewCharacter);
      expect(result.success).toBe(true);
    });
  });

  describe('validateSRDCharacter', () => {
    test('returns success for SRD-compliant character', () => {
      const result = validateSRDCharacter(validCharacter);

      expect(result.success).toBe(true);
    });

    test('rejects homebrew characters', () => {
      const homebrewCharacter = {
        ...validCharacter,
        homebrewMode: true,
      };

      const result = validateSRDCharacter(homebrewCharacter);
      expect(result.success).toBe(false);
    });

    test('rejects invalid trait distributions', () => {
      const invalidTraitsCharacter = {
        ...validCharacter,
        traits: {
          Agility: 3,
          Strength: 2,
          Finesse: 1,
          Instinct: 0,
          Presence: 0,
          Knowledge: -1,
        },
      };

      const result = validateSRDCharacter(invalidTraitsCharacter);
      expect(result.success).toBe(false);
    });
  });

  describe('getValidationErrors', () => {
    test('returns empty array for valid character', () => {
      const errors = getValidationErrors(validCharacter);

      expect(errors).toEqual([]);
    });

    test('returns error messages for invalid character', () => {
      const invalidCharacter = {
        ...validCharacter,
        name: '',
        level: 15,
      };

      const errors = getValidationErrors(invalidCharacter);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.includes('name'))).toBe(true);
    });

    test('handles SRD mode validation', () => {
      const homebrewCharacter = {
        ...validCharacter,
        homebrewMode: true,
      };

      const standardErrors = getValidationErrors(homebrewCharacter, false);
      const srdErrors = getValidationErrors(homebrewCharacter, true);

      expect(standardErrors).toEqual([]);
      expect(srdErrors.length).toBeGreaterThan(0);
    });
  });
});

describe('Character Creation Utilities', () => {
  describe('createDefaultTraits', () => {
    test('creates traits with all zeros', () => {
      const traits = createDefaultTraits();

      expect(traits).toEqual({
        Agility: 0,
        Strength: 0,
        Finesse: 0,
        Instinct: 0,
        Presence: 0,
        Knowledge: 0,
      });
    });
  });

  describe('createSRDTraits', () => {
    test('creates traits from distribution array', () => {
      const distribution: [number, number, number, number, number, number] = [
        2, 1, 1, 0, 0, -1,
      ];
      const traits = createSRDTraits(distribution);

      expect(traits).toEqual({
        Agility: 2,
        Strength: 1,
        Finesse: 1,
        Instinct: 0,
        Presence: 0,
        Knowledge: -1,
      });
    });

    test('accepts different arrangements', () => {
      const distribution: [number, number, number, number, number, number] = [
        -1, 0, 1, 2, 0, 1,
      ];
      const traits = createSRDTraits(distribution);

      expect(traits).toEqual({
        Agility: -1,
        Strength: 0,
        Finesse: 1,
        Instinct: 2,
        Presence: 0,
        Knowledge: 1,
      });
    });
  });

  describe('createBasicCharacter', () => {
    test('creates character with required params', () => {
      const character = createBasicCharacter({
        name: 'Test Hero',
        level: 3,
        ancestry: 'Elf',
        community: 'Loreborne',
        className: 'Wizard',
      });

      expect(character.name).toBe('Test Hero');
      expect(character.level).toBe(3);
      expect(character.tier).toBe(2);
      expect(character.ancestry).toBe('Elf');
      expect(character.community).toBe('Loreborne');
      expect(character.className).toBe('Wizard');
      expect(character.homebrewMode).toBe(false);
      expect(character.rulesVersion).toBe('SRD-1.0');
    });

    test('accepts custom traits', () => {
      const customTraits = {
        Agility: 1,
        Strength: 2,
        Finesse: 0,
        Instinct: 1,
        Presence: 0,
        Knowledge: -1,
      };

      const character = createBasicCharacter({
        name: 'Custom Hero',
        level: 2,
        ancestry: 'Human',
        community: 'Wildborne',
        className: 'Ranger',
        traits: customTraits,
      });

      expect(character.traits).toEqual(customTraits);
    });

    test('creates homebrew character', () => {
      const character = createBasicCharacter({
        name: 'Homebrew Hero',
        level: 5,
        ancestry: 'Custom Ancestry',
        community: 'Custom Community',
        className: 'Custom Class',
        homebrewMode: true,
      });

      expect(character.homebrewMode).toBe(true);
      expect(character.rulesVersion).toBe('Homebrew');
    });

    test('generates unique IDs', () => {
      const char1 = createBasicCharacter({
        name: 'Hero 1',
        level: 1,
        ancestry: 'Human',
        community: 'Wildborne',
        className: 'Warrior',
      });

      const char2 = createBasicCharacter({
        name: 'Hero 2',
        level: 1,
        ancestry: 'Human',
        community: 'Wildborne',
        className: 'Warrior',
      });

      expect(char1.id).not.toBe(char2.id);
      expect(char1.id).toMatch(/^[0-9a-f-]+$/);
    });

    test('sets correct proficiency based on level', () => {
      const testCases = [
        { level: 1, expectedProficiency: 1 },
        { level: 2, expectedProficiency: 1 },
        { level: 3, expectedProficiency: 2 },
        { level: 4, expectedProficiency: 2 },
        { level: 5, expectedProficiency: 3 },
        { level: 10, expectedProficiency: 5 },
      ];

      testCases.forEach(({ level, expectedProficiency }) => {
        const character = createBasicCharacter({
          name: 'Test',
          level: level as any,
          ancestry: 'Human',
          community: 'Wildborne',
          className: 'Warrior',
        });

        expect(character.proficiency).toBe(expectedProficiency);
      });
    });
  });

  describe('deriveTier', () => {
    test('derives correct tier from level', () => {
      const testCases = [
        { level: 1, expectedTier: 1 },
        { level: 2, expectedTier: 2 },
        { level: 3, expectedTier: 2 },
        { level: 4, expectedTier: 2 },
        { level: 5, expectedTier: 3 },
        { level: 6, expectedTier: 3 },
        { level: 7, expectedTier: 3 },
        { level: 8, expectedTier: 4 },
        { level: 9, expectedTier: 4 },
        { level: 10, expectedTier: 4 },
      ];

      testCases.forEach(({ level, expectedTier }) => {
        const tier = deriveTier(level as any);
        expect(tier).toBe(expectedTier);
      });
    });
  });
});
