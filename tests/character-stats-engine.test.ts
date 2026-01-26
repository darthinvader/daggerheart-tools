import { describe, expect, it } from 'vitest';
import {
  ArmorInput,
  calculateArmorScore,
  calculateCharacterStats,
  calculateEvasion,
  calculateHp,
  calculateProficiency,
  calculateThresholds,
  calculateTraits,
  CharacterStatsInput,
  ClassInput,
  createDefaultTraitsState,
  DEFAULT_ARMOR_INPUT,
  DEFAULT_CLASS_INPUT,
  DEFAULT_EQUIPMENT_MODIFIERS,
  DEFAULT_PROGRESSION_INPUT,
  DEFAULT_TRAITS_INPUT,
  EquipmentModifiersInput,
  getStatTotals,
  hasEquipmentModifiers,
  ProgressionInput,
  TraitModifiers,
  TraitsInput,
} from '../src/lib/character-stats-engine';

// Helper to create equipment modifiers with overrides
function createEquipmentModifiers(
  overrides: Partial<EquipmentModifiersInput> = {}
): EquipmentModifiersInput {
  return {
    ...DEFAULT_EQUIPMENT_MODIFIERS,
    ...overrides,
  };
}

// Helper to create trait modifiers with partial overrides
function createTraitModifiers(
  overrides: Partial<TraitModifiers> = {}
): TraitModifiers {
  return {
    Agility: 0,
    Strength: 0,
    Finesse: 0,
    Instinct: 0,
    Presence: 0,
    Knowledge: 0,
    ...overrides,
  };
}

