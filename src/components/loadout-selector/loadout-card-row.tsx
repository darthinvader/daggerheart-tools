import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { DomainCardLite } from '@/lib/schemas/loadout';
import { DOMAIN_COLORS, DOMAIN_EMOJIS } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

interface LoadoutCardRowProps {
  card: DomainCardLite;
  location: 'active' | 'vault';
  isSwapSource: boolean;
  isSwapTarget: boolean;
  targetIsFull: boolean;
  onMove: (cardName: string) => void;
  onRemove: (cardName: string) => void;
  onSelectSwapTarget: (cardName: string) => void;
  inSwapMode: boolean;
}

function RecallCostBadge({ cost }: { cost: number }) {
  return (
    <SmartTooltip
      content={
        <p className="text-xs">
          Recall: {cost === 0 ? 'Free' : `${cost} Stress to swap from vault`}
        </p>
      }
    >
      <Badge
        variant={cost === 0 ? 'secondary' : 'outline'}
        className={cn(
          'shrink-0 cursor-help text-xs',
          cost > 0 && 'border-rose-500/50 text-rose-600'
        )}
      >
        ⚡{cost}
      </Badge>
    </SmartTooltip>
  );
}

function CardRowActions({
  cardName,
  isActive,
  targetIsFull,
  onMove,
  onRemove,
}: {
  cardName: string;
  isActive: boolean;
  targetIsFull: boolean;
  onMove: (cardName: string) => void;
  onRemove: (cardName: string) => void;
}) {
  const moveLabel = targetIsFull
    ? '🔄 Swap'
    : isActive
      ? '📦 Vault'
      : '⚡ Active';

  return (
    <div className="flex shrink-0 gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-7 px-2 text-xs',
          targetIsFull && 'text-amber-600 hover:text-amber-700'
        )}
        onClick={e => {
          e.stopPropagation();
          onMove(cardName);
        }}
      >
        {moveLabel}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive h-7 w-7 p-0"
        onClick={e => {
          e.stopPropagation();
          onRemove(cardName);
        }}
      >
        ✕
      </Button>
    </div>
  );
}

function getRowClassName(isSwapSource: boolean, isSwapTarget: boolean): string {
  const base =
    'flex items-center justify-between p-2 rounded border transition-all';

  if (isSwapSource) {
    return cn(base, 'border-amber-500 bg-amber-500/20 ring-2 ring-amber-500');
  }
  if (isSwapTarget) {
    return cn(
      base,
      'bg-background cursor-pointer hover:border-amber-500 hover:bg-amber-500/10'
    );
  }
  return cn(base, 'bg-background');
}

export function LoadoutCardRow({
  card,
  location,
  isSwapSource,
  isSwapTarget,
  targetIsFull,
  onMove,
  onRemove,
  onSelectSwapTarget,
  inSwapMode,
}: LoadoutCardRowProps) {
  const domainColor = DOMAIN_COLORS[card.domain] ?? '';
  const recallCost = card.hopeCost ?? card.recallCost ?? 0;

  return (
    <div
      className={getRowClassName(isSwapSource, isSwapTarget)}
      onClick={isSwapTarget ? () => onSelectSwapTarget(card.name) : undefined}
      role={isSwapTarget ? 'button' : undefined}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
        <Badge
          variant="outline"
          className={cn('shrink-0 text-xs', domainColor)}
        >
          {DOMAIN_EMOJIS[card.domain]}
        </Badge>
        <span className="min-w-0 flex-1 truncate text-sm">{card.name}</span>
        <Badge variant="secondary" className="shrink-0 text-xs">
          Lv{card.level}
        </Badge>
        <RecallCostBadge cost={recallCost} />
      </div>

      {!inSwapMode && (
        <CardRowActions
          cardName={card.name}
          isActive={location === 'active'}
          targetIsFull={targetIsFull}
          onMove={onMove}
          onRemove={onRemove}
        />
      )}

      {isSwapTarget && (
        <Badge className="shrink-0 bg-amber-500 text-white">
          Click to swap
        </Badge>
      )}
    </div>
  );
}
