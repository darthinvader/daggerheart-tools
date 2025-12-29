import { useCallback, useMemo, useState } from 'react';

import type { DomainCard } from '@/lib/schemas/domains';
import type {
  DomainCardLite,
  LoadoutRules,
  LoadoutSelection,
} from '@/lib/schemas/loadout';

import { cardToLite } from './card-utils';
import { useSwapOperations } from './use-swap-operations';

interface UseCardOperationsProps {
  initialActiveCards: DomainCardLite[];
  initialVaultCards: DomainCardLite[];
  rules: LoadoutRules;
  onNotifyChange: (updates: Partial<LoadoutSelection>) => void;
}

// Helper to toggle a card in a list
function toggleCardInList(
  cards: DomainCardLite[],
  card: DomainCard,
  cardNames: Set<string>,
  maxCards: number | undefined
): DomainCardLite[] | null {
  const isInList = cardNames.has(card.name);
  if (isInList) {
    return cards.filter(c => c.name !== card.name);
  }
  if (maxCards === undefined || cards.length < maxCards) {
    return [...cards, cardToLite(card)];
  }
  return null;
}

/**
 * Hook to manage card operations (add, remove, move, swap)
 */
export function useCardOperations({
  initialActiveCards,
  initialVaultCards,
  rules,
  onNotifyChange,
}: UseCardOperationsProps) {
  const [activeCards, setActiveCards] =
    useState<DomainCardLite[]>(initialActiveCards);
  const [vaultCards, setVaultCards] =
    useState<DomainCardLite[]>(initialVaultCards);

  const activeCardNames = useMemo(
    () => new Set(activeCards.map(c => c.name)),
    [activeCards]
  );
  const vaultCardNames = useMemo(
    () => new Set(vaultCards.map(c => c.name)),
    [vaultCards]
  );
  const isActiveFull = activeCards.length >= rules.maxActiveCards;
  const isVaultFull =
    rules.maxVaultCards !== undefined &&
    vaultCards.length >= rules.maxVaultCards;

  const handleToggleActive = useCallback(
    (card: DomainCard) => {
      const newActive = toggleCardInList(
        activeCards,
        card,
        activeCardNames,
        rules.maxActiveCards
      );
      if (!newActive) return;
      setActiveCards(newActive);
      onNotifyChange({ activeCards: newActive });
    },
    [activeCards, activeCardNames, rules.maxActiveCards, onNotifyChange]
  );

  const handleToggleVault = useCallback(
    (card: DomainCard) => {
      const newVault = toggleCardInList(
        vaultCards,
        card,
        vaultCardNames,
        rules.maxVaultCards
      );
      if (!newVault) return;
      setVaultCards(newVault);
      onNotifyChange({ vaultCards: newVault });
    },
    [vaultCards, vaultCardNames, rules.maxVaultCards, onNotifyChange]
  );

  const handleRemoveActive = useCallback(
    (cardName: string) => {
      const newActive = activeCards.filter(c => c.name !== cardName);
      setActiveCards(newActive);
      onNotifyChange({ activeCards: newActive });
    },
    [activeCards, onNotifyChange]
  );

  const handleRemoveVault = useCallback(
    (cardName: string) => {
      const newVault = vaultCards.filter(c => c.name !== cardName);
      setVaultCards(newVault);
      onNotifyChange({ vaultCards: newVault });
    },
    [vaultCards, onNotifyChange]
  );

  const {
    handleMoveToVault,
    handleMoveToActive,
    handleSwapCards,
    handleQuickSwapToVault,
    handleQuickSwapToActive,
  } = useSwapOperations({
    activeCards,
    vaultCards,
    rules,
    setActiveCards,
    setVaultCards,
    onNotifyChange,
  });

  return {
    activeCards,
    vaultCards,
    activeCardNames,
    vaultCardNames,
    isActiveFull,
    isVaultFull,
    setActiveCards,
    setVaultCards,
    handleToggleActive,
    handleToggleVault,
    handleRemoveActive,
    handleRemoveVault,
    handleMoveToVault,
    handleMoveToActive,
    handleSwapCards,
    handleQuickSwapToVault,
    handleQuickSwapToActive,
  };
}
