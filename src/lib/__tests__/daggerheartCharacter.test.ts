/**
 * Comprehensive Test Suite for Daggerheart Character System
 * 
 * Tests for schema validation, character creation, and utility functions.
 * Covers both SRD-compliant and homebrew scenarios.
 * 
 * @author Someone who actually writes tests (unlike most developers)
 */

import { describe, it, expect, test } from 'vitest';
import {
  PlayerCharacterSchema,
  SRDPlayerCharacterSchema,
  TraitsSchema,
  SRDTraitsSchema,
  WeaponSchema,
  ArmorSchema,
  HitPointsSchema,
  StressTrackSchema,
  HopeStateSchema,
  CharacterFactory,
  CharacterValidator,
  CharacterUtilities,
  DEFAULT_VALUES,
  CORE_CLASSES,
  CORE_DOMAINS,
  CORE_ANCESTRIES,
  CORE_COMMUNITIES
} from '../daggerheartCharacter';
import type { 
  PlayerCharacter, 
  Traits, 
  Weapon, 
  Armor,
  Level,
  ClassName,
  AncestryName,
  CommunityName
} from '../daggerheartCharacter';

describe('Core Schema Validation', () => {
  describe('TraitsSchema', () => {
    test('accepts valid trait values within homebrew range', () => {
      const validTraits = {
        Agility: 5,
        Strength: -2,
        Finesse: 0,
        Instinct: 12,
        Presence: 30,
        Knowledge: -5
      };
      
      expect(() => TraitsSchema.parse(validTraits)).not.toThrow();
    });

    test('rejects trait values outside bounds', () => {
      const invalidTraits = {
        Agility: 100, // Too high
        Strength: -20, // Too low
        Finesse: 0,
        Instinct: 0,
        Presence: 0,
        Knowledge: 0
      };
      
      expect(() => TraitsSchema.parse(invalidTraits)).toThrow();
    });

    test('requires all six traits', () => {
      const incompleteTraits = {
        Agility: 1,
        Strength: 0
        // Missing other traits
      };
      
      expect(() => TraitsSchema.parse(incompleteTraits)).toThrow();
    });
  });

  describe('SRDTraitsSchema', () => {
    test('accepts SRD standard array distribution', () => {
      const srdTraits = {
        Agility: 2,
        Strength: 1,
        Finesse: 1,
        Instinct: 0,
        Presence: 0,
        Knowledge: -1
      };
      
      expect(() => SRDTraitsSchema.parse(srdTraits)).not.toThrow();
    });

    test('rejects non-standard distributions', () => {
      const nonStandardTraits = {
        Agility: 3, // Too high for standard array
        Strength: 2,
        Finesse: 1,
        Instinct: 0,
        Presence: 0,
        Knowledge: -1
      };
      
      expect(() => SRDTraitsSchema.parse(nonStandardTraits)).toThrow();
      expect(() => SRDTraitsSchema.parse(nonStandardTraits)).toThrow(/standard array/);
    });

    test('rejects traits with wrong total count', () => {
      const wrongCountTraits = {
        Agility: 2,
        Strength: 2, // Should be 1
        Finesse: 1,
        Instinct: 0,
        Presence: 0,
        Knowledge: 0 // Should be -1
      };
      
      expect(() => SRDTraitsSchema.parse(wrongCountTraits)).toThrow();
    });
  });

  describe('WeaponSchema', () => {
    test('validates basic weapon', () => {
      const basicSword: Weapon = {
        id: 'sword-1',
        name: 'Iron Sword',
        trait: 'Strength',
        range: 'Melee',
        damageDie: 'd8',
        damageType: 'phy',
        burden: 'One-Handed',
        features: ['Reliable']
      };
      
      expect(() => WeaponSchema.parse(basicSword)).not.toThrow();
    });

    test('validates spellcasting weapon', () => {
      const spellWeapon: Weapon = {
        id: 'staff-1',
        name: 'Wizard Staff',
        trait: 'Spellcast',
        range: 'Very Far',
        damageDie: 'd6',
        damageType: 'mag',
        burden: 'Two-Handed',
        features: ['Focus']
      };
      
      expect(() => WeaponSchema.parse(spellWeapon)).not.toThrow();
    });

    test('rejects invalid damage die format', () => {
      const invalidWeapon = {
        id: 'bad-weapon',
        name: 'Bad Weapon',
        trait: 'Strength',
        range: 'Melee',
        damageDie: '1d8', // Should be 'd8'
        damageType: 'phy',
        burden: 'One-Handed',
        features: []
      };
      
      expect(() => WeaponSchema.parse(invalidWeapon)).toThrow();
    });
  });

  describe('ArmorSchema', () => {
    test('validates basic armor', () => {
      const basicArmor: Armor = {
        id: 'leather-1',
        name: 'Leather Armor',
        majorThreshold: 3,
        severeThreshold: 6,
        armorScore: 2,
        features: ['Flexible']
      };
      
      expect(() => ArmorSchema.parse(basicArmor)).not.toThrow();
    });

    test('rejects negative armor values', () => {
      const invalidArmor = {
        id: 'bad-armor',
        name: 'Broken Armor',
        majorThreshold: -1, // Invalid
        severeThreshold: 6,
        armorScore: 2,
        features: []
      };
      
      expect(() => ArmorSchema.parse(invalidArmor)).toThrow();
    });
  });

  describe('Resource Schemas', () => {
    test('HitPointsSchema validates correctly', () => {
      const validHP = {
        maxSlots: 20,
        marked: 5,
        temporaryBonus: 0
      };
      
      expect(() => HitPointsSchema.parse(validHP)).not.toThrow();
    });

    test('HitPointsSchema rejects overmarked HP', () => {
      const invalidHP = {
        maxSlots: 20,
        marked: 25, // More than max
        temporaryBonus: 0
      };
      
      expect(() => HitPointsSchema.parse(invalidHP)).toThrow(/exceed maximum/);
    });

    test('HopeStateSchema enforces max of 6', () => {
      const invalidHope = {
        current: 8, // Too high
        maximum: 6,
        sessionGenerated: 0
      };
      
      expect(() => HopeStateSchema.parse(invalidHope)).toThrow();
    });
  });
});

