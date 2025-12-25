import { Badge } from '@/components/ui/badge';
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
}: LoadoutSectionProps) {
  const totalRecall = countTotalRecallCost(cards);
  const inSwapMode = swapSourceCard !== null;

  return (
    <Card
      className={cn(
        borderClass,
        bgClass,
        'overflow-hidden transition-all',
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
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-48 space-y-2 overflow-y-auto">
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
