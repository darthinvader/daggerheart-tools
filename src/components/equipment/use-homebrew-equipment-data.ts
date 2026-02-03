// Extracted hook for homebrew equipment browser data fetching

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
import type { HomebrewContent } from '@/lib/schemas/homebrew';

type EquipmentTypeFilter = 'weapon' | 'armor' | 'wheelchair';

interface UseHomebrewEquipmentDataOptions {
  equipmentType: EquipmentTypeFilter;
  campaignId?: string;
}

export function useHomebrewEquipmentData({
  equipmentType,
  campaignId,
}: UseHomebrewEquipmentDataOptions) {
  const hasCampaign = Boolean(campaignId);
  const [source, setSource] = useState<HomebrewSource>(
    hasCampaign ? 'linked' : 'public'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch from different sources based on selection
  const { data: campaignContent, isLoading: loadingCampaign } =
    useCampaignHomebrewContent(source === 'linked' ? campaignId : undefined, {
      contentType: 'equipment',
    });

  const { data: publicContent, isLoading: loadingPublic } =
    usePublicHomebrewContent(
      source === 'public'
        ? { contentType: 'equipment' }
        : { contentType: 'equipment', limit: 0 }
    );

  const { data: myContent, isLoading: loadingMine } = useMyHomebrewContent(
    source === 'private'
      ? { contentType: 'equipment' }
      : { contentType: 'equipment', limit: 0 }
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

  // Filter quicklist content by contentType and equipmentType
  const filteredQuicklistContent = useMemo(() => {
    return quicklistContent.filter(item => {
      if (item.contentType !== 'equipment') return false;
      const content = item.content as { equipmentType?: string };
      return content.equipmentType === equipmentType;
    });
  }, [quicklistContent, equipmentType]);

  // Combine data based on source and filter by equipmentType
  const { items, isLoading } = useMemo(() => {
    let sourceItems: HomebrewContent[] = [];
    let loading = false;

    switch (source) {
      case 'linked':
        sourceItems = campaignContent?.items ?? [];
        loading = loadingCampaign;
        break;
      case 'public':
        sourceItems = publicContent?.items ?? [];
        loading = loadingPublic;
        break;
      case 'private':
        sourceItems = myContent?.items ?? [];
        loading = loadingMine;
        break;
      case 'quicklist':
        return { items: filteredQuicklistContent, isLoading: loadingQuicklist };
    }

    // Filter by equipmentType
    const filtered = sourceItems.filter(item => {
      const content = item.content as { equipmentType?: string };
      return content.equipmentType === equipmentType;
    });

    return { items: filtered, isLoading: loading };
  }, [
    source,
    campaignContent,
    publicContent,
    myContent,
    filteredQuicklistContent,
    equipmentType,
    loadingCampaign,
    loadingPublic,
    loadingMine,
    loadingQuicklist,
  ]);

  // Filter by search query
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
    filteredItems,
    isLoading,
    hasCampaign,
  };
}
