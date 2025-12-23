import { Package, Plus, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface EmptyInventoryProps {
  onCustomClick: () => void;
  onAddClick: () => void;
}

export function EmptyInventory({
  onCustomClick,
  onAddClick,
}: EmptyInventoryProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Package className="text-muted-foreground mb-4 h-16 w-16 opacity-50" />
      <h3 className="mb-2 text-lg font-medium">Inventory Empty</h3>
      <p className="text-muted-foreground mb-4 max-w-sm text-sm">
        Your inventory is looking a bit empty! Add some items from the catalog
        or create your own custom items.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCustomClick}>
          <Sparkles className="mr-1 h-4 w-4" />
          Create Custom
        </Button>
        <Button onClick={onAddClick}>
          <Plus className="mr-1 h-4 w-4" />
          Browse Items
        </Button>
      </div>
    </div>
  );
}
