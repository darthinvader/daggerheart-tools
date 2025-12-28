import { Minus, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { InventoryState } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import { getItemEmoji } from './item-utils';

interface CompactInventoryListProps {
  inventory: InventoryState;
  searchQuery?: string;
  onQuantityChange?: (id: string, delta: number) => void;
  readOnly?: boolean;
}

const LOCATION_EMOJIS: Record<string, string> = {
  backpack: '🎒',
  equipped: '⚔️',
  saddlebags: '🐴',
  companion: '🐕',
};

export function CompactInventoryList({
  inventory,
  searchQuery,
  onQuantityChange,
  readOnly,
}: CompactInventoryListProps) {
  const filteredItems = searchQuery
    ? inventory.items.filter(entry =>
        entry.item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : inventory.items;

  const groupedByLocation = filteredItems.reduce<
    Record<string, typeof inventory.items>
  >((acc, item) => {
    const location = item.location ?? 'backpack';
    if (!acc[location]) acc[location] = [];
    acc[location].push(item);
    return acc;
  }, {});

  if (filteredItems.length === 0 && searchQuery) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        No items match &quot;{searchQuery}&quot;
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedByLocation).map(([location, items]) => (
        <LocationGroup
          key={location}
          location={location}
          items={items}
          onQuantityChange={onQuantityChange}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}

interface LocationGroupProps {
  location: string;
  items: InventoryState['items'];
  onQuantityChange?: (id: string, delta: number) => void;
  readOnly?: boolean;
}

function LocationGroup({
  location,
  items,
  onQuantityChange,
  readOnly,
}: LocationGroupProps) {
  return (
    <div>
      <h5 className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
        <span>{LOCATION_EMOJIS[location] ?? '📍'}</span>
        <span className="capitalize">{location}</span>
        <span className="text-muted-foreground">({items.length})</span>
      </h5>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(entry => (
          <InventoryItemCard
            key={entry.id}
            entry={entry}
            onQuantityChange={onQuantityChange}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}

interface InventoryItemCardProps {
  entry: InventoryState['items'][number];
  onQuantityChange?: (id: string, delta: number) => void;
  readOnly?: boolean;
}

function InventoryItemCard({
  entry,
  onQuantityChange,
  readOnly,
}: InventoryItemCardProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border p-3',
        entry.isEquipped &&
          'border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/20',
        entry.isCustom &&
          'border-purple-300 bg-purple-50/50 dark:border-purple-700 dark:bg-purple-900/20'
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{getItemEmoji(entry.item)}</span>
        <div>
          <p className="text-sm font-medium">{entry.item.name}</p>
          <p className="text-muted-foreground text-xs">×{entry.quantity}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {!readOnly && onQuantityChange && (
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => onQuantityChange(entry.id, -1)}
              disabled={entry.quantity <= 1}
            >
              <Minus className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => onQuantityChange(entry.id, 1)}
            >
              <Plus className="size-3" />
            </Button>
          </div>
        )}
        {entry.isEquipped && (
          <Badge variant="secondary" className="text-xs">
            ⚔️
          </Badge>
        )}
        {entry.isCustom && (
          <Badge variant="secondary" className="text-xs">
            ✨
          </Badge>
        )}
      </div>
    </div>
  );
}
