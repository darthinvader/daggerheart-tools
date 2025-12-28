import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  GripVertical,
  Minus,
  Plus,
} from 'lucide-react';

import { useCallback, useRef, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { useCoarsePointer } from '@/hooks/use-coarse-pointer';
import type { DomainCardLite, LoadoutSelection } from '@/lib/schemas/loadout';
import {
  DOMAIN_BG_COLORS,
  DOMAIN_COLORS,
  DOMAIN_EMOJIS,
} from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

import { CardFormFields } from './card-form-fields';
import { LoadoutSelector } from './loadout-selector';

type DragSource = {
  location: 'active' | 'vault';
  index: number;
} | null;

interface LoadoutDisplayProps {
  selection: LoadoutSelection;
  onChange?: (selection: LoadoutSelection) => void;
  classDomains: string[];
  tier?: string;
  className?: string;
  readOnly?: boolean;
}

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

interface EndDropZoneProps {
  location: 'active' | 'vault';
  index: number;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  isDragOver: boolean;
  isVisible: boolean;
}

function EndDropZone({
  location,
  onDragOver,
  onDrop,
  isDragOver,
  isVisible,
}: EndDropZoneProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'flex min-h-[100px] items-center justify-center rounded-lg border-2 border-dashed p-4 transition-all',
        isDragOver
          ? 'border-primary bg-primary/10 ring-primary ring-2'
          : 'border-muted-foreground/30 bg-muted/30',
        location === 'active' ? 'border-green-500/50' : 'border-blue-500/50'
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <span className="text-muted-foreground text-sm">
        Drop here to add to end
      </span>
    </div>
  );
}

interface DomainCardDisplayProps {
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
}

function DomainCardMini({
  card,
  location,
  index,
  onSwap,
  canSwapToActive,
  onDragStart,
  onDragOver,
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
}: DomainCardDisplayProps) {
  const emoji = DOMAIN_EMOJIS[card.domain] ?? '📜';
  const color = DOMAIN_COLORS[card.domain] ?? 'text-foreground';
  const bgColor = DOMAIN_BG_COLORS[card.domain] ?? '';

  const isThisSwapSource =
    swapSource?.location === location && swapSource?.index === index;
  const canBeSwapTarget =
    isSwapMode &&
    !isThisSwapSource &&
    (location === 'active' || canSwapToActive !== false);

  const handleCardClick = () => {
    if (isSwapMode && canBeSwapTarget) {
      onDrop?.(location, index);
    }
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-all duration-200',
        bgColor,
        isDragging && 'ring-primary scale-95 opacity-40 ring-2',
        isDragOver && 'ring-primary scale-[1.02] ring-2 ring-offset-2',
        isThisSwapSource && 'bg-amber-500/10 ring-2 ring-amber-500',
        canBeSwapTarget &&
          'ring-primary/50 hover:ring-primary animate-pulse cursor-pointer ring-2 hover:ring-2',
        onDragStart && !isCoarse && 'cursor-grab active:cursor-grabbing',
        isPreview && 'ring-dashed ring-primary border-dashed opacity-60 ring-2',
        isMovingAway && 'scale-95 opacity-20'
      )}
      draggable={!!onDragStart && !isCoarse}
      onDragStart={() => onDragStart?.(location, index)}
      onDragOver={e => onDragOver?.(e, location, index)}
      onDragEnd={onDragEnd}
      onDrop={() => onDrop?.(location, index)}
      onClick={handleCardClick}
    >
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
              content={
                location === 'active' ? 'Move to vault' : 'Move to active'
              }
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
      <p className="text-muted-foreground text-xs">{card.description}</p>
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
    </div>
  );
}

function LoadoutStats({ selection }: { selection: LoadoutSelection }) {
  const uniqueDomains = [
    ...new Set([
      ...selection.activeCards.map(c => c.domain),
      ...selection.vaultCards.map(c => c.domain),
    ]),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      <SmartTooltip content="Active cards ready to use">
        <Badge
          variant="outline"
          className="gap-1 border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/30"
        >
          ⚡ {selection.activeCards.length} Active
        </Badge>
      </SmartTooltip>
      <SmartTooltip content="Cards stored in vault">
        <Badge
          variant="outline"
          className="gap-1 border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
        >
          📦 {selection.vaultCards.length} Vault
        </Badge>
      </SmartTooltip>
      {uniqueDomains.length > 0 && (
        <SmartTooltip content={`Domains: ${uniqueDomains.join(', ')}`}>
          <Badge variant="outline" className="gap-1">
            🌐 {uniqueDomains.length} Domain
            {uniqueDomains.length !== 1 ? 's' : ''}
          </Badge>
        </SmartTooltip>
      )}
    </div>
  );
}

