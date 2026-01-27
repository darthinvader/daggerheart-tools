import type { DomainCard } from '../../schemas/domains';
import { ARCANA_DOMAIN_CARDS } from './arcana-domain-cards';
import { BLADE_DOMAIN_CARDS } from './blade-domain-cards';
import { BONE_DOMAIN_CARDS } from './bone-domain-cards';
import { CODEX_DOMAIN_CARDS } from './codex-domain-cards';
import { GRACE_DOMAIN_CARDS } from './grace-domain-cards';
import { MIDNIGHT_DOMAIN_CARDS } from './midnight-domain-cards';
import { SAGE_DOMAIN_CARDS } from './sage-domain-cards';
import { SPLENDOR_DOMAIN_CARDS } from './splendor-domain-cards';
import { VALOR_DOMAIN_CARDS } from './valor-domain-cards';

// Domain card data exports
export * from './arcana-domain-cards';
export * from './blade-domain-cards';
export * from './bone-domain-cards';
export * from './codex-domain-cards';
export * from './grace-domain-cards';
export * from './midnight-domain-cards';
export * from './sage-domain-cards';
export * from './splendor-domain-cards';
export * from './valor-domain-cards';

// Domain card lookup map
export const DOMAIN_CARDS_MAP: Record<string, DomainCard[]> = {
  Arcana: ARCANA_DOMAIN_CARDS,
  Blade: BLADE_DOMAIN_CARDS,
  Bone: BONE_DOMAIN_CARDS,
  Codex: CODEX_DOMAIN_CARDS,
  Grace: GRACE_DOMAIN_CARDS,
  Midnight: MIDNIGHT_DOMAIN_CARDS,
  Sage: SAGE_DOMAIN_CARDS,
  Splendor: SPLENDOR_DOMAIN_CARDS,
  Valor: VALOR_DOMAIN_CARDS,
};

// All domain names with cards
export const ALL_DOMAIN_NAMES = Object.keys(DOMAIN_CARDS_MAP);

// Cached flat array of all cards (computed once at module load)
let _allCardsCache: DomainCard[] | null = null;

// Helper functions for domain card lookups
export function getAllDomainCards(): DomainCard[] {
  if (!_allCardsCache) {
    _allCardsCache = Object.values(DOMAIN_CARDS_MAP).flat();
  }
  return _allCardsCache;
}

export function getCardsByDomain(domain: string): DomainCard[] {
  return DOMAIN_CARDS_MAP[domain] ?? [];
}

export function getCardsForDomains(domains: string[]): DomainCard[] {
  return domains.flatMap(domain => getCardsByDomain(domain));
}

export function getCardsByLevel(maxLevel: number): DomainCard[] {
  return getAllDomainCards().filter(card => card.level <= maxLevel);
}

export function getCardsByDomainAndLevel(
  domain: string,
  maxLevel: number
): DomainCard[] {
  return getCardsByDomain(domain).filter(card => card.level <= maxLevel);
}

export function getCardsForDomainsAndLevel(
  domains: string[],
  maxLevel: number
): DomainCard[] {
  return getCardsForDomains(domains).filter(card => card.level <= maxLevel);
}

export function getCardByName(name: string): DomainCard | undefined {
  return getAllDomainCards().find(
    card => card.name.toLowerCase() === name.toLowerCase()
  );
}

export function getCardsByType(
  type: 'Spell' | 'Ability' | 'Grimoire'
): DomainCard[] {
  return getAllDomainCards().filter(card => card.type === type);
}

export function getSpellCards(): DomainCard[] {
  return getCardsByType('Spell');
}

export function getAbilityCards(): DomainCard[] {
  return getCardsByType('Ability');
}

export function getGrimoireCards(): DomainCard[] {
  return getCardsByType('Grimoire');
}

export function getCardRecallCost(card: DomainCard): number {
  return card.recallCost ?? card.hopeCost ?? 0;
}

export function sortCardsByLevel(cards: DomainCard[]): DomainCard[] {
  return [...cards].sort((a, b) => a.level - b.level);
}

export function sortCardsByName(cards: DomainCard[]): DomainCard[] {
  return [...cards].sort((a, b) => a.name.localeCompare(b.name));
}

export function groupCardsByDomain(
  cards: DomainCard[]
): Record<string, DomainCard[]> {
  return cards.reduce(
    (acc, card) => {
      const domain = card.domain;
      if (!acc[domain]) acc[domain] = [];
      acc[domain].push(card);
      return acc;
    },
    {} as Record<string, DomainCard[]>
  );
}

export function groupCardsByLevel(
  cards: DomainCard[]
): Record<number, DomainCard[]> {
  return cards.reduce(
    (acc, card) => {
      if (!acc[card.level]) acc[card.level] = [];
      acc[card.level].push(card);
      return acc;
    },
    {} as Record<number, DomainCard[]>
  );
}
