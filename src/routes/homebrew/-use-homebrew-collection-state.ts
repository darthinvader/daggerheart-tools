/**
 * Homebrew Collection State Hook
 *
 * Manages collection selection, content loading, and collection creation.
 * Extracts complexity from HomebrewDashboard component.
 */
import { useCallback, useMemo, useState } from 'react';

import {
  useCollectionItems,
  useCreateHomebrewCollection,
  useDeleteHomebrewCollection,
  useHomebrewCollections,
  useHomebrewContentBatch,
} from '@/features/homebrew';
import type {
  HomebrewCollection,
  HomebrewContent,
} from '@/lib/schemas/homebrew';

interface UseHomebrewCollectionStateResult {
  // Collections data
  collections: HomebrewCollection[];
  isCollectionsLoading: boolean;
  visibleCollections: HomebrewCollection[];

  // Selection state
  selectedCollectionId: string | null;
  setSelectedCollectionId: (id: string | null) => void;
  effectiveCollectionId: string | null;
  selectedCollection: HomebrewCollection | null;

  // Collection content
  orderedCollectionContent: HomebrewContent[];
  isCollectionContentLoading: boolean;

  // Create collection dialog
  isCreateCollectionOpen: boolean;
  setIsCreateCollectionOpen: (open: boolean) => void;
  newCollectionName: string;
  setNewCollectionName: (name: string) => void;
  newCollectionDescription: string;
  setNewCollectionDescription: (desc: string) => void;
  handleCreateCollection: () => Promise<void>;
  isCreatingCollection: boolean;

  // Delete collection
  handleDeleteCollection: (id: string) => Promise<void>;
  isDeletingCollection: boolean;
}

/**
 * Hook for managing homebrew collection state.
 */
export function useHomebrewCollectionState(): UseHomebrewCollectionStateResult {
  const { data: collections = [], isLoading: isCollectionsLoading } =
    useHomebrewCollections();
  const createCollectionMutation = useCreateHomebrewCollection();
  const deleteCollectionMutation = useDeleteHomebrewCollection();

  const visibleCollections = useMemo(
    () => collections.filter(collection => !collection.isQuicklist),
    [collections]
  );

  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  // Derive effective selected ID: use state if valid, otherwise default to first
  const effectiveCollectionId = useMemo(() => {
    if (
      selectedCollectionId &&
      visibleCollections.some(c => c.id === selectedCollectionId)
    ) {
      return selectedCollectionId;
    }
    return visibleCollections[0]?.id ?? null;
  }, [selectedCollectionId, visibleCollections]);

  const selectedCollection = useMemo(
    () =>
      visibleCollections.find(
        collection => collection.id === effectiveCollectionId
      ) ?? null,
    [visibleCollections, effectiveCollectionId]
  );

  const { data: collectionItems = [], isLoading: isCollectionItemsLoading } =
    useCollectionItems(effectiveCollectionId ?? undefined);
  const collectionItemIds = useMemo(
    () => collectionItems.map(item => item.homebrewId),
    [collectionItems]
  );
  const {
    data: collectionContent = [],
    isLoading: isCollectionContentLoading,
  } = useHomebrewContentBatch(collectionItemIds, !!effectiveCollectionId);

  const orderedCollectionContent = useMemo(() => {
    if (collectionItemIds.length === 0) return [];
    const contentMap = new Map(collectionContent.map(item => [item.id, item]));
    return collectionItemIds
      .map(id => contentMap.get(id))
      .filter((item): item is HomebrewContent => Boolean(item));
  }, [collectionItemIds, collectionContent]);

  const handleCreateCollection = useCallback(async () => {
    if (!newCollectionName.trim()) return;
    await createCollectionMutation.mutateAsync({
      name: newCollectionName.trim(),
      description: newCollectionDescription.trim() || undefined,
    });
    setNewCollectionName('');
    setNewCollectionDescription('');
    setIsCreateCollectionOpen(false);
  }, [newCollectionName, newCollectionDescription, createCollectionMutation]);

  const handleDeleteCollection = useCallback(
    async (id: string) => {
      await deleteCollectionMutation.mutateAsync(id);
      if (selectedCollectionId === id) {
        setSelectedCollectionId(null);
      }
    },
    [deleteCollectionMutation, selectedCollectionId]
  );

  return {
    collections,
    isCollectionsLoading,
    visibleCollections,
    selectedCollectionId,
    setSelectedCollectionId,
    effectiveCollectionId,
    selectedCollection,
    orderedCollectionContent,
    isCollectionContentLoading:
      isCollectionItemsLoading || isCollectionContentLoading,
    isCreateCollectionOpen,
    setIsCreateCollectionOpen,
    newCollectionName,
    setNewCollectionName,
    newCollectionDescription,
    setNewCollectionDescription,
    handleCreateCollection,
    isCreatingCollection: createCollectionMutation.isPending,
    handleDeleteCollection,
    isDeletingCollection: deleteCollectionMutation.isPending,
  };
}
