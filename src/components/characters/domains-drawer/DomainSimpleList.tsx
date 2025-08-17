import * as React from 'react';

import { getAccent } from '@/components/characters/domain-styles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { DomainCard } from '@/lib/schemas/domains';
import { cn } from '@/lib/utils';

export type DomainSimpleListProps = {
  items: DomainCard[];
  inLoadout: (c: DomainCard) => boolean;
  // Optional override for selected styling; defaults to inLoadout
  isSelected?: (c: DomainCard) => boolean;
  disableAdd: boolean;
  addToLoadout: (c: DomainCard) => void;
  removeFromLoadout: (c: DomainCard) => void;
  onRemoveCompletely?: (c: DomainCard) => void;
  detailsVisibility?: 'selected' | 'always';
  // Whether to render the internal search box; defaults to true
  showSearch?: boolean;
};

export function DomainSimpleList({
  items,
  inLoadout,
  isSelected,
  disableAdd,
  addToLoadout,
  removeFromLoadout,
  onRemoveCompletely,
  detailsVisibility = 'selected',
  showSearch = true,
}: DomainSimpleListProps) {
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!showSearch) return items;
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(c => {
      const text =
        `${c.name}\n${c.description ?? ''}\n${c.domain}\n${c.type}\n${(c.tags ?? []).join(' ')}`.toLowerCase();
      return text.includes(q);
    });
  }, [items, query, showSearch]);

  return (
    <div className="space-y-3">
      {showSearch && (
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search domain cards…"
          aria-label="Search domain cards"
        />
      )}
      <div className="flex max-h-[40vh] flex-col gap-1 overflow-auto rounded-md border p-1">
        {filtered.length === 0 && (
          <div className="text-muted-foreground p-3 text-sm">
            No domain cards match your search.
          </div>
        )}
        {filtered.map(card => (
          <Row
            key={`${card.domain}:${card.name}`}
            card={card}
            inLoadout={inLoadout}
            isSelected={isSelected}
            disableAdd={disableAdd}
            addToLoadout={addToLoadout}
            removeFromLoadout={removeFromLoadout}
            onRemoveCompletely={onRemoveCompletely}
            detailsVisibility={detailsVisibility}
          />
        ))}
      </div>
    </div>
  );
}

function Row({
  card,
  inLoadout,
  isSelected,
  disableAdd,
  addToLoadout,
  removeFromLoadout,
  onRemoveCompletely,
  detailsVisibility,
}: {
  card: DomainCard;
  inLoadout: (c: DomainCard) => boolean;
  isSelected?: (c: DomainCard) => boolean;
  disableAdd: boolean;
  addToLoadout: (c: DomainCard) => void;
  removeFromLoadout: (c: DomainCard) => void;
  onRemoveCompletely?: (c: DomainCard) => void;
  detailsVisibility: 'selected' | 'always';
}) {
  const selected = (isSelected ?? inLoadout)(card);
  const { emoji, domainChip } = getAccent(card);
  const showDetails = detailsVisibility === 'always' || selected;
  return (
    <button
      type="button"
      onClick={() => {
        if (selected) removeFromLoadout(card);
        else if (!disableAdd) addToLoadout(card);
      }}
      className={cn(
        'hover:bg-accent/50 focus-visible:ring-ring w-full rounded text-left transition-colors focus:outline-none focus-visible:ring-2',
        selected && 'bg-accent/30 ring-ring ring-1'
      )}
    >
      <div className="p-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <span aria-hidden>{emoji}</span>
            <span className="truncate">{card.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {selected && (
              <span className="text-muted-foreground text-[11px]">
                Selected
              </span>
            )}
            {onRemoveCompletely && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                aria-label={`Remove ${card.name}`}
                onClick={e => {
                  e.stopPropagation();
                  onRemoveCompletely(card);
                }}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
        {showDetails && (
          <div className="bg-accent/10 mt-2 rounded-md border p-2 text-xs">
            <div className="text-muted-foreground mb-1 flex flex-wrap items-center gap-1">
              <span className={cn('rounded px-1 py-0.5', domainChip)}>
                {String(card.domain)}
              </span>
              <span>• L{card.level}</span>
              <span
                className={cn(
                  'rounded px-1 py-0.5',
                  String(card.type) === 'Ability'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200'
                    : 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-200'
                )}
              >
                {card.type}
              </span>
              {typeof card.hopeCost === 'number' && (
                <span className="rounded bg-emerald-100 px-1 py-0.5 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200">
                  Hope {card.hopeCost}
                </span>
              )}
              {typeof card.recallCost === 'number' && (
                <span className="rounded bg-purple-100 px-1 py-0.5 text-purple-900 dark:bg-purple-500/20 dark:text-purple-200">
                  Recall {card.recallCost}
                </span>
              )}
            </div>
            {Array.isArray(card.tags) && card.tags.length > 0 && (
              <div className="mb-1 flex flex-wrap gap-1">
                {card.tags.map(t => (
                  <span
                    key={t}
                    className="bg-muted text-muted-foreground rounded px-1 py-0.5 text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {card.description && (
              <div className="text-foreground/90 whitespace-pre-wrap">
                {card.description}
              </div>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

export default DomainSimpleList;
