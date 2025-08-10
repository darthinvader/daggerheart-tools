import * as React from 'react';

// Returns a stable viewport height in pixels. It locks to the largest
// observed height so UI doesn't remain shrunk after software keyboards hide.
// It also runs a short sampling "settle" pass on open, resize/orientation, and
// focusout to accommodate browsers that delay visualViewport updates.
export function useStableViewportHeight(open?: boolean): number | null {
  const [vh, setVh] = React.useState<number | null>(null);
  const maxRef = React.useRef<number>(0);
  const rafRef = React.useRef<number | null>(null);
  const toRef = React.useRef<number | null>(null);

  const read = React.useCallback(() => {
    const vv =
      typeof window !== 'undefined' ? window.visualViewport : undefined;
    const a = vv?.height ?? 0;
    const b = typeof window !== 'undefined' ? window.innerHeight : 0;
    const c =
      typeof document !== 'undefined'
        ? document.documentElement.clientHeight
        : 0;
    // Prefer the larger realistic viewport heights
    return Math.max(a, b, c);
  }, []);

  const growTo = React.useCallback(
    (h: number) => {
      if (h > maxRef.current) {
        maxRef.current = h;
        setVh(h);
      } else if (vh == null) {
        setVh(maxRef.current || h);
      }
    },
    [vh]
  );

  const settle = React.useCallback(
    (durationMs = 500) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      const tick = () => {
        growTo(read());
        if (performance.now() - start < durationMs) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
      if (toRef.current) clearTimeout(toRef.current);
      toRef.current = window.setTimeout(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }, durationMs + 50);
    },
    [growTo, read]
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    // Initialize from current measurement and run a short settle.
    growTo(read());
    settle(400);

    const vv = window.visualViewport;
    const onVVResize = () => {
      // Grow immediately; some browsers won't fire after keyboard hide
      growTo(read());
    };
    const onResize = () => settle(500);
    const onFocusOut = () => {
      // Give the browser a moment to restore layout, then settle.
      window.setTimeout(() => settle(500), 50);
    };

    vv?.addEventListener('resize', onVVResize);
    vv?.addEventListener('scroll', onVVResize);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    window.addEventListener('focusout', onFocusOut, true);

    return () => {
      vv?.removeEventListener('resize', onVVResize);
      vv?.removeEventListener('scroll', onVVResize);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.removeEventListener('focusout', onFocusOut, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (toRef.current) clearTimeout(toRef.current);
    };
  }, [growTo, read, settle]);

  // Re-run settle when the drawer opens to capture the correct max height.
  React.useEffect(() => {
    if (!open) return;
    if (typeof window === 'undefined') return;
    settle(500);
  }, [open, settle]);

  return vh;
}
