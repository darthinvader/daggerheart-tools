import type { DomainCardLite, LoadoutRules } from '@/lib/schemas/loadout';

export type CardUpdateResult = {
  activeCards: DomainCardLite[];
  vaultCards: DomainCardLite[];
} | null;

export type MoveLocation = {
  location: 'active' | 'vault';
  index: number;
};

export function moveCardBetweenLocations(
  from: MoveLocation,
  to: MoveLocation,
  activeCards: DomainCardLite[],
  vaultCards: DomainCardLite[],
  maxActiveCards: number
): CardUpdateResult {
  const fromCards =
    from.location === 'active' ? [...activeCards] : [...vaultCards];
  const toCards = to.location === 'active' ? [...activeCards] : [...vaultCards];

  if (from.location === to.location) {
    const cards = fromCards;
    const [movedCard] = cards.splice(from.index, 1);
    cards.splice(to.index, 0, movedCard);
    return {
      activeCards: from.location === 'active' ? cards : activeCards,
      vaultCards: from.location === 'vault' ? cards : vaultCards,
    };
  }

  const shouldSwap =
    from.location === 'vault' &&
    to.location === 'active' &&
    activeCards.length >= maxActiveCards &&
    to.index < toCards.length;

  if (shouldSwap) {
    const [cardToMove] = fromCards.splice(from.index, 1);
    const activatedCard = { ...cardToMove, isActivated: true };
    const [cardToSwap] = toCards.splice(to.index, 1, activatedCard);
    fromCards.splice(from.index, 0, cardToSwap);
    return { activeCards: toCards, vaultCards: fromCards };
  }

  if (to.location === 'active' && activeCards.length >= maxActiveCards) {
    return null;
  }

  const [movedCard] = fromCards.splice(from.index, 1);
  const activatedCard =
    from.location === 'vault' && to.location === 'active'
      ? { ...movedCard, isActivated: true }
      : movedCard;
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
