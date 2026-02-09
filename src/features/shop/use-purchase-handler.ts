import { useCallback } from 'react';

import type { Gold } from '@/lib/schemas/character-state';
import type { AnyItem, InventoryState } from '@/lib/schemas/equipment';
import { generateId } from '@/lib/utils';

import { subtractGold } from './gold-math';
import type { CartEntry } from './use-shop-cart';

interface UsePurchaseHandlerOptions {
  gold: Gold;
  inventory: InventoryState;
  setGold: (gold: Gold) => void;
  setInventory: (inventory: InventoryState) => void;
  /** Optional: call before mutations for compound undo. If omitted, each setter handles its own undo. */
  pushUndo?: (label: string) => void;
  onSuccess?: () => void;
}

export interface PurchaseResult {
  success: boolean;
  error?: string;
}

/**
 * Atomic purchase handler: pushes a single undo entry, deducts gold, adds items.
 */
export function usePurchaseHandler({
  gold,
  inventory,
  setGold,
  setInventory,
  pushUndo,
  onSuccess,
}: UsePurchaseHandlerOptions) {
  const purchase = useCallback(
    (entries: CartEntry[]): PurchaseResult => {
      if (entries.length === 0) {
        return { success: false, error: 'Cart is empty' };
      }

      const totalPrice = entries.reduce(
        (sum, e) => sum + e.unitPrice * e.quantity,
        0
      );

      const newGold = subtractGold(gold, totalPrice);
      if (!newGold) {
        return { success: false, error: 'Insufficient gold' };
      }

      // Count total items for undo label
      const totalItems = entries.reduce((sum, e) => sum + e.quantity, 0);

      // Single undo entry for the entire purchase (if pushUndo provided)
      pushUndo?.(`Purchase ${totalItems} item${totalItems > 1 ? 's' : ''}`);

      // Deduct gold
      setGold(newGold);

      // Add items to inventory
      const newItems = entries.flatMap(entry =>
        Array.from({ length: entry.quantity }, () =>
          createInventoryEntry(entry.item)
        )
      );

      setInventory({
        ...inventory,
        items: [...inventory.items, ...newItems],
      });

      onSuccess?.();
      return { success: true };
    },
    [gold, inventory, setGold, setInventory, pushUndo, onSuccess]
  );

  return { purchase };
}

function createInventoryEntry(item: AnyItem) {
  return {
    id: generateId(),
    item,
    quantity: 1,
    isEquipped: false,
    location: 'backpack' as const,
  };
}
