import { useCallback, useState } from 'react';

import type {
  DomainCardLite,
  HomebrewDomainCard,
  LoadoutRules,
  LoadoutSelection,
} from '@/lib/schemas/loadout';

import { homebrewToLite } from './card-utils';

interface UseHomebrewCardsProps {
  initialHomebrewCards: HomebrewDomainCard[];
  activeCards: DomainCardLite[];
  vaultCards: DomainCardLite[];
  rules: LoadoutRules;
  onNotifyChange: (updates: Partial<LoadoutSelection>) => void;
  onSetActiveCards: (cards: DomainCardLite[]) => void;
  onSetVaultCards: (cards: DomainCardLite[]) => void;
}

/**
 * Hook to manage homebrew card creation and addition
 */
export function useHomebrewCards({
  initialHomebrewCards,
  activeCards,
  vaultCards,
  rules,
  onNotifyChange,
  onSetActiveCards,
  onSetVaultCards,
}: UseHomebrewCardsProps) {
  const [homebrewCards, setHomebrewCards] =
    useState<HomebrewDomainCard[]>(initialHomebrewCards);

  const handleAddHomebrew = useCallback(
    (card: HomebrewDomainCard) => {
      const newHomebrew = [...homebrewCards, card];
      setHomebrewCards(newHomebrew);
      onNotifyChange({ homebrewCards: newHomebrew });
    },
    [homebrewCards, onNotifyChange]
  );

  const handleAddHomebrewToLoadout = useCallback(
    (card: HomebrewDomainCard) => {
      if (activeCards.length >= rules.maxActiveCards) return;
      const newActive = [...activeCards, homebrewToLite(card)];
      onSetActiveCards(newActive);
      onNotifyChange({ activeCards: newActive });
    },
    [activeCards, rules.maxActiveCards, onNotifyChange, onSetActiveCards]
  );

  const handleAddHomebrewToVault = useCallback(
    (card: HomebrewDomainCard) => {
      if (
        rules.maxVaultCards !== undefined &&
        vaultCards.length >= rules.maxVaultCards
      )
        return;
      const newVault = [...vaultCards, homebrewToLite(card)];
      onSetVaultCards(newVault);
      onNotifyChange({ vaultCards: newVault });
    },
    [vaultCards, rules.maxVaultCards, onNotifyChange, onSetVaultCards]
  );

  return {
    homebrewCards,
    handleAddHomebrew,
    handleAddHomebrewToLoadout,
    handleAddHomebrewToVault,
  };
}
