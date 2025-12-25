import { useCallback, useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ALL_ARMOR_MODIFICATIONS,
  ALL_CONSUMABLES,
  ALL_RECIPES,
  ALL_RELICS,
  ALL_UTILITY_ITEMS,
  ALL_WEAPON_MODIFICATIONS,
} from '@/lib/data/equipment';
import type {
  AnyItem,
  EquipmentTier,
  InventoryItemEntry,
  Rarity,
} from '@/lib/schemas/equipment';
import { rankBy } from '@/utils/search/rank';

import type { ItemCategory } from './constants';
import { ItemFilters } from './item-filters';
import { ItemPickerGrid } from './item-picker-grid';
import { ItemSearchHeader } from './item-search-header';

interface ItemPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectItems: (items: AnyItem[]) => void;
  inventoryItems?: InventoryItemEntry[];
  unlimitedQuantity?: boolean;
}

const ALL_ITEMS: AnyItem[] = [
  ...ALL_UTILITY_ITEMS,
  ...ALL_CONSUMABLES,
  ...ALL_RELICS,
  ...ALL_WEAPON_MODIFICATIONS,
  ...ALL_ARMOR_MODIFICATIONS,
  ...ALL_RECIPES,
];

function useItemFilters(
  selectedCategories: ItemCategory[],
  selectedRarities: Rarity[],
  selectedTiers: EquipmentTier[],
  search: string
) {
  return useMemo(() => {
    let result = ALL_ITEMS;

    if (selectedCategories.length > 0) {
      result = result.filter(item =>
        selectedCategories.includes(
          (item as { category?: string }).category as ItemCategory
        )
      );
    }

    if (selectedRarities.length > 0) {
      result = result.filter(item =>
        selectedRarities.includes(item.rarity as Rarity)
      );
    }

    if (selectedTiers.length > 0) {
      result = result.filter(item =>
        selectedTiers.includes(item.tier as EquipmentTier)
      );
    }

    if (search.trim()) {
      result = rankBy(result, search, [
        'name',
        item => item.features?.map(f => f.name).join(' ') ?? '',
        item => item.features?.map(f => f.description).join(' ') ?? '',
      ]);
    }

    return result;
  }, [search, selectedCategories, selectedRarities, selectedTiers]);
}

function useItemSelection() {
  const [tempSelected, setTempSelected] = useState<
    Map<string, { item: AnyItem; quantity: number }>
  >(new Map());

  const toggleItem = (item: AnyItem) => {
    setTempSelected(prev => {
      const next = new Map(prev);
      if (next.has(item.name)) {
        next.delete(item.name);
      } else {
        next.set(item.name, { item, quantity: 1 });
      }
      return next;
    });
  };

  const handleQuantityChange = (
    item: AnyItem,
    delta: number,
    maxAllowed?: number
  ) => {
    setTempSelected(prev => {
      const next = new Map(prev);
      const existing = next.get(item.name);
      if (existing) {
        const limit = maxAllowed ?? item.maxQuantity;
        const newQty = Math.max(1, Math.min(limit, existing.quantity + delta));
        next.set(item.name, { ...existing, quantity: newQty });
      }
      return next;
    });
  };

  const reset = useCallback(() => setTempSelected(new Map()), []);

  const totalQuantity = Array.from(tempSelected.values()).reduce(
    (sum, s) => sum + s.quantity,
    0
  );

  const getItemsArray = (): AnyItem[] => {
    const items: AnyItem[] = [];
    tempSelected.forEach(({ item, quantity }) => {
      for (let i = 0; i < quantity; i++) items.push(item);
    });
    return items;
  };

  return {
    tempSelected,
    toggleItem,
    handleQuantityChange,
    totalQuantity,
    getItemsArray,
    reset,
  };
}

function PickerFooter({
  totalQuantity,
  onCancel,
  onConfirm,
  disabled,
}: {
  totalQuantity: number;
  onCancel: () => void;
  onConfirm: () => void;
  disabled: boolean;
}) {
  return (
    <div className="bg-background relative z-10 flex shrink-0 items-center justify-between gap-4 border-t pt-4">
      <span className="text-muted-foreground text-sm">
        {totalQuantity} items selected
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="touch-manipulation"
          onPointerUp={e => {
            e.preventDefault();
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="touch-manipulation"
          disabled={disabled}
          onPointerUp={e => {
            e.preventDefault();
            if (!disabled) onConfirm();
          }}
        >
          ✅ Add Items
        </Button>
      </div>
    </div>
  );
}

export function ItemPickerModal({
  open,
  onOpenChange,
  onSelectItems,
  inventoryItems = [],
  unlimitedQuantity = false,
}: ItemPickerModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>(
    []
  );
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<EquipmentTier[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const {
    tempSelected,
    toggleItem,
    handleQuantityChange,
    totalQuantity,
    getItemsArray,
    reset,
  } = useItemSelection();

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const filteredItems = useItemFilters(
    selectedCategories,
    selectedRarities,
    selectedTiers,
    search
  );

  const toggleArray = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRarities([]);
    setSelectedTiers([]);
    setSearch('');
  };

  const activeFilterCount =
    selectedCategories.length + selectedRarities.length + selectedTiers.length;

  const handleConfirm = () => {
    onSelectItems(getItemsArray());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[98vw] max-w-350 flex-col sm:max-w-350 lg:max-w-400">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🎒</span>
            Add Items to Inventory
            {totalQuantity > 0 && (
              <Badge className="ml-2 bg-green-500">
                {totalQuantity} selected
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Browse and select items to add to your inventory
          </DialogDescription>
        </DialogHeader>

        <div className="shrink-0 space-y-4">
          <ItemSearchHeader
            search={search}
            onSearchChange={setSearch}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(v => !v)}
            activeFilterCount={activeFilterCount}
            onClearFilters={clearFilters}
          />
          {showFilters && (
            <ItemFilters
              selectedCategories={selectedCategories}
              selectedRarities={selectedRarities}
              selectedTiers={selectedTiers}
              onToggleCategory={c =>
                setSelectedCategories(prev => toggleArray(prev, c))
              }
              onToggleRarity={r =>
                setSelectedRarities(prev => toggleArray(prev, r))
              }
              onToggleTier={t => setSelectedTiers(prev => toggleArray(prev, t))}
            />
          )}
        </div>

        <div className="mt-4 flex-1 touch-pan-y overflow-y-auto pr-2">
          <div className="text-muted-foreground mb-2 text-sm">
            {filteredItems.length} items found
          </div>
          <ItemPickerGrid
            items={filteredItems}
            selectedItems={tempSelected}
            onToggleItem={toggleItem}
            onQuantityChange={handleQuantityChange}
            inventoryItems={inventoryItems}
            unlimitedQuantity={unlimitedQuantity}
          />
        </div>

        <PickerFooter
          totalQuantity={totalQuantity}
          onCancel={() => onOpenChange(false)}
          onConfirm={handleConfirm}
          disabled={tempSelected.size === 0}
        />
      </DialogContent>
    </Dialog>
  );
}
