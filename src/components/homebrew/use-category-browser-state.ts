/**
 * Hook for managing CategoryContentBrowser state
 * Consolidates category grouping, filtering, and state management
 */
import { useCallback, useMemo, useState } from 'react';

import {
  CATEGORY_CONFIGS,
  type ContentCategory,
  type ContentItem,
} from './category-content-browser';

// =====================================================================================
// Helper Functions
// =====================================================================================

/** Group items by their category */
function groupByCategory<T extends ContentItem>(
  items: T[]
): Record<ContentCategory, T[]> {
  const map = {} as Record<ContentCategory, T[]>;
  for (const item of items) {
    if (!map[item.category]) {
      map[item.category] = [];
    }
    map[item.category].push(item);
  }
  return map;
}

/** Filter items by search query */
function filterBySearch<T extends ContentItem>(
  items: T[],
  search: string
): T[] {
  if (!search.trim()) return items;
  const query = search.toLowerCase();
  return items.filter(
    item =>
      item.name.toLowerCase().includes(query) ||
      (item.searchText?.toLowerCase().includes(query) ?? false)
  );
}

/** Apply category-specific filters */
function applyFilters<T extends ContentItem>(
  items: T[],
  filterValues: Record<string, string>
): T[] {
  let result = items;
  for (const [key, value] of Object.entries(filterValues)) {
    if (value && value !== 'all') {
      result = result.filter(item => {
        switch (key) {
          case 'tier':
            return item.tier === value;
          case 'domain':
            return item.domain === value;
          case 'level':
            return String(item.level) === value;
          case 'role':
            return item.role === value;
          case 'equipmentCategory':
            return item.equipmentCategory === value;
          default:
            return true;
        }
      });
    }
  }
  return result;
}

// =====================================================================================
// Hook Types
// =====================================================================================

interface UseCategoryBrowserStateProps<T extends ContentItem> {
  items: T[];
  allowedCategories?: ContentCategory[];
  initialCategory?: ContentCategory;
}

// =====================================================================================
// Main Hook
// =====================================================================================

export function useCategoryBrowserState<T extends ContentItem>({
  items,
  allowedCategories,
  initialCategory,
}: UseCategoryBrowserStateProps<T>) {
  // Group items by category
  const itemsByCategory = useMemo(() => groupByCategory(items), [items]);

  // Determine which categories to show
  const visibleCategories = useMemo(() => {
    const categoriesWithItems = CATEGORY_CONFIGS.filter(
      c => (itemsByCategory[c.key]?.length ?? 0) > 0
    );
    if (allowedCategories) {
      return categoriesWithItems.filter(c => allowedCategories.includes(c.key));
    }
    return categoriesWithItems;
  }, [itemsByCategory, allowedCategories]);

  // State
  const [activeCategory, setActiveCategory] = useState<ContentCategory>(
    initialCategory ?? visibleCategories[0]?.key ?? 'adversary'
  );
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Get current category config
  const currentConfig = useMemo(
    () => CATEGORY_CONFIGS.find(c => c.key === activeCategory),
    [activeCategory]
  );

  // Get items for current category
  const categoryItems = useMemo(
    () => itemsByCategory[activeCategory] ?? [],
    [itemsByCategory, activeCategory]
  );

  // Apply filters using helper functions
  const filteredItems = useMemo(() => {
    const searched = filterBySearch(categoryItems, search);
    return applyFilters(searched, filterValues);
  }, [categoryItems, search, filterValues]);

  // Handle category change
  const handleCategoryChange = useCallback((category: ContentCategory) => {
    setActiveCategory(category);
    setSearch('');
    setFilterValues({});
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  }, []);

  // Get category count
  const getCategoryCount = useCallback(
    (category: ContentCategory) => itemsByCategory[category]?.length ?? 0,
    [itemsByCategory]
  );

  // Check if filters are active
  const hasActiveFilters =
    search || Object.values(filterValues).some(v => v && v !== 'all');

  return {
    // Categories
    visibleCategories,
    activeCategory,
    currentConfig,

    // Items
    filteredItems,

    // Search and filters
    search,
    setSearch,
    filterValues,
    hasActiveFilters,

    // Handlers
    handleCategoryChange,
    handleFilterChange,
    getCategoryCount,
  };
}
