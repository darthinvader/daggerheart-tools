import { useMemo } from 'react';

import {
  type HomebrewSource,
  HomebrewSourceTabs,
} from '@/components/shared/homebrew-source-tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampaignHomebrewContentData } from '@/hooks/use-campaign-homebrew-content-data';
import { Library, Package, Search, User, Zap } from '@/lib/icons';
import type { DomainCard } from '@/lib/schemas/domains';
import type { HomebrewDomainCard } from '@/lib/schemas/homebrew';
import { cn } from '@/lib/utils';

import { campaignHomebrewToDomainCard } from './loadout-utils';

// ─────────────────────────────────────────────────────────────────────────────
// Homebrew Domain Card Item Component
// ─────────────────────────────────────────────────────────────────────────────

interface HomebrewDomainCardItemProps {
  card: DomainCard;
  id: string;
  isInActive: boolean;
  isInVault: boolean;
  isActiveFull: boolean;
  isVaultFull: boolean;
  onToggleActive: (card: DomainCard) => void;
  onToggleVault: (card: DomainCard) => void;
}

function HomebrewDomainCardItem({
  card,
  id,
  isInActive,
  isInVault,
  isActiveFull,
  isVaultFull,
  onToggleActive,
  onToggleVault,
}: HomebrewDomainCardItemProps) {
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
              !isInActive && isActiveFull && 'cursor-not-allowed opacity-50'
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
              !isInVault && isVaultFull && 'cursor-not-allowed opacity-50'
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
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty State Component
// ─────────────────────────────────────────────────────────────────────────────

function HomebrewCardsEmptyState({ source }: { source: HomebrewSource }) {
  return (
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading State Component
// ─────────────────────────────────────────────────────────────────────────────

function HomebrewCardsLoadingState() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Grid Component
// ─────────────────────────────────────────────────────────────────────────────

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
  const {
    source,
    setSource,
    searchQuery,
    setSearchQuery,
    items,
    isLoading,
    hasCampaign,
  } = useCampaignHomebrewContentData({
    contentType: 'domain_card',
    campaignId,
  });

  // Convert homebrew content to DomainCard format
  const availableCards = useMemo(() => {
    return items.map(h => ({
      card: campaignHomebrewToDomainCard(h as unknown as HomebrewDomainCard),
      id: h.id,
    }));
  }, [items]);

  // Filter by search (including domain field)
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
        <HomebrewCardsLoadingState />
      ) : filteredCards.length === 0 ? (
        <HomebrewCardsEmptyState source={source} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map(({ card, id }) => (
            <HomebrewDomainCardItem
              key={id}
              card={card}
              id={id}
              isInActive={activeCardNames.has(card.name)}
              isInVault={vaultCardNames.has(card.name)}
              isActiveFull={isActiveFull}
              isVaultFull={isVaultFull}
              onToggleActive={onToggleActive}
              onToggleVault={onToggleVault}
            />
          ))}
        </div>
      )}
    </div>
  );
}
