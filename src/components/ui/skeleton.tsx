import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

/**
 * A skeleton placeholder for sheet/drawer content.
 * Shows while the actual content is being deferred/loaded.
 */
function SheetContentSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-4 p-4', className)}>
      {/* Title */}
      <Skeleton className="h-7 w-3/4" />
      {/* Subtitle/badge area */}
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
      {/* Description lines */}
      <div className="flex flex-col gap-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      {/* Content blocks */}
      <div className="flex flex-col gap-3 pt-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}

export { SheetContentSkeleton, Skeleton };
