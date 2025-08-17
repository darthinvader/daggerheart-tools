import type { UseFormReturn } from 'react-hook-form';

import { FormField } from '@/components/ui/form';
import type { DomainCard } from '@/lib/schemas/domains';

import type { DomainsFormValues } from '../domains-drawer';
import { LoadoutList } from './loadout-list';
import { VaultList } from './vault-list';

type Props = {
  form: UseFormReturn<DomainsFormValues>;
  afterOpen: boolean;
  currentLoadout: DomainCard[];
  currentVault: DomainCard[];
  inLoadout: (card: DomainCard) => boolean;
  disableAdd: boolean;
  addToLoadout: (card: DomainCard) => void;
  removeFromLoadout: (card: DomainCard) => void;
  removeFromVault: (card: DomainCard) => void;
};

/**
 * DomainsListsSection
 *
 * Presentational wrapper for the two side-by-side lists inside the Domains drawer:
 * - Current Loadout (left)
 * - Vault (right)
 *
 * Keeps RHF wiring via FormField for validation/dirty tracking parity.
 */
export function DomainsListsSection({
  form,
  afterOpen,
  currentLoadout,
  currentVault,
  inLoadout,
  disableAdd,
  addToLoadout,
  removeFromLoadout,
  removeFromVault,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField
        control={form.control as never}
        name="loadout"
        render={() => (
          <LoadoutList
            items={currentLoadout}
            afterOpen={afterOpen}
            inLoadout={inLoadout}
            disableAdd={disableAdd}
            addToLoadout={addToLoadout}
            onRemove={removeFromLoadout}
            removeFromVault={removeFromVault}
          />
        )}
      />
      <FormField
        control={form.control as never}
        name="vault"
        render={() => (
          <VaultList
            items={currentVault}
            afterOpen={afterOpen}
            inLoadout={inLoadout}
            disableAdd={disableAdd}
            onAdd={addToLoadout}
            onRemoveFromLoadout={removeFromLoadout}
            removeFromVault={removeFromVault}
          />
        )}
      />
    </div>
  );
}
