import { describe, expect, it } from 'vitest';

import {
  canAfford,
  coinsToGold,
  costToHandfuls,
  formatGoldAmount,
  goldPartsToHandfuls,
  goldToCoins,
  handfulsToGoldParts,
  subtractGold,
} from '@/features/shop/gold-math';

const baseGold = {
  handfuls: 0,
  bags: 0,
  chests: 0,
  coins: 0,
  showCoins: false,
  displayDenomination: 'handfuls' as const,
};

describe('goldToCoins', () => {
  it('converts handfuls only', () => {
    expect(goldToCoins({ ...baseGold, handfuls: 3 })).toBe(30);
  });

  it('converts bags only', () => {
    expect(goldToCoins({ ...baseGold, bags: 2 })).toBe(200);
  });

  it('converts chests only', () => {
    expect(goldToCoins({ ...baseGold, chests: 1 })).toBe(1000);
  });

  it('combines all denominations', () => {
    expect(
      goldToCoins({ ...baseGold, chests: 1, bags: 2, handfuls: 3, coins: 4 })
    ).toBe(1234);
  });

  it('handles zero', () => {
    expect(goldToCoins(baseGold)).toBe(0);
  });
});

describe('coinsToGold', () => {
  it('converts small amounts', () => {
    const result = coinsToGold(34);
    expect(result).toEqual({ coins: 4, handfuls: 3, bags: 0, chests: 0 });
  });

  it('converts exact bag amount', () => {
    const result = coinsToGold(100);
    expect(result).toEqual({ coins: 0, handfuls: 0, bags: 1, chests: 0 });
  });

  it('converts large amounts', () => {
    const result = coinsToGold(1234);
    expect(result).toEqual({ coins: 4, handfuls: 3, bags: 2, chests: 1 });
  });

  it('handles zero', () => {
    const result = coinsToGold(0);
    expect(result).toEqual({ coins: 0, handfuls: 0, bags: 0, chests: 0 });
  });

  it('clamps negatives to zero', () => {
    const result = coinsToGold(-50);
    expect(result).toEqual({ coins: 0, handfuls: 0, bags: 0, chests: 0 });
  });
});

describe('costToHandfuls', () => {
  it('flattens a simple cost', () => {
    expect(costToHandfuls({ handfuls: 3, bags: 0, chests: 0 })).toBe(3);
  });

  it('flattens bags + handfuls', () => {
    expect(costToHandfuls({ handfuls: 5, bags: 2, chests: 0 })).toBe(25);
  });

  it('flattens all denominations', () => {
    expect(costToHandfuls({ handfuls: 1, bags: 2, chests: 1 })).toBe(121);
  });
});

describe('canAfford', () => {
  it('returns true when exact match', () => {
    expect(canAfford({ ...baseGold, handfuls: 5 }, 5)).toBe(true);
  });

  it('returns true when more than enough', () => {
    expect(canAfford({ ...baseGold, bags: 1 }, 5)).toBe(true);
  });

  it('returns false when insufficient', () => {
    expect(canAfford({ ...baseGold, handfuls: 2 }, 5)).toBe(false);
  });

  it('accounts for coins', () => {
    expect(canAfford({ ...baseGold, handfuls: 4, coins: 10 }, 5)).toBe(true);
  });

  it('zero price is always affordable', () => {
    expect(canAfford(baseGold, 0)).toBe(true);
  });
});

describe('subtractGold', () => {
  it('subtracts a simple amount', () => {
    const result = subtractGold({ ...baseGold, handfuls: 5 }, 3);
    expect(result).toBeDefined();
    expect(result!.handfuls).toBe(2);
    expect(result!.bags).toBe(0);
  });

  it('breaks larger denominations', () => {
    const result = subtractGold({ ...baseGold, bags: 1 }, 3);
    expect(result).toBeDefined();
    expect(result!.handfuls).toBe(7);
    expect(result!.bags).toBe(0);
  });

  it('preserves display preferences', () => {
    const gold = {
      ...baseGold,
      bags: 1,
      showCoins: true,
      displayDenomination: 'bags' as const,
    };
    const result = subtractGold(gold, 3);
    expect(result?.showCoins).toBe(true);
    expect(result?.displayDenomination).toBe('bags');
  });

  it('returns undefined when insufficient', () => {
    expect(subtractGold({ ...baseGold, handfuls: 2 }, 5)).toBeUndefined();
  });

  it('handles exact spend', () => {
    const result = subtractGold({ ...baseGold, handfuls: 5 }, 5);
    expect(result).toBeDefined();
    expect(goldToCoins(result!)).toBe(0);
  });
});

