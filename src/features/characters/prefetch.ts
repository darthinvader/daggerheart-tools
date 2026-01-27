/**
 * Schedule a callback to run during browser idle time.
 * Returns a cleanup function that cancels the scheduled callback.
 */
export function prefetchOnIdle(callback: () => void): () => void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback);
    return () => window.cancelIdleCallback(id);
  }

  // Fallback for browsers without requestIdleCallback (e.g., Safari)
  const timeoutId = setTimeout(callback, 1);
  return () => clearTimeout(timeoutId);
}
