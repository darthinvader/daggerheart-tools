import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  GripVertical,
  Trash2,
} from 'lucide-react';
import { useMemo } from 'react';

import { CardCostBadges } from '@/components/loadout-selector/card-cost-badges';
import { EnhancementOverlay } from '@/components/loadout-selector/enhancement-overlay';
import { TapIndicator } from '@/components/loadout-selector/tap-indicator';
import { UsageCounter } from '@/components/loadout-selector/usage-counter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import {
  DomainIcons,
  ICON_SIZE_LG,
  ICON_SIZE_MD,
  Scroll,
  Slash,
  Wrench,
  X,
  Zap,
} from '@/lib/icons';
import type { CardUsageState } from '@/lib/schemas/card-state';
import type { DomainCardLite } from '@/lib/schemas/loadout';
import { DOMAIN_BG_COLORS, DOMAIN_COLORS } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';
import { getCardCosts } from '@/lib/utils/card-costs';

export type DragSource = {
  location: 'active' | 'vault';
  index: number;
} | null;

interface CardVisualState {
  DomainIcon: React.ComponentType<{ size?: number; className?: string }> | null;
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
  const DomainIcon = DomainIcons[card.domain] ?? Scroll;
  const color = DOMAIN_COLORS[card.domain] ?? 'text-foreground';
  const bgColor = DOMAIN_BG_COLORS[card.domain] ?? '';
  const isThisSwapSource =
    swapSource?.location === location && swapSource?.index === index;
  const canBeSwapTarget =
    !!isSwapMode &&
    !isThisSwapSource &&
    (location === 'active' || canSwapToActive !== false);

  return { DomainIcon, color, bgColor, isThisSwapSource, canBeSwapTarget };
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
  onRemove?: () => void;
  onToggleActivated?: () => void;
  cardUsageState?: CardUsageState;
  onCardUsageChange?: (patch: Partial<CardUsageState>) => void;
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
  onRemove,
  onToggleActivated,
  cardUsageState,
  onCardUsageChange,
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
  const costs = useMemo(() => getCardCosts(card), [card]);

  const handleCardClick = () => {
    if (isSwapMode && visualState.canBeSwapTarget) {
      onDrop?.(location, index);
    }
  };

  return (
    <div
      className={cn(
        'relative',
        cardClassNames,
        cardUsageState?.tapped && 'rotate-3 opacity-60'
      )}
      draggable={!!onDragStart && !isCoarse}
      onDragStart={() => onDragStart?.(location, index)}
      onDragOver={e => onDragOver?.(e, location, index)}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      onDrop={() => onDrop?.(location, index)}
      onClick={handleCardClick}
    >
      <TapIndicator
        tapped={cardUsageState?.tapped ?? false}
        onTap={
          onCardUsageChange
            ? () => onCardUsageChange({ tapped: !cardUsageState?.tapped })
            : undefined
        }
      />
      <CardHeader
        card={card}
        DomainIcon={visualState.DomainIcon}
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
        onRemove={onRemove}
        onToggleActivated={onToggleActivated}
      />
      <p className="text-muted-foreground text-xs">{card.description}</p>
      {cardUsageState?.maxUses != null && (
        <UsageCounter
          current={cardUsageState.usesRemaining ?? cardUsageState.maxUses}
          max={cardUsageState.maxUses}
          onChange={
            onCardUsageChange
              ? v => onCardUsageChange({ usesRemaining: v })
              : undefined
          }
        />
      )}
      <EnhancementOverlay
        text={cardUsageState?.enhancementText}
        onChange={
          onCardUsageChange
            ? t => onCardUsageChange({ enhancementText: t })
            : undefined
        }
        readOnly={!onCardUsageChange}
      />
      <CardBadges card={card} costs={costs} />
    </div>
  );
}

type CardHeaderProps = {
  card: DomainCardLite;
  DomainIcon: React.ComponentType<{ size?: number; className?: string }> | null;
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
  onRemove?: () => void;
  onToggleActivated?: () => void;
};

// eslint-disable-next-line complexity
function CardHeader({
  card,
  DomainIcon,
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
  onRemove,
  onToggleActivated,
}: CardHeaderProps) {
  const isActivated = card.isActivated ?? true;
  return (
    <div className="mb-1 flex items-start justify-between gap-1">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {onDragStart && !isCoarse && (
          <GripVertical className="text-muted-foreground size-4 shrink-0" />
        )}
        {DomainIcon && <DomainIcon size={ICON_SIZE_LG} />}
        <span className={cn('truncate font-medium', color)}>{card.name}</span>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
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
            <X size={ICON_SIZE_MD} />
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
        {!isSwapMode && onToggleActivated && location === 'active' && (
          <SmartTooltip
            content={isActivated ? 'Deactivate bonuses' : 'Activate bonuses'}
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'size-6',
                isActivated
                  ? 'text-amber-600 hover:text-amber-700'
                  : 'text-muted-foreground'
              )}
              aria-pressed={isActivated}
              onClick={e => {
                e.stopPropagation();
                onToggleActivated();
              }}
            >
              {isActivated ? (
                <Zap size={ICON_SIZE_MD} />
              ) : (
                <Slash size={ICON_SIZE_MD} />
              )}
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
              <Wrench size={ICON_SIZE_MD} />
            </Button>
          </SmartTooltip>
        )}
        {!isSwapMode && onRemove && (
          <SmartTooltip content="Remove card from loadout">
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive size-6"
              onClick={e => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="size-3" />
            </Button>
          </SmartTooltip>
        )}
      </div>
    </div>
  );
}

function CardBadges({
  card,
  costs,
}: {
  card: DomainCardLite;
  costs: ReturnType<typeof getCardCosts>;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      <Badge variant="secondary" className="text-xs">
        {card.type}
      </Badge>
      <CardCostBadges costs={costs} compact />
      {card.isHomebrew && (
        <Badge variant="secondary" className="gap-1 text-xs">
          <Wrench size={ICON_SIZE_MD} className="inline-block" /> Homebrew
        </Badge>
      )}
    </div>
  );
}
