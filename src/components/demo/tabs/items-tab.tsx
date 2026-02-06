import { EquipmentDisplay } from '@/components/equipment';
import { GoldDisplay } from '@/components/gold';
import { InventoryDisplay } from '@/components/inventory';

import type { TabProps } from '../demo-types';

export function ItemsTab({ state, handlers }: TabProps) {
  return (
    <div className="space-y-4 pt-3 sm:space-y-6 sm:pt-4">
      {/* Gold Display */}
      <div className="animate-fade-up">
        <GoldDisplay gold={state.gold} onChange={handlers.setGold} />
      </div>

      {/* Equipment Display */}
      <div className="animate-fade-up stagger-1">
        <EquipmentDisplay
          equipment={state.equipment}
          onChange={handlers.setEquipment}
          hideDialogHeader
        />
      </div>

      <div className="dagger-divider" />

      {/* Inventory Display */}
      <div className="animate-fade-up stagger-2">
        <InventoryDisplay
          inventory={state.inventory}
          onChange={handlers.setInventory}
        />
      </div>
    </div>
  );
}
