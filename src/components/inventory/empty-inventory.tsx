import { Package, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface EmptyInventoryProps {
  onAddClick: () => void;
}

export function EmptyInventory({ onAddClick }: EmptyInventoryProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Package className="text-muted-foreground mb-4 h-16 w-16 opacity-50" />
      <h3 className="mb-2 text-lg font-medium">Inventory Empty</h3>
      <p className="text-muted-foreground mb-4 max-w-sm text-sm">
        Your inventory is looking a bit empty! Add some items from the catalog
        or create your own custom items.
      </p>
      <Button onClick={onAddClick}>
        <Plus className="mr-1 h-4 w-4" />
        Add Items
      </Button>
    </div>
  );
}
