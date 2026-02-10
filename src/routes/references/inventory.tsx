// Inventory reference page with page-specific detail components

import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  List,
  Search,
  X,
} from 'lucide-react';
import * as React from 'react';

import {
  BackToTop,
  CompareDrawer,
  CompareProvider,
  CompareToggleButton,
  type ComparisonItem,
  DetailCloseButton,
  type FilterGroup,
  KeyboardHint,
  ReferenceEmptyState,
  ReferenceFilter,
  ReferencePageSkeleton,
  ResultsCounter,
  SortableTableHead,
  useCompare,
  useDeferredItems,
  useDeferredLoad,
  useDeferredSheetContent,
  useFilterState,
  useKeyboardNavigation,
} from '@/components/references';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ResponsiveSheet,
  ResponsiveSheetContent,
  ResponsiveSheetHeader,
  ResponsiveSheetTitle,
} from '@/components/ui/responsive-sheet';
import { SheetContentSkeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ALL_ARMOR_MODIFICATIONS,
  ALL_CONSUMABLES,
  ALL_POTIONS,
  ALL_RECIPES,
  ALL_RELICS,
  ALL_UTILITY_ITEMS,
  ALL_WEAPON_MODIFICATIONS,
} from '@/lib/data/equipment';
import { Backpack } from '@/lib/icons';
import type {
  ArmorModification,
  Consumable,
  Potion,
  Recipe,
  Relic,
  UtilityItem,
  WeaponModification,
} from '@/lib/schemas/equipment';
import { useCategoryExpandState } from './-use-category-expand-state';

export const Route = createFileRoute('/references/inventory')({
  component: InventoryPageWrapper,
});

// Unified item type
type InventoryItem =
  | { type: 'utility'; data: UtilityItem }
  | { type: 'consumable'; data: Consumable }
  | { type: 'potion'; data: Potion }
  | { type: 'relic'; data: Relic }
  | { type: 'weapon-mod'; data: WeaponModification }
  | { type: 'armor-mod'; data: ArmorModification }
  | { type: 'recipe'; data: Recipe };

// Rarity colors
const rarityColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Common: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-700 dark:text-gray-400',
    border: 'border-gray-500/30',
  },
  Uncommon: {
    bg: 'bg-green-500/10',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-500/30',
  },
  Rare: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-500/30',
  },
  Legendary: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/30',
  },
};

const defaultRarityColor = {
  bg: 'bg-gray-500/10',
  text: 'text-gray-700 dark:text-gray-400',
  border: 'border-gray-500/30',
};

// Category colors
const categoryGradients: Record<string, string> = {
  utility: 'from-cyan-500 to-blue-600',
  consumable: 'from-green-500 to-emerald-600',
  potion: 'from-pink-500 to-rose-600',
  relic: 'from-amber-400 to-yellow-500',
  'weapon-mod': 'from-red-500 to-orange-600',
  'armor-mod': 'from-slate-500 to-zinc-600',
  recipe: 'from-purple-500 to-violet-600',
};

const categoryLabels: Record<string, string> = {
  utility: 'Utility Item',
  consumable: 'Consumable',
  potion: 'Potion',
  relic: 'Relic',
  'weapon-mod': 'Weapon Mod',
  'armor-mod': 'Armor Mod',
  recipe: 'Recipe',
};

// Build all items array
function getAllItems(): InventoryItem[] {
  const items: InventoryItem[] = [];
  for (const i of ALL_UTILITY_ITEMS) items.push({ type: 'utility', data: i });
  for (const i of ALL_CONSUMABLES) items.push({ type: 'consumable', data: i });
  for (const i of ALL_POTIONS) items.push({ type: 'potion', data: i });
  for (const i of ALL_RELICS) items.push({ type: 'relic', data: i });
  for (const i of ALL_WEAPON_MODIFICATIONS)
    items.push({ type: 'weapon-mod', data: i });
  for (const i of ALL_ARMOR_MODIFICATIONS)
    items.push({ type: 'armor-mod', data: i });
  for (const i of ALL_RECIPES) items.push({ type: 'recipe', data: i });
  return items;
}

