import type { DomainCard } from '@/lib/schemas/domains';
import type { DomainCardLite, HomebrewDomainCard } from '@/lib/schemas/loadout';

export function cardToLite(card: DomainCard): DomainCardLite {
  return {
    name: card.name,
    level: card.level,
    domain: card.domain,
    type: card.type,
    description: card.description,
    hopeCost: card.hopeCost,
    recallCost: card.recallCost,
    tags: card.tags,
    isHomebrew: false,
  };
}

export function homebrewToLite(card: HomebrewDomainCard): DomainCardLite {
  return {
    name: card.name,
    level: card.level,
    domain: card.domain,
    type: card.type,
    description: card.description,
    hopeCost: card.hopeCost,
    recallCost: card.recallCost,
    tags: card.tags,
    isHomebrew: true,
  };
}
