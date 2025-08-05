/**
 * Cleaned up test suite for Daggerheart Character System
 */
import { describe, expect, test } from 'vitest';

import { calculateEvasion, canUseDeathMove } from '../characterUtils';
import type { PlayerCharacter } from '../daggerheartCharacter';
import {
  ArmorSchema,
  HitPointsSchema,
  PlayerCharacterSchema,
  SRDPlayerCharacterSchema,
  SRDTraitsSchema,
  TraitsSchema,
  WeaponSchema,
} from '../daggerheartCharacter';
import {
  createBasicCharacter,
  createDefaultTraits,
  createSRDTraits,
  deriveTier,
  getValidationErrors,
  validateCharacter,
} from '../schemas/validation';

describe('Core Schema Validation', () => {
  test('TraitsSchema accepts valid trait values', () => {
    const validTraits = {
      Agility: 5,
      Strength: -2,
      Finesse: 0,
      Instinct: 12,
      Presence: 30,
      Knowledge: -5,
    };
    expect(() => TraitsSchema.parse(validTraits)).not.toThrow();
  });

  test('SRDTraitsSchema enforces standard array', () => {
    const srdTraits = {
      Agility: 2,
      Strength: 1,
      Finesse: 1,
      Instinct: 0,
      Presence: 0,
      Knowledge: -1,
    };
    expect(() => SRDTraitsSchema.parse(srdTraits)).not.toThrow();

    const invalidTraits = {
      Agility: 3,
      Strength: 2,
      Finesse: 1,
      Instinct: 0,
      Presence: 0,
      Knowledge: -1,
    };
    expect(() => SRDTraitsSchema.parse(invalidTraits)).toThrow();
  });

  test('WeaponSchema validates correctly', () => {
    const weapon = {
      id: 'sword-001',
      name: 'Iron Sword',
      trait: 'Strength',
      range: 'Melee',
      damageDie: 'd8',
      damageType: 'phy',
      burden: 'One-Handed',
      features: ['Sharp'],
    };
    expect(() => WeaponSchema.parse(weapon)).not.toThrow();
  });

  test('ArmorSchema validates correctly', () => {
    const armor = {
      id: 'leather-001',
      name: 'Leather Armor',
      majorThreshold: 12,
      severeThreshold: 16,
      armorScore: 1,
      features: ['Flexible'],
    };
    expect(() => ArmorSchema.parse(armor)).not.toThrow();
  });

  test('HitPointsSchema prevents overmarking', () => {
    const invalidHP = { maxSlots: 20, marked: 25, temporaryBonus: 0 };
    expect(() => HitPointsSchema.parse(invalidHP)).toThrow();
  });
});

describe('Character Creation', () => {
  test('createDefaultTraits works', () => {
    const traits = createDefaultTraits();
    expect(traits.Agility).toBe(0);
    expect(Object.keys(traits)).toHaveLength(6);
  });

  test('createSRDTraits creates valid distribution', () => {
    const traits = createSRDTraits([2, 1, 1, 0, 0, -1]);
    expect(() => SRDTraitsSchema.parse(traits)).not.toThrow();
  });

  test('createBasicCharacter works', () => {
    const character = createBasicCharacter({
      name: 'Test Hero',
      level: 1,
      ancestry: 'Human',
      community: 'Wanderborne',
      className: 'Warrior',
    });
    expect(character.name).toBe('Test Hero');
    expect(character.tier).toBe(1);
  });
});

describe('Validation Functions', () => {
  test('validateCharacter works', () => {
    const character = createBasicCharacter({
      name: 'Test',
      level: 1,
      ancestry: 'Human',
      community: 'Wanderborne',
      className: 'Warrior',
    });
    const result = validateCharacter(character);
    expect(result.success).toBe(true);
  });

  test('getValidationErrors returns errors', () => {
    const invalid = { name: '' };
    const errors = getValidationErrors(invalid);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('Utility Functions', () => {
  test('deriveTier calculates correctly', () => {
    expect(deriveTier(1)).toBe(1);
    expect(deriveTier(3)).toBe(2);
    expect(deriveTier(5)).toBe(3);
    expect(deriveTier(8)).toBe(4);
  });

  test('calculateEvasion handles armor modifiers', () => {
    const character: PlayerCharacter = {
      id: 'test',
      name: 'Test',
      level: 1,
      tier: 1,
      evasion: 10,
      proficiency: 1,
      traits: createDefaultTraits(),
      ancestry: 'Human',
      community: 'Wanderborne',
      className: 'Warrior',
      hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
      stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
      hope: { current: 2, maximum: 6, sessionGenerated: 0 },
      conditions: [],
      temporaryEffects: [],
      homebrewMode: false,
      rulesVersion: 'SRD-1.0',
    };

    expect(calculateEvasion(character)).toBe(10);

    character.armor = {
      id: 'flexible-armor',
      name: 'Flexible Armor',
      majorThreshold: 12,
      severeThreshold: 16,
      armorScore: 1,
      features: ['Flexible'],
    };
    expect(calculateEvasion(character)).toBe(11);
  });

  test('canUseDeathMove detects last hit point', () => {
    const character: PlayerCharacter = {
      id: 'test',
      name: 'Test',
      level: 1,
      tier: 1,
      evasion: 10,
      proficiency: 1,
      traits: createDefaultTraits(),
      ancestry: 'Human',
      community: 'Wanderborne',
      className: 'Warrior',
      hitPoints: { maxSlots: 20, marked: 19, temporaryBonus: 0 },
      stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
      hope: { current: 2, maximum: 6, sessionGenerated: 0 },
      conditions: [],
      temporaryEffects: [],
      homebrewMode: false,
      rulesVersion: 'SRD-1.0',
    };

    expect(canUseDeathMove(character)).toBe(true);

    character.hitPoints.marked = 18;
    expect(canUseDeathMove(character)).toBe(false);
  });
});

describe('Character Schema Edge Cases', () => {
  test('prevents two-handed weapon with secondary', () => {
    const invalidCharacter = {
      id: 'test',
      name: 'Test',
      level: 1,
      tier: 1,
      evasion: 10,
      proficiency: 1,
      traits: createDefaultTraits(),
      ancestry: 'Human',
      community: 'Wanderborne',
      className: 'Warrior',
      hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
      stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
      hope: { current: 2, maximum: 6, sessionGenerated: 0 },
      conditions: [],
      temporaryEffects: [],
      homebrewMode: false,
      rulesVersion: 'SRD-1.0',
      primaryWeapon: {
        id: 'greatsword',
        name: 'Greatsword',
        trait: 'Strength',
        range: 'Melee',
        damageDie: 'd12',
        damageType: 'phy',
        burden: 'Two-Handed',
        features: [],
      },
      secondaryWeapon: {
        id: 'dagger',
        name: 'Dagger',
        trait: 'Finesse',
        range: 'Melee',
        damageDie: 'd6',
        damageType: 'phy',
        burden: 'One-Handed',
        features: [],
      },
    };

    expect(() => PlayerCharacterSchema.parse(invalidCharacter)).toThrow();
  });

  test('SRD schema enforces tier/level relationship', () => {
    const invalidCharacter = createBasicCharacter({
      name: 'Test',
      level: 5,
      ancestry: 'Human',
      community: 'Wanderborne',
      className: 'Warrior',
    });
    invalidCharacter.tier = 2; // Should be 3 for level 5

    expect(() => SRDPlayerCharacterSchema.parse(invalidCharacter)).toThrow();
  });
});
