/**
 * Homebrew Content Handlers Hook
 *
 * Consolidates CRUD callbacks for homebrew content management.
 * Reduces complexity by extracting handlers from HomebrewDashboard.
 */
import type { NavigateOptions } from '@tanstack/react-router';
import { useCallback } from 'react';

import type {
  useDeleteHomebrewContent,
  useEmptyRecycleBin,
  usePermanentlyDeleteHomebrewContent,
  useRestoreHomebrewContent,
} from '@/features/homebrew';
import type { HomebrewContent } from '@/lib/schemas/homebrew';

interface UseHomebrewContentHandlersOptions {
  deleteMutation: ReturnType<typeof useDeleteHomebrewContent>;
  restoreMutation: ReturnType<typeof useRestoreHomebrewContent>;
  permanentDeleteMutation: ReturnType<
    typeof usePermanentlyDeleteHomebrewContent
  >;
  emptyRecycleBinMutation: ReturnType<typeof useEmptyRecycleBin>;
  deletedItemsCount: number;
  navigate: (opts: NavigateOptions) => void;
}

export interface ContentHandlers {
  handleDelete: (item: HomebrewContent) => Promise<void>;
  handleRestore: (item: HomebrewContent) => Promise<void>;
  handlePermanentDelete: (item: HomebrewContent) => Promise<void>;
  handleEmptyRecycleBin: () => Promise<void>;
  handleFork: (item: HomebrewContent) => void;
}

/**
 * Hook for homebrew content CRUD operations.
 * Provides memoized callbacks for delete, restore, permanent delete, and fork operations.
 */
export function useHomebrewContentHandlers({
  deleteMutation,
  restoreMutation,
  permanentDeleteMutation,
  emptyRecycleBinMutation,
  deletedItemsCount,
  navigate,
}: UseHomebrewContentHandlersOptions): ContentHandlers {
  const handleDelete = useCallback(
    async (item: HomebrewContent) => {
      if (
        confirm(
          `Are you sure you want to delete "${item.name}"? It will be moved to the Recycle Bin.`
        )
      ) {
        await deleteMutation.mutateAsync(item.id);
      }
    },
    [deleteMutation]
  );

  const handleRestore = useCallback(
    async (item: HomebrewContent) => {
      await restoreMutation.mutateAsync(item.id);
    },
    [restoreMutation]
  );

  const handlePermanentDelete = useCallback(
    async (item: HomebrewContent) => {
      if (
        confirm(
          `Are you sure you want to permanently delete "${item.name}"? This cannot be undone.`
        )
      ) {
        await permanentDeleteMutation.mutateAsync(item.id);
      }
    },
    [permanentDeleteMutation]
  );

  const handleEmptyRecycleBin = useCallback(async () => {
    if (
      confirm(
        `Are you sure you want to permanently delete all ${deletedItemsCount} items in the recycle bin? This cannot be undone.`
      )
    ) {
      await emptyRecycleBinMutation.mutateAsync();
    }
  }, [emptyRecycleBinMutation, deletedItemsCount]);

  const handleFork = useCallback(
    (item: HomebrewContent) => {
      const sourceId = item.forkedFrom ?? item.id;
      navigate({ to: '/homebrew/new', search: { forkFrom: sourceId } });
    },
    [navigate]
  );

  return {
    handleDelete,
    handleRestore,
    handlePermanentDelete,
    handleEmptyRecycleBin,
    handleFork,
  };
}
