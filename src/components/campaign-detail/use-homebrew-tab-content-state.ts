/**
 * Homebrew Tab Content State Hook
 *
 * Extracted state management for HomebrewTabContent.
 */
import { useCallback, useMemo, useState } from 'react';

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

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<HomebrewContent | null>(null);
  const [selectedType, setSelectedType] =
    useState<HomebrewContentType>('adversary');
  const [editingItem, setEditingItem] = useState<HomebrewContent | null>(null);
  const [innerTab, setInnerTab] = useState<InnerTab>('linked');
  const [showCampaignInfo, setShowCampaignInfo] = useState(() => {
    return localStorage.getItem('hideCampaignHomebrewInfo') !== 'true';
  });

  // Handlers
  const handleCreate = useCallback((type: HomebrewContentType) => {
    setSelectedType(type);
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleView = useCallback((item: HomebrewContent) => {
    setViewingItem(item);
    setIsViewOpen(true);
  }, []);

  const handleEdit = useCallback((item: HomebrewContent) => {
    setSelectedType(item.contentType);
    setEditingItem(item);
    setIsFormOpen(true);
    setIsViewOpen(false);
  }, []);

  const handleFormSubmit = useCallback(
    async (payload: {
      content: HomebrewContent['content'];
      visibility: HomebrewVisibility;
    }) => {
      const typedFormData = payload.content as {
        name: string;
      } & HomebrewContent['content'];

      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          updates: {
            content: typedFormData,
            name: typedFormData.name,
            visibility: payload.visibility,
          },
        });
      } else {
        await createMutation.mutateAsync({
          contentType: selectedType,
          content: typedFormData,
          name: typedFormData.name,
          description: '',
          tags: [],
          visibility: payload.visibility,
          campaignLinks: [campaignId],
        });
      }
      setIsFormOpen(false);
      setEditingItem(null);
    },
    [editingItem, updateMutation, createMutation, selectedType, campaignId]
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
    setIsFormOpen(open);
    if (!open) setEditingItem(null);
  }, []);

  const handleViewOpenChange = useCallback((open: boolean) => {
    setIsViewOpen(open);
    if (!open) setViewingItem(null);
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
    isFormOpen,
    isViewOpen,
    viewingItem,
    selectedType,
    editingItem,
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
