import { useCallback } from 'react';

import type {
  DomainCardLite,
  HomebrewDomainCard,
  LoadoutRules,
  LoadoutSelection,
} from '@/lib/schemas/loadout';

import { homebrewToLite } from './card-utils';
import {
  moveToActive,
  moveToVault,
  quickSwapToActive,
  quickSwapToVault,
  swapCards,
} from './loadout-card-operations';
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
  // Use extracted toggle handlers
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

  const handleMoveToVault = useCallback(
    (cardName: string) => {
      const result = moveToVault(cardName, activeCards, vaultCards, rules);
      if (!result) return;
      setActiveCards(result.activeCards);
      setVaultCards(result.vaultCards);
      notifyChange(result);
    },
    [
      activeCards,
      vaultCards,
      rules,
      setActiveCards,
      setVaultCards,
      notifyChange,
    ]
  );

  const handleMoveToActive = useCallback(
    (cardName: string) => {
      const result = moveToActive(cardName, activeCards, vaultCards, rules);
      if (!result) return;
      setVaultCards(result.vaultCards);
      setActiveCards(result.activeCards);
      notifyChange(result);
    },
    [
      activeCards,
      vaultCards,
      rules,
      setActiveCards,
      setVaultCards,
      notifyChange,
    ]
  );

  const handleSwapCards = useCallback(
    (activeCardName: string, vaultCardName: string) => {
      const result = swapCards(
        activeCardName,
        vaultCardName,
        activeCards,
        vaultCards
      );
      if (!result) return;
      setActiveCards(result.activeCards);
      setVaultCards(result.vaultCards);
      notifyChange(result);
    },
    [activeCards, vaultCards, setActiveCards, setVaultCards, notifyChange]
  );

  const handleQuickSwapToVault = useCallback(
    (activeCardName: string) => {
      const result = quickSwapToVault(
        activeCardName,
        activeCards,
        vaultCards,
        rules
      );
      if (!result) return;
      setActiveCards(result.activeCards);
      setVaultCards(result.vaultCards);
      notifyChange(result);
    },
    [
      activeCards,
      vaultCards,
      rules,
      setActiveCards,
      setVaultCards,
      notifyChange,
    ]
  );

  const handleQuickSwapToActive = useCallback(
    (vaultCardName: string) => {
      const result = quickSwapToActive(
        vaultCardName,
        activeCards,
        vaultCards,
        rules
      );
      if (!result) return;
      setVaultCards(result.vaultCards);
      setActiveCards(result.activeCards);
      notifyChange(result);
    },
    [
      activeCards,
      vaultCards,
      rules,
      setActiveCards,
      setVaultCards,
      notifyChange,
    ]
  );

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
    handleMoveToVault,
    handleMoveToActive,
    handleSwapCards,
    handleQuickSwapToVault,
    handleQuickSwapToActive,
    handleAddHomebrew,
    handleAddHomebrewToLoadout,
    handleAddHomebrewToVault,
  };
}
