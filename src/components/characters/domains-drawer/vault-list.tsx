import * as React from 'react';

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
  onAdd: (card: DomainCard) => void;
  onRemoveFromLoadout: (card: DomainCard) => void;
  removeFromVault: (card: DomainCard) => void;
};

export function VaultList({
  items,
  afterOpen,
  inLoadout,
  disableAdd,
  onAdd,
  onRemoveFromLoadout,
  removeFromVault,
}: Props) {
  const visibleItems = React.useMemo(
    () => items.filter(card => !inLoadout(card)),
    [items, inLoadout]
  );
  return (
    <FormItem>
      <Collapsible defaultOpen>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger
            className="text-sm font-medium hover:underline"
            aria-label="Toggle Vault list"
          >
            Vault ({visibleItems.length})
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent asChild>
          <div className="mt-2">
            {!afterOpen ? (
              <div className="text-muted-foreground rounded-md border p-3 text-sm">
                Preparing…
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="text-muted-foreground rounded-md border p-3 text-sm">
                No owned cards
              </div>
            ) : (
              <DomainSimpleList
                items={visibleItems}
                inLoadout={inLoadout}
                disableAdd={disableAdd}
                addToLoadout={onAdd}
                removeFromLoadout={onRemoveFromLoadout}
                onRemoveCompletely={removeFromVault}
                detailsVisibility="always"
              />
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <FormMessage />
    </FormItem>
  );
}
