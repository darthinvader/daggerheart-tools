/**
 * Hook for managing homebrew dashboard content data
 * Consolidates infinite scroll, tab counts, and content queries
 */
import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  useDeletedHomebrewContent,
  useMyHomebrewContentInfinite,
  useStarredHomebrewContent,
} from '@/features/homebrew';
import type { HomebrewContent } from '@/lib/schemas/homebrew';

// =====================================================================================
// Hook Return Type
// =====================================================================================

interface UseHomebrewDashboardContentResult {
  // Main content
  myContent: HomebrewContent[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;

  // Tab counts
  tabCounts: {
    all: number;
    public: number;
    private: number;
    linked: number;
  };

  // Starred/Deleted
  starredItems: HomebrewContent[];
  isStarredLoading: boolean;
  deletedItems: HomebrewContent[];
  isDeletedLoading: boolean;

  // Infinite scroll
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

// =====================================================================================
// Main Hook
// =====================================================================================

export function useHomebrewDashboardContent(): UseHomebrewDashboardContentResult {
  // Infinite scroll for main content
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useMyHomebrewContentInfinite();

  // Flatten paginated results
  const pages = data?.pages;
  const myContent = useMemo<HomebrewContent[]>(() => {
    if (!pages) return [];
    return pages.flatMap(page => page.items);
  }, [pages]);

  // Tab counts computed from content
  const tabCounts = useMemo(() => {
    const publicCount = myContent.filter(c => c.visibility === 'public').length;
    const privateCount = myContent.filter(
      c => c.visibility === 'private'
    ).length;
    const linkedCount = myContent.filter(
      c => c.campaignLinks && c.campaignLinks.length > 0
    ).length;
    return {
      all: myContent.length,
      public: publicCount,
      private: privateCount,
      linked: linkedCount,
    };
  }, [myContent]);

  // Starred content
  const { data: starredData, isLoading: isStarredLoading } =
    useStarredHomebrewContent();
  const starredItems = starredData?.items ?? [];

  // Deleted content
  const { data: deletedData, isLoading: isDeletedLoading } =
    useDeletedHomebrewContent();
  const deletedItems = deletedData?.items ?? [];

  // Infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  return {
    myContent,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    tabCounts,
    starredItems,
    isStarredLoading,
    deletedItems,
    isDeletedLoading,
    loadMoreRef,
  };
}
