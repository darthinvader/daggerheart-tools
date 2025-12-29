import type {
  EquipmentTier,
  InventoryState,
  Rarity,
} from '@/lib/schemas/equipment';

import type { ItemCategory } from './constants';
import type { InventoryFilters } from './inventory-filters-panel';

type InventoryItem = InventoryState['items'][number];

function matchesSearch(item: InventoryItem, searchQuery: string): boolean {
  return item.item.name.toLowerCase().includes(searchQuery.toLowerCase());
}

function matchesCategoryFilter(
  item: InventoryItem,
  categories: ItemCategory[]
): boolean {
  if (categories.length === 0) return true;
  const category = (item.item as { category?: string })
    .category as ItemCategory;
  return categories.includes(category);
}

function matchesRarityFilter(item: InventoryItem, rarities: Rarity[]): boolean {
  if (rarities.length === 0) return true;
  return rarities.includes(item.item.rarity as Rarity);
}

function matchesTierFilter(
  item: InventoryItem,
  tiers: EquipmentTier[]
): boolean {
  if (tiers.length === 0) return true;
  return tiers.includes(item.item.tier as EquipmentTier);
}

export function filterInventoryItems(
  items: InventoryItem[],
  searchQuery?: string,
  filters?: InventoryFilters
): InventoryItem[] {
  let filteredItems = items;

  if (searchQuery) {
    filteredItems = filteredItems.filter(entry =>
      matchesSearch(entry, searchQuery)
    );
  }

  if (filters) {
    filteredItems = filteredItems
      .filter(entry => matchesCategoryFilter(entry, filters.categories))
      .filter(entry => matchesRarityFilter(entry, filters.rarities))
      .filter(entry => matchesTierFilter(entry, filters.tiers));
  }

  return filteredItems;
}

export function groupItemsByLocation(
  items: InventoryItem[]
): Record<string, InventoryItem[]> {
  return items.reduce<Record<string, InventoryItem[]>>((acc, item) => {
    const location = item.location ?? 'backpack';
    if (!acc[location]) acc[location] = [];
    acc[location].push(item);
    return acc;
  }, {});
}

export function hasActiveFilters(
  searchQuery?: string,
  filters?: InventoryFilters
): boolean {
  if (searchQuery) return true;
  if (!filters) return false;
  return (
    filters.categories.length > 0 ||
    filters.rarities.length > 0 ||
    filters.tiers.length > 0
  );
}
