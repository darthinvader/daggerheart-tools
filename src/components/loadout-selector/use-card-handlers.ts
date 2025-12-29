import { useCallback } from 'react';

import type {
  DomainCardLite,
  HomebrewDomainCard,
  LoadoutRules,
  LoadoutSelection,
} from '@/lib/schemas/loadout';

import { homebrewToLite } from './card-utils';
import { useCardMovementHandlers } from './use-card-movement-handlers';
import { useCardToggleHandlers } from './use-card-toggle-handlers';

interface UseCardHandlersProps {
  activeCards: DomainCardLite[];
  vaultCards: DomainCardLite[];
  homebrewCards: HomebrewDomainCard[];
  activeCardNames: Set<string>;
  vaultCardNames: Set<string>;
  rules: LoadoutRules;
  setActiveCards: (cards: DomainCardLite[]) => void;
  setVaultCards: (cards: DomainCardLite[]) => void;
  setHomebrewCards: (cards: HomebrewDomainCard[]) => void;
  notifyChange: (updates: Partial<LoadoutSelection>) => void;
}

export function useCardHandlers({
  activeCards,
  vaultCards,
  homebrewCards,
  activeCardNames,
  vaultCardNames,
  rules,
  setActiveCards,
  setVaultCards,
  setHomebrewCards,
  notifyChange,
}: UseCardHandlersProps) {
  const toggleHandlers = useCardToggleHandlers({
    activeCards,
    vaultCards,
    activeCardNames,
    vaultCardNames,
    rules,
    setActiveCards,
    setVaultCards,
    notifyChange,
  });

  const movementHandlers = useCardMovementHandlers({
    activeCards,
    vaultCards,
    rules,
    setActiveCards,
    setVaultCards,
    notifyChange,
  });

  const handleAddHomebrew = useCallback(
    (card: HomebrewDomainCard) => {
      const newHomebrew = [...homebrewCards, card];
      setHomebrewCards(newHomebrew);
      notifyChange({ homebrewCards: newHomebrew });
    },
    [homebrewCards, setHomebrewCards, notifyChange]
  );

  const handleAddHomebrewToLoadout = useCallback(
    (card: HomebrewDomainCard) => {
      if (activeCards.length >= rules.maxActiveCards) return;
      const newActive = [...activeCards, homebrewToLite(card)];
      setActiveCards(newActive);
      notifyChange({ activeCards: newActive });
    },
    [activeCards, rules.maxActiveCards, setActiveCards, notifyChange]
  );

  const handleAddHomebrewToVault = useCallback(
    (card: HomebrewDomainCard) => {
      if (
        rules.maxVaultCards !== undefined &&
        vaultCards.length >= rules.maxVaultCards
      )
        return;
      const newVault = [...vaultCards, homebrewToLite(card)];
      setVaultCards(newVault);
      notifyChange({ vaultCards: newVault });
    },
    [vaultCards, rules.maxVaultCards, setVaultCards, notifyChange]
  );

  return {
    ...toggleHandlers,
    ...movementHandlers,
    handleAddHomebrew,
    handleAddHomebrewToLoadout,
    handleAddHomebrewToVault,
  };
}
