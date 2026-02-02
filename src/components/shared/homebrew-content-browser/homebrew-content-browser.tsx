import { useMemo, useState } from 'react';

import {
  type HomebrewSource,
  HomebrewSourceTabs,
} from '@/components/shared/homebrew-source-tabs';
import { Input } from '@/components/ui/input';
import {
  useCampaignHomebrewContent,
  useCollectionItems,
  useHomebrewContentBatch,
  useMyHomebrewContent,
  usePublicHomebrewContent,
  useQuicklist,
} from '@/features/homebrew/use-homebrew-query';
import { Search } from '@/lib/icons';
import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';

interface HomebrewContentBrowserProps<T> {
  contentType: HomebrewContentType;
  campaignId?: string;
  selectedItem: T | null;
  onSelect: (item: T, contentId: string) => void;
  renderItem: (
    item: HomebrewContent,
    isSelected: boolean,
    onSelect: () => void
  ) => React.ReactNode;
  emptyMessage?: string;
  extractContent?: (content: HomebrewContent) => T;
  matchSelected?: (content: HomebrewContent, selected: T | null) => boolean;
}

export function HomebrewContentBrowser<T>({
  contentType,
  campaignId,
  selectedItem,
  onSelect,
  renderItem,
  emptyMessage = 'No homebrew content found.',
  extractContent,
  matchSelected,
}: HomebrewContentBrowserProps<T>) {
  const hasCampaign = Boolean(campaignId);
  const [source, setSource] = useState<HomebrewSource>(
    hasCampaign ? 'linked' : 'public'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch from different sources based on selection
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

  // Combine data based on source
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
        return { items: [], isLoading: false };
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

  // Filter by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => item.name.toLowerCase().includes(query));
  }, [items, searchQuery]);

  const handleSelect = (content: HomebrewContent) => {
    const extracted = extractContent
      ? extractContent(content)
      : (content.content as T);
    onSelect(extracted, content.id);
  };

  const isItemSelected = (content: HomebrewContent) => {
    if (matchSelected) return matchSelected(content, selectedItem);
    if (!selectedItem) return false;
    // Default: compare by name
    const contentData = content.content as { name?: string };
    const selectedData = selectedItem as { name?: string };
    return contentData?.name === selectedData?.name;
  };

  return (
    <div className="space-y-4">
      <HomebrewSourceTabs
        activeSource={source}
        onSourceChange={setSource}
        hasCampaign={hasCampaign}
      />

      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search homebrew content..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-muted h-32 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredItems.map(content =>
            renderItem(content, isItemSelected(content), () =>
              handleSelect(content)
            )
          )}
        </div>
      )}
    </div>
  );
}
