import { useCallback } from 'react';

import type {
  ActiveEffect,
  InventoryItemEntry,
  Potion,
} from '@/lib/schemas/equipment';
import { createActiveEffectFromPotion } from '@/lib/schemas/equipment';

/**
 * Type guard to check if an item is a Potion.
 */
function isPotion(item: InventoryItemEntry['item']): item is Potion {
  return (
    'category' in item &&
    item.category === 'Consumable' &&
    'subcategory' in item &&
    (item as Potion).subcategory === 'Potion'
  );
}

export interface PotionConsumptionResult {
  effects: ActiveEffect[];
  inventory: InventoryItemEntry[];
}

export interface UsePotionConsumptionOptions {
  inventory: InventoryItemEntry[];
  effects: ActiveEffect[];
  sessionNumber?: number;
}

export interface UsePotionConsumptionReturn {
  /**
   * Consume a potion from inventory, creating an active effect.
   * Returns updated effects and inventory lists.
   */
  consumePotion: (potionEntry: InventoryItemEntry) => PotionConsumptionResult;
}

/**
 * Hook for handling potion consumption.
 * Creates active effects from potions and manages inventory quantity.
 */
export function usePotionConsumption({
  inventory,
  effects,
  sessionNumber,
}: UsePotionConsumptionOptions): UsePotionConsumptionReturn {
  const consumePotion = useCallback(
    (potionEntry: InventoryItemEntry): PotionConsumptionResult => {
      if (!isPotion(potionEntry.item)) {
        return { effects, inventory };
      }

      const newEffect = createActiveEffectFromPotion(
        potionEntry.item,
        sessionNumber
      );

      const newEffects = [...effects, newEffect];

      const newInventory =
        potionEntry.quantity <= 1
          ? inventory.filter(entry => entry.id !== potionEntry.id)
          : inventory.map(entry =>
              entry.id === potionEntry.id
                ? { ...entry, quantity: entry.quantity - 1 }
                : entry
            );

      return {
        effects: newEffects,
        inventory: newInventory,
      };
    },
    [inventory, effects, sessionNumber]
  );

  return { consumePotion };
}