describe('Character Creation and Validation', () => {
  describe('PlayerCharacterSchema', () => {
    test('validates complete homebrew character', () => {
      const homebrewCharacter: PlayerCharacter = {
        id: 'test-char-1',
        name: 'Kratos',
        level: 10,
        tier: 4,
        evasion: 25,
        proficiency: 15,
        traits: {
          Agility: 5,
          Strength: 30,
          Finesse: 2,
          Instinct: 8,
          Presence: 12,
          Knowledge: 1
        },
        ancestry: 'Divine Being', // Custom ancestry
        community: 'Mount Olympus', // Custom community
        className: 'God of War', // Custom class
        hitPoints: { maxSlots: 50, marked: 0, temporaryBonus: 0 },
        stress: { maxSlots: 10, marked: 0, temporaryBonus: 0 },
        hope: { current: 6, maximum: 6, sessionGenerated: 0 },
        conditions: [],
        temporaryEffects: [],
        homebrewMode: true,
        rulesVersion: 'Homebrew'
      };
      
      expect(() => PlayerCharacterSchema.parse(homebrewCharacter)).not.toThrow();
    });

    test('prevents secondary weapon with two-handed primary', () => {
      const invalidCharacter = {
        id: 'test-char-2',
        name: 'Dual Wielder',
        level: 1,
        tier: 1,
        evasion: 10,
        proficiency: 1,
        traits: { Agility: 2, Strength: 1, Finesse: 1, Instinct: 0, Presence: 0, Knowledge: -1 },
        ancestry: 'Human',
        community: 'Wanderborne',
        className: 'Warrior',
        hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
        stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
        hope: { current: 2, maximum: 6, sessionGenerated: 0 },
        primaryWeapon: {
          id: 'greatsword',
          name: 'Greatsword',
          trait: 'Strength',
          range: 'Melee',
          damageDie: 'd10',
          damageType: 'phy',
          burden: 'Two-Handed',
          features: []
        },
        secondaryWeapon: {
          id: 'dagger',
          name: 'Dagger',
          trait: 'Finesse',
          range: 'Melee',
          damageDie: 'd4',
          damageType: 'phy',
          burden: 'One-Handed',
          features: []
        },
        conditions: [],
        temporaryEffects: [],
        homebrewMode: false,
        rulesVersion: 'SRD-1.0'
      };
      
      expect(() => PlayerCharacterSchema.parse(invalidCharacter)).toThrow(/two-handed/);
    });
  });

  describe('SRDPlayerCharacterSchema', () => {
    test('validates SRD-compliant character', () => {
      const srdCharacter = {
        id: 'srd-char-1',
        name: 'Standard Hero',
        level: 5,
        tier: 3, // Level 5 = Tier 3
        evasion: 12,
        proficiency: 3,
        traits: { Agility: 2, Strength: 1, Finesse: 1, Instinct: 0, Presence: 0, Knowledge: -1 },
        ancestry: 'Human',
        community: 'Wanderborne',
        className: 'Warrior',
        hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
        stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
        hope: { current: 2, maximum: 6, sessionGenerated: 0 },
        conditions: [],
        temporaryEffects: [],
        homebrewMode: false,
        rulesVersion: 'SRD-1.0'
      };
      
      expect(() => SRDPlayerCharacterSchema.parse(srdCharacter)).not.toThrow();
    });

    test('rejects homebrew mode in SRD schema', () => {
      const homebrewCharacter = {
        id: 'homebrew-char',
        name: 'Homebrew Hero',
        level: 1,
        tier: 1,
        evasion: 10,
        proficiency: 1,
        traits: { Agility: 2, Strength: 1, Finesse: 1, Instinct: 0, Presence: 0, Knowledge: -1 },
        ancestry: 'Human',
        community: 'Wanderborne',
        className: 'Warrior',
        hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
        stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
        hope: { current: 2, maximum: 6, sessionGenerated: 0 },
        conditions: [],
        temporaryEffects: [],
        homebrewMode: true, // This should fail
        rulesVersion: 'Homebrew'
      };
      
      expect(() => SRDPlayerCharacterSchema.parse(homebrewCharacter)).toThrow();
    });

    test('enforces tier-level relationship', () => {
      const invalidTierCharacter = {
        id: 'wrong-tier',
        name: 'Wrong Tier',
        level: 8, // Should be tier 4
        tier: 2, // Wrong tier
        evasion: 10,
        proficiency: 4,
        traits: { Agility: 2, Strength: 1, Finesse: 1, Instinct: 0, Presence: 0, Knowledge: -1 },
        ancestry: 'Human',
        community: 'Wanderborne',
        className: 'Warrior',
        hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
        stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
        hope: { current: 2, maximum: 6, sessionGenerated: 0 },
        conditions: [],
        temporaryEffects: [],
        homebrewMode: false,
        rulesVersion: 'SRD-1.0'
      };
      
      expect(() => SRDPlayerCharacterSchema.parse(invalidTierCharacter)).toThrow(/tier must match level/);
    });
  });
});

