import { useCallback } from 'react';

import type { DomainCardLite, LoadoutRules } from '@/lib/schemas/loadout';

import {
  moveToActive,
  moveToVault,
  quickSwapToActive,
  quickSwapToVault,
  swapCards,
} from './loadout-card-operations';

interface SwapOperationsResult {
  activeCards: DomainCardLite[];
  vaultCards: DomainCardLite[];
}

interface UseSwapOperationsParams {
  activeCards: DomainCardLite[];
  vaultCards: DomainCardLite[];
  rules: LoadoutRules;
  setActiveCards: (cards: DomainCardLite[]) => void;
  setVaultCards: (cards: DomainCardLite[]) => void;
  onNotifyChange: (updates: Partial<SwapOperationsResult>) => void;
}

export function useSwapOperations({
  activeCards,
  vaultCards,
  rules,
  setActiveCards,
  setVaultCards,
  onNotifyChange,
}: UseSwapOperationsParams) {
  const handleMoveToVault = useCallback(
    (cardName: string) => {
      const result = moveToVault(cardName, activeCards, vaultCards, rules);
      if (!result) return;
      setActiveCards(result.activeCards);
      setVaultCards(result.vaultCards);
      onNotifyChange(result);
    },
    [
      activeCards,
      vaultCards,
      rules,
      setActiveCards,
      setVaultCards,
      onNotifyChange,
    ]
  );

  const handleMoveToActive = useCallback(
    (cardName: string) => {
      const result = moveToActive(cardName, activeCards, vaultCards, rules);
      if (!result) return;
      setVaultCards(result.vaultCards);
      setActiveCards(result.activeCards);
      onNotifyChange(result);
    },
    [
      activeCards,
      vaultCards,
      rules,
      setActiveCards,
      setVaultCards,
      onNotifyChange,
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
      onNotifyChange(result);
    },
    [activeCards, vaultCards, setActiveCards, setVaultCards, onNotifyChange]
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
      onNotifyChange(result);
    },
    [
      activeCards,
      vaultCards,
      rules,
      setActiveCards,
      setVaultCards,
      onNotifyChange,
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
      onNotifyChange(result);
    },
    [
      activeCards,
      vaultCards,
      rules,
      setActiveCards,
      setVaultCards,
      onNotifyChange,
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
