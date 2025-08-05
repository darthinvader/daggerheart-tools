/**
 * Tests for Equipment Schemas
 */
import { describe, expect, test } from 'vitest';

import {
  type Armor,
  ArmorSchema,
  type Consumable,
  ConsumableSchema,
  type InventoryItem,
  InventoryItemSchema,
  type Weapon,
  WeaponSchema,
} from '../equipment';

describe('Equipment Schemas', () => {
  describe('WeaponSchema', () => {
    test('validates complete weapon object', () => {
      const validWeapon: Weapon = {
        id: 'sword-1',
        name: 'Longsword',
        trait: 'Strength',
        range: 'Melee',
        damageDie: 'd8',
        damageType: 'phy',
        burden: 'One-Handed',
        features: ['Reliable', 'Parry'],
      };

      expect(() => WeaponSchema.parse(validWeapon)).not.toThrow();
    });

    test('accepts spellcast trait', () => {
      const spellWeapon = {
        id: 'staff-1',
        name: 'Magic Staff',
        trait: 'Spellcast',
        range: 'Close',
        damageDie: 'd6',
        damageType: 'mag',
        burden: 'Two-Handed',
        features: ['Channeling'],
      };

      expect(() => WeaponSchema.parse(spellWeapon)).not.toThrow();
    });

    test('validates damage die format', () => {
      const validDice = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

      validDice.forEach(die => {
        const weapon = {
          id: 'test',
          name: 'Test Weapon',
          trait: 'Strength',
          range: 'Melee',
          damageDie: die,
          damageType: 'phy',
          burden: 'One-Handed',
          features: [],
        };

        expect(() => WeaponSchema.parse(weapon)).not.toThrow();
      });
    });

    test('rejects invalid damage die format', () => {
      const invalidDice = ['8', '1d8', 'D8', 'd', 'dice'];

      invalidDice.forEach(die => {
        const weapon = {
          id: 'test',
          name: 'Test Weapon',
          trait: 'Strength',
          range: 'Melee',
          damageDie: die,
          damageType: 'phy',
          burden: 'One-Handed',
          features: [],
        };

        expect(() => WeaponSchema.parse(weapon)).toThrow();
      });
    });

    test('requires non-empty id and name', () => {
      const baseWeapon = {
        trait: 'Strength',
        range: 'Melee',
        damageDie: 'd8',
        damageType: 'phy',
        burden: 'One-Handed',
        features: [],
      };

      expect(() =>
        WeaponSchema.parse({ ...baseWeapon, id: '', name: 'Test' })
      ).toThrow();
      expect(() =>
        WeaponSchema.parse({ ...baseWeapon, id: 'test', name: '' })
      ).toThrow();
    });
  });

  describe('ArmorSchema', () => {
    test('validates complete armor object', () => {
      const validArmor: Armor = {
        id: 'leather-1',
        name: 'Leather Armor',
        majorThreshold: 13,
        severeThreshold: 18,
        armorScore: 1,
        features: ['Light', 'Flexible'],
      };

      expect(() => ArmorSchema.parse(validArmor)).not.toThrow();
    });

    test('accepts zero values for thresholds and armor score', () => {
      const noArmor = {
        id: 'clothes',
        name: 'Street Clothes',
        majorThreshold: 0,
        severeThreshold: 0,
        armorScore: 0,
        features: [],
      };

      expect(() => ArmorSchema.parse(noArmor)).not.toThrow();
    });

    test('rejects negative values', () => {
      const invalidArmor = {
        id: 'test',
        name: 'Test Armor',
        majorThreshold: -1,
        severeThreshold: 15,
        armorScore: 1,
        features: [],
      };

      expect(() => ArmorSchema.parse(invalidArmor)).toThrow();
    });

    test('requires integer values', () => {
      const invalidArmor = {
        id: 'test',
        name: 'Test Armor',
        majorThreshold: 12.5,
        severeThreshold: 15,
        armorScore: 1,
        features: [],
      };

      expect(() => ArmorSchema.parse(invalidArmor)).toThrow();
    });
  });

  describe('ConsumableSchema', () => {
    test('validates complete consumable object', () => {
      const validConsumable: Consumable = {
        id: 'potion-1',
        name: 'Health Potion',
        type: 'Health Potion',
        effect: 'Heal 2d4+2 hit points',
        quantity: 3,
        tags: ['magical', 'healing'],
      };

      expect(() => ConsumableSchema.parse(validConsumable)).not.toThrow();
    });

    test('accepts all consumable types', () => {
      const types = [
        'Health Potion',
        'Stamina Potion',
        'Antidote',
        'Scroll',
        'Bomb',
        'Food',
        'Other',
      ];

      types.forEach(type => {
        const consumable = {
          id: 'test',
          name: `Test ${type}`,
          type,
          effect: 'Test effect',
          quantity: 1,
        };

        expect(() => ConsumableSchema.parse(consumable)).not.toThrow();
      });
    });

    test('makes tags optional', () => {
      const consumableWithoutTags = {
        id: 'potion-1',
        name: 'Simple Potion',
        type: 'Health Potion',
        effect: 'Basic healing',
        quantity: 1,
      };

      expect(() => ConsumableSchema.parse(consumableWithoutTags)).not.toThrow();
    });

    test('requires positive quantity', () => {
      const invalidConsumable = {
        id: 'test',
        name: 'Test Item',
        type: 'Other',
        effect: 'Test effect',
        quantity: -1,
      };

      expect(() => ConsumableSchema.parse(invalidConsumable)).toThrow();
    });
  });

  describe('InventoryItemSchema', () => {
    test('validates complete inventory item', () => {
      const validItem: InventoryItem = {
        id: 'rope-1',
        name: '50ft Hemp Rope',
        quantity: 1,
        description: 'Strong rope suitable for climbing',
        tags: ['tool', 'utility'],
        data: { weight: 10, material: 'hemp' },
      };

      expect(() => InventoryItemSchema.parse(validItem)).not.toThrow();
    });

    test('makes optional fields truly optional', () => {
      const minimalItem = {
        id: 'item-1',
        name: 'Basic Item',
      };

      expect(() => InventoryItemSchema.parse(minimalItem)).not.toThrow();
    });

    test('accepts custom data object', () => {
      const itemWithData = {
        id: 'special-item',
        name: 'Magic Crystal',
        data: {
          magicLevel: 5,
          attunement: true,
          charges: 10,
          properties: ['glowing', 'warm'],
        },
      };

      expect(() => InventoryItemSchema.parse(itemWithData)).not.toThrow();
    });

    test('requires non-empty id and name', () => {
      expect(() =>
        InventoryItemSchema.parse({ id: '', name: 'Test' })
      ).toThrow();
      expect(() =>
        InventoryItemSchema.parse({ id: 'test', name: '' })
      ).toThrow();
    });
  });
});
