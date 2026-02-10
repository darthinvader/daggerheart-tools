/**
 * Homebrew Content Handlers Hook
 *
 * Consolidates CRUD callbacks for homebrew content management.
 * Reduces complexity by extracting handlers from HomebrewDashboard.
 */
import type { NavigateOptions } from '@tanstack/react-router';
import { useCallback, useState } from 'react';

import type {
  useDeleteHomebrewContent,
  useEmptyRecycleBin,
  usePermanentlyDeleteHomebrewContent,
  useRestoreHomebrewContent,
} from '@/features/homebrew';
import type { HomebrewContent } from '@/lib/schemas/homebrew';

/** Discriminated union describing a destructive action awaiting confirmation. */
export type PendingAction =
  | { type: 'delete'; item: HomebrewContent }
  | { type: 'permanentDelete'; item: HomebrewContent }
  | { type: 'emptyBin'; deletedItemsCount: number };

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
  handleDelete: (item: HomebrewContent) => void;
  handleRestore: (item: HomebrewContent) => Promise<void>;
  handlePermanentDelete: (item: HomebrewContent) => void;
  handleEmptyRecycleBin: () => void;
  handleFork: (item: HomebrewContent) => void;
  pendingAction: PendingAction | null;
  confirmPendingAction: () => Promise<void>;
  cancelPendingAction: () => void;
}

/**
 * Hook for homebrew content CRUD operations.
 * Provides memoized callbacks for delete, restore, permanent delete, and fork operations.
 * Destructive actions populate `pendingAction` state for AlertDialog confirmation
 * instead of using `window.confirm()`.
 */
export function useHomebrewContentHandlers({
  deleteMutation,
  restoreMutation,
  permanentDeleteMutation,
  emptyRecycleBinMutation,
  deletedItemsCount,
  navigate,
}: UseHomebrewContentHandlersOptions): ContentHandlers {
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );

  const handleDelete = useCallback((item: HomebrewContent) => {
    setPendingAction({ type: 'delete', item });
  }, []);

  const handleRestore = useCallback(
    async (item: HomebrewContent) => {
      await restoreMutation.mutateAsync(item.id);
    },
    [restoreMutation]
  );

  const handlePermanentDelete = useCallback((item: HomebrewContent) => {
    setPendingAction({ type: 'permanentDelete', item });
  }, []);

  const handleEmptyRecycleBin = useCallback(() => {
    setPendingAction({ type: 'emptyBin', deletedItemsCount });
  }, [deletedItemsCount]);

  const confirmPendingAction = useCallback(async () => {
    if (!pendingAction) return;

    switch (pendingAction.type) {
      case 'delete':
        await deleteMutation.mutateAsync(pendingAction.item.id);
        break;
      case 'permanentDelete':
        await permanentDeleteMutation.mutateAsync(pendingAction.item.id);
        break;
      case 'emptyBin':
        await emptyRecycleBinMutation.mutateAsync();
        break;
    }

    setPendingAction(null);
  }, [
    pendingAction,
    deleteMutation,
    permanentDeleteMutation,
    emptyRecycleBinMutation,
  ]);

  const cancelPendingAction = useCallback(() => {
    setPendingAction(null);
  }, []);

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
    pendingAction,
    confirmPendingAction,
    cancelPendingAction,
  };
}
