import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { usePurchaseHandler } from '@/features/shop/use-purchase-handler';
import type { CartEntry } from '@/features/shop/use-shop-cart';
import type { Gold } from '@/lib/schemas/character-state';
import type { AnyItem, InventoryState } from '@/lib/schemas/equipment';

function makeGold(overrides: Partial<Gold> = {}): Gold {
  return {
    handfuls: 0,
    bags: 0,
    chests: 0,
    coins: 0,
    showCoins: false,
    displayDenomination: 'handfuls',
    ...overrides,
  };
}

function makeEntry(name: string, unitPrice: number, quantity = 1): CartEntry {
  return {
    item: {
      name,
      tier: '1',
      rarity: 'Common',
      features: [],
      type: 'Weapon',
      description: '',
    } as AnyItem,
    quantity,
    unitPrice,
  };
}

const emptyInventory: InventoryState = { items: [], maxSlots: 20 };

describe('usePurchaseHandler', () => {
  it('deducts gold and adds items on success', () => {
    const setGold = vi.fn();
    const setInventory = vi.fn();
    const pushUndo = vi.fn();

    const { result } = renderHook(() =>
      usePurchaseHandler({
        gold: makeGold({ handfuls: 10 }),
        inventory: emptyInventory,
        setGold,
        setInventory,
        pushUndo,
      })
    );

    let purchaseResult: { success: boolean; error?: string };
    act(() => {
      purchaseResult = result.current.purchase([makeEntry('Dagger', 3)]);
    });

    expect(purchaseResult!.success).toBe(true);
    expect(pushUndo).toHaveBeenCalledWith('Purchase 1 item');
    expect(setGold).toHaveBeenCalled();
    expect(setInventory).toHaveBeenCalled();

    // Gold should be reduced
    const newGold = setGold.mock.calls[0][0] as Gold;
    expect(newGold.handfuls).toBe(7);

    // Inventory should have 1 new item
    const newInventory = setInventory.mock.calls[0][0] as InventoryState;
    expect(newInventory.items).toHaveLength(1);
    expect(newInventory.items[0].item.name).toBe('Dagger');
  });

  it('fails when insufficient gold', () => {
    const setGold = vi.fn();
    const setInventory = vi.fn();
    const pushUndo = vi.fn();

    const { result } = renderHook(() =>
      usePurchaseHandler({
        gold: makeGold({ handfuls: 2 }),
        inventory: emptyInventory,
        setGold,
        setInventory,
        pushUndo,
      })
    );

    let purchaseResult: { success: boolean; error?: string };
    act(() => {
      purchaseResult = result.current.purchase([makeEntry('Dagger', 5)]);
    });

    expect(purchaseResult!.success).toBe(false);
    expect(purchaseResult!.error).toBe('Insufficient gold');
    expect(pushUndo).not.toHaveBeenCalled();
    expect(setGold).not.toHaveBeenCalled();
  });

  it('fails on empty cart', () => {
    const setGold = vi.fn();
    const setInventory = vi.fn();
    const pushUndo = vi.fn();

    const { result } = renderHook(() =>
      usePurchaseHandler({
        gold: makeGold({ handfuls: 10 }),
        inventory: emptyInventory,
        setGold,
        setInventory,
        pushUndo,
      })
    );

    let purchaseResult: { success: boolean; error?: string };
    act(() => {
      purchaseResult = result.current.purchase([]);
    });

    expect(purchaseResult!.success).toBe(false);
    expect(purchaseResult!.error).toBe('Cart is empty');
  });

  it('handles multiple items in one purchase', () => {
    const setGold = vi.fn();
    const setInventory = vi.fn();
    const pushUndo = vi.fn();

    const { result } = renderHook(() =>
      usePurchaseHandler({
        gold: makeGold({ bags: 1 }), // 10 handfuls
        inventory: emptyInventory,
        setGold,
        setInventory,
        pushUndo,
      })
    );

    act(() => {
      result.current.purchase([
        makeEntry('Dagger', 2, 2), // 2 × 2 = 4
        makeEntry('Shield', 3, 1), // 1 × 3 = 3
      ]);
    });

    expect(pushUndo).toHaveBeenCalledWith('Purchase 3 items');
    const newInventory = setInventory.mock.calls[0][0] as InventoryState;
    expect(newInventory.items).toHaveLength(3); // 2 daggers + 1 shield
  });

  it('calls onSuccess callback', () => {
    const onSuccess = vi.fn();

    const { result } = renderHook(() =>
      usePurchaseHandler({
        gold: makeGold({ handfuls: 10 }),
        inventory: emptyInventory,
        setGold: vi.fn(),
        setInventory: vi.fn(),
        pushUndo: vi.fn(),
        onSuccess,
      })
    );

    act(() => {
      result.current.purchase([makeEntry('Dagger', 1)]);
    });

    expect(onSuccess).toHaveBeenCalledOnce();
  });
});
