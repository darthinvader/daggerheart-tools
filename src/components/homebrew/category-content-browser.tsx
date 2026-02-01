/**
 * Category Content Browser
 *
 * A tabbed interface for browsing content by category (adversary, domain_card, etc.)
 * with category-specific filters. Used by both Official Content and Homebrew browsers.
 *
 * Features:
 * - Tabs for each content category
 * - Category-specific filters (tier, domain, role, etc.)
 * - Search within category
 * - Grouped display with sticky navigation
 */
import {
  BookOpen,
  Home,
  Layers,
  Map,
  Package,
  Search,
  Shield,
  Skull,
  Sword,
  Users,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// =====================================================================================
// Types
// =====================================================================================

export type ContentCategory =
  | 'adversary'
  | 'environment'
  | 'class'
  | 'subclass'
  | 'ancestry'
  | 'community'
  | 'domain_card'
  | 'equipment'
  | 'item';

export interface CategoryConfig {
  key: ContentCategory;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  /** Available filter options for this category */
  filters?: CategoryFilter[];
}

export interface CategoryFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface ContentItem {
  id: string;
  name: string;
  category: ContentCategory;
  /** For filtering/grouping */
  tier?: string;
  domain?: string;
  level?: number;
  role?: string;
  equipmentCategory?: string;
  /** For search */
  searchText?: string;
  /** The raw data */
  data: unknown;
}

// =====================================================================================
// Category Configuration
// =====================================================================================

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    key: 'adversary',
    label: 'Adversaries',
    icon: Skull,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    filters: [
      {
        key: 'tier',
        label: 'Tier',
        options: [
          { value: 'all', label: 'All Tiers' },
          { value: '1', label: 'Tier 1' },
          { value: '2', label: 'Tier 2' },
          { value: '3', label: 'Tier 3' },
          { value: '4', label: 'Tier 4' },
        ],
      },
      {
        key: 'role',
        label: 'Role',
        options: [
          { value: 'all', label: 'All Roles' },
          { value: 'Solo', label: 'Solo' },
          { value: 'Bruiser', label: 'Bruiser' },
          { value: 'Leader', label: 'Leader' },
          { value: 'Support', label: 'Support' },
          { value: 'Ranged', label: 'Ranged' },
          { value: 'Skulk', label: 'Skulk' },
          { value: 'Horde', label: 'Horde' },
          { value: 'Minion', label: 'Minion' },
          { value: 'Social', label: 'Social' },
          { value: 'Standard', label: 'Standard' },
        ],
      },
    ],
  },
  {
    key: 'environment',
    label: 'Environments',
    icon: Map,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    filters: [
      {
        key: 'tier',
        label: 'Tier',
        options: [
          { value: 'all', label: 'All Tiers' },
          { value: '1', label: 'Tier 1' },
          { value: '2', label: 'Tier 2' },
          { value: '3', label: 'Tier 3' },
          { value: '4', label: 'Tier 4' },
        ],
      },
    ],
  },
  {
    key: 'domain_card',
    label: 'Domain Cards',
    icon: Layers,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    filters: [
      {
        key: 'domain',
        label: 'Domain',
        options: [
          { value: 'all', label: 'All Domains' },
          { value: 'Arcana', label: 'Arcana' },
          { value: 'Blade', label: 'Blade' },
          { value: 'Bone', label: 'Bone' },
          { value: 'Codex', label: 'Codex' },
          { value: 'Grace', label: 'Grace' },
          { value: 'Midnight', label: 'Midnight' },
          { value: 'Sage', label: 'Sage' },
          { value: 'Splendor', label: 'Splendor' },
          { value: 'Valor', label: 'Valor' },
        ],
      },
      {
        key: 'level',
        label: 'Level',
        options: [
          { value: 'all', label: 'All Levels' },
          ...Array.from({ length: 10 }, (_, i) => ({
            value: String(i + 1),
            label: `Level ${i + 1}`,
          })),
        ],
      },
    ],
  },
  {
    key: 'equipment',
    label: 'Equipment',
    icon: Sword,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    filters: [
      {
        key: 'equipmentCategory',
        label: 'Type',
        options: [
          { value: 'all', label: 'All Types' },
          { value: 'Primary Weapon', label: 'Primary Weapons' },
          { value: 'Secondary Weapon', label: 'Secondary Weapons' },
          { value: 'Armor', label: 'Armor' },
          { value: 'Combat Wheelchair', label: 'Combat Wheelchairs' },
        ],
      },
      {
        key: 'tier',
        label: 'Tier',
        options: [
          { value: 'all', label: 'All Tiers' },
          { value: '1', label: 'Tier 1' },
          { value: '2', label: 'Tier 2' },
          { value: '3', label: 'Tier 3' },
          { value: '4', label: 'Tier 4' },
        ],
      },
    ],
  },
  {
    key: 'item',
    label: 'Items',
    icon: Package,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    filters: [
      {
        key: 'tier',
        label: 'Tier',
        options: [
          { value: 'all', label: 'All Tiers' },
          { value: '1', label: 'Tier 1' },
          { value: '2', label: 'Tier 2' },
          { value: '3', label: 'Tier 3' },
          { value: '4', label: 'Tier 4' },
        ],
      },
    ],
  },
  {
    key: 'class',
    label: 'Classes',
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    key: 'subclass',
    label: 'Subclasses',
    icon: BookOpen,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    key: 'ancestry',
    label: 'Ancestries',
    icon: Users,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    key: 'community',
    label: 'Communities',
    icon: Home,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
];

