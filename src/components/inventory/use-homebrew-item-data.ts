// Hook for homebrew item data fetching in the item picker

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
import type { AnyItem, EquipmentTier, Rarity } from '@/lib/schemas/equipment';
import type {
  HomebrewContent,
  HomebrewItemContent,
  ItemCategory,
} from '@/lib/schemas/homebrew';

interface UseHomebrewItemDataOptions {
  campaignId?: string;
}

export interface HomebrewItemWithMeta {
  item: AnyItem;
  contentId: string;
  content: HomebrewContent;
}

/**
 * Convert a HomebrewContent of type 'item' to AnyItem format
 */
function homebrewContentToAnyItem(content: HomebrewContent): AnyItem {
  const itemContent = content.content as HomebrewItemContent;
  return {
    id: `homebrew-${content.id}`,
    name: itemContent.name,
    description: itemContent.description ?? '',
    tier: (itemContent.tier ?? '1') as EquipmentTier,
    category: itemContent.category as ItemCategory,
    rarity: (itemContent.rarity ?? 'Common') as Rarity,
    features: itemContent.features ?? [],
    maxQuantity: itemContent.maxQuantity ?? 1,
    isConsumable: itemContent.isConsumable ?? false,
    isHomebrew: true,
  } as unknown as AnyItem;
}

/**
 * Wrap a HomebrewContent item with its converted AnyItem representation and metadata.
 */
function toHomebrewItemWithMeta(
  content: HomebrewContent
): HomebrewItemWithMeta {
  return {
    item: homebrewContentToAnyItem(content),
    contentId: content.id,
    content,
  };
}

/**
 * Check whether a single item matches a lowercase search query.
 */
function matchesSearchQuery(
  { item, content }: HomebrewItemWithMeta,
  query: string
): boolean {
  return (
    item.name.toLowerCase().includes(query) ||
    content.name.toLowerCase().includes(query) ||
    (item.description?.toLowerCase().includes(query) ?? false)
  );
}

/**
 * Check whether an item's category is included in allowedCategories.
 */
function matchesCategory(
  content: HomebrewContent,
  allowedCategories: ItemCategory[]
): boolean {
  const itemContent = content.content as HomebrewItemContent;
  return allowedCategories.includes(itemContent.category as ItemCategory);
}

/**
 * Check whether an item's rarity is included in allowedRarities.
 */
function matchesRarity(
  content: HomebrewContent,
  allowedRarities: Rarity[]
): boolean {
  const itemContent = content.content as HomebrewItemContent;
  return allowedRarities.includes((itemContent.rarity ?? 'Common') as Rarity);
}

/**
 * Check whether an item's tier is included in allowedTiers.
 */
function matchesTier(
  content: HomebrewContent,
  allowedTiers: EquipmentTier[]
): boolean {
  const itemContent = content.content as HomebrewItemContent;
  return allowedTiers.includes((itemContent.tier ?? '1') as EquipmentTier);
}

/**
 * Apply all active filters (search, category, rarity, tier) to a list of items.
 */
function applyFilters(
  items: HomebrewItemWithMeta[],
  searchQuery: string,
  selectedCategories: ItemCategory[],
  selectedRarities: Rarity[],
  selectedTiers: EquipmentTier[]
): HomebrewItemWithMeta[] {
  const query = searchQuery.trim().toLowerCase();

  return items.filter(entry => {
    if (query && !matchesSearchQuery(entry, query)) return false;
    if (
      selectedCategories.length > 0 &&
      !matchesCategory(entry.content, selectedCategories)
    )
      return false;
    if (
      selectedRarities.length > 0 &&
      !matchesRarity(entry.content, selectedRarities)
    )
      return false;
    if (selectedTiers.length > 0 && !matchesTier(entry.content, selectedTiers))
      return false;
    return true;
  });
}

/**
 * Generic toggle helper: adds the value if absent, removes it if present.
 */