// eslint-disable-next-line max-lines-per-function -- Comprehensive test coverage in a single suite
describe('Character Stats Engine', () => {
  // ===== HP Calculation =====
  describe('calculateHp', () => {
    it('should calculate HP with tier 1', () => {
      const classInput: ClassInput = { baseHp: 6, baseEvasion: 10, tier: 1 };
      const result = calculateHp(classInput);
      expect(result.total).toBe(6); // 6 + (1-1) = 6
      expect(result.classBase).toBe(6);
      expect(result.tierBonus).toBe(0);
    });

    it('should add tier bonus correctly', () => {
      const classInput: ClassInput = { baseHp: 6, baseEvasion: 10, tier: 3 };
      const result = calculateHp(classInput);
      expect(result.total).toBe(8); // 6 + (3-1) = 8
      expect(result.classBase).toBe(6);
      expect(result.tierBonus).toBe(2);
    });

    it('should handle different class HP values', () => {
      const classInput: ClassInput = { baseHp: 10, baseEvasion: 10, tier: 4 };
      const result = calculateHp(classInput);
      expect(result.total).toBe(13); // 10 + (4-1) = 13
    });
  });

  // ===== Evasion Calculation =====
  describe('calculateEvasion', () => {
    it('should calculate evasion with no modifiers', () => {
      const classInput: ClassInput = { baseHp: 6, baseEvasion: 10, tier: 1 };
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        evasionModifier: 0,
      };
      const result = calculateEvasion(
        classInput,
        armorInput,
        DEFAULT_EQUIPMENT_MODIFIERS
      );
      expect(result.total).toBe(10);
      expect(result.classBase).toBe(10);
      expect(result.armorModifier).toBe(0);
      expect(result.equipmentModifier).toBe(0);
    });

    it('should apply positive armor modifier', () => {
      const classInput: ClassInput = { baseHp: 6, baseEvasion: 10, tier: 1 };
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        evasionModifier: 2,
      };
      const result = calculateEvasion(
        classInput,
        armorInput,
        DEFAULT_EQUIPMENT_MODIFIERS
      );
      expect(result.total).toBe(12); // 10 + 2
      expect(result.armorModifier).toBe(2);
    });

    it('should apply negative armor modifier', () => {
      const classInput: ClassInput = { baseHp: 6, baseEvasion: 10, tier: 1 };
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        evasionModifier: -3,
      };
      const result = calculateEvasion(
        classInput,
        armorInput,
        DEFAULT_EQUIPMENT_MODIFIERS
      );
      expect(result.total).toBe(7); // 10 - 3
      expect(result.armorModifier).toBe(-3);
    });

    it('should apply equipment feature modifiers', () => {
      const classInput: ClassInput = { baseHp: 6, baseEvasion: 10, tier: 1 };
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        evasionModifier: 0,
      };
      const equipMods = createEquipmentModifiers({ evasion: 2 });
      const result = calculateEvasion(classInput, armorInput, equipMods);
      expect(result.total).toBe(12); // 10 + 2
      expect(result.equipmentModifier).toBe(2);
    });

    it('should combine armor and equipment modifiers correctly', () => {
      const classInput: ClassInput = { baseHp: 6, baseEvasion: 10, tier: 1 };
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        evasionModifier: -2,
      };
      const equipMods = createEquipmentModifiers({ evasion: 1 });
      const result = calculateEvasion(classInput, armorInput, equipMods);
      expect(result.total).toBe(9); // 10 - 2 + 1
      expect(result.armorModifier).toBe(-2);
      expect(result.equipmentModifier).toBe(1);
    });

    it('should NOT double-count (single source for each modifier)', () => {
      // This test ensures the engine doesn't add the same value twice
      const classInput: ClassInput = { baseHp: 6, baseEvasion: 10, tier: 1 };
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        evasionModifier: -2,
      };
      const equipMods = createEquipmentModifiers({ evasion: 0 });
      const result = calculateEvasion(classInput, armorInput, equipMods);
      expect(result.total).toBe(8); // 10 - 2 (NOT 10 - 4)
    });
  });

  // ===== Armor Score Calculation =====
  describe('calculateArmorScore', () => {
    it('should return 0 with no armor', () => {
      const armorInput: ArmorInput = { ...DEFAULT_ARMOR_INPUT, baseScore: 0 };
      const result = calculateArmorScore(
        armorInput,
        DEFAULT_EQUIPMENT_MODIFIERS
      );
      expect(result.total).toBe(0);
    });

    it('should calculate armor score correctly', () => {
      const armorInput: ArmorInput = { ...DEFAULT_ARMOR_INPUT, baseScore: 5 };
      const result = calculateArmorScore(
        armorInput,
        DEFAULT_EQUIPMENT_MODIFIERS
      );
      expect(result.total).toBe(5);
      expect(result.base).toBe(5);
      expect(result.equipmentModifier).toBe(0);
    });

    it('should add equipment modifier correctly', () => {
      const armorInput: ArmorInput = { ...DEFAULT_ARMOR_INPUT, baseScore: 5 };
      const equipMods = createEquipmentModifiers({ armorScore: 2 });
      const result = calculateArmorScore(armorInput, equipMods);
      expect(result.total).toBe(7); // 5 + 2
      expect(result.equipmentModifier).toBe(2);
    });
  });

  // ===== Proficiency Calculation =====
  describe('calculateProficiency', () => {
    it('should calculate proficiency with no equipment modifier', () => {
      const result = calculateProficiency(DEFAULT_EQUIPMENT_MODIFIERS);
      expect(result.total).toBe(2); // base 2 + 0
      expect(result.base).toBe(2);
      expect(result.equipmentModifier).toBe(0);
    });

    it('should apply equipment modifier', () => {
      const equipMods = createEquipmentModifiers({ proficiency: 1 });
      const result = calculateProficiency(equipMods);
      expect(result.total).toBe(3); // 2 + 1
      expect(result.equipmentModifier).toBe(1);
    });

    it('should allow custom base proficiency', () => {
      const result = calculateProficiency(DEFAULT_EQUIPMENT_MODIFIERS, 3);
      expect(result.total).toBe(3);
      expect(result.base).toBe(3);
    });
  });

  // ===== Thresholds Calculation =====
  describe('calculateThresholds', () => {
    it('should calculate thresholds at level 1', () => {
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        baseThresholds: { major: 6, severe: 9 },
      };
      const progressionInput: ProgressionInput = { level: 1 };
      const result = calculateThresholds(
        armorInput,
        progressionInput,
        DEFAULT_EQUIPMENT_MODIFIERS
      );

      expect(result.major.total).toBe(6);
      expect(result.severe.total).toBe(9);
    });

    it('should add level bonus to all thresholds', () => {
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        baseThresholds: { major: 6, severe: 9 },
      };
      const progressionInput: ProgressionInput = { level: 5 };
      const result = calculateThresholds(
        armorInput,
        progressionInput,
        DEFAULT_EQUIPMENT_MODIFIERS
      );

      // Level 5 = +4 to each threshold
      expect(result.major.total).toBe(10); // 6 + 4
      expect(result.severe.total).toBe(13); // 9 + 4

      expect(result.major.levelBonus).toBe(4);
      expect(result.severe.levelBonus).toBe(4);
    });

    it('should apply equipment modifiers correctly', () => {
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        baseThresholds: { major: 6, severe: 9 },
      };
      const progressionInput: ProgressionInput = { level: 1 };
      const equipMods = createEquipmentModifiers({
        majorThreshold: 2,
        severeThreshold: 3,
      });
      const result = calculateThresholds(
        armorInput,
        progressionInput,
        equipMods
      );

      expect(result.major.total).toBe(8); // 6 + 0 + 2
      expect(result.severe.total).toBe(12); // 9 + 0 + 3

      expect(result.major.equipmentModifier).toBe(2);
      expect(result.severe.equipmentModifier).toBe(3);
    });
  });

  // ===== Traits Calculation =====
  describe('calculateTraits', () => {
    function createTraitsInput(
      overrides: Partial<Record<string, { value: number; bonus: number }>> = {}
    ): TraitsInput {
      const traits = createDefaultTraitsState();
      for (const [key, val] of Object.entries(overrides)) {
        if (traits[key as keyof typeof traits]) {
          traits[key as keyof typeof traits].value = val.value;
          traits[key as keyof typeof traits].bonus = val.bonus;
        }
      }
      return { traits };
    }

    it('should calculate base + bonus correctly', () => {
      const traitsInput = createTraitsInput({
        Strength: { value: 1, bonus: 0 },
        Finesse: { value: -1, bonus: 1 },
        Instinct: { value: 2, bonus: 0 },
        Knowledge: { value: -2, bonus: 0 },
      });
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        agilityModifier: 0,
      };
      const result = calculateTraits(
        traitsInput,
        armorInput,
        DEFAULT_EQUIPMENT_MODIFIERS
      );

      expect(result.Strength.total).toBe(1);
      expect(result.Finesse.total).toBe(0); // -1 + 1
      expect(result.Instinct.total).toBe(2);
      expect(result.Knowledge.total).toBe(-2);
    });

    it('should apply armor agility modifier', () => {
      const traitsInput = createTraitsInput({
        Agility: { value: 0, bonus: 0 },
        Strength: { value: 1, bonus: 0 },
      });
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        agilityModifier: 2,
      };
      const result = calculateTraits(
        traitsInput,
        armorInput,
        DEFAULT_EQUIPMENT_MODIFIERS
      );

      expect(result.Agility.total).toBe(2); // 0 + 0 + 2
      // Other traits unaffected
      expect(result.Strength.total).toBe(1);
    });

    it('should apply negative armor agility modifier', () => {
      const traitsInput = createTraitsInput({
        Agility: { value: 0, bonus: 0 },
      });
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        agilityModifier: -1,
      };
      const result = calculateTraits(
        traitsInput,
        armorInput,
        DEFAULT_EQUIPMENT_MODIFIERS
      );

      expect(result.Agility.total).toBe(-1); // 0 + 0 - 1
    });

    it('should apply equipment trait modifiers', () => {
      const traitsInput = createTraitsInput({
        Strength: { value: 1, bonus: 0 },
        Presence: { value: 0, bonus: 0 },
      });
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        agilityModifier: 0,
      };
      const equipMods = createEquipmentModifiers({
        traits: createTraitModifiers({
          Strength: 1,
          Presence: -1,
        }),
      });
      const result = calculateTraits(traitsInput, armorInput, equipMods);

      expect(result.Strength.total).toBe(2); // 1 + 0 + 0 + 1
      expect(result.Strength.equipmentModifier).toBe(1);
      expect(result.Presence.total).toBe(-1); // 0 + 0 + 0 - 1
      expect(result.Presence.equipmentModifier).toBe(-1);
    });

    it('should combine all modifiers correctly', () => {
      const traitsInput = createTraitsInput({
        Agility: { value: 0, bonus: 0 },
      });
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        agilityModifier: -2,
      };
      const equipMods = createEquipmentModifiers({
        traits: createTraitModifiers({
          Agility: 1,
        }),
      });
      const result = calculateTraits(traitsInput, armorInput, equipMods);

      // Agility: base(0) + bonus(0) + (armorAgility(-2) + equipTrait(1)) = -1
      // Note: armor agility and equipment trait are combined into equipmentModifier
      expect(result.Agility.total).toBe(-1);
      expect(result.Agility.base).toBe(0);
      expect(result.Agility.bonus).toBe(0);
      // equipmentModifier = armorAgility(-2) + equipTrait(1) = -1
      expect(result.Agility.equipmentModifier).toBe(-1);
    });
  });

  // ===== Full Character Stats =====
  describe('calculateCharacterStats', () => {
    it('should calculate all stats with default inputs', () => {
      const input: CharacterStatsInput = {
        class: DEFAULT_CLASS_INPUT,
        armor: DEFAULT_ARMOR_INPUT,
        equipmentModifiers: DEFAULT_EQUIPMENT_MODIFIERS,
        progression: DEFAULT_PROGRESSION_INPUT,
        traits: DEFAULT_TRAITS_INPUT,
      };

      const result = calculateCharacterStats(input);

      expect(result.hp.total).toBe(6);
      expect(result.evasion.total).toBe(10);
      expect(result.armorScore.total).toBe(0);
      expect(result.proficiency.total).toBe(2);
    });

    it('should handle complex inputs with all modifiers', () => {
      const traitsState = createDefaultTraitsState();
      traitsState.Agility.value = 1;
      traitsState.Strength.value = 0;
      traitsState.Strength.bonus = 1;
      traitsState.Finesse.value = 2;
      traitsState.Instinct.value = -1;
      traitsState.Presence.value = 1;

      const input: CharacterStatsInput = {
        class: { baseHp: 8, baseEvasion: 12, tier: 2 },
        armor: {
          baseScore: 6,
          evasionModifier: -2,
          agilityModifier: -1,
          baseThresholds: { major: 8, severe: 12 },
        },
        equipmentModifiers: createEquipmentModifiers({
          evasion: 1,
          majorThreshold: 0,
          severeThreshold: -1,
          traits: createTraitModifiers({
            Strength: 2,
          }),
        }),
        progression: { level: 5 },
        traits: { traits: traitsState },
      };

      const result = calculateCharacterStats(input);

      // HP: 8 + (2-1) = 9
      expect(result.hp.total).toBe(9);

      // Evasion: 12 - 2 + 1 = 11
      expect(result.evasion.total).toBe(11);

      // Armor Score: 6 + 0 = 6
      expect(result.armorScore.total).toBe(6);

      // Proficiency: 2 + 0 = 2
      expect(result.proficiency.total).toBe(2);

      // Thresholds: base + (level-1) + equipMod
      // Major: 8 + 4 + 0 = 12
      // Severe: 12 + 4 - 1 = 15
      expect(result.thresholds.major.total).toBe(12);
      expect(result.thresholds.severe.total).toBe(15);

      // Traits - Agility includes armor modifier
      // Agility: 1 + 0 + (-1) + 0 = 0
      expect(result.traits.Agility.total).toBe(0);
      // Strength: 0 + 1 + 0 + 2 = 3
      expect(result.traits.Strength.total).toBe(3);
    });
  });

  // ===== Utility Functions =====
  describe('getStatTotals', () => {
    it('should extract totals from full stats', () => {
      const input: CharacterStatsInput = {
        class: DEFAULT_CLASS_INPUT,
        armor: DEFAULT_ARMOR_INPUT,
        equipmentModifiers: DEFAULT_EQUIPMENT_MODIFIERS,
        progression: DEFAULT_PROGRESSION_INPUT,
        traits: DEFAULT_TRAITS_INPUT,
      };

      const stats = calculateCharacterStats(input);
      const totals = getStatTotals(stats);

      expect(totals.hp).toBe(6);
      expect(totals.evasion).toBe(10);
      expect(totals.armorScore).toBe(0);
      expect(totals.proficiency).toBe(2);
    });
  });

  describe('hasEquipmentModifiers', () => {
    it('should return false for default modifiers', () => {
      const input: CharacterStatsInput = {
        class: DEFAULT_CLASS_INPUT,
        armor: DEFAULT_ARMOR_INPUT,
        equipmentModifiers: DEFAULT_EQUIPMENT_MODIFIERS,
        progression: DEFAULT_PROGRESSION_INPUT,
        traits: DEFAULT_TRAITS_INPUT,
      };
      const output = calculateCharacterStats(input);
      expect(hasEquipmentModifiers(output)).toBe(false);
    });

    it('should return true when evasion is modified', () => {
      const input: CharacterStatsInput = {
        class: DEFAULT_CLASS_INPUT,
        armor: DEFAULT_ARMOR_INPUT,
        equipmentModifiers: createEquipmentModifiers({ evasion: 1 }),
        progression: DEFAULT_PROGRESSION_INPUT,
        traits: DEFAULT_TRAITS_INPUT,
      };
      const output = calculateCharacterStats(input);
      expect(hasEquipmentModifiers(output)).toBe(true);
    });

    it('should return true when proficiency is modified', () => {
      const input: CharacterStatsInput = {
        class: DEFAULT_CLASS_INPUT,
        armor: DEFAULT_ARMOR_INPUT,
        equipmentModifiers: createEquipmentModifiers({ proficiency: -1 }),
        progression: DEFAULT_PROGRESSION_INPUT,
        traits: DEFAULT_TRAITS_INPUT,
      };
      const output = calculateCharacterStats(input);
      expect(hasEquipmentModifiers(output)).toBe(true);
    });

    it('should return true when thresholds are modified', () => {
      const input: CharacterStatsInput = {
        class: DEFAULT_CLASS_INPUT,
        armor: DEFAULT_ARMOR_INPUT,
        equipmentModifiers: createEquipmentModifiers({ majorThreshold: 1 }),
        progression: DEFAULT_PROGRESSION_INPUT,
        traits: DEFAULT_TRAITS_INPUT,
      };
      const output = calculateCharacterStats(input);
      expect(hasEquipmentModifiers(output)).toBe(true);
    });

    it('should return true when traits are modified', () => {
      const input: CharacterStatsInput = {
        class: DEFAULT_CLASS_INPUT,
        armor: DEFAULT_ARMOR_INPUT,
        equipmentModifiers: createEquipmentModifiers({
          traits: createTraitModifiers({ Strength: 1 }),
        }),
        progression: DEFAULT_PROGRESSION_INPUT,
        traits: DEFAULT_TRAITS_INPUT,
      };
      const output = calculateCharacterStats(input);
      expect(hasEquipmentModifiers(output)).toBe(true);
    });
  });

  // ===== Double-Counting Prevention =====
  describe('Double-counting prevention', () => {
    it('should not double-count armor evasion modifier', () => {
      // The engine receives armor modifier ONCE (from normalized equipment)
      // It should NOT parse it again from features
      const classInput: ClassInput = { baseHp: 6, baseEvasion: 10, tier: 1 };
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        evasionModifier: -2, // This comes from normalized armor
      };
      const equipMods = createEquipmentModifiers({ evasion: 0 });

      const result = calculateEvasion(classInput, armorInput, equipMods);

      // Should be 10 - 2 = 8, NOT 10 - 4
      expect(result.total).toBe(8);
      expect(result.armorModifier).toBe(-2);
      expect(result.equipmentModifier).toBe(0);
    });

    it('should correctly separate armor modifier from other equipment modifiers', () => {
      // Scenario: Armor has -2 evasion, but weapon gives +1 evasion
      const classInput: ClassInput = { baseHp: 6, baseEvasion: 10, tier: 1 };
      const armorInput: ArmorInput = {
        ...DEFAULT_ARMOR_INPUT,
        evasionModifier: -2,
      };
      const equipMods = createEquipmentModifiers({ evasion: 1 }); // From weapon feature

      const result = calculateEvasion(classInput, armorInput, equipMods);

      // Should be 10 - 2 + 1 = 9
      expect(result.total).toBe(9);
      expect(result.classBase).toBe(10);
      expect(result.armorModifier).toBe(-2);
      expect(result.equipmentModifier).toBe(1);
    });
  });

  // ===== Tier Calculation =====
  describe('Tier from level calculation', () => {
    it('should use provided tier for HP calculation', () => {
      const classInput: ClassInput = { baseHp: 6, baseEvasion: 10, tier: 2 };

      const result = calculateHp(classInput);

      // HP uses tier: 6 + (2-1) = 7
      expect(result.tierBonus).toBe(1);
      expect(result.total).toBe(7);
    });
  });
});