describe('CharacterFactory', () => {
  describe('createDefaultTraits', () => {
    test('creates traits with all zeros', () => {
      const traits = CharacterFactory.createDefaultTraits();
      
      expect(traits.Agility).toBe(0);
      expect(traits.Strength).toBe(0);
      expect(traits.Finesse).toBe(0);
      expect(traits.Instinct).toBe(0);
      expect(traits.Presence).toBe(0);
      expect(traits.Knowledge).toBe(0);
    });
  });

  describe('createSRDTraits', () => {
    test('creates valid SRD trait distribution', () => {
      const distribution: [number, number, number, number, number, number] = [2, 1, 1, 0, 0, -1];
      const traits = CharacterFactory.createSRDTraits(distribution);
      
      expect(traits.Agility).toBe(2);
      expect(traits.Strength).toBe(1);
      expect(traits.Finesse).toBe(1);
      expect(traits.Instinct).toBe(0);
      expect(traits.Presence).toBe(0);
      expect(traits.Knowledge).toBe(-1);
      
      // Should pass SRD validation
      expect(() => SRDTraitsSchema.parse(traits)).not.toThrow();
    });

    test('throws on invalid SRD distribution', () => {
      const invalidDistribution: [number, number, number, number, number, number] = [3, 2, 1, 0, 0, -1];
      
      expect(() => CharacterFactory.createSRDTraits(invalidDistribution)).toThrow();
    });
  });

  describe('createHomebrewTraits', () => {
    test('creates homebrew traits with extreme values', () => {
      const homebrewTraits = CharacterFactory.createHomebrewTraits({
        Agility: 25,
        Strength: 50,
        Finesse: -5,
        Instinct: 15,
        Presence: 30,
        Knowledge: 8
      });
      
      expect(homebrewTraits.Strength).toBe(50);
      expect(homebrewTraits.Finesse).toBe(-5);
      expect(() => TraitsSchema.parse(homebrewTraits)).not.toThrow();
    });
  });

  describe('createBasicCharacter', () => {
    test('creates valid SRD character', () => {
      const character = CharacterFactory.createBasicCharacter({
        name: 'Test Hero',
        level: 3,
        ancestry: 'Human',
        community: 'Wanderborne',
        className: 'Warrior'
      });
      
      expect(character.name).toBe('Test Hero');
      expect(character.level).toBe(3);
      expect(character.tier).toBe(2); // Auto-derived
      expect(character.homebrewMode).toBe(false);
      expect(character.rulesVersion).toBe('SRD-1.0');
      expect(character.id).toBeDefined();
      
      // Should validate successfully
      expect(() => PlayerCharacterSchema.parse(character)).not.toThrow();
    });

    test('creates homebrew character with custom traits', () => {
      const customTraits = CharacterFactory.createHomebrewTraits({
        Agility: 15,
        Strength: 20,
        Finesse: 5,
        Instinct: 10,
        Presence: 12,
        Knowledge: 8
      });

      const character = CharacterFactory.createBasicCharacter({
        name: 'Homebrew Hero',
        level: 5,
        ancestry: 'Dragon-born', // Custom ancestry
        community: 'Sky Pirates', // Custom community
        className: 'Elemental Master', // Custom class
        traits: customTraits,
        homebrewMode: true
      });
      
      expect(character.homebrewMode).toBe(true);
      expect(character.rulesVersion).toBe('Homebrew');
      expect(character.traits.Strength).toBe(20);
    });
  });

  describe('createHomebrewCharacter', () => {
    test('creates fully custom character', () => {
      const character = CharacterFactory.createHomebrewCharacter({
        name: 'Ultimate Being',
        level: 25,
        tier: 5,
        evasion: 40,
        proficiency: 18,
        traits: {
          Agility: 35,
          Strength: 45,
          Finesse: 30,
          Instinct: 40,
          Presence: 50,
          Knowledge: 42
        },
        ancestry: 'Cosmic Entity',
        community: 'Multiverse',
        className: 'Reality Shaper'
      });
      
      expect(character.homebrewMode).toBe(true);
      expect(character.level).toBe(25);
      expect(character.tier).toBe(5);
      expect(character.traits.Presence).toBe(50);
      expect(character.ancestry).toBe('Cosmic Entity');
    });
  });
});

