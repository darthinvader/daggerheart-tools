/**
 * Tests for Schema Index Exports
 * Ensures all schemas and types are properly exported
 */
import { describe, expect, test } from 'vitest';

// Test that all exports are available
import {
  AncestryNameSchema,
  ArmorSchema,
  ClassNameSchema,
  CommunityNameSchema,
  ConsumableSchema,
  DamageTypeSchema,
  DomainNameSchema,
  // Character schemas
  HitPointsSchema,
  HopeStateSchema,
  InventoryItemSchema,
  LevelSchema,
  PlayerCharacterSchema,
  // Core schemas
  RangeBandSchema,
  SRDPlayerCharacterSchema,
  SRDTraitsSchema,
  StressTrackSchema,
  TierSchema,
  TraitNameSchema,
  TraitValueSchema,
  TraitsSchema,
  // Equipment schemas
  WeaponSchema,
  createBasicCharacter,
  createDefaultTraits,
  createSRDTraits,
  deriveTier,
  getValidationErrors,
  // Validation utilities
  validateCharacter,
  validateSRDCharacter,
} from '../index';

describe('Schema Index Exports', () => {
  test('exports all core schemas', () => {
    expect(RangeBandSchema).toBeDefined();
    expect(DamageTypeSchema).toBeDefined();
    expect(TierSchema).toBeDefined();
    expect(LevelSchema).toBeDefined();
    expect(TraitNameSchema).toBeDefined();
    expect(TraitValueSchema).toBeDefined();
    expect(TraitsSchema).toBeDefined();
    expect(SRDTraitsSchema).toBeDefined();
    expect(ClassNameSchema).toBeDefined();
    expect(DomainNameSchema).toBeDefined();
    expect(AncestryNameSchema).toBeDefined();
    expect(CommunityNameSchema).toBeDefined();
  });

  test('exports all equipment schemas', () => {
    expect(WeaponSchema).toBeDefined();
    expect(ArmorSchema).toBeDefined();
    expect(ConsumableSchema).toBeDefined();
    expect(InventoryItemSchema).toBeDefined();
  });

  test('exports all character schemas', () => {
    expect(HitPointsSchema).toBeDefined();
    expect(StressTrackSchema).toBeDefined();
    expect(HopeStateSchema).toBeDefined();
    expect(PlayerCharacterSchema).toBeDefined();
    expect(SRDPlayerCharacterSchema).toBeDefined();
  });

  test('exports all validation utilities', () => {
    expect(validateCharacter).toBeDefined();
    expect(validateSRDCharacter).toBeDefined();
    expect(getValidationErrors).toBeDefined();
    expect(createDefaultTraits).toBeDefined();
    expect(createSRDTraits).toBeDefined();
    expect(createBasicCharacter).toBeDefined();
    expect(deriveTier).toBeDefined();
  });

  test('schemas are callable', () => {
    // Test that schemas can be used for parsing
    expect(() => RangeBandSchema.parse('Melee')).not.toThrow();
    expect(() => DamageTypeSchema.parse('phy')).not.toThrow();
    expect(() => TierSchema.parse(1)).not.toThrow();
    expect(() => LevelSchema.parse(5)).not.toThrow();
  });

  test('utility functions are callable', () => {
    // Test that utility functions work
    expect(() => createDefaultTraits()).not.toThrow();
    expect(() => deriveTier(3)).not.toThrow();

    const traits = createDefaultTraits();
    expect(traits).toHaveProperty('Agility');

    const tier = deriveTier(5);
    expect(tier).toBe(3);
  });

  test('character creation works with exported functions', () => {
    const srdTraits = createSRDTraits([2, 1, 1, 0, 0, -1]);

    const character = createBasicCharacter({
      name: 'Export Test Character',
      level: 2,
      ancestry: 'Human',
      community: 'Wildborne',
      className: 'Warrior',
      traits: srdTraits,
    });

    const validation = validateCharacter(character);
    expect(validation.success).toBe(true);
  });
});
