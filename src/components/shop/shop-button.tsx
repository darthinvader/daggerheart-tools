import { ShoppingCart } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { ShopSettings } from '@/lib/schemas/campaign';
import type { Gold } from '@/lib/schemas/character-state';
import type { InventoryState } from '@/lib/schemas/equipment';

const ShopModal = lazy(() =>
  import('./shop-modal').then(m => ({ default: m.ShopModal }))
);

interface ShopButtonProps {
  gold: Gold;
  setGold: (gold: Gold) => void;
  inventory: InventoryState;
  setInventory: (inventory: InventoryState) => void;
  pushUndo?: (label: string) => void;
  shopSettings?: ShopSettings;
  campaignName?: string;
}

export function ShopButton({
  gold,
  setGold,
  inventory,
  setInventory,
  pushUndo,
  shopSettings,
  campaignName,
}: ShopButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <ShoppingCart className="h-4 w-4" />
        Shop
      </Button>

      {open && (
        <Suspense fallback={null}>
          <ShopModal
            open={open}
            onOpenChange={setOpen}
            gold={gold}
            setGold={setGold}
            inventory={inventory}
            setInventory={setInventory}
            pushUndo={pushUndo}
            shopSettings={shopSettings}
            campaignName={campaignName}
          />
        </Suspense>
      )}
    </>
  );
}
