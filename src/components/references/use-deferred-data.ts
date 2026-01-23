import * as React from 'react';

/**
 * Hook to defer heavy data loading until after the initial paint.
 * Shows skeleton immediately, then loads data after the browser has painted.
 */
export function useDeferredLoad<T>(loader: () => T): {
  data: T | null;
  isLoading: boolean;
} {
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Use requestAnimationFrame + setTimeout to ensure we paint first
    let cancelled = false;

    // First frame: let the skeleton render
    requestAnimationFrame(() => {
      // Second frame: start loading after paint
      requestAnimationFrame(() => {
        if (cancelled) return;
        // Use startTransition to keep UI responsive during load
        React.startTransition(() => {
          setData(loader());
          setIsLoading(false);
        });
      });
    });

    return () => {
      cancelled = true;
    };
  }, [loader]);

  return { data, isLoading };
}

/**
 * Hook that uses React's useDeferredValue for smoother transitions.
 * Best for filter/search scenarios where you want to avoid UI freezes.
 */
export function useDeferredItems<T>(items: T[]): {
  deferredItems: T[];
  isPending: boolean;
} {
  const deferredItems = React.useDeferredValue(items);
  const isPending = items !== deferredItems;

  return { deferredItems, isPending };
}

/**
 * Hook that uses useTransition for state updates that can be interrupted.
 * Best for search/filter inputs where you want responsive typing.
 */
export function useTransitionState<T>(
  initialValue: T
): [T, (value: T) => void, boolean] {
  const [value, setValue] = React.useState(initialValue);
  const [isPending, startTransition] = React.useTransition();

  const setValueWithTransition = React.useCallback((newValue: T) => {
    startTransition(() => {
      setValue(newValue);
    });
  }, []);

  return [value, setValueWithTransition, isPending];
}
