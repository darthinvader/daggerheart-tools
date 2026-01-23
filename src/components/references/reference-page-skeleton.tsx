import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ReferencePageSkeletonProps {
  /** Number of card skeletons to show */
  cardCount?: number;
  /** Show filter sidebar skeleton */
  showFilters?: boolean;
  /** Custom className for container */
  className?: string;
}

/**
 * Skeleton loading state for reference pages.
 * Matches the actual layout structure for seamless transitions.
 */
export function ReferencePageSkeleton({
  cardCount = 24,
  showFilters = true,
  className,
}: ReferencePageSkeletonProps) {
  return (
    <div className={cn('flex min-h-0 flex-1', className)}>
      {/* Filter sidebar skeleton - desktop only */}
      {showFilters && (
        <aside className="bg-muted/30 hidden w-64 shrink-0 flex-col border-r lg:flex">
          {/* Search skeleton */}
          <div className="shrink-0 border-b p-4">
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Filter groups */}
          <div className="min-h-0 flex-1 overflow-hidden p-4">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <div className="space-y-1.5 pl-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header skeleton */}
        <div className="bg-background shrink-0 border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Skeleton className="mb-2 h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>

        {/* Content area skeleton */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {/* Cards grid - responsive, fills available space */}
          <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: cardCount }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Individual card skeleton for grid items
 */
function CardSkeleton() {
  return (
    <div className="border-border bg-card animate-pulse rounded-lg border p-4">
      {/* Card header */}
      <div className="mb-3 flex items-start justify-between">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>

      {/* Card badges */}
      <div className="mb-3 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* Card content lines */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

/**
 * Table row skeleton for list view
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Compact skeleton for smaller loading states
 */
export function ReferenceGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
