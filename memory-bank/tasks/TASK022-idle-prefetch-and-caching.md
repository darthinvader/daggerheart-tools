# TASK022: Idle Prefetch & Caching

Goal: Make heavy drawers/cards open instantly by preloading during idle and caching module chunks.

Plan:

- Use requestIdleCallback + dynamic import for drawers.
- Add react-query prefetch for any data-bound components.
- Verify cache hits via Network tab in devtools.

Acceptance:

- First open time < 80ms on warmed route in local tests.
