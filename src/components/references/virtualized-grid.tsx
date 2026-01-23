import { useVirtualizer } from '@tanstack/react-virtual';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey: (item: T, index: number) => string;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  estimateSize?: number;
  gap?: number;
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Get current column count based on viewport width and breakpoints
 */
function useColumnCount(columns: VirtualizedGridProps<unknown>['columns']) {
  const [count, setCount] = React.useState(columns?.default ?? 1);

  React.useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      if (columns?.xl && width >= 1280) {
        setCount(columns.xl);
      } else if (columns?.lg && width >= 1024) {
        setCount(columns.lg);
      } else if (columns?.md && width >= 768) {
        setCount(columns.md);
      } else if (columns?.sm && width >= 640) {
        setCount(columns.sm);
      } else {
        setCount(columns?.default ?? 1);
      }
    };

    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, [columns]);

  return count;
}

/**
 * Virtualized grid component for rendering large lists efficiently.
 * Automatically adjusts column count based on viewport width.
 */
export function VirtualizedGrid<T>({
  items,
  renderItem,
  getItemKey,
  columns = { default: 1, sm: 2, lg: 3, xl: 4 },
  estimateSize = 200,
  gap = 12,
  className,
  containerRef,
}: VirtualizedGridProps<T>) {
  const columnCount = useColumnCount(columns);

  // Split items into rows based on column count
  const rows = React.useMemo(() => {
    const result: T[][] = [];
    for (let i = 0; i < items.length; i += columnCount) {
      result.push(items.slice(i, i + columnCount));
    }
    return result;
  }, [items, columnCount]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => estimateSize,
    overscan: 3,
  });

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <div
      className={cn('relative w-full', className)}
      style={{ height: `${virtualizer.getTotalSize()}px` }}
    >
      {virtualRows.map(virtualRow => {
        const row = rows[virtualRow.index];
        return (
          <div
            key={virtualRow.key}
            className="absolute right-0 left-0"
            style={{
              top: `${virtualRow.start}px`,
              height: `${virtualRow.size}px`,
            }}
          >
            <div
              className="grid h-full"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                gap: `${gap}px`,
              }}
            >
              {row.map((item, colIndex) => {
                const itemIndex = virtualRow.index * columnCount + colIndex;
                return (
                  <div key={getItemKey(item, itemIndex)}>
                    {renderItem(item, itemIndex)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey: (item: T, index: number) => string;
  estimateSize?: number;
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Virtualized list component for rendering large lists efficiently.
 * Use this for single-column layouts like tables.
 */
export function VirtualizedList<T>({
  items,
  renderItem,
  getItemKey,
  estimateSize = 48,
  className,
  containerRef,
}: VirtualizedListProps<T>) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => estimateSize,
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      className={cn('relative w-full', className)}
      style={{ height: `${virtualizer.getTotalSize()}px` }}
    >
      {virtualItems.map(virtualItem => {
        const item = items[virtualItem.index];
        return (
          <div
            key={getItemKey(item, virtualItem.index)}
            className="absolute right-0 left-0"
            style={{
              top: `${virtualItem.start}px`,
              height: `${virtualItem.size}px`,
            }}
          >
            {renderItem(item, virtualItem.index)}
          </div>
        );
      })}
    </div>
  );
}
