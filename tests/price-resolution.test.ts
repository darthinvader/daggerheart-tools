import { describe, expect, it } from 'vitest';

import { resolveItemPrice } from '@/features/shop/resolve-item-price';
import type { Item } from '@/lib/schemas/equipment';

/** Minimal item fixture with only required Item fields. */
function makeItem(overrides: Partial<Item> & { name: string }): Item {
  return {
    name: overrides.name,
    tier: overrides.tier ?? '1',
    rarity: overrides.rarity ?? 'Common',
    features: overrides.features ?? [],
    type: overrides.type ?? ('Weapon' as Item['type']),
    description: overrides.description ?? '',
    ...overrides,
  } as Item;
}

describe('resolveItemPrice', () => {
  it('returns heuristic estimate with no config', () => {
    const item = makeItem({ name: 'Dagger', tier: '1', rarity: 'Common' });
    const result = resolveItemPrice(item);
    expect(result.source).toBe('estimated');
    expect(result.handfuls).toBeGreaterThanOrEqual(0);
    expect(result.baseCost).toBeDefined();
  });

  it('uses itemPriceOverrides when present', () => {
    const item = makeItem({ name: 'Magic Sword' });
    const result = resolveItemPrice(item, {
      itemPriceOverrides: { 'Magic Sword': 42 },
    });
    expect(result.source).toBe('override');
    expect(result.handfuls).toBe(42);
  });

  it('override takes priority over multipliers', () => {
    const item = makeItem({ name: 'Dagger' });
    const result = resolveItemPrice(item, {
      itemPriceOverrides: { Dagger: 10 },
      priceMultiplier: 2,
    });
    expect(result.handfuls).toBe(10); // NOT doubled
    expect(result.source).toBe('override');
  });

  it('applies priceMultiplier to estimated cost', () => {
    const item = makeItem({ name: 'Spear', tier: '1', rarity: 'Common' });
    const base = resolveItemPrice(item);
    const doubled = resolveItemPrice(item, { priceMultiplier: 2 });
    // For common T1 items the base is small, doubling should give ~2×
    expect(doubled.handfuls).toBe(Math.max(0, Math.round(base.handfuls * 2)));
  });

  it('applies categoryMultiplier', () => {
    const item = makeItem({ name: 'Broadsword', tier: '2', rarity: 'Common' });
    (item as Item & { category?: string }).category = 'Weapon';
    const base = resolveItemPrice(item);
    const result = resolveItemPrice(item, {
      categoryMultipliers: { Weapon: 1.5 },
    });
    expect(result.handfuls).toBe(Math.max(0, Math.round(base.handfuls * 1.5)));
  });

  it('stacks category and price multipliers', () => {
    const item = makeItem({ name: 'Shield', tier: '2', rarity: 'Common' });
    (item as Item & { category?: string }).category = 'Armor';
    const base = resolveItemPrice(item);
    const result = resolveItemPrice(item, {
      priceMultiplier: 2,
      categoryMultipliers: { Armor: 1.5 },
    });
    expect(result.handfuls).toBe(
      Math.max(0, Math.round(base.handfuls * 1.5 * 2))
    );
  });

  it('clamps negative overrides to zero', () => {
    const item = makeItem({ name: 'Trash' });
    const result = resolveItemPrice(item, {
      itemPriceOverrides: { Trash: -5 },
    });
    expect(result.handfuls).toBe(0);
  });

  it('handles missing category gracefully', () => {
    const item = makeItem({ name: 'Mystery' });
    // No category set — should not crash
    const result = resolveItemPrice(item, {
      categoryMultipliers: { Weapon: 2 },
    });
    expect(result.source).toBe('estimated');
  });

  it('respects explicit item.cost field', () => {
    const item = makeItem({ name: 'Priced Item', cost: 7 } as Partial<Item> & {
      name: string;
    });
    const result = resolveItemPrice(item);
    // estimateItemCost should return normalizeHandfuls(7) = 7 handfuls
    expect(result.handfuls).toBe(7);
  });
});
