import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useShopCart } from '@/features/shop/use-shop-cart';
import type { AnyItem } from '@/lib/schemas/equipment';

function makeItem(name: string): AnyItem {
  return {
    name,
    tier: '1',
    rarity: 'Common',
    features: [],
    type: 'Weapon',
    description: '',
  } as AnyItem;
}

describe('useShopCart', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useShopCart());
    expect(result.current.entries).toHaveLength(0);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.totalItems).toBe(0);
  });

  it('adds items to cart', () => {
    const { result } = renderHook(() => useShopCart());
    act(() => result.current.addToCart(makeItem('Dagger'), 3));
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].quantity).toBe(1);
    expect(result.current.totalPrice).toBe(3);
  });

  it('increments quantity for duplicate adds', () => {
    const { result } = renderHook(() => useShopCart());
    act(() => {
      result.current.addToCart(makeItem('Dagger'), 3);
      result.current.addToCart(makeItem('Dagger'), 3);
    });
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].quantity).toBe(2);
    expect(result.current.totalPrice).toBe(6);
  });

  it('removes items from cart', () => {
    const { result } = renderHook(() => useShopCart());
    act(() => result.current.addToCart(makeItem('Dagger'), 3));
    act(() => result.current.removeFromCart('Dagger'));
    expect(result.current.entries).toHaveLength(0);
  });

  it('updates quantity', () => {
    const { result } = renderHook(() => useShopCart());
    act(() => result.current.addToCart(makeItem('Dagger'), 5));
    act(() => result.current.updateQuantity('Dagger', 4));
    expect(result.current.entries[0].quantity).toBe(4);
    expect(result.current.totalPrice).toBe(20);
  });

  it('removes entry when quantity set to 0', () => {
    const { result } = renderHook(() => useShopCart());
    act(() => result.current.addToCart(makeItem('Dagger'), 5));
    act(() => result.current.updateQuantity('Dagger', 0));
    expect(result.current.entries).toHaveLength(0);
  });

  it('clears entire cart', () => {
    const { result } = renderHook(() => useShopCart());
    act(() => {
      result.current.addToCart(makeItem('Dagger'), 3);
      result.current.addToCart(makeItem('Shield'), 5);
    });
    act(() => result.current.clearCart());
    expect(result.current.entries).toHaveLength(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('calculates totalItems across entries', () => {
    const { result } = renderHook(() => useShopCart());
    act(() => {
      result.current.addToCart(makeItem('Dagger'), 3);
      result.current.addToCart(makeItem('Shield'), 5);
      result.current.updateQuantity('Dagger', 3);
    });
    expect(result.current.totalItems).toBe(4); // 3 daggers + 1 shield
  });
});
