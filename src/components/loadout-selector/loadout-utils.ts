import {
  ALL_DOMAIN_NAMES,
  getAllDomainCards,
  getCardsForDomainsAndLevel,
  sortCardsByLevel,
} from '@/lib/data/domains';
import type { DomainCard } from '@/lib/schemas/domains';
import type { HomebrewDomainCard, LoadoutMode } from '@/lib/schemas/loadout';

export function getAvailableCards(
  mode: LoadoutMode,
  classDomains: string[],
  maxCardLevel: number,
  selectedDomains: string[],
  homebrewCards: HomebrewDomainCard[]
): DomainCard[] {
  const allCards =
    mode === 'class-domains'
      ? getCardsForDomainsAndLevel(classDomains, maxCardLevel)
      : getAllDomainCards().filter(c => c.level <= maxCardLevel);

  const filtered = allCards.filter(card =>
    selectedDomains.includes(card.domain)
  );

  const combinedCards = [
    ...filtered,
    ...homebrewCards.filter(c => selectedDomains.includes(c.domain)),
  ] as DomainCard[];

  return sortCardsByLevel(combinedCards);
}

export { ALL_DOMAIN_NAMES };