interface LoadoutContentProps {
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
}

function LoadoutContent({
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
  const isCoarse = useCoarsePointer();

  const dragSourceRef = useRef<DragSource>(null);
  const [dragSource, setDragSource] = useState<DragSource>(null);
  const [dragOverTarget, setDragOverTarget] = useState<DragSource>(null);
  const [swapSource, setSwapSource] = useState<DragSource>(null);

  const handleDragStart = useCallback(
    (location: 'active' | 'vault', index: number) => {
      dragSourceRef.current = { location, index };
      setDragSource({ location, index });
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, location: 'active' | 'vault', index: number) => {
      e.preventDefault();
      setDragOverTarget({ location, index });
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    dragSourceRef.current = null;
    setDragSource(null);
    setDragOverTarget(null);
  }, []);

  const handleDrop = useCallback(
    (toLocation: 'active' | 'vault', toIndex: number) => {
      const source = swapSource ?? dragSourceRef.current;
      if (!source) return;

      const isSameCard =
        source.location === toLocation && source.index === toIndex;
      if (isSameCard) {
        setSwapSource(null);
        handleDragEnd();
        return;
      }

      onMoveCard?.(source, { location: toLocation, index: toIndex });
      setSwapSource(null);
      handleDragEnd();
    },
    [onMoveCard, handleDragEnd, swapSource]
  );

  const handleSelectForSwap = useCallback(
    (location: 'active' | 'vault', index: number) => {
      setSwapSource({ location, index });
    },
    []
  );

  const handleCancelSwap = useCallback(() => {
    setSwapSource(null);
  }, []);

  if (!hasCards) {
    return <EmptyLoadout />;
  }

  const isSwapMode = swapSource !== null;
  const isDragging = dragSource !== null;

  type PreviewCard = DomainCardLite & {
    isPreview?: boolean;
    isMovingAway?: boolean;
  };

  const computePreviewLists = (): {
    activeCards: PreviewCard[];
    vaultCards: PreviewCard[];
  } => {
    const source = swapSource ?? dragSource;
    const target = dragOverTarget;

    if (!source || !target) {
      return {
        activeCards: selection.activeCards,
        vaultCards: selection.vaultCards,
      };
    }

    if (source.location === target.location && source.index === target.index) {
      return {
        activeCards: selection.activeCards,
        vaultCards: selection.vaultCards,
      };
    }

    const activeCards: PreviewCard[] = [...selection.activeCards];
    const vaultCards: PreviewCard[] = [...selection.vaultCards];
    const fromCards = source.location === 'active' ? activeCards : vaultCards;
    const toCards = target.location === 'active' ? activeCards : vaultCards;

    if (source.location === target.location) {
      fromCards[source.index] = {
        ...fromCards[source.index],
        isMovingAway: true,
      };
    } else {
      const shouldSwap =
        source.location === 'vault' &&
        target.location === 'active' &&
        selection.activeCards.length >= maxActiveCards &&
        target.index < toCards.length;

      if (shouldSwap) {
        const cardToMove = { ...fromCards[source.index], isPreview: true };
        const cardToSwap = { ...toCards[target.index], isPreview: true };
        fromCards.splice(source.index, 1, cardToSwap);
        toCards.splice(target.index, 1, cardToMove);
      } else {
        if (
          target.location === 'active' &&
          selection.activeCards.length >= maxActiveCards
        ) {
          return { activeCards, vaultCards };
        }
        const movedCard = { ...fromCards[source.index], isPreview: true };
        fromCards.splice(source.index, 1);
        fromCards.splice(source.index, 0, {
          ...selection[
            source.location === 'active' ? 'activeCards' : 'vaultCards'
          ][source.index],
          isMovingAway: true,
        });
        toCards.splice(target.index, 0, movedCard);
      }
    }

    return { activeCards, vaultCards };
  };

  const previewLists = isDragging || isSwapMode ? computePreviewLists() : null;

  return (
    <div className="space-y-4">
      <LoadoutStats selection={selection} />

      {isSwapMode && (
        <div className="rounded-lg border border-amber-500 bg-amber-500/10 p-2 text-center text-sm">
          <span className="text-amber-700 dark:text-amber-300">
            Select a card to swap positions with
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 h-6 text-xs"
            onClick={handleCancelSwap}
          >
            Cancel
          </Button>
        </div>
      )}

      {selection.activeCards.length > 0 && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              ⚡ Active Loadout
              <div className="flex items-center gap-1">
                {onChangeMaxActiveCards && (
                  <SmartTooltip content="Decrease max active cards">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-5"
                      onClick={() => onChangeMaxActiveCards(-1)}
                      disabled={
                        maxActiveCards <= selection.activeCards.length ||
                        maxActiveCards <= 1
                      }
                    >
                      <Minus className="size-3" />
                    </Button>
                  </SmartTooltip>
                )}
                <Badge variant="secondary" className="text-xs">
                  {selection.activeCards.length}/{maxActiveCards}
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
              {onMoveCard && !isCoarse && (
                <span className="text-muted-foreground/60 text-[10px] font-normal normal-case">
                  (drag to reorder)
                </span>
              )}
            </h5>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(previewLists?.activeCards ?? selection.activeCards).map(
                (card, index) => {
                  const previewCard = card as PreviewCard;
                  const originalIndex = selection.activeCards.findIndex(
                    c => c.name === card.name
                  );
                  const displayIndex =
                    originalIndex >= 0 ? originalIndex : index;
                  return (
                    <DomainCardMini
                      key={card.name}
                      card={card}
                      location="active"
                      index={displayIndex}
                      onSwap={
                        onSwapToVault
                          ? () => onSwapToVault(card.name)
                          : undefined
                      }
                      onDragStart={onMoveCard ? handleDragStart : undefined}
                      onDragOver={
                        onMoveCard
                          ? e => handleDragOver(e, 'active', index)
                          : undefined
                      }
                      onDragEnd={onMoveCard ? handleDragEnd : undefined}
                      onDrop={
                        onMoveCard
                          ? () => handleDrop('active', index)
                          : undefined
                      }
                      isDragging={
                        dragSource?.location === 'active' &&
                        dragSource?.index === displayIndex
                      }
                      isDragOver={
                        dragOverTarget?.location === 'active' &&
                        dragOverTarget?.index === index
                      }
                      isCoarse={isCoarse}
                      isSwapMode={isSwapMode}
                      swapSource={swapSource}
                      onSelectForSwap={
                        onMoveCard ? handleSelectForSwap : undefined
                      }
                      onCancelSwap={handleCancelSwap}
                      isPreview={previewCard.isPreview}
                      isMovingAway={previewCard.isMovingAway}
                      onConvertToHomebrew={
                        onConvertToHomebrew
                          ? () => onConvertToHomebrew(card)
                          : undefined
                      }
                    />
                  );
                }
              )}
              {onMoveCard &&
                isDragging &&
                dragSource?.location === 'vault' &&
                selection.activeCards.length < maxActiveCards && (
                  <EndDropZone
                    location="active"
                    index={selection.activeCards.length}
                    onDragOver={e =>
                      handleDragOver(e, 'active', selection.activeCards.length)
                    }
                    onDrop={() =>
                      handleDrop('active', selection.activeCards.length)
                    }
                    isDragOver={
                      dragOverTarget?.location === 'active' &&
                      dragOverTarget?.index === selection.activeCards.length
                    }
                    isVisible={true}
                  />
                )}
            </div>
          </div>
        </>
      )}

      {selection.vaultCards.length > 0 && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              📦 Vault
              <Badge variant="secondary" className="text-xs">
                {selection.vaultCards.length}
              </Badge>
              {onMoveCard && !isCoarse && (
                <span className="text-muted-foreground/60 text-[10px] font-normal normal-case">
                  (drag to reorder)
                </span>
              )}
            </h5>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(previewLists?.vaultCards ?? selection.vaultCards).map(
                (card, index) => {
                  const previewCard = card as PreviewCard;
                  const originalIndex = selection.vaultCards.findIndex(
                    c => c.name === card.name
                  );
                  const displayIndex =
                    originalIndex >= 0 ? originalIndex : index;
                  return (
                    <DomainCardMini
                      key={card.name}
                      card={card}
                      location="vault"
                      index={displayIndex}
                      onSwap={
                        onSwapToActive
                          ? () => onSwapToActive(card.name)
                          : undefined
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
                        onMoveCard
                          ? () => handleDrop('vault', index)
                          : undefined
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
                      onSelectForSwap={
                        onMoveCard ? handleSelectForSwap : undefined
                      }
                      onCancelSwap={handleCancelSwap}
                      isPreview={previewCard.isPreview}
                      isMovingAway={previewCard.isMovingAway}
                      onConvertToHomebrew={
                        onConvertToHomebrew
                          ? () => onConvertToHomebrew(card)
                          : undefined
                      }
                    />
                  );
                }
              )}
              {onMoveCard &&
                isDragging &&
                dragSource?.location === 'active' && (
                  <EndDropZone
                    location="vault"
                    index={selection.vaultCards.length}
                    onDragOver={e =>
                      handleDragOver(e, 'vault', selection.vaultCards.length)
                    }
                    onDrop={() =>
                      handleDrop('vault', selection.vaultCards.length)
                    }
                    isDragOver={
                      dragOverTarget?.location === 'vault' &&
                      dragOverTarget?.index === selection.vaultCards.length
                    }
                    isVisible={true}
                  />
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function LoadoutDisplay({
  selection,
  onChange,
  classDomains,
  tier = '1',
  className,
  readOnly = false,
}: LoadoutDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSelection, setDraftSelection] =
    useState<LoadoutSelection>(selection);
  const [maxActiveCards, setMaxActiveCards] = useState(5);
  const [homebrewEditCard, setHomebrewEditCard] =
    useState<DomainCardLite | null>(null);
  const [homebrewDraft, setHomebrewDraft] = useState({
    name: '',
    level: 1,
    domain: 'Arcana',
    type: 'Spell',
    description: '',
    hopeCost: 1,
  });

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setDraftSelection(selection);
    }
    setIsEditing(prev => !prev);
  }, [isEditing, selection]);

  const handleSave = useCallback(() => {
    onChange?.(draftSelection);
  }, [draftSelection, onChange]);

  const handleCancel = useCallback(() => {
    setDraftSelection(selection);
  }, [selection]);

  const handleChange = useCallback((newSelection: LoadoutSelection) => {
    setDraftSelection(newSelection);
  }, []);

  const handleComplete = useCallback((completedSelection: LoadoutSelection) => {
    setDraftSelection(completedSelection);
  }, []);

  const handleChangeMaxActiveCards = useCallback(
    (delta: number) => {
      setMaxActiveCards(prev => {
        const next = prev + delta;
        if (next < 1 || next < selection.activeCards.length) return prev;
        return next;
      });
    },
    [selection.activeCards.length]
  );

  const handleOpenHomebrewEdit = useCallback((card: DomainCardLite) => {
    setHomebrewEditCard(card);
    setHomebrewDraft({
      name: card.name,
      level: card.level,
      domain: card.domain,
      type: card.type,
      description: card.description ?? '',
      hopeCost: card.hopeCost ?? 0,
    });
  }, []);

  const handleCloseHomebrewEdit = useCallback(() => {
    setHomebrewEditCard(null);
  }, []);

  const handleSaveHomebrew = useCallback(() => {
    if (!homebrewEditCard) return;
    const updatedCard: DomainCardLite = {
      name: homebrewDraft.name,
      level: homebrewDraft.level,
      domain: homebrewDraft.domain,
      type: homebrewDraft.type,
      description: homebrewDraft.description,
      hopeCost: homebrewDraft.hopeCost,
      recallCost: homebrewEditCard.recallCost,
      isHomebrew: true,
    };
    const originalName = homebrewEditCard.name;
    const inActive = selection.activeCards.some(c => c.name === originalName);
    const updated: LoadoutSelection = {
      ...selection,
      activeCards: inActive
        ? selection.activeCards.map(c =>
            c.name === originalName ? updatedCard : c
          )
        : selection.activeCards,
      vaultCards: !inActive
        ? selection.vaultCards.map(c =>
            c.name === originalName ? updatedCard : c
          )
        : selection.vaultCards,
    };
    onChange?.(updated);
    setHomebrewEditCard(null);
  }, [homebrewEditCard, homebrewDraft, selection, onChange]);

  const handleSwapToVault = useCallback(
    (cardName: string) => {
      const card = selection.activeCards.find(c => c.name === cardName);
      if (!card) return;
      const updated: LoadoutSelection = {
        ...selection,
        activeCards: selection.activeCards.filter(c => c.name !== cardName),
        vaultCards: [...selection.vaultCards, card],
      };
      onChange?.(updated);
    },
    [selection, onChange]
  );

  const handleSwapToActive = useCallback(
    (cardName: string) => {
      if (selection.activeCards.length >= maxActiveCards) return;
      const card = selection.vaultCards.find(c => c.name === cardName);
      if (!card) return;
      const updated: LoadoutSelection = {
        ...selection,
        vaultCards: selection.vaultCards.filter(c => c.name !== cardName),
        activeCards: [...selection.activeCards, card],
      };
      onChange?.(updated);
    },
    [selection, onChange, maxActiveCards]
  );

  const handleMoveCard = useCallback(
    (
      from: { location: 'active' | 'vault'; index: number },
      to: { location: 'active' | 'vault'; index: number }
    ) => {
      const fromCards =
        from.location === 'active'
          ? [...selection.activeCards]
          : [...selection.vaultCards];
      const toCards =
        to.location === 'active'
          ? [...selection.activeCards]
          : [...selection.vaultCards];

      if (from.location === to.location) {
        const cards = fromCards;
        const [movedCard] = cards.splice(from.index, 1);
        cards.splice(to.index, 0, movedCard);

        onChange?.({
          ...selection,
          [from.location === 'active' ? 'activeCards' : 'vaultCards']: cards,
        });
      } else {
        const shouldSwap =
          from.location === 'vault' &&
          to.location === 'active' &&
          selection.activeCards.length >= maxActiveCards &&
          to.index < toCards.length;

        if (shouldSwap) {
          const [cardToMove] = fromCards.splice(from.index, 1);
          const [cardToSwap] = toCards.splice(to.index, 1, cardToMove);
          fromCards.splice(from.index, 0, cardToSwap);

          onChange?.({
            ...selection,
            activeCards: toCards,
            vaultCards: fromCards,
          });
        } else {
          if (
            to.location === 'active' &&
            selection.activeCards.length >= maxActiveCards
          ) {
            return;
          }
          const [movedCard] = fromCards.splice(from.index, 1);
          toCards.splice(to.index, 0, movedCard);

          onChange?.({
            ...selection,
            activeCards: from.location === 'active' ? fromCards : toCards,
            vaultCards: from.location === 'vault' ? fromCards : toCards,
          });
        }
      }
    },
    [selection, onChange, maxActiveCards]
  );

  return (
    <EditableSection
      title="Domain Loadout"
      emoji="📜"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onCancel={handleCancel}
      showEditButton={!readOnly}
      modalSize="full"
      className={cn(className)}
      editTitle="Build Your Domain Loadout"
      editDescription="Select domain cards for your active loadout and vault."
      editContent={
        <LoadoutSelector
          value={draftSelection}
          onChange={handleChange}
          onComplete={handleComplete}
          classDomains={classDomains}
          tier={tier}
          hideHeader
        />
      }
    >
      <LoadoutContent
        selection={selection}
        onSwapToVault={readOnly ? undefined : handleSwapToVault}
        onSwapToActive={readOnly ? undefined : handleSwapToActive}
        onMoveCard={readOnly ? undefined : handleMoveCard}
        maxActiveCards={maxActiveCards}
        onChangeMaxActiveCards={
          readOnly ? undefined : handleChangeMaxActiveCards
        }
        onConvertToHomebrew={readOnly ? undefined : handleOpenHomebrewEdit}
      />

      <Dialog
        open={homebrewEditCard !== null}
        onOpenChange={open => !open && handleCloseHomebrewEdit()}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>🛠️</span>
              <span>Edit as Homebrew</span>
            </DialogTitle>
            <DialogDescription>
              Customize this domain card. Changes will mark it as homebrew.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <CardFormFields
              draft={homebrewDraft}
              onUpdate={updates =>
                setHomebrewDraft(prev => ({ ...prev, ...updates }))
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseHomebrewEdit}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveHomebrew}
              disabled={
                !homebrewDraft.name.trim() || !homebrewDraft.description.trim()
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EditableSection>
  );
}
