/**
 * Hook for managing category expand/collapse state in grid sections
 * Extracted to reduce component complexity
 */
import { useCallback, useMemo, useState } from 'react';

export function useCategoryExpandState(categoryKeys: string[]) {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() => Object.fromEntries(categoryKeys.map(k => [k, true])));

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  }, []);

  const expandAll = useCallback(() => {
    setExpandedCategories(prev =>
      Object.fromEntries(Object.keys(prev).map(k => [k, true]))
    );
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedCategories(prev =>
      Object.fromEntries(Object.keys(prev).map(k => [k, false]))
    );
  }, []);

  const allExpanded = useMemo(
    () => Object.values(expandedCategories).every(Boolean),
    [expandedCategories]
  );

  const allCollapsed = useMemo(
    () => Object.values(expandedCategories).every(v => !v),
    [expandedCategories]
  );

  const isCategoryExpanded = useCallback(
    (category: string) => expandedCategories[category] ?? true,
    [expandedCategories]
  );

  return {
    expandedCategories,
    toggleCategory,
    expandAll,
    collapseAll,
    allExpanded,
    allCollapsed,
    isCategoryExpanded,
  };
}
