import { describe, expect, it } from 'vitest';

import {
  aggregateEquipmentStats,
  createEmptyAggregatedStats,
  getEquipmentStatsSummary,
  hasAnyModifiers,
  hasStatModifiers,
  normalizeEquipment,
  parseFeature,
  parseFeatureDescription,
  parseFeatures,
} from '@/lib/equipment-feature-parser';

describe('parseFeatureDescription', () => {
  describe('Evasion modifiers', () => {
    it('parses "+1 to Evasion"', () => {
      const result = parseFeatureDescription('+1 to Evasion');
      expect(result).toContainEqual({ stat: 'evasion', value: 1 });
    });

    it('parses "−1 to Evasion" (unicode minus)', () => {
      const result = parseFeatureDescription('−1 to Evasion');
      expect(result).toContainEqual({ stat: 'evasion', value: -1 });
    });

    it('parses "-1 to Evasion" (regular hyphen)', () => {
      const result = parseFeatureDescription('-1 to Evasion');
      expect(result).toContainEqual({ stat: 'evasion', value: -1 });
    });

    it('parses "−2 to Evasion"', () => {
      const result = parseFeatureDescription('−2 to Evasion');
      expect(result).toContainEqual({ stat: 'evasion', value: -2 });
    });
  });

  describe('Armor Score modifiers', () => {
    it('parses "+1 to Armor Score"', () => {
      const result = parseFeatureDescription('+1 to Armor Score');
      expect(result).toContainEqual({ stat: 'armorScore', value: 1 });
    });

    it('parses "+2 to Armor Score"', () => {
      const result = parseFeatureDescription('+2 to Armor Score');
      expect(result).toContainEqual({ stat: 'armorScore', value: 2 });
    });

    it('parses "+4 to Armor Score"', () => {
      const result = parseFeatureDescription('+4 to Armor Score');
      expect(result).toContainEqual({ stat: 'armorScore', value: 4 });
    });
  });

  describe('Trait modifiers', () => {
    it('parses "−1 to Finesse"', () => {
      const result = parseFeatureDescription('−1 to Finesse');
      expect(result).toContainEqual({ stat: 'Finesse', value: -1 });
    });

    it('parses "−1 to Agility"', () => {
      const result = parseFeatureDescription('−1 to Agility');
      expect(result).toContainEqual({ stat: 'Agility', value: -1 });
    });

    it('parses "+1 to Presence"', () => {
      const result = parseFeatureDescription('+1 to Presence');
      expect(result).toContainEqual({ stat: 'Presence', value: 1 });
    });

    it('parses "You gain a +1 bonus to your Agility."', () => {
      const result = parseFeatureDescription(
        'You gain a +1 bonus to your Agility.'
      );
      expect(result).toContainEqual({ stat: 'Agility', value: 1 });
    });

    it('parses "You gain a +1 bonus to your Strength."', () => {
      const result = parseFeatureDescription(
        'You gain a +1 bonus to your Strength.'
      );
      expect(result).toContainEqual({ stat: 'Strength', value: 1 });
    });
  });

  describe('Threshold modifiers', () => {
    it('parses "+3 to Severe damage threshold"', () => {
      const result = parseFeatureDescription('+3 to Severe damage threshold');
      expect(result).toContainEqual({ stat: 'severeThreshold', value: 3 });
    });

    it('parses "+2 to Major damage threshold"', () => {
      const result = parseFeatureDescription('+2 to Major damage threshold');
      expect(result).toContainEqual({ stat: 'majorThreshold', value: 2 });
    });
  });

  describe('Attack roll modifiers', () => {
    it('parses "+1 to attack rolls"', () => {
      const result = parseFeatureDescription('+1 to attack rolls');
      expect(result).toContainEqual({ stat: 'attackRolls', value: 1 });
    });
  });

  describe('Spellcast roll modifiers', () => {
    it('parses "+1 to Spellcast Rolls"', () => {
      const result = parseFeatureDescription('+1 to Spellcast Rolls');
      expect(result).toContainEqual({ stat: 'spellcastRolls', value: 1 });
    });
  });

  describe('Combined patterns', () => {
    it('parses "+2 to Armor Score; −1 to Evasion"', () => {
      const result = parseFeatureDescription(
        '+2 to Armor Score; −1 to Evasion'
      );
      expect(result).toContainEqual({ stat: 'armorScore', value: 2 });
      expect(result).toContainEqual({ stat: 'evasion', value: -1 });
    });

    it('parses "−2 to Evasion; −1 to Agility"', () => {
      const result = parseFeatureDescription('−2 to Evasion; −1 to Agility');
      expect(result).toContainEqual({ stat: 'evasion', value: -2 });
      expect(result).toContainEqual({ stat: 'Agility', value: -1 });
    });

    it('parses "−1 to Evasion; +3 to Severe damage threshold"', () => {
      const result = parseFeatureDescription(
        '−1 to Evasion; +3 to Severe damage threshold'
      );
      expect(result).toContainEqual({ stat: 'evasion', value: -1 });
      expect(result).toContainEqual({ stat: 'severeThreshold', value: 3 });
    });
  });

  describe('All character traits pattern', () => {
    it('parses "−1 to all character traits and Evasion"', () => {
      const result = parseFeatureDescription(
        '−1 to all character traits and Evasion'
      );
      expect(result).toContainEqual({
        stat: 'Agility',
        value: -1,
        appliesToAllTraits: true,
      });
      expect(result).toContainEqual({
        stat: 'Strength',
        value: -1,
        appliesToAllTraits: true,
      });
      expect(result).toContainEqual({
        stat: 'Finesse',
        value: -1,
        appliesToAllTraits: true,
      });
      expect(result).toContainEqual({
        stat: 'Instinct',
        value: -1,
        appliesToAllTraits: true,
      });
      expect(result).toContainEqual({
        stat: 'Presence',
        value: -1,
        appliesToAllTraits: true,
      });
      expect(result).toContainEqual({
        stat: 'Knowledge',
        value: -1,
        appliesToAllTraits: true,
      });
      expect(result).toContainEqual({
        stat: 'evasion',
        value: -1,
        appliesToAllTraits: true,
      });
    });
  });

  describe('Standalone patterns', () => {
    it('parses "+2 Agility, -1 Proficiency" (item description style)', () => {
      const result = parseFeatureDescription('+2 Agility, -1 Proficiency');
      expect(result).toContainEqual({ stat: 'Agility', value: 2 });
      expect(result).toContainEqual({ stat: 'proficiency', value: -1 });
    });
  });

  describe('No modifiers', () => {
    it('returns empty array for description without modifiers', () => {
      const result = parseFeatureDescription(
        'When you succeed on an attack, deal extra damage'
      );
      expect(result).toEqual([]);
    });

    it('returns empty array for empty string', () => {
      const result = parseFeatureDescription('');
      expect(result).toEqual([]);
    });
  });
});

