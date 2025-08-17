import { DomainSimpleList } from '@/components/characters/domains-drawer/DomainSimpleList';
import type { DomainCard } from '@/lib/schemas/domains';

export type AvailableCardsSectionProps = {
  title: string;
  visible: boolean;
  isLoading: boolean;
  items: DomainCard[];
  measure: boolean; // kept for API parity but unused
  closing: boolean; // kept for API parity but unused
  virtualOverscan: number; // kept for API parity but unused
  inLoadout: (card: DomainCard) => boolean;
  isSelected?: (card: DomainCard) => boolean;
  disableAdd: boolean;
  addToLoadout: (card: DomainCard) => void;
  removeFromLoadout: (card: DomainCard) => void;
};

export function AvailableCardsSection({
  title,
  visible,
  isLoading,
  items,
  // measure,
  // closing,
  // virtualOverscan,
  inLoadout,
  isSelected,
  disableAdd,
  addToLoadout,
  removeFromLoadout,
}: AvailableCardsSectionProps) {
  // Treat an item as "selected" if it's in loadout OR in the vault to avoid duplicate selection cues
  // We'll get vault membership from the parent via a closure passed into inLoadout when needed.
  return (
    <div className="space-y-2">
      {/* Keep a single search in the Tabs filter bar; add a local title under it */}
      <div className="text-sm font-medium">{title}</div>
      {visible &&
        (isLoading ? (
          <div className="text-muted-foreground p-3 text-sm">
            Loading cards…
          </div>
        ) : (
          <DomainSimpleList
            items={items}
            inLoadout={inLoadout}
            // Use parent-provided selection when available; Available should show selected if in loadout or vault.
            isSelected={isSelected ?? inLoadout}
            disableAdd={disableAdd}
            addToLoadout={addToLoadout}
            removeFromLoadout={removeFromLoadout}
            // Hide the internal search to avoid duplicate search inputs
            showSearch={false}
          />
        ))}
    </div>
  );
}
