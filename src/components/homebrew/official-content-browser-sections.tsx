/**
 * Official Content Browser Section Components
 *
 * Extracted section components for OfficialContentBrowser to reduce complexity.
 */
import { Search } from 'lucide-react';

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

import type {
  OfficialContentType,
  OfficialItem,
} from './use-official-content-filter';

// ─────────────────────────────────────────────────────────────────────────────
// Type Configs
// ─────────────────────────────────────────────────────────────────────────────

export interface TypeConfig {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  label: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Category Tabs
// ─────────────────────────────────────────────────────────────────────────────

interface CategoryTabsProps {
  categoryOrder: OfficialContentType[];
  allContent: OfficialItem[];
  activeCategory: OfficialContentType;
  typeConfig: Record<OfficialContentType, TypeConfig>;
  onCategoryChange: (category: OfficialContentType) => void;
}

export function CategoryTabsSection({
  categoryOrder,
  allContent,
  activeCategory,
  typeConfig,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-1 pb-2">
        {categoryOrder.map(type => {
          const config = typeConfig[type];
          const Icon = config.icon;
          const count = allContent.filter(i => i.type === type).length;
          const isActive = activeCategory === type;

          return (
            <Button
              key={type}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(type)}
              className={`flex shrink-0 items-center gap-1.5 transition-all ${
                isActive ? 'shadow-sm' : config.bgColor
              }`}
            >
              <Icon className={`size-4 ${isActive ? '' : config.color}`} />
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

// ─────────────────────────────────────────────────────────────────────────────
// Filter Bar
// ─────────────────────────────────────────────────────────────────────────────

interface CategoryFilters {
  tierOptions?: string[];
  roleOptions?: string[];
  domainOptions?: string[];
  levelOptions?: string[];
  categoryOptions?: string[];
}

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  categoryFilters: CategoryFilters;
  tierFilter: string;
  onTierChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  domainFilter: string;
  onDomainChange: (value: string) => void;
  levelFilter: string;
  onLevelChange: (value: string) => void;
  equipmentCategoryFilter: string;
  onEquipmentCategoryChange: (value: string) => void;
}

export function FilterBarSection({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  categoryFilters,
  tierFilter,
  onTierChange,
  roleFilter,
  onRoleChange,
  domainFilter,
  onDomainChange,
  levelFilter,
  onLevelChange,
  equipmentCategoryFilter,
  onEquipmentCategoryChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {categoryFilters.tierOptions && (
        <Select value={tierFilter} onValueChange={onTierChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            {categoryFilters.tierOptions.map(t => (
              <SelectItem key={t} value={t}>
                {t === 'all' ? 'All Tiers' : `Tier ${t}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {categoryFilters.roleOptions && (
        <Select value={roleFilter} onValueChange={onRoleChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {categoryFilters.roleOptions.map(r => (
              <SelectItem key={r} value={r}>
                {r === 'all' ? 'All Roles' : r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {categoryFilters.domainOptions && (
        <Select value={domainFilter} onValueChange={onDomainChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Domain" />
          </SelectTrigger>
          <SelectContent>
            {categoryFilters.domainOptions.map(d => (
              <SelectItem key={d} value={d}>
                {d === 'all' ? 'All Domains' : d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {categoryFilters.levelOptions && (
        <Select value={levelFilter} onValueChange={onLevelChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {categoryFilters.levelOptions.map(l => (
              <SelectItem key={l} value={l}>
                {l === 'all' ? 'All Levels' : `Level ${l}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {categoryFilters.categoryOptions && (
        <Select
          value={equipmentCategoryFilter}
          onValueChange={onEquipmentCategoryChange}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {categoryFilters.categoryOptions.map(c => (
              <SelectItem key={c} value={c}>
                {c === 'all'
                  ? 'All Types'
                  : c === 'Primary Weapon'
                    ? 'Primary'
                    : c === 'Secondary Weapon'
                      ? 'Secondary'
                      : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Results Count
// ─────────────────────────────────────────────────────────────────────────────

interface ResultsCountProps {
  Icon: React.ElementType;
  iconColor: string;
  count: number;
  label: string;
  hasActiveFilters: boolean;
}

export function ResultsCountSection({
  Icon,
  iconColor,
  count,
  label,
  hasActiveFilters,
}: ResultsCountProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`size-4 ${iconColor}`} />
      <span className="text-muted-foreground text-sm">
        {count} {label}
        {hasActiveFilters ? ' matching filters' : ''}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  label: string;
}

export function ContentEmptyState({ label }: EmptyStateProps) {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
      <div className="bg-muted flex size-16 items-center justify-center rounded-full">
        <Search className="text-muted-foreground size-8" />
      </div>
      <p className="text-muted-foreground">No {label} match your filters.</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Grouped Content Grid
// ─────────────────────────────────────────────────────────────────────────────

interface GroupInfo {
  key: string;
  label: string;
  colorClass: string;
}

interface GroupedContentGridProps {
  orderedGroups: GroupInfo[];
  groupedItems: Map<string, OfficialItem[]>;
  config: TypeConfig;
  onViewItem: (item: OfficialItem) => void;
  onForkItem: (item: OfficialItem) => void;
  renderCard: (
    item: OfficialItem,
    config: TypeConfig,
    onView: () => void,
    onFork: () => void
  ) => React.ReactNode;
}

export function GroupedContentGrid({
  orderedGroups,
  groupedItems,
  config,
  onViewItem,
  onForkItem,
  renderCard,
}: GroupedContentGridProps) {
  return (
    <div className="space-y-6">
      {orderedGroups.map(group => {
        const groupItemList = groupedItems.get(group.key) ?? [];
        if (groupItemList.length === 0) return null;

        return (
          <div key={group.key} className="scroll-mt-24">
            {/* Group Header */}
            <div
              className={`mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 ${group.colorClass}`}
            >
              <span className="text-lg font-bold">{group.label}</span>
              <Badge variant="secondary">{groupItemList.length}</Badge>
            </div>

            {/* Items Grid */}
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              }}
            >
              {groupItemList.map(item =>
                renderCard(
                  item,
                  config,
                  () => onViewItem(item),
                  () => onForkItem(item)
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
