import { EquipmentDisplay } from '@/components/equipment';
import { GoldDisplay } from '@/components/gold';
import { InventoryDisplay } from '@/components/inventory';

import type { TabProps } from '../demo-types';

export function ItemsTab({ state, handlers }: TabProps) {
  return (
    <div className="space-y-6 pt-4">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InventoryDisplay
            inventory={state.inventory}
            onChange={handlers.setInventory}
          />
        </div>
        <div className="space-y-6">
          <GoldDisplay
            gold={state.gold}
            onChange={handlers.setGold}
            compactMode
          />
          <EquipmentDisplay
            equipment={state.equipment}
            onChange={handlers.setEquipment}
            hideDialogHeader
          />
        </div>
      </div>
    </div>
  );
}
