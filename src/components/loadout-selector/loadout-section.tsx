import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { DomainCardLite } from '@/lib/schemas/loadout';
import { countTotalRecallCost } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

import { LoadoutCardRow } from './loadout-card-row';

interface LoadoutSectionProps {
  title: string;
  emoji: string;
  cards: DomainCardLite[];
  location: 'active' | 'vault';
  maxCards: number;
  hasLimit: boolean;
  isFull: boolean;
  isSwapTarget: boolean;
  swapSourceCard: string | null;
  swapSourceLocation: 'active' | 'vault' | null;
  targetIsFull: boolean;
  borderClass: string;
  bgClass: string;
  fullTextClass: string;
  onMove: (cardName: string) => void;
  onRemove: (cardName: string) => void;
  onSelectSwapTarget: (cardName: string) => void;
  tooltipContent: string;
  canAdjustMax?: boolean;
  onDecreaseMax?: () => void;
  onIncreaseMax?: () => void;
}

export function LoadoutSection({
  title,
  emoji,
  cards,
  location,
  maxCards,
  hasLimit,
  isFull,
  isSwapTarget,
  swapSourceCard,
  swapSourceLocation,
  targetIsFull,
  borderClass,
  bgClass,
  fullTextClass,
  onMove,
  onRemove,
  onSelectSwapTarget,
  tooltipContent,
  canAdjustMax = false,
  onDecreaseMax,
  onIncreaseMax,
}: LoadoutSectionProps) {
  const totalRecall = countTotalRecallCost(cards);
  const inSwapMode = swapSourceCard !== null;

  return (
    <Card
      className={cn(
        borderClass,
        bgClass,
        'min-w-0 transition-all',
        isSwapTarget && 'border-amber-500 ring-2 ring-amber-500'
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <SmartTooltip
            side="top"
            className="max-w-xs"
            content={<p>{tooltipContent}</p>}
          >
            <span className="flex cursor-help items-center gap-2">
              <span>{emoji}</span>
              <span>{title}</span>
              {isSwapTarget && (
                <Badge
                  variant="outline"
                  className="border-amber-500 bg-amber-500/20 text-amber-700"
                >
                  👆 Select swap target
                </Badge>
              )}
            </span>
          </SmartTooltip>
          <div className="flex items-center gap-1">
            {canAdjustMax && onDecreaseMax && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-xs"
                onClick={onDecreaseMax}
                disabled={maxCards <= cards.length}
              >
                −
              </Button>
            )}
            <SmartTooltip
              side="top"
              content={
                <p>
                  {hasLimit
                    ? `${cards.length} of ${maxCards} slots used`
                    : `${cards.length} cards stored (no limit)`}
                </p>
              }
            >
              <Badge variant="outline" className="cursor-help font-mono">
                {cards.length}
                {hasLimit ? `/${maxCards}` : ' cards'}
              </Badge>
            </SmartTooltip>
            {canAdjustMax && onIncreaseMax && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-xs"
                onClick={onIncreaseMax}
              >
                +
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-48 min-w-0 space-y-2 overflow-y-auto">
        {cards.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {location === 'active'
              ? 'No active cards selected.'
              : 'No cards in vault.'}
          </p>
        ) : (
          <>
            {cards.map(card => (
              <LoadoutCardRow
                key={card.name}
                card={card}
                location={location}
                isSwapSource={
                  swapSourceLocation === location &&
                  swapSourceCard === card.name
                }
                isSwapTarget={isSwapTarget}
                targetIsFull={targetIsFull}
                onMove={onMove}
                onRemove={onRemove}
                onSelectSwapTarget={onSelectSwapTarget}
                inSwapMode={inSwapMode}
              />
            ))}
            <div className="text-muted-foreground flex justify-between border-t pt-2 text-xs">
              <SmartTooltip
                side="bottom"
                content={
                  <p>
                    Total Stress to recall all{' '}
                    {location === 'vault' ? 'vault' : 'active'} cards
                  </p>
                }
              >
                <span className="cursor-help">
                  Total Recall Cost: <strong>{totalRecall}</strong> Stress
                </span>
              </SmartTooltip>
              {isFull && <span className={fullTextClass}>✓ Full</span>}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
