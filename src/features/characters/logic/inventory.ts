import * as React from 'react';

import type { Inventory, InventorySlot, Item } from '@/lib/schemas/equipment';

// Player inventory should not be constrained by shop-facing maxQuantity values.
function clampQuantityPlayer(current: number) {
  return current;
}

export function addItemToSlots(
  slots: InventorySlot[] | undefined,
  item: Item
): InventorySlot[] {
  const list = [...(slots ?? [])];
  const idx = list.findIndex(s => s.item.name === item.name);
  if (idx >= 0) {
    const prev = list[idx];
    const nextQty = clampQuantityPlayer((prev.quantity ?? 1) + 1);
    list[idx] = { ...prev, quantity: nextQty };
    return list;
  }
  const newSlot: InventorySlot = {
    item,
    quantity: clampQuantityPlayer(1),
    isEquipped: false,
    location: 'backpack',
  };
  return [...list, newSlot];
}

export function incrementQuantity(
  slots: InventorySlot[],
  index: number,
  delta: number
): InventorySlot[] {
  const list = [...slots];
  const target = list[index];
  if (!target) return list;
  const base = (target.quantity ?? 1) + delta;
  const clamped = Math.max(0, clampQuantityPlayer(base));
  if (clamped <= 0) {
    list.splice(index, 1);
  } else {
    list[index] = { ...target, quantity: clamped };
  }
  return list;
}

export function removeAtIndex(slots: InventorySlot[], index: number) {
  return slots.filter((_, i) => i !== index);
}

export function setEquipped(
  slots: InventorySlot[],
  index: number,
  isEquipped: boolean
): InventorySlot[] {
  const list = [...slots];
  if (!list[index]) return list;
  list[index] = { ...list[index], isEquipped };
  return list;
}

export function setLocation(
  slots: InventorySlot[],
  index: number,
  location: InventorySlot['location']
): InventorySlot[] {
  const list = [...slots];
  if (!list[index]) return list;
  list[index] = { ...list[index], location };
  return list;
}

// Hook: compute derived inventory summary for cards/drawers without duplicating logic
export function useInventorySummary(inventory?: Inventory) {
  const slots = React.useMemo(() => inventory?.slots ?? [], [inventory?.slots]);

  const totalItems = React.useMemo(
    () => slots.reduce((sum, s) => sum + (s.quantity ?? 1), 0),
    [slots]
  );

  const isEquippedDerived = React.useCallback(
    (s: { isEquipped?: boolean; location?: unknown }) =>
      !!s.isEquipped || s.location === 'equipped',
    []
  );

  const equipped = React.useMemo(
    () => slots.filter(s => isEquippedDerived(s)),
    [slots, isEquippedDerived]
  );

  const remaining = React.useMemo(
    () => Math.max(0, (inventory?.maxItems ?? 0) - slots.length),
    [inventory?.maxItems, slots.length]
  );

  const counts = React.useMemo(() => {
    const acc = {
      utility: 0,
      consumables: 0,
      potions: 0,
      relics: 0,
      weaponMods: 0,
      armorMods: 0,
      recipes: 0,
    };
    const getString = (obj: unknown, key: 'category' | 'subcategory') => {
      if (typeof obj === 'object' && obj !== null) {
        const v = (obj as { category?: unknown; subcategory?: unknown })[key];
        return typeof v === 'string' ? v : undefined;
      }
      return undefined;
    };
    for (const s of slots) {
      const it = s.item as unknown;
      const cat = getString(it, 'category');
      if (cat === 'Utility') acc.utility += s.quantity ?? 1;
      else if (cat === 'Consumable') {
        if (getString(it, 'subcategory') === 'Potion')
          acc.potions += s.quantity ?? 1;
        else acc.consumables += s.quantity ?? 1;
      } else if (cat === 'Relic') acc.relics += s.quantity ?? 1;
      else if (cat === 'Weapon Modification') acc.weaponMods += s.quantity ?? 1;
      else if (cat === 'Armor Modification') acc.armorMods += s.quantity ?? 1;
      else if (cat === 'Recipe') acc.recipes += s.quantity ?? 1;
    }
    return acc;
  }, [slots]);

  const getEmoji = React.useCallback((s: unknown): string => {
    const cat = (s as { category?: string } | undefined)?.category;
    if (cat === 'Utility') return '🧰';
    if (cat === 'Consumable') return '🍽️';
    if (cat === 'Relic') return '🗿';
    if (cat === 'Weapon Modification') return '🛠️';
    if (cat === 'Armor Modification') return '🛡️';
    if (cat === 'Recipe') return '📜';
    return '🎒';
  }, []);

  return {
    slots,
    totalItems,
    isEquippedDerived,
    equipped,
    remaining,
    counts,
    getEmoji,
  };
}
