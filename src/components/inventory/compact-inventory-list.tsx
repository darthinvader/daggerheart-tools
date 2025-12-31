import type { InventoryState } from '@/lib/schemas/equipment';

import { CompactItemCard } from './compact-item-card';
import {
  filterInventoryItems,
  groupItemsByLocation,
  hasActiveFilters,
} from './inventory-filter-utils';
import type { InventoryFilters } from './inventory-filters-panel';

interface CompactInventoryListProps {
  inventory: InventoryState;
  searchQuery?: string;
  filters?: InventoryFilters;
  onQuantityChange?: (id: string, delta: number) => void;
  onRemove?: (id: string) => void;
  onConvertToHomebrew?: (id: string) => void;
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
  filters,
  onQuantityChange,
  onRemove,
  onConvertToHomebrew,
  readOnly,
}: CompactInventoryListProps) {
  const filteredItems = filterInventoryItems(
    inventory.items,
    searchQuery,
    filters
  );
  const groupedByLocation = groupItemsByLocation(filteredItems);

  if (filteredItems.length === 0 && hasActiveFilters(searchQuery, filters)) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <span className="mb-2 text-4xl">🔍</span>
        <p className="text-muted-foreground text-sm">
          No items match your filters
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedByLocation).map(([location, items]) => (
        <LocationGroup
          key={location}
          location={location}
          items={items}
          unlimitedQuantity={inventory.unlimitedQuantity}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
          onConvertToHomebrew={onConvertToHomebrew}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}

interface LocationGroupProps {
  location: string;
  items: InventoryState['items'];
  unlimitedQuantity?: boolean;
  onQuantityChange?: (id: string, delta: number) => void;
  onRemove?: (id: string) => void;
  onConvertToHomebrew?: (id: string) => void;
  readOnly?: boolean;
}

function LocationGroup({
  location,
  items,
  unlimitedQuantity,
  onQuantityChange,
  onRemove,
  onConvertToHomebrew,
  readOnly,
}: LocationGroupProps) {
  return (
    <div>
      <h5 className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
        <span>{LOCATION_EMOJIS[location] ?? '📍'}</span>
        <span className="capitalize">{location}</span>
        <span className="text-muted-foreground">({items.length})</span>
      </h5>
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {items.map(entry => (
          <CompactItemCard
            key={entry.id}
            entry={entry}
            unlimitedQuantity={unlimitedQuantity}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
            onConvertToHomebrew={onConvertToHomebrew}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}
