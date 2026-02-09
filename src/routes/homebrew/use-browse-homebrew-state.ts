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

const SORT_CONFIG = {
  forks: { sortBy: 'fork_count', sortOrder: 'desc' },
  name: { sortBy: 'name', sortOrder: 'asc' },
  recent: { sortBy: 'created_at', sortOrder: 'desc' },
} as const;

function flattenPages(
  pages?: { items: HomebrewContent[] }[]
): HomebrewContent[] {
  return pages?.flatMap(page => page.items) ?? [];
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

  // Data fetching
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    usePublicHomebrewContentInfinite({
      contentType: typeFilter !== 'all' ? typeFilter : undefined,
      search: searchQuery.trim() || undefined,
      ...SORT_CONFIG[sortBy],
    });

  const createMutation = useCreateHomebrewContent();

  // Create dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] =
    useState<HomebrewContentType>('adversary');

  // View dialog state — viewingItem doubles as open flag
  const [viewingItem, setViewingItem] = useState<HomebrewContent | null>(null);

  // Flatten paginated results
  const publicContent = useMemo(() => flattenPages(data?.pages), [data?.pages]);

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

  // Auth guard — redirects to login when unauthenticated
  const requireAuth = useCallback(
    (action: () => void) => {
      if (!userId) {
        onNavigateToLogin();
        return;
      }
      action();
    },
    [userId, onNavigateToLogin]
  );

  // Handlers
  const handleView = useCallback((item: HomebrewContent) => {
    setViewingItem(item);
  }, []);

  const handleViewOpenChange = useCallback((open: boolean) => {
    if (!open) setViewingItem(null);
  }, []);

  const handleFork = useCallback(
    (item: HomebrewContent) => {
      requireAuth(() => onNavigateToFork(item.forkedFrom ?? item.id));
    },
    [requireAuth, onNavigateToFork]
  );

  const handleCreate = useCallback(
    (type: HomebrewContentType) => {
      requireAuth(() => {
        setCreateType(type);
        setIsCreateOpen(true);
      });
    },
    [requireAuth]
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
    isViewOpen: viewingItem !== null,
    handleViewOpenChange,
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
