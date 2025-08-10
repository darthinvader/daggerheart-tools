import * as React from 'react';

// Returns true after `delayMs` once `active` is true; resets to false when inactive.
export function useMeasureReady(active: boolean, delayMs = 300): boolean {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!active) {
      setReady(false);
      return;
    }
    setReady(false);
    const id = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(id);
  }, [active, delayMs]);

  return ready;
}
