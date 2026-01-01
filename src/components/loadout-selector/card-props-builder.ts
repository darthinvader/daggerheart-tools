import type { DomainCardLite } from '@/lib/schemas/loadout';

import type { DomainCardMiniProps, DragSource } from './domain-card-mini';

export type PreviewCard = DomainCardLite & {
  isPreview?: boolean;
  isMovingAway?: boolean;
};

interface CardPropsBuilderParams {
  card: PreviewCard;
  index: number;
  originalCards: DomainCardLite[];
  location: 'active' | 'vault';
  onMoveCard: boolean | undefined;
  isCoarse: boolean;
  dragSource: DragSource;
  dragOverTarget: DragSource;
  swapSource: DragSource;
  isSwapMode: boolean;
  handleDragStart: (location: 'active' | 'vault', index: number) => void;
  handleDragOver: (
    e: React.DragEvent,
    location: 'active' | 'vault',
    index: number
  ) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragEnd: () => void;
  handleDrop: (location: 'active' | 'vault', index: number) => void;
  handleSelectForSwap: (location: 'active' | 'vault', index: number) => void;
  handleCancelSwap: () => void;
  onSwap?: () => void;
  canSwapToActive?: boolean;
  onConvertToHomebrew?: () => void;
  onRemove?: () => void;
}

export function buildCardProps(
  params: CardPropsBuilderParams
): DomainCardMiniProps {
  const {
    card,
    index,
    originalCards,
    location,
    onMoveCard,
    isCoarse,
    dragSource,
    dragOverTarget,
    swapSource,
    isSwapMode,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDrop,
    handleSelectForSwap,
    handleCancelSwap,
    onSwap,
    canSwapToActive,
    onConvertToHomebrew,
    onRemove,
  } = params;

  const originalIndex = originalCards.findIndex(c => c.name === card.name);
  const displayIndex = originalIndex >= 0 ? originalIndex : index;

  return {
    card,
    location,
    index: displayIndex,
    onSwap,
    canSwapToActive,
    onDragStart: onMoveCard ? handleDragStart : undefined,
    onDragOver: onMoveCard
      ? e => handleDragOver(e, location, index)
      : undefined,
    onDragLeave: onMoveCard ? handleDragLeave : undefined,
    onDragEnd: onMoveCard ? handleDragEnd : undefined,
    onDrop: onMoveCard ? () => handleDrop(location, index) : undefined,
    isDragging:
      dragSource?.location === location && dragSource?.index === displayIndex,
    isDragOver:
      dragOverTarget?.location === location && dragOverTarget?.index === index,
    isCoarse,
    isSwapMode,
    swapSource,
    onSelectForSwap: onMoveCard ? handleSelectForSwap : undefined,
    onCancelSwap: handleCancelSwap,
    isPreview: card.isPreview,
    isMovingAway: card.isMovingAway,
    onConvertToHomebrew,
    onRemove,
  };
}