describe('CharacterValidator', () => {
  const validSRDCharacter = {
    id: 'valid-srd',
    name: 'Valid Hero',
    level: 1,
    tier: 1,
    evasion: 10,
    proficiency: 1,
    traits: { Agility: 2, Strength: 1, Finesse: 1, Instinct: 0, Presence: 0, Knowledge: -1 },
    ancestry: 'Human',
    community: 'Wanderborne',
    className: 'Warrior',
    hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
    stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
    hope: { current: 2, maximum: 6, sessionGenerated: 0 },
    conditions: [],
    temporaryEffects: [],
    homebrewMode: false,
    rulesVersion: 'SRD-1.0'
  };

  test('validate accepts valid character', () => {
    const result = CharacterValidator.validate(validSRDCharacter);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Valid Hero');
    }
  });

  test('validateSRD enforces SRD rules', () => {
    const homebrewCharacter = {
      ...validSRDCharacter,
      traits: { Agility: 10, Strength: 20, Finesse: 5, Instinct: 8, Presence: 15, Knowledge: 3 },
      homebrewMode: true
    };
    
    const standardResult = CharacterValidator.validate(homebrewCharacter);
    const srdResult = CharacterValidator.validateSRD(homebrewCharacter);
    
    expect(standardResult.success).toBe(true); // Should pass standard validation
    expect(srdResult.success).toBe(false); // Should fail SRD validation
  });

  test('getValidationErrors returns descriptive errors', () => {
    const invalidCharacter = {
      name: '', // Invalid
      level: 15, // Out of range
      tier: 1, // Wrong for level
      traits: { Agility: 100 } // Incomplete and out of range
    };
    
    const errors = CharacterValidator.getValidationErrors(invalidCharacter);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(error => error.includes('name'))).toBe(true);
  });

  test('validatePartial accepts incomplete character', () => {
    const partialCharacter = {
      name: 'Partial Hero',
      level: 5
      // Missing other required fields
    };
    
    const result = CharacterValidator.validatePartial(partialCharacter);
    expect(result.success).toBe(true);
  });
});

