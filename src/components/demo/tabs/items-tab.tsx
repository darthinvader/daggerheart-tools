import { EquipmentDisplay } from '@/components/equipment';
import { GoldDisplay } from '@/components/gold';
import { InventoryDisplay } from '@/components/inventory';

import type { TabProps } from '../demo-types';

export function ItemsTab({ state, handlers }: TabProps) {
  return (
    <div className="space-y-4 pt-3 sm:space-y-6 sm:pt-4">
      {/* Gold Display */}
      <GoldDisplay gold={state.gold} onChange={handlers.setGold} />

      {/* Equipment Display */}
      <EquipmentDisplay
        equipment={state.equipment}
        onChange={handlers.setEquipment}
        hideDialogHeader
      />

      <div className="dagger-divider" />

      {/* Inventory Display */}
      <InventoryDisplay
        inventory={state.inventory}
        onChange={handlers.setInventory}
      />
    </div>
  );
}
