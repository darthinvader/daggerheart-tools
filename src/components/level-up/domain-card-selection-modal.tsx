import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { filterCards } from '@/features/characters/logic/domains';
import {
  ALL_DOMAIN_NAMES,
  getAllDomainCards,
  getCardRecallCost,
} from '@/lib/data/domains';
import type { DomainCard } from '@/lib/schemas/domains';
import { cn } from '@/lib/utils';

export type DomainCardSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cardName: string) => void;
  targetLevel: number;
  allowedDomains?: string[];
};

export function DomainCardSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  targetLevel,
  allowedDomains,
}: DomainCardSelectionModalProps) {
  const [selectedCard, setSelectedCard] = useState<DomainCard | null>(null);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredCards = useMemo(() => {
    const allCards = getAllDomainCards();
    const levelFiltered = allCards.filter(c => c.level <= targetLevel);
    return filterCards(levelFiltered, {
      allowedDomains,
      domain: domainFilter,
      type: typeFilter,
      search,
    });
  }, [targetLevel, allowedDomains, domainFilter, typeFilter, search]);

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

  const handleConfirm = () => {
    if (selectedCard) {
      onConfirm(selectedCard.name);
      setSelectedCard(null);
      setSearch('');
      setDomainFilter('All');
      setTypeFilter('All');
    }
  };

  const handleClose = () => {
    setSelectedCard(null);
    setSearch('');
    setDomainFilter('All');
    setTypeFilter('All');
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

        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search cards..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="min-w-[150px] flex-1"
          />
          <Select value={domainFilter} onValueChange={setDomainFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Domains</SelectItem>
              {availableDomains.map(d => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Spell">Spell</SelectItem>
              <SelectItem value="Ability">Ability</SelectItem>
              <SelectItem value="Grimoire">Grimoire</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="max-h-[400px] min-h-[200px] flex-1 space-y-2 overflow-y-auto pr-2">
          {filteredCards.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No cards found matching your criteria.
            </p>
          ) : (
            filteredCards.map(card => (
              <div
                key={card.name}
                className={cn(
                  'cursor-pointer rounded-lg border p-3 transition-colors',
                  selectedCard?.name === card.name
                    ? 'border-primary bg-primary/10'
                    : 'hover:bg-muted/50'
                )}
                onClick={() => setSelectedCard(card)}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{card.name}</span>
                  <Badge variant="outline">Lvl {card.level}</Badge>
                  <Badge variant="secondary">{String(card.domain)}</Badge>
                  <Badge>{String(card.type)}</Badge>
                  <Badge variant="outline">
                    Recall: {getCardRecallCost(card)} Stress
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">
                  {card.description}
                </p>
              </div>
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
