import * as React from 'react';

import type { CategoryFilter } from '@/components/characters/inventory-drawer/inventory-filters-toolbar';
import type { LibraryItem } from '@/components/characters/inventory-drawer/library-results-list';
import {
  ALL_ARMOR_MODIFICATIONS,
  ALL_CONSUMABLES,
  ALL_POTIONS,
  ALL_RECIPES,
  ALL_RELICS,
  ALL_UTILITY_ITEMS,
  ALL_WEAPON_MODIFICATIONS,
} from '@/lib/data/equipment';
import { rankAdvanced, rankings } from '@/utils/search/rank';

export type UseInventoryLibraryState = {
  query: string;
  setQuery: (v: string) => void;
  category: CategoryFilter;
  setCategory: (v: CategoryFilter) => void;
  rarity: '' | 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  setRarity: (v: '' | 'Common' | 'Uncommon' | 'Rare' | 'Legendary') => void;
  tier: '' | '1' | '2' | '3' | '4';
  setTier: (v: '' | '1' | '2' | '3' | '4') => void;
};

export type UseInventoryLibraryResult = UseInventoryLibraryState & {
  items: LibraryItem[];
  results: LibraryItem[];
  getByName: (name: string) => LibraryItem | undefined;
};

// Centralizes library items merge/dedupe and filter/query state used by the Inventory drawer
export function useInventoryLibrary(): UseInventoryLibraryResult {
  type Rarity = '' | 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  type Tier = '' | '1' | '2' | '3' | '4';

  // Build and dedupe the library index by name across supported categories
  const items = React.useMemo(() => {
    const merged = [
      ...ALL_UTILITY_ITEMS,
      ...ALL_CONSUMABLES,
      ...ALL_POTIONS,
      ...ALL_RELICS,
      ...ALL_WEAPON_MODIFICATIONS,
      ...ALL_ARMOR_MODIFICATIONS,
      ...ALL_RECIPES,
    ] as LibraryItem[];
    const byName = new Map<string, LibraryItem>();
    for (const it of merged) {
      if (!byName.has(it.name)) byName.set(it.name, it);
    }
    return Array.from(byName.values());
  }, []);

  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<CategoryFilter>('');
  const [rarity, setRarity] = React.useState<Rarity>('');
  const [tier, setTier] = React.useState<Tier>('');

  const results = React.useMemo(() => {
    // Step 1: apply structural filters first (category, rarity, tier)
    const filtered = items.filter(i => {
      if (category) {
        const cat = (i as { category?: string }).category;
        if (category === 'Potion') {
          const potionish =
            (i as unknown as { potionType?: unknown; subcategory?: string })
              .potionType != null ||
            (i as unknown as { subcategory?: string }).subcategory === 'Potion';
          if (!potionish) return false;
        } else if (cat !== category) {
          return false;
        }
      }
      if (rarity && (i as { rarity?: string }).rarity !== rarity) return false;
      if (tier) {
        const rawTier = (i as { tier?: string | number | undefined }).tier;
        const itemTier =
          rawTier == null || rawTier === '' ? '' : String(Number(rawTier));
        if (itemTier !== tier) return false;
      }
      return true;
    });

    const q = query.trim();
    if (!q) return filtered;

    // Step 2: rank results using shared rank util (name primary, then description/tags)
    type Rankable = LibraryItem & {
      category?: string;
      rarity?: string;
      tier?: string | number;
      description?: string;
      tags?: string[];
    };
    return rankAdvanced<Rankable>(
      filtered as Rankable[],
      q,
      [
        { key: i => i.name, threshold: rankings.CONTAINS },
        i => i.category ?? '',
        i => i.rarity ?? '',
        i => String(i.tier ?? ''),
        i => i.description ?? '',
        i => (Array.isArray(i.tags) ? i.tags.join(' ') : ''),
      ],
      rankings.CONTAINS
    );
  }, [items, query, category, rarity, tier]);

  const getByName = React.useCallback(
    (name: string) => items.find(i => i.name === name),
    [items]
  );

  return {
    items,
    results,
    getByName,
    query,
    setQuery,
    category,
    setCategory,
    rarity,
    setRarity,
    tier,
    setTier,
  };
}
