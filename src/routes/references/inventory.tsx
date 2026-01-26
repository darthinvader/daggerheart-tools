// Inventory reference page with page-specific detail components

import { createFileRoute } from '@tanstack/react-router';
import { ArrowDown, ArrowUp, Grid3X3, List } from 'lucide-react';
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
  ReferenceFilter,
  ReferencePageSkeleton,
  ResultsCounter,
  SortableTableHead,
  useCompare,
  useDeferredItems,
  useDeferredLoad,
  useFilterState,
} from '@/components/references';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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

function ItemCard({
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
      className={`hover:border-primary/50 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${inCompare ? 'ring-primary ring-2' : ''}`}
      onClick={onClick}
    >
      <div className={`h-2 bg-linear-to-r ${gradient}`} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            {item.data.name}
          </CardTitle>
          <div className="flex shrink-0 items-center gap-1">
            <CompareToggleButton
              item={{ id: itemId, name: item.data.name, data: item }}
              size="sm"
            />
            <Badge
              className={`${rarityColor.bg} ${rarityColor.text} ${rarityColor.border}`}
            >
              {item.data.rarity}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-xs">
          {categoryLabels[item.type]}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
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
      </CardContent>
    </Card>
  );
}

function ItemTableRow({
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
      className={`hover:bg-muted/50 cursor-pointer ${inCompare ? 'bg-primary/10' : ''}`}
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
      <TableCell>{categoryLabels[item.type]}</TableCell>
      <TableCell>
        <Badge
          className={`${rarityColor.bg} ${rarityColor.text} ${rarityColor.border}`}
        >
          {item.data.rarity}
        </Badge>
      </TableCell>
    </TableRow>
  );
}

function ItemDetail({ item }: { item: InventoryItem }) {
  const gradient = categoryGradients[item.type] ?? 'from-gray-500 to-slate-600';

  return (
    <div className="space-y-4">
      <div className={`-mx-4 -mt-4 bg-linear-to-r p-4 ${gradient}`}>
        <h2 className="text-xl font-bold text-white">{item.data.name}</h2>
        <div className="mt-2 flex gap-2">
          <Badge className="border-white/30 bg-white/20 text-white">
            {categoryLabels[item.type]}
          </Badge>
          <Badge className="border-white/30 bg-white/20 text-white">
            {item.data.rarity}
          </Badge>
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
  sortBy: InventorySortKey;
  sortDir: 'asc' | 'desc';
  onSortByChange: (value: InventorySortKey) => void;
  onSortDirChange: (value: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (value: 'grid' | 'table') => void;
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
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirChange,
  viewMode,
  onViewModeChange,
}: InventoryHeaderProps) {
  return (
    <div className="bg-background shrink-0 border-b p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="bg-linear-to-r from-cyan-500 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
            <Backpack className="mr-2 inline-block size-6" />
            Inventory Items
          </h1>
          <ResultsCounter
            filtered={filteredCount}
            total={totalCount}
            label="items"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={e => onSortByChange(e.target.value as InventorySortKey)}
              className="bg-background h-9 rounded-md border px-2 text-sm"
            >
              <option value="name">Name</option>
              <option value="type">Type</option>
              <option value="rarity">Rarity</option>
            </select>
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={() =>
                onSortDirChange(sortDir === 'asc' ? 'desc' : 'asc')
              }
              aria-label={
                sortDir === 'asc' ? 'Sort descending' : 'Sort ascending'
              }
            >
              {sortDir === 'asc' ? (
                <ArrowUp className="size-4" />
              ) : (
                <ArrowDown className="size-4" />
              )}
            </Button>
          </div>
          {!isMobile && (
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={v => v && onViewModeChange(v as 'grid' | 'table')}
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid3X3 className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" aria-label="Table view">
                <List className="size-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
      </div>
    </div>
  );
}

function InventoryGridSections({
  groupedItems,
  onSelectItem,
}: {
  groupedItems: Record<string, InventoryItem[]>;
  onSelectItem: (item: InventoryItem) => void;
}) {
  return (
    <div className="space-y-8">
      {categoryOrder
        .filter(category => groupedItems[category]?.length > 0)
        .map(category => {
          const items = groupedItems[category];
          const gradient =
            categoryGradients[category] ?? 'from-gray-500 to-slate-600';
          return (
            <section key={category}>
              <h2 className="bg-background/95 sticky top-0 z-10 -mx-4 mb-4 flex items-center gap-2 px-4 py-2 text-xl font-semibold backdrop-blur">
                <span
                  className={`inline-block h-3 w-3 rounded-full bg-linear-to-r ${gradient}`}
                />
                {categoryLabels[category]}s
                <Badge variant="outline">{items.length}</Badge>
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item, idx) => (
                  <ItemCard
                    key={`${item.data.name}-${idx}`}
                    item={item}
                    onClick={() => onSelectItem(item)}
                  />
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}

function InventoryTableView({
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
      <TableHeader>
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
}

function InventoryEmptyState({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <p>No inventory items match your filters.</p>
      <Button variant="link" onClick={onClearFilters} className="mt-2">
        Clear all filters
      </Button>
    </div>
  );
}

function InventoryDetailSheet({
  selectedItem,
  onClose,
}: {
  selectedItem: InventoryItem | null;
  onClose: () => void;
}) {
  return (
    <Sheet
      open={selectedItem !== null}
      onOpenChange={open => !open && onClose()}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-md"
        hideCloseButton
      >
        {selectedItem && (
          <>
            <SheetHeader className="bg-background shrink-0 border-b p-4">
              <SheetTitle className="flex items-center justify-between gap-2">
                <span className="truncate">{selectedItem.data.name}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <KeyboardHint />
                  <DetailCloseButton onClose={onClose} />
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <ItemDetail item={selectedItem} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
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
  isFiltering: boolean;
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
  isFiltering,
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
          sortBy={sortBy}
          sortDir={sortDir}
          onSortByChange={onSortByChange}
          onSortDirChange={onSortDirChange}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />

        <div
          ref={scrollRef}
          className="relative min-h-0 flex-1 overflow-y-auto"
        >
          {isFiltering && (
            <div className="bg-background/60 absolute inset-0 z-10 flex items-start justify-center pt-20 backdrop-blur-[1px]">
              <div className="bg-background rounded-lg border p-4 shadow-lg">
                <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
              </div>
            </div>
          )}
          <div className="p-4">
            {viewMode === 'grid' ? (
              <InventoryGridSections
                groupedItems={groupedItems}
                onSelectItem={onSelectItem}
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
              <InventoryEmptyState onClearFilters={onClearFilters} />
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
  const { deferredItems, isPending: isFiltering } =
    useDeferredItems(filteredItems);

  const groupedItems = React.useMemo(
    () => groupInventoryItems(deferredItems),
    [deferredItems]
  );

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
      isFiltering={isFiltering}
      groupedItems={groupedItems}
      onSelectItem={setSelectedItem}
      selectedItem={selectedItem}
      onCloseItem={() => setSelectedItem(null)}
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
