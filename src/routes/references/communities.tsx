/* eslint-disable max-lines, max-lines-per-function */
// Communities reference page with page-specific detail components

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
import { COMMUNITIES } from '@/lib/data/characters/communities';
import { Home } from '@/lib/icons';

export const Route = createFileRoute('/references/communities')({
  component: CommunitiesReferencePage,
});

type Community = (typeof COMMUNITIES)[number];

// Community-specific gradient colors
const communityGradients: Record<string, string> = {
  Highborne: 'from-yellow-400 to-amber-500',
  Loreborne: 'from-blue-500 to-indigo-600',
  Orderborne: 'from-purple-500 to-violet-600',
  Ridgeborne: 'from-stone-500 to-slate-600',
  Seaborne: 'from-cyan-500 to-blue-600',
  Slyborne: 'from-gray-600 to-zinc-700',
  Underborne: 'from-amber-700 to-orange-800',
  Wanderborne: 'from-green-500 to-emerald-600',
  Wildborne: 'from-lime-500 to-green-600',
};

// Community-specific accent colors
const communityAccents: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Highborne: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-500/30',
  },
  Loreborne: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-500/30',
  },
  Orderborne: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-500/30',
  },
  Ridgeborne: {
    bg: 'bg-stone-500/10',
    text: 'text-stone-700 dark:text-stone-400',
    border: 'border-stone-500/30',
  },
  Seaborne: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-700 dark:text-cyan-400',
    border: 'border-cyan-500/30',
  },
  Slyborne: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-700 dark:text-gray-400',
    border: 'border-gray-500/30',
  },
  Underborne: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/30',
  },
  Wanderborne: {
    bg: 'bg-green-500/10',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-500/30',
  },
  Wildborne: {
    bg: 'bg-lime-500/10',
    text: 'text-lime-700 dark:text-lime-400',
    border: 'border-lime-500/30',
  },
};

const defaultGradient = 'from-indigo-500 to-purple-600';
const defaultAccent = {
  bg: 'bg-indigo-500/10',
  text: 'text-indigo-700 dark:text-indigo-400',
  border: 'border-indigo-500/30',
};

