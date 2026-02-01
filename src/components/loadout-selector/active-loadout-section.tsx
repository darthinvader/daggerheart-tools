import { Minus, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { useCoarsePointer } from '@/hooks/use-coarse-pointer';
import { ICON_SIZE_MD, Zap } from '@/lib/icons';
import type { DomainCardLite } from '@/lib/schemas/loadout';

import { buildCardProps, type PreviewCard } from './card-props-builder';
import { DomainCardMini, type DragSource } from './domain-card-mini';
import { EndDropZone } from './end-drop-zone';

interface LoadoutHeaderProps {
  originalCardsLength: number;
  maxActiveCards: number;
  onChangeMaxActiveCards?: (delta: number) => void;
  showDragHint: boolean;
}

function LoadoutHeader({
  originalCardsLength,
  maxActiveCards,
  onChangeMaxActiveCards,
  showDragHint,
}: LoadoutHeaderProps) {
  return (
    <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
      <Zap size={ICON_SIZE_MD} className="inline-block" /> Active Loadout
      <div className="flex items-center gap-1">
        {onChangeMaxActiveCards && (
          <SmartTooltip content="Decrease max active cards">
            <Button
              variant="ghost"
              size="icon"
              className="size-5"
              onClick={() => onChangeMaxActiveCards(-1)}
              disabled={
                maxActiveCards <= originalCardsLength || maxActiveCards <= 1
              }
            >
              <Minus className="size-3" />
            </Button>
          </SmartTooltip>
        )}
        <Badge variant="secondary" className="text-xs">
          {originalCardsLength}/{maxActiveCards}
        </Badge>
        {onChangeMaxActiveCards && (
          <SmartTooltip content="Increase max active cards">
            <Button
              variant="ghost"
              size="icon"
              className="size-5"
              onClick={() => onChangeMaxActiveCards(1)}
            >
              <Plus className="size-3" />
            </Button>
          </SmartTooltip>
        )}
      </div>
      {showDragHint && (
        <span className="text-muted-foreground/60 text-[10px] font-normal normal-case">
          (drag to reorder)
        </span>
      )}
    </h5>
  );
}

type ActiveLoadoutSectionProps = {
  activeCards: PreviewCard[];
  originalCards: DomainCardLite[];
  maxActiveCards: number;
  onChangeMaxActiveCards?: (delta: number) => void;
  onSwapToVault?: (cardName: string) => void;
  onMoveCard?: boolean;
  onConvertToHomebrew?: (card: DomainCardLite) => void;
  onRemoveCard?: (cardName: string) => void;
  onToggleActivated?: (cardName: string) => void;
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

export function ActiveLoadoutSection({
  activeCards,
  originalCards,
  maxActiveCards,
  onChangeMaxActiveCards,
  onSwapToVault,
  onMoveCard,
  onConvertToHomebrew,
  onRemoveCard,
  onToggleActivated,
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
}: ActiveLoadoutSectionProps) {
  const isCoarse = useCoarsePointer();

  if (originalCards.length === 0) return null;

  return (
    <>
      <Separator />
      <div>
        <LoadoutHeader
          originalCardsLength={originalCards.length}
          maxActiveCards={maxActiveCards}
          onChangeMaxActiveCards={onChangeMaxActiveCards}
          showDragHint={!!onMoveCard && !isCoarse}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeCards.map((card, index) => (
            <DomainCardMini
              key={card.name}
              {...buildCardProps({
                card,
                index,
                originalCards,
                location: 'active',
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
                onSwap: onSwapToVault
                  ? () => onSwapToVault(card.name)
                  : undefined,
                onConvertToHomebrew: onConvertToHomebrew
                  ? () => onConvertToHomebrew(card)
                  : undefined,
                onRemove: onRemoveCard
                  ? () => onRemoveCard(card.name)
                  : undefined,
                onToggleActivated: onToggleActivated
                  ? () => onToggleActivated(card.name)
                  : undefined,
              })}
            />
          ))}
          {onMoveCard &&
            isDragging &&
            dragSource?.location === 'vault' &&
            originalCards.length < maxActiveCards && (
              <EndDropZone
                location="active"
                index={originalCards.length}
                onDragOver={e =>
                  handleDragOver(e, 'active', originalCards.length)
                }
                onDrop={() => handleDrop('active', originalCards.length)}
                isDragOver={
                  dragOverTarget?.location === 'active' &&
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
