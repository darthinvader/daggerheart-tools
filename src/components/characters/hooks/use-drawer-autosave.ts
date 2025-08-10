import * as React from 'react';

type AutosaveArgs = {
  open: boolean;
  trigger: () => Promise<boolean> | boolean;
  creationComplete: boolean;
  currentLoadoutCount: number;
  startingLimit: number;
  submit: () => void | Promise<void>;
  skipRef: React.MutableRefObject<boolean>;
};

// Encapsulates autosave-on-close logic so we can test it in isolation.
export function useDrawerAutosaveOnClose({
  open,
  trigger,
  creationComplete,
  currentLoadoutCount,
  startingLimit,
  submit,
  skipRef,
}: AutosaveArgs) {
  const prevOpenRef = React.useRef(open);

  React.useEffect(() => {
    if (prevOpenRef.current && !open) {
      const shouldSkip = skipRef.current;
      skipRef.current = false;

      const withinLimit =
        creationComplete || currentLoadoutCount <= startingLimit;

      if (!shouldSkip && withinLimit) {
        // Defer validation + submit until after close animation / when idle
        const w = window as unknown as {
          requestIdleCallback?: (
            cb: IdleRequestCallback,
            opts?: { timeout?: number }
          ) => number;
          cancelIdleCallback?: (id: number) => void;
        };
        let idleId: number | undefined;
        let timeoutId: number | undefined;
        const run = () => {
          Promise.resolve(trigger()).then(valid => {
            if (valid) void Promise.resolve(submit());
          });
        };
        if (typeof w.requestIdleCallback === 'function') {
          idleId = w.requestIdleCallback!(run, { timeout: 500 });
        } else {
          // allow ~1 frame worth of breathing room
          timeoutId = window.setTimeout(run, 200);
        }
        return () => {
          if (idleId && typeof w.cancelIdleCallback === 'function') {
            w.cancelIdleCallback!(idleId);
          }
          if (timeoutId) {
            window.clearTimeout(timeoutId);
          }
        };
      }
    }
    prevOpenRef.current = open;
  }, [
    open,
    creationComplete,
    currentLoadoutCount,
    startingLimit,
    submit,
    trigger,
    skipRef,
  ]);
}
