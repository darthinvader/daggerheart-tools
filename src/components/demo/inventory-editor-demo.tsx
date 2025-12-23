import { useState } from 'react';

import { InventoryEditor, type InventoryState } from '@/components/inventory';

export function InventoryEditorDemo() {
  const [inventory, setInventory] = useState<InventoryState | undefined>(
    undefined
  );

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground text-sm">
        <p>
          Manage your character's inventory! Add items from the catalog or
          create custom homebrew items. Items can be filtered by category,
          rarity, and tier.
        </p>
        <p className="mt-1">
          🔧 Utility items • 🧪 Consumables • ✨ Relics • ⚔️ Weapon Mods • 🛡️
          Armor Mods • 📜 Recipes
        </p>
        <p className="mt-1">
          Relics and modifications can be equipped for passive bonuses!
        </p>
      </div>
      <InventoryEditor value={inventory} onChange={setInventory} />
    </div>
  );
}
