/**
 * Browse Homebrew Section Components
 *
 * Extracted section components for BrowseHomebrew to reduce complexity.
 */
import {
  Beaker,
  Filter,
  GitFork,
  Globe,
  Loader2,
  Plus,
  Search,
  SortAsc,
  Star,
  X,
} from 'lucide-react';
import type { RefObject } from 'react';

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
import type { HomebrewContentType } from '@/lib/schemas/homebrew';

import { CONTENT_TYPE_CONFIG } from './index';

// ─────────────────────────────────────────────────────────────────────────────
// Header Section
// ─────────────────────────────────────────────────────────────────────────────

interface BrowseHeaderSectionProps {
  isLoggedIn: boolean;
  onCreateClick: () => void;
}

export function BrowseHeaderSection({
  isLoggedIn,
  onCreateClick,
}: BrowseHeaderSectionProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="text-2xl font-bold">
          <Globe className="mr-2 inline-block size-6 text-green-500" />
          Browse Community Homebrew
        </span>
        <p className="text-muted-foreground mt-2">
          Discover and fork community-created content for your campaigns
        </p>
      </div>
      {isLoggedIn && (
        <Button size="lg" onClick={onCreateClick}>
          <Plus className="mr-2 size-5" /> Create Public
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Fork Info Card
// ─────────────────────────────────────────────────────────────────────────────

interface ForkInfoCardProps {
  onDismiss: () => void;
}

export function ForkInfoCard({ onDismiss }: ForkInfoCardProps) {
  return (
    <Card className="relative mb-6 border-green-500/20 bg-linear-to-r from-green-500/5 to-green-500/10">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 size-7"
        onClick={onDismiss}
      >
        <X className="size-4" />
      </Button>
      <CardHeader className="pr-10 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitFork className="size-5 text-green-500" />
          How Forking Works
        </CardTitle>
        <CardDescription className="text-base">
          When you fork homebrew content, you create your own editable copy that
          you can customize and use in your campaigns. The original creator gets
          credit and the fork count increases.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter Card
// ─────────────────────────────────────────────────────────────────────────────

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

interface BrowseFilterCardProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: HomebrewContentType | 'all';
  onTypeFilterChange: (value: HomebrewContentType | 'all') => void;
  sortBy: 'recent' | 'forks' | 'name';
  onSortChange: (value: 'recent' | 'forks' | 'name') => void;
}

export function BrowseFilterCard({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortChange,
}: BrowseFilterCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search homebrew..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Type Filter */}
          <Select
            value={typeFilter}
            onValueChange={v => onTypeFilterChange(v as typeof typeFilter)}
          >
            <SelectTrigger className="w-full sm:w-45">
              <Filter className="mr-2 size-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map(type => {
                const config =
                  type.value !== 'all' ? CONTENT_TYPE_CONFIG[type.value] : null;
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
            onValueChange={v => onSortChange(v as typeof sortBy)}
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Results Info Bar
// ─────────────────────────────────────────────────────────────────────────────

interface ResultsInfoBarProps {
  totalCount: number;
  displayedCount: number;
  isLoading: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function ResultsInfoBar({
  totalCount,
  displayedCount,
  isLoading,
  hasActiveFilters,
  onClearFilters,
}: ResultsInfoBarProps) {
  return (
    <div className="text-muted-foreground flex items-center gap-2">
      <Beaker className="size-4" />
      <span>
        {totalCount > 0 ? (
          <>
            Showing {displayedCount} of {totalCount} items
          </>
        ) : isLoading ? (
          'Loading...'
        ) : (
          'No items found'
        )}
      </span>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Infinite Scroll Trigger
// ─────────────────────────────────────────────────────────────────────────────

interface InfiniteScrollTriggerProps {
  loadMoreRef: RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function InfiniteScrollTrigger({
  loadMoreRef,
  isFetchingNextPage,
  onLoadMore,
}: InfiniteScrollTriggerProps) {
  return (
    <div ref={loadMoreRef} className="flex justify-center py-8">
      {isFetchingNextPage ? (
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="size-5 animate-spin" />
          Loading more...
        </div>
      ) : (
        <Button variant="outline" onClick={onLoadMore}>
          Load More
        </Button>
      )}
    </div>
  );
}
