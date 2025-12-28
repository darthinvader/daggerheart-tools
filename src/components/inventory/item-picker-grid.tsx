import type { AnyItem, InventoryItemEntry } from '@/lib/schemas/equipment';

import { PickerItemCard } from './picker-item-card';

interface ItemPickerGridProps {
  items: AnyItem[];
  selectedItems: Map<string, { item: AnyItem; quantity: number }>;
  onToggleItem: (item: AnyItem) => void;
  onQuantityChange: (item: AnyItem, delta: number, maxAllowed?: number) => void;
  inventoryItems?: InventoryItemEntry[];
  unlimitedQuantity?: boolean;
  onConvertToHomebrew?: (item: AnyItem) => void;
}

export function ItemPickerGrid({
  items,
  selectedItems,
  onToggleItem,
  onQuantityChange,
  inventoryItems = [],
  unlimitedQuantity = false,
  onConvertToHomebrew,
}: ItemPickerGridProps) {
  return (
    <div className="grid gap-2 pb-4 sm:grid-cols-2">
      {items.map(item => {
        const selectedEntry = selectedItems.get(item.name);
        const selected = !!selectedEntry;

        const inventoryEntry = inventoryItems.find(
          i => i.item.name === item.name
        );
        const currentQty = inventoryEntry?.quantity ?? 0;
        const isAtMax = !unlimitedQuantity && currentQty >= item.maxQuantity;
        const availableToAdd = unlimitedQuantity
          ? Infinity
          : item.maxQuantity - currentQty;

        return (
          <PickerItemCard
            key={item.name}
            item={item}
            selected={selected}
            selectedQuantity={selectedEntry?.quantity ?? 0}
            currentInventoryQty={currentQty}
            availableToAdd={availableToAdd}
            isAtMax={isAtMax}
            unlimitedQuantity={unlimitedQuantity}
            onToggle={() => onToggleItem(item)}
            onQuantityChange={delta =>
              onQuantityChange(item, delta, availableToAdd)
            }
            onConvertToHomebrew={
              onConvertToHomebrew ? () => onConvertToHomebrew(item) : undefined
            }
          />
        );
      })}
    </div>
  );
}
