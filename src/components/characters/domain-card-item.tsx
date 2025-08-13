import { memo } from 'react';

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
};

// Accent is now shared via domain-styles

function DomainCardItemImpl({
  card,
  context,
  inLoadout,
  disableAdd,
  hideActions,
  onAddToLoadout,
  onRemoveFromLoadout,
  onRemoveFromVault,
}: DomainCardItemProps) {
  const { emoji, borderClass, domainChip } = getAccent(card);
  const actionsLabel =
    context === 'vault'
      ? 'Vault actions'
      : context === 'loadout'
        ? 'Loadout actions'
        : 'Available card actions';

  return (
    <div
      className={cn(
        'border-b p-3 last:border-b-0',
        'border-l-4',
        borderClass,
        // Narrower card for vault rows
        context === 'vault' && 'mx-auto max-w-[460px] md:max-w-[520px]'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
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
          {card.description && (
            <div className="text-foreground/90 mt-2 text-sm whitespace-pre-wrap">
              {card.description}
            </div>
          )}
        </div>
        {!hideActions && (
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
            {context === 'available' &&
              (inLoadout ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  aria-label="Remove from Loadout"
                  onClick={() => onRemoveFromLoadout?.(card)}
                >
                  Remove
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  aria-label="Add to Loadout"
                  onClick={() => onAddToLoadout?.(card)}
                  disabled={disableAdd}
                >
                  Add
                </Button>
              ))}
            {context === 'loadout' && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                aria-label="Remove from Loadout"
                onClick={() => onRemoveFromLoadout?.(card)}
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
                    onClick={() => onRemoveFromLoadout?.(card)}
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
                    onClick={() => onAddToLoadout?.(card)}
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
                  onClick={() => onRemoveFromVault?.(card)}
                >
                  Remove from Vault
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export const DomainCardItem = memo(DomainCardItemImpl);
export default DomainCardItem;
