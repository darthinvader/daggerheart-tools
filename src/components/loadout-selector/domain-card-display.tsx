import { memo, useCallback, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { DomainCard } from '@/lib/schemas/domains';
import {
  CARD_TYPE_COLORS,
  DOMAIN_BG_COLORS,
  DOMAIN_COLORS,
  DOMAIN_EMOJIS,
} from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';
import { getCardCosts } from '@/lib/utils/card-costs';

import { CardCostBadges } from './card-cost-badges';

type SelectionType = 'active' | 'vault' | null;

interface DomainCardDisplayProps {
  card: DomainCard;
  isSelected: boolean;
  isDisabled?: boolean;
  onToggle: (card: DomainCard) => void;
  selectionType?: SelectionType;
}

function SelectionIndicator({ type }: { type: SelectionType }) {
  if (!type) return null;

  const isActive = type === 'active';
  return (
    <div
      className={cn(
        'absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white',
        isActive ? 'bg-green-500' : 'bg-blue-500'
      )}
    >
      {isActive ? '⚡' : '📦'}
    </div>
  );
}

interface CardBadgesProps {
  domain: string;
  type: string;
  level: number;
}

function CardBadges({ domain, type, level }: CardBadgesProps) {
  const domainColor = DOMAIN_COLORS[domain] ?? 'text-foreground';
  const typeColor = CARD_TYPE_COLORS[type] ?? 'text-muted-foreground';
  const typeEmoji = type === 'Spell' ? '✨' : type === 'Grimoire' ? '📖' : '💪';

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className={cn('text-xs', domainColor)}>
          {DOMAIN_EMOJIS[domain]} {domain}
        </Badge>
        <Badge variant="secondary" className={cn('text-xs', typeColor)}>
          {typeEmoji} {type}
        </Badge>
      </div>
      <Badge variant="outline" className="font-mono text-xs">
        Lvl {level}
      </Badge>
    </>
  );
}

function getCardClassName(
  isSelected: boolean,
  selectionType: SelectionType,
  domainBg: string,
  isDisabled: boolean
): string {
  const base =
    'cursor-pointer transition-all hover:shadow-md border-2 relative h-full overflow-hidden';

  if (isDisabled) {
    return cn(base, 'cursor-not-allowed opacity-50');
  }

  if (isSelected) {
    if (selectionType === 'active') {
      return cn(
        base,
        'border-green-500 bg-green-500/5 ring-2 ring-green-500/50'
      );
    }
    if (selectionType === 'vault') {
      return cn(base, 'border-blue-500 bg-blue-500/5 ring-2 ring-blue-500/50');
    }
    return cn(base, domainBg, 'ring-primary ring-2');
  }

  return cn(base, 'hover:border-muted-foreground/50');
}

function DomainCardDisplayComponent({
  card,
  isSelected,
  isDisabled = false,
  onToggle,
  selectionType = null,
}: DomainCardDisplayProps) {
  const domainBg = DOMAIN_BG_COLORS[card.domain] ?? '';
  const costs = useMemo(() => getCardCosts(card), [card]);

  const handleClick = useCallback(() => {
    if (!isDisabled) onToggle(card);
  }, [isDisabled, onToggle, card]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onToggle(card);
      }
    },
    [isDisabled, onToggle, card]
  );

  const cardClassName = getCardClassName(
    isSelected,
    selectionType,
    domainBg,
    isDisabled
  );

  return (
    <Card
      className={cardClassName}
      onClick={handleClick}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
    >
      <SelectionIndicator type={selectionType} />

      <CardHeader className="pt-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1 overflow-hidden">
            <CardTitle className="truncate text-sm leading-tight font-semibold">
              {card.name}
            </CardTitle>
            <CardBadges
              domain={card.domain}
              type={card.type}
              level={card.level}
            />
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <CardCostBadges costs={costs} compact />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        <SmartTooltip
          side="bottom"
          className="max-w-sm"
          content={<p className="text-sm">{card.description}</p>}
        >
          <CardDescription className="line-clamp-3 cursor-help text-xs">
            {card.description}
          </CardDescription>
        </SmartTooltip>
      </CardContent>
    </Card>
  );
}

export const DomainCardDisplay = memo(DomainCardDisplayComponent);
