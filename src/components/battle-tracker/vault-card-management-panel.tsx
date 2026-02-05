import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  ScrollText,
  Sparkles,
  Star,
  X,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { BattleCard, CharacterTracker } from './types';

interface VaultCardManagementPanelProps {
  character: CharacterTracker;
  onMoveToLoadout: (card: BattleCard, cardIndex: number) => void;
  onMoveToVault: (card: BattleCard, cardIndex: number) => void;
  onRemoveFromLoadout?: (cardIndex: number) => void;
  onRemoveFromVault?: (cardIndex: number) => void;
}

function CardItem({
  card,
  location,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  card: BattleCard;
  location: 'loadout' | 'vault';
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
}) {
  const isLoadout = location === 'loadout';

  return (
    <div
      className={cn(
        'group rounded-lg border p-2 transition-all',
        isLoadout
          ? 'border-amber-500/30 bg-amber-500/5'
          : 'border-muted-foreground/20 bg-muted/20'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="min-w-0 flex-1 cursor-help">
                <div className="flex items-center gap-1.5">
                  <ScrollText
                    className={cn(
                      'size-3.5 shrink-0',
                      isLoadout ? 'text-amber-500' : 'text-muted-foreground'
                    )}
                  />
                  <span className="truncate text-sm font-medium">
                    {card.name}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <Badge variant="outline" className="text-[10px]">
                    {card.domain}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    Lv {card.level}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-muted-foreground text-[10px]"
                  >
                    {card.type}
                  </Badge>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <div className="space-y-1">
                <p className="font-semibold">{card.name}</p>
                <p className="text-muted-foreground text-xs">
                  {card.domain} - Level {card.level} {card.type}
                </p>
                <p className="text-sm">{card.description}</p>
                {(card.hopeCost || card.stressCost || card.recallCost) && (
                  <div className="flex gap-2 pt-1 text-xs">
                    {card.hopeCost !== undefined && card.hopeCost > 0 && (
                      <span className="flex items-center gap-0.5 text-amber-500">
                        <Star className="size-3" /> {card.hopeCost} Hope
                      </span>
                    )}
                    {card.stressCost !== undefined && card.stressCost > 0 && (
                      <span className="flex items-center gap-0.5 text-purple-500">
                        <Zap className="size-3" /> {card.stressCost} Stress
                      </span>
                    )}
                    {card.recallCost !== undefined && card.recallCost > 0 && (
                      <span className="text-muted-foreground">
                        Recall: {card.recallCost}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="ml-2 flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onMoveUp && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={onMoveUp}
                  >
                    <ArrowUp className="size-3 text-green-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Move to active loadout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {onMoveDown && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={onMoveDown}
                  >
                    <ArrowDown className="text-muted-foreground size-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Move to vault</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {onRemove && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={onRemove}
                  >
                    <X className="text-destructive size-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove card</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Cost indicators */}
      {(card.hopeCost || card.stressCost) && (
        <div className="mt-1.5 flex gap-2 text-[10px]">
          {card.hopeCost !== undefined && card.hopeCost > 0 && (
            <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
              <Star className="size-2.5" /> {card.hopeCost}
            </span>
          )}
          {card.stressCost !== undefined && card.stressCost > 0 && (
            <span className="flex items-center gap-0.5 text-purple-600 dark:text-purple-400">
              <Zap className="size-2.5" /> {card.stressCost}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyCardSection({
  type,
  icon,
}: {
  type: 'loadout' | 'vault';
  icon: React.ReactNode;
}) {
  return (
    <div className="border-muted-foreground/30 bg-muted/10 rounded-lg border-2 border-dashed p-3 text-center">
      <div className="text-muted-foreground mx-auto mb-1 flex size-6 items-center justify-center opacity-50">
        {icon}
      </div>
      <p className="text-muted-foreground text-[10px]">
        {type === 'loadout' ? 'No active cards' : 'No cards in vault'}
      </p>
    </div>
  );
}

export function VaultCardManagementPanel({
  character,
  onMoveToLoadout,
  onMoveToVault,
  onRemoveFromLoadout,
  onRemoveFromVault,
}: VaultCardManagementPanelProps) {
  const loadout = character.loadout ?? [];
  const vaultCards = character.vaultCards ?? [];
  const totalCards = loadout.length + vaultCards.length;

  if (totalCards === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="text-primary size-4" />
          <span className="text-sm font-semibold">Domain Cards</span>
        </div>
        <div className="border-muted-foreground/30 bg-muted/20 rounded-lg border-2 border-dashed p-4 text-center">
          <ScrollText className="text-muted-foreground mx-auto mb-2 size-6 opacity-50" />
          <p className="text-muted-foreground text-xs">No domain cards</p>
          <p className="text-muted-foreground mt-1 text-[10px]">
            Cards from the character sheet will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="text-primary size-4" />
          <span className="text-sm font-semibold">Domain Cards</span>
          <Badge variant="secondary" className="text-[10px]">
            {totalCards}
          </Badge>
        </div>
      </div>

      {/* Active Loadout Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-amber-500" />
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Active Loadout
          </span>
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-600"
          >
            {loadout.length}
          </Badge>
        </div>
        <ScrollArea className="max-h-48">
          <div className="space-y-1.5 pr-2">
            {loadout.length === 0 ? (
              <EmptyCardSection
                type="loadout"
                icon={<Sparkles className="size-4" />}
              />
            ) : (
              loadout.map((card, index) => (
                <CardItem
                  key={`loadout-${card.name}-${index}`}
                  card={card}
                  location="loadout"
                  onMoveDown={() => onMoveToVault(card, index)}
                  onRemove={
                    onRemoveFromLoadout
                      ? () => onRemoveFromLoadout(index)
                      : undefined
                  }
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Vault Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="text-muted-foreground size-3.5" />
          <span className="text-muted-foreground text-xs font-medium">
            Vault (Stored)
          </span>
          <Badge variant="outline" className="text-[10px]">
            {vaultCards.length}
          </Badge>
        </div>
        <ScrollArea className="max-h-48">
          <div className="space-y-1.5 pr-2">
            {vaultCards.length === 0 ? (
              <EmptyCardSection
                type="vault"
                icon={<BookOpen className="size-4" />}
              />
            ) : (
              vaultCards.map((card, index) => (
                <CardItem
                  key={`vault-${card.name}-${index}`}
                  card={card}
                  location="vault"
                  onMoveUp={() => onMoveToLoadout(card, index)}
                  onRemove={
                    onRemoveFromVault
                      ? () => onRemoveFromVault(index)
                      : undefined
                  }
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
