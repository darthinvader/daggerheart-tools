import * as React from 'react';

import { type VirtualItem, useVirtualizer } from '@tanstack/react-virtual';

export type VirtualListRenderArgs<T> = {
  item: T;
  index: number;
  virtual: VirtualItem;
  measureElement: (el: Element | null) => void;
};

export type VirtualListProps<T> = {
  items: T[];
  estimateSize?: (index: number) => number;
  overscan?: number;
  className?: string;
  getKey?: (item: T, index: number) => string | number;
  renderRow: (args: VirtualListRenderArgs<T>) => React.ReactNode;
  // Optional ARIA labeling
  ariaLabel?: string;
  /**
   * If true, renders a simple list without virtualization. Useful for debugging
   * or when virtualization misbehaves in nested scroll containers.
   */
  disabled?: boolean;
  /**
   * If item count is at or below this threshold, skip virtualization entirely.
   * Keeps simple lists simple and avoids overhead for short lists.
   */
  smallListThreshold?: number;
  /**
   * Optional props to spread onto the scroll container div (height, overflow, etc.).
   */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * Simple windowed list wrapper using @tanstack/react-virtual.
 * - Keeps ul/li semantics for accessibility.
 * - Supports dynamic heights via measureElement.
 */
type SimpleListProps<T> = {
  items: T[];
  estimateSize: (index: number) => number;
  getKey?: (item: T, index: number) => string | number;
  renderRow: (args: VirtualListRenderArgs<T>) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

function SimpleList<T>({
  items,
  estimateSize,
  getKey,
  renderRow,
  ariaLabel,
  className,
  containerProps,
}: SimpleListProps<T>) {
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  return (
    <div ref={parentRef} className={className} {...containerProps}>
      <ul
        aria-label={ariaLabel}
        className="divide-border m-0 list-none divide-y p-0"
      >
        {items.map((item, index) => {
          const key = getKey ? getKey(item, index) : index;
          // virtual is approximated for API compatibility when not virtualizing
          const virtualLike: VirtualItem = {
            index,
            key: String(key),
            size: estimateSize(index),
            start: index * estimateSize(index),
            end: (index + 1) * estimateSize(index),
            measureRef: () => {},
          } as unknown as VirtualItem;
          return (
            <li key={key}>
              {renderRow({
                item,
                index,
                virtual: virtualLike,
                measureElement: () => {},
              })}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type VirtualizedListProps<T> = {
  items: T[];
  estimateSize: (index: number) => number;
  overscan: number;
  getKey?: (item: T, index: number) => string | number;
  renderRow: (args: VirtualListRenderArgs<T>) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

function VirtualizedList<T>({
  items,
  estimateSize,
  overscan,
  getKey,
  renderRow,
  ariaLabel,
  className,
  containerProps,
}: VirtualizedListProps<T>) {
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const liRefs = React.useRef<Map<number, HTMLLIElement>>(new Map());
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan,
    // Using getBoundingClientRect enables more accurate dynamic row measurement when sizes vary.
    measureElement: el =>
      (el as HTMLElement)?.getBoundingClientRect?.().height ?? 0,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // Imperatively set container height and each row position to avoid JSX inline styles.
  React.useLayoutEffect(() => {
    const total = rowVirtualizer.getTotalSize();
    if (innerRef.current) {
      innerRef.current.style.height = `${total}px`;
      innerRef.current.style.position = 'relative';
    }

    for (const v of virtualItems) {
      const el = liRefs.current.get(v.index);
      if (el) {
        el.style.position = 'absolute';
        el.style.top = '0';
        el.style.left = '0';
        el.style.width = '100%';
        el.style.transform = `translateY(${v.start}px)`;
      }
    }
  }, [virtualItems, rowVirtualizer]);

  return (
    <div ref={parentRef} className={className} {...containerProps}>
      <div ref={innerRef}>
        <ul
          aria-label={ariaLabel}
          className="divide-border m-0 list-none divide-y p-0"
        >
          {virtualItems.map(virtual => {
            const index = virtual.index;
            const item = items[index];
            const key = getKey ? getKey(item, index) : index;
            return (
              <li
                key={key}
                // Combine measurement ref with our own element ref map.
                ref={el => {
                  if (el) {
                    liRefs.current.set(index, el);
                    rowVirtualizer.measureElement(el);
                  } else {
                    liRefs.current.delete(index);
                  }
                }}
              >
                {renderRow({
                  item,
                  index,
                  virtual,
                  measureElement: rowVirtualizer.measureElement,
                })}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function VirtualList<T>({
  items,
  estimateSize = () => 64,
  overscan = 10,
  className,
  getKey,
  renderRow,
  ariaLabel,
  disabled = false,
  smallListThreshold = 30,
  containerProps,
}: VirtualListProps<T>) {
  // Decide at the top level which implementation to render; hooks live in subcomponents only.
  const isBrowser = typeof window !== 'undefined';
  const shouldSkipVirtual =
    disabled || !isBrowser || items.length <= smallListThreshold;

  if (shouldSkipVirtual) {
    return (
      <SimpleList
        items={items}
        estimateSize={estimateSize}
        getKey={getKey}
        renderRow={renderRow}
        ariaLabel={ariaLabel}
        className={className}
        containerProps={containerProps}
      />
    );
  }

  return (
    <VirtualizedList
      items={items}
      estimateSize={estimateSize}
      overscan={overscan}
      getKey={getKey}
      renderRow={renderRow}
      ariaLabel={ariaLabel}
      className={className}
      containerProps={containerProps}
    />
  );
}
