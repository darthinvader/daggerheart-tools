import { useCallback } from 'react';

import type {
  DomainCardLite,
  LoadoutRules,
  LoadoutSelection,
} from '@/lib/schemas/loadout';

import {
  moveToActive,
  moveToVault,
  quickSwapToActive,
  quickSwapToVault,
  swapCards,
} from './loadout-card-operations';

interface UseCardMovementHandlersProps {
  activeCards: DomainCardLite[];
  vaultCards: DomainCardLite[];
  rules: LoadoutRules;
  setActiveCards: (cards: DomainCardLite[]) => void;
  setVaultCards: (cards: DomainCardLite[]) => void;
  notifyChange: (updates: Partial<LoadoutSelection>) => void;
}

export function useCardMovementHandlers({
  activeCards,
  vaultCards,
  rules,
  setActiveCards,
  setVaultCards,
  notifyChange,
}: UseCardMovementHandlersProps) {
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

  return {
    handleMoveToVault,
    handleMoveToActive,
    handleSwapCards,
    handleQuickSwapToVault,
    handleQuickSwapToActive,
  };
}
