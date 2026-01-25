/* eslint-disable max-lines, complexity */
// Equipment reference page with page-specific detail components

import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  List,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import { Swords } from '@/lib/icons';
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

/** Parse feature description to extract stat modifiers for display */
function parseFeatureModifier(description: string): {
  modifier: string;
  isPositive: boolean;
} | null {
  // Match patterns like "+1 to Evasion", "−1 to Finesse", "+2 to attack rolls"
  const match = description.match(/([+−-])(\d+)\s+to\s+(\w+(?:\s+\w+)?)/i);
  if (!match) return null;
  const [, sign, value, stat] = match;
  const isPositive = sign === '+';
  const modifier = `${isPositive ? '+' : '−'}${value} ${stat}`;
  return { modifier, isPositive };
}

/** Get all feature modifiers from an equipment item */
function getFeatureModifiers(
  features: Array<{ name: string; description: string }> | undefined
): Array<{ name: string; modifier: string; isPositive: boolean }> {
  if (!features) return [];
  return features
    .map(f => {
      const parsed = parseFeatureModifier(f.description);
      if (!parsed) return null;
      return { name: f.name, ...parsed };
    })
    .filter(Boolean) as Array<{
    name: string;
    modifier: string;
    isPositive: boolean;
  }>;
}

type FeatureModifier = {
  name: string;
  modifier: string;
  isPositive: boolean;
};

function EquipmentFeatureBadges({
  modifiers,
  className,
}: {
  modifiers: FeatureModifier[];
  className?: string;
}) {
  if (modifiers.length === 0) return null;
  return (
    <div className={className ?? 'flex flex-wrap gap-1'}>
      {modifiers.map((modifier, idx) => (
        <Badge
          key={idx}
          variant="outline"
          className={
            modifier.isPositive
              ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
              : 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400'
          }
        >
          {modifier.modifier}
        </Badge>
      ))}
    </div>
  );
}

function EquipmentWeaponSummary({
  data,
  modifiers,
}: {
  data: PrimaryWeapon | SecondaryWeapon | CombatWheelchair;
  modifiers: FeatureModifier[];
}) {
  return (
    <>
      <div className="flex flex-wrap gap-1">
        <Badge variant="outline" className={traitColors[data.trait]}>
          {data.trait}
        </Badge>
        <Badge variant="outline" className={damageTypeColors[data.damage.type]}>
          {formatDamage(data.damage)}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-1 text-xs">
        <Badge variant="secondary" className="py-0 text-xs">
          {data.range}
        </Badge>
        <Badge variant="secondary" className="py-0 text-xs">
          {data.burden}
        </Badge>
      </div>
      <EquipmentFeatureBadges modifiers={modifiers} />
    </>
  );
}

