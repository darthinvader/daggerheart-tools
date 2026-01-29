/**
 * Homebrew Content React Query Hooks
 *
 * Provides React Query hooks for all homebrew CRUD operations.
 */

import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import type {
  HomebrewContent,
  HomebrewContentType,
  HomebrewVisibility,
} from '@/lib/schemas/homebrew';

import {
  addHomebrewComment,
  addHomebrewStar,
  addHomebrewToCollection,
  createHomebrewCollection,
  createHomebrewContent,
  type CreateHomebrewContentInput,
  deleteHomebrewComment,
  deleteHomebrewContent,
  forkHomebrewContent,
  getHomebrewContent,
  getHomebrewContentBatch,
  getHomebrewForCharacter,
  getMyHomebrewStats,
  getOrCreateQuicklist,
  linkHomebrewToCampaign,
  linkHomebrewToCharacter,
  listCampaignHomebrewContent,
  listCollectionItems,
  listHomebrewComments,
  type ListHomebrewOptions,
  listMyHomebrewCollections,
  listMyHomebrewContent,
  listMyHomebrewStars,
  listPublicHomebrewContent,
  listStarredHomebrewContent,
  removeHomebrewFromCollection,
  removeHomebrewStar,
  unlinkHomebrewFromCampaign,
  unlinkHomebrewFromCharacter,
  updateHomebrewContent,
  updateHomebrewVisibility,
} from './homebrew-storage';

// =====================================================================================
// Query Keys
// =====================================================================================

export const homebrewKeys = {
  all: ['homebrew'] as const,
  lists: () => [...homebrewKeys.all, 'list'] as const,
  list: (options: ListHomebrewOptions) =>
    [...homebrewKeys.lists(), options] as const,
  myContent: (options?: ListHomebrewOptions) =>
    [...homebrewKeys.lists(), 'my', options ?? {}] as const,
  publicContent: (options?: ListHomebrewOptions) =>
    [...homebrewKeys.lists(), 'public', options ?? {}] as const,
  campaignContent: (campaignId: string, options?: ListHomebrewOptions) =>
    [...homebrewKeys.lists(), 'campaign', campaignId, options ?? {}] as const,
  forCharacter: (contentType: HomebrewContentType, campaignId?: string) =>
    [...homebrewKeys.lists(), 'forCharacter', contentType, campaignId] as const,
  details: () => [...homebrewKeys.all, 'detail'] as const,
  detail: (id: string) => [...homebrewKeys.details(), id] as const,
  batch: (ids: string[]) => [...homebrewKeys.all, 'batch', ids] as const,
  stats: () => [...homebrewKeys.all, 'stats'] as const,
  stars: () => [...homebrewKeys.all, 'stars'] as const,
  myStars: (ids?: string[]) => [...homebrewKeys.stars(), ids ?? []] as const,
  collections: () => [...homebrewKeys.all, 'collections'] as const,
  collectionItems: (collectionId: string) =>
    [...homebrewKeys.collections(), 'items', collectionId] as const,
  comments: () => [...homebrewKeys.all, 'comments'] as const,
  homebrewComments: (homebrewId: string) =>
    [...homebrewKeys.comments(), homebrewId] as const,
};

type HomebrewListResult = Awaited<ReturnType<typeof listMyHomebrewContent>>;

// =====================================================================================
// Query Hooks
// =====================================================================================

/**
 * Get a single homebrew content item
 */