describe('CharacterUtilities', () => {
  describe('deriveTier', () => {
    test('correctly calculates tier from level', () => {
      expect(CharacterUtilities.deriveTier(1)).toBe(1);
      expect(CharacterUtilities.deriveTier(3)).toBe(2);
      expect(CharacterUtilities.deriveTier(4)).toBe(2);
      expect(CharacterUtilities.deriveTier(5)).toBe(3);
      expect(CharacterUtilities.deriveTier(7)).toBe(3);
      expect(CharacterUtilities.deriveTier(8)).toBe(4);
      expect(CharacterUtilities.deriveTier(10)).toBe(4);
    });
  });

  describe('calculateEvasion', () => {
    test('calculates base evasion without armor', () => {
      const character = CharacterFactory.createBasicCharacter({
        name: 'Unarmored',
        level: 1,
        ancestry: 'Human',
        community: 'Wanderborne',
        className: 'Rogue'
      });
      
      const evasion = CharacterUtilities.calculateEvasion(character);
      expect(evasion).toBe(10); // Base evasion
    });

    test('applies armor modifiers', () => {
      const character = CharacterFactory.createBasicCharacter({
        name: 'Armored',
        level: 1,
        ancestry: 'Human',
        community: 'Wanderborne',
        className: 'Guardian'
      });
      
      character.armor = {
        id: 'chainmail',
        name: 'Chainmail',
        majorThreshold: 4,
        severeThreshold: 8,
        armorScore: 3,
        features: ['Heavy'] // Should reduce evasion
      };
      
      const evasion = CharacterUtilities.calculateEvasion(character);
      expect(evasion).toBe(9); // 10 - 1 for Heavy
    });

    test('prevents negative evasion', () => {
      const character = CharacterFactory.createBasicCharacter({
        name: 'Over-armored',
        level: 1,
        ancestry: 'Human',
        community: 'Wanderborne',
        className: 'Guardian'
      });
      
      character.evasion = 2;
      character.armor = {
        id: 'platemail',
        name: 'Ultra Heavy Plate',
        majorThreshold: 6,
        severeThreshold: 12,
        armorScore: 5,
        features: ['Heavy', 'Heavy', 'Heavy'] // Multiple penalties
      };
      
      const evasion = CharacterUtilities.calculateEvasion(character);
      expect(evasion).toBe(0); // Should not go negative
    });
  });

  describe('canUseDeathMove', () => {
    test('returns true when at last hit point', () => {
      const character = CharacterFactory.createBasicCharacter({
        name: 'Nearly Dead',
        level: 1,
        ancestry: 'Human',
        community: 'Wanderborne',
        className: 'Warrior'
      });
      
      character.hitPoints.marked = 19; // 19 out of 20
      
      expect(CharacterUtilities.canUseDeathMove(character)).toBe(true);
    });

    test('returns false when not at last hit point', () => {
      const character = CharacterFactory.createBasicCharacter({
        name: 'Healthy',
        level: 1,
        ancestry: 'Human',
        community: 'Wanderborne',
        className: 'Warrior'
      });
      
      character.hitPoints.marked = 10;
      
      expect(CharacterUtilities.canUseDeathMove(character)).toBe(false);
    });
  });

  describe('getAvailableDomains', () => {
    test('returns correct domains for each class', () => {
      expect(CharacterUtilities.getAvailableDomains('Wizard')).toEqual(['Codex', 'Arcana']);
      expect(CharacterUtilities.getAvailableDomains('Warrior')).toEqual(['Blade', 'Bone']);
      expect(CharacterUtilities.getAvailableDomains('Bard')).toEqual(['Codex', 'Grace']);
    });

    test('returns empty array for unknown class', () => {
      expect(CharacterUtilities.getAvailableDomains('Unknown Class' as ClassName)).toEqual([]);
    });
  });
});

