import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Folder, Package, Star } from '@/lib/icons';
import type { InventoryItemEntry } from '@/lib/schemas/equipment';

import { InventoryList } from './inventory-list';

interface InventoryTabsProps {
  items: InventoryItemEntry[];
  equippedItems: InventoryItemEntry[];
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, delta: number) => void;
  onEquipToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleActivated?: (id: string) => void;
  unlimitedQuantity?: boolean;
}

export function InventoryTabs({
  items,
  equippedItems,
  onRemove,
  onQuantityChange,
  onEquipToggle,
  onEdit,
  onToggleActivated,
  unlimitedQuantity = false,
}: InventoryTabsProps) {
  const safeItems = items ?? [];
  const safeEquipped = equippedItems ?? [];
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4 w-full justify-start">
        <TabsTrigger value="all" className="gap-1">
          <Package className="size-4" /> All ({safeItems.length})
        </TabsTrigger>
        <TabsTrigger value="equipped" className="gap-1">
          <Star className="size-4" /> Equipped ({safeEquipped.length})
        </TabsTrigger>
        <TabsTrigger value="category" className="gap-1">
          <Folder className="size-4" /> By Category
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <InventoryList
          items={safeItems}
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
          onEquipToggle={onEquipToggle}
          onEdit={onEdit}
          onToggleActivated={onToggleActivated}
          unlimitedQuantity={unlimitedQuantity}
        />
      </TabsContent>
      <TabsContent value="equipped">
        {safeEquipped.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No items equipped. Equip relics and modifications for passive
            bonuses!
          </p>
        ) : (
          <InventoryList
            items={safeEquipped}
            onRemove={onRemove}
            onQuantityChange={onQuantityChange}
            onEquipToggle={onEquipToggle}
            onEdit={onEdit}
            onToggleActivated={onToggleActivated}
            unlimitedQuantity={unlimitedQuantity}
          />
        )}
      </TabsContent>
      <TabsContent value="category">
        <InventoryList
          items={safeItems}
          groupByCategory
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
          onEquipToggle={onEquipToggle}
          onEdit={onEdit}
          onToggleActivated={onToggleActivated}
          unlimitedQuantity={unlimitedQuantity}
        />
      </TabsContent>
    </Tabs>
  );
}