// Tier colors for badges
export const TIER_COLORS: Record<string, string> = {
  '1': 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  '2': 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  '3': 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
  '4': 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
};

// Domain colors for badges
export const DOMAIN_COLORS: Record<string, string> = {
  Arcana:
    'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30',
  Blade: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
  Bone: 'bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30',
  Codex:
    'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
  Grace: 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30',
  Midnight:
    'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  Sage: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  Splendor:
    'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
  Valor:
    'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
};

// =====================================================================================
// Group Configuration
// =====================================================================================

interface GroupConfig {
  key: string;
  label: string;
  colorClass?: string;
  order: number;
}

function getGroupConfigsForCategory(
  category: ContentCategory,
  filterKey?: string
): GroupConfig[] {
  if (category === 'adversary') {
    if (filterKey === 'role' || filterKey === undefined) {
      return [
        {
          key: 'Solo',
          label: 'Solo',
          colorClass: TIER_COLORS['4'],
          order: 1,
        },
        {
          key: 'Bruiser',
          label: 'Bruiser',
          colorClass:
            'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
          order: 2,
        },
        {
          key: 'Leader',
          label: 'Leader',
          colorClass:
            'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
          order: 3,
        },
        {
          key: 'Support',
          label: 'Support',
          colorClass:
            'bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/30',
          order: 4,
        },
        {
          key: 'Ranged',
          label: 'Ranged',
          colorClass:
            'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
          order: 5,
        },
        {
          key: 'Skulk',
          label: 'Skulk',
          colorClass:
            'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
          order: 6,
        },
        {
          key: 'Horde',
          label: 'Horde',
          colorClass:
            'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
          order: 7,
        },
        {
          key: 'Minion',
          label: 'Minion',
          colorClass:
            'bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30',
          order: 8,
        },
        {
          key: 'Social',
          label: 'Social',
          colorClass:
            'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30',
          order: 9,
        },
        {
          key: 'Standard',
          label: 'Standard',
          colorClass:
            'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30',
          order: 10,
        },
      ];
    }
  }

  if (category === 'environment' || filterKey === 'tier') {
    return [
      { key: '1', label: 'Tier 1', colorClass: TIER_COLORS['1'], order: 1 },
      { key: '2', label: 'Tier 2', colorClass: TIER_COLORS['2'], order: 2 },
      { key: '3', label: 'Tier 3', colorClass: TIER_COLORS['3'], order: 3 },
      { key: '4', label: 'Tier 4', colorClass: TIER_COLORS['4'], order: 4 },
    ];
  }

  if (category === 'domain_card') {
    return [
      {
        key: 'Arcana',
        label: 'Arcana',
        colorClass: DOMAIN_COLORS['Arcana'],
        order: 1,
      },
      {
        key: 'Blade',
        label: 'Blade',
        colorClass: DOMAIN_COLORS['Blade'],
        order: 2,
      },
      {
        key: 'Bone',
        label: 'Bone',
        colorClass: DOMAIN_COLORS['Bone'],
        order: 3,
      },
      {
        key: 'Codex',
        label: 'Codex',
        colorClass: DOMAIN_COLORS['Codex'],
        order: 4,
      },
      {
        key: 'Grace',
        label: 'Grace',
        colorClass: DOMAIN_COLORS['Grace'],
        order: 5,
      },
      {
        key: 'Midnight',
        label: 'Midnight',
        colorClass: DOMAIN_COLORS['Midnight'],
        order: 6,
      },
      {
        key: 'Sage',
        label: 'Sage',
        colorClass: DOMAIN_COLORS['Sage'],
        order: 7,
      },
      {
        key: 'Splendor',
        label: 'Splendor',
        colorClass: DOMAIN_COLORS['Splendor'],
        order: 8,
      },
      {
        key: 'Valor',
        label: 'Valor',
        colorClass: DOMAIN_COLORS['Valor'],
        order: 9,
      },
    ];
  }

  if (category === 'equipment') {
    return [
      {
        key: 'Primary Weapon',
        label: 'Primary Weapons',
        colorClass:
          'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
        order: 1,
      },
      {
        key: 'Secondary Weapon',
        label: 'Secondary Weapons',
        colorClass:
          'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
        order: 2,
      },
      {
        key: 'Armor',
        label: 'Armor',
        colorClass:
          'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
        order: 3,
      },
      {
        key: 'Combat Wheelchair',
        label: 'Combat Wheelchairs',
        colorClass:
          'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
        order: 4,
      },
    ];
  }

  // Default: no grouping, just alphabetical
  return [];
}

