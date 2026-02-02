import { useMemo, useState } from 'react';

import {
  type HomebrewSource,
  HomebrewSourceTabs,
} from '@/components/shared/homebrew-source-tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCampaignHomebrewContent,
  useCollectionItems,
  useHomebrewContentBatch,
  useMyHomebrewContent,
  usePublicHomebrewContent,
  useQuicklist,
} from '@/features/homebrew/use-homebrew-query';
import { Library, Package, Search, User, Zap } from '@/lib/icons';
import type { DomainCard } from '@/lib/schemas/domains';
import type {
  HomebrewContent,
  HomebrewDomainCard,
} from '@/lib/schemas/homebrew';
import { cn } from '@/lib/utils';

import { campaignHomebrewToDomainCard } from './loadout-utils';

interface HomebrewCardGridProps {
  campaignId?: string;
  activeCards: DomainCard[];
  vaultCards: DomainCard[];
  onToggleActive: (card: DomainCard) => void;
  onToggleVault: (card: DomainCard) => void;
  maxActiveCards: number;
  maxVaultCards?: number;
  activeCardNames: Set<string>;
  vaultCardNames: Set<string>;
}

export function CampaignHomebrewCardGrid({
  campaignId,
  activeCards,
  vaultCards,
  onToggleActive,
  onToggleVault,
  maxActiveCards,
  maxVaultCards,
  activeCardNames,
  vaultCardNames,
}: HomebrewCardGridProps) {
  const hasCampaign = Boolean(campaignId);
  const [source, setSource] = useState<HomebrewSource>(
    hasCampaign ? 'linked' : 'public'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch from different sources
  const { data: campaignContent, isLoading: loadingCampaign } =
    useCampaignHomebrewContent(source === 'linked' ? campaignId : undefined, {
      contentType: 'domain_card',
    });

  const { data: publicContent, isLoading: loadingPublic } =
    usePublicHomebrewContent(
      source === 'public'
        ? { contentType: 'domain_card' }
        : { contentType: 'domain_card', limit: 0 }
    );

  const { data: myContent, isLoading: loadingMine } = useMyHomebrewContent(
    source === 'private'
      ? { contentType: 'domain_card' }
      : { contentType: 'domain_card', limit: 0 }
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
    return quicklistContent.filter(item => item.contentType === 'domain_card');
  }, [quicklistContent]);

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

  // Convert homebrew content to DomainCard format
  const availableCards = useMemo(() => {
    return items.map((h: HomebrewContent) => ({
      card: campaignHomebrewToDomainCard(h as unknown as HomebrewDomainCard),
      id: h.id,
    }));
  }, [items]);

  // Filter by search
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return availableCards;
    const query = searchQuery.toLowerCase();
    return availableCards.filter(
      ({ card }) =>
        card.name.toLowerCase().includes(query) ||
        card.domain.toLowerCase().includes(query)
    );
  }, [availableCards, searchQuery]);

  const isActiveFull = activeCards.length >= maxActiveCards;
  const isVaultFull =
    maxVaultCards !== undefined && vaultCards.length >= maxVaultCards;

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
          placeholder="Search domain cards..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : filteredCards.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <Library className="text-muted-foreground mx-auto mb-3 size-12" />
            <h3 className="mb-2 font-semibold">No Homebrew Domain Cards</h3>
            <p className="text-muted-foreground text-sm">
              {source === 'linked'
                ? 'No homebrew domain cards have been linked to this campaign yet.'
                : source === 'quicklist'
                  ? 'No domain cards in your quicklist yet.'
                  : 'No homebrew domain cards found.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map(({ card, id }) => {
            const isInActive = activeCardNames.has(card.name);
            const isInVault = vaultCardNames.has(card.name);

            return (
              <Card
                key={id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  isInActive && 'ring-primary ring-2',
                  isInVault && 'ring-secondary ring-2'
                )}
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold">{card.name}</h4>
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <User className="size-3" />
                        <span>Homebrew Domain Card</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {isInActive && (
                        <Badge variant="default" className="text-xs">
                          <Zap className="mr-1 size-3" /> Active
                        </Badge>
                      )}
                      {isInVault && (
                        <Badge variant="secondary" className="text-xs">
                          <Package className="mr-1 size-3" /> Vault
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {card.domain}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Level {card.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {card.type}
                    </Badge>
                  </div>

                  {card.description && (
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {card.description}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      className={cn(
                        'flex-1 rounded px-2 py-1 text-xs font-medium transition-colors',
                        isInActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80',
                        !isInActive &&
                          isActiveFull &&
                          'cursor-not-allowed opacity-50'
                      )}
                      onClick={() => onToggleActive(card)}
                      disabled={!isInActive && isActiveFull}
                    >
                      <Zap className="mr-1 inline size-3" />
                      {isInActive ? 'Remove' : 'Add to Active'}
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'flex-1 rounded px-2 py-1 text-xs font-medium transition-colors',
                        isInVault
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted hover:bg-muted/80',
                        !isInVault &&
                          isVaultFull &&
                          'cursor-not-allowed opacity-50'
                      )}
                      onClick={() => onToggleVault(card)}
                      disabled={!isInVault && isVaultFull}
                    >
                      <Package className="mr-1 inline size-3" />
                      {isInVault ? 'Remove' : 'Add to Vault'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
