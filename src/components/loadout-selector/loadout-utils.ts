import {
  ALL_DOMAIN_NAMES,
  getAllDomainCards,
  getCardsForDomainsAndLevel,
  sortCardsByLevel,
} from '@/lib/data/domains';
import type { DomainCard } from '@/lib/schemas/domains';
import type { HomebrewDomainCard as HomebrewDomainCardContent } from '@/lib/schemas/homebrew';
import type { HomebrewDomainCard, LoadoutMode } from '@/lib/schemas/loadout';

/**
 * Convert campaign homebrew domain card to the HomebrewDomainCard format used by loadout
 */
export function campaignHomebrewToDomainCard(
  homebrew: HomebrewDomainCardContent
): DomainCard {
  const content = homebrew.content;
  return {
    name: `${content.name} (Homebrew)`,
    level: content.level,
    domain: content.domain,
    type: content.type,
    hopeCost: content.hopeCost,
    recallCost: content.recallCost,
    stressCost: content.stressCost,
    description: content.description,
    tags: content.tags,
    metadata: {
      page: 0,
      source: 'Homebrew',
      license: '',
    },
  };
}

export function getAvailableCards(
  mode: LoadoutMode,
  classDomains: string[],
  maxCardLevel: number,
  selectedDomains: string[],
  homebrewCards: HomebrewDomainCard[],
  campaignHomebrewCards: DomainCard[] = []
): DomainCard[] {
  const allCards =
    mode === 'class-domains'
      ? getCardsForDomainsAndLevel(classDomains, maxCardLevel)
      : getAllDomainCards().filter(c => c.level <= maxCardLevel);

  const filtered = allCards.filter(card =>
    selectedDomains.includes(card.domain)
  );

  // Filter campaign homebrew cards by selected domains and max level
  const filteredCampaignCards = campaignHomebrewCards.filter(
    c => selectedDomains.includes(c.domain) && c.level <= maxCardLevel
  );

  const combinedCards = [
    ...filtered,
    ...homebrewCards.filter(c => selectedDomains.includes(c.domain)),
    ...filteredCampaignCards,
  ] as DomainCard[];

  return sortCardsByLevel(combinedCards);
}

export { ALL_DOMAIN_NAMES };
