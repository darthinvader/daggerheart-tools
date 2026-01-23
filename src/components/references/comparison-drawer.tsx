import { GitCompare, Minus, Plus, X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

export interface ComparisonItem<T = unknown> {
  id: string;
  name: string;
  /** Full item data for rendering detailed comparison */
  data: T;
}

interface CompareContextValue {
  compareItems: ComparisonItem[];
  addToCompare: (item: ComparisonItem) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  maxItems: number;
}

const CompareContext = React.createContext<CompareContextValue | null>(null);

/**
 * Hook to access compare functionality
 */
export function useCompare(): CompareContextValue {
  const ctx = React.useContext(CompareContext);
  if (!ctx) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return ctx;
}

interface CompareProviderProps {
  children: React.ReactNode;
  maxItems?: number;
}

/**
 * Provider for comparison state
 */
export function CompareProvider({
  children,
  maxItems = 4,
}: CompareProviderProps) {
  const [compareItems, setCompareItems] = React.useState<ComparisonItem[]>([]);

  const addToCompare = React.useCallback(
    (item: ComparisonItem) => {
      setCompareItems(prev => {
        if (prev.length >= maxItems) return prev;
        if (prev.some(i => i.id === item.id)) return prev;
        return [...prev, item];
      });
    },
    [maxItems]
  );

  const removeFromCompare = React.useCallback((id: string) => {
    setCompareItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCompare = React.useCallback(() => {
    setCompareItems([]);
  }, []);

  const isInCompare = React.useCallback(
    (id: string) => {
      return compareItems.some(i => i.id === id);
    },
    [compareItems]
  );

  const value: CompareContextValue = React.useMemo(
    () => ({
      compareItems,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      maxItems,
    }),
    [
      compareItems,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      maxItems,
    ]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

interface CompareToggleButtonProps {
  item: ComparisonItem;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

/**
 * Button to add/remove an item from comparison
 */
export function CompareToggleButton({
  item,
  className,
  size = 'sm',
}: CompareToggleButtonProps) {
  const {
    isInCompare,
    addToCompare,
    removeFromCompare,
    compareItems,
    maxItems,
  } = useCompare();
  const inCompare = isInCompare(item.id);
  const isFull = compareItems.length >= maxItems && !inCompare;

  return (
    <Button
      variant={inCompare ? 'default' : 'outline'}
      size={size}
      className={cn('h-7 gap-1 text-xs', className)}
      onClick={e => {
        e.stopPropagation();
        if (inCompare) {
          removeFromCompare(item.id);
        } else {
          addToCompare(item);
        }
      }}
      disabled={isFull}
      title={
        isFull
          ? `Max ${maxItems} items`
          : inCompare
            ? 'Remove from compare'
            : 'Add to compare'
      }
    >
      {inCompare ? (
        <>
          <Minus className="size-3" />
          <span className="hidden sm:inline">Remove</span>
        </>
      ) : (
        <>
          <Plus className="size-3" />
          <span className="hidden sm:inline">Compare</span>
        </>
      )}
    </Button>
  );
}

interface CompareDrawerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderComparison?: (items: ComparisonItem<any>[]) => React.ReactNode;
  title?: string;
}

/**
 * Drawer that shows when items are selected for comparison
 */
export function CompareDrawer({
  renderComparison,
  title = 'Compare Items',
}: CompareDrawerProps) {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) return null;

  // Default comparison view: simple list of items
  const defaultRenderComparison = (items: ComparisonItem[]) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(item => (
        <div key={item.id} className="bg-muted/30 rounded-lg border p-4">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{item.id}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="gap-2 rounded-full px-6 shadow-lg">
            <GitCompare className="size-4" />
            Compare ({compareItems.length})
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex max-h-[85vh] flex-col">
          <DrawerHeader className="shrink-0 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription>
                  Comparing {compareItems.length} items
                </DrawerDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearCompare}>
                  Clear all
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="size-4" />
                  </Button>
                </DrawerClose>
              </div>
            </div>
            {/* Selected items pills */}
            <div className="mt-2 flex flex-wrap gap-2">
              {compareItems.map(item => (
                <Badge key={item.id} variant="secondary" className="gap-1 pr-1">
                  {item.name}
                  <button
                    onClick={() => removeFromCompare(item.id)}
                    className="hover:bg-muted ml-1 rounded-full p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </DrawerHeader>
          {/* Mobile-friendly scrollable content */}
          <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain p-4">
            {(renderComparison ?? defaultRenderComparison)(compareItems)}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

interface ComparisonTableProps {
  headers: string[];
  rows: {
    label: string;
    values: React.ReactNode[];
    highlight?: boolean;
  }[];
}

/**
 * Table layout for comparing items side by side
 */
export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-muted-foreground bg-background sticky left-0 p-2 text-left font-medium">
              Property
            </th>
            {headers.map((header, i) => (
              <th key={i} className="min-w-36 p-2 text-left font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={cn('border-b', row.highlight && 'bg-muted/50')}
            >
              <td className="text-muted-foreground bg-background sticky left-0 p-2 font-medium">
                {row.label}
              </td>
              {row.values.map((value, j) => (
                <td key={j} className="p-2">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
