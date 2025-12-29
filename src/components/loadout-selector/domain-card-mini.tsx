import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { DomainCardLite } from '@/lib/schemas/loadout';
import {
  DOMAIN_BG_COLORS,
  DOMAIN_COLORS,
  DOMAIN_EMOJIS,
} from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

export type DragSource = {
  location: 'active' | 'vault';
  index: number;
} | null;

interface CardVisualState {
  emoji: string;
  color: string;
  bgColor: string;
  isThisSwapSource: boolean;
  canBeSwapTarget: boolean;
}

function getCardVisualState(
  card: DomainCardLite,
  location: 'active' | 'vault',
  index: number,
  swapSource: DragSource | undefined,
  isSwapMode: boolean | undefined,
  canSwapToActive: boolean | undefined
): CardVisualState {
  const emoji = DOMAIN_EMOJIS[card.domain] ?? '📜';
  const color = DOMAIN_COLORS[card.domain] ?? 'text-foreground';
  const bgColor = DOMAIN_BG_COLORS[card.domain] ?? '';
  const isThisSwapSource =
    swapSource?.location === location && swapSource?.index === index;
  const canBeSwapTarget =
    !!isSwapMode &&
    !isThisSwapSource &&
    (location === 'active' || canSwapToActive !== false);

  return { emoji, color, bgColor, isThisSwapSource, canBeSwapTarget };
}

function getCardClassNames(
  bgColor: string,
  isDragging: boolean | undefined,
  isDragOver: boolean | undefined,
  isThisSwapSource: boolean,
  canBeSwapTarget: boolean,
  hasDragHandler: boolean,
  isCoarse: boolean | undefined,
  isPreview: boolean | undefined,
  isMovingAway: boolean | undefined
): string {
  return cn(
    'rounded-lg border p-3 transition-all duration-200',
    bgColor,
    isDragging && 'ring-primary scale-95 opacity-40 ring-2',
    isDragOver && 'ring-primary scale-[1.02] ring-2 ring-offset-2',
    isThisSwapSource && 'bg-amber-500/10 ring-2 ring-amber-500',
    canBeSwapTarget &&
      'ring-primary/50 hover:ring-primary animate-pulse cursor-pointer ring-2 hover:ring-2',
    hasDragHandler && !isCoarse && 'cursor-grab active:cursor-grabbing',
    isPreview && 'ring-dashed ring-primary border-dashed opacity-60 ring-2',
    isMovingAway && 'scale-95 opacity-20'
  );
}

export type DomainCardMiniProps = {
  card: DomainCardLite;
  location: 'active' | 'vault';
  index: number;
  onSwap?: () => void;
  canSwapToActive?: boolean;
  onDragStart?: (location: 'active' | 'vault', index: number) => void;
  onDragOver?: (
    e: React.DragEvent,
    location: 'active' | 'vault',
    index: number
  ) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onDrop?: (location: 'active' | 'vault', index: number) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  isCoarse?: boolean;
  isSwapMode?: boolean;
  swapSource?: DragSource;
  onSelectForSwap?: (location: 'active' | 'vault', index: number) => void;
  onCancelSwap?: () => void;
  isPreview?: boolean;
  isMovingAway?: boolean;
  onConvertToHomebrew?: () => void;
};

export function DomainCardMini({
  card,
  location,
  index,
  onSwap,
  canSwapToActive,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop,
  isDragging,
  isDragOver,
  isCoarse,
  isSwapMode,
  swapSource,
  onSelectForSwap,
  onCancelSwap,
  isPreview,
  isMovingAway,
  onConvertToHomebrew,
}: DomainCardMiniProps) {
  const visualState = getCardVisualState(
    card,
    location,
    index,
    swapSource,
    isSwapMode,
    canSwapToActive
  );

  const cardClassNames = getCardClassNames(
    visualState.bgColor,
    isDragging,
    isDragOver,
    visualState.isThisSwapSource,
    visualState.canBeSwapTarget,
    !!onDragStart,
    isCoarse,
    isPreview,
    isMovingAway
  );

  const handleCardClick = () => {
    if (isSwapMode && visualState.canBeSwapTarget) {
      onDrop?.(location, index);
    }
  };

  return (
    <div
      className={cardClassNames}
      draggable={!!onDragStart && !isCoarse}
      onDragStart={() => onDragStart?.(location, index)}
      onDragOver={e => onDragOver?.(e, location, index)}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      onDrop={() => onDrop?.(location, index)}
      onClick={handleCardClick}
    >
      <CardHeader
        card={card}
        emoji={visualState.emoji}
        color={visualState.color}
        location={location}
        index={index}
        isCoarse={isCoarse}
        isSwapMode={isSwapMode}
        isThisSwapSource={visualState.isThisSwapSource}
        canSwapToActive={canSwapToActive}
        onDragStart={onDragStart}
        onSelectForSwap={onSelectForSwap}
        onCancelSwap={onCancelSwap}
        onSwap={onSwap}
        onConvertToHomebrew={onConvertToHomebrew}
      />
      <p className="text-muted-foreground text-xs">{card.description}</p>
      <CardBadges card={card} />
    </div>
  );
}