function EquipmentArmorSummary({
  data,
  modifiers,
}: {
  data: StandardArmor | SpecialArmor;
  modifiers: FeatureModifier[];
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-muted/50 rounded p-2 text-center">
          <div className="text-muted-foreground text-xs">Armor</div>
          <div className="font-bold">{data.baseScore}</div>
        </div>
        <div className="bg-muted/50 rounded p-2 text-center">
          <div className="text-muted-foreground text-xs">Evasion</div>
          <div className="font-bold">
            {data.evasionModifier >= 0 ? '+' : ''}
            {data.evasionModifier}
          </div>
        </div>
      </div>
      <div className="flex gap-1.5 text-xs">
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 py-0 text-amber-700 dark:text-amber-400"
        >
          Major {data.baseThresholds.major}+
        </Badge>
        <Badge
          variant="outline"
          className="border-red-500/30 bg-red-500/10 py-0 text-red-700 dark:text-red-400"
        >
          Severe {data.baseThresholds.severe}+
        </Badge>
      </div>
      <EquipmentFeatureBadges modifiers={modifiers} />
    </>
  );
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
  const featureMods = getFeatureModifiers(data.features);

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
          <EquipmentWeaponSummary
            data={data as PrimaryWeapon | SecondaryWeapon | CombatWheelchair}
            modifiers={featureMods}
          />
        )}
        {isArmor && (
          <EquipmentArmorSummary
            data={data as StandardArmor | SpecialArmor}
            modifiers={featureMods}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Table row component - mobile-friendly with stacked layout
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
  const featureMods = getFeatureModifiers(data.features);

  return (
    <TableRow
      className={`hover:bg-muted/50 cursor-pointer ${inCompare ? 'bg-primary/10' : ''}`}
      onClick={onClick}
    >
      {/* Name + compare button - always visible */}
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <CompareToggleButton
            item={{ id: itemId, name: data.name, data: item }}
            size="sm"
          />
          <span className="truncate">{data.name}</span>
        </div>
      </TableCell>
      {/* Tier */}
      <TableCell className="hidden sm:table-cell">
        <Badge className={tierColors[data.tier]} variant="outline">
          T{data.tier}
        </Badge>
      </TableCell>
      {/* Type - hidden on mobile */}
      <TableCell className="hidden capitalize md:table-cell">
        {type.replace('wheelchair', 'Wheelchair')}
      </TableCell>
      {/* Trait or Armor stats */}
      <TableCell>
        {!isArmor ? (
          <Badge
            variant="outline"
            className={traitColors[(data as PrimaryWeapon).trait]}
          >
            {(data as PrimaryWeapon).trait}
          </Badge>
        ) : (
          <span className="text-xs">
            AS:{(data as StandardArmor).baseScore} EV:
            {(data as StandardArmor).evasionModifier >= 0 ? '+' : ''}
            {(data as StandardArmor).evasionModifier}
          </span>
        )}
      </TableCell>
      {/* Feature modifiers - compact display */}
      <TableCell className="hidden lg:table-cell">
        {featureMods.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {featureMods.map((m, i) => (
              <Badge
                key={i}
                variant="outline"
                className={`py-0 text-xs ${
                  m.isPositive
                    ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
                    : 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400'
                }`}
              >
                {m.modifier}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
    </TableRow>
  );
}

/** Collapsible features list for detail view */
function CollapsibleFeatureList({
  features,
}: {
  features: Array<{ name: string; description: string }>;
}) {
  const [isOpen, setIsOpen] = React.useState(true);

  if (!features || features.length === 0) return null;

  // Get stat modifiers for quick display
  const mods = getFeatureModifiers(features);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="bg-muted/30 hover:bg-muted/50 flex w-full items-center justify-between rounded-lg border p-3 transition-colors">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Features ({features.length})</h3>
            {/* Show modifiers summary when collapsed */}
            {!isOpen && mods.length > 0 && (
              <div className="flex gap-1">
                {mods.map((m, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className={`py-0 text-xs ${
                      m.isPositive
                        ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
                        : 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {m.modifier}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {isOpen ? (
            <ChevronDown className="text-muted-foreground size-4" />
          ) : (
            <ChevronRight className="text-muted-foreground size-4" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pt-2">
        {features.map((feature, idx) => {
          const mod = parseFeatureModifier(feature.description);
          return (
            <div key={idx} className="bg-muted/30 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <span className="text-primary font-medium">{feature.name}</span>
                {mod && (
                  <Badge
                    variant="outline"
                    className={`py-0 text-xs ${
                      mod.isPositive
                        ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
                        : 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {mod.modifier}
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground text-sm">
                {feature.description}
              </div>
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
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

        <CollapsibleFeatureList features={armor.features ?? []} />
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

        <CollapsibleFeatureList features={wheelchair.features ?? []} />
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

      <CollapsibleFeatureList features={weapon.features ?? []} />
    </div>
  );
}

type EquipmentSortKey = 'name' | 'tier' | 'type' | 'trait';

// Stable loader function for useDeferredLoad
const loadAllItems = () => getAllItems();

const EQUIPMENT_SORTERS: Record<
  EquipmentSortKey,
  (a: EquipmentItem, b: EquipmentItem) => number
> = {
  name: (a, b) => a.data.name.localeCompare(b.data.name),
  tier: (a, b) => {
    const cmp = a.data.tier.localeCompare(b.data.tier);
    return cmp === 0 ? a.data.name.localeCompare(b.data.name) : cmp;
  },
  type: (a, b) => {
    const cmp = a.type.localeCompare(b.type);
    return cmp === 0 ? a.data.name.localeCompare(b.data.name) : cmp;
  },
  trait: (a, b) => {
    const traitA = 'trait' in a.data ? (a.data.trait ?? '') : '';
    const traitB = 'trait' in b.data ? (b.data.trait ?? '') : '';
    const cmp = traitA.localeCompare(traitB);
    return cmp === 0 ? a.data.name.localeCompare(b.data.name) : cmp;
  },
};

function sortEquipmentItems(
  items: EquipmentItem[],
  sortBy: EquipmentSortKey,
  sortDir: 'asc' | 'desc'
) {
  const sorted = [...items].sort(EQUIPMENT_SORTERS[sortBy]);
  return sortDir === 'asc' ? sorted : sorted.reverse();
}

function groupEquipmentItems(items: EquipmentItem[]) {
  const groups: Record<string, EquipmentItem[]> = {
    primary: [],
    secondary: [],
    armor: [],
    wheelchair: [],
  };
  for (const item of items) {
    groups[item.type].push(item);
  }
  return groups;
}

function getCategoryLabel(category: string) {
  switch (category) {
    case 'primary':
      return 'Primary Weapons';
    case 'secondary':
      return 'Secondary Weapons';
    case 'armor':
      return 'Armor';
    default:
      return 'Combat Wheelchairs';
  }
}

function groupItemsByTier(items: EquipmentItem[]) {
  return items.reduce(
    (acc, item) => {
      const tier = item.data.tier;
      if (!acc[tier]) acc[tier] = [];
      acc[tier].push(item);
      return acc;
    },
    {} as Record<string, EquipmentItem[]>
  );
}

function getSortedTierEntries(groups: Record<string, EquipmentItem[]>) {
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

type EquipmentHeaderProps = {
  isMobile: boolean;
  filterState: ReturnType<typeof useFilterState>['filterState'];
  onSearchChange: ReturnType<typeof useFilterState>['onSearchChange'];
  onFilterChange: ReturnType<typeof useFilterState>['onFilterChange'];
  onClearFilters: ReturnType<typeof useFilterState>['onClearFilters'];
  filteredCount: number;
  totalCount: number;
  sortBy: EquipmentSortKey;
  sortDir: 'asc' | 'desc';
  onSortByChange: (value: EquipmentSortKey) => void;
  onSortDirChange: (value: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (value: 'grid' | 'table') => void;
};

function EquipmentHeader({
  isMobile,
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
}: EquipmentHeaderProps) {
  return (
    <div className="bg-background shrink-0 border-b p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
            <Swords className="mr-2 inline-block size-6" />
            Equipment Reference
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
              searchPlaceholder="Search equipment..."
            />
          )}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={e => onSortByChange(e.target.value as EquipmentSortKey)}
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

function EquipmentGridSections({
  groupedItems,
  onSelectItem,
}: {
  groupedItems: Record<string, EquipmentItem[]>;
  onSelectItem: (item: EquipmentItem) => void;
}) {
  return (
    <div className="space-y-8">
      {Object.entries(groupedItems).map(([category, items]) => {
        if (items.length === 0) return null;
        const categoryLabel = getCategoryLabel(category);
        const byTier = groupItemsByTier(items);
        return (
          <section key={category}>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              {categoryLabel}
              <Badge variant="outline">{items.length}</Badge>
            </h2>
            <div className="space-y-6">
              {getSortedTierEntries(byTier).map(([tier, tierItems]) => (
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
                        onClick={() => onSelectItem(item)}
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
  );
}

function EquipmentTableView({
  items,
  sortBy,
  sortDir,
  onSort,
  onSelectItem,
}: {
  items: EquipmentItem[];
  sortBy: EquipmentSortKey;
  sortDir: 'asc' | 'desc';
  onSort: (column: EquipmentSortKey) => void;
  onSelectItem: (item: EquipmentItem) => void;
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
            column="tier"
            label="Tier"
            currentSort={sortBy}
            direction={sortDir}
            onSort={onSort}
            className="hidden sm:table-cell"
          />
          <SortableTableHead
            column="type"
            label="Type"
            currentSort={sortBy}
            direction={sortDir}
            onSort={onSort}
            className="hidden md:table-cell"
          />
          <SortableTableHead
            column="trait"
            label="Trait/Stats"
            currentSort={sortBy}
            direction={sortDir}
            onSort={onSort}
          />
          <TableHead className="hidden lg:table-cell">Modifiers</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, idx) => (
          <EquipmentTableRow
            key={`${item.data.name}-${idx}`}
            item={item}
            onClick={() => onSelectItem(item)}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function EquipmentEmptyState({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <p>No equipment matches your filters.</p>
      <Button variant="link" onClick={onClearFilters} className="mt-2">
        Clear all filters
      </Button>
    </div>
  );
}

function EquipmentDetailSheet({
  selectedItem,
  onClose,
}: {
  selectedItem: EquipmentItem | null;
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

function EquipmentCompareDrawer() {
  return (
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
  );
}

type EquipmentLayoutProps = {
  isInitialLoading: boolean;
  isMobile: boolean;
  filterState: ReturnType<typeof useFilterState>['filterState'];
  onSearchChange: ReturnType<typeof useFilterState>['onSearchChange'];
  onFilterChange: ReturnType<typeof useFilterState>['onFilterChange'];
  onClearFilters: ReturnType<typeof useFilterState>['onClearFilters'];
  filteredItems: EquipmentItem[];
  totalCount: number;
  sortBy: EquipmentSortKey;
  sortDir: 'asc' | 'desc';
  onSortByChange: (value: EquipmentSortKey) => void;
  onSortDirChange: (value: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (value: 'grid' | 'table') => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  isFiltering: boolean;
  groupedItems: Record<string, EquipmentItem[]>;
  onSelectItem: (item: EquipmentItem) => void;
  selectedItem: EquipmentItem | null;
  onCloseItem: () => void;
  onSort: (column: EquipmentSortKey) => void;
};

function EquipmentLayout({
  isInitialLoading,
  isMobile,
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
}: EquipmentLayoutProps) {
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
          searchPlaceholder="Search equipment..."
        />
      )}

      <div className="flex min-h-0 flex-1 flex-col">
        <EquipmentHeader
          isMobile={isMobile}
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
              <EquipmentGridSections
                groupedItems={groupedItems}
                onSelectItem={onSelectItem}
              />
            ) : (
              <EquipmentTableView
                items={filteredItems}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
                onSelectItem={onSelectItem}
              />
            )}

            {filteredItems.length === 0 && (
              <EquipmentEmptyState onClearFilters={onClearFilters} />
            )}
          </div>
        </div>
      </div>

      <BackToTop scrollRef={scrollRef} />

      <EquipmentDetailSheet selectedItem={selectedItem} onClose={onCloseItem} />

      <EquipmentCompareDrawer />
    </div>
  );
}

function EquipmentReferencePage() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = React.useState<EquipmentSortKey>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedItem, setSelectedItem] = React.useState<EquipmentItem | null>(
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

  const { filterState, onSearchChange, onFilterChange, onClearFilters } =
    useFilterState(filterGroups);

  const filteredItems = React.useMemo(() => {
    if (!allItems) return [];
    const items = filterItems(
      allItems,
      filterState.search,
      filterState.filters
    );
    return sortEquipmentItems(items, sortBy, sortDir);
  }, [allItems, filterState, sortBy, sortDir]);

  // Use deferred rendering for smooth filtering on mobile
  const { deferredItems, isPending: isFiltering } =
    useDeferredItems(filteredItems);

  const groupedItems = React.useMemo(
    () => groupEquipmentItems(deferredItems),
    [deferredItems]
  );

  const handleSortClick = React.useCallback(
    (column: EquipmentSortKey) => {
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
    <EquipmentLayout
      isInitialLoading={isInitialLoading}
      isMobile={isMobile}
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

function EquipmentPageWrapper() {
  return (
    <CompareProvider maxItems={4}>
      <EquipmentReferencePage />
    </CompareProvider>
  );
}
