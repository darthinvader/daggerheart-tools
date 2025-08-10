import * as React from 'react';

export function useBaselineSnapshot<T>(open: boolean, getValues: () => T) {
  const baselineRef = React.useRef<T | null>(null);
  const prevOpenRef = React.useRef(open);

  React.useEffect(() => {
    // When opening for the first time or re-opening after a close, capture a fresh baseline.
    if (open && (!prevOpenRef.current || baselineRef.current === null)) {
      try {
        const vals = getValues();
        baselineRef.current = JSON.parse(JSON.stringify(vals));
      } catch {
        baselineRef.current = getValues();
      }
    }
    // When transitioning from open -> closed, clear baseline so the next open re-captures.
    if (prevOpenRef.current && !open) {
      baselineRef.current = null;
    }
    prevOpenRef.current = open;
  }, [open, getValues]);

  return baselineRef;
}
