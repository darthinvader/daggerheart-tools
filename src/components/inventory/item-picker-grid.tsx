import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
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
  /** Optional map of item name → formatted price label (used by shop) */
  priceMap?: Map<string, string>;
}

export function ItemPickerGrid({
  items,
  selectedItems,
  onToggleItem,
  onQuantityChange,
  inventoryItems = [],
  unlimitedQuantity = false,
  onConvertToHomebrew,
  priceMap,
}: ItemPickerGridProps) {
  const isMobile = useIsMobile();
  const columns = isMobile ? 1 : 2;
  const parentRef = useRef<HTMLDivElement>(null);

  const inventoryByName = useMemo(() => {
    const map = new Map<string, InventoryItemEntry>();
    for (const entry of inventoryItems) {
      map.set(entry.item.name, entry);
    }
    return map;
  }, [inventoryItems]);

  const rows = useMemo(() => {
    const result: AnyItem[][] = [];
    for (let i = 0; i < items.length; i += columns) {
      result.push(items.slice(i, i + columns));
    }
    return result;
  }, [items, columns]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
    measureElement: element => element.getBoundingClientRect().height,
  });

  return (
    <div ref={parentRef} className="h-full overflow-y-auto pb-4">
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            ref={virtualizer.measureElement}
            data-index={virtualRow.index}
            className="absolute top-0 left-0 grid w-full gap-2"
            style={{
              transform: `translateY(${virtualRow.start}px)`,
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {rows[virtualRow.index].map(item => {
              const selectedEntry = selectedItems.get(item.name);
              const selected = !!selectedEntry;

              const inventoryEntry = inventoryByName.get(item.name);
              const currentQty = inventoryEntry?.quantity ?? 0;
              const isAtMax =
                !unlimitedQuantity && currentQty >= item.maxQuantity;
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
                    onConvertToHomebrew
                      ? () => onConvertToHomebrew(item)
                      : undefined
                  }
                  priceLabel={priceMap?.get(item.name)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
