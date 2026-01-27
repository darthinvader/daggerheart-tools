import type { DomainCard } from '@/lib/schemas/domains';
import { rankAdvanced, rankings } from '@/utils/search/rank';

export type DomainFilterOptions = {
  allowedDomains?: string[]; // if provided, only cards from these domains pass
  domain?: string; // specific domain to include, 'All' to ignore
  level?: string; // 'All' | '1' | '2' | ...
  type?: string; // 'All' | 'Spell' | 'Ability'
  search?: string; // case-insensitive substring match on name, description, domain, type, and tags
};

export function filterCards(cards: DomainCard[], opts: DomainFilterOptions) {
  const {
    allowedDomains,
    domain = 'All',
    level = 'All',
    type = 'All',
    search = '',
  } = opts;
  const s = search.trim().toLowerCase();
  const filtered = cards.filter(c => {
    if (Array.isArray(allowedDomains) && allowedDomains.length > 0) {
      if (!allowedDomains.includes(String(c.domain))) return false;
    }
    if (domain !== 'All' && String(c.domain) !== String(domain)) return false;
    if (level !== 'All' && String(c.level) !== String(level)) return false;
    if (type !== 'All' && String(c.type) !== String(type)) return false;
    return true;
  });
  if (!s) return filtered;
  // Rank matching cards by relevance across key fields; also filters to matches
  return rankAdvanced<DomainCard>(
    filtered,
    s,
    [
      'name',
      (c: DomainCard) => String(c.description ?? ''),
      (c: DomainCard) => String(c.domain),
      (c: DomainCard) => String(c.type),
      (c: DomainCard) => (Array.isArray(c.tags) ? c.tags.join(' ') : ''),
    ],
    rankings.CONTAINS
  );
}

export function countByType(cards: DomainCard[]) {
  const map = new Map<string, number>();
  for (const c of cards) {
    const key = String(c.type);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([type, count]) => ({ type, count }));
}

export function groupByDomain(cards: DomainCard[]) {
  const map = new Map<string, number>();
  for (const c of cards) {
    const key = String(c.domain);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([domain, count]) => ({
    domain,
    count,
  }));
}

// Shared limits for loadout sizing
export const STARTING_LOADOUT_LIMIT = 2;
export const SOFT_LOADOUT_LIMIT = 6;

export function getMaxAllowed(
  creationComplete: boolean,
  startingLimit = STARTING_LOADOUT_LIMIT,
  softLimit = SOFT_LOADOUT_LIMIT
) {
  return creationComplete ? softLimit : startingLimit;
}
