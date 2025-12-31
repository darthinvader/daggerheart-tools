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
  const safeItems = items ?? [];
  const safeEquipped = equippedItems ?? [];
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4 w-full justify-start">
        <TabsTrigger value="all">📦 All ({safeItems.length})</TabsTrigger>
        <TabsTrigger value="equipped">
          ⭐ Equipped ({safeEquipped.length})
        </TabsTrigger>
        <TabsTrigger value="category">📁 By Category</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <InventoryList
          items={safeItems}
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
          onEquipToggle={onEquipToggle}
          onEdit={onEdit}
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
          unlimitedQuantity={unlimitedQuantity}
        />
      </TabsContent>
    </Tabs>
  );
}
