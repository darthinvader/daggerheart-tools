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
    return quicklistContent.filter(item => item.contentType === 'item');
  }, [quicklistContent]);

  // Combine data based on source
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

    // Filter by contentType 'item'
    const filtered = sourceItems.filter(item => item.contentType === 'item');

    return { items: filtered, isLoading: loading };
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
    let result = items.map(content => ({
      item: homebrewContentToAnyItem(content),
      contentId: content.id,
      content,
    }));

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        ({ item, content }) =>
          item.name.toLowerCase().includes(query) ||
          content.name.toLowerCase().includes(query) ||
          (item.description?.toLowerCase().includes(query) ?? false)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(({ content }) => {
        const itemContent = content.content as HomebrewItemContent;
        return selectedCategories.includes(
          itemContent.category as ItemCategory
        );
      });
    }

    // Apply rarity filter
    if (selectedRarities.length > 0) {
      result = result.filter(({ content }) => {
        const itemContent = content.content as HomebrewItemContent;
        return selectedRarities.includes(
          (itemContent.rarity ?? 'Common') as Rarity
        );
      });
    }

    // Apply tier filter
    if (selectedTiers.length > 0) {
      result = result.filter(({ content }) => {
        const itemContent = content.content as HomebrewItemContent;
        return selectedTiers.includes(
          (itemContent.tier ?? '1') as EquipmentTier
        );
      });
    }

    return result;
  }, [items, searchQuery, selectedCategories, selectedRarities, selectedTiers]);

  const toggleCategory = (category: ItemCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleRarity = (rarity: Rarity) => {
    setSelectedRarities(prev =>
      prev.includes(rarity) ? prev.filter(r => r !== rarity) : [...prev, rarity]
    );
  };

  const toggleTier = (tier: EquipmentTier) => {
    setSelectedTiers(prev =>
      prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
    );
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
