import type { LoadoutSelection } from '@/lib/schemas/loadout';

import { moveCardBetweenLocations } from './loadout-card-operations';

export function createSwapToVaultHandler(
  selection: LoadoutSelection,
  onChange?: (selection: LoadoutSelection) => void
) {
  return (cardName: string) => {
    const card = selection.activeCards.find(c => c.name === cardName);
    if (!card) return;
    const updated: LoadoutSelection = {
      ...selection,
      activeCards: selection.activeCards.filter(c => c.name !== cardName),
      vaultCards: [...selection.vaultCards, card],
    };
    onChange?.(updated);
  };
}

export function createSwapToActiveHandler(
  selection: LoadoutSelection,
  maxActiveCards: number,
  onChange?: (selection: LoadoutSelection) => void
) {
  return (cardName: string) => {
    if (selection.activeCards.length >= maxActiveCards) return;
    const card = selection.vaultCards.find(c => c.name === cardName);
    if (!card) return;
    const updated: LoadoutSelection = {
      ...selection,
      vaultCards: selection.vaultCards.filter(c => c.name !== cardName),
      activeCards: [...selection.activeCards, { ...card, isActivated: true }],
    };
    onChange?.(updated);
  };
}

export function createRemoveActiveCardHandler(
  selection: LoadoutSelection,
  onChange?: (selection: LoadoutSelection) => void
) {
  return (cardName: string) => {
    const updated: LoadoutSelection = {
      ...selection,
      activeCards: selection.activeCards.filter(c => c.name !== cardName),
    };
    onChange?.(updated);
  };
}

export function createRemoveVaultCardHandler(
  selection: LoadoutSelection,
  onChange?: (selection: LoadoutSelection) => void
) {
  return (cardName: string) => {
    const updated: LoadoutSelection = {
      ...selection,
      vaultCards: selection.vaultCards.filter(c => c.name !== cardName),
    };
    onChange?.(updated);
  };
}

export function createMoveCardHandler(
  selection: LoadoutSelection,
  maxActiveCards: number,
  onChange?: (selection: LoadoutSelection) => void
) {
  return (
    from: { location: 'active' | 'vault'; index: number },
    to: { location: 'active' | 'vault'; index: number }
  ) => {
    const result = moveCardBetweenLocations(
      from,
      to,
      selection.activeCards,
      selection.vaultCards,
      maxActiveCards
    );
    if (!result) return;
    onChange?.({ ...selection, ...result });
  };
}

export function createToggleActivationHandler(
  selection: LoadoutSelection,
  onChange?: (selection: LoadoutSelection) => void
) {
  return (cardName: string) => {
    const updatedActive = selection.activeCards.map(card => {
      if (card.name !== cardName) return card;
      return { ...card, isActivated: !(card.isActivated ?? true) };
    });
    onChange?.({ ...selection, activeCards: updatedActive });
  };
}

export function createHomebrewSaveHandler(
  onChange?: (selection: LoadoutSelection) => void
) {
  return (updated: LoadoutSelection) => {
    onChange?.(updated);
  };
}

export function createMaxActiveCardsHandler(
  setMaxActiveCards: React.Dispatch<React.SetStateAction<number>>,
  activeCardsLength: number
) {
  return (delta: number) => {
    setMaxActiveCards(prev => {
      const next = prev + delta;
      if (next < 1 || next < activeCardsLength) return prev;
      return next;
    });
  };
}
