// React import not required with automatic JSX runtime
import type { InventorySlot } from '@/lib/schemas/equipment';

import { SlotRowDetails } from './presenters/SlotRowDetails';
import { SlotRowHeader } from './presenters/SlotRowHeader';

type Props = {
  slot: InventorySlot;
  index: number;
  expanded: boolean;
  onToggleExpanded: (index: number) => void;
  onIncQty: (index: number, delta: number) => void;
  onToggleEquipped: (index: number, checked: boolean) => void;
  onChangeLocation: (index: number, loc: InventorySlot['location']) => void;
  onRemove: (index: number) => void;
};

export function SlotRow({
  slot: s,
  index: idx,
  expanded,
  onToggleExpanded,
  onIncQty,
  onToggleEquipped,
  onChangeLocation,
  onRemove,
}: Props) {
  return (
    <div className="border-muted rounded border">
      <button
        type="button"
        className="hover:bg-muted/50 flex w-full items-center justify-between p-2 text-left"
        onClick={() => onToggleExpanded(idx)}
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{s.item.name}</div>
          <div className="text-muted-foreground text-xs">
            {s.item.rarity} • Tier {s.item.tier}
          </div>
        </div>
        <div className="text-muted-foreground text-xs">Details</div>
      </button>
      <SlotRowHeader
        s={s}
        idx={idx}
        onIncQty={onIncQty}
        onToggleEquipped={onToggleEquipped}
        onChangeLocation={onChangeLocation}
        onRemove={onRemove}
      />
      {expanded ? (
        <div className="border-t p-2 text-xs">
          {/* Core meta */}
          <div className="mb-1 flex flex-wrap gap-x-3 gap-y-1">
            <span className="text-muted-foreground">🎖️ {s.item.rarity}</span>
            <span className="text-blue-600 dark:text-blue-400">
              ⛰️ Tier {s.item.tier}
            </span>
            {s.item.cost != null ? (
              <span className="text-amber-700 dark:text-amber-300">
                💰 {s.item.cost}
              </span>
            ) : null}
            {s.item.weight ? (
              <span className="text-emerald-700 dark:text-emerald-300">
                🏋️ {String(s.item.weight)}
              </span>
            ) : null}
          </div>
          {s.item.description ? (
            <div className="text-foreground/90 mb-2">{s.item.description}</div>
          ) : null}
          {/* Category specific */}
          <SlotRowDetails s={s} />
          {/* Features */}
          {(() => {
            const feat = (
              s.item as
                | { features?: Array<{ name: string; description: string }> }
                | undefined
            )?.features;
            return Array.isArray(feat) && feat.length > 0;
          })() ? (
            <div className="space-y-1">
              <div className="font-medium">📒 Features</div>
              <ul className="list-disc pl-4">
                {(
                  s.item as {
                    features: Array<{ name: string; description: string }>;
                  }
                ).features.map((f, i) => (
                  <li key={i}>
                    <span className="font-medium">{f.name}:</span>{' '}
                    {f.description}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
