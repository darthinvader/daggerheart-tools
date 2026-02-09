import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ALL_ARMOR_MODIFICATIONS,
  ALL_CONSUMABLES,
  ALL_RECIPES,
  ALL_RELICS,
  ALL_UTILITY_ITEMS,
  ALL_WEAPON_MODIFICATIONS,
} from '@/lib/data/equipment';
import type { AnyItem, EquipmentTier, Rarity } from '@/lib/schemas/equipment';
import { rankBy } from '@/utils/search/rank';

import type { ItemCategory } from './constants';

const ALL_ITEMS: AnyItem[] = [
  ...ALL_UTILITY_ITEMS,
  ...ALL_CONSUMABLES,
  ...ALL_RELICS,
  ...ALL_WEAPON_MODIFICATIONS,
  ...ALL_ARMOR_MODIFICATIONS,
  ...ALL_RECIPES,
];

// --- Pure helpers ---

function filterItems(
  items: AnyItem[],
  selectedCategories: ItemCategory[],
  selectedRarities: Rarity[],
  selectedTiers: EquipmentTier[],
  search: string,
  allowedTiers?: string[]
): AnyItem[] {
  let result = items;

  if (allowedTiers && allowedTiers.length > 0) {
    result = result.filter(item =>
      allowedTiers.includes(item.tier as EquipmentTier)
    );
  }

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
}

function computeTotalQuantity(
  selected: Map<string, { item: AnyItem; quantity: number }>
): number {
  let total = 0;
  for (const { quantity } of selected.values()) {
    total += quantity;
  }
  return total;
}

// --- Hooks ---

export function useItemFilters(
  selectedCategories: ItemCategory[],
  selectedRarities: Rarity[],
  selectedTiers: EquipmentTier[],
  search: string,
  allowedTiers?: string[]
) {
  return useMemo(
    () =>
      filterItems(
        ALL_ITEMS,
        selectedCategories,
        selectedRarities,
        selectedTiers,
        search,
        allowedTiers
      ),
    [search, selectedCategories, selectedRarities, selectedTiers, allowedTiers]
  );
}

export function useItemSelection(maxTotalSlots: number = Infinity) {
  const [tempSelected, setTempSelected] = useState<
    Map<string, { item: AnyItem; quantity: number }>
  >(new Map());

  const totalQuantity = computeTotalQuantity(tempSelected);

  const toggleItem = (item: AnyItem) => {
    setTempSelected(prev => {
      const next = new Map(prev);
      if (next.has(item.name)) {
        next.delete(item.name);
      } else if (computeTotalQuantity(prev) < maxTotalSlots) {
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
        const currentTotal = computeTotalQuantity(prev);
        const itemLimit = maxAllowed ?? item.maxQuantity;
        let newQty = existing.quantity + delta;
        newQty = Math.max(1, newQty);
        newQty = Math.min(itemLimit, newQty);
        if (delta > 0) {
          const slotsAvailable = maxTotalSlots - currentTotal;
          newQty = Math.min(newQty, existing.quantity + slotsAvailable);
        }
        next.set(item.name, { ...existing, quantity: newQty });
      }
      return next;
    });
  };

  const reset = useCallback(() => setTempSelected(new Map()), []);

  const getItemsArray = (): AnyItem[] =>
    Array.from(tempSelected.values()).flatMap(({ item, quantity }) =>
      Array.from({ length: quantity }, () => item)
    );

  return {
    tempSelected,
    toggleItem,
    handleQuantityChange,
    totalQuantity,
    getItemsArray,
    reset,
  };
}

interface FilterSelections {
  categories: ItemCategory[];
  rarities: Rarity[];
  tiers: EquipmentTier[];
}

const emptySelections = (tiers: EquipmentTier[] = []): FilterSelections => ({
  categories: [],
  rarities: [],
  tiers,
});

function toggleArray<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
}

export function usePickerFiltersState({
  initialTiers,
  lockTiers = false,
}: {
  initialTiers?: string[];
  lockTiers?: boolean;
} = {}) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [selections, setSelections] = useState<FilterSelections>(() =>
    emptySelections((initialTiers ?? []) as EquipmentTier[])
  );
  const [showFilters, setShowFilters] = useState(false);

  const toggleCategory = (c: ItemCategory) =>
    setSelections(prev => ({
      ...prev,
      categories: toggleArray(prev.categories, c),
    }));
  const toggleRarity = (r: Rarity) =>
    setSelections(prev => ({
      ...prev,
      rarities: toggleArray(prev.rarities, r),
    }));
  const toggleTier = (t: EquipmentTier) => {
    if (lockTiers) return;
    setSelections(prev => ({ ...prev, tiers: toggleArray(prev.tiers, t) }));
  };

  const clearFilters = () => {
    setSelections(
      emptySelections(
        lockTiers ? ((initialTiers ?? []) as EquipmentTier[]) : []
      )
    );
    setSearch('');
  };

  const activeFilterCount =
    selections.categories.length +
    selections.rarities.length +
    selections.tiers.length;

  return {
    search,
    deferredSearch,
    setSearch,
    selectedCategories: selections.categories,
    selectedRarities: selections.rarities,
    selectedTiers: selections.tiers,
    showFilters,
    setShowFilters,
    toggleCategory,
    toggleRarity,
    toggleTier,
    clearFilters,
    activeFilterCount,
    lockTiers,
  };
}

export function usePickerReset(open: boolean, reset: () => void) {
  // Store reset in a ref to avoid dependency on unstable callback references
  const resetRef = useRef(reset);

  // Update ref in effect to satisfy react-hooks/refs rule
  useEffect(() => {
    resetRef.current = reset;
  });

  useEffect(() => {
    if (open) resetRef.current();
  }, [open]);
}
