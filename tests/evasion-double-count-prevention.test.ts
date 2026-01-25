/* eslint-disable max-lines-per-function -- Test file with comprehensive test suite */
/**
 * Evasion Double-Count Prevention Tests
 *
 * These tests verify that armor evasion modifiers are NOT double-counted
 * when calculating character stats. The fix ensures:
 *
 * 1. Armor base stats (evasionModifier, agilityModifier) are handled by getArmorStats()
 * 2. Equipment feature aggregator does NOT include armor base stats
 * 3. Final evasion = classEvasion + armorStats.evasionMod + equipmentFeatureModifiers.evasion
 *    where equipmentFeatureModifiers.evasion excludes armor base stats
 */

import { describe, expect, it } from 'vitest';

import {
  aggregateEquipmentStats,
  normalizeEquipment,
} from '@/lib/equipment-feature-parser';

describe('Evasion Double-Count Prevention', () => {
  describe('normalizeEquipment for armor', () => {
    it('returns empty evasion for armor with legacy fields', () => {
      const armor = {
        name: 'Chainmail',
        evasionModifier: -1,
        agilityModifier: 0,
      };

      const mods = normalizeEquipment(armor);

      // Armor base stats should NOT be included in normalized modifiers
      expect(mods.evasion).toBe(0);
      expect(mods.traits.Agility).toBe(0);
      expect(mods.source).toBe('legacy-armor');
    });

    it('returns empty modifiers for heavy armor with large penalties', () => {
      const heavyArmor = {
        name: 'Full Plate',
        evasionModifier: -3,
        agilityModifier: -2,
        features: [
          { name: 'Very Heavy', description: '−3 to Evasion; −2 to Agility' },
        ],
      };

      const mods = normalizeEquipment(heavyArmor);

      // Even with feature text duplicating the values, we return 0
      expect(mods.evasion).toBe(0);
      expect(mods.traits.Agility).toBe(0);
    });

    it('still uses explicit statModifiers for homebrew armor', () => {
      const homebrewArmor = {
        name: 'Enchanted Plate',
        evasionModifier: -2, // Legacy field
        agilityModifier: -1, // Legacy field
        statModifiers: {
          // Explicit modifiers override legacy fields
          evasion: 1,
          proficiency: 2,
        },
      };

      const mods = normalizeEquipment(homebrewArmor);

      // Explicit statModifiers take priority over legacy fields
      expect(mods.evasion).toBe(1);
      expect(mods.proficiency).toBe(2);
      expect(mods.source).toBe('explicit');
    });
  });

  describe('normalizeEquipment for weapons', () => {
    it('parses weapon features correctly', () => {
      const weapon = {
        name: 'Heavy Greatsword',
        features: [{ name: 'Cumbersome', description: '−1 to Evasion' }],
      };

      const mods = normalizeEquipment(weapon);

      // Weapons don't have legacy fields, so features are parsed
      expect(mods.evasion).toBe(-1);
      expect(mods.source).toBe('parsed');
    });

    it('parses shield features correctly', () => {
      const shield = {
        name: 'Tower Shield',
        features: [
          { name: 'Barrier', description: '+2 to Armor Score; −1 to Evasion' },
        ],
      };

      const mods = normalizeEquipment(shield);

      expect(mods.evasion).toBe(-1);
      expect(mods.armorScore).toBe(2);
      expect(mods.source).toBe('parsed');
    });
  });

  describe('aggregateEquipmentStats', () => {
    it('excludes armor base stats from aggregation', () => {
      const armor = {
        name: 'Plate Armor',
        evasionModifier: -2,
        agilityModifier: -1,
      };

      const result = aggregateEquipmentStats(armor);

      // Armor base stats should be 0 in aggregated result
      expect(result.evasion).toBe(0);
      expect(result.traits.Agility).toBe(0);
    });

    it('includes weapon evasion modifiers correctly', () => {
      const weapon = {
        name: 'Heavy Axe',
        features: [{ name: 'Heavy', description: '−1 to Evasion' }],
      };

      const result = aggregateEquipmentStats(null, weapon);

      expect(result.evasion).toBe(-1);
    });

    it('combines armor (excluded) with weapon (included) correctly', () => {
      const armor = {
        name: 'Plate Armor',
        evasionModifier: -2, // Should be excluded
        agilityModifier: -1, // Should be excluded
      };
      const weapon = {
        name: 'Warhammer',
        features: [{ name: 'Heavy', description: '−1 to Evasion' }],
      };

      const result = aggregateEquipmentStats(armor, weapon);

      // Only weapon evasion should be included, not armor
      expect(result.evasion).toBe(-1);
      expect(result.traits.Agility).toBe(0);
    });

    it('aggregates multiple weapons correctly', () => {
      const primaryWeapon = {
        name: 'Greatsword',
        features: [{ name: 'Heavy', description: '−1 to Evasion' }],
      };
      const secondaryWeapon = {
        name: 'Tower Shield',
        features: [
          { name: 'Barrier', description: '+2 to Armor Score; −1 to Evasion' },
        ],
      };

      const result = aggregateEquipmentStats(
        null,
        primaryWeapon,
        secondaryWeapon
      );

      expect(result.evasion).toBe(-2); // -1 from each
      expect(result.armorScore).toBe(2);
    });

    it('handles full equipment loadout correctly', () => {
      const armor = {
        name: 'Full Plate',
        evasionModifier: -3, // Excluded
        agilityModifier: -2, // Excluded
      };
      const primaryWeapon = {
        name: 'Longbow',
        features: [], // No modifiers
      };
      const secondaryWeapon = {
        name: 'Buckler',
        features: [{ name: 'Block', description: '+1 to Armor Score' }],
      };
      const wheelchair = {
        name: 'Combat Wheelchair',
        features: [{ name: 'Swift', description: '+1 to Agility' }],
      };

      const result = aggregateEquipmentStats(
        armor,
        primaryWeapon,
        secondaryWeapon,
        wheelchair
      );

      // Armor excluded, only weapon/shield/wheelchair features included
      expect(result.evasion).toBe(0);
      expect(result.armorScore).toBe(1);
      expect(result.traits.Agility).toBe(1);
    });
  });

  describe('Real-world scenarios', () => {
    it('Scenario: Rogue with light armor and daggers', () => {
      const lightArmor = {
        name: 'Leather Armor',
        evasionModifier: 0,
        agilityModifier: 0,
      };
      const dagger = {
        name: 'Dagger',
        features: [{ name: 'Quick', description: '+1 to attack rolls' }],
      };

      const result = aggregateEquipmentStats(lightArmor, dagger);

      expect(result.evasion).toBe(0);
      expect(result.attackRolls).toBe(1);
    });

    it('Scenario: Warrior with heavy armor and greatsword', () => {
      const heavyArmor = {
        name: 'Full Plate Armor',
        evasionModifier: -2,
        agilityModifier: -1,
        baseScore: 5,
        baseThresholds: { major: 8, severe: 14 },
      };
      const greatsword = {
        name: 'Greatsword',
        features: [{ name: 'Two-Handed', description: '−1 to Evasion' }],
      };

      const result = aggregateEquipmentStats(heavyArmor, greatsword);

      // Armor's -2 evasion excluded, only greatsword's -1 included
      expect(result.evasion).toBe(-1);
      // Armor's -1 agility excluded
      expect(result.traits.Agility).toBe(0);
    });

    it('Scenario: Tank with shield and armor', () => {
      const plateArmor = {
        name: 'Plate Armor',
        evasionModifier: -2,
        agilityModifier: -1,
      };
      const towerShield = {
        name: 'Tower Shield',
        features: [
          { name: 'Barrier', description: '+3 to Armor Score; −2 to Evasion' },
        ],
      };

      const result = aggregateEquipmentStats(plateArmor, null, towerShield);

      // Only tower shield evasion penalty should be counted
      expect(result.evasion).toBe(-2);
      expect(result.armorScore).toBe(3);
    });

    it('Scenario: Calculating final evasion (simulating overview-grids logic)', () => {
      // This simulates how overview-grids.parts.tsx calculates autoEvasion
      const classEvasion = 10; // Base class evasion

      const armor = {
        name: 'Chainmail',
        evasionModifier: -1, // Armor penalty
        agilityModifier: 0,
      };
      const armorEvasionMod = armor.evasionModifier; // -1, from getArmorStats()

      const weapon = {
        name: 'Heavy Mace',
        features: [{ name: 'Cumbersome', description: '−1 to Evasion' }],
      };

      const equipmentModifiers = aggregateEquipmentStats(armor, weapon);

      // Final evasion calculation as done in overview-grids.parts.tsx:
      // classEvasion + armorStats.evasionMod + equipmentFeatureModifiers.evasion
      const finalEvasion =
        classEvasion + armorEvasionMod + equipmentModifiers.evasion;

      // Expected: 10 (class) + (-1) (armor) + (-1) (weapon) = 8
      expect(finalEvasion).toBe(8);

      // If armor was double-counted, it would be:
      // 10 + (-1) + (-1 armor + -1 weapon) = 7 - WRONG!
      // Our fix ensures armor is NOT in equipmentModifiers.evasion
      expect(equipmentModifiers.evasion).toBe(-1); // Only weapon, not armor
    });

    it('Scenario: Multiple equipment pieces with trait modifiers', () => {
      const armor = {
        name: 'Heavy Plate',
        evasionModifier: -2,
        agilityModifier: -1, // Excluded from aggregation
      };
      const weapon = {
        name: 'Magic Staff',
        features: [{ name: 'Arcane Focus', description: '+1 to Knowledge' }],
      };

      const equipmentModifiers = aggregateEquipmentStats(armor, weapon);

      // Armor agility penalty should be excluded
      expect(equipmentModifiers.traits.Agility).toBe(0);
      // Weapon trait bonus should be included
      expect(equipmentModifiers.traits.Knowledge).toBe(1);
    });
  });

  describe('Edge cases', () => {
    it('handles null/undefined equipment gracefully', () => {
      const result = aggregateEquipmentStats(null, undefined, null, undefined);

      expect(result.evasion).toBe(0);
      expect(result.proficiency).toBe(0);
      expect(result.armorScore).toBe(0);
    });

    it('handles armor with zero modifiers', () => {
      const armor = {
        name: 'Light Clothes',
        evasionModifier: 0,
        agilityModifier: 0,
      };

      const mods = normalizeEquipment(armor);

      expect(mods.evasion).toBe(0);
      expect(mods.source).toBe('legacy-armor');
    });

    it('handles weapon without features', () => {
      const weapon = {
        name: 'Simple Dagger',
        features: [],
      };

      const mods = normalizeEquipment(weapon);

      expect(mods.evasion).toBe(0);
      expect(mods.source).toBe('none');
    });

    it('handles equipment with only name', () => {
      const item = { name: 'Mystery Item' };

      const mods = normalizeEquipment(item);

      // No legacy fields, no statModifiers, no features = parsed but empty
      expect(mods.evasion).toBe(0);
      expect(mods.source).toBe('none');
    });
  });
});
