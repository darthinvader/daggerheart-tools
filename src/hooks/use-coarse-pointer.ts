import * as React from 'react';

// Detects if the primary input is coarse (e.g., touch). Stable across renders.
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(pointer: coarse)');
    const onChange = () => setCoarse(mql.matches);
    // Prefer modern event listeners when available
    if (typeof (mql as MediaQueryList).addEventListener === 'function') {
      (mql as MediaQueryList).addEventListener('change', onChange);
      return () =>
        (mql as MediaQueryList).removeEventListener('change', onChange);
    }
    // Fallback: older Safari APIs (deprecated)
    type LegacyMql = MediaQueryList & {
      addListener?: (fn: (e: MediaQueryListEvent) => void) => void;
      removeListener?: (fn: (e: MediaQueryListEvent) => void) => void;
    };
    const legacyAdd = (mql as LegacyMql).addListener;
    if (typeof legacyAdd === 'function') {
      legacyAdd(onChange);
      return () => {
        const legacyRemove = (mql as LegacyMql).removeListener;
        legacyRemove?.(onChange);
      };
    }
    return;
  }, []);

  return coarse;
}
