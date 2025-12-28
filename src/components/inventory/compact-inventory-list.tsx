import type {
  EquipmentTier,
  InventoryState,
  Rarity,
} from '@/lib/schemas/equipment';

import { CompactItemCard } from './compact-item-card';
import type { ItemCategory } from './constants';
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
  let filteredItems = inventory.items;

  if (searchQuery) {
    filteredItems = filteredItems.filter(entry =>
      entry.item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filters) {
    if (filters.categories.length > 0) {
      filteredItems = filteredItems.filter(entry => {
        const category = (entry.item as { category?: string })
          .category as ItemCategory;
        return filters.categories.includes(category);
      });
    }
    if (filters.rarities.length > 0) {
      filteredItems = filteredItems.filter(entry =>
        filters.rarities.includes(entry.item.rarity as Rarity)
      );
    }
    if (filters.tiers.length > 0) {
      filteredItems = filteredItems.filter(entry =>
        filters.tiers.includes(entry.item.tier as EquipmentTier)
      );
    }
  }

  const groupedByLocation = filteredItems.reduce<
    Record<string, typeof inventory.items>
  >((acc, item) => {
    const location = item.location ?? 'backpack';
    if (!acc[location]) acc[location] = [];
    acc[location].push(item);
    return acc;
  }, {});

  if (
    filteredItems.length === 0 &&
    (searchQuery ||
      (filters &&
        (filters.categories.length > 0 ||
          filters.rarities.length > 0 ||
          filters.tiers.length > 0)))
  ) {
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
      <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
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
