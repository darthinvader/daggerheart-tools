import { useMemo, useState } from 'react';

import { SearchInput } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DomainCardLite } from '@/lib/schemas/loadout';
import { countTotalRecallCost } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

import { LoadoutCardRow } from './loadout-card-row';
import {
  CardCountBadge,
  RecallCostFooter,
  SectionTitle,
} from './loadout-section-parts';

interface LoadoutSectionProps {
  title: string;
  emoji: string;
  cards: DomainCardLite[];
  location: 'active' | 'vault';
  maxCards: number;
  hasLimit: boolean;
  isFull: boolean;
  isSwapTarget: boolean;
  swapSourceCard: string | null;
  swapSourceLocation: 'active' | 'vault' | null;
  targetIsFull: boolean;
  borderClass: string;
  bgClass: string;
  fullTextClass: string;
  onMove: (cardName: string) => void;
  onRemove: (cardName: string) => void;
  onSelectSwapTarget: (cardName: string) => void;
  tooltipContent: string;
  canAdjustMax?: boolean;
  onDecreaseMax?: () => void;
  onIncreaseMax?: () => void;
}

export function LoadoutSection({
  title,
  emoji,
  cards,
  location,
  maxCards,
  hasLimit,
  isFull,
  isSwapTarget,
  swapSourceCard,
  swapSourceLocation,
  targetIsFull,
  borderClass,
  bgClass,
  fullTextClass,
  onMove,
  onRemove,
  onSelectSwapTarget,
  tooltipContent,
  canAdjustMax = false,
  onDecreaseMax,
  onIncreaseMax,
}: LoadoutSectionProps) {
  const [search, setSearch] = useState('');
  const totalRecall = countTotalRecallCost(cards);
  const inSwapMode = swapSourceCard !== null;

  const filteredCards = useMemo(() => {
    if (!search.trim()) return cards;
    const term = search.toLowerCase();
    return cards.filter(
      card =>
        card.name.toLowerCase().includes(term) ||
        card.domain.toLowerCase().includes(term) ||
        card.description?.toLowerCase().includes(term)
    );
  }, [cards, search]);

  const cardClassName = cn(
    borderClass,
    bgClass,
    'min-w-0 transition-all',
    isSwapTarget && 'border-amber-500 ring-2 ring-amber-500'
  );

  return (
    <Card className={cardClassName}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <SectionTitle
            emoji={emoji}
            title={title}
            isSwapTarget={isSwapTarget}
            tooltipContent={tooltipContent}
          />
          <CardCountBadge
            cards={cards}
            maxCards={maxCards}
            hasLimit={hasLimit}
            canAdjustMax={canAdjustMax}
            onDecreaseMax={onDecreaseMax}
            onIncreaseMax={onIncreaseMax}
          />
        </CardTitle>
        {cards.length > 3 && (
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={`Search ${location} cards...`}
            className="mt-2"
          />
        )}
      </CardHeader>
      <CardContent className="max-h-48 min-w-0 space-y-2 overflow-y-auto">
        <CardList
          cards={cards}
          filteredCards={filteredCards}
          location={location}
          search={search}
          swapSourceLocation={swapSourceLocation}
          swapSourceCard={swapSourceCard}
          isSwapTarget={isSwapTarget}
          targetIsFull={targetIsFull}
          inSwapMode={inSwapMode}
          onMove={onMove}
          onRemove={onRemove}
          onSelectSwapTarget={onSelectSwapTarget}
          totalRecall={totalRecall}
          isFull={isFull}
          fullTextClass={fullTextClass}
        />
      </CardContent>
    </Card>
  );
}

interface CardListProps {
  cards: DomainCardLite[];
  filteredCards: DomainCardLite[];
  location: 'active' | 'vault';
  search: string;
  swapSourceLocation: 'active' | 'vault' | null;
  swapSourceCard: string | null;
  isSwapTarget: boolean;
  targetIsFull: boolean;
  inSwapMode: boolean;
  onMove: (cardName: string) => void;
  onRemove: (cardName: string) => void;
  onSelectSwapTarget: (cardName: string) => void;
  totalRecall: number;
  isFull: boolean;
  fullTextClass: string;
}

function CardList({
  cards,
  filteredCards,
  location,
  search,
  swapSourceLocation,
  swapSourceCard,
  isSwapTarget,
  targetIsFull,
  inSwapMode,
  onMove,
  onRemove,
  onSelectSwapTarget,
  totalRecall,
  isFull,
  fullTextClass,
}: CardListProps) {
  if (cards.length === 0) {
    const msg =
      location === 'active'
        ? 'No active cards selected.'
        : 'No cards in vault.';
    return <p className="text-muted-foreground text-sm">{msg}</p>;
  }

  if (filteredCards.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No cards match "{search}"</p>
    );
  }

  return (
    <>
      {filteredCards.map(card => (
        <LoadoutCardRow
          key={card.name}
          card={card}
          location={location}
          isSwapSource={
            swapSourceLocation === location && swapSourceCard === card.name
          }
          isSwapTarget={isSwapTarget}
          targetIsFull={targetIsFull}
          onMove={onMove}
          onRemove={onRemove}
          onSelectSwapTarget={onSelectSwapTarget}
          inSwapMode={inSwapMode}
        />
      ))}
      <RecallCostFooter
        totalRecall={totalRecall}
        location={location}
        isFull={isFull}
        fullTextClass={fullTextClass}
      />
    </>
  );
}
