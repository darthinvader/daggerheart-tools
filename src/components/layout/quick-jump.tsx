import * as React from 'react';

import { cn } from '@/lib/utils';

export type JumpItem = { id: string; label: string };

export function QuickJump({ items }: { items: JumpItem[] }) {
  const [active, setActive] = React.useState<string | null>(
    items[0]?.id ?? null
  );
  const clickScrollingRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef<number | null>(null);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  const getHeaderH = React.useCallback(() => {
    const header = document.getElementById('sheet-header');
    return header?.getBoundingClientRect().height ?? 56;
  }, []);

  const measureAndSetActive = React.useCallback(() => {
    if (clickScrollingRef.current) return; // don't fight the click selection
    const y = window.scrollY + getHeaderH() + 8;
    type Sect = { id: string; top: number; bottom: number };
    const sections: Sect[] = items
      .map(i => {
        const el = document.getElementById(i.id);
        if (!el) return null;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        return { id: i.id, top, bottom } as Sect;
      })
      .filter(Boolean) as Sect[];
    let current: string | null = sections[0]?.id ?? null;
    const within = sections.find(s => y >= s.top && y < s.bottom);
    if (within) {
      current = within.id;
    } else {
      // pick nearest by top distance
      let best: Sect | null = null;
      let bestDist = Infinity;
      for (const s of sections) {
        const d = Math.abs(y - s.top);
        if (d < bestDist) {
          best = s;
          bestDist = d;
        }
      }
      current = best?.id ?? current;
    }
    if (current !== active) setActive(current);
  }, [active, getHeaderH, items]);

  React.useEffect(() => {
    const onScroll = () => measureAndSetActive();
    const onResize = () => measureAndSetActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    // Initial compute
    measureAndSetActive();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [measureAndSetActive]);

  // Use IntersectionObserver to more reliably track active section under the sticky header.
  React.useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return; // fallback to scroll listener already set up
    }
    // Clean up any existing observer first
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const headerOffset = getHeaderH() + 8; // match scroll offset used elsewhere
    const rootMargin = `-${headerOffset}px 0px -60% 0px`;
    const thresholds = [0, 0.25, 0.5, 0.75, 1];

    const io = new IntersectionObserver(
      entries => {
        if (clickScrollingRef.current) return; // don't fight explicit navigation
        // Consider only intersecting sections and pick the one closest to the top after header
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length === 0) return;
        // Prefer the one with highest intersection ratio; tie-breaker by top proximity
        let best = visible[0];
        for (const e of visible) {
          if (e.intersectionRatio > best.intersectionRatio) {
            best = e;
          } else if (e.intersectionRatio === best.intersectionRatio) {
            const aTop = (best.boundingClientRect?.top ?? 0) - headerOffset;
            const bTop = (e.boundingClientRect?.top ?? 0) - headerOffset;
            if (Math.abs(bTop) < Math.abs(aTop)) best = e;
          }
        }
        const id = best.target.id;
        if (id && id !== active) setActive(id);
      },
      { root: null, rootMargin, threshold: thresholds }
    );

    // Observe all known section elements
    items.forEach(i => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });

    observerRef.current = io;

    // Recompute active on start in case we're mid-page
    measureAndSetActive();

    return () => {
      io.disconnect();
      if (observerRef.current === io) observerRef.current = null;
    };
  }, [items, getHeaderH, measureAndSetActive, active]);

  const scrollToId = React.useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      clickScrollingRef.current = true;
      setActive(id);
      const headerH = getHeaderH();
      const y = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
      if (scrollTimeoutRef.current)
        window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        clickScrollingRef.current = false;
        // After scroll completes, allow IO or fallback to update active
        measureAndSetActive();
      }, 450);
    },
    [getHeaderH, measureAndSetActive]
  );

  React.useEffect(
    () => () => {
      if (scrollTimeoutRef.current)
        window.clearTimeout(scrollTimeoutRef.current);
    },
    []
  );

  // On initial mount, if there's a hash in the URL matching an item, scroll to it and set active.
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash?.slice(1);
    if (!hash) return;
    if (!items.some(i => i.id === hash)) return;
    // Use the same path as clicks to ensure header offset and state sync.
    scrollToId(hash);
  }, [items, scrollToId]);

  // Keep in sync with hash changes from back/forward or external updates
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const onHashChange = () => {
      const hash = window.location.hash?.slice(1);
      if (!hash) return;
      if (!items.some(i => i.id === hash)) return;
      scrollToId(hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [items, scrollToId]);

  return (
    <div className="w-full">
      <div className="overflow-x-auto overflow-y-hidden px-1 py-0.5">
        <div className="mx-auto flex max-w-screen-sm gap-1.5">
          {items.map(i => {
            const isActive = i.id === active;
            return (
              <a
                key={i.id}
                href={`#${i.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'inline-flex min-w-[28px] items-center justify-center border-b px-0.5 py-0.5 text-[10px] font-medium transition-colors sm:text-[11px]',
                  isActive
                    ? 'border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground/80 border-transparent'
                )}
                onClick={e => {
                  e.preventDefault();
                  // Update hash for shareable deep-link without native jump
                  const nextHash = `#${i.id}`;
                  if (typeof window !== 'undefined') {
                    if (window.location.hash !== nextHash) {
                      // pushState avoids default hashjump; we control scroll offset
                      window.history.pushState({}, '', nextHash);
                    }
                  }
                  scrollToId(i.id);
                  // Nudge into view for native scrollbar users
                  (e.currentTarget as HTMLAnchorElement).scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest',
                  });
                }}
              >
                {i.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