describe('parseFeature', () => {
  it('parses a feature object and returns structured effect data', () => {
    const feature = {
      name: 'Heavy',
      description: '−1 to Evasion',
    };
    const result = parseFeature(feature);
    expect(result.featureName).toBe('Heavy');
    expect(result.description).toBe('−1 to Evasion');
    expect(result.modifiers).toContainEqual({ stat: 'evasion', value: -1 });
  });
});

describe('parseFeatures', () => {
  it('parses multiple features', () => {
    const features = [
      { name: 'Heavy', description: '−1 to Evasion' },
      { name: 'Protective', description: '+2 to Armor Score' },
    ];
    const result = parseFeatures(features);
    expect(result).toHaveLength(2);
    expect(result[0].modifiers).toContainEqual({ stat: 'evasion', value: -1 });
    expect(result[1].modifiers).toContainEqual({
      stat: 'armorScore',
      value: 2,
    });
  });
});

describe('hasStatModifiers', () => {
  it('returns true for features with stat modifiers', () => {
    expect(
      hasStatModifiers({ name: 'Heavy', description: '−1 to Evasion' })
    ).toBe(true);
  });

  it('returns false for features without stat modifiers', () => {
    expect(
      hasStatModifiers({
        name: 'Quick',
        description:
          'When you make an attack, you can mark a Stress to target another creature',
      })
    ).toBe(false);
  });
});

