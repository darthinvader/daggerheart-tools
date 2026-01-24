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
        'rounded border p-2',
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
      <div className="mb-1 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={event => {
            event.stopPropagation();
            toggleExpanded();
          }}
          className="flex items-center gap-1 text-left text-sm font-medium hover:opacity-80"
        >
          {card.description && (
            <span className="text-muted-foreground shrink-0">
              {expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </span>
          )}
          <DomainIcon size={14} className="shrink-0" />
          <span className="truncate">{card.name}</span>
        </button>
        <div
          className="flex shrink-0 items-center gap-1 text-xs"
          onClick={event => event.stopPropagation()}
        >
          <CardCostBadges costs={costs} compact />
        </div>
      </div>
      {card.description && expanded && (
        <p className="text-muted-foreground mt-1 text-xs whitespace-pre-line">
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
    <div className={cn('bg-card rounded-lg border p-3', className)}>
      <div className="mb-2 flex items-center gap-2">
        <Scroll className="size-5" />
        <span className="font-semibold">Domain Loadout</span>
        <span className="text-muted-foreground text-xs">
          ({activeCards.length} active, {vaultCards.length} vault)
        </span>
      </div>

      {/* Active cards */}
      {activeCards.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-muted-foreground text-xs font-medium uppercase">
            Active
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {activeCards.map((card, i) => (
              <CardMiniDisplay key={i} card={card} />
            ))}
          </div>
        </div>
      )}

      {/* Vault cards */}
      {vaultCards.length > 0 && (
        <div className="mt-3 space-y-2">
          <h4 className="text-muted-foreground text-xs font-medium uppercase">
            Vault
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {vaultCards.map((card, i) => (
              <CardMiniDisplay key={i} card={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