function getGroupKeyForItem(
  item: ContentItem,
  category: ContentCategory
): string {
  switch (category) {
    case 'adversary':
      return item.role ?? 'Standard';
    case 'environment':
      return item.tier ?? '1';
    case 'domain_card':
      return item.domain ?? 'Arcana';
    case 'equipment':
      return item.equipmentCategory ?? 'Primary Weapon';
    case 'item':
      return item.tier ?? '1';
    default: {
      // Alphabetical grouping
      const firstChar = item.name.charAt(0).toUpperCase();
      return /[A-Z]/.test(firstChar) ? firstChar : '#';
    }
  }
}

// =====================================================================================
// Category Tab Component
// =====================================================================================

interface CategoryTabsProps {
  categories: CategoryConfig[];
  activeCategory: ContentCategory;
  onCategoryChange: (category: ContentCategory) => void;
  getCategoryCount: (category: ContentCategory) => number;
}

function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  getCategoryCount,
}: CategoryTabsProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-1 pb-2">
        {categories.map(config => {
          const Icon = config.icon;
          const count = getCategoryCount(config.key);
          const isActive = activeCategory === config.key;

          return (
            <Button
              key={config.key}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(config.key)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 transition-all',
                isActive && 'shadow-sm',
                !isActive && config.bgColor
              )}
            >
              <Icon className={cn('size-4', !isActive && config.color)} />
              <span className="hidden sm:inline">{config.label}</span>
              <Badge
                variant={isActive ? 'secondary' : 'outline'}
                className="ml-1 text-xs"
              >
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

// =====================================================================================
// Category Filters Component
// =====================================================================================

interface CategoryFiltersProps {
  filters: CategoryFilter[];
  filterValues: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
}

function CategoryFilters({
  filters,
  filterValues,
  onFilterChange,
}: CategoryFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <Select
          key={filter.key}
          value={filterValues[filter.key] ?? 'all'}
          onValueChange={value => onFilterChange(filter.key, value)}
        >
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}

// =====================================================================================
// Grouped Content Display
// =====================================================================================

interface GroupedContentDisplayProps<T extends ContentItem> {
  items: T[];
  category: ContentCategory;
  renderItem: (item: T) => React.ReactNode;
  columns?: { default: number; sm?: number; lg?: number };
}

function GroupedContentDisplay<T extends ContentItem>({
  items,
  category,
  renderItem,
  columns = { default: 1, sm: 2, lg: 3 },
}: GroupedContentDisplayProps<T>) {
  const groupConfigs = getGroupConfigsForCategory(category);

  // Group items
  const groupedItems = useMemo(() => {
    const groups = new Map<string, T[]>();
    for (const item of items) {
      const groupKey = getGroupKeyForItem(item, category);
      const existing = groups.get(groupKey) ?? [];
      existing.push(item);
      groups.set(groupKey, existing);
    }
    // Sort items within each group alphabetically
    for (const [key, groupItems] of groups) {
      groups.set(
        key,
        groupItems.sort((a, b) => a.name.localeCompare(b.name))
      );
    }
    return groups;
  }, [items, category]);

  // Get ordered groups
  const orderedGroups = useMemo(() => {
    if (groupConfigs.length === 0) {
      // Alphabetical grouping
      const letters = Array.from(groupedItems.keys()).sort();
      const hashIndex = letters.indexOf('#');
      if (hashIndex !== -1) {
        letters.splice(hashIndex, 1);
        letters.push('#');
      }
      return letters.map(letter => ({
        key: letter,
        label: letter,
        colorClass: 'bg-muted/50',
        order: letter === '#' ? 999 : letter.charCodeAt(0),
      }));
    }
    return groupConfigs.filter(g => groupedItems.has(g.key));
  }, [groupConfigs, groupedItems]);

  if (items.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
        <div className="bg-muted flex size-16 items-center justify-center rounded-full">
          <Search className="text-muted-foreground size-8" />
        </div>
        <p className="text-muted-foreground">No items match your filters.</p>
      </div>
    );
  }

  const gridStyle = {
    gridTemplateColumns: `repeat(${columns.lg ?? columns.sm ?? columns.default}, minmax(0, 1fr))`,
  };

  return (
    <div className="space-y-6">
      {orderedGroups.map(group => {
        const groupItems = groupedItems.get(group.key) ?? [];
        if (groupItems.length === 0) return null;

        return (
          <div key={group.key} className="scroll-mt-24">
            {/* Group Header */}
            <div
              className={cn(
                'mb-3 flex items-center gap-2 rounded-lg border px-3 py-2',
                group.colorClass ?? 'bg-muted/50'
              )}
            >
              <span className="text-lg font-bold">{group.label}</span>
              <Badge variant="secondary">{groupItems.length}</Badge>
            </div>

            {/* Items Grid */}
            <div className="grid gap-2" style={gridStyle}>
              {groupItems.map(item => (
                <div key={item.id}>{renderItem(item)}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =====================================================================================
// Main Component
// =====================================================================================

interface CategoryContentBrowserProps<T extends ContentItem> {
  /** All items across all categories */
  items: T[];
  /** Function to render each item */
  renderItem: (item: T) => React.ReactNode;
  /** Optional: which categories to show (defaults to all with items) */
  categories?: ContentCategory[];
  /** Optional: initial category */
  initialCategory?: ContentCategory;
  /** Optional: number of grid columns */
  columns?: { default: number; sm?: number; lg?: number };
  /** Optional: className for container */
  className?: string;
  /** Optional: show search bar */
  showSearch?: boolean;
}

export function CategoryContentBrowser<T extends ContentItem>({
  items,
  renderItem,
  categories: allowedCategories,
  initialCategory,
  columns = { default: 1, sm: 2, lg: 3 },
  className,
  showSearch = true,
}: CategoryContentBrowserProps<T>) {
  // Group items by category
  const itemsByCategory = useMemo(() => {
    const map = new Map<ContentCategory, T[]>();
    for (const item of items) {
      const existing = map.get(item.category) ?? [];
      existing.push(item);
      map.set(item.category, existing);
    }
    return map;
  }, [items]);

  // Determine which categories to show
  const visibleCategories = useMemo(() => {
    const categoriesWithItems = CATEGORY_CONFIGS.filter(
      c => (itemsByCategory.get(c.key)?.length ?? 0) > 0
    );
    if (allowedCategories) {
      return categoriesWithItems.filter(c => allowedCategories.includes(c.key));
    }
    return categoriesWithItems;
  }, [itemsByCategory, allowedCategories]);

  // State
  const [activeCategory, setActiveCategory] = useState<ContentCategory>(
    initialCategory ?? visibleCategories[0]?.key ?? 'adversary'
  );
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Get current category config
  const currentConfig = useMemo(
    () => CATEGORY_CONFIGS.find(c => c.key === activeCategory),
    [activeCategory]
  );

  // Get items for current category
  const categoryItems = useMemo(
    () => itemsByCategory.get(activeCategory) ?? [],
    [itemsByCategory, activeCategory]
  );

  // Apply filters
  const filteredItems = useMemo(() => {
    let result = categoryItems;

    // Apply search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          (item.searchText?.toLowerCase().includes(query) ?? false)
      );
    }

    // Apply category-specific filters
    for (const [key, value] of Object.entries(filterValues)) {
      if (value && value !== 'all') {
        result = result.filter(item => {
          switch (key) {
            case 'tier':
              return item.tier === value;
            case 'domain':
              return item.domain === value;
            case 'level':
              return String(item.level) === value;
            case 'role':
              return item.role === value;
            case 'equipmentCategory':
              return item.equipmentCategory === value;
            default:
              return true;
          }
        });
      }
    }

    return result;
  }, [categoryItems, search, filterValues]);

  // Handle category change
  const handleCategoryChange = useCallback((category: ContentCategory) => {
    setActiveCategory(category);
    setSearch('');
    setFilterValues({});
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  }, []);

  // Get category count
  const getCategoryCount = useCallback(
    (category: ContentCategory) => itemsByCategory.get(category)?.length ?? 0,
    [itemsByCategory]
  );

  if (visibleCategories.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
        <div className="bg-muted flex size-16 items-center justify-center rounded-full">
          <Package className="text-muted-foreground size-8" />
        </div>
        <p className="text-muted-foreground">No content available.</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Category Tabs */}
      <CategoryTabs
        categories={visibleCategories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        getCategoryCount={getCategoryCount}
      />

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {showSearch && (
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder={`Search ${currentConfig?.label.toLowerCase() ?? 'content'}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        {currentConfig?.filters && (
          <CategoryFilters
            filters={currentConfig.filters}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      {/* Results count */}
      <div className="text-muted-foreground text-sm">
        {filteredItems.length} {currentConfig?.label.toLowerCase() ?? 'items'}
        {search || Object.values(filterValues).some(v => v && v !== 'all')
          ? ' matching filters'
          : ''}
      </div>

      {/* Content Display */}
      <GroupedContentDisplay
        items={filteredItems}
        category={activeCategory}
        renderItem={renderItem}
        columns={columns}
      />
    </div>
  );
}
