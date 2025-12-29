import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { filterCards } from '@/features/characters/logic/domains';
import { ALL_DOMAIN_NAMES, getAllDomainCards } from '@/lib/data/domains';
import type { DomainCard } from '@/lib/schemas/domains';

import { CardSearchFilters } from './card-search-filters';
import { DomainCardListItem } from './domain-card-list-item';

export type DomainCardSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cardName: string) => void;
  targetLevel: number;
  allowedDomains?: string[];
  ownedCardNames?: string[];
};

export function DomainCardSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  targetLevel,
  allowedDomains,
  ownedCardNames = [],
}: DomainCardSelectionModalProps) {
  const [selectedCard, setSelectedCard] = useState<DomainCard | null>(null);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredCards = useMemo(() => {
    const allCards = getAllDomainCards();
    const levelFiltered = allCards.filter(c => c.level <= targetLevel);
    const notOwned = levelFiltered.filter(
      c => !ownedCardNames.includes(c.name)
    );
    return filterCards(notOwned, {
      allowedDomains,
      domain: domainFilter,
      type: typeFilter,
      search,
    });
  }, [
    targetLevel,
    allowedDomains,
    domainFilter,
    typeFilter,
    search,
    ownedCardNames,
  ]);

  const availableDomains = useMemo(() => {
    if (allowedDomains && allowedDomains.length > 0) {
      return allowedDomains;
    }
    return ALL_DOMAIN_NAMES.filter(name => {
      const cards = getAllDomainCards().filter(
        c => String(c.domain) === name && c.level <= targetLevel
      );
      return cards.length > 0;
    });
  }, [allowedDomains, targetLevel]);

  const resetState = () => {
    setSelectedCard(null);
    setSearch('');
    setDomainFilter('All');
    setTypeFilter('All');
  };

  const handleConfirm = () => {
    if (selectedCard) {
      onConfirm(selectedCard.name);
      resetState();
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select a Domain Card</DialogTitle>
          <DialogDescription>
            Choose a domain card at or below level {targetLevel}.
          </DialogDescription>
        </DialogHeader>

        <CardSearchFilters
          search={search}
          onSearchChange={setSearch}
          domainFilter={domainFilter}
          onDomainFilterChange={setDomainFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          availableDomains={availableDomains}
        />

        <div className="max-h-[400px] min-h-[200px] flex-1 space-y-2 overflow-y-auto pr-2">
          {filteredCards.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No cards found matching your criteria.
            </p>
          ) : (
            filteredCards.map(card => (
              <DomainCardListItem
                key={card.name}
                card={card}
                isSelected={selectedCard?.name === card.name}
                onClick={() => setSelectedCard(card)}
              />
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedCard}>
            Select Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
