import { useEffect, useState } from 'react';

import {
  RarityBadge,
  TierBadge,
  WeightBadge,
} from '@/components/characters/inventory/badges';
import { CategoryInlineDetails } from '@/components/characters/inventory/category-inline-details';
import { CostChips } from '@/components/characters/inventory/cost-chips';
import { Button } from '@/components/ui/button';
import { VirtualList } from '@/components/ui/virtual-list';
import { useAppStore } from '@/features/store';
import type { InventorySlot, Item } from '@/lib/schemas/equipment';

export type InventoryListSlot = InventorySlot;

export function InventoryList({
  slots,
  isEquippedDerived,
  getEmoji,
  onDecQty,
  onIncQty,
  onSetQty,
  onCycleLocation,
  onToggleEquipped,
  onRemove,
  setRemoveIdx,
}: {
  slots: InventoryListSlot[];
  isEquippedDerived: (s: {
    isEquipped?: boolean;
    location?: unknown;
  }) => boolean;
  getEmoji: (s: unknown) => string;
  onDecQty?: (index: number) => void;
  onIncQty?: (index: number) => void;
  onSetQty?: (index: number, v: number) => void;
  onCycleLocation?: (index: number) => void;
  onToggleEquipped?: (index: number) => void;
  onRemove?: (index: number) => void;
  setRemoveIdx?: (index: number) => void;
}) {
  const showCount = useAppStore(s => s.inventoryShowCount);
  const [visible, setVisible] = useState(Math.max(showCount, 50));
  useEffect(() => setVisible(Math.max(showCount, 50)), [showCount]);
  const hasMore = slots.length > visible;

  if (!slots.length) {
    return <div className="text-muted-foreground text-sm">No items yet.</div>;
  }

  return (
    <div>
      <div className="text-muted-foreground mb-1 text-[11px] tracking-wide uppercase">
        Inventory Items
      </div>
      <VirtualList<InventoryListSlot>
        items={slots.slice(0, visible)}
        // Conservative row estimate; dynamic measure will correct after mount.
        estimateSize={() => 88}
        overscan={10}
        className="max-h-[45dvh] overflow-auto"
        ariaLabel="Inventory Items"
        getKey={(slot, i) => `${slot.item.name}-${i}`}
        renderRow={({ item: s, index: i }) => (
          <RowContent
            index={i}
            slot={s}
            getEmoji={getEmoji}
            isEquippedDerived={isEquippedDerived}
            onCycleLocation={onCycleLocation}
            onDecQty={onDecQty}
            onIncQty={onIncQty}
            onSetQty={onSetQty}
            onToggleEquipped={onToggleEquipped}
            onRemove={onRemove}
            setRemoveIdx={setRemoveIdx}
          />
        )}
      />
      {hasMore ? (
        <div className="flex justify-center py-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setVisible(v => v + showCount)}
          >
            Show more ({slots.length - visible} more)
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function RowContent({
  index: i,
  slot: s,
  getEmoji,
  isEquippedDerived,
  onCycleLocation,
  onDecQty,
  onIncQty,
  onSetQty,
  onToggleEquipped,
  onRemove,
  setRemoveIdx,
}: {
  index: number;
  slot: InventoryListSlot;
  getEmoji: (s: unknown) => string;
  isEquippedDerived: (s: {
    isEquipped?: boolean;
    location?: unknown;
  }) => boolean;
  onCycleLocation?: (index: number) => void;
  onDecQty?: (index: number) => void;
  onIncQty?: (index: number) => void;
  onSetQty?: (index: number, v: number) => void;
  onToggleEquipped?: (index: number) => void;
  onRemove?: (index: number) => void;
  setRemoveIdx?: (index: number) => void;
}) {
  const emoji = getEmoji(s.item as unknown as { category?: string });
  return (
    <div className="py-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <ItemMeta
          i={i}
          s={s}
          emoji={emoji}
          isEquippedDerived={isEquippedDerived}
          onCycleLocation={onCycleLocation}
        />
        <ItemControls
          i={i}
          s={s}
          isEquippedDerived={isEquippedDerived}
          onDecQty={onDecQty}
          onIncQty={onIncQty}
          onSetQty={onSetQty}
          onToggleEquipped={onToggleEquipped}
          onRemove={onRemove}
          setRemoveIdx={setRemoveIdx}
        />
      </div>
    </div>
  );
}

function ItemMeta({
  i,
  s,
  emoji,
  isEquippedDerived,
  onCycleLocation,
}: {
  i: number;
  s: InventoryListSlot;
  emoji: string;
  isEquippedDerived: (s: {
    isEquipped?: boolean;
    location?: unknown;
  }) => boolean;
  onCycleLocation?: (index: number) => void;
}) {
  return (
    <div className="order-2 min-w-0 flex-1 sm:order-1">
      <div className="text-sm font-semibold break-words">
        <span className="mr-1" aria-hidden>
          {emoji}
        </span>
        {s.item.name}
        {onCycleLocation ? (
          <button
            type="button"
            className="bg-muted text-muted-foreground ml-2 rounded px-1 py-0.5 text-[11px]"
            onClick={() => onCycleLocation(i)}
            aria-label="Cycle location"
            title="Click to change location"
          >
            {isEquippedDerived(s) ? 'equipped' : (s.location ?? 'backpack')}
          </button>
        ) : null}
        {s.quantity && s.quantity > 1 ? (
          <span className="ml-2 rounded bg-blue-100 px-1 py-0.5 text-[11px] text-blue-900 dark:bg-blue-500/20 dark:text-blue-200">
            x{s.quantity}
          </span>
        ) : null}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px]">
        <TierBadge label={`Tier ${String(s.item.tier)}`} />
        <RarityBadge label={String(s.item.rarity)} />
        <CostChips item={s.item as Item} />
        {s.item.weight ? <WeightBadge label={String(s.item.weight)} /> : null}
      </div>
      {s.item.description ? (
        <div className="text-foreground/90 mt-2 text-xs whitespace-pre-wrap">
          {s.item.description}
        </div>
      ) : null}
      {Array.isArray(s.item.features) && s.item.features.length ? (
        <div className="mt-1">
          <div className="flex flex-wrap gap-1">
            {s.item.features.map((f, j) => (
              <span
                key={j}
                className="bg-muted text-muted-foreground rounded px-1 py-0.5 text-[11px]"
              >
                {f.name}
              </span>
            ))}
          </div>
          <ul className="mt-1 list-disc pl-4 text-xs">
            {s.item.features.map((f, j) => (
              <li key={j}>
                <span className="font-medium">{f.name}:</span> {f.description}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <CategoryInlineDetails item={s.item} />
    </div>
  );
}

function ItemControls({
  i,
  s,
  isEquippedDerived,
  onDecQty,
  onIncQty,
  onSetQty,
  onToggleEquipped,
  onRemove,
  setRemoveIdx,
}: {
  i: number;
  s: InventoryListSlot;
  isEquippedDerived: (s: {
    isEquipped?: boolean;
    location?: unknown;
  }) => boolean;
  onDecQty?: (index: number) => void;
  onIncQty?: (index: number) => void;
  onSetQty?: (index: number, v: number) => void;
  onToggleEquipped?: (index: number) => void;
  onRemove?: (index: number) => void;
  setRemoveIdx?: (index: number) => void;
}) {
  return (
    <div className="order-1 flex items-center gap-1 sm:order-2">
      {onDecQty || setRemoveIdx ? (
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-6 w-6 text-xs"
          onClick={() => {
            if (onDecQty) onDecQty(i);
            else if (setRemoveIdx) setRemoveIdx(i);
          }}
          aria-label="Decrease quantity"
        >
          –
        </Button>
      ) : null}
      <input
        aria-label="Quantity"
        className="border-input bg-background h-6 w-10 rounded border px-1.5 text-center text-xs tabular-nums"
        inputMode="numeric"
        pattern="[0-9]*"
        value={s.quantity ?? 1}
        onChange={e => {
          const v = Math.max(
            0,
            Number(e.target.value.replace(/[^0-9]/g, '')) || 0
          );
          if (onSetQty) onSetQty(i, v);
          else if (v === 0 && setRemoveIdx) setRemoveIdx(i);
        }}
      />
      {onIncQty ? (
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-6 w-6 text-xs"
          onClick={() => onIncQty(i)}
          aria-label="Increase quantity"
        >
          +
        </Button>
      ) : null}
      {onToggleEquipped ? (
        <Button
          type="button"
          size="sm"
          variant={isEquippedDerived(s) ? 'default' : 'outline'}
          className="h-6 px-2 text-xs"
          onClick={() => onToggleEquipped(i)}
          aria-label="Toggle equipped"
          title="Toggle equipped"
        >
          {isEquippedDerived(s) ? 'Equipped' : 'Equip'}
        </Button>
      ) : null}
      {onRemove ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-xs"
          onClick={() => onRemove(i)}
          aria-label="Remove item"
          title="Remove item"
        >
          Remove
        </Button>
      ) : null}
    </div>
  );
}
