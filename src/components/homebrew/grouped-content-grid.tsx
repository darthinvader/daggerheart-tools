/**
 * Grouped Content Grid
 *
 * A flexible grid layout that supports different grouping strategies:
 * - Alphabetical (A-Z) for items
 * - Tier-based for adversaries, environments, equipment
 * - Domain-based for domain cards
 * - Category-based for equipment
 *
 * Features:
 * - Quick navigation bar for groups
 * - Smooth scroll to group sections
 * - "Show All" toggle for large lists
 */
import { Eye, EyeOff } from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  INITIAL_LIMIT,
  useGroupedContentState,
} from './use-grouped-content-state';

// =====================================================================================
// Types
// =====================================================================================

export type GroupingStrategy =
  | 'alphabetical'
  | 'tier'
  | 'domain'
  | 'category'
  | 'level'
  | 'role';

export interface GroupConfig {
  /** Unique key for this group */
  key: string;
  /** Display label for the group */
  label: string;
  /** Optional color class for the group badge */
  colorClass?: string;
  /** Optional icon component */
  icon?: React.ReactNode;
  /** Sort order (lower = first) */
  order: number;
}

interface GroupedContentGridProps<T> {
  /** All items to display */
  items: T[];
  /** Function to get a unique key for an item */
  getKey: (item: T) => string;
  /** Function to determine which group an item belongs to */
  getGroupKey: (item: T) => string;
  /** Function to get the name of an item for sorting within groups */
  getName: (item: T) => string;
  /** Configuration for all possible groups */
  groupConfigs: GroupConfig[];
  /** Render function for each item */
  renderItem: (item: T) => React.ReactNode;
  /** Optional className for the container */
  className?: string;
  /** Number of grid columns */
  columns?: {
    default: number;
    sm?: number;
    lg?: number;
  };
  /** Title for the grouping (e.g., "Tier", "Domain") */
  groupingTitle?: string;
}

// =====================================================================================
// Group Navigation Component
// =====================================================================================

interface GroupNavProps {
  groups: GroupConfig[];
  availableGroups: Set<string>;
  activeGroup?: string;
  onGroupClick: (groupKey: string) => void;
}

function GroupNav({
  groups,
  availableGroups,
  activeGroup,
  onGroupClick,
}: GroupNavProps) {
  // Sort groups by their order
  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => a.order - b.order),
    [groups]
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {sortedGroups.map(group => {
        const isAvailable = availableGroups.has(group.key);
        const isActive = activeGroup === group.key;

        return (
          <Button
            key={group.key}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            disabled={!isAvailable}
            onClick={() => onGroupClick(group.key)}
            className={cn(
              'h-8 min-w-[2.5rem] text-sm font-medium transition-all',
              isActive && 'shadow-sm',
              !isAvailable && 'opacity-40',
              group.colorClass && !isActive && group.colorClass
            )}
          >
            {group.icon && <span className="mr-1">{group.icon}</span>}
            {group.label}
          </Button>
        );
      })}
    </div>
  );
}

// =====================================================================================
// Collapsed View Component
// =====================================================================================

interface CollapsedViewProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  gridCols: string;
  columnsStyle: string;
  totalCount: number;
  needsShowAll: boolean;
  groupingTitle: string;
  onShowAll: () => void;
}

function CollapsedView<T>({
  items,
  getKey,
  renderItem,
  gridCols,
  columnsStyle,
  totalCount,
  needsShowAll,
  groupingTitle,
  onShowAll,
}: CollapsedViewProps<T>) {
  return (
    <>
      <div
        className={cn('grid gap-2', gridCols)}
        style={{ gridTemplateColumns: columnsStyle }}
      >
        {items.map(item => (
          <div key={getKey(item)}>{renderItem(item)}</div>
        ))}
      </div>

      {needsShowAll && (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-muted-foreground text-sm">
            Showing {Math.min(INITIAL_LIMIT, totalCount)} of {totalCount} items
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onShowAll}
            className="gap-2"
          >
            <Eye className="size-4" />
            Show All {totalCount} Items (Grouped by {groupingTitle})
          </Button>
        </div>
      )}
    </>
  );
}

