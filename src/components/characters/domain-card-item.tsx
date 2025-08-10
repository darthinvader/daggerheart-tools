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

// Emoji + color per domain (matches DomainNameEnum). Unknowns fall back by type.
const domainMap: Record<
  string,
  { emoji: string; border: string; chip: string }
> = {
  Arcana: {
    emoji: '🪄',
    border: 'border-indigo-500/80',
    chip: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-200',
  },
  Blade: {
    emoji: '🗡️',
    border: 'border-rose-500/80',
    chip: 'bg-rose-100 text-rose-900 dark:bg-rose-500/20 dark:text-rose-200',
  },
  Bone: {
    emoji: '💀',
    border: 'border-zinc-500/80',
    chip: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-500/20 dark:text-zinc-200',
  },
  Codex: {
    emoji: '📜',
    border: 'border-sky-500/80',
    chip: 'bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-200',
  },
  Grace: {
    emoji: '🕊️',
    border: 'border-fuchsia-500/80',
    chip: 'bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-500/20 dark:text-fuchsia-200',
  },
  Midnight: {
    emoji: '🌑',
    border: 'border-slate-500/80',
    chip: 'bg-slate-100 text-slate-900 dark:bg-slate-500/20 dark:text-slate-200',
  },
  Sage: {
    emoji: '🧠',
    border: 'border-emerald-600/80',
    chip: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200',
  },
  Splendor: {
    emoji: '✨',
    border: 'border-amber-500/80',
    chip: 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200',
  },
  Valor: {
    emoji: '🛡️',
    border: 'border-orange-500/80',
    chip: 'bg-orange-100 text-orange-900 dark:bg-orange-500/20 dark:text-orange-200',
  },
  // Present for completeness (no cards yet in data)
  Chaos: {
    emoji: '🌀',
    border: 'border-violet-500/80',
    chip: 'bg-violet-100 text-violet-900 dark:bg-violet-500/20 dark:text-violet-200',
  },
  Moon: {
    emoji: '🌙',
    border: 'border-blue-500/80',
    chip: 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-200',
  },
  Sun: {
    emoji: '☀️',
    border: 'border-yellow-500/80',
    chip: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-200',
  },
  Blood: {
    emoji: '🩸',
    border: 'border-red-500/80',
    chip: 'bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-200',
  },
  Fate: {
    emoji: '🧵',
    border: 'border-teal-500/80',
    chip: 'bg-teal-100 text-teal-900 dark:bg-teal-500/20 dark:text-teal-200',
  },
};

function getAccent(card: DomainCard) {
  const domainKey = String(card.domain);
  const themed = domainMap[domainKey];
  if (themed)
    return {
      emoji: themed.emoji,
      borderClass: themed.border,
      domainChip: themed.chip,
    };
  // fallback to type-based colors
  const isAbility = String(card.type) === 'Ability';
  return {
    emoji: isAbility ? '✨' : '📜',
    borderClass: isAbility ? 'border-amber-500/80' : 'border-blue-500/80',
    domainChip: 'bg-muted',
  };
}

export function DomainCardItem({
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
          <div className="truncate text-sm font-semibold">
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
          >
            {context === 'available' &&
              (inLoadout ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveFromLoadout?.(card)}
                >
                  Remove
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
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
                    className="w-full"
                    onClick={() => onRemoveFromLoadout?.(card)}
                  >
                    Remove from Loadout
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="w-full"
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
                  className="w-full"
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

export default DomainCardItem;
