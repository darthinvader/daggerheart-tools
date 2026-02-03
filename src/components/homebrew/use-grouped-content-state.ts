/**
 * Hook for managing grouped content state including scroll tracking and group navigation
 * Extracted from GroupedContentGrid to reduce complexity
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { GroupConfig } from './grouped-content-grid';

export const INITIAL_LIMIT = 50;

interface UseGroupedContentStateOptions<T> {
  items: T[];
  getGroupKey: (item: T) => string;
  getName: (item: T) => string;
  groupConfigs: GroupConfig[];
}

export function useGroupedContentState<T>({
  items,
  getGroupKey,
  getName,
  groupConfigs,
}: UseGroupedContentStateOptions<T>) {
  const [showAll, setShowAll] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Group items by their group key
  const groupedItems = useMemo(() => {
    const groups = new Map<string, T[]>();
    for (const item of items) {
      const groupKey = getGroupKey(item);
      const existing = groups.get(groupKey) ?? [];
      existing.push(item);
      groups.set(groupKey, existing);
    }
    // Sort items within each group alphabetically
    for (const [key, groupItems] of groups) {
      groups.set(
        key,
        groupItems.sort((a, b) => getName(a).localeCompare(getName(b)))
      );
    }
    return groups;
  }, [items, getGroupKey, getName]);

  // Get available groups (those that have items)
  const availableGroups = useMemo(
    () => new Set(groupedItems.keys()),
    [groupedItems]
  );

  // Get ordered group configs that have items
  const orderedGroups = useMemo(() => {
    return groupConfigs
      .filter(g => availableGroups.has(g.key))
      .sort((a, b) => a.order - b.order);
  }, [groupConfigs, availableGroups]);

  // Flatten items in group order for initial display
  const flattenedItems = useMemo(() => {
    const result: T[] = [];
    for (const group of orderedGroups) {
      const groupItems = groupedItems.get(group.key) ?? [];
      result.push(...groupItems);
    }
    return result;
  }, [orderedGroups, groupedItems]);

  // Determine what to show based on showAll toggle
  const totalCount = items.length;
  const needsShowAll = totalCount > INITIAL_LIMIT;

  // Scroll to a group section
  const scrollToGroup = useCallback((groupKey: string) => {
    const element = groupRefs.current.get(groupKey);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveGroup(groupKey);
    }
  }, []);

  // Track active group on scroll
  useEffect(() => {
    if (!showAll) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const groupKey = entry.target.getAttribute('data-group');
            if (groupKey) {
              setActiveGroup(groupKey);
              break;
            }
          }
        }
      },
      { rootMargin: '-100px 0px -80% 0px', threshold: 0 }
    );

    groupRefs.current.forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [showAll]);

  // Register group ref
  const setGroupRef = useCallback(
    (groupKey: string) => (el: HTMLDivElement | null) => {
      if (el) {
        groupRefs.current.set(groupKey, el);
      } else {
        groupRefs.current.delete(groupKey);
      }
    },
    []
  );

  return {
    showAll,
    setShowAll,
    activeGroup,
    containerRef,
    groupedItems,
    availableGroups,
    orderedGroups,
    flattenedItems,
    totalCount,
    needsShowAll,
    scrollToGroup,
    setGroupRef,
  };
}
