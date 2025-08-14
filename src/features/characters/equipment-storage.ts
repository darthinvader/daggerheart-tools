import {
  type EquipmentLoadout,
  EquipmentLoadoutSchema,
} from '@/lib/schemas/equipment';
import { characterKeys as keys, storage } from '@/lib/storage';

// Equipment (loadout): weapons, armor, items
export type EquipmentDraft = EquipmentLoadout;
export const DEFAULT_EQUIPMENT: EquipmentDraft = {
  primaryWeapon: undefined,
  secondaryWeapon: undefined,
  armor: undefined,
  items: [],
  consumables: {},
};
export function readEquipmentFromStorage(id: string): EquipmentDraft {
  const fallback = DEFAULT_EQUIPMENT;
  try {
    return storage.read(keys.equipment(id), fallback, EquipmentLoadoutSchema);
  } catch {
    return fallback;
  }
}
export function writeEquipmentToStorage(id: string, value: EquipmentDraft) {
  storage.write(keys.equipment(id), value);
}
