import { Package, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReferenceEmptyStateProps {
  /** The type of items being filtered (e.g., "equipment", "adversaries") */
  itemType: string;
  /** Callback when "Clear all filters" button is clicked */
  onClearFilters: () => void;
  /** Optional helpful tip specific to the item type */
  tip?: string;
  /** Optional icon to display (defaults to Package) */
  icon?: 'package' | 'search';
  /** Optional additional class names */
  className?: string;
}

/**
 * Shared empty state component for reference pages.
 * Displays a contextual message when no items match the current filters.
 */
export function ReferenceEmptyState({
  itemType,
  onClearFilters,
  tip,
  icon = 'package',
  className,
}: ReferenceEmptyStateProps) {
  const IconComponent = icon === 'search' ? Search : Package;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="bg-muted/50 mb-4 rounded-full p-4">
        <IconComponent className="text-muted-foreground size-8" />
      </div>
      <h3 className="text-foreground mb-2 text-lg font-semibold">
        No {itemType} found
      </h3>
      <p className="text-muted-foreground mb-1 max-w-sm text-sm">
        No {itemType} matches your current filters.
      </p>
      {tip && (
        <p className="text-muted-foreground/80 mb-4 max-w-sm text-xs italic">
          Tip: {tip}
        </p>
      )}
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="mt-2"
        size="sm"
      >
        Clear all filters
      </Button>
    </div>
  );
}
