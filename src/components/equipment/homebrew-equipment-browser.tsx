/**
 * Homebrew Equipment Browser
 *
 * Specialized browser for homebrew equipment (weapons, armor, wheelchairs)
 * that filters by equipmentType within the 'equipment' content type.
 */
import { HomebrewSourceTabs } from '@/components/shared/homebrew-source-tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check, Search, User } from '@/lib/icons';
import type { HomebrewContent } from '@/lib/schemas/homebrew';
import { cn } from '@/lib/utils';

import { useHomebrewEquipmentData } from './use-homebrew-equipment-data';

type EquipmentTypeFilter = 'weapon' | 'armor' | 'wheelchair';

interface HomebrewEquipmentBrowserProps<T> {
  equipmentType: EquipmentTypeFilter;
  campaignId?: string;
  selectedItem: T | null;
  onSelect: (item: T, contentId: string) => void;
  emptyMessage?: string;
}

interface EquipmentCardProps {
  content: HomebrewContent;
  isSelected: boolean;
  onClick: () => void;
}

function EquipmentCard({ content, isSelected, onClick }: EquipmentCardProps) {
  const equipment = content.content as {
    name: string;
    description?: string;
    tier?: string;
    equipmentType: string;
    trait?: string;
    range?: string;
    armorType?: string;
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-primary ring-2'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{equipment.name}</CardTitle>
          {isSelected && (
            <Badge variant="default" className="shrink-0">
              <Check className="mr-1 size-3" /> Selected
            </Badge>
          )}
        </div>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <User className="size-3" />
          <span>Homebrew {equipment.equipmentType}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {equipment.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {equipment.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1">
          {equipment.tier && (
            <Badge variant="secondary" className="text-xs">
              Tier {equipment.tier}
            </Badge>
          )}
          {equipment.trait && (
            <Badge variant="outline" className="text-xs">
              {equipment.trait}
            </Badge>
          )}
          {equipment.range && (
            <Badge variant="outline" className="text-xs">
              {equipment.range}
            </Badge>
          )}
          {equipment.armorType && (
            <Badge variant="outline" className="text-xs">
              {equipment.armorType}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function HomebrewEquipmentBrowser<T>({
  equipmentType,
  campaignId,
  selectedItem,
  onSelect,
  emptyMessage = 'No homebrew equipment found.',
}: HomebrewEquipmentBrowserProps<T>) {
  const {
    source,
    setSource,
    searchQuery,
    setSearchQuery,
    filteredItems,
    isLoading,
    hasCampaign,
  } = useHomebrewEquipmentData({ equipmentType, campaignId });

  const handleSelect = (content: HomebrewContent) => {
    const extracted = content.content as unknown as T;
    onSelect(extracted, content.id);
  };

  const isItemSelected = (content: HomebrewContent) => {
    if (!selectedItem) return false;
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
          placeholder="Search homebrew equipment..."
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
          {filteredItems.map(content => (
            <EquipmentCard
              key={content.id}
              content={content}
              isSelected={isItemSelected(content)}
              onClick={() => handleSelect(content)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
