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

// Helper to check equipped status
function isSlotEquipped(s: { isEquipped?: boolean; location?: unknown }) {
  return !!s.isEquipped || s.location === 'equipped';
}

// Helper to extract category string from item
function getItemCategory(item: unknown): string | undefined {
  if (typeof item === 'object' && item !== null) {
    const v = (item as { category?: unknown }).category;
    return typeof v === 'string' ? v : undefined;
  }
  return undefined;
}

// Helper to extract subcategory string from item
function getItemSubcategory(item: unknown): string | undefined {
  if (typeof item === 'object' && item !== null) {
    const v = (item as { subcategory?: unknown }).subcategory;
    return typeof v === 'string' ? v : undefined;
  }
  return undefined;
}

// Helper to compute category counts from slots
function computeCategoryCounts(slots: InventorySlot[]) {
  const acc = {
    utility: 0,
    consumables: 0,
    potions: 0,
    relics: 0,
    weaponMods: 0,
    armorMods: 0,
    recipes: 0,
  };
  for (const s of slots) {
    const cat = getItemCategory(s.item);
    const qty = s.quantity ?? 1;
    switch (cat) {
      case 'Utility':
        acc.utility += qty;
        break;
      case 'Consumable':
        if (getItemSubcategory(s.item) === 'Potion') acc.potions += qty;
        else acc.consumables += qty;
        break;
      case 'Relic':
        acc.relics += qty;
        break;
      case 'Weapon Modification':
        acc.weaponMods += qty;
        break;
      case 'Armor Modification':
        acc.armorMods += qty;
        break;
      case 'Recipe':
        acc.recipes += qty;
        break;
    }
  }
  return acc;
}

// Helper to get emoji for item category
function getCategoryEmoji(category: string | undefined): string {
  switch (category) {
    case 'Utility':
      return '🧰';
    case 'Consumable':
      return '🍽️';
    case 'Relic':
      return '🗿';
    case 'Weapon Modification':
      return '🛠️';
    case 'Armor Modification':
      return '🛡️';
    case 'Recipe':
      return '📜';
    default:
      return '🎒';
  }
}

// Hook: compute derived inventory summary for cards/drawers without duplicating logic
export function useInventorySummary(inventory?: Inventory) {
  const slots = React.useMemo(() => inventory?.slots ?? [], [inventory?.slots]);

  const totalItems = React.useMemo(
    () => slots.reduce((sum, s) => sum + (s.quantity ?? 1), 0),
    [slots]
  );

  const equipped = React.useMemo(
    () => slots.filter(s => isSlotEquipped(s)),
    [slots]
  );

  const isEquippedDerived = React.useCallback(
    (s: { isEquipped?: boolean; location?: unknown }) => isSlotEquipped(s),
    []
  );

  const remaining = React.useMemo(
    () => Math.max(0, (inventory?.maxItems ?? 0) - slots.length),
    [inventory?.maxItems, slots.length]
  );

  const counts = React.useMemo(() => computeCategoryCounts(slots), [slots]);

  const getEmoji = React.useCallback(
    (s: unknown) => getCategoryEmoji(getItemCategory(s)),
    []
  );

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
