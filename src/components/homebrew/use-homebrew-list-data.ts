/**
 * Extracted hook for HomebrewList data fetching and mutations.
 * Reduces complexity in HomebrewList component.
 */
import { useCallback, useMemo } from 'react';

import { useCampaigns } from '@/features/campaigns/use-campaign-query';
import { useCharactersQuery } from '@/features/characters/use-characters-query';
import {
  useAddHomebrewToCollection,
  useCreateHomebrewCollection,
  useHomebrewCollections,
  useLinkHomebrewToCampaign,
  useLinkHomebrewToCharacter,
  useMyHomebrewStars,
  useToggleHomebrewStar,
} from '@/features/homebrew';
import type { HomebrewContent } from '@/lib/schemas/homebrew';

interface UseHomebrewListDataOptions {
  items: HomebrewContent[];
  currentUserId?: string;
}

export function useHomebrewListData({
  items,
  currentUserId,
}: UseHomebrewListDataOptions) {
  // Starred items
  const homebrewIds = useMemo(() => items.map(item => item.id), [items]);
  const { data: starredIds = [] } = useMyHomebrewStars(
    currentUserId ? homebrewIds : []
  );
  const starredSet = useMemo(() => new Set(starredIds), [starredIds]);
  const toggleStar = useToggleHomebrewStar();

  // Collections
  const { data: collections = [] } = useHomebrewCollections(!!currentUserId);
  const createCollection = useCreateHomebrewCollection();
  const addToCollection = useAddHomebrewToCollection();

  // Linking mutations
  const linkToCampaign = useLinkHomebrewToCampaign();
  const linkToCharacter = useLinkHomebrewToCharacter();

  // Campaigns and characters for dialogs
  const { data: campaigns = [] } = useCampaigns();
  const { data: characters = [] } = useCharactersQuery();

  const gmCampaigns = useMemo(
    () => campaigns.filter(campaign => campaign.gmId === currentUserId),
    [campaigns, currentUserId]
  );

  const handleToggleStar = useCallback(
    (item: HomebrewContent) => {
      toggleStar.mutate({
        homebrewId: item.id,
        isStarred: starredSet.has(item.id),
      });
    },
    [starredSet, toggleStar]
  );

  return {
    // Stars
    starredSet,
    handleToggleStar,
    // Collections
    collections,
    createCollection,
    addToCollection,
    // Linking
    linkToCampaign,
    linkToCharacter,
    // Data for dialogs
    gmCampaigns,
    characters,
  };
}
