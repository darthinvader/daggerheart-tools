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
  const filteredQuicklistContent = useMemo(() => {
    return quicklistContent.filter(item => item.contentType === contentType);
  }, [quicklistContent, contentType]);

  // Combine items based on source
  const { items, isLoading } = useMemo(() => {
    switch (source) {
      case 'linked':
        return {
          items: campaignContent?.items ?? [],
          isLoading: loadingCampaign,
        };
      case 'public':
        return { items: publicContent?.items ?? [], isLoading: loadingPublic };
      case 'private':
        return { items: myContent?.items ?? [], isLoading: loadingMine };
      case 'quicklist':
        return { items: filteredQuicklistContent, isLoading: loadingQuicklist };
      default:
        return { items: [] as HomebrewContent[], isLoading: false };
    }
  }, [
    source,
    campaignContent,
    publicContent,
    myContent,
    filteredQuicklistContent,
    loadingCampaign,
    loadingPublic,
    loadingMine,
    loadingQuicklist,
  ]);

  // Filter by search query (using name field)
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => item.name.toLowerCase().includes(query));
  }, [items, searchQuery]);

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
