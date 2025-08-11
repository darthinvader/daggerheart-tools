import * as React from 'react';

import { cn } from '@/lib/utils';

export type JumpItem = { id: string; label: string };

export function QuickJump({ items }: { items: JumpItem[] }) {
  const [active, setActive] = React.useState<string | null>(
    items[0]?.id ?? null
  );
  const clickScrollingRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef<number | null>(null);

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
