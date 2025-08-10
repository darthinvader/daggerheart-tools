import * as React from 'react';

export function useClosingFreeze() {
  const [closing, setClosing] = React.useState(false);
  const closeTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const startClosing = React.useCallback((durationMs = 450) => {
    setClosing(true);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setClosing(false);
      closeTimerRef.current = null;
    }, durationMs);
  }, []);

  const clearClosing = React.useCallback(() => {
    setClosing(false);
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  return { closing, startClosing, clearClosing } as const;
}