export function useHomebrewContent(id: string | undefined) {
  return useQuery({
    queryKey: homebrewKeys.detail(id ?? ''),
    queryFn: () => (id ? getHomebrewContent(id) : undefined),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get multiple homebrew items by ID
 */
export function useHomebrewContentBatch(ids: string[], enabled = true) {
  return useQuery({
    queryKey: homebrewKeys.batch(ids),
    queryFn: () => getHomebrewContentBatch(ids),
    enabled: enabled && ids.length > 0,
    staleTime: 1000 * 60,
  });
}

/**
 * List current user's homebrew content
 */
export function useMyHomebrewContent(options: ListHomebrewOptions = {}) {
  return useQuery({
    queryKey: homebrewKeys.myContent(options),
    queryFn: () => listMyHomebrewContent(options),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * List starred homebrew content for the current user
 */
export function useStarredHomebrewContent() {
  return useQuery({
    queryKey: [...homebrewKeys.lists(), 'starred'] as const,
    queryFn: listStarredHomebrewContent,
    staleTime: 1000 * 60,
  });
}

/**
 * List public homebrew content
 */
export function usePublicHomebrewContent(options: ListHomebrewOptions = {}) {
  return useQuery({
    queryKey: homebrewKeys.publicContent(options),
    queryFn: () => listPublicHomebrewContent(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * List homebrew content for a campaign
 */
export function useCampaignHomebrewContent(
  campaignId: string | undefined,
  options: ListHomebrewOptions = {}
) {
  return useQuery({
    queryKey: homebrewKeys.campaignContent(campaignId ?? '', options),
    queryFn: () =>
      campaignId
        ? listCampaignHomebrewContent(campaignId, options)
        : Promise.resolve({ items: [], total: 0, hasMore: false }),
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get homebrew content for character building
 */
export function useHomebrewForCharacter(
  contentType: HomebrewContentType,
  campaignId?: string
) {
  return useQuery({
    queryKey: homebrewKeys.forCharacter(contentType, campaignId),
    queryFn: () => getHomebrewForCharacter(contentType, campaignId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get current user's homebrew stats
 */
export function useMyHomebrewStats() {
  return useQuery({
    queryKey: homebrewKeys.stats(),
    queryFn: getMyHomebrewStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// =====================================================================================
// Infinite Query Hooks (for pagination/infinite scroll)
// =====================================================================================

const DEFAULT_PAGE_SIZE = 20;

/**
 * Infinite scroll for current user's homebrew content
 */
export function useMyHomebrewContentInfinite(
  options: Omit<ListHomebrewOptions, 'limit' | 'offset'> = {}
): UseInfiniteQueryResult<InfiniteData<HomebrewListResult, number>, Error> {
  return useInfiniteQuery<
    HomebrewListResult,
    Error,
    InfiniteData<HomebrewListResult, number>,
    readonly unknown[],
    number
  >({
    queryKey: [...homebrewKeys.myContent(options), 'infinite'] as const,
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) => {
      const offset = pageParam;
      return listMyHomebrewContent({
        ...options,
        limit: DEFAULT_PAGE_SIZE,
        offset,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.reduce((acc, page) => acc + page.items.length, 0);
    },
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Infinite scroll for public homebrew content
 */
export function usePublicHomebrewContentInfinite(
  options: Omit<ListHomebrewOptions, 'limit' | 'offset'> = {}
): UseInfiniteQueryResult<InfiniteData<HomebrewListResult, number>, Error> {
  return useInfiniteQuery<
    HomebrewListResult,
    Error,
    InfiniteData<HomebrewListResult, number>,
    readonly unknown[],
    number
  >({
    queryKey: [...homebrewKeys.publicContent(options), 'infinite'] as const,
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) => {
      const offset = pageParam;
      return listPublicHomebrewContent({
        ...options,
        limit: DEFAULT_PAGE_SIZE,
        offset,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.reduce((acc, page) => acc + page.items.length, 0);
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Infinite scroll for campaign homebrew content
 */
export function useCampaignHomebrewContentInfinite(
  campaignId: string | undefined,
  options: Omit<ListHomebrewOptions, 'limit' | 'offset'> = {}
): UseInfiniteQueryResult<InfiniteData<HomebrewListResult, number>, Error> {
  return useInfiniteQuery<
    HomebrewListResult,
    Error,
    InfiniteData<HomebrewListResult, number>,
    readonly unknown[],
    number
  >({
    queryKey: [
      ...homebrewKeys.campaignContent(campaignId ?? '', options),
      'infinite',
    ] as const,
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) => {
      const offset = pageParam;
      return campaignId
        ? listCampaignHomebrewContent(campaignId, {
            ...options,
            limit: DEFAULT_PAGE_SIZE,
            offset,
          })
        : Promise.resolve({ items: [], total: 0, hasMore: false });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.reduce((acc, page) => acc + page.items.length, 0);
    },
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 2,
  });
}

// =====================================================================================
// Mutation Hooks
// =====================================================================================

/**
 * Create new homebrew content
 */
export function useCreateHomebrewContent() {
  const queryClient = useQueryClient();

  return useMutation<HomebrewContent, Error, CreateHomebrewContentInput>({
    mutationFn: createHomebrewContent,
    onSuccess: newContent => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: homebrewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: homebrewKeys.stats() });

      // Set the new content in cache
      queryClient.setQueryData(homebrewKeys.detail(newContent.id), newContent);
    },
  });
}

/**
 * Update homebrew content
 */
export function useUpdateHomebrewContent() {
  const queryClient = useQueryClient();

  return useMutation<
    HomebrewContent | undefined,
    Error,
    {
      id: string;
      updates: {
        content?: unknown;
        name?: string;
        description?: string;
        visibility?: HomebrewVisibility;
        tags?: string[];
        campaignLinks?: string[];
      };
    }
  >({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: {
        content?: unknown;
        name?: string;
        description?: string;
        visibility?: HomebrewVisibility;
        tags?: string[];
        campaignLinks?: string[];
      };
    }) =>
      updateHomebrewContent(
        id,
        updates as Parameters<typeof updateHomebrewContent>[1]
      ),
    onSuccess: (updatedContent, { id }) => {
      if (updatedContent) {
        // Update cache
        queryClient.setQueryData(homebrewKeys.detail(id), updatedContent);
      }
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: homebrewKeys.lists() });
    },
  });
}

/**
 * Delete homebrew content
 */
export function useDeleteHomebrewContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHomebrewContent,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: homebrewKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: homebrewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: homebrewKeys.stats() });
    },
  });
}

// =====================================================================================
// Engagement Hooks
// =====================================================================================

export function useMyHomebrewStars(homebrewIds: string[] = []) {
  return useQuery({
    queryKey: homebrewKeys.myStars(homebrewIds),
    queryFn: () => listMyHomebrewStars(homebrewIds),
    enabled: homebrewIds.length > 0,
    staleTime: 1000 * 30,
  });
}

export function useToggleHomebrewStar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      homebrewId,
      isStarred,
    }: {
      homebrewId: string;
      isStarred: boolean;
    }) => {
      if (isStarred) {
        await removeHomebrewStar(homebrewId);
      } else {
        await addHomebrewStar(homebrewId);
      }
      return { homebrewId, isStarred: !isStarred };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homebrewKeys.stars() });
      queryClient.invalidateQueries({ queryKey: homebrewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: homebrewKeys.stats() });
    },
  });
}

export function useHomebrewCollections(enabled = true) {
  return useQuery({
    queryKey: homebrewKeys.collections(),
    queryFn: listMyHomebrewCollections,
    staleTime: 1000 * 60,
    enabled,
  });
}

export function useCreateHomebrewCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }) => createHomebrewCollection(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homebrewKeys.collections() });
    },
  });
}

export function useQuicklist() {
  return useQuery({
    queryKey: [...homebrewKeys.collections(), 'quicklist'] as const,
    queryFn: getOrCreateQuicklist,
    staleTime: 1000 * 60,
  });
}

export function useAddHomebrewToCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      homebrewId,
    }: {
      collectionId: string;
      homebrewId: string;
    }) => addHomebrewToCollection(collectionId, homebrewId),
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({
        queryKey: homebrewKeys.collectionItems(collectionId),
      });
      queryClient.invalidateQueries({ queryKey: homebrewKeys.lists() });
    },
  });
}

export function useRemoveHomebrewFromCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      homebrewId,
    }: {
      collectionId: string;
      homebrewId: string;
    }) => removeHomebrewFromCollection(collectionId, homebrewId),
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({
        queryKey: homebrewKeys.collectionItems(collectionId),
      });
      queryClient.invalidateQueries({ queryKey: homebrewKeys.lists() });
    },
  });
}

export function useCollectionItems(collectionId: string | undefined) {
  return useQuery({
    queryKey: homebrewKeys.collectionItems(collectionId ?? ''),
    queryFn: () => (collectionId ? listCollectionItems(collectionId) : []),
    enabled: !!collectionId,
    staleTime: 1000 * 60,
  });
}

export function useHomebrewComments(homebrewId: string | undefined) {
  return useQuery({
    queryKey: homebrewKeys.homebrewComments(homebrewId ?? ''),
    queryFn: () => (homebrewId ? listHomebrewComments(homebrewId) : []),
    enabled: !!homebrewId,
    staleTime: 1000 * 30,
  });
}

export function useAddHomebrewComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ homebrewId, body }: { homebrewId: string; body: string }) =>
      addHomebrewComment(homebrewId, body),
    onSuccess: (_, { homebrewId }) => {
      queryClient.invalidateQueries({
        queryKey: homebrewKeys.homebrewComments(homebrewId),
      });
      queryClient.invalidateQueries({ queryKey: homebrewKeys.lists() });
    },
  });
}

