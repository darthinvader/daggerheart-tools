import { ChevronDown, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CardCostBadges } from '@/components/loadout-selector/card-cost-badges';
import { DomainIcons, Scroll } from '@/lib/icons';
import type { DomainCardLite, LoadoutSelection } from '@/lib/schemas/loadout';
import { DOMAIN_BG_COLORS } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';
import { getCardCosts } from '@/lib/utils/card-costs';

interface QuickLoadoutInfoProps {
  selection: LoadoutSelection;
  className?: string;
}

function CardMiniDisplay({ card }: { card: DomainCardLite }) {
  const [expanded, setExpanded] = useState(false);
  const DomainIcon = DomainIcons[card.domain] ?? Scroll;
  const domainBg = DOMAIN_BG_COLORS[card.domain] ?? '';
  const costs = useMemo(() => getCardCosts(card), [card]);
  const hasDescription = Boolean(card.description?.trim());

  const toggleExpanded = () => {
    if (hasDescription) {
      setExpanded(prev => !prev);
    }
  };

  return (
    <div
      className={cn(
        'rounded border p-1.5 sm:p-2',
        domainBg,
        hasDescription && 'cursor-pointer hover:opacity-90'
      )}
      onClick={toggleExpanded}
      role={hasDescription ? 'button' : undefined}
      tabIndex={hasDescription ? 0 : undefined}
      onKeyDown={event => {
        if (!hasDescription) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleExpanded();
        }
      }}
    >
      <div className="mb-0.5 flex items-center justify-between gap-1 sm:mb-1 sm:gap-2">
        <button
          type="button"
          onClick={event => {
            event.stopPropagation();
            toggleExpanded();
          }}
          className="flex items-center gap-0.5 text-left text-xs font-medium hover:opacity-80 sm:gap-1 sm:text-sm"
        >
          {card.description && (
            <span className="text-muted-foreground shrink-0">
              {expanded ? (
                <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              ) : (
                <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              )}
            </span>
          )}
          <DomainIcon size={12} className="shrink-0 sm:size-[14px]" />
          <span className="truncate">{card.name}</span>
        </button>
        <div
          className="flex shrink-0 items-center gap-0.5 text-[10px] sm:gap-1 sm:text-xs"
          onClick={event => event.stopPropagation()}
        >
          <CardCostBadges costs={costs} compact />
        </div>
      </div>
      {card.description && expanded && (
        <p className="text-muted-foreground mt-0.5 text-[10px] whitespace-pre-line sm:mt-1 sm:text-xs">
          {card.description}
        </p>
      )}
    </div>
  );
}

export function QuickLoadoutInfo({
  selection,
  className,
}: QuickLoadoutInfoProps) {
  const activeCards = selection?.activeCards ?? [];
  const vaultCards = selection?.vaultCards ?? [];
  const hasCards = activeCards.length > 0 || vaultCards.length > 0;

  if (!hasCards) {
    return (
      <div className={cn('bg-card rounded-lg border p-3', className)}>
        <div className="flex items-center gap-2">
          <Scroll className="size-5" />
          <span className="text-muted-foreground">No domain cards</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-card rounded-lg border p-2 sm:p-3', className)}>
      <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
        <Scroll className="size-4 sm:size-5" />
        <span className="text-sm font-semibold sm:text-base">
          Domain Loadout
        </span>
        <span className="text-muted-foreground text-[10px] sm:text-xs">
          ({activeCards.length} active, {vaultCards.length} vault)
        </span>
      </div>

      {/* Active cards */}
      {activeCards.length > 0 && (
        <div className="space-y-1 sm:space-y-2">
          <h4 className="text-muted-foreground text-[10px] font-medium uppercase sm:text-xs">
            Active
          </h4>
          <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-2">
            {activeCards.map((card, i) => (
              <CardMiniDisplay key={i} card={card} />
            ))}
          </div>
        </div>
      )}

      {/* Vault cards */}
      {vaultCards.length > 0 && (
        <div className="mt-2 space-y-1 sm:mt-3 sm:space-y-2">
          <h4 className="text-muted-foreground text-[10px] font-medium uppercase sm:text-xs">
            Vault
          </h4>
          <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-2">
            {vaultCards.map((card, i) => (
              <CardMiniDisplay key={i} card={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
