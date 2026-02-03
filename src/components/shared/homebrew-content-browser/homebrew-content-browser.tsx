import { HomebrewSourceTabs } from '@/components/shared/homebrew-source-tabs';
import { Input } from '@/components/ui/input';
import { useCampaignHomebrewContentData } from '@/hooks/use-campaign-homebrew-content-data';
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
  const {
    source,
    setSource,
    searchQuery,
    setSearchQuery,
    filteredItems,
    isLoading,
    hasCampaign,
  } = useCampaignHomebrewContentData({ contentType, campaignId });

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
