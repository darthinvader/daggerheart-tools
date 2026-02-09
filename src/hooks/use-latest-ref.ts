import { useEffect, useRef } from 'react';

/**
 * Keeps a ref always in sync with the latest value.
 * Useful for avoiding stale closures in callbacks passed to effects.
 */
export function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
