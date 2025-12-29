import type { DomainCardLite, LoadoutSelection } from '@/lib/schemas/loadout';

import { ActiveLoadoutSection } from './active-loadout-section';
import { computePreviewLists } from './loadout-preview-utils';
import { LoadoutStats } from './loadout-stats';
import { SwapModeIndicator } from './swap-mode-indicator';
import { useLoadoutDragDrop } from './use-loadout-drag-drop';
import { VaultSection } from './vault-section';

function EmptyLoadout() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <span className="text-4xl opacity-50">📜</span>
      <p className="text-muted-foreground mt-2">No domain cards selected</p>
      <p className="text-muted-foreground text-sm">
        Click edit to build your domain loadout
      </p>
    </div>
  );
}

export type LoadoutContentProps = {
  selection: LoadoutSelection;
  onSwapToVault?: (cardName: string) => void;
  onSwapToActive?: (cardName: string) => void;
  onMoveCard?: (
    from: { location: 'active' | 'vault'; index: number },
    to: { location: 'active' | 'vault'; index: number }
  ) => void;
  maxActiveCards?: number;
  onChangeMaxActiveCards?: (delta: number) => void;
  onConvertToHomebrew?: (card: DomainCardLite) => void;
};

export function LoadoutContent({
  selection,
  onSwapToVault,
  onSwapToActive,
  onMoveCard,
  maxActiveCards = 5,
  onChangeMaxActiveCards,
  onConvertToHomebrew,
}: LoadoutContentProps) {
  const hasCards =
    selection.activeCards.length > 0 || selection.vaultCards.length > 0;
  const canSwapToActive = selection.activeCards.length < maxActiveCards;

  const dragDrop = useLoadoutDragDrop(onMoveCard);
  const { isSwapMode, isDragging, swapSource, dragSource, dragOverTarget } =
    dragDrop;

  if (!hasCards) {
    return <EmptyLoadout />;
  }

  const previewLists =
    isDragging || isSwapMode
      ? computePreviewLists(
          selection,
          swapSource,
          dragSource,
          dragOverTarget,
          maxActiveCards
        )
      : null;

  return (
    <div className="space-y-4">
      <LoadoutStats selection={selection} />
      <SwapModeIndicator
        isSwapMode={isSwapMode}
        onCancel={dragDrop.handleCancelSwap}
      />
      <ActiveLoadoutSection
        activeCards={previewLists?.activeCards ?? selection.activeCards}
        originalCards={selection.activeCards}
        maxActiveCards={maxActiveCards}
        onChangeMaxActiveCards={onChangeMaxActiveCards}
        onSwapToVault={onSwapToVault}
        onMoveCard={!!onMoveCard}
        onConvertToHomebrew={onConvertToHomebrew}
        dragSource={dragSource}
        dragOverTarget={dragOverTarget}
        swapSource={swapSource}
        isSwapMode={isSwapMode}
        isDragging={isDragging}
        handleDragStart={dragDrop.handleDragStart}
        handleDragOver={dragDrop.handleDragOver}
        handleDragLeave={dragDrop.handleDragLeave}
        handleDragEnd={dragDrop.handleDragEnd}
        handleDrop={dragDrop.handleDrop}
        handleSelectForSwap={dragDrop.handleSelectForSwap}
        handleCancelSwap={dragDrop.handleCancelSwap}
      />
      <VaultSection
        vaultCards={previewLists?.vaultCards ?? selection.vaultCards}
        originalCards={selection.vaultCards}
        canSwapToActive={canSwapToActive}
        onSwapToActive={onSwapToActive}
        onMoveCard={!!onMoveCard}
        onConvertToHomebrew={onConvertToHomebrew}
        dragSource={dragSource}
        dragOverTarget={dragOverTarget}
        swapSource={swapSource}
        isSwapMode={isSwapMode}
        isDragging={isDragging}
        handleDragStart={dragDrop.handleDragStart}
        handleDragOver={dragDrop.handleDragOver}
        handleDragLeave={dragDrop.handleDragLeave}
        handleDragEnd={dragDrop.handleDragEnd}
        handleDrop={dragDrop.handleDrop}
        handleSelectForSwap={dragDrop.handleSelectForSwap}
        handleCancelSwap={dragDrop.handleCancelSwap}
      />
    </div>
  );
}
