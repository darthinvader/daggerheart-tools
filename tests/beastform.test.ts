import { describe, expect, it } from 'vitest';

import {
  buildBeastformModifiers,
  buildEngineInput,
} from '../src/lib/character-stats-engine/adapters';
import { DEFAULT_EQUIPMENT_MODIFIERS } from '../src/lib/character-stats-engine/types';
import {
  BEASTFORMS,
  getBeastformById,
  getBeastformsAtTier,
  getBeastformsForTier,
} from '../src/lib/data/beastforms';
import {
  type BeastformState,
  DEFAULT_BEASTFORM_STATE,
} from '../src/lib/schemas/beastform';

// ============================================
// Schema & Defaults
// ============================================

describe('BeastformState schema defaults', () => {
  it('DEFAULT_BEASTFORM_STATE has all fields inactive/null', () => {
    expect(DEFAULT_BEASTFORM_STATE).toEqual({
      active: false,
      formId: null,
      activationMethod: null,
      evolutionBonusTrait: null,
      activatedAt: null,
    });
  });
});

// ============================================
// Data — BEASTFORMS
// ============================================

describe('Beastform data', () => {
  it('has beastforms across all 4 tiers', () => {
    for (const tier of [1, 2, 3, 4]) {
      const forms = getBeastformsAtTier(tier);
      expect(forms.length).toBeGreaterThan(0);
    }
  });

  it('every beastform has required fields', () => {
    for (const form of BEASTFORMS) {
      expect(form.id).toBeTruthy();
      expect(form.name).toBeTruthy();
      expect(form.tier).toBeGreaterThanOrEqual(1);
      expect(form.tier).toBeLessThanOrEqual(4);
      expect(form.traitBonus.trait).toBeTruthy();
      expect(form.traitBonus.value).toBeGreaterThanOrEqual(0);
      expect(form.attack.range).toBeTruthy();
      expect(form.attack.trait).toBeTruthy();
      expect(form.attack.damageDice).toBeTruthy();
    }
  });

  it('getBeastformById returns correct form', () => {
    const wolf = getBeastformById('pack-predator');
    expect(wolf).toBeDefined();
    expect(wolf!.name).toBe('Pack Predator');
  });

  it('getBeastformById returns undefined for unknown ID', () => {
    expect(getBeastformById('nonexistent')).toBeUndefined();
  });

  it('getBeastformsForTier(2) includes tier 1 and 2 forms', () => {
    const forms = getBeastformsForTier(2);
    const tiers = new Set(forms.map(f => f.tier));
    expect(tiers.has(1)).toBe(true);
    expect(tiers.has(2)).toBe(true);
    expect(tiers.has(3)).toBe(false);
  });

  it('getBeastformsForTier(4) includes all forms', () => {
    const forms = getBeastformsForTier(4);
    expect(forms.length).toBe(BEASTFORMS.length);
  });

  it('all beastform IDs are unique', () => {
    const ids = BEASTFORMS.map(f => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ============================================
// Adapter — buildBeastformModifiers
// ============================================

describe('buildBeastformModifiers', () => {
  it('returns default modifiers when beastform is null', () => {
    expect(buildBeastformModifiers(null)).toEqual(DEFAULT_EQUIPMENT_MODIFIERS);
  });

  it('returns default modifiers when beastform is inactive', () => {
    expect(buildBeastformModifiers(DEFAULT_BEASTFORM_STATE)).toEqual(
      DEFAULT_EQUIPMENT_MODIFIERS
    );
  });

  it('returns default modifiers when formId is invalid', () => {
    const state: BeastformState = {
      active: true,
      formId: 'nonexistent',
      activationMethod: 'stress',
      evolutionBonusTrait: null,
      activatedAt: new Date().toISOString(),
    };
    expect(buildBeastformModifiers(state)).toEqual(DEFAULT_EQUIPMENT_MODIFIERS);
  });

  it('applies trait bonus and evasion bonus for stress activation', () => {
    const state: BeastformState = {
      active: true,
      formId: 'pack-predator',
      activationMethod: 'stress',
      evolutionBonusTrait: null,
      activatedAt: new Date().toISOString(),
    };
    const mods = buildBeastformModifiers(state);
    expect(mods.evasion).toBe(1); // Pack Predator has +1 evasion
    expect(mods.traits.Strength).toBe(2); // Pack Predator has +2 Strength
    expect(mods.traits.Agility).toBe(0);
  });

  it('applies evolution bonus trait on top of form trait', () => {
    const state: BeastformState = {
      active: true,
      formId: 'pack-predator',
      activationMethod: 'evolution',
      evolutionBonusTrait: { trait: 'Instinct', value: 1 },
      activatedAt: new Date().toISOString(),
    };
    const mods = buildBeastformModifiers(state);
    expect(mods.traits.Strength).toBe(2); // From form
    expect(mods.traits.Instinct).toBe(1); // From evolution bonus
  });

  it('stacks evolution bonus with form trait when same trait', () => {
    const state: BeastformState = {
      active: true,
      formId: 'pack-predator', // +2 Strength
      activationMethod: 'evolution',
      evolutionBonusTrait: { trait: 'Strength', value: 1 },
      activatedAt: new Date().toISOString(),
    };
    const mods = buildBeastformModifiers(state);
    expect(mods.traits.Strength).toBe(3); // +2 form + +1 evolution
  });

  it('does not modify non-trait stats like proficiency or armorScore', () => {
    const state: BeastformState = {
      active: true,
      formId: 'armored-sentry',
      activationMethod: 'stress',
      evolutionBonusTrait: null,
      activatedAt: new Date().toISOString(),
    };
    const mods = buildBeastformModifiers(state);
    expect(mods.proficiency).toBe(0);
    expect(mods.armorScore).toBe(0);
    expect(mods.majorThreshold).toBe(0);
    expect(mods.severeThreshold).toBe(0);
    expect(mods.attackRolls).toBe(0);
    expect(mods.spellcastRolls).toBe(0);
  });
});

// ============================================
// Integration — buildEngineInput with beastform
// ============================================

describe('buildEngineInput with beastform', () => {
  it('works without beastform parameter (backward compat)', () => {
    const input = buildEngineInput(null, null, null, null);
    expect(input.equipmentModifiers).toEqual(DEFAULT_EQUIPMENT_MODIFIERS);
  });

  it('merges beastform modifiers into equipment modifiers', () => {
    const beastform: BeastformState = {
      active: true,
      formId: 'agile-scout', // +1 Agility, +2 evasion
      activationMethod: 'stress',
      evolutionBonusTrait: null,
      activatedAt: new Date().toISOString(),
    };
    const input = buildEngineInput(null, null, null, null, beastform);
    expect(input.equipmentModifiers.evasion).toBe(2);
    expect(input.equipmentModifiers.traits.Agility).toBe(1);
  });

  it('inactive beastform does not affect modifiers', () => {
    const input = buildEngineInput(
      null,
      null,
      null,
      null,
      DEFAULT_BEASTFORM_STATE
    );
    expect(input.equipmentModifiers).toEqual(DEFAULT_EQUIPMENT_MODIFIERS);
  });
});
