// Minimal global error & unhandled rejection capture for deployment diagnostics.
// Captures errors into window.__APP_ERRORS__ for inspection after blank screen issues.

if (typeof window !== 'undefined') {
  const w = window as unknown as { __APP_ERRORS__?: unknown[] };
  w.__APP_ERRORS__ = w.__APP_ERRORS__ || [];
  const push = (label: string, ev: unknown) => {
    try {
      w.__APP_ERRORS__!.push({ label, ts: Date.now(), ev });
    } catch {
      // ignore
    }
  };
  window.addEventListener('error', e =>
    push('error', {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
    })
  );
  window.addEventListener('unhandledrejection', e =>
    push('unhandledrejection', { reason: (e as PromiseRejectionEvent).reason })
  );
  // Optional console marker
  // eslint-disable-next-line no-console
  console.log('[app] error hooks installed');
}
