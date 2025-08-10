import { VirtualCardList } from '@/components/characters/domains-drawer/virtual-card-list';
import type { DomainCard } from '@/lib/schemas/domains';

export type AvailableCardsSectionProps = {
  title: string;
  visible: boolean;
  isLoading: boolean;
  items: DomainCard[];
  measure: boolean;
  closing: boolean;
  virtualOverscan: number;
  inLoadout: (card: DomainCard) => boolean;
  disableAdd: boolean;
  addToLoadout: (card: DomainCard) => void;
  removeFromLoadout: (card: DomainCard) => void;
};

export function AvailableCardsSection({
  title,
  visible,
  isLoading,
  items,
  measure,
  closing,
  virtualOverscan,
  inLoadout,
  disableAdd,
  addToLoadout,
  removeFromLoadout,
}: AvailableCardsSectionProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{title}</div>
      <div className="divide-border rounded-md border">
        {visible &&
          (isLoading ? (
            <div className="text-muted-foreground p-3 text-sm">
              Loading cards…
            </div>
          ) : measure ? (
            <VirtualCardList
              items={items}
              measure={measure}
              closing={closing}
              virtualOverscan={virtualOverscan}
              inLoadout={inLoadout}
              disableAdd={disableAdd}
              addToLoadout={addToLoadout}
              removeFromLoadout={removeFromLoadout}
            />
          ) : (
            <div className="text-muted-foreground p-3 text-sm">Preparing…</div>
          ))}
      </div>
    </div>
  );
}
