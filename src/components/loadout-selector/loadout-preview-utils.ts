import type { DomainCardLite, LoadoutSelection } from '@/lib/schemas/loadout';

import type { DragSource } from './domain-card-mini';

export type PreviewCard = DomainCardLite & {
  isPreview?: boolean;
  isMovingAway?: boolean;
};

export type PreviewLists = {
  activeCards: PreviewCard[];
  vaultCards: PreviewCard[];
};

function handleSameLocationPreview(
  fromCards: PreviewCard[],
  sourceIndex: number
): void {
  fromCards[sourceIndex] = { ...fromCards[sourceIndex], isMovingAway: true };
}

function handleCrossLocationSwap(
  fromCards: PreviewCard[],
  toCards: PreviewCard[],
  sourceIndex: number,
  targetIndex: number
): void {
  const cardToMove = { ...fromCards[sourceIndex], isPreview: true };
  const cardToSwap = { ...toCards[targetIndex], isPreview: true };
  fromCards.splice(sourceIndex, 1, cardToSwap);
  toCards.splice(targetIndex, 1, cardToMove);
}

function handleCrossLocationMove(
  fromCards: PreviewCard[],
  toCards: PreviewCard[],
  originalCard: DomainCardLite,
  sourceIndex: number,
  targetIndex: number
): void {
  const movedCard = { ...fromCards[sourceIndex], isPreview: true };
  fromCards.splice(sourceIndex, 1);
  fromCards.splice(sourceIndex, 0, { ...originalCard, isMovingAway: true });
  toCards.splice(targetIndex, 0, movedCard);
}

function shouldPerformSwap(
  sourceLocation: 'active' | 'vault',
  targetLocation: 'active' | 'vault',
  activeCardsLength: number,
  maxActiveCards: number,
  targetIndex: number,
  toCardsLength: number
): boolean {
  return (
    sourceLocation === 'vault' &&
    targetLocation === 'active' &&
    activeCardsLength >= maxActiveCards &&
    targetIndex < toCardsLength
  );
}

function isActiveAtCapacity(
  targetLocation: 'active' | 'vault',
  activeCardsLength: number,
  maxActiveCards: number
): boolean {
  return targetLocation === 'active' && activeCardsLength >= maxActiveCards;
}

export function computePreviewLists(
  selection: LoadoutSelection,
  swapSource: DragSource,
  dragSource: DragSource,
  dragOverTarget: DragSource,
  maxActiveCards: number
): PreviewLists | null {
  const source = swapSource ?? dragSource;
  const target = dragOverTarget;

  if (!source || !target) return null;
  if (source.location === target.location && source.index === target.index) {
    return null;
  }

  const activeCards: PreviewCard[] = [...selection.activeCards];
  const vaultCards: PreviewCard[] = [...selection.vaultCards];
  const fromCards = source.location === 'active' ? activeCards : vaultCards;
  const toCards = target.location === 'active' ? activeCards : vaultCards;

  if (source.location === target.location) {
    handleSameLocationPreview(fromCards, source.index);
    return { activeCards, vaultCards };
  }

  const shouldSwap = shouldPerformSwap(
    source.location,
    target.location,
    selection.activeCards.length,
    maxActiveCards,
    target.index,
    toCards.length
  );

  if (shouldSwap) {
    handleCrossLocationSwap(fromCards, toCards, source.index, target.index);
    return { activeCards, vaultCards };
  }

  if (
    isActiveAtCapacity(
      target.location,
      selection.activeCards.length,
      maxActiveCards
    )
  ) {
    return { activeCards, vaultCards };
  }

  const originalCard =
    selection[source.location === 'active' ? 'activeCards' : 'vaultCards'][
      source.index
    ];
  handleCrossLocationMove(
    fromCards,
    toCards,
    originalCard,
    source.index,
    target.index
  );

  return { activeCards, vaultCards };
}
