import { describe, expect, it } from 'vitest';

import {
  addItemToSlots,
  incrementQuantity,
  removeAtIndex,
  setEquipped,
  setLocation,
} from '../src/features/characters/logic/inventory';
import type { InventorySlot, Item } from '../src/lib/schemas/equipment';

const mkItem = (over: Partial<Item> = {}): Item => ({
  name: over.name ?? 'Test Item',
  tier: over.tier ?? '1',
  rarity: over.rarity ?? 'Common',
  description: over.description,
  features: over.features ?? [],
  tags: over.tags,
  metadata: over.metadata ?? {},
  isConsumable: over.isConsumable ?? false,
  maxQuantity: over.maxQuantity ?? 2,
  weight: over.weight,
  cost: over.cost,
});

describe('inventory logic', () => {
  it('adds a new item to empty slots', () => {
    const item = mkItem({ name: 'Apple', maxQuantity: 5 });
    const next = addItemToSlots(undefined as unknown as InventorySlot[], item);
    expect(next).toHaveLength(1);
    expect(next[0].item.name).toBe('Apple');
    expect(next[0].quantity).toBe(1);
  });

  it('merges quantity when item already exists', () => {
    const item = mkItem({ name: 'Apple', maxQuantity: 5 });
    const prev: InventorySlot[] = [
      { item, quantity: 1, isEquipped: false, location: 'backpack' },
    ];
    const next = addItemToSlots(prev, item);
    expect(next).toHaveLength(1);
    expect(next[0].quantity).toBe(2);
  });

  it('does not clamp quantity to maxQuantity when merging (shop-only cap ignored)', () => {
    const item = mkItem({ name: 'Apple', maxQuantity: 2 });
    const prev: InventorySlot[] = [
      { item, quantity: 2, isEquipped: false, location: 'backpack' },
    ];
    const next = addItemToSlots(prev, item);
    expect(next[0].quantity).toBe(3);
  });

  it('incrementQuantity ignores maxQuantity and removes at 0', () => {
    const item = mkItem({ name: 'Apple', maxQuantity: 2 });
    let slots: InventorySlot[] = [
      { item, quantity: 1, isEquipped: false, location: 'backpack' },
    ];
    slots = incrementQuantity(slots, 0, +1);
    expect(slots[0].quantity).toBe(2);
    slots = incrementQuantity(slots, 0, +1);
    expect(slots[0].quantity).toBe(3);
    slots = incrementQuantity(slots, 0, -3);
    expect(slots).toHaveLength(0);
  });

  it('removeAtIndex removes the correct slot', () => {
    const a = mkItem({ name: 'A' });
    const b = mkItem({ name: 'B' });
    const prev: InventorySlot[] = [
      { item: a, quantity: 1, isEquipped: false, location: 'backpack' },
      { item: b, quantity: 1, isEquipped: false, location: 'backpack' },
    ];
    const next = removeAtIndex(prev, 0);
    expect(next).toHaveLength(1);
    expect(next[0].item.name).toBe('B');
  });

  it('setEquipped updates the isEquipped flag immutably', () => {
    const item = mkItem({ name: 'Torch' });
    const prev: InventorySlot[] = [
      { item, quantity: 1, isEquipped: false, location: 'backpack' },
    ];
    const next = setEquipped(prev, 0, true);
    expect(prev[0].isEquipped).toBe(false);
    expect(next[0].isEquipped).toBe(true);
  });

  it('setLocation updates the location immutably', () => {
    const item = mkItem({ name: 'Rope' });
    const prev: InventorySlot[] = [
      { item, quantity: 1, isEquipped: false, location: 'backpack' },
    ];
    const next = setLocation(prev, 0, 'belt');
    expect(prev[0].location).toBe('backpack');
    expect(next[0].location).toBe('belt');
  });
});
