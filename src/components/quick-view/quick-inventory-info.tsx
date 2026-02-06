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
    <div className="quick-inventory-qty">
      <Button
        variant="ghost"
        size="sm"
        className="quick-inventory-qty-btn"
        onClick={onDecrease}
        disabled={!canDecrease}
      >
        <Minus className="size-2.5 sm:size-3" />
      </Button>
      <span className="quick-inventory-qty-value">{quantity}</span>
      <Button
        variant="ghost"
        size="sm"
        className="quick-inventory-qty-btn"
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
      <div className={cn('quick-inventory-empty', className)}>
        <Backpack className="size-4" />
        <span className="text-muted-foreground text-sm">Inventory empty</span>
      </div>
    );
  }

  return (
    <div className={cn('quick-inventory-card', className)}>
      <div className="quick-inventory-list">
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
    <div className="quick-inventory-item">
      <div className="quick-inventory-item-header">
        <button
          type="button"
          onClick={() => hasFeatures && setExpanded(!expanded)}
          className={cn(
            'quick-inventory-item-name',
            hasFeatures && 'cursor-pointer hover:opacity-80'
          )}
          disabled={!hasFeatures}
        >
          {hasFeatures && (
            <span className="text-muted-foreground shrink-0">
              {expanded ? (
                <ChevronDown className="size-2.5 sm:size-3" />
              ) : (
                <ChevronRight className="size-2.5 sm:size-3" />
              )}
            </span>
          )}
          <span className="truncate">{entry.item.name}</span>
          {hasFeatures && !expanded && (
            <span className="text-muted-foreground text-[10px] sm:text-xs">
              ({entry.item.features!.length})
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
          <span className="quick-inventory-item-count">×{entry.quantity}</span>
        )}
      </div>
      {expanded && hasFeatures && (
        <div className="quick-inventory-item-features">
          {entry.item.features!.map((f, i) => (
            <div key={i} className="quick-inventory-feature">
              <span className="quick-inventory-feature-name">{f.name}</span>
              {f.description && (
                <p className="quick-inventory-feature-desc">{f.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
