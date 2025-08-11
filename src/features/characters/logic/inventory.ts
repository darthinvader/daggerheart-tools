import type { InventorySlot, Item } from '@/lib/schemas/equipment';

function clampQuantity(current: number, maxQuantity?: number) {
  if (!maxQuantity || maxQuantity <= 0) return current; // treat missing/invalid as unlimited
  return Math.min(current, maxQuantity);
}

export function addItemToSlots(
  slots: InventorySlot[] | undefined,
  item: Item
): InventorySlot[] {
  const list = [...(slots ?? [])];
  const idx = list.findIndex(s => s.item.name === item.name);
  if (idx >= 0) {
    const prev = list[idx];
    const nextQty = clampQuantity((prev.quantity ?? 1) + 1, item.maxQuantity);
    list[idx] = { ...prev, quantity: nextQty };
    return list;
  }
  const newSlot: InventorySlot = {
    item,
    quantity: clampQuantity(1, item.maxQuantity),
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
  const clamped = Math.max(0, clampQuantity(base, target.item.maxQuantity));
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
