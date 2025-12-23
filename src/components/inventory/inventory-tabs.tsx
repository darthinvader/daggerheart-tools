import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { InventoryItemEntry } from '@/lib/schemas/equipment';

import { InventoryList } from './inventory-list';

interface InventoryTabsProps {
  items: InventoryItemEntry[];
  equippedItems: InventoryItemEntry[];
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, delta: number) => void;
  onEquipToggle: (id: string) => void;
  onEdit: (id: string) => void;
  unlimitedQuantity?: boolean;
}

export function InventoryTabs({
  items,
  equippedItems,
  onRemove,
  onQuantityChange,
  onEquipToggle,
  onEdit,
  unlimitedQuantity = false,
}: InventoryTabsProps) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4 w-full justify-start">
        <TabsTrigger value="all">📦 All ({items.length})</TabsTrigger>
        <TabsTrigger value="equipped">
          ⭐ Equipped ({equippedItems.length})
        </TabsTrigger>
        <TabsTrigger value="category">📁 By Category</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <InventoryList
          items={items}
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
          onEquipToggle={onEquipToggle}
          onEdit={onEdit}
          unlimitedQuantity={unlimitedQuantity}
        />
      </TabsContent>
      <TabsContent value="equipped">
        {equippedItems.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No items equipped. Equip relics and modifications for passive
            bonuses!
          </p>
        ) : (
          <InventoryList
            items={equippedItems}
            onRemove={onRemove}
            onQuantityChange={onQuantityChange}
            onEquipToggle={onEquipToggle}
            onEdit={onEdit}
            unlimitedQuantity={unlimitedQuantity}
          />
        )}
      </TabsContent>
      <TabsContent value="category">
        <InventoryList
          items={items}
          groupByCategory
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
          onEquipToggle={onEquipToggle}
          onEdit={onEdit}
          unlimitedQuantity={unlimitedQuantity}
        />
      </TabsContent>
    </Tabs>
  );
}
