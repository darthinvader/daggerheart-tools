import * as React from 'react';

import type { FilterGroup } from './reference-filter';

/**
 * Hook to manage filter state for reference pages
 */
export function useFilterState(filterGroups: FilterGroup[]) {
  const [search, setSearch] = React.useState('');
  const [filters, setFilters] = React.useState<Record<string, Set<string>>>(
    () => {
      const initial: Record<string, Set<string>> = {};
      for (const group of filterGroups) {
        initial[group.id] = new Set();
      }
      return initial;
    }
  );

  const handleFilterChange = React.useCallback(
    (groupId: string, value: string, checked: boolean) => {
      setFilters(prev => {
        const newSet = new Set(prev[groupId]);
        if (checked) {
          newSet.add(value);
        } else {
          newSet.delete(value);
        }
        return { ...prev, [groupId]: newSet };
      });
    },
    []
  );

  const clearFilters = React.useCallback(() => {
    setSearch('');
    setFilters(prev => {
      const cleared: Record<string, Set<string>> = {};
      for (const key of Object.keys(prev)) {
        cleared[key] = new Set();
      }
      return cleared;
    });
  }, []);

  return {
    filterState: { search, filters },
    onSearchChange: setSearch,
    onFilterChange: handleFilterChange,
    onClearFilters: clearFilters,
  };
}
