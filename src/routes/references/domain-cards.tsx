// Domain cards reference page with page-specific detail components

import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Search,
  X,
} from 'lucide-react';
import * as React from 'react';
import { useMemo } from 'react';

import { CardCostBadges } from '@/components/loadout-selector/card-cost-badges';
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
  TableHead,
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
import { ALL_DOMAIN_NAMES, getAllDomainCards } from '@/lib/data/domains';
import { AlertTriangle, Sparkle, Sparkles, Zap } from '@/lib/icons';
import type { DomainCard } from '@/lib/schemas/domains';
import { getCardCosts } from '@/lib/utils/card-costs';
import { useCategoryExpandState } from './-use-category-expand-state';

export const Route = createFileRoute('/references/domain-cards')({
  component: DomainCardsPageWrapper,
});

// Domain-specific colors
const domainColors: Record<
  string,
  { gradient: string; bg: string; text: string; border: string }
> = {
  Arcana: {
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
    text: 'text-violet-700 dark:text-violet-400',
    border: 'border-violet-500/30',
  },
  Blade: {
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-500/10',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-500/30',
  },
  Bone: {
    gradient: 'from-stone-500 to-slate-600',
    bg: 'bg-stone-500/10',
    text: 'text-stone-700 dark:text-stone-400',
    border: 'border-stone-500/30',
  },
  Codex: {
    gradient: 'from-amber-500 to-yellow-600',
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/30',
  },
  Grace: {
    gradient: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-500/10',
    text: 'text-pink-700 dark:text-pink-400',
    border: 'border-pink-500/30',
  },
  Midnight: {
    gradient: 'from-indigo-600 to-purple-800',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-700 dark:text-indigo-400',
    border: 'border-indigo-500/30',
  },
  Sage: {
    gradient: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-500/30',
  },
  Splendor: {
    gradient: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-500/30',
  },
  Valor: {
    gradient: 'from-orange-500 to-red-600',
    bg: 'bg-orange-500/10',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-500/30',
  },
};

const defaultDomainColor = {
  gradient: 'from-gray-500 to-slate-600',
  bg: 'bg-gray-500/10',
  text: 'text-gray-700 dark:text-gray-400',
  border: 'border-gray-500/30',
};

// Card type colors
const cardTypeColors: Record<string, string> = {
  Spell: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
  Ability:
    'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
  Grimoire:
    'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
};

// Level colors
const levelColors: Record<number, string> = {
  1: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  2: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  3: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  4: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  5: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
  6: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
  7: 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
  8: 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
  9: 'bg-red-500/20 text-red-700 dark:text-red-400',
  10: 'bg-red-500/20 text-red-700 dark:text-red-400',
};

// Build filter groups from data
function buildFilterGroups(cards: DomainCard[]): FilterGroup[] {
  const domainCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  const levelCounts: Record<string, number> = {};

  for (const card of cards) {
    domainCounts[card.domain] = (domainCounts[card.domain] ?? 0) + 1;
    typeCounts[card.type] = (typeCounts[card.type] ?? 0) + 1;
    levelCounts[String(card.level)] =
      (levelCounts[String(card.level)] ?? 0) + 1;
  }

  return [
    {
      id: 'domain',
      label: 'Domain',
      defaultOpen: true,
      options: ALL_DOMAIN_NAMES.filter(d => domainCounts[d] > 0).map(d => ({
        value: d,
        label: d,
        count: domainCounts[d],
      })),
    },
    {
      id: 'type',
      label: 'Card Type',
      defaultOpen: true,
      options: Object.entries(typeCounts).map(([type, count]) => ({
        value: type,
        label: type,
        count,
      })),
    },
    {
      id: 'level',
      label: 'Level',
      defaultOpen: false,
      options: Object.entries(levelCounts)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([level, count]) => ({
          value: level,
          label: `Level ${level}`,
          count,
        })),
    },
  ];
}

