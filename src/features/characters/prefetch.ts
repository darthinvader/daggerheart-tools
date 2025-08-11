// Small helper to prefetch a module when the browser is idle, with a setTimeout fallback.
export function prefetchOnIdle(task: () => void) {
  const w = window as unknown as {
    requestIdleCallback?: (cb: () => void) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  let idleId: number | undefined;
  let timeoutId: number | undefined;
  const run = () => {
    try {
      task();
    } catch {
      // ignore
    }
  };
  if (typeof w.requestIdleCallback === 'function') {
    idleId = w.requestIdleCallback!(run);
  } else {
    timeoutId = window.setTimeout(run, 0);
  }
  return () => {
    if (idleId && typeof w.cancelIdleCallback === 'function') {
      w.cancelIdleCallback!(idleId);
    }
    if (timeoutId) window.clearTimeout(timeoutId);
  };
}
