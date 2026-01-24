import { createFileRoute } from '@tanstack/react-router';
import { Grid3X3, List } from 'lucide-react';
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
  ReferenceFilter,
  ReferencePageSkeleton,
  ResultsCounter,
  SortableTableHead,
  SortControl,
  useCompare,
  useDeferredItems,
  useDeferredLoad,
  useFilterState,
  useKeyboardNavigation,
} from '@/components/references';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ALL_DOMAIN_NAMES, getAllDomainCards } from '@/lib/data/domains';
import type { DomainCard } from '@/lib/schemas/domains';
import { getCardCosts } from '@/lib/utils/card-costs';

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

function DomainCardCard({
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
      className={`h-full cursor-pointer border-l-4 transition-all hover:scale-[1.01] hover:shadow-lg ${domainColor.border} overflow-hidden ${inCompare ? 'ring-primary ring-2' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="truncate text-base leading-tight">
            {card.name}
          </CardTitle>
          <div className="flex shrink-0 items-center gap-1">
            <CompareToggleButton
              item={{ id: cardId, name: card.name, data: card }}
              size="sm"
            />
            <Badge className={`${levelColors[card.level] ?? 'bg-gray-500/20'}`}>
              Lvl {card.level}
            </Badge>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          <Badge variant="outline" className={cardTypeColors[card.type]}>
            {card.type}
          </Badge>
          <Badge
            variant="outline"
            className={`${domainColor.bg} ${domainColor.text} ${domainColor.border}`}
          >
            {card.domain}
          </Badge>
        </div>
        {/* Costs row - always visible */}
        <div className="mt-2">
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
}

function DomainCardTableRow({
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
      className={`hover:bg-muted/50 cursor-pointer ${inCompare ? 'bg-primary/10' : ''}`}
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
        <Badge
          variant="outline"
          className={`${domainColor.bg} ${domainColor.text} ${domainColor.border}`}
        >
          {card.domain}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cardTypeColors[card.type]}>
          {card.type}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={levelColors[card.level] ?? 'bg-gray-500/20'}>
          {card.level}
        </Badge>
      </TableCell>
      <TableCell>
        <CardCostBadges costs={costs} compact />
      </TableCell>
    </TableRow>
  );
}

function CardDetail({ card }: { card: DomainCard }) {
  const domainColor = domainColors[card.domain] ?? defaultDomainColor;
  const costs = useMemo(() => getCardCosts(card), [card]);
  const hasActivationCosts = costs.activationCosts.length > 0;
  const hopeCosts = costs.activationCosts.filter(c => c.type === 'Hope');
  const stressCosts = costs.activationCosts.filter(c => c.type === 'Stress');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={levelColors[card.level] ?? 'bg-gray-500/20'}>
          Level {card.level}
        </Badge>
        <Badge variant="outline" className={cardTypeColors[card.type]}>
          {card.type}
        </Badge>
        <Badge
          variant="outline"
          className={`${domainColor.bg} ${domainColor.text} ${domainColor.border}`}
        >
          {card.domain}
        </Badge>
      </div>

      {/* Costs section - always visible */}
      <div className="flex flex-wrap gap-3">
        <div className="min-w-24 flex-1 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3">
          <div className="text-muted-foreground text-xs">Recall Cost</div>
          <div className="text-lg font-bold text-rose-700 dark:text-rose-400">
            ⚡ {costs.recallCost === 0 ? 'Free' : costs.recallCost}
          </div>
        </div>
        {hopeCosts.length > 0 && (
          <div className="min-w-24 flex-1 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="text-muted-foreground text-xs">
              Activation (Hope)
            </div>
            <div className="text-lg font-bold text-amber-700 dark:text-amber-400">
              💫{' '}
              {hopeCosts
                .map(c => (c.amount === 'any' ? 'X' : c.amount))
                .join(' + ')}
            </div>
          </div>
        )}
        {stressCosts.length > 0 && (
          <div className="min-w-24 flex-1 rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
            <div className="text-muted-foreground text-xs">
              Activation (Stress)
            </div>
            <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
              😰{' '}
              {stressCosts.reduce(
                (sum, c) => sum + (c.amount === 'any' ? 0 : c.amount),
                0
              )}
            </div>
          </div>
        )}
        {costs.recallCost === 0 && !hasActivationCosts && (
          <div className="min-w-24 flex-1 rounded-lg border border-dashed p-3">
            <div className="text-muted-foreground text-xs">Activation</div>
            <div className="text-muted-foreground text-lg font-bold">Free</div>
          </div>
        )}
      </div>

      <div className="bg-muted/50 rounded-lg border p-4">
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

function DomainCardsReferencePage() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = React.useState<DomainCardSortKey>('domain');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedCard, setSelectedCard] = React.useState<DomainCard | null>(
    null
  );

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

    // Apply sorting
    return [...cards].sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'domain':
          cmp = a.domain.localeCompare(b.domain);
          // Secondary sort by name for stability
          if (cmp === 0) {
            cmp = a.name.localeCompare(b.name);
          }
          break;
        case 'level':
          cmp = a.level - b.level;
          // Secondary sort by name for stability
          if (cmp === 0) {
            cmp = a.name.localeCompare(b.name);
          }
          break;
        case 'type':
          cmp = a.type.localeCompare(b.type);
          // Secondary sort by name for stability
          if (cmp === 0) {
            cmp = a.name.localeCompare(b.name);
          }
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [allCards, filterState, sortBy, sortDir]);

  // Use deferred rendering for smooth filtering on mobile
  const { deferredItems: deferredCards, isPending: isFiltering } =
    useDeferredItems(filteredCards);

  // Group by domain for sectioned display
  const groupedCards = React.useMemo(() => {
    const groups: Record<string, DomainCard[]> = {};
    for (const card of deferredCards) {
      if (!groups[card.domain]) groups[card.domain] = [];
      groups[card.domain].push(card);
    }
    // Sort each domain's cards by level
    for (const domain of Object.keys(groups)) {
      groups[domain].sort((a, b) => a.level - b.level);
    }
    return groups;
  }, [deferredCards]);

  // Keyboard navigation
  useKeyboardNavigation({
    items: deferredCards,
    selectedItem: selectedCard,
    onSelect: setSelectedCard,
    onClose: () => setSelectedCard(null),
  });

  // Show skeleton while data is loading
  if (isInitialLoading) {
    return <ReferencePageSkeleton showFilters={!isMobile} />;
  }

  const totalCount = allCards?.length ?? 0;

  return (
    <div className="flex min-h-0 flex-1">
      {/* Filter sidebar */}
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
        />
      )}

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <div className="bg-background shrink-0 border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="bg-linear-to-r from-violet-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                ✨ Domain Cards
              </h1>
              <ResultsCounter
                filtered={filteredCards.length}
                total={totalCount}
                label="cards"
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
                  resultCount={filteredCards.length}
                  totalCount={totalCount}
                  searchPlaceholder="Search domain cards..."
                />
              )}

              {/* Sort control */}
              <SortControl
                options={[
                  { value: 'name', label: 'Name' },
                  { value: 'domain', label: 'Domain' },
                  { value: 'type', label: 'Type' },
                  { value: 'level', label: 'Level' },
                ]}
                value={sortBy}
                onChange={v => setSortBy(v as DomainCardSortKey)}
                direction={sortDir}
                onDirectionChange={d => setSortDir(d)}
              />

              {/* Hide view toggle on mobile - table view is too wide for small screens */}
              {!isMobile && (
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
              )}
            </div>
          </div>
        </div>

        {/* Content - scrollable */}
        <div
          ref={scrollRef}
          className="relative min-h-0 flex-1 overflow-y-auto"
        >
          {/* Loading overlay during filtering */}
          {isFiltering && (
            <div className="bg-background/60 absolute inset-0 z-10 flex items-start justify-center pt-20 backdrop-blur-[1px]">
              <div className="bg-background rounded-lg border p-4 shadow-lg">
                <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
              </div>
            </div>
          )}
          <div className="p-4">
            {viewMode === 'grid' ? (
              <div className="space-y-8">
                {Object.entries(groupedCards)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([domain, cards]) => {
                    const domainColor =
                      domainColors[domain] ?? defaultDomainColor;
                    return (
                      <section key={domain}>
                        <h2 className="bg-background/95 sticky top-0 z-10 -mx-4 mb-4 flex items-center gap-2 px-4 py-2 text-xl font-semibold backdrop-blur">
                          <span
                            className={`inline-block h-3 w-3 rounded-full bg-linear-to-r ${domainColor.gradient}`}
                          />
                          {domain}
                          <Badge variant="outline">{cards.length}</Badge>
                        </h2>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {cards.map(card => (
                            <DomainCardCard
                              key={`${card.domain}-${card.name}`}
                              card={card}
                              onClick={() => setSelectedCard(card)}
                            />
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
                      column="domain"
                      label="Domain"
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
                      column="level"
                      label="Level"
                      currentSort={sortBy}
                      direction={sortDir}
                      onSort={handleSortClick}
                    />
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.map(card => (
                    <DomainCardTableRow
                      key={`${card.domain}-${card.name}`}
                      card={card}
                      onClick={() => setSelectedCard(card)}
                    />
                  ))}
                </TableBody>
              </Table>
            )}

            {filteredCards.length === 0 && (
              <div className="text-muted-foreground py-12 text-center">
                <p>No domain cards match your filters.</p>
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

        {/* Back to top */}
        <BackToTop scrollRef={scrollRef} />
      </div>

      {/* Detail sheet */}
      <Sheet
        open={selectedCard !== null}
        onOpenChange={open => !open && setSelectedCard(null)}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col p-0 sm:max-w-md"
          hideCloseButton
        >
          {selectedCard && (
            <>
              <SheetHeader className="shrink-0 border-b p-4">
                <SheetTitle className="flex items-center justify-between gap-2">
                  <span className="truncate">{selectedCard.name}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <KeyboardHint />
                    <DetailCloseButton onClose={() => setSelectedCard(null)} />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <CardDetail card={selectedCard} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Comparison drawer */}
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
    </div>
  );
}

function DomainCardsPageWrapper() {
  return (
    <CompareProvider maxItems={4}>
      <DomainCardsReferencePage />
    </CompareProvider>
  );
}
