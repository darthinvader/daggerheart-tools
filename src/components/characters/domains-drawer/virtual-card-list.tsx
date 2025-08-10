import * as React from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

import { DomainCardItem } from '@/components/characters/domain-card-item';
import type { DomainCard } from '@/lib/schemas/domains';
import { cn } from '@/lib/utils';

type Props = {
  items: DomainCard[];
  measure?: boolean;
  closing?: boolean;
  virtualOverscan?: number;
  inLoadout: (card: DomainCard) => boolean;
  disableAdd: boolean;
  addToLoadout: (card: DomainCard) => void;
  removeFromLoadout: (card: DomainCard) => void;
};

export function VirtualCardList({
  items,
  measure = true,
  closing = false,
  virtualOverscan = 3,
  inLoadout,
  disableAdd,
  addToLoadout,
  removeFromLoadout,
}: Props) {
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    enabled: !!measure && !closing,
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: virtualOverscan,
    useAnimationFrameWithResizeObserver: true,
    getItemKey: index =>
      `${items[index]?.domain ?? 'x'}:${items[index]?.name ?? index}`,
  });

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground p-3 text-sm">No cards found.</div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={cn(
        'max-h-[60dvh] overflow-y-auto',
        closing && 'pointer-events-none touch-none overflow-hidden'
      )}
      data-vaul-scrollable={closing ? undefined : true}
      aria-busy={closing || undefined}
    >
      <div
        style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}
      >
        {rowVirtualizer
          .getVirtualItems()
          .map((vRow: { index: number; start: number }) => {
            const card = items[vRow.index];
            return (
              <div
                key={`${card.domain}:${card.name}`}
                ref={
                  measure && !closing
                    ? rowVirtualizer.measureElement
                    : undefined
                }
                data-index={vRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${vRow.start}px)`,
                }}
              >
                <DomainCardItem
                  card={card}
                  context="available"
                  inLoadout={inLoadout(card)}
                  disableAdd={disableAdd}
                  onAddToLoadout={addToLoadout}
                  onRemoveFromLoadout={removeFromLoadout}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
