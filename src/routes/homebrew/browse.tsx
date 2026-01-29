/**
 * Browse Public Homebrew
 *
 * Page for discovering and browsing publicly shared homebrew content.
 */
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Beaker,
  Filter,
  GitFork,
  Globe,
  Loader2,
  Search,
  SortAsc,
  Star,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { HomebrewFormDialog, HomebrewList } from '@/components/homebrew';
import { useAuth } from '@/components/providers';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useForkHomebrewContent,
  usePublicHomebrewContentInfinite,
} from '@/features/homebrew';
import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';

import { CONTENT_TYPE_CONFIG } from './index';

export const Route = createFileRoute('/homebrew/browse')({
  component: BrowseHomebrew,
});

const CONTENT_TYPES: Array<{
  value: HomebrewContentType | 'all';
  label: string;
}> = [
  { value: 'all', label: 'All Types' },
  { value: 'adversary', label: 'Adversaries' },
  { value: 'environment', label: 'Environments' },
  { value: 'domain_card', label: 'Domain Cards' },
  { value: 'class', label: 'Classes' },
  { value: 'subclass', label: 'Subclasses' },
  { value: 'ancestry', label: 'Ancestries' },
  { value: 'community', label: 'Communities' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'item', label: 'Items' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'forks', label: 'Most Forked' },
  { value: 'name', label: 'Name (A-Z)' },
];

function BrowseHomebrew() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<HomebrewContentType | 'all'>(
    'all'
  );
  const [sortBy, setSortBy] = useState<'recent' | 'forks' | 'name'>('recent');

  // Map UI sort to API sort
  const sortOptions = useMemo(() => {
    switch (sortBy) {
      case 'forks':
        return { sortBy: 'fork_count' as const, sortOrder: 'desc' as const };
      case 'name':
        return { sortBy: 'name' as const, sortOrder: 'asc' as const };
      case 'recent':
      default:
        return { sortBy: 'created_at' as const, sortOrder: 'desc' as const };
    }
  }, [sortBy]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    usePublicHomebrewContentInfinite({
      contentType: typeFilter !== 'all' ? typeFilter : undefined,
      search: searchQuery.trim() || undefined,
      ...sortOptions,
    });

  const forkMutation = useForkHomebrewContent();

  // Flatten paginated results
  const pages = data?.pages;
  const publicContent = useMemo(() => {
    if (!pages) return [];
    return pages.flatMap(page => page.items);
  }, [pages]);

  // Get total from first page
  const totalCount = data?.pages[0]?.total ?? 0;

  // Infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<HomebrewContent | null>(null);

  const handleView = useCallback((item: HomebrewContent) => {
    setViewingItem(item);
    setIsViewOpen(true);
  }, []);

  const handleFork = useCallback(
    async (item: HomebrewContent) => {
      if (!user) {
        navigate({ to: '/login' });
        return;
      }
      const sourceId = item.forkedFrom ?? item.id;
      await forkMutation.mutateAsync(sourceId);
      navigate({ to: '/homebrew' });
    },
    [user, navigate, forkMutation]
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
          <div className="flex size-12 items-center justify-center rounded-xl bg-green-500/10">
            <Globe className="size-6 text-green-500" />
          </div>
          Browse Community Homebrew
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover and fork community-created content for your campaigns
        </p>
      </div>

      {/* Info Card */}
      <Card className="mb-6 border-green-500/20 bg-linear-to-r from-green-500/5 to-green-500/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GitFork className="size-5 text-green-500" />
            How Forking Works
          </CardTitle>
          <CardDescription className="text-base">
            When you fork homebrew content, you create your own editable copy
            that you can customize and use in your campaigns. The original
            creator gets credit and the fork count increases.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search homebrew..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Type Filter */}
            <Select
              value={typeFilter}
              onValueChange={v => setTypeFilter(v as typeof typeFilter)}
            >
              <SelectTrigger className="w-full sm:w-45">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map(type => {
                  const config =
                    type.value !== 'all'
                      ? CONTENT_TYPE_CONFIG[type.value]
                      : null;
                  const Icon = config?.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className={`size-4 ${config.color}`} />}
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={sortBy}
              onValueChange={v => setSortBy(v as typeof sortBy)}
            >
              <SelectTrigger className="w-full sm:w-52">
                <SortAsc className="mr-2 size-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.value === 'forks' && (
                      <Star className="mr-2 inline size-4" />
                    )}
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Results info */}
      <div className="text-muted-foreground mb-4 flex items-center gap-2">
        <Beaker className="size-4" />
        <span>
          {totalCount > 0 ? (
            <>
              Showing {publicContent.length} of {totalCount} items
            </>
          ) : isLoading ? (
            'Loading...'
          ) : (
            'No items found'
          )}
        </span>
        {(searchQuery || typeFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Content List */}
      <HomebrewList
        items={publicContent}
        isLoading={isLoading}
        currentUserId={user?.id}
        onView={handleView}
        onFork={handleFork}
        showCreateButton={false}
        emptyMessage={
          searchQuery || typeFilter !== 'all'
            ? 'No homebrew content matches your filters.'
            : 'No public homebrew content available yet. Be the first to share!'
        }
      />

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isFetchingNextPage ? (
            <div className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="size-5 animate-spin" />
              Loading more...
            </div>
          ) : (
            <Button variant="outline" onClick={() => fetchNextPage()}>
              Load More
            </Button>
          )}
        </div>
      )}

      {/* View Dialog */}
      {viewingItem && (
        <HomebrewFormDialog
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          contentType={viewingItem.contentType}
          initialData={viewingItem}
          onSubmit={() => {
            // View-only mode - close dialog
            setIsViewOpen(false);
          }}
          isSubmitting={false}
        />
      )}
    </div>
  );
}
