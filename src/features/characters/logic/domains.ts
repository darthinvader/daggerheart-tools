import type { DomainCard } from '@/lib/schemas/domains';

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
  return cards.filter(c => {
    if (Array.isArray(allowedDomains) && allowedDomains.length > 0) {
      if (!allowedDomains.includes(String(c.domain))) return false;
    }
    if (domain !== 'All' && String(c.domain) !== String(domain)) return false;
    if (level !== 'All' && String(c.level) !== String(level)) return false;
    if (type !== 'All' && String(c.type) !== String(type)) return false;
    if (s) {
      const inName = c.name.toLowerCase().includes(s);
      const inDesc = String(c.description ?? '')
        .toLowerCase()
        .includes(s);
      const inDomain = String(c.domain).toLowerCase().includes(s);
      const inType = String(c.type).toLowerCase().includes(s);
      const inTags = Array.isArray(c.tags)
        ? c.tags.some(t => String(t).toLowerCase().includes(s))
        : false;
      if (!inName && !inDesc && !inDomain && !inType && !inTags) return false;
    }
    return true;
  });
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
export const STARTING_LOADOUT_LIMIT = 3;
export const SOFT_LOADOUT_LIMIT = 6;

export function getMaxAllowed(
  creationComplete: boolean,
  startingLimit = STARTING_LOADOUT_LIMIT,
  softLimit = SOFT_LOADOUT_LIMIT
) {
  return creationComplete ? softLimit : startingLimit;
}