describe('createEmptyAggregatedStats', () => {
  it('creates stats with all values at zero', () => {
    const stats = createEmptyAggregatedStats();
    expect(stats.evasion).toBe(0);
    expect(stats.proficiency).toBe(0);
    expect(stats.armorScore).toBe(0);
    expect(stats.majorThreshold).toBe(0);
    expect(stats.severeThreshold).toBe(0);
    expect(stats.traits.Agility).toBe(0);
    expect(stats.traits.Strength).toBe(0);
  });
});

describe('aggregateEquipmentStats', () => {
  it('aggregates stats from armor features', () => {
    const armor = {
      name: 'Chainmail Armor',
      features: [{ name: 'Heavy', description: '−1 to Evasion' }],
    };
    const result = aggregateEquipmentStats(armor);
    expect(result.evasion).toBe(-1);
  });

  it('aggregates stats from primary weapon features', () => {
    const primaryWeapon = {
      name: 'Greatsword',
      features: [
        {
          name: 'Massive',
          description:
            '−1 to Evasion; on a successful attack, roll an additional damage die',
        },
      ],
    };
    const result = aggregateEquipmentStats(null, primaryWeapon);
    expect(result.evasion).toBe(-1);
  });

  it('aggregates stats from secondary weapon features', () => {
    const secondaryWeapon = {
      name: 'Tower Shield',
      features: [
        { name: 'Barrier', description: '+2 to Armor Score; −1 to Evasion' },
      ],
    };
    const result = aggregateEquipmentStats(null, null, secondaryWeapon);
    expect(result.evasion).toBe(-1);
    expect(result.armorScore).toBe(2);
  });

  it('aggregates stats from multiple equipment pieces', () => {
    // Armor with legacy fields - these are NOT included in feature modifiers
    // because armor base stats are handled separately by getArmorStats().
    // This prevents double-counting when components add armor evasion separately.
    const armor = {
      name: 'Full Plate Armor',
      evasionModifier: -2,
      agilityModifier: -1,
      features: [
        { name: 'Very Heavy', description: '−2 to Evasion; −1 to Agility' },
      ],
    };
    const primaryWeapon = {
      name: 'Warhammer',
      features: [{ name: 'Heavy', description: '−1 to Evasion' }],
    };
    const secondaryWeapon = {
      name: 'Round Shield',
      features: [{ name: 'Protective', description: '+1 to Armor Score' }],
    };

    const result = aggregateEquipmentStats(
      armor,
      primaryWeapon,
      secondaryWeapon
    );
    // Armor base stats (evasionModifier, agilityModifier) are NOT included here
    // They are handled by getArmorStats() to prevent double-counting
    // Only weapon features are parsed and included
    expect(result.evasion).toBe(-1); // -1 from weapon (parsed), armor excluded
    expect(result.armorScore).toBe(1); // +1 from shield (parsed)
    expect(result.traits.Agility).toBe(0); // armor agility modifier excluded
  });

  it('does NOT include armor base stats to prevent double-counting with getArmorStats', () => {
    // Armor base stats (evasionModifier, agilityModifier) are handled by getArmorStats()
    // not by the equipment feature aggregator. This test verifies they're excluded.
    const armorWithDuplicateData = {
      name: 'Plate Armor',
      evasionModifier: -2,
      agilityModifier: -1,
      features: [
        { name: 'Heavy', description: '−2 to Evasion; −1 to Agility' },
      ],
    };

    const result = aggregateEquipmentStats(armorWithDuplicateData);

    // Armor base stats are NOT included (handled separately by getArmorStats)
    expect(result.evasion).toBe(0);
    expect(result.traits.Agility).toBe(0);
  });

  it('returns empty stats when no equipment is provided', () => {
    const result = aggregateEquipmentStats(null, null, null);
    expect(result.evasion).toBe(0);
    expect(result.armorScore).toBe(0);
  });
});