function toggleArrayValue<T>(prev: T[], value: T): T[] {
  return prev.includes(value)
    ? prev.filter(v => v !== value)
    : [...prev, value];
}

interface SourceData {
  items: HomebrewContent[];
  isLoading: boolean;
}

/**
 * Resolve the items and loading state for a given source using a lookup map.
 */
function resolveSourceData(
  source: HomebrewSource,
  sourceMap: Record<string, SourceData>
): SourceData {
  const entry = sourceMap[source];
  if (!entry) {
    return { items: [], isLoading: false };
  }
  return entry;
}

/**
 * Filter an array of HomebrewContent to only those with contentType 'item'.
 */
function filterItemContent(items: HomebrewContent[]): HomebrewContent[] {
  return items.filter(item => item.contentType === 'item');
}

export function useHomebrewItemData({
  campaignId,
}: UseHomebrewItemDataOptions) {
  const hasCampaign = Boolean(campaignId);
  const [source, setSource] = useState<HomebrewSource>(
    hasCampaign ? 'linked' : 'public'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>(
    []
  );
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<EquipmentTier[]>([]);

  // Fetch from different sources based on selection
  const { data: campaignContent, isLoading: loadingCampaign } =
    useCampaignHomebrewContent(source === 'linked' ? campaignId : undefined, {
      contentType: 'item',
    });

  const { data: publicContent, isLoading: loadingPublic } =
    usePublicHomebrewContent(
      source === 'public'
        ? { contentType: 'item' }
        : { contentType: 'item', limit: 0 }
    );

  const { data: myContent, isLoading: loadingMine } = useMyHomebrewContent(
    source === 'private'
      ? { contentType: 'item' }
      : { contentType: 'item', limit: 0 }
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

  // Filter quicklist content by contentType 'item'
  const filteredQuicklistContent = useMemo(() => {
    return filterItemContent(quicklistContent);
  }, [quicklistContent]);

  // Combine data based on source using a lookup map
  const { items, isLoading } = useMemo(() => {
    const sourceMap: Record<string, SourceData> = {
      linked: {
        items: filterItemContent(campaignContent?.items ?? []),
        isLoading: loadingCampaign,
      },
      public: {
        items: filterItemContent(publicContent?.items ?? []),
        isLoading: loadingPublic,
      },
      private: {
        items: filterItemContent(myContent?.items ?? []),
        isLoading: loadingMine,
      },
      quicklist: {
        items: filteredQuicklistContent,
        isLoading: loadingQuicklist,
      },
    };

    return resolveSourceData(source, sourceMap);
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

  // Convert to AnyItem format and apply filters
  const filteredItems = useMemo(() => {
    const mapped = items.map(toHomebrewItemWithMeta);
    return applyFilters(
      mapped,
      searchQuery,
      selectedCategories,
      selectedRarities,
      selectedTiers
    );
  }, [items, searchQuery, selectedCategories, selectedRarities, selectedTiers]);

  const toggleCategory = (category: ItemCategory) => {
    setSelectedCategories(prev => toggleArrayValue(prev, category));
  };

  const toggleRarity = (rarity: Rarity) => {
    setSelectedRarities(prev => toggleArrayValue(prev, rarity));
  };

  const toggleTier = (tier: EquipmentTier) => {
    setSelectedTiers(prev => toggleArrayValue(prev, tier));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRarities([]);
    setSelectedTiers([]);
    setSearchQuery('');
  };

  const activeFilterCount =
    selectedCategories.length + selectedRarities.length + selectedTiers.length;

  return {
    source,
    setSource,
    searchQuery,
    setSearchQuery,
    filteredItems,
    isLoading,
    hasCampaign,
    selectedCategories,
    selectedRarities,
    selectedTiers,
    toggleCategory,
    toggleRarity,
    toggleTier,
    clearFilters,
    activeFilterCount,
  };
}