// =====================================================================================
// Expanded View Component
// =====================================================================================

interface ExpandedViewProps<T> {
  orderedGroups: GroupConfig[];
  groupedItems: Map<string, T[]>;
  groupConfigs: GroupConfig[];
  availableGroups: Set<string>;
  activeGroup?: string;
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  setGroupRef: (groupKey: string) => (el: HTMLDivElement | null) => void;
  scrollToGroup: (groupKey: string) => void;
  gridCols: string;
  columnsStyle: string;
  totalCount: number;
  groupingTitle: string;
  onCollapse: () => void;
}

function ExpandedView<T>({
  orderedGroups,
  groupedItems,
  groupConfigs,
  availableGroups,
  activeGroup,
  getKey,
  renderItem,
  setGroupRef,
  scrollToGroup,
  gridCols,
  columnsStyle,
  totalCount,
  groupingTitle,
  onCollapse,
}: ExpandedViewProps<T>) {
  return (
    <>
      {/* Group Navigation */}
      <div className="bg-background/95 sticky top-0 z-10 py-2 backdrop-blur">
        <GroupNav
          groups={groupConfigs}
          availableGroups={availableGroups}
          activeGroup={activeGroup}
          onGroupClick={scrollToGroup}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {totalCount} items • Grouped by {groupingTitle}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCollapse}
            className="gap-2"
          >
            <EyeOff className="size-4" />
            Collapse
          </Button>
        </div>
      </div>

      {/* Grouped Content */}
      <div className="space-y-6">
        {orderedGroups.map(group => {
          const groupItems = groupedItems.get(group.key) ?? [];
          if (groupItems.length === 0) return null;

          return (
            <div
              key={group.key}
              ref={setGroupRef(group.key)}
              data-group={group.key}
              className="scroll-mt-32"
            >
              {/* Group Header */}
              <div
                className={cn(
                  'mb-3 flex items-center gap-2 rounded-lg border px-3 py-2',
                  group.colorClass ? group.colorClass : 'bg-muted/50'
                )}
              >
                {group.icon && <span className="size-5">{group.icon}</span>}
                <span className="text-lg font-bold">{group.label}</span>
                <Badge variant="secondary">{groupItems.length}</Badge>
              </div>

              {/* Items Grid */}
              <div
                className={cn('grid gap-2', gridCols)}
                style={{ gridTemplateColumns: columnsStyle }}
              >
                {groupItems.map(item => (
                  <div key={getKey(item)}>{renderItem(item)}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// =====================================================================================
// Main Component
// =====================================================================================

export function GroupedContentGrid<T>({
  items,
  getKey,
  getGroupKey,
  getName,
  groupConfigs,
  renderItem,
  className,
  columns = { default: 1, sm: 2, lg: 3 },
  groupingTitle = 'Group',
}: GroupedContentGridProps<T>) {
  // Use extracted hook for all grouping and scroll state
  const {
    showAll,
    setShowAll,
    activeGroup,
    containerRef,
    groupedItems,
    availableGroups,
    orderedGroups,
    flattenedItems,
    totalCount,
    needsShowAll,
    scrollToGroup,
    setGroupRef,
  } = useGroupedContentState({ items, getGroupKey, getName, groupConfigs });

  // Build column classes and style
  const { gridCols, columnsStyle } = useMemo(() => {
    const gridColsStr = cn(
      `grid-cols-${columns.default}`,
      columns.sm && `sm:grid-cols-${columns.sm}`,
      columns.lg && `lg:grid-cols-${columns.lg}`
    );
    const colsStyle = `repeat(${columns.lg ?? columns.sm ?? columns.default}, minmax(0, 1fr))`;
    return { gridCols: gridColsStr, columnsStyle: colsStyle };
  }, [columns]);

  if (items.length === 0) {
    return null;
  }

  // If not showing all, just show first N items without grouping
  if (!showAll) {
    const itemsToShow = flattenedItems.slice(0, INITIAL_LIMIT);

    return (
      <div className={cn('space-y-4', className)} ref={containerRef}>
        <CollapsedView
          items={itemsToShow}
          getKey={getKey}
          renderItem={renderItem}
          gridCols={gridCols}
          columnsStyle={columnsStyle}
          totalCount={totalCount}
          needsShowAll={needsShowAll}
          groupingTitle={groupingTitle}
          onShowAll={() => setShowAll(true)}
        />
      </div>
    );
  }

  // Show all with grouping
  return (
    <div className={cn('space-y-4', className)} ref={containerRef}>
      <ExpandedView
        orderedGroups={orderedGroups}
        groupedItems={groupedItems}
        groupConfigs={groupConfigs}
        availableGroups={availableGroups}
        activeGroup={activeGroup}
        getKey={getKey}
        renderItem={renderItem}
        setGroupRef={setGroupRef}
        scrollToGroup={scrollToGroup}
        gridCols={gridCols}
        columnsStyle={columnsStyle}
        totalCount={totalCount}
        groupingTitle={groupingTitle}
        onCollapse={() => setShowAll(false)}
      />
    </div>
  );
}

// =====================================================================================
// Pre-configured Group Configs
// =====================================================================================

/** Tier grouping for adversaries, environments, equipment */
export const TIER_GROUP_CONFIGS: GroupConfig[] = [
  {
    key: '1',
    label: 'Tier 1',
    colorClass:
      'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    order: 1,
  },
  {
    key: '2',
    label: 'Tier 2',
    colorClass:
      'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
    order: 2,
  },
  {
    key: '3',
    label: 'Tier 3',
    colorClass:
      'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
    order: 3,
  },
  {
    key: '4',
    label: 'Tier 4',
    colorClass:
      'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
    order: 4,
  },
];

/** Domain grouping for domain cards */
export const DOMAIN_GROUP_CONFIGS: GroupConfig[] = [
  {
    key: 'Arcana',
    label: 'Arcana',
    colorClass:
      'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30',
    order: 1,
  },
  {
    key: 'Blade',
    label: 'Blade',
    colorClass:
      'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
    order: 2,
  },
  {
    key: 'Bone',
    label: 'Bone',
    colorClass:
      'bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30',
    order: 3,
  },
  {
    key: 'Codex',
    label: 'Codex',
    colorClass:
      'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
    order: 4,
  },
  {
    key: 'Grace',
    label: 'Grace',
    colorClass:
      'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30',
    order: 5,
  },
  {
    key: 'Midnight',
    label: 'Midnight',
    colorClass:
      'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
    order: 6,
  },
  {
    key: 'Sage',
    label: 'Sage',
    colorClass:
      'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    order: 7,
  },
  {
    key: 'Splendor',
    label: 'Splendor',
    colorClass:
      'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
    order: 8,
  },
  {
    key: 'Valor',
    label: 'Valor',
    colorClass:
      'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
    order: 9,
  },
];

/** Equipment category grouping */
export const EQUIPMENT_CATEGORY_CONFIGS: GroupConfig[] = [
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

/** Adversary role grouping */
export const ROLE_GROUP_CONFIGS: GroupConfig[] = [
  {
    key: 'Solo',
    label: 'Solo',
    colorClass:
      'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
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

/** Level grouping for domain cards (1-10) */
export const LEVEL_GROUP_CONFIGS: GroupConfig[] = Array.from(
  { length: 10 },
  (_, i) => ({
    key: String(i + 1),
    label: `Level ${i + 1}`,
    colorClass: [
      'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      'bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/30',
      'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30',
      'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
      'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
      'bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30',
      'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
      'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
      'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30',
      'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
    ][i],
    order: i + 1,
  })
);