describe('normalizeEquipment', () => {
  it('excludes armor base stats to prevent double-counting with getArmorStats', () => {
    // Armor base stats (evasionModifier, agilityModifier) are NOT included
    // because they are handled separately by getArmorStats() in the UI.
    // This prevents double-counting when calculating evasion.
    const armor = {
      name: 'Full Plate',
      evasionModifier: -2,
      agilityModifier: -1,
      features: [
        { name: 'Heavy', description: '−2 to Evasion; −1 to Agility' },
      ],
    };

    const mods = normalizeEquipment(armor);

    expect(mods.source).toBe('legacy-armor');
    // Base stats are excluded (handled by getArmorStats)
    expect(mods.evasion).toBe(0);
    expect(mods.traits.Agility).toBe(0);
    expect(mods.equipmentName).toBe('Full Plate');
  });

  it('uses explicit statModifiers when present', () => {
    const weapon = {
      name: 'Magic Sword',
      statModifiers: {
        evasion: 1,
        attackRolls: 2,
        traits: { Finesse: 1 },
      },
      features: [{ name: 'Ignored', description: '+5 to Evasion' }],
    };

    const mods = normalizeEquipment(weapon);

    expect(mods.source).toBe('explicit');
    expect(mods.evasion).toBe(1);
    expect(mods.attackRolls).toBe(2);
    expect(mods.traits.Finesse).toBe(1);
    // Should NOT have parsed the feature text
  });

  it('parses features for weapons without legacy or explicit modifiers', () => {
    const weapon = {
      name: 'Heavy Crossbow',
      features: [{ name: 'Cumbersome', description: '−1 to Evasion' }],
    };

    const mods = normalizeEquipment(weapon);

    expect(mods.source).toBe('parsed');
    expect(mods.evasion).toBe(-1);
  });

  it('returns empty modifiers for null equipment', () => {
    const mods = normalizeEquipment(null);
    expect(mods.source).toBe('none');
    expect(hasAnyModifiers(mods)).toBe(false);
  });

  it('prioritizes explicit statModifiers over legacy armor fields', () => {
    // Edge case: homebrew armor with both legacy fields AND explicit modifiers
    const homebrewArmor = {
      name: 'Homebrew Armor',
      evasionModifier: -1,
      agilityModifier: 0,
      statModifiers: {
        evasion: 2,
        proficiency: 1,
      },
    };

    const mods = normalizeEquipment(homebrewArmor);

    // Explicit modifiers take precedence
    expect(mods.source).toBe('explicit');
    expect(mods.evasion).toBe(2);
    expect(mods.proficiency).toBe(1);
  });
});

describe('getEquipmentStatsSummary', () => {
  it('returns empty array for stats with all zeros', () => {
    const stats = createEmptyAggregatedStats();
    const summary = getEquipmentStatsSummary(stats);
    expect(summary).toEqual([]);
  });

  it('includes only non-zero stats', () => {
    const stats = createEmptyAggregatedStats();
    stats.evasion = -2;
    stats.armorScore = 3;
    const summary = getEquipmentStatsSummary(stats);
    expect(summary).toContain('Evasion: -2');
    expect(summary).toContain('Armor Score: +3');
    expect(summary).not.toContain('Proficiency');
  });

  it('includes trait modifiers', () => {
    const stats = createEmptyAggregatedStats();
    stats.traits.Finesse = -1;
    stats.traits.Presence = 2;
    const summary = getEquipmentStatsSummary(stats);
    expect(summary).toContain('Finesse: -1');
    expect(summary).toContain('Presence: +2');
  });
});