function filterCards(
  cards: DomainCard[],
  search: string,
  filters: Record<string, Set<string>>
): DomainCard[] {
  return cards.filter(card => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !card.name.toLowerCase().includes(searchLower) &&
        !card.description.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    if (filters.domain?.size > 0 && !filters.domain.has(card.domain)) {
      return false;
    }

    if (filters.type?.size > 0 && !filters.type.has(card.type)) {
      return false;
    }

    if (filters.level?.size > 0 && !filters.level.has(String(card.level))) {
      return false;
    }

    return true;
  });
}
// Helper to get unique card ID for comparison
function getCardId(card: DomainCard): string {
  return `${card.domain}-${card.name}`;
}

// Memoized card component for performance
const DomainCardCard = React.memo(function DomainCardCard({
  card,
  onClick,
}: {
  card: DomainCard;
  onClick: () => void;
}) {
  const { isInCompare } = useCompare();
  const domainColor = domainColors[card.domain] ?? defaultDomainColor;
  const costs = useMemo(() => getCardCosts(card), [card]);
  const cardId = getCardId(card);
  const inCompare = isInCompare(cardId);

  return (
    <Card
      className={`reference-card card-grid-item h-full cursor-pointer border-l-4 transition-all hover:shadow-lg ${domainColor.border} overflow-hidden ${inCompare ? 'ring-primary ring-2' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className="line-clamp-2 text-base leading-tight"
            title={card.name}
          >
            {card.name}
          </CardTitle>
          <CompareToggleButton
            item={{ id: cardId, name: card.name, data: card }}
            size="sm"
          />
        </div>
        {/* All badges on one line */}
        <div className="mt-2 flex flex-wrap items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                className={`cursor-help py-0 text-xs ${levelColors[card.level] ?? 'bg-gray-500/20'}`}
              >
                Lvl {card.level}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Card level requirement</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={`cursor-help py-0 text-xs ${cardTypeColors[card.type]}`}
              >
                {card.type}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Card type: {card.type}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={`cursor-help py-0 text-xs ${domainColor.bg} ${domainColor.text} ${domainColor.border}`}
              >
                {card.domain}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Domain: {card.domain}</TooltipContent>
          </Tooltip>
        </div>
        {/* Costs row with separator */}
        <div className="border-muted mt-2 border-t pt-2">
          <CardCostBadges costs={costs} compact />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {card.description}
        </p>
      </CardContent>
    </Card>
  );
});

// Memoized table row component for performance
const DomainCardTableRow = React.memo(function DomainCardTableRow({
  card,
  onClick,
}: {
  card: DomainCard;
  onClick: () => void;
}) {
  const { isInCompare } = useCompare();
  const domainColor = domainColors[card.domain] ?? defaultDomainColor;
  const costs = useMemo(() => getCardCosts(card), [card]);
  const cardId = getCardId(card);
  const inCompare = isInCompare(cardId);

  return (
    <TableRow
      className={`reference-card hover:bg-muted/50 cursor-pointer ${inCompare ? 'bg-primary/10' : ''}`}
      onClick={onClick}
    >
      <TableCell className="max-w-48 truncate font-medium">
        <div className="flex items-center gap-2">
          <CompareToggleButton
            item={{ id: cardId, name: card.name, data: card }}
            size="sm"
          />
          {card.name}
        </div>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className={`cursor-help ${domainColor.bg} ${domainColor.text} ${domainColor.border}`}
            >
              {card.domain}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Domain: {card.domain}</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className={`cursor-help ${cardTypeColors[card.type]}`}
            >
              {card.type}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Card type: {card.type}</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              className={`cursor-help ${levelColors[card.level] ?? 'bg-gray-500/20'}`}
            >
              {card.level}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Level {card.level} requirement</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        <CardCostBadges costs={costs} compact />
      </TableCell>
    </TableRow>
  );
});

function CardDetail({ card }: { card: DomainCard }) {
  const domainColor = domainColors[card.domain] ?? defaultDomainColor;
  const costs = useMemo(() => getCardCosts(card), [card]);
  const hasActivationCosts = costs.activationCosts.length > 0;
  const hopeCosts = costs.activationCosts.filter(c => c.type === 'Hope');
  const stressCosts = costs.activationCosts.filter(c => c.type === 'Stress');

  return (
    <div className="space-y-4">
      {/* Gradient header with title and badges */}
      <div
        className={`-mx-4 -mt-4 bg-gradient-to-r p-6 ${domainColor.gradient}`}
      >
        <div className="rounded-xl bg-black/30 p-4">
          <h2 className="text-xl font-bold text-white drop-shadow">
            {card.name}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="cursor-help border-slate-900/40 bg-slate-900/80 text-white">
                  Level {card.level}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Character level requirement to use this card
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="cursor-help border-slate-900/40 bg-slate-900/80 text-white">
                  {card.type}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Card type: {card.type}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="cursor-help border-slate-900/40 bg-slate-900/80 text-white">
                  {card.domain}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Domain: {card.domain}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Costs section with better styling */}
      <div className="bg-card rounded-lg border p-3">
        <h4 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          Costs
        </h4>
        <div className="flex flex-wrap gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="min-w-24 flex-1 cursor-help rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 transition-colors hover:bg-rose-500/20">
                <div className="text-muted-foreground text-xs">Recall Cost</div>
                <div className="text-lg font-bold text-rose-700 dark:text-rose-400">
                  <Zap className="mr-1 inline-block size-4" />
                  {costs.recallCost === 0 ? 'Free' : costs.recallCost}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Stress cost to recall this card from your loadout
            </TooltipContent>
          </Tooltip>
          {hopeCosts.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="min-w-24 flex-1 cursor-help rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 transition-colors hover:bg-amber-500/20">
                  <div className="text-muted-foreground text-xs">
                    Activation (Hope)
                  </div>
                  <div className="text-lg font-bold text-amber-700 dark:text-amber-400">
                    <Sparkle className="mr-1 inline-block size-4" />
                    {hopeCosts
                      .map(c => (c.amount === 'any' ? 'X' : c.amount))
                      .join(' + ')}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Hope cost to activate this card's effect
              </TooltipContent>
            </Tooltip>
          )}
          {stressCosts.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="min-w-24 flex-1 cursor-help rounded-lg border border-purple-500/30 bg-purple-500/10 p-3 transition-colors hover:bg-purple-500/20">
                  <div className="text-muted-foreground text-xs">
                    Activation (Stress)
                  </div>
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                    <AlertTriangle className="mr-1 inline-block size-4" />
                    {stressCosts.reduce(
                      (sum, c) => sum + (c.amount === 'any' ? 0 : c.amount),
                      0
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Stress cost to activate this card's effect
              </TooltipContent>
            </Tooltip>
          )}
          {costs.recallCost === 0 && !hasActivationCosts && (
            <div className="min-w-24 flex-1 rounded-lg border border-dashed p-3">
              <div className="text-muted-foreground text-xs">Activation</div>
              <div className="text-muted-foreground text-lg font-bold">
                Free
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description section */}
      <div className="bg-card rounded-lg border p-3">
        <h4 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          Description
        </h4>
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {card.description}
        </p>
      </div>
    </div>
  );
}

type DomainCardSortKey = 'name' | 'domain' | 'level' | 'type';

// Stable loader function for useDeferredLoad
const loadAllCards = () => getAllDomainCards();

const DOMAIN_CARD_SORTERS: Record<
  DomainCardSortKey,
  (a: DomainCard, b: DomainCard) => number
> = {
  name: (a, b) => a.name.localeCompare(b.name),
  domain: (a, b) => {
    const cmp = a.domain.localeCompare(b.domain);
    return cmp === 0 ? a.name.localeCompare(b.name) : cmp;
  },
  level: (a, b) => {
    const cmp = a.level - b.level;
    return cmp === 0 ? a.name.localeCompare(b.name) : cmp;
  },
  type: (a, b) => {
    const cmp = a.type.localeCompare(b.type);
    return cmp === 0 ? a.name.localeCompare(b.name) : cmp;
  },
};

function sortDomainCards(
  cards: DomainCard[],
  sortBy: DomainCardSortKey,
  sortDir: 'asc' | 'desc'
) {
  const comparator = DOMAIN_CARD_SORTERS[sortBy];
  const sorted = [...cards].sort(comparator);
  return sortDir === 'asc' ? sorted : sorted.reverse();
}

function groupDomainCards(cards: DomainCard[]) {
  const groups: Record<string, DomainCard[]> = {};
  for (const card of cards) {
    if (!groups[card.domain]) groups[card.domain] = [];
    groups[card.domain].push(card);
  }
  for (const domain of Object.keys(groups)) {
    groups[domain].sort((a, b) => a.level - b.level);
  }
  return groups;
}

function getSortedDomainEntries(groups: Record<string, DomainCard[]>) {
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

type DomainCardsHeaderProps = {
  isMobile: boolean;
  filterGroups: FilterGroup[];
  filterState: ReturnType<typeof useFilterState>['filterState'];
  onSearchChange: ReturnType<typeof useFilterState>['onSearchChange'];
  onFilterChange: ReturnType<typeof useFilterState>['onFilterChange'];
  onClearFilters: ReturnType<typeof useFilterState>['onClearFilters'];
  filteredCount: number;
  totalCount: number;
};

function DomainCardsHeader({
  isMobile,
  filterGroups,
  filterState,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  filteredCount,
  totalCount,
}: DomainCardsHeaderProps) {
  return (
    <div className="bg-background shrink-0 border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="size-4 text-violet-500" />
            <span className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
              Domain Cards
            </span>
          </div>
          <ResultsCounter
            filtered={filteredCount}
            total={totalCount}
            label="cards"
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
            searchPlaceholder="Search domain cards..."
          />
        )}
      </div>
    </div>
  );
}

function DomainCardsToolbar({
  filterState,
  onSearchChange,
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirChange,
  viewMode,
  onViewModeChange,
  isMobile,
  expandAll,
  collapseAll,
  allExpanded,
  allCollapsed,
}: {
  filterState: ReturnType<typeof useFilterState>['filterState'];
  onSearchChange: (search: string) => void;
  sortBy: DomainCardSortKey;
  sortDir: 'asc' | 'desc';
  onSortByChange: (value: DomainCardSortKey) => void;
  onSortDirChange: (value: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (value: 'grid' | 'table') => void;
  isMobile: boolean;
  expandAll: () => void;
  collapseAll: () => void;
  allExpanded: boolean;
  allCollapsed: boolean;
}) {
  const SortDirIcon = sortDir === 'asc' ? ArrowUp : ArrowDown;

  return (
    <div className="bg-muted/30 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
      {/* Left side: Search */}
      {!isMobile && (
        <div className="relative max-w-xs min-w-[200px] flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search domain cards..."
            value={filterState.search}
            onChange={e => onSearchChange(e.target.value)}
            className="bg-background h-9 w-full rounded-md border pr-8 pl-9 text-sm transition-colors outline-none focus:ring-2 focus:ring-violet-500/30"
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
                  onSortByChange(e.target.value as DomainCardSortKey)
                }
                className="bg-background h-8 cursor-pointer rounded-md border px-2 text-sm"
              >
                <option value="name">Name</option>
                <option value="domain">Domain</option>
                <option value="type">Type</option>
                <option value="level">Level</option>
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
                onClick={() =>
                  onSortDirChange(sortDir === 'asc' ? 'desc' : 'asc')
                }
              >
                <SortDirIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {sortDir === 'asc' ? 'Ascending' : 'Descending'}
            </TooltipContent>
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
              onValueChange={v => v && onViewModeChange(v as 'grid' | 'table')}
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
            <TooltipContent>Expand all domains</TooltipContent>
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
            <TooltipContent>Collapse all domains</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function DomainGridSection({
  domain,
  cards,
  isExpanded,
  onToggle,
  onSelectCard,
}: {
  domain: string;
  cards: DomainCard[];
  isExpanded: boolean;
  onToggle: () => void;
  onSelectCard: (card: DomainCard) => void;
}) {
  const domainColor = domainColors[domain] ?? defaultDomainColor;
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button className="hover:bg-muted/50 bg-card flex w-full items-center justify-between rounded-lg border p-3 transition-colors">
          <div className="flex items-center gap-3">
            <span
              className={`inline-block h-3 w-3 rounded-full bg-gradient-to-r ${domainColor.gradient}`}
            />
            <h2 className="text-lg font-semibold">{domain}</h2>
            <Badge variant="secondary">{cards.length}</Badge>
          </div>
          <ChevronIcon className="text-muted-foreground size-5" />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map(card => (
            <DomainCardCard
              key={`${card.domain}-${card.name}`}
              card={card}
              onClick={() => onSelectCard(card)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const DomainCardsGridSections = React.memo(function DomainCardsGridSections({
  domainEntries,
  onSelectCard,
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
  domainEntries: Array<[string, DomainCard[]]>;
  onSelectCard: (card: DomainCard) => void;
  filterState: ReturnType<typeof useFilterState>['filterState'];
  onSearchChange: (search: string) => void;
  sortBy: DomainCardSortKey;
  sortDir: 'asc' | 'desc';
  onSortByChange: (value: DomainCardSortKey) => void;
  onSortDirChange: (value: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (value: 'grid' | 'table') => void;
  isMobile: boolean;
}) {
  // Use extracted hook for expand/collapse state (same as EquipmentGridSections)
  const {
    toggleCategory: toggleDomain,
    expandAll,
    collapseAll,
    allExpanded,
    allCollapsed,
    isCategoryExpanded,
  } = useCategoryExpandState(domainEntries.map(([domain]) => domain));

  return (
    <div className="space-y-4">
      <DomainCardsToolbar
        filterState={filterState}
        onSearchChange={onSearchChange}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortByChange={onSortByChange}
        onSortDirChange={onSortDirChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        isMobile={isMobile}
        expandAll={expandAll}
        collapseAll={collapseAll}
        allExpanded={allExpanded}
        allCollapsed={allCollapsed}
      />

      {domainEntries.map(([domain, cards]) => (
        <DomainGridSection
          key={domain}
          domain={domain}
          cards={cards}
          isExpanded={isCategoryExpanded(domain)}
          onToggle={() => toggleDomain(domain)}
          onSelectCard={onSelectCard}
        />
      ))}
    </div>
  );
});

const DomainCardsTableView = React.memo(function DomainCardsTableView({
  cards,
  sortBy,
  sortDir,
  onSort,
  onSelectCard,
}: {
  cards: DomainCard[];
  sortBy: DomainCardSortKey;
  sortDir: 'asc' | 'desc';
  onSort: (column: DomainCardSortKey) => void;
  onSelectCard: (card: DomainCard) => void;
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
            column="domain"
            label="Domain"
            currentSort={sortBy}
            direction={sortDir}
            onSort={onSort}
          />
          <SortableTableHead
            column="type"
            label="Type"
            currentSort={sortBy}
            direction={sortDir}
            onSort={onSort}
          />
          <SortableTableHead
            column="level"
            label="Level"
            currentSort={sortBy}
            direction={sortDir}
            onSort={onSort}
          />
          <TableHead>Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cards.map(card => (
          <DomainCardTableRow
            key={`${card.domain}-${card.name}`}
            card={card}
            onClick={() => onSelectCard(card)}
          />
        ))}
      </TableBody>
    </Table>
  );
});

function DomainCardDetailSheet({
  selectedCard,
  onClose,
  filteredCards,
  onNavigate,
}: {
  selectedCard: DomainCard | null;
  onClose: () => void;
  filteredCards: DomainCard[];
  onNavigate: (card: DomainCard) => void;
}) {
  // Defer rendering heavy content until sheet animation completes
  const shouldRenderContent = useDeferredSheetContent(selectedCard !== null);

  const currentIndex = selectedCard
    ? filteredCards.findIndex(c => c === selectedCard)
    : -1;
  const prevCard = currentIndex > 0 ? filteredCards[currentIndex - 1] : null;
  const nextCard =
    currentIndex >= 0 && currentIndex < filteredCards.length - 1
      ? filteredCards[currentIndex + 1]
      : null;

  return (
    <ResponsiveSheet
      open={selectedCard !== null}
      onOpenChange={open => !open && onClose()}
    >
      <ResponsiveSheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-md"
        hideCloseButton
      >
        {selectedCard && (
          <>
            <ResponsiveSheetHeader className="bg-background shrink-0 border-b p-4">
              <ResponsiveSheetTitle className="flex items-center justify-between gap-2">
                <span className="truncate">{selectedCard.name}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <KeyboardHint />
                  <DetailCloseButton onClose={onClose} />
                </div>
              </ResponsiveSheetTitle>
            </ResponsiveSheetHeader>
            <div className="scroll-container-optimized min-h-0 flex-1 overflow-y-auto p-4">
              {shouldRenderContent ? (
                <CardDetail card={selectedCard} />
              ) : (
                <SheetContentSkeleton />
              )}
            </div>
            <div className="mt-4 flex items-center justify-between border-t px-4 pt-4 pb-4">
              <Button
                variant="outline"
                size="sm"
                disabled={!prevCard}
                onClick={() => prevCard && onNavigate(prevCard)}
              >
                <ChevronLeft className="mr-1 size-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!nextCard}
                onClick={() => nextCard && onNavigate(nextCard)}
              >
                Next
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </>
        )}
      </ResponsiveSheetContent>
    </ResponsiveSheet>
  );
}

function DomainCardsCompareDrawer() {
  return (
    <CompareDrawer
      title="Compare Domain Cards"
      renderComparison={(items: ComparisonItem<DomainCard>[]) => (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-card overflow-hidden rounded-lg border p-4"
            >
              <h3 className="mb-3 text-lg font-semibold">{item.name}</h3>
              <CardDetail card={item.data} />
            </div>
          ))}
        </div>
      )}
    />
  );
}

type DomainCardsLayoutProps = {
  isInitialLoading: boolean;
  isMobile: boolean;
  filterGroups: FilterGroup[];
  filterState: ReturnType<typeof useFilterState>['filterState'];
  onSearchChange: ReturnType<typeof useFilterState>['onSearchChange'];
  onFilterChange: ReturnType<typeof useFilterState>['onFilterChange'];
  onClearFilters: ReturnType<typeof useFilterState>['onClearFilters'];
  filteredCards: DomainCard[];
  totalCount: number;
  sortBy: DomainCardSortKey;
  sortDir: 'asc' | 'desc';
  onSortByChange: (value: DomainCardSortKey) => void;
  onSortDirChange: (value: 'asc' | 'desc') => void;
  onSort: (column: DomainCardSortKey) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (value: 'grid' | 'table') => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  sortedDomainEntries: Array<[string, DomainCard[]]>;
  onSelectCard: (card: DomainCard) => void;
  selectedCard: DomainCard | null;
  onCloseCard: () => void;
};

function DomainCardsLayout({
  isInitialLoading,
  isMobile,
  filterGroups,
  filterState,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  filteredCards,
  totalCount,
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirChange,
  onSort,
  viewMode,
  onViewModeChange,
  scrollRef,
  sortedDomainEntries,
  onSelectCard,
  selectedCard,
  onCloseCard,
}: DomainCardsLayoutProps) {
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
          resultCount={filteredCards.length}
          totalCount={totalCount}
          searchPlaceholder="Search domain cards..."
          hideSearch
        />
      )}

      <div className="flex min-h-0 flex-1 flex-col">
        <DomainCardsHeader
          isMobile={isMobile}
          filterGroups={filterGroups}
          filterState={filterState}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          filteredCount={filteredCards.length}
          totalCount={totalCount}
        />

        <div
          ref={scrollRef}
          className="relative min-h-0 flex-1 overflow-y-auto"
        >
          <div className="p-4">
            {viewMode === 'grid' ? (
              <DomainCardsGridSections
                domainEntries={sortedDomainEntries}
                onSelectCard={onSelectCard}
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
              <DomainCardsTableView
                cards={filteredCards}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
                onSelectCard={onSelectCard}
              />
            )}

            {filteredCards.length === 0 && (
              <ReferenceEmptyState
                itemType="domain cards"
                onClearFilters={onClearFilters}
              />
            )}
          </div>
        </div>

        <BackToTop scrollRef={scrollRef} />
      </div>

      <DomainCardDetailSheet
        selectedCard={selectedCard}
        onClose={onCloseCard}
        filteredCards={filteredCards}
        onNavigate={onSelectCard}
      />

      <DomainCardsCompareDrawer />
    </div>
  );
}

function DomainCardsReferencePage() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = React.useState<DomainCardSortKey>('domain');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedCard, setSelectedCard] = React.useState<DomainCard | null>(
    null
  );

  // Memoized close handler with startTransition for smooth UI
  const handleCloseCard = React.useCallback(() => {
    React.startTransition(() => {
      setSelectedCard(null);
    });
  }, []);

  // Force grid view on mobile - tables are too wide for small screens
  React.useEffect(() => {
    if (isMobile && viewMode === 'table') {
      setViewMode('grid');
    }
  }, [isMobile, viewMode]);

  // Defer data loading until after initial paint
  const { data: allCards, isLoading: isInitialLoading } =
    useDeferredLoad(loadAllCards);

  // Handle column header click for sorting
  const handleSortClick = React.useCallback(
    (column: DomainCardSortKey) => {
      if (sortBy === column) {
        setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(column);
        setSortDir('asc');
      }
    },
    [sortBy]
  );

  const filterGroups = React.useMemo(
    () => (allCards ? buildFilterGroups(allCards) : []),
    [allCards]
  );

  const { filterState, onSearchChange, onFilterChange, onClearFilters } =
    useFilterState(filterGroups);

  const filteredCards = React.useMemo(() => {
    if (!allCards) return [];
    const cards = filterCards(
      allCards,
      filterState.search,
      filterState.filters
    );
    return sortDomainCards(cards, sortBy, sortDir);
  }, [allCards, filterState, sortBy, sortDir]);

  // Use deferred rendering for smooth filtering on mobile
  const { deferredItems: deferredCards } = useDeferredItems(filteredCards);

  // Group by domain for sectioned display
  const groupedCards = React.useMemo(
    () => groupDomainCards(deferredCards),
    [deferredCards]
  );
  const sortedDomainEntries = React.useMemo(
    () => getSortedDomainEntries(groupedCards),
    [groupedCards]
  );

  const displayOrderedCards = React.useMemo(() => {
    return sortedDomainEntries.flatMap(([, cards]) => cards);
  }, [sortedDomainEntries]);

  // Keyboard navigation
  useKeyboardNavigation({
    items: viewMode === 'grid' ? displayOrderedCards : deferredCards,
    selectedItem: selectedCard,
    onSelect: setSelectedCard,
    onClose: () => setSelectedCard(null),
  });

  const totalCount = allCards?.length ?? 0;

  return (
    <DomainCardsLayout
      isInitialLoading={isInitialLoading}
      isMobile={isMobile}
      filterGroups={filterGroups}
      filterState={filterState}
      onSearchChange={onSearchChange}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      filteredCards={filteredCards}
      totalCount={totalCount}
      sortBy={sortBy}
      sortDir={sortDir}
      onSortByChange={setSortBy}
      onSortDirChange={setSortDir}
      onSort={handleSortClick}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      scrollRef={scrollRef}
      sortedDomainEntries={sortedDomainEntries}
      onSelectCard={setSelectedCard}
      selectedCard={selectedCard}
      onCloseCard={handleCloseCard}
    />
  );
}

function DomainCardsPageWrapper() {
  return (
    <CompareProvider maxItems={4}>
      <DomainCardsReferencePage />
    </CompareProvider>
  );
}