function CommunityCard({
  community,
  onClick,
  compact = false,
}: {
  community: Community;
  onClick: () => void;
  compact?: boolean;
}) {
  const gradient = communityGradients[community.name] ?? defaultGradient;
  const accent = communityAccents[community.name] ?? defaultAccent;

  if (compact) {
    return (
      <Card
        className="hover:border-primary/50 cursor-pointer overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg"
        onClick={onClick}
      >
        <div className={`h-2 bg-linear-to-r ${gradient}`} />
        <CardHeader className="pb-2">
          <CardTitle className="truncate text-lg">{community.name}</CardTitle>
          <CardDescription className="mt-1 line-clamp-2 text-xs">
            {community.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {/* Feature highlight */}
          <div className={`rounded p-2 ${accent.bg} border ${accent.border}`}>
            <div className="mb-1 flex items-center gap-1.5">
              <Badge
                variant="outline"
                className={`py-0 text-xs ${accent.bg} ${accent.text} ${accent.border}`}
              >
                Feature
              </Badge>
              <span className="truncate text-sm font-medium">
                {community.feature.name}
              </span>
            </div>
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {community.feature.description}
            </p>
          </div>
          {/* Traits */}
          <div className="flex flex-wrap gap-1">
            {community.commonTraits.slice(0, 4).map((trait, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="py-0 text-xs capitalize"
              >
                {trait}
              </Badge>
            ))}
            {community.commonTraits.length > 4 && (
              <Badge variant="outline" className="py-0 text-xs">
                +{community.commonTraits.length - 4}
              </Badge>
            )}
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
        <CardTitle className="text-2xl">{community.name}</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {community.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Common Traits */}
        <div>
          <h4 className="text-muted-foreground mb-2 text-sm font-semibold">
            Common Traits
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {community.commonTraits.map((trait, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className={`text-xs capitalize ${accent.bg} ${accent.text} ${accent.border}`}
              >
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        {/* Community Feature */}
        <div className={`rounded-lg p-4 ${accent.bg} border ${accent.border}`}>
          <div className="mb-2 flex items-center gap-2">
            <Badge
              className={`${accent.bg} ${accent.text} border ${accent.border}`}
            >
              Feature
            </Badge>
            <h4 className="font-semibold">{community.feature.name}</h4>
          </div>
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {community.feature.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function CommunityDetail({ community }: { community: Community }) {
  const gradient = communityGradients[community.name] ?? defaultGradient;
  const accent = communityAccents[community.name] ?? defaultAccent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`-mx-4 -mt-4 bg-linear-to-r p-6 ${gradient}`}>
        <h2 className="text-3xl font-bold text-white">{community.name}</h2>
      </div>

      <p className="text-muted-foreground">{community.description}</p>

      {/* Common Traits */}
      <div>
        <h4 className="mb-2 font-semibold">Common Traits</h4>
        <div className="flex flex-wrap gap-2">
          {community.commonTraits.map((trait, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className={`capitalize ${accent.bg} ${accent.text} ${accent.border}`}
            >
              {trait}
            </Badge>
          ))}
        </div>
      </div>

      {/* Community Feature */}
      <div className={`rounded-lg p-4 ${accent.bg} border ${accent.border}`}>
        <div className="mb-2 flex items-center gap-2">
          <Badge
            className={`${accent.bg} ${accent.text} border ${accent.border}`}
          >
            Community Feature
          </Badge>
        </div>
        <h4 className="mb-2 font-semibold">{community.feature.name}</h4>
        <p className="text-muted-foreground text-sm">
          {community.feature.description}
        </p>
      </div>
    </div>
  );
}

// Stable loader function for useDeferredLoad
const loadAllCommunities = () => [...COMMUNITIES];

function CommunitiesReferencePage() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'name' | 'feature'>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [selectedCommunity, setSelectedCommunity] =
    React.useState<Community | null>(null);

  // Defer data loading until after initial paint
  const { data: allCommunities, isLoading: isInitialLoading } =
    useDeferredLoad(loadAllCommunities);

  const totalCount = allCommunities?.length ?? 0;

  const filteredCommunities = React.useMemo(() => {
    if (!allCommunities) return [];
    let result = [...allCommunities];

    // Filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.feature.name.toLowerCase().includes(searchLower) ||
          c.commonTraits.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'feature':
          cmp = a.feature.name.localeCompare(b.feature.name);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [allCommunities, search, sortBy, sortDir]);

  // Use deferred rendering for smooth filtering on mobile
  const { deferredItems: deferredCommunities, isPending: isFiltering } =
    useDeferredItems(filteredCommunities);

  // Keyboard navigation
  useKeyboardNavigation({
    items: deferredCommunities,
    selectedItem: selectedCommunity,
    onSelect: setSelectedCommunity,
    onClose: () => setSelectedCommunity(null),
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
            <h1 className="bg-linear-to-r from-green-500 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
              <Home className="mr-2 inline-block size-6" />
              Communities
            </h1>
            <ResultsCounter
              filtered={filteredCommunities.length}
              total={totalCount}
              label="communities"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort control */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'name' | 'feature')}
                className="bg-background h-9 rounded-md border px-2 text-sm"
              >
                <option value="name">Name</option>
                <option value="feature">Feature</option>
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
                placeholder="Search communities..."
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
              {deferredCommunities.map(community => (
                <CommunityCard
                  key={community.name}
                  community={community}
                  onClick={() => setSelectedCommunity(community)}
                  compact
                />
              ))}
            </div>
          ) : (
            /* Desktop: Full cards */
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {deferredCommunities.map(community => (
                <CommunityCard
                  key={community.name}
                  community={community}
                  onClick={() => setSelectedCommunity(community)}
                />
              ))}
            </div>
          )}

          {deferredCommunities.length === 0 && !isFiltering && (
            <div className="text-muted-foreground py-12 text-center">
              <p>No communities match your search.</p>
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
        open={selectedCommunity !== null}
        onOpenChange={open => !open && setSelectedCommunity(null)}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col p-0 sm:max-w-lg"
          hideCloseButton
        >
          {selectedCommunity && (
            <>
              <SheetHeader className="bg-background shrink-0 border-b p-4">
                <SheetTitle className="flex items-center justify-between gap-2">
                  <span className="truncate">{selectedCommunity.name}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <KeyboardHint />
                    <DetailCloseButton
                      onClose={() => setSelectedCommunity(null)}
                    />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <CommunityDetail community={selectedCommunity} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
