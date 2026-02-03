/**
 * Extracted hook for CreateHomebrew state and form handling.
 * Reduces complexity in CreateHomebrew component.
 */
import { useCallback, useMemo, useState } from 'react';

import {
  useCreateHomebrewContent,
  useHomebrewContent,
} from '@/features/homebrew';
import type {
  HomebrewContent,
  HomebrewContentType,
  HomebrewVisibility,
} from '@/lib/schemas/homebrew';

interface UseCreateHomebrewStateOptions {
  forkFrom?: string;
  user: { id: string } | null;
  onNavigateAfterCreate: () => void;
  onNavigateAfterForkClose: () => void;
}

export function useCreateHomebrewState({
  forkFrom,
  user,
  onNavigateAfterCreate,
  onNavigateAfterForkClose,
}: UseCreateHomebrewStateOptions) {
  const createMutation = useCreateHomebrewContent();

  // Fetch the source content if forking
  const { data: forkSource, isLoading: isForkSourceLoading } =
    useHomebrewContent(forkFrom);

  // User-selected type (null means use forkSource if available)
  const [userSelectedType, setUserSelectedType] =
    useState<HomebrewContentType | null>(null);
  // Track if user has explicitly interacted with the form
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Derive effective selected type: user selection takes precedence, then forkSource
  const selectedType = userSelectedType ?? forkSource?.contentType ?? null;
  // Derive if form should be open: open if user interacted, or if forkSource loaded
  const isFormOpen =
    hasUserInteracted || (Boolean(forkSource) && selectedType !== null);

  const handleTypeSelect = useCallback((type: HomebrewContentType) => {
    setUserSelectedType(type);
    setHasUserInteracted(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setHasUserInteracted(false);
    setUserSelectedType(null);
  }, []);

  // Build initial data for form when forking
  const forkInitialData = useMemo(() => {
    if (!forkSource) return undefined;
    return {
      ...forkSource,
      id: '', // Clear ID so it creates a new one
      name: `${forkSource.name} (Fork)`,
      forkedFrom: forkSource.forkedFrom ?? forkSource.id,
    } as HomebrewContent;
  }, [forkSource]);

  const handleFormSubmit = useCallback(
    async (payload: {
      content: HomebrewContent['content'];
      visibility: HomebrewVisibility;
    }) => {
      if (!selectedType || !user) return;

      const typedContent = payload.content as {
        name: string;
        description?: string;
      };

      await createMutation.mutateAsync({
        contentType: selectedType,
        content: payload.content,
        name: typedContent.name,
        description: typedContent.description ?? '',
        visibility: payload.visibility,
        tags: [],
        campaignLinks: [],
        forkedFrom: forkSource?.forkedFrom ?? forkSource?.id,
      });
      onNavigateAfterCreate();
    },
    [selectedType, user, createMutation, forkSource, onNavigateAfterCreate]
  );

  const handleFormDialogChange = useCallback(
    (open: boolean) => {
      if (open) {
        setHasUserInteracted(true);
      } else {
        handleFormClose();
        // If closing and was forking, navigate back
        if (forkSource) {
          onNavigateAfterForkClose();
        }
      }
    },
    [handleFormClose, forkSource, onNavigateAfterForkClose]
  );

  return {
    // State
    forkSource,
    isForkSourceLoading,
    selectedType,
    isFormOpen,
    forkInitialData,
    isPending: createMutation.isPending,
    // Handlers
    handleTypeSelect,
    handleFormClose,
    handleFormSubmit,
    handleFormDialogChange,
  };
}
