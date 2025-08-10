import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import type { DomainCard } from '@/lib/schemas/domains';

// Minimal form shape needed by this hook
type LoadoutFormValues = {
  loadout: DomainCard[];
  vault: DomainCard[];
};

export function useLoadoutLists(form: UseFormReturn<LoadoutFormValues>) {
  const watchedLoadout = form.watch('loadout');
  const currentLoadout = React.useMemo(
    () => (Array.isArray(watchedLoadout) ? watchedLoadout : []),
    [watchedLoadout]
  );

  const watchedVault = form.watch('vault');
  const currentVault = React.useMemo(
    () => (Array.isArray(watchedVault) ? watchedVault : []),
    [watchedVault]
  );

  const loadoutNames = React.useMemo(
    () => new Set(currentLoadout.map(c => c.name)),
    [currentLoadout]
  );

  const inLoadout = React.useCallback(
    (card: DomainCard) => loadoutNames.has(card.name),
    [loadoutNames]
  );

  const addToLoadout = React.useCallback(
    (card: DomainCard) => {
      if (loadoutNames.has(card.name)) return;
      const next = [...currentLoadout, card];
      form.setValue('loadout', next, { shouldValidate: true });
      if (!currentVault.some(c => c.name === card.name)) {
        form.setValue('vault', [...currentVault, card], {
          shouldValidate: false,
        });
      }
    },
    [currentLoadout, currentVault, form, loadoutNames]
  );

  const removeFromLoadout = React.useCallback(
    (card: DomainCard) => {
      const next = currentLoadout.filter(c => c.name !== card.name);
      form.setValue('loadout', next, { shouldValidate: true });
    },
    [currentLoadout, form]
  );

  const removeFromVault = React.useCallback(
    (card: DomainCard) => {
      form.setValue(
        'vault',
        currentVault.filter(c => c.name !== card.name),
        { shouldValidate: false }
      );
      form.setValue(
        'loadout',
        currentLoadout.filter(c => c.name !== card.name),
        { shouldValidate: true }
      );
    },
    [currentLoadout, currentVault, form]
  );

  return {
    currentLoadout,
    currentVault,
    inLoadout,
    addToLoadout,
    removeFromLoadout,
    removeFromVault,
  };
}
