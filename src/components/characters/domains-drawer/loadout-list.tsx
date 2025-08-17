import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { FormItem, FormMessage } from '@/components/ui/form';
import type { DomainCard } from '@/lib/schemas/domains';

import { DomainSimpleList } from './DomainSimpleList';

type Props = {
  items: DomainCard[];
  afterOpen: boolean;
  inLoadout: (c: DomainCard) => boolean;
  disableAdd: boolean;
  addToLoadout: (card: DomainCard) => void;
  onRemove: (card: DomainCard) => void;
  removeFromVault: (card: DomainCard) => void;
};

export function LoadoutList({
  items,
  afterOpen,
  inLoadout,
  disableAdd,
  addToLoadout,
  onRemove,
  removeFromVault,
}: Props) {
  return (
    <FormItem>
      <Collapsible defaultOpen>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger
            className="text-sm font-medium hover:underline"
            aria-label="Toggle Loadout list"
          >
            Loadout ({items.length})
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent asChild>
          <div className="mt-2">
            {!afterOpen ? (
              <div className="text-muted-foreground rounded-md border p-3 text-sm">
                Preparing…
              </div>
            ) : items.length === 0 ? (
              <div className="text-muted-foreground rounded-md border p-3 text-sm">
                No active cards
              </div>
            ) : (
              <DomainSimpleList
                items={items}
                inLoadout={inLoadout}
                disableAdd={disableAdd}
                addToLoadout={addToLoadout}
                removeFromLoadout={onRemove}
                onRemoveCompletely={removeFromVault}
              />
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <FormMessage />
    </FormItem>
  );
}
