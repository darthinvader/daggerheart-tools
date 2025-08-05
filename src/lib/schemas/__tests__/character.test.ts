/**
 * Tests for Character Schemas
 */
import { describe, expect, test } from 'vitest';

import {
  type HitPoints,
  HitPointsSchema,
  type HopeState,
  HopeStateSchema,
  PlayerCharacterSchema,
  SRDPlayerCharacterSchema,
  type StressTrack,
  StressTrackSchema,
} from '../character';

describe('Character Resource Schemas', () => {
  describe('HitPointsSchema', () => {
    test('validates basic hit points', () => {
      const validHP: HitPoints = {
        maxSlots: 20,
        marked: 5,
        temporaryBonus: 0,
      };

      expect(() => HitPointsSchema.parse(validHP)).not.toThrow();
    });

    test('allows temporary bonuses', () => {
      const hpWithBonus = {
        maxSlots: 20,
        marked: 22,
        temporaryBonus: 5,
      };

      expect(() => HitPointsSchema.parse(hpWithBonus)).not.toThrow();
    });

    test('prevents marked exceeding max + bonus', () => {
      const invalidHP = {
        maxSlots: 20,
        marked: 26,
        temporaryBonus: 5,
      };

      expect(() => HitPointsSchema.parse(invalidHP)).toThrow();
    });

    test('handles negative temporary bonuses', () => {
      const hpWithPenalty = {
        maxSlots: 20,
        marked: 15,
        temporaryBonus: -5,
      };

      expect(() => HitPointsSchema.parse(hpWithPenalty)).not.toThrow();
    });

    test('requires minimum of 1 max slot', () => {
      const invalidHP = {
        maxSlots: 0,
        marked: 0,
        temporaryBonus: 0,
      };

      expect(() => HitPointsSchema.parse(invalidHP)).toThrow();
    });
  });

  describe('StressTrackSchema', () => {
    test('validates basic stress track', () => {
      const validStress: StressTrack = {
        maxSlots: 6,
        marked: 3,
        temporaryBonus: 0,
      };

      expect(() => StressTrackSchema.parse(validStress)).not.toThrow();
    });

    test('follows same rules as hit points', () => {
      const stressWithBonus = {
        maxSlots: 6,
        marked: 8,
        temporaryBonus: 2,
      };

      expect(() => StressTrackSchema.parse(stressWithBonus)).not.toThrow();

      const invalidStress = {
        maxSlots: 6,
        marked: 10,
        temporaryBonus: 2,
      };

      expect(() => StressTrackSchema.parse(invalidStress)).toThrow();
    });
  });

  describe('HopeStateSchema', () => {
    test('validates basic hope state', () => {
      const validHope: HopeState = {
        current: 4,
        maximum: 6,
        sessionGenerated: 2,
      };

      expect(() => HopeStateSchema.parse(validHope)).not.toThrow();
    });

    test('enforces maximum of 6', () => {
      const invalidHope = {
        current: 4,
        maximum: 8,
        sessionGenerated: 0,
      };

      expect(() => HopeStateSchema.parse(invalidHope)).toThrow();
    });

    test('allows current hope of 0', () => {
      const noHope = {
        current: 0,
        maximum: 6,
        sessionGenerated: 0,
      };

      expect(() => HopeStateSchema.parse(noHope)).not.toThrow();
    });

    test('prevents current hope exceeding 6', () => {
      const tooMuchHope = {
        current: 7,
        maximum: 6,
        sessionGenerated: 0,
      };

      expect(() => HopeStateSchema.parse(tooMuchHope)).toThrow();
    });

    test('defaults sessionGenerated to 0', () => {
      const hopeWithoutSession = {
        current: 3,
        maximum: 6,
      };

      const parsed = HopeStateSchema.parse(hopeWithoutSession);
      expect(parsed.sessionGenerated).toBe(0);
    });
  });
});