function buildFilterGroups(items: InventoryItem[]): FilterGroup[] {
  const categoryCounts: Record<string, number> = {};
  const rarityCounts: Record<string, number> = {};

  for (const item of items) {
    categoryCounts[item.type] = (categoryCounts[item.type] ?? 0) + 1;
    const rarity = item.data.rarity;
    rarityCounts[rarity] = (rarityCounts[rarity] ?? 0) + 1;
  }

  return [
    {
      id: 'category',
      label: 'Category',
      defaultOpen: true,
      options: [
        {
          value: 'utility',
          label: 'Utility Items',
          count: categoryCounts['utility'] ?? 0,
        },
        {
          value: 'consumable',
          label: 'Consumables',
          count: categoryCounts['consumable'] ?? 0,
        },
        {
          value: 'potion',
          label: 'Potions',
          count: categoryCounts['potion'] ?? 0,
        },
        {
          value: 'relic',
          label: 'Relics',
          count: categoryCounts['relic'] ?? 0,
        },
        {
          value: 'weapon-mod',
          label: 'Weapon Mods',
          count: categoryCounts['weapon-mod'] ?? 0,
        },
        {
          value: 'armor-mod',
          label: 'Armor Mods',
          count: categoryCounts['armor-mod'] ?? 0,
        },
        {
          value: 'recipe',
          label: 'Recipes',
          count: categoryCounts['recipe'] ?? 0,
        },
      ],
    },
    {
      id: 'rarity',
      label: 'Rarity',
      defaultOpen: true,
      options: ['Common', 'Uncommon', 'Rare', 'Legendary']
        .filter(r => rarityCounts[r] > 0)
        .map(r => ({
          value: r,
          label: r,
          count: rarityCounts[r],
        })),
    },
  ];
}

function filterItems(
  items: InventoryItem[],
  search: string,
  filters: Record<string, Set<string>>
): InventoryItem[] {
  return items.filter(item => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (!item.data.name.toLowerCase().includes(searchLower)) {
        // Check features/effect
        let matches = false;
        if ('features' in item.data && Array.isArray(item.data.features)) {
          matches = item.data.features.some(
            f =>
              f.name.toLowerCase().includes(searchLower) ||
              f.description.toLowerCase().includes(searchLower)
          );
        }
        if ('effect' in item.data && typeof item.data.effect === 'string') {
          matches =
            matches || item.data.effect.toLowerCase().includes(searchLower);
        }
        if (!matches) return false;
      }
    }

    if (filters.category?.size > 0 && !filters.category.has(item.type)) {
      return false;
    }

    if (filters.rarity?.size > 0 && !filters.rarity.has(item.data.rarity)) {
      return false;
    }

    return true;
  });
}

// Helper to get unique inventory ID for comparison
function getInventoryId(item: InventoryItem): string {
  return `${item.type}-${item.data.name}`;
}