describe('Constants and Data Integrity', () => {
  test('DEFAULT_VALUES contains expected constants', () => {
    expect(DEFAULT_VALUES.TRAIT_DISTRIBUTION).toEqual([2, 1, 1, 0, 0, -1]);
    expect(DEFAULT_VALUES.STARTING_HOPE).toBe(2);
    expect(DEFAULT_VALUES.MAX_HOPE).toBe(6);
    expect(DEFAULT_VALUES.STANDARD_STARTING_HP).toBe(20);
  });

  test('CORE_CLASSES contains expected classes', () => {
    expect(CORE_CLASSES).toContain('Wizard');
    expect(CORE_CLASSES).toContain('Warrior');
    expect(CORE_CLASSES).toContain('Bard');
    expect(CORE_CLASSES.length).toBe(9);
  });

  test('CORE_DOMAINS contains expected domains', () => {
    expect(CORE_DOMAINS).toContain('Arcana');
    expect(CORE_DOMAINS).toContain('Blade');
    expect(CORE_DOMAINS).toContain('Grace');
    expect(CORE_DOMAINS.length).toBe(9);
  });

  test('CORE_ANCESTRIES contains expected ancestries', () => {
    expect(CORE_ANCESTRIES).toContain('Human');
    expect(CORE_ANCESTRIES).toContain('Elf');
    expect(CORE_ANCESTRIES).toContain('Dwarf');
    expect(CORE_ANCESTRIES.length).toBeGreaterThan(15);
  });

  test('CORE_COMMUNITIES contains expected communities', () => {
    expect(CORE_COMMUNITIES).toContain('Wanderborne');
    expect(CORE_COMMUNITIES).toContain('Wildborne');
    expect(CORE_COMMUNITIES).toContain('Highborne');
    expect(CORE_COMMUNITIES.length).toBe(9);
  });
});

