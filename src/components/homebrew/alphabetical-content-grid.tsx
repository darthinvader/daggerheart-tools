/**
 * Alphabetical Content Grid
 *
 * A grid layout for large content lists with:
 * - A-Z quick navigation
 * - Alphabetical grouping with letter headers
 * - "Show All" toggle to display all items
 * - Smooth scroll to letter sections
 */
import { Eye, EyeOff } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { AlphabetNav } from '../ui/alphabet-nav';
import {
  INITIAL_LIMIT,
  useAlphabeticalGridState,
} from './use-alphabetical-grid-state';

interface AlphabeticalContentGridProps<T> {
  /** All items to display */
  items: T[];
  /** Function to get the name of an item for sorting/grouping */
  getName: (item: T) => string;
  /** Function to get a unique key for an item */
  getKey: (item: T) => string;
  /** Render function for each item */
  renderItem: (item: T) => React.ReactNode;
  /** Optional className for the container */
  className?: string;
  /** Number of grid columns */
  columns?: {
    default: number;
    sm?: number;
    lg?: number;
  };
}

export function AlphabeticalContentGrid<T>({
  items,
  getName,
  getKey,
  renderItem,
  className,
  columns = { default: 1, sm: 2, lg: 3 },
}: AlphabeticalContentGridProps<T>) {
  // All state and data processing extracted to hook
  const {
    showAll,
    setShowAll,
    activeLetter,
    containerRef,
    setLetterRef,
    sortedItems,
    groupedItems,
    availableLetters,
    orderedLetters,
    totalCount,
    needsShowAll,
    scrollToLetter,
    displayLimit,
  } = useAlphabeticalGridState({ items, getName });

  // Build column classes
  const gridCols = cn(
    `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.lg && `lg:grid-cols-${columns.lg}`
  );

  if (items.length === 0) {
    return null;
  }

  // If not showing all, just show first N items without grouping
  if (!showAll) {
    const itemsToShow = sortedItems.slice(0, displayLimit);

    return (
      <div className={cn('space-y-4', className)} ref={containerRef}>
        <div
          className={cn('grid gap-2', gridCols)}
          style={{
            gridTemplateColumns: `repeat(${columns.lg ?? columns.sm ?? columns.default}, minmax(0, 1fr))`,
          }}
        >
          {itemsToShow.map(item => (
            <div key={getKey(item)}>{renderItem(item)}</div>
          ))}
        </div>

        {needsShowAll && (
          <div className="flex flex-col items-center gap-3 py-4">
            <p className="text-muted-foreground text-sm">
              Showing {Math.min(INITIAL_LIMIT, totalCount)} of {totalCount}{' '}
              items
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(true)}
              className="gap-2"
            >
              <Eye className="size-4" />
              Show All {totalCount} Items
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Show all with alphabetical grouping
  return (
    <div className={cn('space-y-4', className)} ref={containerRef}>
      {/* Alphabet Navigation */}
      <div className="bg-background/95 sticky top-0 z-10 py-2 backdrop-blur">
        <AlphabetNav
          availableLetters={availableLetters}
          activeLetter={activeLetter}
          onLetterClick={scrollToLetter}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {totalCount} items • Grouped A-Z
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(false)}
            className="gap-2"
          >
            <EyeOff className="size-4" />
            Collapse
          </Button>
        </div>
      </div>

      {/* Grouped Content */}
      <div className="space-y-6">
        {orderedLetters.map(letter => {
          const letterItems = groupedItems.get(letter) ?? [];
          if (letterItems.length === 0) return null;

          return (
            <div
              key={letter}
              ref={setLetterRef(letter)}
              data-letter={letter}
              className="scroll-mt-32"
            >
              {/* Letter Header */}
              <div className="bg-muted/50 mb-3 flex items-center gap-2 rounded-lg border px-3 py-2">
                <span className="text-primary text-xl font-bold">{letter}</span>
                <Badge variant="secondary">{letterItems.length}</Badge>
              </div>

              {/* Items Grid */}
              <div
                className={cn('grid gap-2', gridCols)}
                style={{
                  gridTemplateColumns: `repeat(${columns.lg ?? columns.sm ?? columns.default}, minmax(0, 1fr))`,
                }}
              >
                {letterItems.map(item => (
                  <div key={getKey(item)}>{renderItem(item)}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
