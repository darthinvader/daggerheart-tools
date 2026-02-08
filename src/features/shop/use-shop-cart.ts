import { useCallback, useState } from 'react';

import type { AnyItem } from '@/lib/schemas/equipment';

export interface CartEntry {
  item: AnyItem;
  quantity: number;
  unitPrice: number; // in handfuls
}

/**
 * Ephemeral cart state for the shop modal. Not persisted.
 */
export function useShopCart() {
  const [cart, setCart] = useState<Map<string, CartEntry>>(new Map());

  const addToCart = useCallback((item: AnyItem, unitPrice: number) => {
    setCart(prev => {
      const next = new Map(prev);
      const existing = next.get(item.name);
      if (existing) {
        next.set(item.name, { ...existing, quantity: existing.quantity + 1 });
      } else {
        next.set(item.name, { item, quantity: 1, unitPrice });
      }
      return next;
    });
  }, []);

  const removeFromCart = useCallback((itemName: string) => {
    setCart(prev => {
      const next = new Map(prev);
      next.delete(itemName);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((itemName: string, quantity: number) => {
    setCart(prev => {
      const next = new Map(prev);
      const existing = next.get(itemName);
      if (!existing) return prev;
      if (quantity <= 0) {
        next.delete(itemName);
      } else {
        next.set(itemName, { ...existing, quantity });
      }
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setCart(new Map()), []);

  const totalPrice = Array.from(cart.values()).reduce(
    (sum, entry) => sum + entry.unitPrice * entry.quantity,
    0
  );

  const totalItems = Array.from(cart.values()).reduce(
    (sum, entry) => sum + entry.quantity,
    0
  );

  const entries = Array.from(cart.values());

  return {
    cart,
    entries,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
  };
}
