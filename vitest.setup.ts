import '@testing-library/jest-dom/vitest';

// window.matchMedia mock for components that might query it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// ResizeObserver mock for Radix/Vaul internals under jsdom
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
type AnyObject = Record<string, unknown>;
(globalThis as unknown as AnyObject).ResizeObserver = MockResizeObserver;

// JSDOM doesn't implement smooth scrolling APIs; provide no-op shims for tests
if (typeof window !== 'undefined') {
  (window as unknown as { scrollTo: (...args: unknown[]) => void }).scrollTo = (
    ..._args: unknown[]
  ): void => {
    /* no-op for tests */
  };
}
if (typeof Element !== 'undefined') {
  (
    Element.prototype as unknown as {
      scrollIntoView: (opts?: unknown) => void;
    }
  ).scrollIntoView = (_opts?: unknown): void => {
    /* no-op for tests */
  };
}

// Filter known noisy a11y warning emitted by Radix/Vaul under jsdom.
// We provide proper descriptions or aria-describedby in components, but
// the library still logs a false-positive in tests due to internal layering.
const originalConsoleError: typeof console.error = console.error.bind(console);
const originalConsoleWarn: typeof console.warn = console.warn.bind(console);
console.error = (
  ...args: Parameters<typeof originalConsoleError>
): ReturnType<typeof originalConsoleError> => {
  const [first] = args;
  if (
    typeof first === 'string' &&
    first.includes('Missing `Description` or `aria-describedby')
  ) {
    return undefined as unknown as ReturnType<typeof originalConsoleError>;
  }
  return originalConsoleError(...args);
};
console.warn = (
  ...args: Parameters<typeof originalConsoleWarn>
): ReturnType<typeof originalConsoleWarn> => {
  const [first] = args;
  if (
    typeof first === 'string' &&
    first.includes('Missing `Description` or `aria-describedby')
  ) {
    return undefined as unknown as ReturnType<typeof originalConsoleWarn>;
  }
  return originalConsoleWarn(...args);
};
