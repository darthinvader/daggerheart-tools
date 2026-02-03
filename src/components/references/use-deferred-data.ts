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

/**
 * Hook to defer rendering of content until after an animation completes.
 * This is particularly useful for Sheet/Dialog content where rendering
 * heavy content during animation causes jank on mobile devices.
 *
 * @param isOpen - Whether the container (sheet/modal) is open
 * @param delayMs - Delay in ms before rendering content (default: 150ms for mobile-friendly animations)
 * @returns shouldRender - Whether to render the content
 */
export function useDeferredSheetContent(
  isOpen: boolean,
  delayMs = 150
): boolean {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      // Wait for animation to complete before rendering heavy content
      const timer = setTimeout(() => {
        React.startTransition(() => {
          setShouldRender(true);
        });
      }, delayMs);
      return () => clearTimeout(timer);
    } else {
      // Reset immediately when closing
      setShouldRender(false);
    }
  }, [isOpen, delayMs]);

  return shouldRender;
}

/**
 * Hook to prevent parent re-renders from propagating to heavy child components.
 * Uses startTransition to defer state updates and prevent blocking.
 *
 * @param value - The value to stabilize
 * @returns The deferred value that updates without blocking
 */
export function useStableValue<T>(value: T): T {
  return React.useDeferredValue(value);
}

/**
 * Hook to delay closing state to prevent flash during sheet close animation.
 * Keeps content mounted during the close animation to prevent blank screen.
 *
 * @param isOpen - Whether the sheet is currently open
 * @param delayMs - How long to keep content after closing (should match animation duration)
 * @returns shouldKeepMounted - Whether to keep the content mounted
 */
export function useDelayedUnmount(isOpen: boolean, delayMs = 200): boolean {
  const [shouldKeepMounted, setShouldKeepMounted] = React.useState(isOpen);

  React.useEffect(() => {
    if (isOpen) {
      setShouldKeepMounted(true);
    } else {
      // Keep mounted during close animation
      const timer = setTimeout(() => {
        setShouldKeepMounted(false);
      }, delayMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, delayMs]);

  return shouldKeepMounted || isOpen;
}
