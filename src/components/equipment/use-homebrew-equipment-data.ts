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

/** Check whether a homebrew content item matches the given equipment type. */
function matchesEquipmentType(
  item: HomebrewContent,
  equipmentType: EquipmentTypeFilter
): boolean {
  const content = item.content as { equipmentType?: string };
  return content.equipmentType === equipmentType;
}

/** Filter a list of homebrew content items to only those matching the equipment type. */
function filterByEquipmentType(
  items: HomebrewContent[],
  equipmentType: EquipmentTypeFilter
): HomebrewContent[] {
  return items.filter(item => matchesEquipmentType(item, equipmentType));
}

/** Filter items by a search query against the item name. */
function filterBySearchQuery(
  items: HomebrewContent[],
  searchQuery: string
): HomebrewContent[] {
  const trimmed = searchQuery.trim();
  if (!trimmed) return items;
  const query = trimmed.toLowerCase();
  return items.filter(item => item.name.toLowerCase().includes(query));
}

/** Build the equipment query params, fetching nothing when the source is not active. */
function equipmentQueryParams(isActive: boolean) {
  return isActive
    ? { contentType: 'equipment' as const }
    : { contentType: 'equipment' as const, limit: 0 };
}

interface SourceData {
  items: HomebrewContent[];
  isLoading: boolean;
}

/**
 * Resolve which source items and loading state to use based on the active source tab.
 * Returns null for 'quicklist' since it is handled separately.
 */
function resolveSourceData(
  source: HomebrewSource,
  dataMap: Record<string, SourceData>
): SourceData | null {
  return dataMap[source] ?? null;
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
    usePublicHomebrewContent(equipmentQueryParams(source === 'public'));

  const { data: myContent, isLoading: loadingMine } = useMyHomebrewContent(
    equipmentQueryParams(source === 'private')
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
      return matchesEquipmentType(item, equipmentType);
    });
  }, [quicklistContent, equipmentType]);

  // Combine data based on source and filter by equipmentType
  const { items, isLoading } = useMemo(() => {
    // Quicklist is pre-filtered and handled separately
    if (source === 'quicklist') {
      return { items: filteredQuicklistContent, isLoading: loadingQuicklist };
    }

    const sourceDataMap: Record<string, SourceData> = {
      linked: {
        items: campaignContent?.items ?? [],
        isLoading: loadingCampaign,
      },
      public: { items: publicContent?.items ?? [], isLoading: loadingPublic },
      private: { items: myContent?.items ?? [], isLoading: loadingMine },
    };

    const resolved = resolveSourceData(source, sourceDataMap);
    if (!resolved) {
      return { items: [], isLoading: false };
    }

    return {
      items: filterByEquipmentType(resolved.items, equipmentType),
      isLoading: resolved.isLoading,
    };
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
  const filteredItems = useMemo(
    () => filterBySearchQuery(items, searchQuery),
    [items, searchQuery]
  );

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