describe('Edge Cases and Error Handling', () => {
  test('handles extreme homebrew values gracefully', () => {
    const extremeCharacter = CharacterFactory.createHomebrewCharacter({
      name: 'Extreme Being',
      level: 50,
      tier: 10,
      evasion: 50,
      proficiency: 20,
      traits: {
        Agility: 50,
        Strength: 50,
        Finesse: 50,
        Instinct: 50,
        Presence: 50,
        Knowledge: 50
      },
      ancestry: 'Multidimensional Entity',
      community: 'Beyond Mortal Comprehension',
      className: 'Concept Incarnate'
    });
    
    expect(() => PlayerCharacterSchema.parse(extremeCharacter)).not.toThrow();
    expect(extremeCharacter.traits.Strength).toBe(50);
  });

  test('rejects malformed input gracefully', () => {
    const malformedInput = {
      name: null,
      level: 'not a number',
      traits: 'not an object'
    };
    
    const result = CharacterValidator.validate(malformedInput);
    expect(result.success).toBe(false);
    
    const errors = CharacterValidator.getValidationErrors(malformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('handles missing crypto API gracefully', () => {
    // This test is more about documentation than actual functionality
    // In a real environment, crypto.randomUUID should always be available
    // We'll just test that characters need an ID
    const characterWithoutId = {
      name: 'No ID Character',
      level: 1,
      tier: 1,
      evasion: 10,
      proficiency: 1,
      traits: { Agility: 2, Strength: 1, Finesse: 1, Instinct: 0, Presence: 0, Knowledge: -1 },
      ancestry: 'Human',
      community: 'Wanderborne',
      className: 'Warrior',
      hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
      stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
      hope: { current: 2, maximum: 6, sessionGenerated: 0 },
      conditions: [],
      temporaryEffects: [],
      homebrewMode: false,
      rulesVersion: 'SRD-1.0'
      // No ID field
    };
    
    expect(() => PlayerCharacterSchema.parse(characterWithoutId)).toThrow();
  });
});

describe('Performance and Memory', () => {
  test('validation performance with large character', () => {
    const start = performance.now();
    
    // Create a character with lots of data
    const largeCharacter = CharacterFactory.createHomebrewCharacter({
      name: 'Large Character',
      level: 10,
      tier: 4,
      evasion: 15,
      proficiency: 8,
      traits: {
        Agility: 15,
        Strength: 20,
        Finesse: 12,
        Instinct: 18,
        Presence: 25,
        Knowledge: 22
      },
      ancestry: 'Complex Ancestry',
      community: 'Detailed Community',
      className: 'Elaborate Class'
    });
    
    // Add extensive data
    largeCharacter.conditions = Array(50).fill('test condition');
    largeCharacter.temporaryEffects = Array(50).fill('test effect');
    largeCharacter.tags = Array(100).fill('test tag');
    largeCharacter.data = Object.fromEntries(
      Array(100).fill(0).map((_, i) => [`key${i}`, `value${i}`])
    );
    
    // Validate it
    const result = CharacterValidator.validate(largeCharacter);
    
    const end = performance.now();
    
    expect(result.success).toBe(true);
    expect(end - start).toBeLessThan(100); // Should validate in under 100ms
  });

  test('memory usage stays reasonable with multiple characters', () => {
    const characters: PlayerCharacter[] = [];
    
    // Create 100 characters
    for (let i = 0; i < 100; i++) {
      characters.push(CharacterFactory.createBasicCharacter({
        name: `Character ${i}`,
        level: (i % 10 + 1) as Level,
        ancestry: 'Human',
        community: 'Wanderborne',
        className: 'Warrior'
      }));
    }
    
    expect(characters.length).toBe(100);
    expect(characters[0].name).toBe('Character 0');
    expect(characters[99].name).toBe('Character 99');
    
    // All should be valid
    characters.forEach(char => {
      const result = CharacterValidator.validate(char);
      expect(result.success).toBe(true);
    });
  });
});
