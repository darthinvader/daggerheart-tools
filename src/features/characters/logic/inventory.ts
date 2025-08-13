import type { InventorySlot, Item } from '@/lib/schemas/equipment';

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
