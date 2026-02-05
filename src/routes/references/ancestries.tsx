// Ancestries reference page with page-specific detail components

import { createFileRoute } from '@tanstack/react-router';
import { ArrowDown, ArrowUp, Search, X } from 'lucide-react';
import * as React from 'react';

import {
  BackToTop,
  DetailCloseButton,
  KeyboardHint,
  ReferencePageSkeleton,
  ResultsCounter,
  useDeferredItems,
  useDeferredLoad,
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
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { ANCESTRIES } from '@/lib/data/characters/ancestries';
import { Users } from '@/lib/icons';

export const Route = createFileRoute('/references/ancestries')({
  component: AncestriesReferencePage,
});

type Ancestry = (typeof ANCESTRIES)[number];

// Ancestry-specific gradient colors
const ancestryGradients: Record<string, string> = {
  Clank: 'from-slate-500 to-zinc-600',
  Drakona: 'from-red-500 to-orange-600',
  Dwarf: 'from-amber-600 to-yellow-700',
  Elf: 'from-teal-500 to-cyan-600',
  Faerie: 'from-pink-400 to-purple-500',
  Faun: 'from-lime-500 to-green-600',
  Firbolg: 'from-orange-600 to-red-700',
  Fungril: 'from-purple-500 to-violet-600',
  Galapa: 'from-green-600 to-emerald-700',
  Giant: 'from-gray-500 to-slate-600',
  Goblin: 'from-green-500 to-lime-600',
  Halfling: 'from-yellow-500 to-amber-600',
  Human: 'from-blue-500 to-indigo-600',
  Inferis: 'from-red-600 to-rose-700',
  Katari: 'from-orange-400 to-amber-500',
  Orc: 'from-emerald-600 to-green-700',
  Ribbet: 'from-lime-400 to-green-500',
  Simiah: 'from-amber-500 to-orange-600',
  Titan: 'from-stone-500 to-slate-600',
};

const defaultGradient = 'from-indigo-500 to-purple-600';

function AncestryCard({
  ancestry,
  onClick,
  compact = false,
}: {
  ancestry: Ancestry;
  onClick: () => void;
  compact?: boolean;
}) {
  const gradient = ancestryGradients[ancestry.name] ?? defaultGradient;

  if (compact) {
    return (
      <Card
        className="hover:border-primary/50 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
        onClick={onClick}
      >
        <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{ancestry.name}</CardTitle>
          <div className="text-muted-foreground flex gap-2 text-xs">
            <span>{ancestry.heightRange}</span>
            <span>·</span>
            <span>{ancestry.lifespan}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1">
            <Badge
              variant="outline"
              className="bg-amber-500/10 text-xs text-amber-700 dark:text-amber-400"
            >
              {ancestry.primaryFeature.name}
            </Badge>
            <Badge
              variant="outline"
              className="bg-cyan-500/10 text-xs text-cyan-700 dark:text-cyan-400"
            >
              {ancestry.secondaryFeature.name}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="h-full cursor-pointer overflow-hidden transition-all hover:scale-[1.01] hover:shadow-lg"
      onClick={onClick}
    >
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-2xl">{ancestry.name}</CardTitle>
          <div className="flex shrink-0 flex-col gap-1 text-right">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-xs">
                  {ancestry.heightRange}
                </Badge>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Typical height range.
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-xs text-blue-700 dark:text-blue-400"
                >
                  {ancestry.lifespan}
                </Badge>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>Typical lifespan.</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {ancestry.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-card rounded-lg border p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
                <Users className="size-3" />
                Physical Traits
              </div>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              Common physical characteristics.
            </TooltipContent>
          </Tooltip>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ancestry.physicalCharacteristics.map((char, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="bg-muted/50 text-xs"
              >
                {char}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
                  Primary Feature
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Signature primary feature.
              </TooltipContent>
            </Tooltip>
            <p className="mt-2 text-sm font-semibold">
              {ancestry.primaryFeature.name}
            </p>
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {ancestry.primaryFeature.description}
            </p>
          </div>

          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-700 uppercase dark:text-cyan-300">
                  Secondary Feature
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Supporting secondary feature.
              </TooltipContent>
            </Tooltip>
            <p className="mt-2 text-sm font-semibold">
              {ancestry.secondaryFeature.name}
            </p>
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {ancestry.secondaryFeature.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AncestryDetail({ ancestry }: { ancestry: Ancestry }) {
  const gradient = ancestryGradients[ancestry.name] ?? defaultGradient;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`-mx-4 -mt-4 bg-gradient-to-r p-6 ${gradient}`}>
        <div className="rounded-xl bg-black/30 p-4">
          <h2 className="text-2xl font-semibold text-white drop-shadow">
            <Users className="mr-2 inline-block size-6" />
            {ancestry.name}
          </h2>
          <div className="mt-2 flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
                  {ancestry.heightRange}
                </Badge>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Typical height range.
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
                  {ancestry.lifespan}
                </Badge>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>Typical lifespan.</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-4">
        <div className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          Overview
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          {ancestry.description}
        </p>
      </div>

      {/* Physical Characteristics */}
      <div className="bg-card rounded-lg border p-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
              <Users className="size-3" />
              Physical Characteristics
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            Common physical traits.
          </TooltipContent>
        </Tooltip>
        <div className="mt-2 flex flex-wrap gap-2">
          {ancestry.physicalCharacteristics.map((char, idx) => (
            <Badge key={idx} variant="outline" className="bg-muted/50">
              {char}
            </Badge>
          ))}
        </div>
      </div>

      {/* Primary Feature */}
      <div className="rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
              Primary Feature
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            Signature primary feature.
          </TooltipContent>
        </Tooltip>
        <h4 className="mt-2 mb-2 font-semibold">
          {ancestry.primaryFeature.name}
        </h4>
        <p className="text-muted-foreground text-sm">
          {ancestry.primaryFeature.description}
        </p>
      </div>

      {/* Secondary Feature */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-700 uppercase dark:text-cyan-300">
              Secondary Feature
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            Supporting secondary feature.
          </TooltipContent>
        </Tooltip>
        <h4 className="mt-2 mb-2 font-semibold">
          {ancestry.secondaryFeature.name}
        </h4>
        <p className="text-muted-foreground text-sm">
          {ancestry.secondaryFeature.description}
        </p>
      </div>
    </div>
  );
}

// Stable loader function for useDeferredLoad
const loadAllAncestries = () => [...ANCESTRIES];

type AncestrySortKey = 'name' | 'primary' | 'secondary';

const ANCESTRY_SORTERS: Record<
  AncestrySortKey,
  (a: Ancestry, b: Ancestry) => number
> = {
  name: (a, b) => a.name.localeCompare(b.name),
  primary: (a, b) => a.primaryFeature.name.localeCompare(b.primaryFeature.name),
  secondary: (a, b) =>
    a.secondaryFeature.name.localeCompare(b.secondaryFeature.name),
};

function filterAncestries(items: Ancestry[], search: string) {
  if (!search) return items;
  const searchLower = search.toLowerCase();
  return items.filter(
    ancestry =>
      ancestry.name.toLowerCase().includes(searchLower) ||
      ancestry.description.toLowerCase().includes(searchLower) ||
      ancestry.primaryFeature.name.toLowerCase().includes(searchLower) ||
      ancestry.secondaryFeature.name.toLowerCase().includes(searchLower)
  );
}

function sortAncestries(
  items: Ancestry[],
  sortBy: AncestrySortKey,
  sortDir: 'asc' | 'desc'
) {
  const sorted = [...items].sort(ANCESTRY_SORTERS[sortBy]);
  return sortDir === 'asc' ? sorted : sorted.reverse();
}

type AncestriesHeaderProps = {
  filteredCount: number;
  totalCount: number;
  sortBy: AncestrySortKey;
  sortDir: 'asc' | 'desc';
  search: string;
  onSortByChange: (value: AncestrySortKey) => void;
  onSortDirChange: (value: 'asc' | 'desc') => void;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
};

function AncestriesHeader({
  filteredCount,
  totalCount,
  sortBy,
  sortDir,
  search,
  onSortByChange,
  onSortDirChange,
  onSearchChange,
  onClearSearch,
}: AncestriesHeaderProps) {
  return (
    <div className="bg-background shrink-0 border-b px-4 py-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Users className="size-4 text-teal-500" />
              <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                Ancestries
              </span>
            </div>
            <ResultsCounter
              filtered={filteredCount}
              total={totalCount}
              label="ancestries"
            />
          </div>
        </div>

        <div className="bg-muted/30 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search ancestries..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              className="h-9 pr-9 pl-9"
            />
            {search && (
              <button
                onClick={onClearSearch}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sortBy}
              onChange={e => onSortByChange(e.target.value as AncestrySortKey)}
              className="bg-background h-8 rounded-md border px-2 text-sm"
            >
              <option value="name">Name</option>
              <option value="primary">Primary Feature</option>
              <option value="secondary">Secondary Feature</option>
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
  );
}

function AncestriesGrid({
  items,
  isMobile,
  onSelect,
}: {
  items: Ancestry[];
  isMobile: boolean;
  onSelect: (ancestry: Ancestry) => void;
}) {
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-3">
        {items.map(ancestry => (
          <AncestryCard
            key={ancestry.name}
            ancestry={ancestry}
            onClick={() => onSelect(ancestry)}
            compact
          />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map(ancestry => (
        <AncestryCard
          key={ancestry.name}
          ancestry={ancestry}
          onClick={() => onSelect(ancestry)}
        />
      ))}
    </div>
  );
}

function AncestriesEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <p>No ancestries match your search.</p>
      <Button variant="link" onClick={onClear} className="mt-2">
        Clear search
      </Button>
    </div>
  );
}

function AncestryDetailSheet({
  selectedAncestry,
  onClose,
}: {
  selectedAncestry: Ancestry | null;
  onClose: () => void;
}) {
  return (
    <Sheet
      open={selectedAncestry !== null}
      onOpenChange={open => !open && onClose()}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-lg"
        hideCloseButton
      >
        {selectedAncestry && (
          <>
            <SheetHeader className="bg-background shrink-0 border-b p-4">
              <SheetTitle className="flex items-center justify-between gap-2">
                <span className="truncate">{selectedAncestry.name}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <KeyboardHint />
                  <DetailCloseButton onClose={onClose} />
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <AncestryDetail ancestry={selectedAncestry} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function AncestriesReferencePage() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<AncestrySortKey>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedAncestry, setSelectedAncestry] =
    React.useState<Ancestry | null>(null);

  // Defer data loading until after initial paint
  const { data: allAncestries, isLoading: isInitialLoading } =
    useDeferredLoad(loadAllAncestries);

  const totalCount = allAncestries?.length ?? 0;

  const filteredAncestries = React.useMemo(() => {
    if (!allAncestries) return [];
    const filtered = filterAncestries(allAncestries, search);
    return sortAncestries(filtered, sortBy, sortDir);
  }, [allAncestries, search, sortBy, sortDir]);

  // Use deferred rendering for smooth filtering on mobile
  const { deferredItems: deferredAncestries, isPending: isFiltering } =
    useDeferredItems(filteredAncestries);

  // Keyboard navigation
  useKeyboardNavigation({
    items: deferredAncestries,
    selectedItem: selectedAncestry,
    onSelect: setSelectedAncestry,
    onClose: () => setSelectedAncestry(null),
  });

  // Show skeleton while loading initial data
  if (isInitialLoading) {
    return <ReferencePageSkeleton showFilters={!isMobile} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <AncestriesHeader
        filteredCount={filteredAncestries.length}
        totalCount={totalCount}
        sortBy={sortBy}
        sortDir={sortDir}
        search={search}
        onSortByChange={setSortBy}
        onSortDirChange={setSortDir}
        onSearchChange={setSearch}
        onClearSearch={() => setSearch('')}
      />

      {/* Content - scrollable */}
      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto">
        {/* Loading overlay during filtering */}
        {isFiltering && (
          <div className="bg-background/60 absolute inset-0 z-10 flex items-start justify-center pt-20 backdrop-blur-[1px]">
            <div className="bg-background rounded-lg border p-4 shadow-lg">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          </div>
        )}
        <div className="p-4">
          <AncestriesGrid
            items={deferredAncestries}
            isMobile={isMobile}
            onSelect={setSelectedAncestry}
          />

          {deferredAncestries.length === 0 && !isFiltering && (
            <AncestriesEmptyState onClear={() => setSearch('')} />
          )}
        </div>
      </div>

      {/* Back to top button */}
      <BackToTop scrollRef={scrollRef} />

      {/* Detail sheet */}
      <AncestryDetailSheet
        selectedAncestry={selectedAncestry}
        onClose={() => setSelectedAncestry(null)}
      />
    </div>
  );
}
