/**
 * Homebrew Content Filter Hook
 *
 * Encapsulates filtering, sorting, and grouping logic for homebrew content lists.
 * Extracts complexity from HomebrewList component.
 */
import { useCallback, useMemo, useState } from 'react';

import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';

import {
  applyAllFilters,
  getContentProp,
  sortItems,
} from './homebrew-filter-helpers';
import {
  CATEGORY_FILTER_CONFIG,
  type CategoryFilterConfig,
  getGroupConfigs,
  getItemGroupKey,
  type GroupConfig,
} from './homebrew-list-config';
import type { FilterState, SortOption } from './homebrew-list-toolbar';

const DEFAULT_FILTER_STATE: FilterState = {
  tier: 'all',
  role: 'all',
  domain: 'all',
  level: 'all',
  equipmentCategory: 'all',
};

interface UseHomebrewContentFilterOptions {
  items: HomebrewContent[];
  activeCategory: HomebrewContentType;
}

interface UseHomebrewContentFilterResult {
  search: string;
  setSearch: (value: string) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  filterState: FilterState;
  handleFilterChange: <K extends keyof FilterState>(
    key: K,
    value: string
  ) => void;
  resetFilters: () => void;
  categoryItems: HomebrewContent[];
  filteredCategoryItems: HomebrewContent[];
  groupedDisplayItems: Record<string, HomebrewContent[]>;
  orderedGroups: GroupConfig[];
  categoryFilters: CategoryFilterConfig;
  getContentProp: (
    item: HomebrewContent,
    prop: string
  ) => string | number | undefined;
}

/**
 * Hook for managing homebrew content filtering, sorting, and grouping.
 */
export function useHomebrewContentFilter({
  items,
  activeCategory,
}: UseHomebrewContentFilterOptions): UseHomebrewContentFilterResult {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [filterState, setFilterState] =
    useState<FilterState>(DEFAULT_FILTER_STATE);

  const handleFilterChange = useCallback(
    <K extends keyof FilterState>(key: K, value: string) => {
      setFilterState(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setSearch('');
    setFilterState(DEFAULT_FILTER_STATE);
  }, []);

  // Get items for current category
  const categoryItems = useMemo(() => {
    return items.filter(item => item.contentType === activeCategory);
  }, [items, activeCategory]);

  // Get category-specific filter options from config
  const categoryFilters = CATEGORY_FILTER_CONFIG[activeCategory] ?? {};

  // Apply filters and sorting using extracted helpers
  const filteredCategoryItems = useMemo(() => {
    const filtered = applyAllFilters(
      categoryItems,
      search,
      filterState,
      activeCategory
    );
    return sortItems(filtered, sortBy);
  }, [categoryItems, search, filterState, activeCategory, sortBy]);

  // Group items for display using config helper
  const groupedDisplayItems = useMemo((): Record<string, HomebrewContent[]> => {
    const groups: Record<string, HomebrewContent[]> = {};

    for (const item of filteredCategoryItems) {
      const groupKey = getItemGroupKey(item, activeCategory);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    }

    return groups;
  }, [filteredCategoryItems, activeCategory]);

  // Get ordered groups from config
  const orderedGroups = useMemo(() => {
    const configGroups = getGroupConfigs(activeCategory);

    if (configGroups) {
      return configGroups.filter(g => g.key in groupedDisplayItems);
    }

    // Alphabetical - generate from actual data
    const keys = Object.keys(groupedDisplayItems);
    return keys
      .sort((a, b) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)))
      .map(
        (letter): GroupConfig => ({
          key: letter,
          label: letter,
          colorClass: 'bg-muted/50',
        })
      );
  }, [activeCategory, groupedDisplayItems]);

  return {
    search,
    setSearch,
    sortBy,
    setSortBy,
    filterState,
    handleFilterChange,
    resetFilters,
    categoryItems,
    filteredCategoryItems,
    groupedDisplayItems,
    orderedGroups,
    categoryFilters,
    getContentProp,
  };
}
