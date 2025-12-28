import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { DomainCardLite } from '@/lib/schemas/loadout';

interface SectionTitleProps {
  emoji: string;
  title: string;
  isSwapTarget: boolean;
  tooltipContent: string;
}

export function SectionTitle({
  emoji,
  title,
  isSwapTarget,
  tooltipContent,
}: SectionTitleProps) {
  return (
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
  );
}

interface CardCountBadgeProps {
  cards: DomainCardLite[];
  maxCards: number;
  hasLimit: boolean;
  canAdjustMax: boolean;
  onDecreaseMax?: () => void;
  onIncreaseMax?: () => void;
}

export function CardCountBadge({
  cards,
  maxCards,
  hasLimit,
  canAdjustMax,
  onDecreaseMax,
  onIncreaseMax,
}: CardCountBadgeProps) {
  return (
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
  );
}

interface RecallCostFooterProps {
  totalRecall: number;
  location: 'active' | 'vault';
  isFull: boolean;
  fullTextClass: string;
}

export function RecallCostFooter({
  totalRecall,
  location,
  isFull,
  fullTextClass,
}: RecallCostFooterProps) {
  return (
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
  );
}
