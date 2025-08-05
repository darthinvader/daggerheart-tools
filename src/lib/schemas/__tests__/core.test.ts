/**
 * Tests for Core Schemas and Types
 */
import { describe, expect, test } from 'vitest';

import {
  AncestryNameSchema,
  ClassNameSchema,
  CommunityNameSchema,
  DamageTypeSchema,
  DomainNameSchema,
  LevelSchema,
  RangeBandSchema,
  SRDTraitsSchema,
  TierSchema,
  TraitNameSchema,
  TraitValueSchema,
  TraitsSchema,
} from '../core';

describe('Core Type Schemas', () => {
  describe('RangeBandSchema', () => {
    test('accepts valid range bands', () => {
      const validRanges = [
        'Melee',
        'Very Close',
        'Close',
        'Far',
        'Very Far',
        'Out of Range',
      ];

      validRanges.forEach(range => {
        expect(() => RangeBandSchema.parse(range)).not.toThrow();
      });
    });

    test('rejects invalid range bands', () => {
      const invalid = ['Invalid', 'Medium', '', null];

      invalid.forEach(range => {
        expect(() => RangeBandSchema.parse(range)).toThrow();
      });
    });
  });

  describe('DamageTypeSchema', () => {
    test('accepts physical and magical damage types', () => {
      expect(() => DamageTypeSchema.parse('phy')).not.toThrow();
      expect(() => DamageTypeSchema.parse('mag')).not.toThrow();
    });

    test('rejects invalid damage types', () => {
      ['physical', 'magical', 'fire', 'cold', ''].forEach(type => {
        expect(() => DamageTypeSchema.parse(type)).toThrow();
      });
    });
  });

  describe('TierSchema', () => {
    test('accepts valid tiers 1-4', () => {
      [1, 2, 3, 4].forEach(tier => {
        expect(() => TierSchema.parse(tier)).not.toThrow();
      });
    });

    test('rejects invalid tiers', () => {
      [0, 5, 10, '1', null].forEach(tier => {
        expect(() => TierSchema.parse(tier)).toThrow();
      });
    });
  });

  describe('LevelSchema', () => {
    test('accepts valid levels 1-10', () => {
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(level => {
        expect(() => LevelSchema.parse(level)).not.toThrow();
      });
    });

    test('rejects invalid levels', () => {
      [0, 11, 15, '5', null].forEach(level => {
        expect(() => LevelSchema.parse(level)).toThrow();
      });
    });
  });

  describe('TraitNameSchema', () => {
    test('accepts all six trait names', () => {
      const traits = [
        'Agility',
        'Strength',
        'Finesse',
        'Instinct',
        'Presence',
        'Knowledge',
      ];

      traits.forEach(trait => {
        expect(() => TraitNameSchema.parse(trait)).not.toThrow();
      });
    });

    test('rejects invalid trait names', () => {
      ['Dexterity', 'Constitution', 'Intelligence', ''].forEach(trait => {
        expect(() => TraitNameSchema.parse(trait)).toThrow();
      });
    });
  });

  describe('TraitValueSchema', () => {
    test('accepts valid trait values', () => {
      [-10, -5, 0, 5, 10, 20, 50].forEach(value => {
        expect(() => TraitValueSchema.parse(value)).not.toThrow();
      });
    });

    test('rejects invalid trait values', () => {
      [-11, 51, 100, '5', null, 2.5].forEach(value => {
        expect(() => TraitValueSchema.parse(value)).toThrow();
      });
    });
  });
});

describe('Character Identity Schemas', () => {
  describe('ClassNameSchema', () => {
    test('accepts core class names', () => {
      const coreClasses = [
        'Bard',
        'Druid',
        'Guardian',
        'Ranger',
        'Rogue',
        'Seraph',
        'Sorcerer',
        'Warrior',
        'Wizard',
      ];

      coreClasses.forEach(className => {
        expect(() => ClassNameSchema.parse(className)).not.toThrow();
      });
    });

    test('accepts custom class names', () => {
      const customClasses = ['Custom Class', 'Homebrew Warrior', 'My Class'];

      customClasses.forEach(className => {
        expect(() => ClassNameSchema.parse(className)).not.toThrow();
      });
    });

    test('rejects empty class names', () => {
      ['', null, undefined].forEach(className => {
        expect(() => ClassNameSchema.parse(className)).toThrow();
      });
    });
  });

  describe('AncestryNameSchema', () => {
    test('accepts core ancestry names', () => {
      const coreAncestries = [
        'Human',
        'Elf',
        'Dwarf',
        'Halfling',
        'Orc',
        'Goblin',
        'Mixed',
      ];

      coreAncestries.forEach(ancestry => {
        expect(() => AncestryNameSchema.parse(ancestry)).not.toThrow();
      });
    });

    test('accepts custom ancestry names', () => {
      expect(() => AncestryNameSchema.parse('Custom Ancestry')).not.toThrow();
    });
  });

  describe('DomainNameSchema', () => {
    test('accepts core domain names', () => {
      const coreDomains = [
        'Arcana',
        'Blade',
        'Bone',
        'Codex',
        'Grace',
        'Midnight',
        'Sage',
        'Splendor',
        'Valor',
      ];

      coreDomains.forEach(domain => {
        expect(() => DomainNameSchema.parse(domain)).not.toThrow();
      });
    });

    test('accepts custom domain names', () => {
      expect(() => DomainNameSchema.parse('Custom Domain')).not.toThrow();
    });
  });

  describe('CommunityNameSchema', () => {
    test('accepts core community names', () => {
      const coreCommunities = [
        'Highborne',
        'Loreborne',
        'Wildborne',
        'Wanderborne',
      ];

      coreCommunities.forEach(community => {
        expect(() => CommunityNameSchema.parse(community)).not.toThrow();
      });
    });

    test('accepts custom community names', () => {
      expect(() => CommunityNameSchema.parse('Custom Community')).not.toThrow();
    });
  });
});

describe('Trait System Schemas', () => {
  describe('TraitsSchema', () => {
    test('accepts valid trait object', () => {
      const validTraits = {
        Agility: 2,
        Strength: 1,
        Finesse: 1,
        Instinct: 0,
        Presence: 0,
        Knowledge: -1,
      };

      expect(() => TraitsSchema.parse(validTraits)).not.toThrow();
    });

    test('requires all six traits', () => {
      const incompleteTraits = {
        Agility: 2,
        Strength: 1,
        Finesse: 1,
        Instinct: 0,
        Presence: 0,
        // Missing Knowledge
      };

      expect(() => TraitsSchema.parse(incompleteTraits)).toThrow();
    });
  });

  describe('SRDTraitsSchema', () => {
    test('accepts standard array distribution', () => {
      const srdTraits = {
        Agility: 2,
        Strength: 1,
        Finesse: 1,
        Instinct: 0,
        Presence: 0,
        Knowledge: -1,
      };

      expect(() => SRDTraitsSchema.parse(srdTraits)).not.toThrow();
    });

    test('rejects non-standard distributions', () => {
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

    test('accepts different arrangements of standard array', () => {
      const rearrangedTraits = {
        Agility: -1,
        Strength: 2,
        Finesse: 0,
        Instinct: 1,
        Presence: 1,
        Knowledge: 0,
      };

      expect(() => SRDTraitsSchema.parse(rearrangedTraits)).not.toThrow();
    });
  });
});
