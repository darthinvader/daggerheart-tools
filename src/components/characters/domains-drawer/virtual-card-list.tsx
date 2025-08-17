import { DomainCardItem } from '@/components/characters/domain-card-item';
import { VirtualList } from '@/components/ui/virtual-list';
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
  if (items.length === 0) {
    return (
      <div className="text-muted-foreground p-3 text-sm">No cards found.</div>
    );
  }

  const containerClass = cn(
    'max-h-[60dvh] overflow-y-auto',
    closing && 'pointer-events-none touch-none overflow-hidden'
  );

  return (
    <VirtualList<DomainCard>
      items={items}
      estimateSize={() => 120}
      overscan={virtualOverscan}
      // Disable virtualization while measuring is off or when drawer is closing
      disabled={!measure || closing}
      smallListThreshold={30}
      className={containerClass}
      containerProps={{ 'aria-busy': closing || undefined }}
      getKey={item => `${item.domain}:${item.name}`}
      renderRow={({ item, measureElement }) => (
        <DomainCardItem
          card={item}
          context="available"
          inLoadout={inLoadout(item)}
          disableAdd={disableAdd}
          onAddToLoadout={addToLoadout}
          onRemoveFromLoadout={removeFromLoadout}
          measureElement={measureElement}
        />
      )}
    />
  );
}
