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
