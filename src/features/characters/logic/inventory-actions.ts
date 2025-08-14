import * as React from 'react';

import type { InventoryDraft } from '@/features/characters/storage';
import { writeInventoryToStorage } from '@/features/characters/storage';

export type InventoryLocation =
  | 'backpack'
  | 'belt'
  | 'equipped'
  | 'stored'
  | (string & {});

export function useInventoryActions(
  id: string,
  setInventory: React.Dispatch<React.SetStateAction<InventoryDraft>>
) {
  const incQty = React.useCallback(
    (index: number, delta: number) => {
      setInventory(prev => {
        const slots = prev.slots ?? [];
        const list = [...slots];
        const cur = list[index];
        if (!cur) return prev;
        const next = Math.max(0, (cur.quantity ?? 1) + delta);
        if (next <= 0) {
          list.splice(index, 1);
        } else {
          list[index] = { ...cur, quantity: next };
        }
        const updated = { ...prev, slots: list } as InventoryDraft;
        writeInventoryToStorage(id, updated);
        return updated;
      });
    },
    [id, setInventory]
  );

  const setQty = React.useCallback(
    (index: number, value: number) => {
      setInventory(prev => {
        const slots = prev.slots ?? [];
        const list = [...slots];
        const cur = list[index];
        if (!cur) return prev;
        if (value <= 0) {
          list.splice(index, 1);
        } else {
          list[index] = { ...cur, quantity: value };
        }
        const updated = { ...prev, slots: list } as InventoryDraft;
        writeInventoryToStorage(id, updated);
        return updated;
      });
    },
    [id, setInventory]
  );

  const removeAt = React.useCallback(
    (index: number) => {
      setInventory(prev => {
        const list = (prev.slots ?? []).filter((_, i) => i !== index);
        const updated = { ...prev, slots: list } as InventoryDraft;
        writeInventoryToStorage(id, updated);
        return updated;
      });
    },
    [id, setInventory]
  );

  const setLocation = React.useCallback(
    (index: number, loc: InventoryLocation) => {
      setInventory(prev => {
        const list = [...(prev.slots ?? [])];
        if (!list[index]) return prev;
        list[index] = {
          ...list[index],
          location: loc,
          // Keep flags in sync so outside can equip/unequip items edited in the drawer
          isEquipped: loc === 'equipped',
        };
        const updated = { ...prev, slots: list } as InventoryDraft;
        writeInventoryToStorage(id, updated);
        return updated;
      });
    },
    [id, setInventory]
  );

  return { incQty, setQty, removeAt, setLocation };
}
