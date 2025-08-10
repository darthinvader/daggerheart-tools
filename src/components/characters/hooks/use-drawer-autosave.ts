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
        Promise.resolve(trigger()).then(valid => {
          if (valid) {
            void Promise.resolve(submit());
          }
        });
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
