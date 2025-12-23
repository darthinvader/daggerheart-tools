import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { InventoryItemEntry } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import { CATEGORY_CONFIG, type ItemCategory } from './constants';
import { InventoryItemCard } from './inventory-item-card';

interface InventoryListProps {
  items: InventoryItemEntry[];
  groupByCategory?: boolean;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, delta: number) => void;
  onEquipToggle: (id: string) => void;
  onEdit: (id: string) => void;
  unlimitedQuantity?: boolean;
}

export function InventoryList({
  items,
  groupByCategory = false,
  onRemove,
  onQuantityChange,
  onEquipToggle,
  onEdit,
  unlimitedQuantity = false,
}: InventoryListProps) {
  if (!groupByCategory) {
    return (
      <ScrollArea className="h-125">
        <div className="grid gap-4 pr-4 sm:grid-cols-2">
          {items.map(item => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onRemove={() => onRemove(item.id)}
              onQuantityChange={(delta: number) =>
                onQuantityChange(item.id, delta)
              }
              onEquipToggle={() => onEquipToggle(item.id)}
              onEdit={() => onEdit(item.id)}
              unlimitedQuantity={unlimitedQuantity}
            />
          ))}
        </div>
      </ScrollArea>
    );
  }

  const equippedItems = items.filter(i => i.isEquipped);
  const unequippedItems = items.filter(i => !i.isEquipped);

  const itemsByCategory: Record<string, InventoryItemEntry[]> = {};
  unequippedItems.forEach(item => {
    const cat =
      ((item.item as { category?: string }).category as string) ?? 'Other';
    if (!itemsByCategory[cat]) itemsByCategory[cat] = [];
    itemsByCategory[cat].push(item);
  });

  return (
    <ScrollArea className="h-125">
      <div className="space-y-6 pr-4">
        {equippedItems.length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
              <span>⚔️</span>
              Equipped
              <Badge variant="secondary">{equippedItems.length}</Badge>
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {equippedItems.map(item => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onRemove={() => onRemove(item.id)}
                  onQuantityChange={(delta: number) =>
                    onQuantityChange(item.id, delta)
                  }
                  onEquipToggle={() => onEquipToggle(item.id)}
                  onEdit={() => onEdit(item.id)}
                  unlimitedQuantity={unlimitedQuantity}
                />
              ))}
            </div>
          </div>
        )}
        {Object.entries(itemsByCategory).map(([category, catItems]) => {
          const catConfig = CATEGORY_CONFIG[category as ItemCategory];
          return (
            <div key={category}>
              <h3
                className={cn(
                  'mb-3 flex items-center gap-2 text-sm font-semibold',
                  catConfig?.color ?? 'text-foreground'
                )}
              >
                <span>{catConfig?.emoji ?? '📦'}</span>
                {category}
                <Badge variant="secondary">{catItems.length}</Badge>
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {catItems.map(item => (
                  <InventoryItemCard
                    key={item.id}
                    item={item}
                    onRemove={() => onRemove(item.id)}
                    onQuantityChange={(delta: number) =>
                      onQuantityChange(item.id, delta)
                    }
                    onEquipToggle={() => onEquipToggle(item.id)}
                    onEdit={() => onEdit(item.id)}
                    unlimitedQuantity={unlimitedQuantity}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
