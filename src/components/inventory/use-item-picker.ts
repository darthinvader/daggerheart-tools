import { useCallback, useEffect, useMemo, useState } from 'react';

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

export function useItemFilters(
  selectedCategories: ItemCategory[],
  selectedRarities: Rarity[],
  selectedTiers: EquipmentTier[],
  search: string,
  allowedTiers?: string[]
) {
  return useMemo(() => {
    let result = ALL_ITEMS;

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
  }, [
    search,
    selectedCategories,
    selectedRarities,
    selectedTiers,
    allowedTiers,
  ]);
}

export function useItemSelection(maxTotalSlots: number = Infinity) {
  const [tempSelected, setTempSelected] = useState<
    Map<string, { item: AnyItem; quantity: number }>
  >(new Map());

  const totalQuantity = Array.from(tempSelected.values()).reduce(
    (sum, s) => sum + s.quantity,
    0
  );

  const toggleItem = (item: AnyItem) => {
    setTempSelected(prev => {
      const next = new Map(prev);
      if (next.has(item.name)) {
        next.delete(item.name);
      } else {
        const currentTotal = Array.from(prev.values()).reduce(
          (sum, s) => sum + s.quantity,
          0
        );
        if (currentTotal < maxTotalSlots) {
          next.set(item.name, { item, quantity: 1 });
        }
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
        const currentTotal = Array.from(prev.values()).reduce(
          (sum, s) => sum + s.quantity,
          0
        );
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

export function usePickerFiltersState({
  initialTiers,
  lockTiers = false,
}: {
  initialTiers?: string[];
  lockTiers?: boolean;
} = {}) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>(
    []
  );
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<EquipmentTier[]>(
    (initialTiers ?? []) as EquipmentTier[]
  );
  const [showFilters, setShowFilters] = useState(false);

  const toggleArray = <T>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  const toggleCategory = (c: ItemCategory) =>
    setSelectedCategories(prev => toggleArray(prev, c));
  const toggleRarity = (r: Rarity) =>
    setSelectedRarities(prev => toggleArray(prev, r));
  const toggleTier = (t: EquipmentTier) => {
    if (lockTiers) return;
    setSelectedTiers(prev => toggleArray(prev, t));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRarities([]);
    setSelectedTiers(
      lockTiers ? ((initialTiers ?? []) as EquipmentTier[]) : []
    );
    setSearch('');
  };

  const activeFilterCount =
    selectedCategories.length + selectedRarities.length + selectedTiers.length;

  return {
    search,
    setSearch,
    selectedCategories,
    selectedRarities,
    selectedTiers,
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
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);
}
