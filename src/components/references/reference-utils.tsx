import { ArrowDown, ArrowUp, ArrowUpDown, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { TableHead } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  scrollRef: React.RefObject<HTMLElement | null>;
  threshold?: number;
}

/**
 * Floating "Back to Top" button that appears when user scrolls down
 */
export function BackToTop({ scrollRef, threshold = 300 }: BackToTopProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      setVisible(element.scrollTop > threshold);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [scrollRef, threshold]);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        'fixed right-6 bottom-6 z-40 shadow-lg transition-all duration-300',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      )}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ArrowUp className="size-4" />
    </Button>
  );
}

interface SortOption<T extends string = string> {
  value: T;
  label: string;
}

interface SortControlProps<T extends string = string> {
  options: SortOption<T>[];
  value: T;
  onChange: (value: T) => void;
  direction: 'asc' | 'desc';
  onDirectionChange: (direction: 'asc' | 'desc') => void;
}

/**
 * Sorting controls with direction toggle
 */
export function SortControl<T extends string = string>({
  options,
  value,
  onChange,
  direction,
  onDirectionChange,
}: SortControlProps<T>) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-muted-foreground hidden text-sm sm:inline">
        Sort:
      </span>
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className="bg-background h-8 rounded-md border px-2 text-sm"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDirectionChange(direction === 'asc' ? 'desc' : 'asc')}
        className="h-8 gap-1 px-2 text-xs"
        aria-label={`Sort ${direction === 'asc' ? 'descending' : 'ascending'}`}
      >
        {direction === 'asc' ? (
          <>
            <span className="hidden sm:inline">A→Z</span>
            <span className="sm:hidden">↑</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Z→A</span>
            <span className="sm:hidden">↓</span>
          </>
        )}
      </Button>
    </div>
  );
}

interface SortableTableHeadProps<T extends string> {
  column: T;
  label: string;
  currentSort: T;
  direction: 'asc' | 'desc';
  onSort: (column: T) => void;
  className?: string;
}

/**
 * Clickable table header for sorting. Shows sort direction indicator.
 */
export function SortableTableHead<T extends string>({
  column,
  label,
  currentSort,
  direction,
  onSort,
  className,
}: SortableTableHeadProps<T>) {
  const isActive = currentSort === column;

  return (
    <TableHead className={cn('cursor-pointer select-none', className)}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className="hover:text-foreground flex items-center gap-1 transition-colors"
      >
        {label}
        {isActive ? (
          direction === 'asc' ? (
            <ArrowUp className="size-3.5" />
          ) : (
            <ArrowDown className="size-3.5" />
          )
        ) : (
          <ArrowUpDown className="size-3.5 opacity-40" />
        )}
      </button>
    </TableHead>
  );
}

/**
 * Results counter with filter indicator
 * Includes accessibility attributes for screen readers
 */
export function ResultsCounter({
  filtered,
  total,
  label = 'items',
  suffix,
}: {
  filtered: number;
  total: number;
  label?: string;
  suffix?: string;
}) {
  const isFiltered = filtered !== total;
  const ariaLabel = isFiltered
    ? `Showing ${filtered} of ${total} ${label}${suffix ?? ''}`
    : `${total} ${label}${suffix ?? ''}`;

  return (
    <span
      className="text-muted-foreground text-sm"
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      {isFiltered ? (
        <>
          <span className="text-foreground font-medium">{filtered}</span> of{' '}
          {total} {label}
          {suffix}
        </>
      ) : (
        <>
          {total} {label}
          {suffix}
        </>
      )}
    </span>
  );
}

/**
 * Keyboard navigation hint for detail panels - only shows on desktop
 */
export function KeyboardHint({
  className,
  showNavigation = true,
}: {
  className?: string;
  showNavigation?: boolean;
}) {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <span
      className={cn(
        'text-muted-foreground flex items-center gap-1.5 text-xs',
        className
      )}
    >
      {showNavigation && (
        <>
          <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-[10px]">
            ←
          </kbd>
          <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-[10px]">
            →
          </kbd>
          <span>navigate</span>
        </>
      )}
      <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-[10px]">
        Esc
      </kbd>
      <span>close</span>
    </span>
  );
}

/**
 * Close button for detail panels with optional swipe hint on mobile
 */
export function DetailCloseButton({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('size-8', className)}
      onClick={onClose}
      aria-label="Close"
    >
      <X className="size-4" />
    </Button>
  );
}
