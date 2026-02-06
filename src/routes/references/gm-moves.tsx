// GM Moves Reference Page
// A quick reference for GMs showing all available moves organized by category

import {
  createFileRoute,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Search,
  X,
} from 'lucide-react';
import * as React from 'react';

import {
  BackToTop,
  DetailCloseButton,
  KeyboardHint,
  ReferenceEmptyState,
  ReferencePageSkeleton,
  ResultsCounter,
  useDeferredItems,
  useDeferredLoad,
  useDeferredSheetContent,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  ResponsiveSheet,
  ResponsiveSheetContent,
  ResponsiveSheetHeader,
  ResponsiveSheetTitle,
} from '@/components/ui/responsive-sheet';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';
import { SheetContentSkeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { GM_MOVE_CATEGORIES, GM_MOVES, type GMMove } from '@/lib/data/gm-moves';
import { Compass, Target, Zap } from '@/lib/icons';

export const Route = createFileRoute('/references/gm-moves')({
  component: GMMovesReferencePage,
  pendingComponent: () => <ReferencePageSkeleton showFilters={false} />,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
});

type GMMoveSortKey = 'name' | 'category';

const categoryOrder: GMMove['category'][] = ['soft', 'medium', 'hard'];

const categoryColors: Record<GMMove['category'], string> = {
  soft: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
  medium:
    'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40',
  hard: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40',
};

const categoryIcons: Record<GMMove['category'], React.ReactNode> = {
  soft: <Lightbulb className="size-3" />,
  medium: <Target className="size-3" />,
  hard: <Zap className="size-3" />,
};

const categoryLabels: Record<GMMove['category'], string> = {
  soft: 'Soft',
  medium: 'Medium',
  hard: 'Hard',
};

// Get whenToUse from category metadata
const categoryWhenToUse: Record<GMMove['category'], string> =
  GM_MOVE_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.id] = cat.whenToUse;
      return acc;
    },
    {} as Record<GMMove['category'], string>
  );

const GM_MOVE_SORTERS: Record<GMMoveSortKey, (a: GMMove, b: GMMove) => number> =
  {
    name: (a, b) => a.name.localeCompare(b.name),
    category: (a, b) =>
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category),
  };

function getGMMoveSearchText(move: GMMove) {
  return [
    move.name,
    move.description,
    categoryWhenToUse[move.category],
    ...(move.examples ?? []),
  ]
    .join(' ')
    .toLowerCase();
}

function filterGMMoves(
  items: GMMove[],
  search: string,
  categoryFilter: GMMove['category'] | 'all'
) {
  return items.filter(move => {
    if (categoryFilter !== 'all' && move.category !== categoryFilter)
      return false;
    if (!search) return true;
    return getGMMoveSearchText(move).includes(search.toLowerCase());
  });
}

function sortGMMoves(
  items: GMMove[],
  sortBy: GMMoveSortKey,
  sortDir: 'asc' | 'desc'
) {
  const sorted = [...items].sort(GM_MOVE_SORTERS[sortBy]);
  return sortDir === 'asc' ? sorted : sorted.reverse();
}

const loadAllGMMoves = () => [...GM_MOVES];

type GMMovesHeaderProps = {
  filteredCount: number;
  totalCount: number;
  categoryFilter: GMMove['category'] | 'all';
  sortBy: GMMoveSortKey;
  sortDir: 'asc' | 'desc';
  search: string;
  onCategoryFilterChange: (value: GMMove['category'] | 'all') => void;
  onSortByChange: (value: GMMoveSortKey) => void;
  onSortDirChange: (value: 'asc' | 'desc') => void;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
};