// Memoized card component for performance
const ItemCard = React.memo(function ItemCard({
  item,
  onClick,
}: {
  item: InventoryItem;
  onClick: () => void;
}) {
  const { isInCompare } = useCompare();
  const gradient = categoryGradients[item.type] ?? 'from-gray-500 to-slate-600';
  const rarityColor = rarityColors[item.data.rarity] ?? defaultRarityColor;
  const itemId = getInventoryId(item);
  const inCompare = isInCompare(itemId);

  return (
    <Card
      className={`reference-card card-grid-item hover:border-primary/50 h-full cursor-pointer transition-all hover:shadow-lg ${inCompare ? 'ring-primary ring-2' : ''}`}
      onClick={onClick}
    >
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className="line-clamp-2 text-base leading-tight"
            title={item.data.name}
          >
            {item.data.name}
          </CardTitle>
          <CompareToggleButton
            item={{ id: itemId, name: item.data.name, data: item }}
            size="sm"
          />
        </div>
        {/* All badges on one line */}
        <div className="mt-2 flex flex-wrap items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="cursor-help py-0 text-xs">
                {categoryLabels[item.type]}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Item category</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                className={`cursor-help py-0 text-xs ${rarityColor.bg} ${rarityColor.text} ${rarityColor.border}`}
              >
                {item.data.rarity}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Item rarity</TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="border-muted border-t pt-2">
          {'features' in item.data &&
            Array.isArray(item.data.features) &&
            item.data.features.length > 0 && (
              <p className="text-muted-foreground line-clamp-2 text-xs">
                {item.data.features[0].description}
              </p>
            )}
          {'effect' in item.data && typeof item.data.effect === 'string' && (
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {item.data.effect}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

// Memoized table row component for performance
const ItemTableRow = React.memo(function ItemTableRow({
  item,
  onClick,
}: {
  item: InventoryItem;
  onClick: () => void;
}) {
  const { isInCompare } = useCompare();
  const rarityColor = rarityColors[item.data.rarity] ?? defaultRarityColor;
  const itemId = getInventoryId(item);
  const inCompare = isInCompare(itemId);

  return (
    <TableRow
      className={`reference-card hover:bg-muted/50 cursor-pointer ${inCompare ? 'bg-primary/10' : ''}`}
      onClick={onClick}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <CompareToggleButton
            item={{ id: itemId, name: item.data.name, data: item }}
            size="sm"
          />
          {item.data.name}
        </div>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="cursor-help">
              {categoryLabels[item.type]}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Item category</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              className={`cursor-help ${rarityColor.bg} ${rarityColor.text} ${rarityColor.border}`}
            >
              {item.data.rarity}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Item rarity</TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
});

function ItemDetail({ item }: { item: InventoryItem }) {
  const gradient = categoryGradients[item.type] ?? 'from-gray-500 to-slate-600';

  return (
    <div className="space-y-4">
      <div className={`-mx-4 -mt-4 bg-gradient-to-r p-6 ${gradient}`}>
        <div className="rounded-xl bg-black/30 p-4">
          <h2 className="text-xl font-bold text-white drop-shadow">
            {item.data.name}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
              {categoryLabels[item.type]}
            </Badge>
            <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
              {item.data.rarity}
            </Badge>
          </div>
        </div>
      </div>

      {/* Type-specific details */}
      {item.type === 'utility' && (
        <UtilityDetail item={item.data as UtilityItem} />
      )}
      {item.type === 'consumable' && (
        <ConsumableDetail item={item.data as Consumable} />
      )}
      {item.type === 'potion' && <PotionDetail potion={item.data as Potion} />}
      {item.type === 'relic' && <RelicDetail relic={item.data as Relic} />}
      {item.type === 'weapon-mod' && (
        <WeaponModDetail mod={item.data as WeaponModification} />
      )}
      {item.type === 'armor-mod' && (
        <ArmorModDetail mod={item.data as ArmorModification} />
      )}
      {item.type === 'recipe' && <RecipeDetail recipe={item.data as Recipe} />}
    </div>
  );
}

function UtilityDetail({ item }: { item: UtilityItem }) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">Tier {item.tier}</Badge>
        <Badge variant="outline">{item.usageType}</Badge>
        {item.charges && (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-700 dark:text-purple-400"
          >
            {item.charges} charges
          </Badge>
        )}
        {item.rechargePeriod && (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-700 dark:text-blue-400"
          >
            Recharge: {item.rechargePeriod.replace('_', ' ')}
          </Badge>
        )}
      </div>
      {item.features.map((feature, idx) => (
        <div key={idx} className="bg-muted/50 rounded-lg border p-3">
          <div className="text-primary font-medium">{feature.name}</div>
          <p className="text-muted-foreground text-sm">{feature.description}</p>
        </div>
      ))}
    </>
  );
}

function ConsumableDetail({ item }: { item: Consumable }) {
  return (
    <>
      {item.duration && (
        <Badge variant="outline">Duration: {item.duration}</Badge>
      )}
      <div className="bg-muted/50 rounded-lg border p-3">
        <p className="text-sm">{item.effect}</p>
      </div>
      {item.features.length > 0 &&
        item.features.map((feature, idx) => (
          <div key={idx} className="bg-muted/30 rounded-lg border p-3">
            <div className="text-primary font-medium">{feature.name}</div>
            <p className="text-muted-foreground text-sm">
              {feature.description}
            </p>
          </div>
        ))}
    </>
  );
}

function PotionDetail({ potion }: { potion: Potion }) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className="bg-pink-500/10 text-pink-700 dark:text-pink-400"
        >
          {potion.potionType}
        </Badge>
        {potion.duration && (
          <Badge variant="outline">Duration: {potion.duration}</Badge>
        )}
      </div>
      <div className="bg-muted/50 rounded-lg border p-3">
        <p className="text-sm">{potion.effect}</p>
      </div>
    </>
  );
}

function RelicDetail({ relic }: { relic: Relic }) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {relic.traitBonus && (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-700 dark:text-blue-400"
          >
            +{relic.traitBonus.bonus} {relic.traitBonus.trait}
          </Badge>
        )}
        {relic.experienceBonus && (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-700 dark:text-green-400"
          >
            +{relic.experienceBonus.bonus} {relic.experienceBonus.experience}
          </Badge>
        )}
      </div>
      {relic.features.map((feature, idx) => (
        <div key={idx} className="bg-muted/50 rounded-lg border p-3">
          <div className="text-primary font-medium">{feature.name}</div>
          <p className="text-muted-foreground text-sm">{feature.description}</p>
        </div>
      ))}
      <p className="text-muted-foreground text-xs italic">
        {relic.exclusivity}
      </p>
    </>
  );
}

