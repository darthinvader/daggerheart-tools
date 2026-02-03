/**
 * Homebrew Content Filter Helpers
 *
 * Pure functions for filtering homebrew content.
 */
import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';
import type { FilterState, SortOption } from './homebrew-list-toolbar';

/**
 * Get a property from the content object.
 */
export function getContentProp(
  item: HomebrewContent,
  prop: string
): string | number | undefined {
  const content = item.content as Record<string, unknown> | undefined;
  if (!content) return undefined;
  return content[prop] as string | number | undefined;
}

/**
 * Filter items by search query.
 */
export function applySearchFilter(
  items: HomebrewContent[],
  search: string
): HomebrewContent[] {
  const query = search.trim().toLowerCase();
  if (!query) return items;

  return items.filter(
    item =>
      item.name.toLowerCase().includes(query) ||
      (item.tags?.some(t => t.toLowerCase().includes(query)) ?? false)
  );
}

/**
 * Filter items by tier.
 */
export function applyTierFilter(
  items: HomebrewContent[],
  tier: string
): HomebrewContent[] {
  if (tier === 'all') return items;
  return items.filter(item => String(getContentProp(item, 'tier')) === tier);
}

/**
 * Filter items by role (adversaries only).
 */
export function applyRoleFilter(
  items: HomebrewContent[],
  role: string,
  activeCategory: HomebrewContentType
): HomebrewContent[] {
  if (role === 'all' || activeCategory !== 'adversary') return items;
  return items.filter(item => getContentProp(item, 'role') === role);
}

/**
 * Filter items by domain (domain cards only).
 */
export function applyDomainFilter(
  items: HomebrewContent[],
  domain: string,
  activeCategory: HomebrewContentType
): HomebrewContent[] {
  if (domain === 'all' || activeCategory !== 'domain_card') return items;
  return items.filter(item => getContentProp(item, 'domain') === domain);
}

/**
 * Filter items by level (domain cards only).
 */
export function applyLevelFilter(
  items: HomebrewContent[],
  level: string,
  activeCategory: HomebrewContentType
): HomebrewContent[] {
  if (level === 'all' || activeCategory !== 'domain_card') return items;
  return items.filter(item => String(getContentProp(item, 'level')) === level);
}

/**
 * Filter items by equipment category.
 */
export function applyEquipmentCategoryFilter(
  items: HomebrewContent[],
  equipmentCategory: string,
  activeCategory: HomebrewContentType
): HomebrewContent[] {
  if (equipmentCategory === 'all' || activeCategory !== 'equipment')
    return items;

  return items.filter(item => {
    const content = item.content as Record<string, unknown> | undefined;
    const type = content?.type as string | undefined;
    const cat = content?.category as string | undefined;

    if (cat === 'Weapon' || !cat) {
      const actualCat =
        type === 'Secondary' ? 'Secondary Weapon' : 'Primary Weapon';
      return actualCat === equipmentCategory;
    }
    return cat === equipmentCategory;
  });
}

/**
 * Apply all filters to a list of items.
 */
export function applyAllFilters(
  items: HomebrewContent[],
  search: string,
  filterState: FilterState,
  activeCategory: HomebrewContentType
): HomebrewContent[] {
  let result = applySearchFilter(items, search);
  result = applyTierFilter(result, filterState.tier);
  result = applyRoleFilter(result, filterState.role, activeCategory);
  result = applyDomainFilter(result, filterState.domain, activeCategory);
  result = applyLevelFilter(result, filterState.level, activeCategory);
  result = applyEquipmentCategoryFilter(
    result,
    filterState.equipmentCategory,
    activeCategory
  );
  return result;
}

/**
 * Sort items by the specified option.
 */
export function sortItems(
  items: HomebrewContent[],
  sortBy: SortOption
): HomebrewContent[] {
  const result = [...items];
  result.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return (
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
        );
      case 'popular':
        return (b.viewCount ?? 0) - (a.viewCount ?? 0);
      case 'stars':
        return (b.starCount ?? 0) - (a.starCount ?? 0);
      case 'updated':
      default:
        return (
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime()
        );
    }
  });
  return result;
}
