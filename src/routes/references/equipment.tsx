import { createFileRoute } from '@tanstack/react-router';
import { ArrowUpDown, Grid3X3, List } from 'lucide-react';
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
  ResultsCounter,
  SortableTableHead,
  useCompare,
  useFilterState,
  useKeyboardNavigation,
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ALL_ARMOR,
  ALL_COMBAT_WHEELCHAIRS,
  ALL_PRIMARY_WEAPONS,
  ALL_SECONDARY_WEAPONS,
} from '@/lib/data/equipment';
import type {
  CombatWheelchair,
  PrimaryWeapon,
  SecondaryWeapon,
  SpecialArmor,
  StandardArmor,
} from '@/lib/schemas/equipment';

export const Route = createFileRoute('/references/equipment')({
  component: EquipmentPageWrapper,
});

type EquipmentItem =
  | { type: 'primary'; data: PrimaryWeapon }
  | { type: 'secondary'; data: SecondaryWeapon }
  | { type: 'armor'; data: StandardArmor | SpecialArmor }
  | { type: 'wheelchair'; data: CombatWheelchair };

// Color mappings
const tierColors: Record<string, string> = {
  '1': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  '2': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
  '3': 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
  '4': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
};

const tierDotColors: Record<string, string> = {
  '1': 'bg-emerald-500',
  '2': 'bg-blue-500',
  '3': 'bg-purple-500',
  '4': 'bg-amber-500',
};

const traitColors: Record<string, string> = {
  Agility:
    'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
  Strength: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30',
  Finesse: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30',
  Instinct:
    'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  Presence:
    'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/30',
  Knowledge:
    'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
};

const damageTypeColors: Record<string, string> = {
  phy: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
  mag: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30',
};

function formatDamage(damage: PrimaryWeapon['damage']): string {
  const { count, diceType, modifier, type } = damage;
  const modStr =
    modifier > 0 ? `+${modifier}` : modifier < 0 ? `${modifier}` : '';
  const typeStr = type === 'phy' ? 'physical' : 'magic';
  return `${count}d${diceType}${modStr} ${typeStr}`;
}

// Build filter groups
const filterGroups: FilterGroup[] = [
  {
    id: 'category',
    label: 'Category',
    defaultOpen: true,
    options: [
      {
        value: 'primary',
        label: 'Primary Weapons',
        count: ALL_PRIMARY_WEAPONS.length,
      },
      {
        value: 'secondary',
        label: 'Secondary Weapons',
        count: ALL_SECONDARY_WEAPONS.length,
      },
      { value: 'armor', label: 'Armor', count: ALL_ARMOR.length },
      {
        value: 'wheelchair',
        label: 'Combat Wheelchairs',
        count: ALL_COMBAT_WHEELCHAIRS.length,
      },
    ],
  },
  {
    id: 'tier',
    label: 'Tier',
    defaultOpen: true,
    options: [
      { value: '1', label: 'Tier 1' },
      { value: '2', label: 'Tier 2' },
      { value: '3', label: 'Tier 3' },
      { value: '4', label: 'Tier 4' },
    ],
  },
  {
    id: 'trait',
    label: 'Trait',
    defaultOpen: false,
    options: [
      { value: 'Agility', label: 'Agility' },
      { value: 'Strength', label: 'Strength' },
      { value: 'Finesse', label: 'Finesse' },
      { value: 'Instinct', label: 'Instinct' },
      { value: 'Presence', label: 'Presence' },
      { value: 'Knowledge', label: 'Knowledge' },
    ],
  },
  {
    id: 'damageType',
    label: 'Damage Type',
    defaultOpen: false,
    options: [
      { value: 'phy', label: 'Physical' },
      { value: 'mag', label: 'Magic' },
    ],
  },
  {
    id: 'range',
    label: 'Range',
    defaultOpen: false,
    options: [
      { value: 'Melee', label: 'Melee' },
      { value: 'Ranged', label: 'Ranged' },
      { value: 'Very Close', label: 'Very Close' },
      { value: 'Close', label: 'Close' },
      { value: 'Far', label: 'Far' },
      { value: 'Very Far', label: 'Very Far' },
    ],
  },
];

