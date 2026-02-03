/**
 * Hook for managing official content browser filter state
 *
 * Extracts filter, search, and grouping logic from OfficialContentBrowser
 * to reduce component complexity.
 */
import { useCallback, useMemo, useState } from 'react';

import {
  CATEGORY_FILTER_CONFIG,
  getGroupConfigs,
  getOfficialItemGroupKey,
  type GroupConfig,
} from './homebrew-list-config';

export type OfficialContentType =
  | 'all'
  | 'adversary'
  | 'environment'
  | 'class'
  | 'subclass'
  | 'ancestry'
  | 'community'
  | 'domain_card'
  | 'equipment'
  | 'item';

export interface OfficialItem {
  id: string;
  name: string;
  type: OfficialContentType;
  description?: string;
  tier?: string;
  role?: string;
  domain?: string;
  level?: number;
  category?: string;
  difficulty?: number;
  rawData?: unknown;
}

interface FilterState {
  searchQuery: string;
  tierFilter: string;
  roleFilter: string;
  domainFilter: string;
  levelFilter: string;
  equipmentCategoryFilter: string;
  activeCategory: OfficialContentType;
}

/**
 * Pure function to apply all filters to items.
 * Extracted to reduce useMemo complexity.
 */
function applyFilters(
  items: OfficialItem[],
  filters: FilterState
): OfficialItem[] {
  const {
    searchQuery,
    tierFilter,
    roleFilter,
    domainFilter,
    levelFilter,
    equipmentCategoryFilter,
    activeCategory,
  } = filters;
  let result = items;

  // Apply search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
  }

  // Apply tier filter
  if (tierFilter !== 'all') {
    result = result.filter(item => item.tier === tierFilter);
  }

  // Apply role filter (adversaries)
  if (roleFilter !== 'all' && activeCategory === 'adversary') {
    result = result.filter(item => item.role === roleFilter);
  }

  // Apply domain filter (domain cards)
  if (domainFilter !== 'all' && activeCategory === 'domain_card') {
    result = result.filter(item => item.domain === domainFilter);
  }

  // Apply level filter (domain cards)
  if (levelFilter !== 'all' && activeCategory === 'domain_card') {
    result = result.filter(item => String(item.level) === levelFilter);
  }

  // Apply equipment category filter
  if (equipmentCategoryFilter !== 'all' && activeCategory === 'equipment') {
    result = result.filter(item => {
      const cat = item.category ?? 'Primary Weapon';
      if (cat === 'Weapon') {
        const rawData = item.rawData as { type?: string } | undefined;
        const actualCat =
          rawData?.type === 'Secondary' ? 'Secondary Weapon' : 'Primary Weapon';
        return actualCat === equipmentCategoryFilter;
      }
      return cat === equipmentCategoryFilter;
    });
  }

  return result;
}

/**
 * Pure function to group items and get ordered groups.
 */
function groupItems(
  items: OfficialItem[],
  activeCategory: OfficialContentType
): { groups: Map<string, OfficialItem[]>; orderedGroups: GroupConfig[] } {
  const groups = new Map<string, OfficialItem[]>();

  for (const item of items) {
    const groupKey = getOfficialItemGroupKey(item, activeCategory);
    const existing = groups.get(groupKey) ?? [];
    existing.push(item);
    groups.set(groupKey, existing);
  }

  // Sort items within each group
  for (const [key, groupItems] of groups) {
    groups.set(
      key,
      groupItems.sort((a, b) => a.name.localeCompare(b.name))
    );
  }

  // Handle 'all' category or non-standard categories
  if (
    activeCategory === 'all' ||
    activeCategory === 'subclass' ||
    activeCategory === 'ancestry' ||
    activeCategory === 'community' ||
    activeCategory === 'class'
  ) {
    const orderedGroups = Array.from(groups.keys())
      .sort((a, b) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)))
      .map(
        (letter): GroupConfig => ({
          key: letter,
          label: letter,
          colorClass: 'bg-muted/50',
        })
      );
    return { groups, orderedGroups };
  }

  // Use shared config for standard categories
  const configGroups = getGroupConfigs(
    activeCategory as
      | 'adversary'
      | 'environment'
      | 'domain_card'
      | 'equipment'
      | 'item'
  );
  if (configGroups) {
    const orderedGroups = configGroups.filter(g => groups.has(g.key));
    return { groups, orderedGroups };
  }

  // Fallback to alphabetical
  const orderedGroups = Array.from(groups.keys())
    .sort((a, b) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)))
    .map(
      (letter): GroupConfig => ({
        key: letter,
        label: letter,
        colorClass: 'bg-muted/50',
      })
    );
  return { groups, orderedGroups };
}

interface UseOfficialContentFilterParams {
  allItems: OfficialItem[];
}

export function useOfficialContentFilter({
  allItems,
}: UseOfficialContentFilterParams) {
  // Category tab state
  const [activeCategory, setActiveCategory] =
    useState<OfficialContentType>('adversary');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [tierFilter, setTierFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [equipmentCategoryFilter, setEquipmentCategoryFilter] = useState('all');

  // Reset filters when category changes
  const handleCategoryChange = useCallback((type: OfficialContentType) => {
    setActiveCategory(type);
    setSearchQuery('');
    setTierFilter('all');
    setRoleFilter('all');
    setDomainFilter('all');
    setLevelFilter('all');
    setEquipmentCategoryFilter('all');
  }, []);

  // Get items for current category
  const categoryItems = useMemo(() => {
    return allItems.filter(item => item.type === activeCategory);
  }, [allItems, activeCategory]);

  // Get category-specific filter options from shared config
  const categoryFilters = useMemo(() => {
    return activeCategory !== 'all'
      ? (CATEGORY_FILTER_CONFIG[activeCategory] ?? {})
      : {};
  }, [activeCategory]);

  // Apply category-specific filters using extracted pure function
  const filteredCategoryItems = useMemo(() => {
    return applyFilters(categoryItems, {
      searchQuery,
      tierFilter,
      roleFilter,
      domainFilter,
      levelFilter,
      equipmentCategoryFilter,
      activeCategory,
    });
  }, [
    categoryItems,
    searchQuery,
    tierFilter,
    roleFilter,
    domainFilter,
    levelFilter,
    equipmentCategoryFilter,
    activeCategory,
  ]);

  // Group items and get ordered groups using extracted pure function
  const { groups: groupedDisplayItems, orderedGroups } = useMemo(() => {
    return groupItems(filteredCategoryItems, activeCategory);
  }, [filteredCategoryItems, activeCategory]);

  return {
    // Category state
    activeCategory,
    handleCategoryChange,

    // Search
    searchQuery,
    setSearchQuery,

    // Filter states
    tierFilter,
    setTierFilter,
    roleFilter,
    setRoleFilter,
    domainFilter,
    setDomainFilter,
    levelFilter,
    setLevelFilter,
    equipmentCategoryFilter,
    setEquipmentCategoryFilter,

    // Derived data
    categoryFilters,
    filteredCategoryItems,
    groupedDisplayItems,
    orderedGroups,
  };
}
