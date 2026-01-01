import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import type { DomainCardLite, LoadoutSelection } from '@/lib/schemas/loadout';
import { DOMAIN_BG_COLORS, DOMAIN_EMOJIS } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

interface QuickLoadoutInfoProps {
  selection: LoadoutSelection;
  className?: string;
}

function CardMiniDisplay({ card }: { card: DomainCardLite }) {
  const [expanded, setExpanded] = useState(false);
  const domainEmoji = DOMAIN_EMOJIS[card.domain] ?? '📖';
  const domainBg = DOMAIN_BG_COLORS[card.domain] ?? '';
  const hopeCost = card.hopeCost ?? card.recallCost ?? 0;

  return (
    <div className={cn('rounded border p-2', domainBg)}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
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
          <span>{domainEmoji}</span>
          <span className="truncate">{card.name}</span>
        </button>
        <div className="flex shrink-0 items-center gap-1 text-xs">
          {hopeCost > 0 && (
            <Badge variant="secondary" className="px-1.5 py-0 text-xs">
              ✨ {hopeCost}
            </Badge>
          )}
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
          <span className="text-lg">📜</span>
          <span className="text-muted-foreground">No domain cards</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-card rounded-lg border p-3', className)}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">📜</span>
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