// Combine all items into a unified array for filtering
function getAllItems(): EquipmentItem[] {
  const items: EquipmentItem[] = [];
  for (const w of ALL_PRIMARY_WEAPONS) {
    items.push({ type: 'primary', data: w });
  }
  for (const w of ALL_SECONDARY_WEAPONS) {
    items.push({ type: 'secondary', data: w });
  }
  for (const a of ALL_ARMOR) {
    items.push({ type: 'armor', data: a });
  }
  for (const c of ALL_COMBAT_WHEELCHAIRS) {
    items.push({ type: 'wheelchair', data: c });
  }
  return items;
}

function filterItems(
  items: EquipmentItem[],
  search: string,
  filters: Record<string, Set<string>>
): EquipmentItem[] {
  return items.filter(item => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      if (!item.data.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Category filter
    if (filters.category.size > 0 && !filters.category.has(item.type)) {
      return false;
    }

    // Tier filter
    if (filters.tier.size > 0 && !filters.tier.has(item.data.tier)) {
      return false;
    }

    // Trait filter (armor doesn't have trait)
    if (filters.trait.size > 0) {
      if (item.type === 'armor') return false;
      const weaponItem = item.data as
        | PrimaryWeapon
        | SecondaryWeapon
        | CombatWheelchair;
      if (!filters.trait.has(weaponItem.trait)) return false;
    }

    // Damage type filter (armor doesn't have damage)
    if (filters.damageType.size > 0) {
      if (item.type === 'armor') return false;
      const weaponItem = item.data as
        | PrimaryWeapon
        | SecondaryWeapon
        | CombatWheelchair;
      if (!filters.damageType.has(weaponItem.damage.type)) return false;
    }

    // Range filter
    if (filters.range.size > 0) {
      if (item.type === 'armor') return false;
      const weaponItem = item.data as
        | PrimaryWeapon
        | SecondaryWeapon
        | CombatWheelchair;
      if (!filters.range.has(weaponItem.range)) return false;
    }

    return true;
  });
}

// Helper to get unique equipment ID for comparison
function getEquipmentId(item: EquipmentItem): string {
  return `${item.type}-${item.data.name}`;
}

