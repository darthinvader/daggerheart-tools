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
        'quick-loadout-card-item',
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
      <div className="quick-loadout-card-header">
        <button
          type="button"
          onClick={event => {
            event.stopPropagation();
            toggleExpanded();
          }}
          className="quick-loadout-card-name"
        >
          {card.description && (
            <span className="text-muted-foreground shrink-0">
              {expanded ? (
                <ChevronDown className="size-2.5 sm:size-3" />
              ) : (
                <ChevronRight className="size-2.5 sm:size-3" />
              )}
            </span>
          )}
          <DomainIcon size={12} className="shrink-0 sm:size-[14px]" />
          <span className="truncate">{card.name}</span>
        </button>
        <div
          className="quick-loadout-card-costs"
          onClick={event => event.stopPropagation()}
        >
          <CardCostBadges costs={costs} compact />
        </div>
      </div>
      {card.description && expanded && (
        <p className="quick-loadout-card-description">{card.description}</p>
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
      <div className={cn('quick-loadout-empty', className)}>
        <Scroll className="size-4" />
        <span className="text-muted-foreground text-sm">No domain cards</span>
      </div>
    );
  }

  return (
    <div className={cn('quick-loadout-card', className)}>
      {/* Active cards */}
      {activeCards.length > 0 && (
        <div className="quick-loadout-section">
          <h4 className="quick-loadout-section-label">
            Active ({activeCards.length})
          </h4>
          <div className="quick-loadout-grid">
            {activeCards.map((card, i) => (
              <CardMiniDisplay key={i} card={card} />
            ))}
          </div>
        </div>
      )}

      {/* Vault cards */}
      {vaultCards.length > 0 && (
        <div className="quick-loadout-section">
          <h4 className="quick-loadout-section-label">
            Vault ({vaultCards.length})
          </h4>
          <div className="quick-loadout-grid">
            {vaultCards.map((card, i) => (
              <CardMiniDisplay key={i} card={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
