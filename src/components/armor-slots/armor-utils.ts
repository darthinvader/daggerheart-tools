import type { ArmorSlot, ArmorSlotsState, ArmorSlotState } from './types';

export function createArmorSlot(source: string): ArmorSlot {
  return {
    id: crypto.randomUUID(),
    state: 'available',
    source,
  };
}

export function getAvailableSlots(slots: ArmorSlot[]): ArmorSlot[] {
  return slots.filter(s => s.state === 'available');
}

export function getUsedSlots(slots: ArmorSlot[]): ArmorSlot[] {
  return slots.filter(s => s.state === 'used');
}

export function getDamagedSlots(slots: ArmorSlot[]): ArmorSlot[] {
  return slots.filter(s => s.state === 'damaged' || s.state === 'broken');
}

export function getCurrentArmor(state: ArmorSlotsState): number {
  return getAvailableSlots(state.slots).length;
}

export function getMaxArmor(state: ArmorSlotsState): number {
  return state.baseArmor + state.bonusArmor;
}

export function consumeArmorSlot(slots: ArmorSlot[]): ArmorSlot[] {
  const firstAvailable = slots.find(s => s.state === 'available');
  if (!firstAvailable) return slots;
  return slots.map(s =>
    s.id === firstAvailable.id ? { ...s, state: 'used' as ArmorSlotState } : s
  );
}

export function repairArmorSlot(slots: ArmorSlot[], id: string): ArmorSlot[] {
  return slots.map(s =>
    s.id === id && (s.state === 'used' || s.state === 'damaged')
      ? { ...s, state: 'available' as ArmorSlotState }
      : s
  );
}

export function repairAllArmor(slots: ArmorSlot[]): ArmorSlot[] {
  return slots.map(s =>
    s.state === 'used' || s.state === 'damaged'
      ? { ...s, state: 'available' as ArmorSlotState }
      : s
  );
}

export function damageArmorSlot(slots: ArmorSlot[], id: string): ArmorSlot[] {
  return slots.map(s =>
    s.id === id && s.state === 'used'
      ? { ...s, state: 'damaged' as ArmorSlotState }
      : s
  );
}

export function groupSlotsBySource(
  slots: ArmorSlot[]
): Map<string, ArmorSlot[]> {
  const groups = new Map<string, ArmorSlot[]>();
  for (const slot of slots) {
    const existing = groups.get(slot.source) ?? [];
    groups.set(slot.source, [...existing, slot]);
  }
  return groups;
}
