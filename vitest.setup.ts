// Vitest setup file — required by vite.config.ts
// Add global test setup here (e.g. custom matchers, mocks)

// jsdom does not implement matchMedia — provide a minimal stub so hooks that
// rely on it (useIsMobile, useCoarsePointer) can run in tests.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
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