export function useDeleteHomebrewComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { commentId: string; homebrewId: string }) =>
      deleteHomebrewComment(variables.commentId),
    onSuccess: (_, { homebrewId }) => {
      queryClient.invalidateQueries({
        queryKey: homebrewKeys.homebrewComments(homebrewId),
      });
      queryClient.invalidateQueries({ queryKey: homebrewKeys.lists() });
    },
  });
}

/**
 * Fork homebrew content
 */
export function useForkHomebrewContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forkHomebrewContent,
    onSuccess: forkedContent => {
      // Add to cache
      queryClient.setQueryData(
        homebrewKeys.detail(forkedContent.id),
        forkedContent
      );
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: homebrewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: homebrewKeys.stats() });
    },
  });
}

/**
 * Update homebrew visibility
 */
export function useUpdateHomebrewVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      visibility,
    }: {
      id: string;
      visibility: HomebrewVisibility;
    }) => updateHomebrewVisibility(id, visibility),
    onSuccess: (updatedContent, { id }) => {
      if (updatedContent) {
        queryClient.setQueryData(homebrewKeys.detail(id), updatedContent);
      }
      queryClient.invalidateQueries({ queryKey: homebrewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: homebrewKeys.stats() });
    },
  });
}

/**
 * Link homebrew to campaign
 */
export function useLinkHomebrewToCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      homebrewId,
      campaignId,
    }: {
      homebrewId: string;
      campaignId: string;
    }) => linkHomebrewToCampaign(homebrewId, campaignId),
    onSuccess: (_, { homebrewId, campaignId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: homebrewKeys.detail(homebrewId),
      });
      queryClient.invalidateQueries({
        queryKey: homebrewKeys.campaignContent(campaignId),
      });
      queryClient.invalidateQueries({ queryKey: homebrewKeys.myContent() });
    },
  });
}

/**
 * Unlink homebrew from campaign
 */
export function useUnlinkHomebrewFromCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      homebrewId,
      campaignId,
    }: {
      homebrewId: string;
      campaignId: string;
    }) => unlinkHomebrewFromCampaign(homebrewId, campaignId),
    onSuccess: (_, { homebrewId, campaignId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: homebrewKeys.detail(homebrewId),
      });
      queryClient.invalidateQueries({
        queryKey: homebrewKeys.campaignContent(campaignId),
      });
      queryClient.invalidateQueries({ queryKey: homebrewKeys.myContent() });
    },
  });
}

/**
 * Link homebrew to character
 */
export function useLinkHomebrewToCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      homebrewId,
      characterId,
    }: {
      homebrewId: string;
      characterId: string;
    }) => linkHomebrewToCharacter(homebrewId, characterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homebrewKeys.lists() });
    },
  });
}

/**
 * Unlink homebrew from character
 */
export function useUnlinkHomebrewFromCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      homebrewId,
      characterId,
    }: {
      homebrewId: string;
      characterId: string;
    }) => unlinkHomebrewFromCharacter(homebrewId, characterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homebrewKeys.lists() });
    },
  });
}

// =====================================================================================
// Prefetch Helpers
// =====================================================================================

/**
 * Prefetch homebrew content
 */
export function usePrefetchHomebrewContent() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: homebrewKeys.detail(id),
      queryFn: () => getHomebrewContent(id),
      staleTime: 1000 * 60 * 5,
    });
  };
}
