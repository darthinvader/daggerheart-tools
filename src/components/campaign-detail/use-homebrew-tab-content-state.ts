/**
 * Homebrew Tab Content State Hook
 *
 * Extracted state management for HomebrewTabContent.
 */
import { useCallback, useMemo, useReducer, useState } from 'react';

import { useAuth } from '@/components/providers';
import {
  useCampaignHomebrewContent,
  useCreateHomebrewContent,
  useLinkHomebrewToCampaign,
  useMyHomebrewContent,
  useStarredHomebrewContent,
  useUnlinkHomebrewFromCampaign,
  useUpdateHomebrewContent,
} from '@/features/homebrew';
import type {
  HomebrewContent,
  HomebrewContentType,
  HomebrewVisibility,
} from '@/lib/schemas/homebrew';

import { useHomebrewCollectionState } from './use-homebrew-collection-state';

type InnerTab =
  | 'linked'
  | 'all'
  | 'public'
  | 'private'
  | 'quicklist'
  | 'collections';

// Dialog state reducer — groups related form/view dialog state
interface DialogState {
  isFormOpen: boolean;
  isViewOpen: boolean;
  viewingItem: HomebrewContent | null;
  selectedType: HomebrewContentType;
  editingItem: HomebrewContent | null;
}

type DialogAction =
  | { type: 'OPEN_CREATE'; contentType: HomebrewContentType }
  | { type: 'OPEN_VIEW'; item: HomebrewContent }
  | { type: 'OPEN_EDIT'; item: HomebrewContent }
  | { type: 'SET_FORM_OPEN'; open: boolean }
  | { type: 'SET_VIEW_OPEN'; open: boolean };

const initialDialogState: DialogState = {
  isFormOpen: false,
  isViewOpen: false,
  viewingItem: null,
  selectedType: 'adversary',
  editingItem: null,
};

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case 'OPEN_CREATE':
      return {
        ...state,
        selectedType: action.contentType,
        editingItem: null,
        isFormOpen: true,
      };
    case 'OPEN_VIEW':
      return { ...state, viewingItem: action.item, isViewOpen: true };
    case 'OPEN_EDIT':
      return {
        ...state,
        selectedType: action.item.contentType,
        editingItem: action.item,
        isFormOpen: true,
        isViewOpen: false,
      };
    case 'SET_FORM_OPEN':
      return action.open
        ? { ...state, isFormOpen: true }
        : { ...state, isFormOpen: false, editingItem: null };
    case 'SET_VIEW_OPEN':
      return action.open
        ? { ...state, isViewOpen: true }
        : { ...state, isViewOpen: false, viewingItem: null };
  }
}

