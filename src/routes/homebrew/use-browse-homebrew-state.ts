/**
 * Extracted hook for BrowseHomebrew state and handlers.
 * Reduces complexity in BrowseHomebrew component.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  useCreateHomebrewContent,
  usePublicHomebrewContentInfinite,
} from '@/features/homebrew';
import type {
  HomebrewContent,
  HomebrewContentType,
  HomebrewVisibility,
} from '@/lib/schemas/homebrew';

interface UseBrowseHomebrewStateOptions {
  userId?: string;
  onNavigateToLogin: () => void;
  onNavigateToFork: (sourceId: string) => void;
  onNavigateToHomebrew: () => void;
}

export function useBrowseHomebrewState({
  userId,
  onNavigateToLogin,
  onNavigateToFork,
  onNavigateToHomebrew,
}: UseBrowseHomebrewStateOptions) {
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<HomebrewContentType | 'all'>(
    'all'
  );
  const [sortBy, setSortBy] = useState<'recent' | 'forks' | 'name'>('recent');
  const [showForkInfo, setShowForkInfo] = useState(() => {
    return localStorage.getItem('hideForkInfo') !== 'true';
  });

  // Map UI sort to API sort
  const sortOptions = useMemo(() => {
    switch (sortBy) {
      case 'forks':
        return { sortBy: 'fork_count' as const, sortOrder: 'desc' as const };
      case 'name':
        return { sortBy: 'name' as const, sortOrder: 'asc' as const };
      case 'recent':
      default:
        return { sortBy: 'created_at' as const, sortOrder: 'desc' as const };
    }
  }, [sortBy]);

  // Data fetching
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    usePublicHomebrewContentInfinite({
      contentType: typeFilter !== 'all' ? typeFilter : undefined,
      search: searchQuery.trim() || undefined,
      ...sortOptions,
    });

  const createMutation = useCreateHomebrewContent();

  // Create dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] =
    useState<HomebrewContentType>('adversary');

  // View dialog state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<HomebrewContent | null>(null);

  // Flatten paginated results
  const pages = data?.pages;
  const publicContent = useMemo(() => {
    if (!pages) return [];
    return pages.flatMap(page => page.items);
  }, [pages]);

  // Get total from first page
  const totalCount = data?.pages[0]?.total ?? 0;

  // Infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handlers
  const handleView = useCallback((item: HomebrewContent) => {
    setViewingItem(item);
    setIsViewOpen(true);
  }, []);

  const handleFork = useCallback(
    (item: HomebrewContent) => {
      if (!userId) {
        onNavigateToLogin();
        return;
      }
      const sourceId = item.forkedFrom ?? item.id;
      onNavigateToFork(sourceId);
    },
    [userId, onNavigateToLogin, onNavigateToFork]
  );

  const handleCreate = useCallback(
    (type: HomebrewContentType) => {
      if (!userId) {
        onNavigateToLogin();
        return;
      }
      setCreateType(type);
      setIsCreateOpen(true);
    },
    [userId, onNavigateToLogin]
  );

  const handleFormSubmit = useCallback(
    async (payload: {
      content: HomebrewContent['content'];
      visibility: HomebrewVisibility;
    }) => {
      const typedFormData = payload.content as {
        name: string;
      } & HomebrewContent['content'];
      await createMutation.mutateAsync({
        contentType: createType,
        content: typedFormData,
        name: typedFormData.name,
        description: '',
        tags: [],
        visibility: payload.visibility,
        campaignLinks: [],
      });
      setIsCreateOpen(false);
      onNavigateToHomebrew();
    },
    [createType, createMutation, onNavigateToHomebrew]
  );

  const handleDismissForkInfo = useCallback(() => {
    setShowForkInfo(false);
    localStorage.setItem('hideForkInfo', 'true');
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setTypeFilter('all');
  }, []);

  return {
    // Filter state
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    sortBy,
    setSortBy,
    showForkInfo,
    handleDismissForkInfo,
    // Data
    publicContent,
    totalCount,
    isLoading,
    // Infinite scroll
    loadMoreRef,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    // View dialog
    isViewOpen,
    setIsViewOpen,
    viewingItem,
    // Create dialog
    isCreateOpen,
    setIsCreateOpen,
    createType,
    isPending: createMutation.isPending,
    // Handlers
    handleView,
    handleFork,
    handleCreate,
    handleFormSubmit,
    handleClearFilters,
  };
}
