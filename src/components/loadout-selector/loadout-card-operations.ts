import type { DomainCardLite, LoadoutRules } from '@/lib/schemas/loadout';

export type CardUpdateResult = {
  activeCards: DomainCardLite[];
  vaultCards: DomainCardLite[];
} | null;

export type MoveLocation = {
  location: 'active' | 'vault';
  index: number;
};

function reorderWithinLocation(
  cards: DomainCardLite[],
  fromIndex: number,
  toIndex: number
): DomainCardLite[] {
  const result = [...cards];
  const [movedCard] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, movedCard);
  return result;
}

function swapBetweenLocations(
  fromCards: DomainCardLite[],
  toCards: DomainCardLite[],
  fromIndex: number,
  toIndex: number
): { newFromCards: DomainCardLite[]; newToCards: DomainCardLite[] } {
  const newFromCards = [...fromCards];
  const newToCards = [...toCards];
  const [cardToMove] = newFromCards.splice(fromIndex, 1);
  const activatedCard = { ...cardToMove, isActivated: true };
  const [cardToSwap] = newToCards.splice(toIndex, 1, activatedCard);
  newFromCards.splice(fromIndex, 0, cardToSwap);
  return { newFromCards, newToCards };
}

export function moveCardBetweenLocations(
  from: MoveLocation,
  to: MoveLocation,
  activeCards: DomainCardLite[],
  vaultCards: DomainCardLite[],
  maxActiveCards: number
): CardUpdateResult {
  // Same location reorder
  if (from.location === to.location) {
    const cards =
      from.location === 'active' ? [...activeCards] : [...vaultCards];
    const reordered = reorderWithinLocation(cards, from.index, to.index);
    return {
      activeCards: from.location === 'active' ? reordered : activeCards,
      vaultCards: from.location === 'vault' ? reordered : vaultCards,
    };
  }

  // Moving from vault to active when at capacity - try swap
  const shouldSwap =
    from.location === 'vault' &&
    to.location === 'active' &&
    activeCards.length >= maxActiveCards &&
    to.index < activeCards.length;

  if (shouldSwap) {
    const { newFromCards, newToCards } = swapBetweenLocations(
      [...vaultCards],
      [...activeCards],
      from.index,
      to.index
    );
    return { activeCards: newToCards, vaultCards: newFromCards };
  }

  // Can't move to active if at capacity
  if (to.location === 'active' && activeCards.length >= maxActiveCards) {
    return null;
  }

  // Standard move between locations
  const fromCards =
    from.location === 'active' ? [...activeCards] : [...vaultCards];
  const toCards = to.location === 'active' ? [...activeCards] : [...vaultCards];
  const [movedCard] = fromCards.splice(from.index, 1);
  const activatedCard =
    to.location === 'active' ? { ...movedCard, isActivated: true } : movedCard;
  toCards.splice(to.index, 0, activatedCard);

  return {
    activeCards: from.location === 'active' ? fromCards : toCards,
    vaultCards: from.location === 'vault' ? fromCards : toCards,
  };
}

export function moveToVault(
  cardName: string,
  activeCards: DomainCardLite[],
  vaultCards: DomainCardLite[],
  rules: LoadoutRules
): CardUpdateResult {
  if (
    rules.maxVaultCards !== undefined &&
    vaultCards.length >= rules.maxVaultCards
  ) {
    return null;
  }
  const card = activeCards.find(c => c.name === cardName);
  if (!card) return null;
  return {
    activeCards: activeCards.filter(c => c.name !== cardName),
    vaultCards: [...vaultCards, card],
  };
}

export function moveToActive(
  cardName: string,
  activeCards: DomainCardLite[],
  vaultCards: DomainCardLite[],
  rules: LoadoutRules
): CardUpdateResult {
  if (activeCards.length >= rules.maxActiveCards) return null;
  const card = vaultCards.find(c => c.name === cardName);
  if (!card) return null;
  return {
    activeCards: [...activeCards, { ...card, isActivated: true }],
    vaultCards: vaultCards.filter(c => c.name !== cardName),
  };
}

export function swapCards(
  activeCardName: string,
  vaultCardName: string,
  activeCards: DomainCardLite[],
  vaultCards: DomainCardLite[]
): CardUpdateResult {
  const activeCard = activeCards.find(c => c.name === activeCardName);
  const vaultCard = vaultCards.find(c => c.name === vaultCardName);
  if (!activeCard || !vaultCard) return null;

  return {
    activeCards: activeCards
      .filter(c => c.name !== activeCardName)
      .concat({ ...vaultCard, isActivated: true }),
    vaultCards: vaultCards
      .filter(c => c.name !== vaultCardName)
      .concat(activeCard),
  };
}

export function quickSwapToVault(
  activeCardName: string,
  activeCards: DomainCardLite[],
  vaultCards: DomainCardLite[],
  rules: LoadoutRules
): CardUpdateResult {
  if (
    rules.maxVaultCards === undefined ||
    vaultCards.length < rules.maxVaultCards
  ) {
    return moveToVault(activeCardName, activeCards, vaultCards, rules);
  }

  if (vaultCards.length > 0) {
    return swapCards(
      activeCardName,
      vaultCards[0].name,
      activeCards,
      vaultCards
    );
  }

  return null;
}

export function quickSwapToActive(
  vaultCardName: string,
  activeCards: DomainCardLite[],
  vaultCards: DomainCardLite[],
  rules: LoadoutRules
): CardUpdateResult {
  if (activeCards.length < rules.maxActiveCards) {
    return moveToActive(vaultCardName, activeCards, vaultCards, rules);
  }

  if (activeCards.length > 0) {
    return swapCards(
      activeCards[0].name,
      vaultCardName,
      activeCards,
      vaultCards
    );
  }

  return null;
}
