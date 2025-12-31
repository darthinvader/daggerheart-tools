import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCoarsePointer } from '@/hooks/use-coarse-pointer';
import type { DomainCardLite } from '@/lib/schemas/loadout';

import { buildCardProps, type PreviewCard } from './card-props-builder';
import { DomainCardMini, type DragSource } from './domain-card-mini';
import { EndDropZone } from './end-drop-zone';

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
  handleDragLeave: (e: React.DragEvent) => void;
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
  handleDragLeave,
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
          {vaultCards.map((card, index) => (
            <DomainCardMini
              key={card.name}
              {...buildCardProps({
                card,
                index,
                originalCards,
                location: 'vault',
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
                onSwap: onSwapToActive
                  ? () => onSwapToActive(card.name)
                  : undefined,
                canSwapToActive,
                onConvertToHomebrew: onConvertToHomebrew
                  ? () => onConvertToHomebrew(card)
                  : undefined,
              })}
            />
          ))}
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
