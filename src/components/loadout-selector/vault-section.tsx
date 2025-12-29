import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCoarsePointer } from '@/hooks/use-coarse-pointer';
import type { DomainCardLite } from '@/lib/schemas/loadout';

import { DomainCardMini, type DragSource } from './domain-card-mini';
import { EndDropZone } from './end-drop-zone';

export type PreviewCard = DomainCardLite & {
  isPreview?: boolean;
  isMovingAway?: boolean;
};

type VaultSectionProps = {
  vaultCards: PreviewCard[];
  originalCards: DomainCardLite[];
  canSwapToActive: boolean;
  onSwapToActive?: (cardName: string) => void;
  onMoveCard?: boolean;
  onConvertToHomebrew?: (card: DomainCardLite) => void;
  dragSource: DragSource;
  dragOverTarget: DragSource;
  swapSource: DragSource;
  isSwapMode: boolean;
  isDragging: boolean;
  handleDragStart: (location: 'active' | 'vault', index: number) => void;
  handleDragOver: (
    e: React.DragEvent,
    location: 'active' | 'vault',
    index: number
  ) => void;
  handleDragEnd: () => void;
  handleDrop: (location: 'active' | 'vault', index: number) => void;
  handleSelectForSwap: (location: 'active' | 'vault', index: number) => void;
  handleCancelSwap: () => void;
};

export function VaultSection({
  vaultCards,
  originalCards,
  canSwapToActive,
  onSwapToActive,
  onMoveCard,
  onConvertToHomebrew,
  dragSource,
  dragOverTarget,
  swapSource,
  isSwapMode,
  isDragging,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleDrop,
  handleSelectForSwap,
  handleCancelSwap,
}: VaultSectionProps) {
  const isCoarse = useCoarsePointer();

  if (originalCards.length === 0) return null;

  return (
    <>
      <Separator />
      <div>
        <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          📦 Vault
          <Badge variant="secondary" className="text-xs">
            {originalCards.length}
          </Badge>
          {onMoveCard && !isCoarse && (
            <span className="text-muted-foreground/60 text-[10px] font-normal normal-case">
              (drag to reorder)
            </span>
          )}
        </h5>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {vaultCards.map((card, index) => {
            const originalIndex = originalCards.findIndex(
              c => c.name === card.name
            );
            const displayIndex = originalIndex >= 0 ? originalIndex : index;
            return (
              <DomainCardMini
                key={card.name}
                card={card}
                location="vault"
                index={displayIndex}
                onSwap={
                  onSwapToActive ? () => onSwapToActive(card.name) : undefined
                }
                canSwapToActive={canSwapToActive}
                onDragStart={onMoveCard ? handleDragStart : undefined}
                onDragOver={
                  onMoveCard
                    ? e => handleDragOver(e, 'vault', index)
                    : undefined
                }
                onDragEnd={onMoveCard ? handleDragEnd : undefined}
                onDrop={
                  onMoveCard ? () => handleDrop('vault', index) : undefined
                }
                isDragging={
                  dragSource?.location === 'vault' &&
                  dragSource?.index === displayIndex
                }
                isDragOver={
                  dragOverTarget?.location === 'vault' &&
                  dragOverTarget?.index === index
                }
                isCoarse={isCoarse}
                isSwapMode={isSwapMode}
                swapSource={swapSource}
                onSelectForSwap={onMoveCard ? handleSelectForSwap : undefined}
                onCancelSwap={handleCancelSwap}
                isPreview={card.isPreview}
                isMovingAway={card.isMovingAway}
                onConvertToHomebrew={
                  onConvertToHomebrew
                    ? () => onConvertToHomebrew(card)
                    : undefined
                }
              />
            );
          })}
          {onMoveCard && isDragging && dragSource?.location === 'active' && (
            <EndDropZone
              location="vault"
              index={originalCards.length}
              onDragOver={e => handleDragOver(e, 'vault', originalCards.length)}
              onDrop={() => handleDrop('vault', originalCards.length)}
              isDragOver={
                dragOverTarget?.location === 'vault' &&
                dragOverTarget?.index === originalCards.length
              }
              isVisible={true}
            />
          )}
        </div>
      </div>
    </>
  );
}
