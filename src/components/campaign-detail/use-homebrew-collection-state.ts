/**
 * Homebrew Collection State Hook
 *
 * Manages collection selection and content for HomebrewTabContent.
 */
import { useMemo, useState } from 'react';

import {
  useCollectionItems,
  useHomebrewCollections,
  useHomebrewContentBatch,
} from '@/features/homebrew';
import type { HomebrewContent } from '@/lib/schemas/homebrew';

export function useHomebrewCollectionState() {
  // Query collections
  const { data: collections = [], isLoading: isCollectionsLoading } =
    useHomebrewCollections();

  // Filter visible collections
  const visibleCollections = useMemo(
    () => collections.filter(collection => !collection.isQuicklist),
    [collections]
  );

  // Selection state
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

  // Compute effective collection ID
  const effectiveCollectionId = useMemo(() => {
    if (
      selectedCollectionId &&
      visibleCollections.some(c => c.id === selectedCollectionId)
    ) {
      return selectedCollectionId;
    }
    return visibleCollections[0]?.id ?? null;
  }, [selectedCollectionId, visibleCollections]);

  // Get selected collection
  const selectedCollection = useMemo(
    () => visibleCollections.find(c => c.id === effectiveCollectionId) ?? null,
    [visibleCollections, effectiveCollectionId]
  );

  // Fetch collection items
  const { data: collectionItems = [], isLoading: isCollectionItemsLoading } =
    useCollectionItems(effectiveCollectionId ?? undefined);

  const collectionItemIds = useMemo(
    () => collectionItems.map(item => item.homebrewId),
    [collectionItems]
  );

  // Fetch collection content
  const {
    data: collectionContent = [],
    isLoading: isCollectionContentLoading,
  } = useHomebrewContentBatch(collectionItemIds, !!effectiveCollectionId);

  // Order content by collection order
  const orderedCollectionContent = useMemo(() => {
    if (collectionItemIds.length === 0) return [];
    const contentMap = new Map(collectionContent.map(item => [item.id, item]));
    return collectionItemIds
      .map(id => contentMap.get(id))
      .filter((item): item is HomebrewContent => Boolean(item));
  }, [collectionItemIds, collectionContent]);

  return {
    collections,
    visibleCollections,
    selectedCollection,
    effectiveCollectionId,
    setSelectedCollectionId,
    orderedCollectionContent,
    isCollectionsLoading,
    isCollectionItemsLoading,
    isCollectionContentLoading,
  };
}
