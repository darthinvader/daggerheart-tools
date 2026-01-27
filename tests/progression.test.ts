import { describe, expect, it } from 'vitest';

import {
  classifyDamage,
  getOptionsForTier,
  getPointsForLevel,
  getThresholds,
  getTierForLevel,
  validateLevelUpDecisions,
} from '../src/features/characters/logic/progression';

describe('progression helpers', () => {
  it('computes thresholds correctly', () => {
    // SRD rule: thresholds = base + level
    // Base thresholds: major: 6, severe: 9 at level 1 => 6+1=7, 9+1=10
    expect(getThresholds({ major: 6, severe: 9 }, 1)).toEqual({
      major: 7,
      severe: 10,
    });
    // At level 5: 6+5=11, 9+5=14
    expect(getThresholds({ major: 6, severe: 9 }, 5)).toEqual({
      major: 11,
      severe: 14,
    });
    // With zero base at level 1: 0+1=1, 0+1=1
    expect(getThresholds({ major: 0, severe: 0 }, 1)).toEqual({
      major: 1,
      severe: 1,
    });
  });

  it('maps level to tier', () => {
    expect(getTierForLevel(1)).toBe('1');
    expect(getTierForLevel(2)).toBe('2-4');
    expect(getTierForLevel(5)).toBe('5-7');
    expect(getTierForLevel(8)).toBe('8-10');
  });

  it('exposes points per level', () => {
    expect(getPointsForLevel()).toBe(2);
  });

  it('provides options table by tier', () => {
    expect(Object.keys(getOptionsForTier('2-4')).length).toBeGreaterThan(0);
    expect(Object.keys(getOptionsForTier('5-7')).length).toBeGreaterThan(0);
    expect(Object.keys(getOptionsForTier('8-10')).length).toBeGreaterThan(0);
  });

  it('validates decisions with cost and maxSelections', () => {
    const tier = '2-4' as const;
    const table = getOptionsForTier(tier) as Record<
      string,
      { cost: number; maxSelections: number }
    >;
    const [firstName] = Object.keys(table);
    const cost = table[firstName].cost;
    const res = validateLevelUpDecisions({ [firstName]: 2 / cost }, tier);
    expect(res.totalCost).toBeLessThanOrEqual(getPointsForLevel());
  });

  it('rejects overspend', () => {
    const tier = '2-4' as const;
    const table = getOptionsForTier(tier) as Record<
      string,
      { cost: number; maxSelections: number }
    >;
    const [firstName] = Object.keys(table);
    const cost = table[firstName].cost;
    expect(() =>
      validateLevelUpDecisions({ [firstName]: 3 / cost }, tier)
    ).toThrow();
  });

  it('classifies damage by thresholds with correct boundaries', () => {
    const thresholds = { major: 3, severe: 6 } as const;
    // Below major → 1
    expect(classifyDamage(0, thresholds)).toBe(1);
    expect(classifyDamage(2, thresholds)).toBe(1);
    // At major and below severe → 2
    expect(classifyDamage(3, thresholds)).toBe(2);
    expect(classifyDamage(5, thresholds)).toBe(2);
    // At or above severe → 3
    expect(classifyDamage(6, thresholds)).toBe(3);
    expect(classifyDamage(10, thresholds)).toBe(3);
  });

  it('classifies critical damage when enabled and hit ≥ DS', () => {
    const thresholds = { major: 3, severe: 6 } as const;
    // Critical disabled: returns Severe (3)
    expect(classifyDamage(12, thresholds)).toBe(3);
    // Critical enabled with default DS = severe * 2 = 12
    expect(classifyDamage(12, thresholds, { critical: true })).toBe(4);
    // With DS override higher than default
    expect(
      classifyDamage(12, thresholds, {
        critical: true,
        doubleSevereOverride: 13,
      })
    ).toBe(3);
    expect(
      classifyDamage(13, thresholds, {
        critical: true,
        doubleSevereOverride: 13,
      })
    ).toBe(4);
  });
});
