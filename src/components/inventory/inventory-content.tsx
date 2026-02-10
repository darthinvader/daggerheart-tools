import { Package } from 'lucide-react';
import { useState } from 'react';

import { Separator } from '@/components/ui/separator';
import type { InventoryState } from '@/lib/schemas/equipment';

import { CompactInventoryList } from './compact-inventory-list';
import {
  type InventoryFilters,
  InventoryFiltersPanel,
} from './inventory-filters-panel';
import { InventoryToolbar } from './inventory-toolbar';

interface InventoryContentProps {
  inventory: InventoryState;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onQuantityChange?: (id: string, delta: number) => void;
  onRemove?: (id: string) => void;
  onConvertToHomebrew?: (id: string) => void;
  onEdit?: (id: string) => void;
  onUnlimitedQuantityChange?: (value: boolean) => void;
  onAddClick?: () => void;
  readOnly?: boolean;
  shopSlot?: React.ReactNode;
}

export function InventoryContent({
  inventory,
  searchQuery = '',
  onSearchChange,
  onQuantityChange,
  onRemove,
  onConvertToHomebrew,
  onEdit,
  onUnlimitedQuantityChange,
  onAddClick,
  readOnly,
  shopSlot,
}: InventoryContentProps) {
  const [filters, setFilters] = useState<InventoryFilters>({
    categories: [],
    rarities: [],
    tiers: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const hasItems = inventory.items.length > 0;

  const toggleFilter = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  const activeFilterCount =
    filters.categories.length + filters.rarities.length + filters.tiers.length;

  const clearFilters = () => {
    setFilters({ categories: [], rarities: [], tiers: [] });
    onSearchChange?.('');
  };

  return (
    <div className="space-y-4">
      <InventoryToolbar
        inventory={inventory}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onUnlimitedQuantityChange={onUnlimitedQuantityChange}
        onAddClick={onAddClick}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(v => !v)}
        activeFilterCount={activeFilterCount}
        onClearFilters={clearFilters}
        readOnly={readOnly}
        shopSlot={shopSlot}
      />

      {showFilters && hasItems && (
        <InventoryFiltersPanel
          filters={filters}
          onToggleCategory={c =>
            setFilters(f => ({
              ...f,
              categories: toggleFilter(f.categories, c),
            }))
          }
          onToggleRarity={r =>
            setFilters(f => ({ ...f, rarities: toggleFilter(f.rarities, r) }))
          }
          onToggleTier={t =>
            setFilters(f => ({ ...f, tiers: toggleFilter(f.tiers, t) }))
          }
        />
      )}

      {hasItems ? (
        <>
          <Separator />
          <CompactInventoryList
            inventory={inventory}
            searchQuery={searchQuery}
            filters={filters}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
            onConvertToHomebrew={onConvertToHomebrew}
            onEdit={onEdit}
            readOnly={readOnly}
          />
        </>
      ) : (
        <EmptyInventoryState />
      )}
    </div>
  );
}

function EmptyInventoryState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
      <Package className="text-muted-foreground mb-4 size-16 opacity-40" />
      <h3 className="mb-2 text-lg font-medium">No Items Yet</h3>
      <p className="text-muted-foreground max-w-sm text-sm">
        Your inventory is empty. Use the buttons above to add items from the
        catalog or create your own custom items!
      </p>
    </div>
  );
}
