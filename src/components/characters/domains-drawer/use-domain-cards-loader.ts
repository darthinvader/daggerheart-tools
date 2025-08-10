import * as React from 'react';

import type { DomainCard } from '@/lib/schemas/domains';

export function useDomainCardsLoader(
  open: boolean,
  allCards?: DomainCard[] | null
) {
  const [cardsLocal, setCardsLocal] = React.useState<DomainCard[] | null>(
    allCards ?? null
  );

  const loadCards = React.useCallback(async () => {
    const mod = await import('@/lib/data/domains');
    const keys = Object.keys(mod).filter(k => k.endsWith('_DOMAIN_CARDS'));
    const flat = keys.flatMap(
      k => (mod as Record<string, unknown>)[k] as DomainCard[]
    );
    return flat as DomainCard[];
  }, []);

  // Idle prefetch on mount
  React.useEffect(() => {
    if (allCards) return;
    if (cardsLocal !== null) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const w = window as unknown as {
      requestIdleCallback?: (
        cb: IdleRequestCallback,
        opts?: { timeout?: number }
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(
        () => {
          loadCards()
            .then(flat => {
              if (!cancelled) setCardsLocal(flat);
            })
            .catch(() => {
              if (!cancelled) setCardsLocal([]);
            });
        },
        { timeout: 1500 }
      );
      cleanup = () => w.cancelIdleCallback?.(id);
    } else {
      const id = window.setTimeout(() => {
        loadCards()
          .then(flat => {
            if (!cancelled) setCardsLocal(flat);
          })
          .catch(() => {
            if (!cancelled) setCardsLocal([]);
          });
      }, 300);
      cleanup = () => window.clearTimeout(id);
    }
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [allCards, cardsLocal, loadCards]);

  // Ensure cards are loaded when opened
  React.useEffect(() => {
    if (!open) return;
    if (allCards) return;
    if (cardsLocal !== null) return;
    let cancelled = false;
    loadCards()
      .then(flat => {
        if (!cancelled) setCardsLocal(flat);
      })
      .catch(() => {
        if (!cancelled) setCardsLocal([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, allCards, cardsLocal, loadCards]);

  const cards: DomainCard[] = React.useMemo(
    () => allCards ?? cardsLocal ?? [],
    [allCards, cardsLocal]
  );
  const isLoadingCards = !allCards && open && cardsLocal === null;

  return { cards, isLoadingCards } as const;
}
