import { ChevronDown, ChevronRight, Minus, Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Backpack } from '@/lib/icons';
import type { InventoryState } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

interface QuickInventoryInfoProps {
  inventory: InventoryState;
  onChange?: (inventory: InventoryState) => void;
  className?: string;
}

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  canDecrease: boolean;
}

function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  canDecrease,
}: QuantityControlProps) {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 sm:h-6 sm:w-6"
        onClick={onDecrease}
        disabled={!canDecrease}
      >
        <Minus className="size-2.5 sm:size-3" />
      </Button>
      <span className="w-4 text-center text-xs font-medium sm:w-5 sm:text-sm">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 sm:h-6 sm:w-6"
        onClick={onIncrease}
      >
        <Plus className="size-2.5 sm:size-3" />
      </Button>
    </div>
  );
}

export function QuickInventoryInfo({
  inventory,
  onChange,
  className,
}: QuickInventoryInfoProps) {
  const items = useMemo(() => inventory?.items ?? [], [inventory?.items]);

  const handleQuantityChange = useCallback(
    (itemId: string, delta: number) => {
      if (!onChange) return;
      const updatedItems = items.map(entry => {
        if (entry.id === itemId) {
          const newQuantity = Math.max(0, entry.quantity + delta);
          return { ...entry, quantity: newQuantity };
        }
        return entry;
      });
      // Remove items with 0 quantity
      const filteredItems = updatedItems.filter(e => e.quantity > 0);
      onChange({ ...inventory, items: filteredItems });
    },
    [inventory, items, onChange]
  );

  if (items.length === 0) {
    return (
      <div className={cn('bg-card rounded-lg border p-3', className)}>
        <div className="flex items-center gap-2">
          <Backpack className="size-5" />
          <span className="text-muted-foreground">Inventory empty</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-card rounded-lg border p-2 sm:p-3', className)}>
      <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
        <Backpack className="size-4 sm:size-5" />
        <span className="text-sm font-semibold sm:text-base">Inventory</span>
        <span className="text-muted-foreground text-[10px] sm:text-xs">
          ({items.length} items)
        </span>
      </div>
      <div className="space-y-1">
        {items.map(entry => (
          <InventoryItemRow
            key={entry.id}
            entry={entry}
            onChange={onChange}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </div>
    </div>
  );
}

interface InventoryItemRowProps {
  entry: InventoryState['items'][number];
  onChange?: (inventory: InventoryState) => void;
  onQuantityChange: (itemId: string, delta: number) => void;
}

function InventoryItemRow({
  entry,
  onChange,
  onQuantityChange,
}: InventoryItemRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasFeatures = entry.item.features && entry.item.features.length > 0;

  return (
    <div className="rounded border px-1.5 py-1 sm:px-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => hasFeatures && setExpanded(!expanded)}
          className={cn(
            'flex min-w-0 flex-1 items-center gap-0.5 text-left sm:gap-1',
            hasFeatures && 'cursor-pointer hover:opacity-80'
          )}
          disabled={!hasFeatures}
        >
          {hasFeatures && (
            <span className="text-muted-foreground shrink-0">
              {expanded ? (
                <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              ) : (
                <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              )}
            </span>
          )}
          <span className="truncate text-xs font-medium sm:text-sm">
            {entry.item.name}
          </span>
          {hasFeatures && !expanded && (
            <span className="text-muted-foreground ml-0.5 text-[10px] sm:ml-1 sm:text-xs">
              ({entry.item.features!.length} features)
            </span>
          )}
        </button>
        {onChange ? (
          <QuantityControl
            quantity={entry.quantity}
            onIncrease={() => onQuantityChange(entry.id, 1)}
            onDecrease={() => onQuantityChange(entry.id, -1)}
            canDecrease={entry.quantity > 0}
          />
        ) : (
          <span className="text-muted-foreground shrink-0 text-sm">
            ×{entry.quantity}
          </span>
        )}
      </div>
      {expanded && hasFeatures && (
        <div className="mt-2 ml-4 space-y-2">
          {entry.item.features!.map((f, i) => (
            <div key={i} className="text-sm">
              <span className="font-medium">{f.name}</span>
              {f.description && (
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {f.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
