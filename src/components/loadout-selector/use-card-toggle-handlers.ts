import { useCallback } from 'react';

import type { DomainCard } from '@/lib/schemas/domains';
import type {
  DomainCardLite,
  LoadoutRules,
  LoadoutSelection,
} from '@/lib/schemas/loadout';

import { cardToLite } from './card-utils';

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

interface UseCardToggleHandlersProps {
  activeCards: DomainCardLite[];
  vaultCards: DomainCardLite[];
  activeCardNames: Set<string>;
  vaultCardNames: Set<string>;
  rules: LoadoutRules;
  setActiveCards: (cards: DomainCardLite[]) => void;
  setVaultCards: (cards: DomainCardLite[]) => void;
  notifyChange: (updates: Partial<LoadoutSelection>) => void;
}

export function useCardToggleHandlers({
  activeCards,
  vaultCards,
  activeCardNames,
  vaultCardNames,
  rules,
  setActiveCards,
  setVaultCards,
  notifyChange,
}: UseCardToggleHandlersProps) {
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
      notifyChange({ activeCards: newActive });
    },
    [
      activeCards,
      activeCardNames,
      rules.maxActiveCards,
      setActiveCards,
      notifyChange,
    ]
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
      notifyChange({ vaultCards: newVault });
    },
    [
      vaultCards,
      vaultCardNames,
      rules.maxVaultCards,
      setVaultCards,
      notifyChange,
    ]
  );

  const handleRemoveActive = useCallback(
    (cardName: string) => {
      const newActive = activeCards.filter(c => c.name !== cardName);
      setActiveCards(newActive);
      notifyChange({ activeCards: newActive });
    },
    [activeCards, setActiveCards, notifyChange]
  );

  const handleRemoveVault = useCallback(
    (cardName: string) => {
      const newVault = vaultCards.filter(c => c.name !== cardName);
      setVaultCards(newVault);
      notifyChange({ vaultCards: newVault });
    },
    [vaultCards, setVaultCards, notifyChange]
  );

  return {
    handleToggleActive,
    handleToggleVault,
    handleRemoveActive,
    handleRemoveVault,
  };
}
