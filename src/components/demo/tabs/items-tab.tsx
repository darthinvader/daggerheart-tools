import { EquipmentDisplay } from '@/components/equipment';
import { GoldDisplay } from '@/components/gold';
import { InventoryDisplay } from '@/components/inventory';

import type { TabProps } from '../demo-types';

export function ItemsTab({ state, handlers }: TabProps) {
  return (
    <div className="space-y-6 pt-4">
      {/* Row 1: Gold Display (full width, matching overview) */}
      <GoldDisplay gold={state.gold} onChange={handlers.setGold} />

      {/* Row 2: Equipment Display (full width for more space) */}
      <EquipmentDisplay
        equipment={state.equipment}
        onChange={handlers.setEquipment}
        hideDialogHeader
      />

      {/* Row 3: Inventory Display (full width) */}
      <InventoryDisplay
        inventory={state.inventory}
        onChange={handlers.setInventory}
      />
    </div>
  );
}