function GMMovesHeader({
  filteredCount,
  totalCount,
  categoryFilter,
  sortBy,
  sortDir,
  search,
  onCategoryFilterChange,
  onSortByChange,
  onSortDirChange,
  onSearchChange,
  onClearSearch,
}: GMMovesHeaderProps) {
  return (
    <div className="bg-background shrink-0 border-b px-4 py-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Compass className="size-4 text-blue-500" />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                GM Moves Reference
              </span>
            </div>
            <ResultsCounter
              filtered={filteredCount}
              total={totalCount}
              label="moves"
            />
          </div>
        </div>

        <div className="bg-muted/30 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search moves..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              className="h-9 pr-9 pl-9"
            />
            {search && (
              <button
                onClick={onClearSearch}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={e =>
                onCategoryFilterChange(
                  e.target.value as GMMove['category'] | 'all'
                )
              }
              className="bg-background h-8 rounded-md border px-2 text-sm"
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {categoryOrder.map(cat => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat]} Moves
                </option>
              ))}
            </select>

            <div className="bg-border h-6 w-px" />

            <div className="flex items-center gap-1">
              <select
                value={sortBy}
                onChange={e => onSortByChange(e.target.value as GMMoveSortKey)}
                className="bg-background h-8 rounded-md border px-2 text-sm"
                aria-label="Sort moves"
              >
                <option value="name">Name</option>
                <option value="category">Category</option>
              </select>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
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
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryExplanation() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Understanding Move Categories
                </CardTitle>
                <CardDescription>
                  How to choose between soft, medium, and hard moves
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                {isOpen ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid gap-4 md:grid-cols-3">
              {GM_MOVE_CATEGORIES.map(cat => (
                <div key={cat.id} className="space-y-2 rounded-lg border p-4">
                  <Badge variant="outline" className={cat.badgeColor}>
                    {categoryIcons[cat.id]}
                    <span className="ml-1">{cat.label}</span>
                  </Badge>
                  <p className="text-muted-foreground text-sm">
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-muted/50 text-muted-foreground mt-4 rounded-lg p-4 text-sm">
              <p className="text-foreground mb-2 font-medium">
                When to Make Moves:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>After a player rolls with Fear on an action roll</li>
                <li>After a player fails an action roll</li>
                <li>When a PC does something that would have consequences</li>
                <li>When a player gives you a golden opportunity</li>
                <li>When players look to you for what happens next</li>
              </ul>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

const GMMoveCard = React.memo(function GMMoveCard({
  move,
  compact = false,
  onClick,
}: {
  move: GMMove;
  compact?: boolean;
  onClick: () => void;
}) {
  const categoryBadge = categoryColors[move.category];

  return (
    <Card
      className="reference-card card-grid-item hover:border-primary/50 group h-full cursor-pointer overflow-hidden transition-all hover:shadow-xl"
      onClick={onClick}
    >
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500" />
      <CardHeader className={compact ? 'pb-2' : 'pb-3'}>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className={compact ? 'text-base' : 'text-lg'}>
            {move.name}
          </CardTitle>
          <Badge variant="outline" className={`text-xs ${categoryBadge}`}>
            {categoryIcons[move.category]}
            <span className="ml-1">{categoryLabels[move.category]}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={compact ? 'space-y-3 pt-0' : 'space-y-4'}>
        <CardDescription
          className={compact ? 'text-xs' : 'line-clamp-3 text-sm'}
        >
          {move.description}
        </CardDescription>

        <div className="bg-muted/40 rounded-lg border p-3 text-xs">
          <div className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-wide uppercase">
            When to Use
          </div>
          <p className="text-muted-foreground line-clamp-2">
            {categoryWhenToUse[move.category]}
          </p>
        </div>

        {(move.examples?.length ?? 0) > 0 && (
          <div className="text-muted-foreground text-xs">
            <span className="font-medium">
              {move.examples?.length} example
              {move.examples?.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

const GMMovesGrid = React.memo(function GMMovesGrid({
  items,
  isMobile,
  onSelect,
}: {
  items: GMMove[];
  isMobile: boolean;
  onSelect: (move: GMMove) => void;
}) {
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {items.map(move => (
          <GMMoveCard
            key={move.name}
            move={move}
            compact
            onClick={() => onSelect(move)}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map(move => (
        <GMMoveCard
          key={move.name}
          move={move}
          onClick={() => onSelect(move)}
        />
      ))}
    </div>
  );
});

function GMMoveDetailHeader({ move }: { move: GMMove }) {
  return (
    <div className="-mx-4 -mt-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-6">
      <div className="rounded-xl bg-black/30 p-4">
        <h2 className="text-2xl font-semibold text-white drop-shadow">
          {move.name}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
            {categoryIcons[move.category]}
            <span className="ml-1">{categoryLabels[move.category]} Move</span>
          </Badge>
        </div>
      </div>
    </div>
  );
}

function GMMoveDetail({ move }: { move: GMMove }) {
  return (
    <div className="space-y-6">
      <GMMoveDetailHeader move={move} />

      <div className="bg-card space-y-2 rounded-lg border p-4">
        <div className="mb-1">
          <div className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">
            <Compass className="size-3" />
            Description
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {move.description}
        </p>
      </div>

      <div className="bg-card space-y-2 rounded-lg border p-4">
        <div className="mb-1">
          <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            <Target className="size-3" />
            When to Use
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {categoryWhenToUse[move.category]}
        </p>
      </div>

      {(move.examples?.length ?? 0) > 0 && (
        <div className="bg-card space-y-3 rounded-lg border p-4">
          <div className="mb-1">
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
              <Lightbulb className="size-3" />
              Examples
            </div>
          </div>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {move.examples?.map((example, idx) => (
              <li key={idx} className="leading-relaxed">
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function GMMoveDetailSheet({
  selectedMove,
  onClose,
}: {
  selectedMove: GMMove | null;
  onClose: () => void;
}) {
  const shouldRenderContent = useDeferredSheetContent(selectedMove !== null);

  return (
    <ResponsiveSheet
      open={selectedMove !== null}
      onOpenChange={open => !open && onClose()}
    >
      <ResponsiveSheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-lg"
        hideCloseButton
      >
        {selectedMove && (
          <>
            <ResponsiveSheetHeader className="bg-background shrink-0 border-b p-4">
              <ResponsiveSheetTitle className="flex items-center justify-between gap-2">
                <span className="truncate">{selectedMove.name}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <KeyboardHint />
                  <DetailCloseButton onClose={onClose} />
                </div>
              </ResponsiveSheetTitle>
            </ResponsiveSheetHeader>
            <div className="scroll-container-optimized min-h-0 flex-1 overflow-y-auto p-4">
              {shouldRenderContent ? (
                <GMMoveDetail move={selectedMove} />
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

function GMMovesReferencePage() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<
    GMMove['category'] | 'all'
  >('all');
  const [sortBy, setSortBy] = React.useState<GMMoveSortKey>('category');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedMove, setSelectedMove] = React.useState<GMMove | null>(null);

  const handleCloseItem = React.useCallback(() => {
    React.startTransition(() => {
      setSelectedMove(null);
    });
  }, []);

  const { data: allMoves, isLoading: isInitialLoading } =
    useDeferredLoad(loadAllGMMoves);

  const totalCount = allMoves?.length ?? 0;

  const filteredMoves = React.useMemo(() => {
    if (!allMoves) return [];
    const filtered = filterGMMoves(allMoves, search, categoryFilter);
    return sortGMMoves(filtered, sortBy, sortDir);
  }, [allMoves, categoryFilter, search, sortBy, sortDir]);

  const { deferredItems: deferredMoves, isPending: isFiltering } =
    useDeferredItems(filteredMoves);

  useKeyboardNavigation({
    items: deferredMoves,
    selectedItem: selectedMove,
    onSelect: setSelectedMove,
    onClose: handleCloseItem,
  });

  if (isInitialLoading) {
    return <ReferencePageSkeleton showFilters={false} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GMMovesHeader
        filteredCount={filteredMoves.length}
        totalCount={totalCount}
        categoryFilter={categoryFilter}
        sortBy={sortBy}
        sortDir={sortDir}
        search={search}
        onCategoryFilterChange={setCategoryFilter}
        onSortByChange={setSortBy}
        onSortDirChange={setSortDir}
        onSearchChange={setSearch}
        onClearSearch={() => setSearch('')}
      />

      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto">
        {isFiltering && (
          <div className="bg-background/60 absolute inset-0 z-10 flex items-start justify-center pt-20 backdrop-blur-[1px]">
            <div className="bg-background rounded-lg border p-4 shadow-lg">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          </div>
        )}
        <div className="p-4">
          <CategoryExplanation />

          <GMMovesGrid
            items={deferredMoves}
            isMobile={isMobile}
            onSelect={setSelectedMove}
          />

          {deferredMoves.length === 0 && !isFiltering && (
            <ReferenceEmptyState
              itemType="moves"
              onClearFilters={() => {
                setSearch('');
                setCategoryFilter('all');
              }}
            />
          )}
        </div>
      </div>

      <BackToTop scrollRef={scrollRef} />

      <GMMoveDetailSheet
        selectedMove={selectedMove}
        onClose={handleCloseItem}
      />
    </div>
  );
}
