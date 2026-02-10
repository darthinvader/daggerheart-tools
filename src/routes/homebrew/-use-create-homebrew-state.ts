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

interface FormInteractionState {
  userSelectedType: HomebrewContentType | null;
  hasInteracted: boolean;
}

const INITIAL_FORM_STATE: FormInteractionState = {
  userSelectedType: null,
  hasInteracted: false,
};

function deriveSelectedType(
  userSelectedType: HomebrewContentType | null,
  forkSource: HomebrewContent | undefined | null
): HomebrewContentType | null {
  return userSelectedType ?? forkSource?.contentType ?? null;
}

function deriveIsFormOpen(
  hasInteracted: boolean,
  forkSource: HomebrewContent | undefined | null,
  selectedType: HomebrewContentType | null
): boolean {
  return hasInteracted || (Boolean(forkSource) && selectedType !== null);
}

function buildCreatePayload(
  selectedType: HomebrewContentType,
  payload: {
    content: HomebrewContent['content'];
    visibility: HomebrewVisibility;
  },
  forkSource: HomebrewContent | undefined | null
) {
  const typedContent = payload.content as {
    name: string;
    description?: string;
  };
  return {
    contentType: selectedType,
    content: payload.content,
    name: typedContent.name,
    description: typedContent.description ?? '',
    visibility: payload.visibility,
    tags: [] as string[],
    campaignLinks: [] as string[],
    forkedFrom: forkSource?.forkedFrom ?? forkSource?.id,
  };
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

  const [formState, setFormState] =
    useState<FormInteractionState>(INITIAL_FORM_STATE);

  const selectedType = deriveSelectedType(
    formState.userSelectedType,
    forkSource
  );
  const isFormOpen = deriveIsFormOpen(
    formState.hasInteracted,
    forkSource,
    selectedType
  );

  const handleTypeSelect = useCallback((type: HomebrewContentType) => {
    setFormState({ userSelectedType: type, hasInteracted: true });
  }, []);

  const handleFormClose = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
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

      await createMutation.mutateAsync(
        buildCreatePayload(selectedType, payload, forkSource)
      );
      onNavigateAfterCreate();
    },
    [selectedType, user, createMutation, forkSource, onNavigateAfterCreate]
  );

  const handleFormDialogChange = useCallback(
    (open: boolean) => {
      if (open) {
        setFormState(prev => ({ ...prev, hasInteracted: true }));
      } else {
        handleFormClose();
        if (forkSource) onNavigateAfterForkClose();
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