describe('formatGoldAmount', () => {
  it('formats handfuls', () => {
    expect(formatGoldAmount(3)).toBe('3 handfuls');
  });

  it('formats singular', () => {
    expect(formatGoldAmount(1)).toBe('1 handful');
  });

  it('formats bags and handfuls', () => {
    expect(formatGoldAmount(15)).toBe('1 bag, 5 handfuls');
  });

  it('formats chests', () => {
    expect(formatGoldAmount(100)).toBe('1 chest');
  });

  it('formats zero', () => {
    expect(formatGoldAmount(0)).toBe('0 handfuls');
  });

  it('formats complex amount', () => {
    expect(formatGoldAmount(123)).toBe('1 chest, 2 bags, 3 handfuls');
  });

  it('formats coins from decimal handfuls', () => {
    expect(formatGoldAmount(3.5)).toBe('3 handfuls, 5 coins');
  });

  it('formats coins only', () => {
    expect(formatGoldAmount(0.3)).toBe('3 coins');
  });
});

describe('handfulsToGoldParts', () => {
  it('breaks down a simple handful count', () => {
    expect(handfulsToGoldParts(5)).toEqual({
      handfuls: 5,
      bags: 0,
      chests: 0,
      coins: 0,
    });
  });

  it('normalizes into bags', () => {
    expect(handfulsToGoldParts(15)).toEqual({
      handfuls: 5,
      bags: 1,
      chests: 0,
      coins: 0,
    });
  });

  it('normalizes into chests', () => {
    expect(handfulsToGoldParts(123)).toEqual({
      handfuls: 3,
      bags: 2,
      chests: 1,
      coins: 0,
    });
  });

  it('handles zero', () => {
    expect(handfulsToGoldParts(0)).toEqual({
      handfuls: 0,
      bags: 0,
      chests: 0,
      coins: 0,
    });
  });

  it('clamps negatives', () => {
    expect(handfulsToGoldParts(-5)).toEqual({
      handfuls: 0,
      bags: 0,
      chests: 0,
      coins: 0,
    });
  });

  it('extracts coins from decimal handfuls', () => {
    expect(handfulsToGoldParts(3.5)).toEqual({
      handfuls: 3,
      bags: 0,
      chests: 0,
      coins: 5,
    });
  });

  it('extracts coins from complex decimal', () => {
    expect(handfulsToGoldParts(12.3)).toEqual({
      handfuls: 2,
      bags: 1,
      chests: 0,
      coins: 3,
    });
  });
});

describe('goldPartsToHandfuls', () => {
  it('converts handfuls only', () => {
    expect(goldPartsToHandfuls({ handfuls: 3 })).toBe(3);
  });

  it('converts bags + handfuls', () => {
    expect(goldPartsToHandfuls({ bags: 2, handfuls: 5 })).toBe(25);
  });

  it('converts all denominations', () => {
    expect(goldPartsToHandfuls({ chests: 1, bags: 2, handfuls: 3 })).toBe(123);
  });

  it('handles coins', () => {
    expect(goldPartsToHandfuls({ handfuls: 3, coins: 5 })).toBeCloseTo(3.5);
  });

  it('handles all denominations with coins', () => {
    expect(
      goldPartsToHandfuls({ chests: 1, bags: 2, handfuls: 3, coins: 7 })
    ).toBeCloseTo(123.7);
  });

  it('handles empty object', () => {
    expect(goldPartsToHandfuls({})).toBe(0);
  });
});
