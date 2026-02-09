import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';

import {
  Backpack,
  Dog,
  ICON_SIZE_MD,
  MapPin,
  PawPrint,
  Search,
  Sword,
} from '@/lib/icons';
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
  onEdit?: (id: string) => void;
  readOnly?: boolean;
}

const LOCATION_ICONS: Record<string, LucideIcon> = {
  backpack: Backpack,
  equipped: Sword,
  saddlebags: PawPrint,
  companion: Dog,
};

export function CompactInventoryList({
  inventory,
  searchQuery,
  filters,
  onQuantityChange,
  onRemove,
  onConvertToHomebrew,
  onEdit,
  readOnly,
}: CompactInventoryListProps) {
  const filteredItems = useMemo(
    () => filterInventoryItems(inventory.items, searchQuery, filters),
    [inventory.items, searchQuery, filters]
  );
  const groupedByLocation = useMemo(
    () => groupItemsByLocation(filteredItems),
    [filteredItems]
  );

  if (filteredItems.length === 0 && hasActiveFilters(searchQuery, filters)) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <Search size={40} className="mb-2" />
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
          onEdit={onEdit}
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
  onEdit?: (id: string) => void;
  readOnly?: boolean;
}

function LocationGroup({
  location,
  items,
  unlimitedQuantity,
  onQuantityChange,
  onRemove,
  onConvertToHomebrew,
  onEdit,
  readOnly,
}: LocationGroupProps) {
  const IconComponent = LOCATION_ICONS[location] ?? MapPin;
  return (
    <div>
      <h5 className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
        <IconComponent size={ICON_SIZE_MD} />
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
            onEdit={onEdit}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}