export function useHomebrewTabContentState(campaignId: string) {
  const { user } = useAuth();

  // Data queries
  const { data: campaignResult, isLoading: loadingCampaign } =
    useCampaignHomebrewContent(campaignId);
  const { data: myResult, isLoading: loadingMy } = useMyHomebrewContent();
  const { data: starredData, isLoading: isStarredLoading } =
    useStarredHomebrewContent();

  // Collection state (extracted hook)
  const collectionState = useHomebrewCollectionState();

  // Memoized arrays
  const campaignHomebrew = useMemo(
    () => campaignResult?.items ?? [],
    [campaignResult?.items]
  );
  const myHomebrew = useMemo(() => myResult?.items ?? [], [myResult?.items]);
  const starredItems = useMemo(
    () => starredData?.items ?? [],
    [starredData?.items]
  );

  // Track linked IDs
  const linkedIds = useMemo(
    () => new Set(campaignHomebrew.map(item => item.id)),
    [campaignHomebrew]
  );

  // Mutations
  const createMutation = useCreateHomebrewContent();
  const updateMutation = useUpdateHomebrewContent();
  const linkMutation = useLinkHomebrewToCampaign();
  const unlinkMutation = useUnlinkHomebrewFromCampaign();

  // Dialog state (grouped via reducer)
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
  const [innerTab, setInnerTab] = useState<InnerTab>('linked');
  const [showCampaignInfo, setShowCampaignInfo] = useState(() => {
    return localStorage.getItem('hideCampaignHomebrewInfo') !== 'true';
  });

  // Handlers
  const handleCreate = useCallback((type: HomebrewContentType) => {
    dispatch({ type: 'OPEN_CREATE', contentType: type });
  }, []);

  const handleView = useCallback((item: HomebrewContent) => {
    dispatch({ type: 'OPEN_VIEW', item });
  }, []);

  const handleEdit = useCallback((item: HomebrewContent) => {
    dispatch({ type: 'OPEN_EDIT', item });
  }, []);

  const handleFormSubmit = useCallback(
    async (payload: {
      content: HomebrewContent['content'];
      visibility: HomebrewVisibility;
    }) => {
      const typedFormData = payload.content as {
        name: string;
      } & HomebrewContent['content'];

      if (dialog.editingItem) {
        await updateMutation.mutateAsync({
          id: dialog.editingItem.id,
          updates: {
            content: typedFormData,
            name: typedFormData.name,
            visibility: payload.visibility,
          },
        });
      } else {
        await createMutation.mutateAsync({
          contentType: dialog.selectedType,
          content: typedFormData,
          name: typedFormData.name,
          description: '',
          tags: [],
          visibility: payload.visibility,
          campaignLinks: [campaignId],
        });
      }
      dispatch({ type: 'SET_FORM_OPEN', open: false });
    },
    [
      dialog.editingItem,
      dialog.selectedType,
      updateMutation,
      createMutation,
      campaignId,
    ]
  );

  const handleLink = useCallback(
    async (item: HomebrewContent) => {
      await linkMutation.mutateAsync({
        homebrewId: item.id,
        campaignId,
      });
    },
    [campaignId, linkMutation]
  );

  const handleUnlink = useCallback(
    async (item: HomebrewContent) => {
      if (confirm(`Remove "${item.name}" from this campaign?`)) {
        await unlinkMutation.mutateAsync({
          homebrewId: item.id,
          campaignId,
        });
      }
    },
    [campaignId, unlinkMutation]
  );

  const handleHideCampaignInfo = useCallback(() => {
    setShowCampaignInfo(false);
    localStorage.setItem('hideCampaignHomebrewInfo', 'true');
  }, []);

  const handleFormOpenChange = useCallback((open: boolean) => {
    dispatch({ type: 'SET_FORM_OPEN', open });
  }, []);

  const handleViewOpenChange = useCallback((open: boolean) => {
    dispatch({ type: 'SET_VIEW_OPEN', open });
  }, []);

  return {
    // Data
    user,
    campaignHomebrew,
    myHomebrew,
    starredItems,
    linkedIds,
    collections: collectionState.collections,
    visibleCollections: collectionState.visibleCollections,
    selectedCollection: collectionState.selectedCollection,
    orderedCollectionContent: collectionState.orderedCollectionContent,

    // Loading states
    loadingCampaign,
    loadingMy,
    isStarredLoading,
    isCollectionsLoading: collectionState.isCollectionsLoading,
    isCollectionItemsLoading: collectionState.isCollectionItemsLoading,
    isCollectionContentLoading: collectionState.isCollectionContentLoading,
    isSubmitting: createMutation.isPending || updateMutation.isPending,

    // Dialog state
    isFormOpen: dialog.isFormOpen,
    isViewOpen: dialog.isViewOpen,
    viewingItem: dialog.viewingItem,
    selectedType: dialog.selectedType,
    editingItem: dialog.editingItem,
    innerTab,
    setInnerTab,
    showCampaignInfo,
    effectiveCollectionId: collectionState.effectiveCollectionId,
    setSelectedCollectionId: collectionState.setSelectedCollectionId,

    // Handlers
    handleCreate,
    handleView,
    handleEdit,
    handleFormSubmit,
    handleLink,
    handleUnlink,
    handleHideCampaignInfo,
    handleFormOpenChange,
    handleViewOpenChange,
  };
}