type CardHeaderProps = {
  card: DomainCardLite;
  emoji: string;
  color: string;
  location: 'active' | 'vault';
  index: number;
  isCoarse?: boolean;
  isSwapMode?: boolean;
  isThisSwapSource?: boolean;
  canSwapToActive?: boolean;
  onDragStart?: (location: 'active' | 'vault', index: number) => void;
  onSelectForSwap?: (location: 'active' | 'vault', index: number) => void;
  onCancelSwap?: () => void;
  onSwap?: () => void;
  onConvertToHomebrew?: () => void;
};

function CardHeader({
  card,
  emoji,
  color,
  location,
  index,
  isCoarse,
  isSwapMode,
  isThisSwapSource,
  canSwapToActive,
  onDragStart,
  onSelectForSwap,
  onCancelSwap,
  onSwap,
  onConvertToHomebrew,
}: CardHeaderProps) {
  return (
    <div className="mb-1 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {onDragStart && !isCoarse && (
          <GripVertical className="text-muted-foreground size-4 shrink-0" />
        )}
        <span className="text-lg">{emoji}</span>
        <span className={cn('font-medium', color)}>{card.name}</span>
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="outline" className="text-xs">
          Lv. {card.level}
        </Badge>
        {isThisSwapSource && (
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-amber-600"
            onClick={e => {
              e.stopPropagation();
              onCancelSwap?.();
            }}
          >
            ✕
          </Button>
        )}
        {!isSwapMode && onSelectForSwap && (
          <SmartTooltip content="Swap position with another card">
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={e => {
                e.stopPropagation();
                onSelectForSwap(location, index);
              }}
            >
              <ArrowUpDown className="size-3" />
            </Button>
          </SmartTooltip>
        )}
        {!isSwapMode && onSwap && (
          <SmartTooltip
            content={location === 'active' ? 'Move to vault' : 'Move to active'}
          >
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={e => {
                e.stopPropagation();
                onSwap();
              }}
              disabled={location === 'vault' && !canSwapToActive}
            >
              {location === 'active' ? (
                <ArrowDown className="size-3" />
              ) : (
                <ArrowUp className="size-3" />
              )}
            </Button>
          </SmartTooltip>
        )}
        {!isSwapMode && onConvertToHomebrew && (
          <SmartTooltip
            content={
              card.isHomebrew
                ? 'Edit homebrew card'
                : 'Convert to homebrew for editing'
            }
          >
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={e => {
                e.stopPropagation();
                onConvertToHomebrew();
              }}
            >
              🛠️
            </Button>
          </SmartTooltip>
        )}
      </div>
    </div>
  );
}

function CardBadges({ card }: { card: DomainCardLite }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      <Badge variant="secondary" className="text-xs">
        {card.type}
      </Badge>
      {card.hopeCost !== undefined && card.hopeCost > 0 && (
        <SmartTooltip content={`Costs ${card.hopeCost} Hope to use`}>
          <Badge variant="outline" className="gap-1 text-xs">
            ✨ {card.hopeCost}
          </Badge>
        </SmartTooltip>
      )}
      {card.recallCost !== undefined && card.recallCost > 0 && (
        <SmartTooltip content={`Costs ${card.recallCost} to recall`}>
          <Badge variant="outline" className="gap-1 text-xs">
            🔄 {card.recallCost}
          </Badge>
        </SmartTooltip>
      )}
      {card.isHomebrew && (
        <Badge variant="secondary" className="gap-1 text-xs">
          🛠️ Homebrew
        </Badge>
      )}
    </div>
  );
}