describe('PlayerCharacterSchema', () => {
  const baseCharacter = {
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
  };

  test('validates complete character', () => {
    expect(() => PlayerCharacterSchema.parse(baseCharacter)).not.toThrow();
  });

  test('allows homebrew mode', () => {
    const homebrewCharacter = {
      ...baseCharacter,
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

    expect(() => PlayerCharacterSchema.parse(homebrewCharacter)).not.toThrow();
  });

  test('accepts optional fields', () => {
    const characterWithOptionals = {
      ...baseCharacter,
      pronouns: 'they/them',
      description: 'A brave warrior',
      primaryWeapon: {
        id: 'sword-1',
        name: 'Iron Sword',
        trait: 'Strength',
        range: 'Melee',
        damageDie: 'd8',
        damageType: 'phy',
        burden: 'One-Handed',
        features: [],
      },
      conditions: [],
      temporaryEffects: [],
      homebrewMode: false,
      rulesVersion: 'SRD-1.0',
      tags: ['heroic', 'brave'],
      data: { customField: 'customValue' },
    };

    expect(() =>
      PlayerCharacterSchema.parse(characterWithOptionals)
    ).not.toThrow();
  });

  test('defaults arrays and values correctly', () => {
    const parsed = PlayerCharacterSchema.parse(baseCharacter);

    expect(parsed.conditions).toEqual([]);
    expect(parsed.temporaryEffects).toEqual([]);
    expect(parsed.homebrewMode).toBe(false);
    expect(parsed.rulesVersion).toBe('SRD-1.0');
  });

  test('prevents two-handed primary with secondary weapon', () => {
    const invalidCharacter = {
      ...baseCharacter,
      primaryWeapon: {
        id: 'greataxe-1',
        name: 'Great Axe',
        trait: 'Strength',
        range: 'Melee',
        damageDie: 'd12',
        damageType: 'phy',
        burden: 'Two-Handed',
        features: [],
      },
      secondaryWeapon: {
        id: 'dagger-1',
        name: 'Dagger',
        trait: 'Finesse',
        range: 'Melee',
        damageDie: 'd4',
        damageType: 'phy',
        burden: 'One-Handed',
        features: [],
      },
    };

    expect(() => PlayerCharacterSchema.parse(invalidCharacter)).toThrow();
  });

  test('allows custom ancestry, community, and class names', () => {
    const customCharacter = {
      ...baseCharacter,
      ancestry: 'Custom Ancestry',
      community: 'Custom Community',
      className: 'Custom Class',
    };

    expect(() => PlayerCharacterSchema.parse(customCharacter)).not.toThrow();
  });
});

describe('SRD Validation', () => {
  const srdCharacter = {
    id: 'srd-char-123',
    name: 'SRD Character',
    level: 3,
    tier: 2,
    evasion: 12,
    proficiency: 2,
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
    homebrewMode: false,
  };

  test('validates SRD-compliant character', () => {
    expect(() => SRDPlayerCharacterSchema.parse(srdCharacter)).not.toThrow();
  });

  test('enforces trait standard array in SRD mode', () => {
    const invalidSRDCharacter = {
      ...srdCharacter,
      traits: {
        Agility: 3,
        Strength: 2,
        Finesse: 1,
        Instinct: 0,
        Presence: 0,
        Knowledge: -1,
      },
    };

    expect(() => PlayerCharacterSchema.parse(invalidSRDCharacter)).toThrow();
  });

  test('enforces tier/level relationship in SRD mode', () => {
    const invalidTierCharacter = {
      ...srdCharacter,
      level: 5,
      tier: 2, // Should be 3 for level 5
    };

    expect(() => PlayerCharacterSchema.parse(invalidTierCharacter)).toThrow();
  });

  test('enforces stat bounds in SRD mode', () => {
    const invalidEvasionCharacter = {
      ...srdCharacter,
      evasion: 25, // Too high for SRD
    };

    expect(() =>
      PlayerCharacterSchema.parse(invalidEvasionCharacter)
    ).toThrow();

    const invalidProficiencyCharacter = {
      ...srdCharacter,
      proficiency: 10, // Too high for SRD
    };

    expect(() =>
      PlayerCharacterSchema.parse(invalidProficiencyCharacter)
    ).toThrow();
  });

  test('rejects homebrew mode in SRD schema', () => {
    const homebrewCharacter = {
      ...srdCharacter,
      homebrewMode: true,
    };

    expect(() => SRDPlayerCharacterSchema.parse(homebrewCharacter)).toThrow();
  });
});