// Compact card for grid view
function EquipmentCard({
  item,
  onClick,
}: {
  item: EquipmentItem;
  onClick: () => void;
}) {
  const { isInCompare } = useCompare();
  const { type, data } = item;
  const isArmor = type === 'armor';
  const isWeapon =
    type === 'primary' || type === 'secondary' || type === 'wheelchair';
  const itemId = getEquipmentId(item);
  const inCompare = isInCompare(itemId);

  return (
    <Card
      className={`hover:border-primary/50 cursor-pointer overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg ${inCompare ? 'ring-primary ring-2' : ''}`}
      onClick={onClick}
    >
      {/* Tier indicator bar */}
      <div className={`h-1 ${tierDotColors[data.tier]}`} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="truncate text-base leading-tight">
            {data.name}
          </CardTitle>
          <div className="flex shrink-0 items-center gap-1">
            <CompareToggleButton
              item={{ id: itemId, name: data.name, data: item }}
              size="sm"
            />
            <Badge className={tierColors[data.tier]} variant="outline">
              T{data.tier}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-xs capitalize">
          {type === 'primary'
            ? 'Primary Weapon'
            : type === 'secondary'
              ? 'Secondary Weapon'
              : type === 'armor'
                ? (data as StandardArmor | SpecialArmor).armorType
                : `Combat Wheelchair • ${(data as CombatWheelchair).frameType}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {isWeapon && (
          <>
            {/* Primary stats row */}
            <div className="flex flex-wrap gap-1">
              <Badge
                variant="outline"
                className={traitColors[(data as PrimaryWeapon).trait]}
              >
                {(data as PrimaryWeapon).trait}
              </Badge>
              <Badge
                variant="outline"
                className={
                  damageTypeColors[(data as PrimaryWeapon).damage.type]
                }
              >
                {formatDamage((data as PrimaryWeapon).damage)}
              </Badge>
            </div>
            {/* Secondary stats row */}
            <div className="flex flex-wrap gap-1 text-xs">
              <Badge variant="secondary" className="py-0 text-xs">
                {(data as PrimaryWeapon).range}
              </Badge>
              <Badge variant="secondary" className="py-0 text-xs">
                {(data as PrimaryWeapon).burden}
              </Badge>
              {data.features && data.features.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-muted-foreground py-0 text-xs"
                >
                  {data.features.length} feature
                  {data.features.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </>
        )}
        {isArmor && (
          <>
            {/* Armor stats */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted/50 rounded p-2 text-center">
                <div className="text-muted-foreground text-xs">Armor</div>
                <div className="font-bold">
                  {(data as StandardArmor).baseScore}
                </div>
              </div>
              <div className="bg-muted/50 rounded p-2 text-center">
                <div className="text-muted-foreground text-xs">Evasion</div>
                <div className="font-bold">
                  {(data as StandardArmor).evasionModifier >= 0 ? '+' : ''}
                  {(data as StandardArmor).evasionModifier}
                </div>
              </div>
            </div>
            {/* Thresholds */}
            <div className="flex gap-1.5 text-xs">
              <Badge
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 py-0 text-amber-700 dark:text-amber-400"
              >
                Major {(data as StandardArmor).baseThresholds.major}+
              </Badge>
              <Badge
                variant="outline"
                className="border-red-500/30 bg-red-500/10 py-0 text-red-700 dark:text-red-400"
              >
                Severe {(data as StandardArmor).baseThresholds.severe}+
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Table row component
function EquipmentTableRow({
  item,
  onClick,
}: {
  item: EquipmentItem;
  onClick: () => void;
}) {
  const { isInCompare } = useCompare();
  const { type, data } = item;
  const isArmor = type === 'armor';
  const itemId = getEquipmentId(item);
  const inCompare = isInCompare(itemId);

  return (
    <TableRow
      className={`hover:bg-muted/50 cursor-pointer ${inCompare ? 'bg-primary/10' : ''}`}
      onClick={onClick}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <CompareToggleButton
            item={{ id: itemId, name: data.name, data: item }}
            size="sm"
          />
          {data.name}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={tierColors[data.tier]} variant="outline">
          Tier {data.tier}
        </Badge>
      </TableCell>
      <TableCell className="capitalize">
        {type.replace('wheelchair', 'Combat Wheelchair')}
      </TableCell>
      <TableCell>
        {!isArmor ? (
          <Badge
            variant="outline"
            className={traitColors[(data as PrimaryWeapon).trait]}
          >
            {(data as PrimaryWeapon).trait}
          </Badge>
        ) : (
          '—'
        )}
      </TableCell>
      <TableCell>
        {!isArmor ? (
          <Badge
            variant="outline"
            className={damageTypeColors[(data as PrimaryWeapon).damage.type]}
          >
            {formatDamage((data as PrimaryWeapon).damage)}
          </Badge>
        ) : (
          <span>
            AS: {(data as StandardArmor).baseScore} / EV:{' '}
            {(data as StandardArmor).evasionModifier >= 0 ? '+' : ''}
            {(data as StandardArmor).evasionModifier}
          </span>
        )}
      </TableCell>
    </TableRow>
  );
}

// Detail panel content
function ItemDetail({ item }: { item: EquipmentItem }) {
  const { type, data } = item;

  if (type === 'armor') {
    const armor = data as StandardArmor | SpecialArmor;
    const isStandard = 'isStandard' in armor && armor.isStandard;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={tierColors[armor.tier]}>Tier {armor.tier}</Badge>
          <Badge variant="outline">
            {armor.armorType} {isStandard ? '(Standard)' : '(Special)'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-muted-foreground text-sm">Armor Score</div>
            <div className="text-2xl font-bold">{armor.baseScore}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-muted-foreground text-sm">Evasion</div>
            <div className="text-2xl font-bold">
              {armor.evasionModifier >= 0 ? '+' : ''}
              {armor.evasionModifier}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-700 dark:text-amber-400"
          >
            Major: {armor.baseThresholds.major}+
          </Badge>
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-700 dark:text-red-400"
          >
            Severe: {armor.baseThresholds.severe}+
          </Badge>
        </div>

        {armor.features && armor.features.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Features</h3>
            {armor.features.map((feature, idx) => (
              <div key={idx} className="bg-muted/30 rounded-lg border p-3">
                <div className="text-primary font-medium">{feature.name}</div>
                <div className="text-muted-foreground text-sm">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === 'wheelchair') {
    const wheelchair = data as CombatWheelchair;
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={tierColors[wheelchair.tier]}>
            Tier {wheelchair.tier}
          </Badge>
          <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400">
            {wheelchair.frameType}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={traitColors[wheelchair.trait]}>
            {wheelchair.trait}
          </Badge>
          <Badge variant="outline">{wheelchair.range}</Badge>
          <Badge variant="outline">{wheelchair.burden}</Badge>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-muted-foreground text-sm">Damage</div>
          <div className="text-xl font-bold">
            <Badge className={damageTypeColors[wheelchair.damage.type]}>
              {formatDamage(wheelchair.damage)}
            </Badge>
          </div>
        </div>

        {wheelchair.features && wheelchair.features.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Features</h3>
            {wheelchair.features.map((feature, idx) => (
              <div key={idx} className="bg-muted/30 rounded-lg border p-3">
                <div className="text-primary font-medium">{feature.name}</div>
                <div className="text-muted-foreground text-sm">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Primary or Secondary weapon
  const weapon = data as PrimaryWeapon | SecondaryWeapon;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge className={tierColors[weapon.tier]}>Tier {weapon.tier}</Badge>
        <Badge variant="outline" className="capitalize">
          {type} Weapon
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={traitColors[weapon.trait]}>
          {weapon.trait}
        </Badge>
        <Badge variant="outline">{weapon.range}</Badge>
        <Badge variant="outline">{weapon.burden}</Badge>
      </div>

      <div className="bg-muted/50 rounded-lg p-3">
        <div className="text-muted-foreground text-sm">Damage</div>
        <div className="text-xl font-bold">
          <Badge className={damageTypeColors[weapon.damage.type]}>
            {formatDamage(weapon.damage)}
          </Badge>
        </div>
      </div>

      {weapon.features && weapon.features.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Features</h3>
          {weapon.features.map((feature, idx) => (
            <div key={idx} className="bg-muted/30 rounded-lg border p-3">
              <div className="text-primary font-medium">{feature.name}</div>
              <div className="text-muted-foreground text-sm">
                {feature.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type EquipmentSortKey = 'name' | 'tier' | 'type' | 'trait';

function EquipmentReferencePage() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = React.useState<EquipmentSortKey>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedItem, setSelectedItem] = React.useState<EquipmentItem | null>(
    null
  );

  // Handle column header click for sorting
  const handleSortClick = React.useCallback(
    (column: EquipmentSortKey) => {
      if (sortBy === column) {
        setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(column);
        setSortDir('asc');
      }
    },
    [sortBy]
  );

  const allItems = React.useMemo(() => getAllItems(), []);

  const { filterState, onSearchChange, onFilterChange, onClearFilters } =
    useFilterState(filterGroups);

  const filteredItems = React.useMemo(() => {
    const items = filterItems(
      allItems,
      filterState.search,
      filterState.filters
    );

    // Apply sorting
    return [...items].sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'name':
          cmp = a.data.name.localeCompare(b.data.name);
          break;
        case 'tier':
          cmp = a.data.tier.localeCompare(b.data.tier);
          break;
        case 'type':
          cmp = a.type.localeCompare(b.type);
          break;
        case 'trait': {
          const traitA = 'trait' in a.data ? (a.data.trait ?? '') : '';
          const traitB = 'trait' in b.data ? (b.data.trait ?? '') : '';
          cmp = traitA.localeCompare(traitB);
          break;
        }
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [allItems, filterState, sortBy, sortDir]);

  // Group by category for sectioned display
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, EquipmentItem[]> = {
      primary: [],
      secondary: [],
      armor: [],
      wheelchair: [],
    };
    for (const item of filteredItems) {
      groups[item.type].push(item);
    }
    return groups;
  }, [filteredItems]);

  // Keyboard navigation
  useKeyboardNavigation({
    items: filteredItems,
    selectedItem,
    onSelect: setSelectedItem,
    onClose: () => setSelectedItem(null),
  });

  return (
    <div className="flex min-h-0 flex-1">
      {/* Filter sidebar - hidden on mobile, shown via sheet */}
      {!isMobile && (
        <ReferenceFilter
          filterGroups={filterGroups}
          filterState={filterState}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          resultCount={filteredItems.length}
          totalCount={allItems.length}
          searchPlaceholder="Search equipment..."
        />
      )}

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <div className="bg-background shrink-0 border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
                Equipment Reference
              </h1>
              <ResultsCounter
                filtered={filteredItems.length}
                total={allItems.length}
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
                  resultCount={filteredItems.length}
                  totalCount={allItems.length}
                  searchPlaceholder="Search equipment..."
                />
              )}
              {/* Sort control */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as EquipmentSortKey)}
                  className="bg-background h-9 rounded-md border px-2 text-sm"
                >
                  <option value="name">Name</option>
                  <option value="tier">Tier</option>
                  <option value="type">Type</option>
                  <option value="trait">Trait</option>
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                >
                  <ArrowUpDown className="size-4" />
                </Button>
              </div>
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={v => v && setViewMode(v as 'grid' | 'table')}
              >
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Grid3X3 className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table view">
                  <List className="size-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>

        {/* Content - scrollable */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="p-4">
            {viewMode === 'grid' ? (
              <div className="space-y-8">
                {Object.entries(groupedItems).map(([category, items]) => {
                  if (items.length === 0) return null;
                  const categoryLabel =
                    category === 'primary'
                      ? 'Primary Weapons'
                      : category === 'secondary'
                        ? 'Secondary Weapons'
                        : category === 'armor'
                          ? 'Armor'
                          : 'Combat Wheelchairs';

                  // Group by tier within category
                  const byTier = items.reduce(
                    (acc, item) => {
                      const tier = item.data.tier;
                      if (!acc[tier]) acc[tier] = [];
                      acc[tier].push(item);
                      return acc;
                    },
                    {} as Record<string, EquipmentItem[]>
                  );

                  return (
                    <section key={category}>
                      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                        {categoryLabel}
                        <Badge variant="outline">{items.length}</Badge>
                      </h2>
                      <div className="space-y-6">
                        {Object.entries(byTier)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([tier, tierItems]) => (
                            <div key={tier}>
                              <h3 className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
                                <span
                                  className={`inline-block h-2 w-2 rounded-full ${tierDotColors[tier]}`}
                                />
                                Tier {tier}
                              </h3>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {tierItems.map((item, idx) => (
                                  <EquipmentCard
                                    key={`${item.data.name}-${idx}`}
                                    item={item}
                                    onClick={() => setSelectedItem(item)}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHead
                      column="name"
                      label="Name"
                      currentSort={sortBy}
                      direction={sortDir}
                      onSort={handleSortClick}
                    />
                    <SortableTableHead
                      column="tier"
                      label="Tier"
                      currentSort={sortBy}
                      direction={sortDir}
                      onSort={handleSortClick}
                    />
                    <SortableTableHead
                      column="type"
                      label="Type"
                      currentSort={sortBy}
                      direction={sortDir}
                      onSort={handleSortClick}
                    />
                    <SortableTableHead
                      column="trait"
                      label="Trait"
                      currentSort={sortBy}
                      direction={sortDir}
                      onSort={handleSortClick}
                    />
                    <TableHead>Stats</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item, idx) => (
                    <EquipmentTableRow
                      key={`${item.data.name}-${idx}`}
                      item={item}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </TableBody>
              </Table>
            )}

            {filteredItems.length === 0 && (
              <div className="text-muted-foreground py-12 text-center">
                <p>No equipment matches your filters.</p>
                <Button
                  variant="link"
                  onClick={onClearFilters}
                  className="mt-2"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <BackToTop scrollRef={scrollRef} />

      {/* Detail panel - sheet on mobile, sidebar on desktop */}
      <Sheet
        open={selectedItem !== null}
        onOpenChange={open => !open && setSelectedItem(null)}
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
                    <DetailCloseButton onClose={() => setSelectedItem(null)} />
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

      {/* Comparison drawer */}
      <CompareDrawer
        title="Compare Equipment"
        renderComparison={(items: ComparisonItem<EquipmentItem>[]) => (
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
    </div>
  );
}

function EquipmentPageWrapper() {
  return (
    <CompareProvider maxItems={4}>
      <EquipmentReferencePage />
    </CompareProvider>
  );
}
