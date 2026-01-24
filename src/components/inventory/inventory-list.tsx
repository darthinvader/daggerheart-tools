import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ICON_SIZE_MD, Package, Sword } from '@/lib/icons';
import type { InventoryItemEntry } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import { CATEGORY_CONFIG, type ItemCategory } from './constants';
import { InventoryItemCard } from './inventory-item-card';

interface ItemGridProps {
  items: InventoryItemEntry[];
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, delta: number) => void;
  onEquipToggle: (id: string) => void;
  onEdit: (id: string) => void;
  unlimitedQuantity?: boolean;
}

function ItemGrid({
  items,
  onRemove,
  onQuantityChange,
  onEquipToggle,
  onEdit,
  unlimitedQuantity,
}: ItemGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map(item => (
        <InventoryItemCard
          key={item.id}
          item={item}
          onRemove={() => onRemove(item.id)}
          onQuantityChange={(delta: number) => onQuantityChange(item.id, delta)}
          onEquipToggle={() => onEquipToggle(item.id)}
          onEdit={() => onEdit(item.id)}
          unlimitedQuantity={unlimitedQuantity}
        />
      ))}
    </div>
  );
}

function groupItemsByCategory(
  items: InventoryItemEntry[]
): Record<string, InventoryItemEntry[]> {
  const result: Record<string, InventoryItemEntry[]> = {};
  items.forEach(item => {
    const cat =
      ((item.item as { category?: string }).category as string) ?? 'Other';
    if (!result[cat]) result[cat] = [];
    result[cat].push(item);
  });
  return result;
}

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
  const safeItems = items ?? [];
  const gridProps = {
    onRemove,
    onQuantityChange,
    onEquipToggle,
    onEdit,
    unlimitedQuantity,
  };

  if (!groupByCategory) {
    return (
      <ScrollArea className="h-125">
        <div className="pr-4">
          <ItemGrid items={safeItems} {...gridProps} />
        </div>
      </ScrollArea>
    );
  }

  const equippedItems = safeItems.filter(i => i.isEquipped);
  const unequippedItems = safeItems.filter(i => !i.isEquipped);
  const itemsByCategory = groupItemsByCategory(unequippedItems);

  return (
    <ScrollArea className="h-125">
      <div className="space-y-6 pr-4">
        {equippedItems.length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
              <Sword size={ICON_SIZE_MD} />
              Equipped
              <Badge variant="secondary">{equippedItems.length}</Badge>
            </h3>
            <ItemGrid items={equippedItems} {...gridProps} />
          </div>
        )}
        {Object.entries(itemsByCategory).map(([category, catItems]) => {
          const catConfig = CATEGORY_CONFIG[category as ItemCategory];
          const IconComponent = catConfig?.icon ?? Package;
          return (
            <div key={category}>
              <h3
                className={cn(
                  'mb-3 flex items-center gap-2 text-sm font-semibold',
                  catConfig?.color ?? 'text-foreground'
                )}
              >
                <IconComponent size={ICON_SIZE_MD} />
                {category}
                <Badge variant="secondary">{catItems.length}</Badge>
              </h3>
              <ItemGrid items={catItems} {...gridProps} />
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
