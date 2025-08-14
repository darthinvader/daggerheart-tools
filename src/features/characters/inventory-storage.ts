import { type Inventory, InventorySchema } from '@/lib/schemas/equipment';
import { characterKeys as keys, storage } from '@/lib/storage';

// Inventory (bag/slots)
export type InventoryDraft = Inventory;
export const DEFAULT_INVENTORY: InventoryDraft = {
  slots: [],
  maxItems: 50,
  weightCapacity: undefined,
  currentWeight: 0,
  metadata: {},
};
export function readInventoryFromStorage(id: string): InventoryDraft {
  const fallback = DEFAULT_INVENTORY;
  try {
    return storage.read(keys.inventory(id), fallback, InventorySchema);
  } catch {
    return fallback;
  }
}
export function writeInventoryToStorage(id: string, value: InventoryDraft) {
  storage.write(keys.inventory(id), value);
}
