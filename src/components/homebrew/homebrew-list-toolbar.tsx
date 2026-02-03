/**
 * Homebrew List Toolbar Components
 *
 * Extracted filter, search, and view controls to reduce HomebrewList complexity.
 */
import { Beaker, Grid, List, Plus, Search, SortAsc } from 'lucide-react';

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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { HomebrewContentType } from '@/lib/schemas/homebrew';

import {
  type CategoryFilterConfig,
  CONTENT_TYPE_CONFIG,
  CONTENT_TYPES,
} from './homebrew-list-config';

// =====================================================================================
// Types
// =====================================================================================

export type SortOption = 'name' | 'created' | 'updated' | 'popular' | 'stars';
export type ViewMode = 'grid' | 'list';

export interface FilterState {
  tier: string;
  role: string;
  domain: string;
  level: string;
  equipmentCategory: string;
}

// =====================================================================================
// CategoryTabs - Category selection tabs
// =====================================================================================

interface CategoryTabsProps {
  activeCategory: HomebrewContentType;
  itemCounts: Record<HomebrewContentType, number>;
  onCategoryChange: (category: HomebrewContentType) => void;
}

export function CategoryTabs({
  activeCategory,
  itemCounts,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-1 pb-2">
        {CONTENT_TYPES.map(type => {
          const config = CONTENT_TYPE_CONFIG[type];
          const Icon = config.icon;
          const count = itemCounts[type] ?? 0;
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

// =====================================================================================
// FilterToolbar - Search and filter controls
// =====================================================================================

interface FilterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilters: CategoryFilterConfig;
  filterState: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
  searchPlaceholder: string;
}

export function FilterToolbar({
  search,
  onSearchChange,
  categoryFilters,
  filterState,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  searchPlaceholder,
}: FilterToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {/* Search */}
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>

      {/* Category-specific filters */}
      {'tierOptions' in categoryFilters && categoryFilters.tierOptions && (
        <Select
          value={filterState.tier}
          onValueChange={v => onFilterChange('tier', v)}
        >
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

      {'roleOptions' in categoryFilters && categoryFilters.roleOptions && (
        <Select
          value={filterState.role}
          onValueChange={v => onFilterChange('role', v)}
        >
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

      {'domainOptions' in categoryFilters && categoryFilters.domainOptions && (
        <Select
          value={filterState.domain}
          onValueChange={v => onFilterChange('domain', v)}
        >
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

      {'levelOptions' in categoryFilters && categoryFilters.levelOptions && (
        <Select
          value={filterState.level}
          onValueChange={v => onFilterChange('level', v)}
        >
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

      {'categoryOptions' in categoryFilters &&
        categoryFilters.categoryOptions && (
          <Select
            value={filterState.equipmentCategory}
            onValueChange={v => onFilterChange('equipmentCategory', v)}
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

      {/* Sort and View Mode */}
      <div className="flex items-center gap-2 sm:ml-auto">
        <Select
          value={sortBy}
          onValueChange={v => onSortChange(v as SortOption)}
        >
          <SelectTrigger className="w-40">
            <SortAsc className="mr-2 size-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Recently Updated</SelectItem>
            <SelectItem value="created">Recently Created</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="stars">Most Starred</SelectItem>
          </SelectContent>
        </Select>

        <Tabs
          value={viewMode}
          onValueChange={v => onViewModeChange(v as ViewMode)}
        >
          <TabsList className="h-9">
            <TabsTrigger value="grid" className="px-2">
              <Grid className="size-4" />
            </TabsTrigger>
            <TabsTrigger value="list" className="px-2">
              <List className="size-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

// =====================================================================================
// EmptyStateCard - Empty state display
// =====================================================================================

interface EmptyStateCardProps {
  hasItems: boolean;
  label: string;
  showCreateButton: boolean;
  onCreate?: () => void;
}

export function EmptyStateCard({
  hasItems,
  label,
  showCreateButton,
  onCreate,
}: EmptyStateCardProps) {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
      <div className="bg-muted flex size-16 items-center justify-center rounded-full">
        <Beaker className="text-muted-foreground size-8" />
      </div>
      <p className="text-muted-foreground">
        {!hasItems ? `No ${label} yet.` : 'No items match your filters.'}
      </p>
      {showCreateButton && onCreate && !hasItems && (
        <Button
          onClick={onCreate}
          size="sm"
          className="gap-1.5"
          variant="outline"
        >
          <Plus className="size-4" />
          Create your first {label}
        </Button>
      )}
    </div>
  );
}
