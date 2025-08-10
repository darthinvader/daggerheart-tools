import { DomainCardItem } from '@/components/characters/domain-card-item';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { DomainCard } from '@/lib/schemas/domains';

type Props = {
  items: DomainCard[];
  afterOpen: boolean;
  onRemove: (card: DomainCard) => void;
};

export function LoadoutList({ items, afterOpen, onRemove }: Props) {
  return (
    <FormItem>
      <FormLabel>Loadout ({items.length})</FormLabel>
      <div className="divide-border rounded-md border">
        {!afterOpen ? (
          <div className="text-muted-foreground p-3 text-sm">Preparing…</div>
        ) : items.length === 0 ? (
          <div className="text-muted-foreground p-3 text-sm">
            No active cards
          </div>
        ) : (
          items.map(card => (
            <div key={`loadout:${card.name}`} className="cv-auto-120">
              <DomainCardItem
                card={card}
                context="loadout"
                onRemoveFromLoadout={onRemove}
              />
            </div>
          ))
        )}
      </div>
      <FormMessage />
    </FormItem>
  );
}
