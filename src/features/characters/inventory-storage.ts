import { type Inventory } from '@/lib/schemas/equipment';

// Inventory (bag/slots)
export type InventoryDraft = Inventory;
export const DEFAULT_INVENTORY: InventoryDraft = {
  slots: [],
  maxItems: 50,
  weightCapacity: undefined,
  currentWeight: 0,
  trackWeight: false,
  metadata: {},
};
