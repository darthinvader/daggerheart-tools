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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  AlphabetNav,
  getAvailableLetters,
  groupByLetter,
} from '../ui/alphabet-nav';

const INITIAL_LIMIT = 50;

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
  const [showAll, setShowAll] = useState(false);
  const [activeLetter, setActiveLetter] = useState<string | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Sort items alphabetically by name
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => getName(a).localeCompare(getName(b))),
    [items, getName]
  );

  // Group items by first letter
  const groupedItems = useMemo(
    () => groupByLetter(sortedItems, getName),
    [sortedItems, getName]
  );

  // Get available letters
  const availableLetters = useMemo(
    () => getAvailableLetters(sortedItems, getName),
    [sortedItems, getName]
  );

  // Get ordered letters that have items
  const orderedLetters = useMemo(() => {
    const letters = Array.from(availableLetters).sort();
    // Move '#' to the end if present
    const hashIndex = letters.indexOf('#');
    if (hashIndex !== -1) {
      letters.splice(hashIndex, 1);
      letters.push('#');
    }
    return letters;
  }, [availableLetters]);

  // Determine what to show based on showAll toggle
  const displayLimit = showAll ? Infinity : INITIAL_LIMIT;
  const totalCount = items.length;
  const needsShowAll = totalCount > INITIAL_LIMIT;

  // Scroll to a letter section
  const scrollToLetter = useCallback((letter: string) => {
    const element = letterRefs.current.get(letter);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveLetter(letter);
    }
  }, []);

  // Track active letter on scroll
  useEffect(() => {
    if (!showAll) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const letter = entry.target.getAttribute('data-letter');
            if (letter) {
              setActiveLetter(letter);
              break;
            }
          }
        }
      },
      { rootMargin: '-100px 0px -80% 0px', threshold: 0 }
    );

    letterRefs.current.forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [showAll]);

  // Register letter ref
  const setLetterRef = useCallback(
    (letter: string) => (el: HTMLDivElement | null) => {
      if (el) {
        letterRefs.current.set(letter, el);
      } else {
        letterRefs.current.delete(letter);
      }
    },
    []
  );

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
