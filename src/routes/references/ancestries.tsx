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
        <div className={`h-2 bg-linear-to-r ${gradient}`} />
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
      <div className={`h-3 bg-linear-to-r ${gradient}`} />
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-2xl">{ancestry.name}</CardTitle>
          <div className="flex shrink-0 flex-col gap-1 text-right">
            <Badge variant="outline" className="text-xs">
              {ancestry.heightRange}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-xs text-blue-700 dark:text-blue-400"
            >
              {ancestry.lifespan}
            </Badge>
          </div>
        </div>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {ancestry.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Physical Characteristics */}
        <div>
          <h4 className="text-muted-foreground mb-2 text-sm font-semibold">
            Physical Characteristics
          </h4>
          <div className="flex flex-wrap gap-1.5">
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

        {/* Features */}
        <div className="space-y-3">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="mb-1 flex items-center gap-2">
              <Badge className="border-amber-500/40 bg-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                Primary
              </Badge>
              <span className="text-sm font-semibold">
                {ancestry.primaryFeature.name}
              </span>
            </div>
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {ancestry.primaryFeature.description}
            </p>
          </div>

          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
            <div className="mb-1 flex items-center gap-2">
              <Badge className="border-cyan-500/40 bg-cyan-500/20 text-xs text-cyan-700 dark:text-cyan-400">
                Secondary
              </Badge>
              <span className="text-sm font-semibold">
                {ancestry.secondaryFeature.name}
              </span>
            </div>
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
      <div className={`-mx-4 -mt-4 bg-linear-to-r p-6 ${gradient}`}>
        <h2 className="text-3xl font-bold text-white">{ancestry.name}</h2>
        <div className="mt-2 flex gap-2">
          <Badge className="border-white/30 bg-white/20 text-white">
            {ancestry.heightRange}
          </Badge>
          <Badge className="border-white/30 bg-white/20 text-white">
            {ancestry.lifespan}
          </Badge>
        </div>
      </div>

      <p className="text-muted-foreground">{ancestry.description}</p>

      {/* Physical Characteristics */}
      <div>
        <h4 className="mb-2 font-semibold">Physical Characteristics</h4>
        <div className="flex flex-wrap gap-2">
          {ancestry.physicalCharacteristics.map((char, idx) => (
            <Badge key={idx} variant="outline" className="bg-muted/50">
              {char}
            </Badge>
          ))}
        </div>
      </div>

      {/* Primary Feature */}
      <div className="rounded-lg border border-amber-500/30 bg-linear-to-br from-amber-500/10 to-orange-500/10 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge className="border-amber-500/40 bg-amber-500/20 text-amber-700 dark:text-amber-400">
            Primary Feature
          </Badge>
        </div>
        <h4 className="mb-2 font-semibold">{ancestry.primaryFeature.name}</h4>
        <p className="text-muted-foreground text-sm">
          {ancestry.primaryFeature.description}
        </p>
      </div>

      {/* Secondary Feature */}
      <div className="rounded-lg border border-cyan-500/30 bg-linear-to-br from-cyan-500/10 to-blue-500/10 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge className="border-cyan-500/40 bg-cyan-500/20 text-cyan-700 dark:text-cyan-400">
            Secondary Feature
          </Badge>
        </div>
        <h4 className="mb-2 font-semibold">{ancestry.secondaryFeature.name}</h4>
        <p className="text-muted-foreground text-sm">
          {ancestry.secondaryFeature.description}
        </p>
      </div>
    </div>
  );
}

// Stable loader function for useDeferredLoad
const loadAllAncestries = () => [...ANCESTRIES];

function AncestriesReferencePage() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'name' | 'primary' | 'secondary'>(
    'name'
  );
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedAncestry, setSelectedAncestry] =
    React.useState<Ancestry | null>(null);

  // Defer data loading until after initial paint
  const { data: allAncestries, isLoading: isInitialLoading } =
    useDeferredLoad(loadAllAncestries);

  const totalCount = allAncestries?.length ?? 0;

  const filteredAncestries = React.useMemo(() => {
    if (!allAncestries) return [];
    let result = [...allAncestries];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        a =>
          a.name.toLowerCase().includes(searchLower) ||
          a.description.toLowerCase().includes(searchLower) ||
          a.primaryFeature.name.toLowerCase().includes(searchLower) ||
          a.secondaryFeature.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'primary':
          cmp = a.primaryFeature.name.localeCompare(b.primaryFeature.name);
          break;
        case 'secondary':
          cmp = a.secondaryFeature.name.localeCompare(b.secondaryFeature.name);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
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
      <div className="bg-background shrink-0 border-b p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bg-linear-to-r from-teal-500 to-cyan-600 bg-clip-text text-2xl font-bold text-transparent">
              <Users className="mr-2 inline-block size-6" />
              Ancestries
            </h1>
            <ResultsCounter
              filtered={filteredAncestries.length}
              total={totalCount}
              label="ancestries"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort control */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={e =>
                  setSortBy(e.target.value as 'name' | 'primary' | 'secondary')
                }
                className="bg-background h-9 rounded-md border px-2 text-sm"
              >
                <option value="name">Name</option>
                <option value="primary">Primary Feature</option>
                <option value="secondary">Secondary Feature</option>
              </select>
              <Button
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
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
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search ancestries..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pr-9 pl-9"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

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
          {isMobile ? (
            /* Mobile: Compact cards */
            <div className="grid grid-cols-1 gap-3">
              {deferredAncestries.map(ancestry => (
                <AncestryCard
                  key={ancestry.name}
                  ancestry={ancestry}
                  onClick={() => setSelectedAncestry(ancestry)}
                  compact
                />
              ))}
            </div>
          ) : (
            /* Desktop: Full cards */
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {deferredAncestries.map(ancestry => (
                <AncestryCard
                  key={ancestry.name}
                  ancestry={ancestry}
                  onClick={() => setSelectedAncestry(ancestry)}
                />
              ))}
            </div>
          )}

          {deferredAncestries.length === 0 && !isFiltering && (
            <div className="text-muted-foreground py-12 text-center">
              <p>No ancestries match your search.</p>
              <Button
                variant="link"
                onClick={() => setSearch('')}
                className="mt-2"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Back to top button */}
      <BackToTop scrollRef={scrollRef} />

      {/* Detail sheet */}
      <Sheet
        open={selectedAncestry !== null}
        onOpenChange={open => !open && setSelectedAncestry(null)}
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
                    <DetailCloseButton
                      onClose={() => setSelectedAncestry(null)}
                    />
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
    </div>
  );
}