function WeaponModDetail({ mod }: { mod: WeaponModification }) {
  return (
    <>
      <Badge variant="outline" className="capitalize">
        {mod.modificationType}
      </Badge>
      {mod.traitChange && (
        <div className="bg-muted/50 rounded-lg border p-3">
          <div className="text-primary font-medium">Trait Change</div>
          <p className="text-muted-foreground text-sm">
            {mod.traitChange.trait} - {mod.traitChange.description}
          </p>
        </div>
      )}
      {mod.featureAdded && (
        <div className="bg-muted/50 rounded-lg border p-3">
          <div className="text-primary font-medium">
            {mod.featureAdded.name}
          </div>
          <p className="text-muted-foreground text-sm">
            {mod.featureAdded.description}
          </p>
        </div>
      )}
      {mod.features.map((feature, idx) => (
        <div key={idx} className="bg-muted/30 rounded-lg border p-3">
          <div className="text-primary font-medium">{feature.name}</div>
          <p className="text-muted-foreground text-sm">{feature.description}</p>
        </div>
      ))}
    </>
  );
}

function ArmorModDetail({ mod }: { mod: ArmorModification }) {
  return (
    <>
      <Badge variant="outline" className="capitalize">
        {mod.modificationType}
      </Badge>
      {mod.featureAdded && (
        <div className="bg-muted/50 rounded-lg border p-3">
          <div className="text-primary font-medium">
            {mod.featureAdded.name}
          </div>
          <p className="text-muted-foreground text-sm">
            {mod.featureAdded.description}
          </p>
        </div>
      )}
      {mod.features.map((feature, idx) => (
        <div key={idx} className="bg-muted/30 rounded-lg border p-3">
          <div className="text-primary font-medium">{feature.name}</div>
          <p className="text-muted-foreground text-sm">{feature.description}</p>
        </div>
      ))}
    </>
  );
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  return (
    <>
      <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
        <div className="font-medium text-purple-700 dark:text-purple-400">
          Creates
        </div>
        <p className="text-sm">{recipe.craftedItem}</p>
      </div>
      {recipe.materials.length > 0 && (
        <div>
          <h4 className="mb-2 font-medium">Materials</h4>
          <ul className="text-muted-foreground list-inside list-disc text-sm">
            {recipe.materials.map((mat, idx) => (
              <li key={idx}>{mat}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="bg-muted/50 rounded-lg border p-3">
        <p className="text-sm">{recipe.instructions}</p>
      </div>
      {recipe.downtimeRequired && (
        <Badge
          variant="outline"
          className="bg-orange-500/10 text-orange-700 dark:text-orange-400"
        >
          Requires Downtime
        </Badge>
      )}
    </>
  );
}

type InventorySortKey = 'name' | 'type' | 'rarity';

// Stable loader function for useDeferredLoad
const loadAllItems = () => getAllItems();

const INVENTORY_SORTERS: Record<
  InventorySortKey,
  (a: InventoryItem, b: InventoryItem) => number
> = {
  name: (a, b) => a.data.name.localeCompare(b.data.name),
  type: (a, b) => {
    const cmp = a.type.localeCompare(b.type);
    return cmp === 0 ? a.data.name.localeCompare(b.data.name) : cmp;
  },
  rarity: (a, b) => {
    const cmp = (a.data.rarity || '').localeCompare(b.data.rarity || '');
    return cmp === 0 ? a.data.name.localeCompare(b.data.name) : cmp;
  },
};

const categoryOrder = [
  'utility',
  'consumable',
  'potion',
  'relic',
  'weapon-mod',
  'armor-mod',
  'recipe',
];

function sortInventoryItems(
  items: InventoryItem[],
  sortBy: InventorySortKey,
  sortDir: 'asc' | 'desc'
) {
  const sorted = [...items].sort(INVENTORY_SORTERS[sortBy]);
  return sortDir === 'asc' ? sorted : sorted.reverse();
}

function groupInventoryItems(items: InventoryItem[]) {
  const groups: Record<string, InventoryItem[]> = {};
  for (const item of items) {
    if (!groups[item.type]) groups[item.type] = [];
    groups[item.type].push(item);
  }
  return groups;
}

type InventoryHeaderProps = {
  isMobile: boolean;
  filterGroups: FilterGroup[];
  filterState: ReturnType<typeof useFilterState>['filterState'];
  onSearchChange: ReturnType<typeof useFilterState>['onSearchChange'];
  onFilterChange: ReturnType<typeof useFilterState>['onFilterChange'];
  onClearFilters: ReturnType<typeof useFilterState>['onClearFilters'];
  filteredCount: number;
  totalCount: number;
};

function InventoryHeader({
  isMobile,
  filterGroups,
  filterState,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  filteredCount,
  totalCount,
}: InventoryHeaderProps) {
  return (
    <div className="bg-background shrink-0 border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Backpack className="size-4 text-cyan-500" />
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Inventory Items
            </span>
          </div>
          <ResultsCounter
            filtered={filteredCount}
            total={totalCount}
            label="items"
          />
        </div>
        {/* Mobile filter button only */}
        {isMobile && (
          <ReferenceFilter
            filterGroups={filterGroups}
            filterState={filterState}
            onSearchChange={onSearchChange}
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
            resultCount={filteredCount}
            totalCount={totalCount}
            searchPlaceholder="Search inventory..."
          />
        )}
      </div>
    </div>
  );
}

function CategorySection({
  category,
  items,
  isExpanded,
  onToggle,
  onSelectItem,
}: {
  category: string;
  items: InventoryItem[];
  isExpanded: boolean;
  onToggle: () => void;
  onSelectItem: (item: InventoryItem) => void;
}) {
  const gradient = categoryGradients[category] ?? 'from-gray-500 to-slate-600';

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button className="hover:bg-muted/50 bg-card flex w-full items-center justify-between rounded-lg border p-3 transition-colors">
          <div className="flex items-center gap-3">
            <span
              className={`inline-block h-3 w-3 rounded-full bg-gradient-to-r ${gradient}`}
            />
            <h2 className="text-lg font-semibold">
              {categoryLabels[category]}s
            </h2>
            <Badge variant="secondary">{items.length}</Badge>
          </div>
          {isExpanded ? (
            <ChevronDown className="text-muted-foreground size-5" />
          ) : (
            <ChevronRight className="text-muted-foreground size-5" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, idx) => (
            <ItemCard
              key={`${item.data.name}-${idx}`}
              item={item}
              onClick={() => onSelectItem(item)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const InventoryGridSections = React.memo(function InventoryGridSections({
  groupedItems,
  onSelectItem,
  filterState,
  onSearchChange,
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirChange,
  viewMode,
  onViewModeChange,
  isMobile,
}: {
  groupedItems: Record<string, InventoryItem[]>;
  onSelectItem: (item: InventoryItem) => void;
  filterState: ReturnType<typeof useFilterState>['filterState'];
  onSearchChange: (search: string) => void;
  sortBy: InventorySortKey;
  sortDir: 'asc' | 'desc';
  onSortByChange: (value: InventorySortKey) => void;
  onSortDirChange: (value: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (value: 'grid' | 'table') => void;
  isMobile: boolean;
}) {
  const visibleCategories = categoryOrder.filter(
    category => groupedItems[category]?.length > 0
  );

  // Use extracted hook for expand/collapse state
  const {
    toggleCategory,
    expandAll,
    collapseAll,
    allExpanded,
    allCollapsed,
    isCategoryExpanded,
  } = useCategoryExpandState(visibleCategories);

  const SortIcon = sortDir === 'asc' ? ArrowUp : ArrowDown;
  const sortDirLabel = sortDir === 'asc' ? 'Ascending' : 'Descending';
  const handleToggleSortDir = React.useCallback(
    () => onSortDirChange(sortDir === 'asc' ? 'desc' : 'asc'),
    [sortDir, onSortDirChange]
  );

  return (
    <div className="space-y-4">
      {/* Toolbar with search, sort, view, and expand/collapse controls */}
      <div className="bg-muted/30 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
        {/* Left side: Search */}
        {!isMobile && (
          <div className="relative max-w-xs min-w-[200px] flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={filterState.search}
              onChange={e => onSearchChange(e.target.value)}
              className="bg-background h-9 w-full rounded-md border pr-8 pl-9 text-sm transition-colors outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
            {filterState.search && (
              <button
                onClick={() => onSearchChange('')}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 transition-colors"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        )}

        {/* Right side: Sort, View, Expand/Collapse */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <select
                  value={sortBy}
                  onChange={e =>
                    onSortByChange(e.target.value as InventorySortKey)
                  }
                  className="bg-background h-8 cursor-pointer rounded-md border px-2 text-sm"
                >
                  <option value="name">Name</option>
                  <option value="type">Type</option>
                  <option value="rarity">Rarity</option>
                </select>
              </TooltipTrigger>
              <TooltipContent>Sort by</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={handleToggleSortDir}
                >
                  <SortIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{sortDirLabel}</TooltipContent>
            </Tooltip>
          </div>

          {/* Divider */}
          <div className="bg-border h-6 w-px" />

          {/* View mode toggle */}
          {!isMobile && (
            <>
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={v =>
                  v && onViewModeChange(v as 'grid' | 'table')
                }
                className="gap-0"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="grid"
                      aria-label="Grid view"
                      className="size-8 rounded-r-none"
                    >
                      <Grid3X3 className="size-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>Grid view</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="table"
                      aria-label="Table view"
                      className="size-8 rounded-l-none"
                    >
                      <List className="size-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>Table view</TooltipContent>
                </Tooltip>
              </ToggleGroup>

              {/* Divider */}
              <div className="bg-border h-6 w-px" />
            </>
          )}

          {/* Expand/Collapse controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={expandAll}
                  disabled={allExpanded}
                  className="h-8 px-2 text-xs"
                >
                  Expand
                </Button>
              </TooltipTrigger>
              <TooltipContent>Expand all categories</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={collapseAll}
                  disabled={allCollapsed}
                  className="h-8 px-2 text-xs"
                >
                  Collapse
                </Button>
              </TooltipTrigger>
              <TooltipContent>Collapse all categories</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {visibleCategories.map(category => (
        <CategorySection
          key={category}
          category={category}
          items={groupedItems[category]}
          isExpanded={isCategoryExpanded(category)}
          onToggle={() => toggleCategory(category)}
          onSelectItem={onSelectItem}
        />
      ))}
    </div>
  );
});

const InventoryTableView = React.memo(function InventoryTableView({
  items,
  sortBy,
  sortDir,
  onSort,
  onSelectItem,
}: {
  items: InventoryItem[];
  sortBy: InventorySortKey;
  sortDir: 'asc' | 'desc';
  onSort: (column: InventorySortKey) => void;
  onSelectItem: (item: InventoryItem) => void;
}) {
  return (
    <Table>
      <TableHeader className="bg-background sticky top-0 z-10">
        <TableRow>
          <SortableTableHead
            column="name"
            label="Name"
            currentSort={sortBy}
            direction={sortDir}
            onSort={onSort}
          />
          <SortableTableHead
            column="type"
            label="Category"
            currentSort={sortBy}
            direction={sortDir}
            onSort={onSort}
          />
          <SortableTableHead
            column="rarity"
            label="Rarity"
            currentSort={sortBy}
            direction={sortDir}
            onSort={onSort}
          />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, idx) => (
          <ItemTableRow
            key={`${item.data.name}-${idx}`}
            item={item}
            onClick={() => onSelectItem(item)}
          />
        ))}
      </TableBody>
    </Table>
  );
});

function InventoryDetailSheet({
  selectedItem,
  onClose,
}: {
  selectedItem: InventoryItem | null;
  onClose: () => void;
}) {
  // Defer rendering heavy content until sheet animation completes
  const shouldRenderContent = useDeferredSheetContent(selectedItem !== null);

  return (
    <ResponsiveSheet
      open={selectedItem !== null}
      onOpenChange={open => !open && onClose()}
    >
      <ResponsiveSheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-md"
        hideCloseButton
      >
        {selectedItem && (
          <>
            <ResponsiveSheetHeader className="bg-background shrink-0 border-b p-4">
              <ResponsiveSheetTitle className="flex items-center justify-between gap-2">
                <span className="truncate">{selectedItem.data.name}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <KeyboardHint />
                  <DetailCloseButton onClose={onClose} />
                </div>
              </ResponsiveSheetTitle>
            </ResponsiveSheetHeader>
            <div className="scroll-container-optimized min-h-0 flex-1 overflow-y-auto p-4">
              {shouldRenderContent ? (
                <ItemDetail item={selectedItem} />
              ) : (
                <SheetContentSkeleton />
              )}
            </div>
          </>
        )}
      </ResponsiveSheetContent>
    </ResponsiveSheet>
  );
}

function InventoryCompareDrawer() {
  return (
    <CompareDrawer
      title="Compare Items"
      renderComparison={(items: ComparisonItem<InventoryItem>[]) => (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-card overflow-hidden rounded-lg border p-4"
            >
              <h3 className="mb-3 text-lg font-semibold">{item.name}</h3>
              <ItemDetail item={item.data} />
            </div>
          ))}
        </div>
      )}
    />
  );
}

type InventoryLayoutProps = {
  isInitialLoading: boolean;
  isMobile: boolean;
  filterGroups: FilterGroup[];
  filterState: ReturnType<typeof useFilterState>['filterState'];
  onSearchChange: ReturnType<typeof useFilterState>['onSearchChange'];
  onFilterChange: ReturnType<typeof useFilterState>['onFilterChange'];
  onClearFilters: ReturnType<typeof useFilterState>['onClearFilters'];
  filteredItems: InventoryItem[];
  totalCount: number;
  sortBy: InventorySortKey;
  sortDir: 'asc' | 'desc';
  onSortByChange: (value: InventorySortKey) => void;
  onSortDirChange: (value: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (value: 'grid' | 'table') => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  groupedItems: Record<string, InventoryItem[]>;
  onSelectItem: (item: InventoryItem) => void;
  selectedItem: InventoryItem | null;
  onCloseItem: () => void;
  onSort: (column: InventorySortKey) => void;
};

function InventoryLayout({
  isInitialLoading,
  isMobile,
  filterGroups,
  filterState,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  filteredItems,
  totalCount,
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirChange,
  viewMode,
  onViewModeChange,
  scrollRef,
  groupedItems,
  onSelectItem,
  selectedItem,
  onCloseItem,
  onSort,
}: InventoryLayoutProps) {
  if (isInitialLoading) {
    return <ReferencePageSkeleton showFilters={!isMobile} />;
  }

  return (
    <div className="flex min-h-0 flex-1">
      {!isMobile && (
        <ReferenceFilter
          filterGroups={filterGroups}
          filterState={filterState}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          resultCount={filteredItems.length}
          totalCount={totalCount}
          searchPlaceholder="Search inventory..."
          hideSearch
        />
      )}

      <div className="flex min-h-0 flex-1 flex-col">
        <InventoryHeader
          isMobile={isMobile}
          filterGroups={filterGroups}
          filterState={filterState}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          filteredCount={filteredItems.length}
          totalCount={totalCount}
        />

        <div
          ref={scrollRef}
          className="relative min-h-0 flex-1 overflow-y-auto"
        >
          <div className="p-4">
            {viewMode === 'grid' ? (
              <InventoryGridSections
                groupedItems={groupedItems}
                onSelectItem={onSelectItem}
                filterState={filterState}
                onSearchChange={onSearchChange}
                sortBy={sortBy}
                sortDir={sortDir}
                onSortByChange={onSortByChange}
                onSortDirChange={onSortDirChange}
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
                isMobile={isMobile}
              />
            ) : (
              <InventoryTableView
                items={filteredItems}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
                onSelectItem={onSelectItem}
              />
            )}

            {filteredItems.length === 0 && (
              <ReferenceEmptyState
                itemType="inventory items"
                onClearFilters={onClearFilters}
              />
            )}
          </div>
        </div>
      </div>

      <BackToTop scrollRef={scrollRef} />

      <InventoryDetailSheet selectedItem={selectedItem} onClose={onCloseItem} />

      <InventoryCompareDrawer />
    </div>
  );
}

function InventoryReferencePage() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = React.useState<InventorySortKey>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(
    null
  );

  // Force grid view on mobile - tables are too wide for small screens
  React.useEffect(() => {
    if (isMobile && viewMode === 'table') {
      setViewMode('grid');
    }
  }, [isMobile, viewMode]);

  // Defer data loading until after initial paint
  const { data: allItems, isLoading: isInitialLoading } =
    useDeferredLoad(loadAllItems);

  const filterGroups = React.useMemo(
    () => (allItems ? buildFilterGroups(allItems) : []),
    [allItems]
  );

  const { filterState, onSearchChange, onFilterChange, onClearFilters } =
    useFilterState(filterGroups);

  const filteredItems = React.useMemo(() => {
    if (!allItems) return [];
    const items = filterItems(
      allItems,
      filterState.search,
      filterState.filters
    );
    return sortInventoryItems(items, sortBy, sortDir);
  }, [allItems, filterState, sortBy, sortDir]);

  // Use deferred rendering for smooth filtering on mobile
  const { deferredItems } = useDeferredItems(filteredItems);

  const groupedItems = React.useMemo(
    () => groupInventoryItems(deferredItems),
    [deferredItems]
  );

  // Build display-ordered items for keyboard navigation (matching grid display order)
  const displayOrderedItems = React.useMemo(() => {
    return categoryOrder
      .filter(category => groupedItems[category]?.length > 0)
      .flatMap(category => groupedItems[category]);
  }, [groupedItems]);

  // Keyboard navigation
  useKeyboardNavigation({
    items: viewMode === 'grid' ? displayOrderedItems : deferredItems,
    selectedItem,
    onSelect: setSelectedItem,
    onClose: () => setSelectedItem(null),
  });

  const handleSortClick = React.useCallback(
    (column: InventorySortKey) => {
      if (sortBy === column) {
        setSortDir(dir => (dir === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(column);
        setSortDir('asc');
      }
    },
    [sortBy]
  );

  const handleCloseItem = React.useCallback(() => {
    React.startTransition(() => {
      setSelectedItem(null);
    });
  }, []);

  const totalCount = allItems?.length ?? 0;

  return (
    <InventoryLayout
      isInitialLoading={isInitialLoading}
      isMobile={isMobile}
      filterGroups={filterGroups}
      filterState={filterState}
      onSearchChange={onSearchChange}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      filteredItems={filteredItems}
      totalCount={totalCount}
      sortBy={sortBy}
      sortDir={sortDir}
      onSortByChange={setSortBy}
      onSortDirChange={setSortDir}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      scrollRef={scrollRef}
      groupedItems={groupedItems}
      onSelectItem={setSelectedItem}
      selectedItem={selectedItem}
      onCloseItem={handleCloseItem}
      onSort={handleSortClick}
    />
  );
}

function InventoryPageWrapper() {
  return (
    <CompareProvider maxItems={4}>
      <InventoryReferencePage />
    </CompareProvider>
  );
}
