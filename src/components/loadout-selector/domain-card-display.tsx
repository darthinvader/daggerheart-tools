import { memo, useCallback, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import {
  CardTypeIcons,
  DomainIcons,
  ICON_SIZE_MD,
  Package,
  Wrench,
  Zap,
} from '@/lib/icons';
import type { DomainCard } from '@/lib/schemas/domains';
import {
  CARD_TYPE_COLORS,
  DOMAIN_BG_COLORS,
  DOMAIN_COLORS,
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
  onHomebrewEdit?: (card: DomainCard) => void;
}

function SelectionIndicator({ type }: { type: SelectionType }) {
  const isActive = type === 'active';
  const isVault = type === 'vault';
  const isVisible = type !== null;

  return (
    <span
      className={cn(
        'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold',
        isVisible
          ? isActive
            ? 'bg-green-500 text-white'
            : 'bg-blue-500 text-white'
          : 'bg-transparent'
      )}
      aria-hidden={!isVisible}
    >
      {isActive ? (
        <Zap size={12} />
      ) : isVault ? (
        <Package size={12} />
      ) : (
        '\u00A0'
      )}
    </span>
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
  const DomainIcon = DomainIcons[domain];
  const TypeIcon = CardTypeIcons[type];

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      <Badge variant="outline" className={cn('shrink-0 text-xs', domainColor)}>
        {DomainIcon && (
          <DomainIcon size={ICON_SIZE_MD} className="mr-1 inline-block" />
        )}
        {domain}
      </Badge>
      <Badge variant="secondary" className={cn('shrink-0 text-xs', typeColor)}>
        {TypeIcon && (
          <TypeIcon size={ICON_SIZE_MD} className="mr-1 inline-block" />
        )}
        {type}
      </Badge>
      <Badge variant="outline" className="shrink-0 font-mono text-xs">
        Lvl {level}
      </Badge>
    </div>
  );
}

function getCardClassName(
  isSelected: boolean,
  selectionType: SelectionType,
  domainBg: string,
  isDisabled: boolean
): string {
  const base =
    'cursor-pointer transition-all hover:shadow-md border-2 h-full w-full min-w-0 max-w-full overflow-hidden box-border';

  if (isDisabled) {
    return cn(base, 'cursor-not-allowed opacity-50');
  }

  if (isSelected) {
    if (selectionType === 'active') {
      return cn(
        base,
        'border-green-500 bg-green-500/5 outline outline-2 -outline-offset-4 outline-green-500/50'
      );
    }
    if (selectionType === 'vault') {
      return cn(
        base,
        'border-blue-500 bg-blue-500/5 outline outline-2 -outline-offset-4 outline-blue-500/50'
      );
    }
    return cn(
      base,
      domainBg,
      'outline-primary outline outline-2 -outline-offset-4'
    );
  }

  return cn(base, 'hover:border-muted-foreground/50');
}

function DomainCardDisplayComponent({
  card,
  isSelected,
  isDisabled = false,
  onToggle,
  selectionType = null,
  onHomebrewEdit,
}: DomainCardDisplayProps) {
  const domainBg = DOMAIN_BG_COLORS[card.domain] ?? '';
  const costs = useMemo(() => getCardCosts(card), [card]);

  const handleClick = useCallback(() => {
    if (!isDisabled) onToggle(card);
  }, [isDisabled, onToggle, card]);

  const handleHomebrewClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onHomebrewEdit?.(card);
    },
    [card, onHomebrewEdit]
  );

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
      <CardHeader className="block! space-y-2 pt-3 pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-sm leading-tight font-semibold">
          <span className="min-w-0 truncate">{card.name}</span>
          <div className="flex items-center gap-1">
            {onHomebrewEdit && (
              <SmartTooltip content="Edit as Homebrew">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={handleHomebrewClick}
                >
                  <Wrench size={ICON_SIZE_MD} />
                </Button>
              </SmartTooltip>
            )}
            <SelectionIndicator type={selectionType} />
          </div>
        </CardTitle>
        <div className="flex flex-wrap items-center gap-1.5">
          <CardBadges
            domain={card.domain}
            type={card.type}
            level={card.level}
          />
          <div className="ml-auto">
            <CardCostBadges costs={costs} compact />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        <SmartTooltip
          side="bottom"
          className="max-w-sm"
          content={
            <p className="text-sm whitespace-pre-line">{card.description}</p>
          }
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
