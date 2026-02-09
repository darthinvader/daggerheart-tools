// Generic hook for campaign homebrew content fetching by content type

import { useMemo, useState } from 'react';

import type { HomebrewSource } from '@/components/shared/homebrew-source-tabs';
import {
  useCampaignHomebrewContent,
  useCollectionItems,
  useHomebrewContentBatch,
  useMyHomebrewContent,
  usePublicHomebrewContent,
  useQuicklist,
} from '@/features/homebrew/use-homebrew-query';
import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';

function filterByContentType(
  items: HomebrewContent[],
  contentType: HomebrewContentType
): HomebrewContent[] {
  return items.filter(item => item.contentType === contentType);
}

interface SourceData {
  campaignItems: HomebrewContent[];
  publicItems: HomebrewContent[];
  myItems: HomebrewContent[];
  quicklistItems: HomebrewContent[];
  loadingCampaign: boolean;
  loadingPublic: boolean;
  loadingMine: boolean;
  loadingQuicklist: boolean;
}

function resolveSourceItems(
  source: HomebrewSource,
  data: SourceData
): { items: HomebrewContent[]; isLoading: boolean } {
  switch (source) {
    case 'linked':
      return { items: data.campaignItems, isLoading: data.loadingCampaign };
    case 'public':
      return { items: data.publicItems, isLoading: data.loadingPublic };
    case 'private':
      return { items: data.myItems, isLoading: data.loadingMine };
    case 'quicklist':
      return { items: data.quicklistItems, isLoading: data.loadingQuicklist };
    default:
      return { items: [], isLoading: false };
  }
}

function filterBySearchQuery(
  items: HomebrewContent[],
  searchQuery: string
): HomebrewContent[] {
  const trimmed = searchQuery.trim();
  if (!trimmed) return items;
  const query = trimmed.toLowerCase();
  return items.filter(item => item.name.toLowerCase().includes(query));
}

interface UseCampaignHomebrewContentDataOptions {
  contentType: HomebrewContentType;
  campaignId?: string;
}

export function useCampaignHomebrewContentData({
  contentType,
  campaignId,
}: UseCampaignHomebrewContentDataOptions) {
  const hasCampaign = Boolean(campaignId);
  const [source, setSource] = useState<HomebrewSource>(
    hasCampaign ? 'linked' : 'public'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch from different sources
  const { data: campaignContent, isLoading: loadingCampaign } =
    useCampaignHomebrewContent(source === 'linked' ? campaignId : undefined, {
      contentType,
    });

  const { data: publicContent, isLoading: loadingPublic } =
    usePublicHomebrewContent(
      source === 'public' ? { contentType } : { contentType, limit: 0 }
    );

  const { data: myContent, isLoading: loadingMine } = useMyHomebrewContent(
    source === 'private' ? { contentType } : { contentType, limit: 0 }
  );

  const { data: quicklist } = useQuicklist();
  const { data: quicklistItems } = useCollectionItems(
    source === 'quicklist' && quicklist ? quicklist.id : undefined
  );

  // Fetch actual content for quicklist items
  const quicklistItemIds = useMemo(
    () => quicklistItems?.map(item => item.homebrewId) ?? [],
    [quicklistItems]
  );
  const { data: quicklistContent = [], isLoading: loadingQuicklist } =
    useHomebrewContentBatch(
      quicklistItemIds,
      source === 'quicklist' && quicklistItemIds.length > 0
    );

  // Filter quicklist content by contentType
  const filteredQuicklistContent = useMemo(
    () => filterByContentType(quicklistContent, contentType),
    [quicklistContent, contentType]
  );

  // Combine items based on source
  const { items, isLoading } = useMemo(
    () =>
      resolveSourceItems(source, {
        campaignItems: campaignContent?.items ?? [],
        publicItems: publicContent?.items ?? [],
        myItems: myContent?.items ?? [],
        quicklistItems: filteredQuicklistContent,
        loadingCampaign,
        loadingPublic,
        loadingMine,
        loadingQuicklist,
      }),
    [
      source,
      campaignContent,
      publicContent,
      myContent,
      filteredQuicklistContent,
      loadingCampaign,
      loadingPublic,
      loadingMine,
      loadingQuicklist,
    ]
  );

  // Filter by search query (using name field)
  const filteredItems = useMemo(
    () => filterBySearchQuery(items, searchQuery),
    [items, searchQuery]
  );

  return {
    source,
    setSource,
    searchQuery,
    setSearchQuery,
    items,
    filteredItems,
    isLoading,
    hasCampaign,
  };
}
