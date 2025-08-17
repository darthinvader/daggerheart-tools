import { memo, useEffect, useRef } from 'react';

import { getAccent } from '@/components/characters/domain-styles';
import { Button } from '@/components/ui/button';
import type { DomainCard } from '@/lib/schemas/domains';
import { cn } from '@/lib/utils';

type Ctx = 'available' | 'loadout' | 'vault';

export type DomainCardItemProps = {
  card: DomainCard;
  context: Ctx;
  inLoadout?: boolean;
  disableAdd?: boolean;
  hideActions?: boolean;
  onAddToLoadout?: (card: DomainCard) => void;
  onRemoveFromLoadout?: (card: DomainCard) => void;
  onRemoveFromVault?: (card: DomainCard) => void;
  // Optional: provided by VirtualList to re-measure dynamic rows
  measureElement?: (el: Element | null) => void;
};

// Accent is now shared via domain-styles

function CardContent({
  card,
  showDescription,
}: {
  card: DomainCard;
  showDescription: boolean;
}) {
  const { emoji, domainChip } = getAccent(card);
  return (
    <>
      <div className="text-[13px] leading-snug font-semibold break-words">
        <span className="mr-1" aria-hidden>
          {emoji}
        </span>
        {card.name}
      </div>
      <div className="text-muted-foreground mt-0.5 text-xs">
        <span className={cn('mr-1 rounded px-1 py-0.5', domainChip)}>
          {String(card.domain)}
        </span>
        • L{card.level} •
        <span
          className={cn(
            'ml-1 inline-flex items-center rounded px-1 py-0.5',
            String(card.type) === 'Ability'
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200'
              : 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-200'
          )}
        >
          {card.type}
        </span>
        {typeof card.hopeCost === 'number' && (
          <span className="ml-1 rounded bg-emerald-100 px-1 py-0.5 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200">
            Hope {card.hopeCost}
          </span>
        )}
        {typeof card.recallCost === 'number' && (
          <span className="ml-1 rounded bg-purple-100 px-1 py-0.5 text-purple-900 dark:bg-purple-500/20 dark:text-purple-200">
            Recall {card.recallCost}
          </span>
        )}
      </div>
      {Array.isArray(card.tags) && card.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {card.tags.map(t => (
            <span
              key={t}
              className="bg-muted text-muted-foreground rounded px-1 py-0.5 text-xs"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {card.description && showDescription && (
        <div className="text-foreground/90 mt-2 text-sm whitespace-pre-wrap">
          {card.description}
        </div>
      )}
    </>
  );
}

function CardMain({
  card,
  context,
  inLoadout,
  disableAdd,
  onAddToLoadout,
  onRemoveFromLoadout,
}: Pick<
  DomainCardItemProps,
  | 'card'
  | 'context'
  | 'inLoadout'
  | 'disableAdd'
  | 'onAddToLoadout'
  | 'onRemoveFromLoadout'
>) {
  const isAvailable = context === 'available';
  const canAdd = isAvailable && !inLoadout && !disableAdd && !!onAddToLoadout;
  const canRemove = isAvailable && inLoadout && !!onRemoveFromLoadout;

  const showDescription = context !== 'available' || !!inLoadout;

  if (isAvailable) {
    return (
      <button
        type="button"
        className={cn('w-full min-w-0 cursor-pointer text-left')}
        aria-label={
          inLoadout
            ? `Remove ${card.name} from Loadout`
            : `Add ${card.name} to Loadout`
        }
        onClick={() => {
          if (canAdd) onAddToLoadout?.(card);
          else if (canRemove) onRemoveFromLoadout?.(card);
        }}
      >
        <CardContent card={card} showDescription={showDescription} />
      </button>
    );
  }

  return (
    <div className="min-w-0">
      <CardContent card={card} showDescription={showDescription} />
    </div>
  );
}

function CardActions({
  context,
  inLoadout,
  disableAdd,
  onAddToLoadout,
  onRemoveFromLoadout,
  onRemoveFromVault,
  card,
}: Pick<
  DomainCardItemProps,
  | 'context'
  | 'inLoadout'
  | 'disableAdd'
  | 'onAddToLoadout'
  | 'onRemoveFromLoadout'
  | 'onRemoveFromVault'
  | 'card'
>) {
  const actionsLabel =
    context === 'vault'
      ? 'Vault actions'
      : context === 'loadout'
        ? 'Loadout actions'
        : 'Available card actions';

  return (
    <div
      className={cn(
        'flex shrink-0 gap-2',
        context === 'vault'
          ? 'w-36 flex-col items-stretch sm:w-40'
          : 'items-center'
      )}
      role="group"
      aria-label={actionsLabel}
    >
      {context === 'loadout' && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label="Remove from Loadout"
          onClick={() => onRemoveFromLoadout?.(card!)}
        >
          Remove
        </Button>
      )}
      {context === 'vault' && (
        <>
          {inLoadout ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-11 min-h-[44px] w-full"
              aria-label="Remove from Loadout"
              onClick={() => onRemoveFromLoadout?.(card!)}
            >
              Remove from Loadout
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-11 min-h-[44px] w-full"
              aria-label="Add to Loadout"
              onClick={() => onAddToLoadout?.(card!)}
              disabled={disableAdd}
            >
              Add to Loadout
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-11 min-h-[44px] w-full"
            aria-label="Remove from Vault"
            onClick={() => onRemoveFromVault?.(card!)}
          >
            Remove from Vault
          </Button>
        </>
      )}
    </div>
  );
}

function DomainCardItemImpl({
  card,
  context,
  inLoadout,
  disableAdd,
  hideActions,
  onAddToLoadout,
  onRemoveFromLoadout,
  onRemoveFromVault,
  measureElement,
}: DomainCardItemProps) {
  const { borderClass } = getAccent(card);
  const selected = context === 'available' ? !!inLoadout : false;
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Re-measure when selection/description visibility changes to update row height
  useEffect(() => {
    if (measureElement) measureElement(rootRef.current);
  }, [measureElement, selected, card.description]);

  return (
    <div
      ref={rootRef}
      className={cn(
        // Reduce compaction by ensuring a reasonable minimum height, and use tighter padding to curb large gaps
        'min-h-[56px] p-2.5 sm:p-3',
        'border-l-4',
        borderClass,
        // Available items: narrow when not selected, expand when selected
        context === 'available' &&
          !selected &&
          'mx-auto max-w-[460px] md:max-w-[520px]',
        context === 'vault' && 'mx-auto max-w-[460px] md:max-w-[520px]',
        // Highlight selected available card
        selected && 'bg-accent/20 ring-accent ring-1'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <CardMain
          card={card}
          context={context}
          inLoadout={inLoadout}
          disableAdd={disableAdd}
          onAddToLoadout={onAddToLoadout}
          onRemoveFromLoadout={onRemoveFromLoadout}
        />
        {!hideActions && context !== 'available' && (
          <CardActions
            context={context}
            inLoadout={inLoadout}
            disableAdd={disableAdd}
            onAddToLoadout={onAddToLoadout}
            onRemoveFromLoadout={onRemoveFromLoadout}
            onRemoveFromVault={onRemoveFromVault}
            card={card}
          />
        )}
      </div>
    </div>
  );
}
export const DomainCardItem = memo(DomainCardItemImpl);
export default DomainCardItem;
