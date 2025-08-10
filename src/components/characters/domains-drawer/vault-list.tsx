import { DomainCardItem } from '@/components/characters/domain-card-item';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { DomainCard } from '@/lib/schemas/domains';

type Props = {
  items: DomainCard[];
  afterOpen: boolean;
  inLoadout: (c: DomainCard) => boolean;
  disableAdd: boolean;
  onAdd: (card: DomainCard) => void;
  onRemoveFromLoadout: (card: DomainCard) => void;
  onRemoveFromVault: (card: DomainCard) => void;
};

export function VaultList({
  items,
  afterOpen,
  inLoadout,
  disableAdd,
  onAdd,
  onRemoveFromLoadout,
  onRemoveFromVault,
}: Props) {
  return (
    <FormItem>
      <FormLabel>Vault ({items.length})</FormLabel>
      <div className="divide-border rounded-md border">
        {!afterOpen ? (
          <div className="text-muted-foreground p-3 text-sm">Preparing…</div>
        ) : items.length === 0 ? (
          <div className="text-muted-foreground p-3 text-sm">
            No owned cards
          </div>
        ) : (
          items.map(card => (
            <div key={`vault:${card.name}`} className="cv-auto-120">
              <DomainCardItem
                card={card}
                context="vault"
                inLoadout={inLoadout(card)}
                disableAdd={disableAdd}
                onAddToLoadout={onAdd}
                onRemoveFromLoadout={onRemoveFromLoadout}
                onRemoveFromVault={onRemoveFromVault}
              />
            </div>
          ))
        )}
      </div>
      <FormMessage />
    </FormItem>
  );
}
