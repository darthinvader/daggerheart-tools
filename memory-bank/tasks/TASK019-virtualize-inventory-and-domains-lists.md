# TASK019: Virtualize Inventory and Domains Lists

Goal: Improve scroll performance for very large lists in Inventory Drawer and Domains Drawer without changing behavior for typical sizes.

Plan:

- Add optional tanstack-virtual based list components (InventoryVirtualList, DomainsVirtualList).
- Gate behind a simple heuristic: items.length > 150, or feature flag for testing.
- Keep markup/a11y: role=list, li semantics, keyboard nav.
- Maintain row height estimate with dynamic adjustment using ResizeObserver for accuracy.
- Add minimal tests: rendering first/last items, keyboard focus stays intact.

Acceptance:

- No regressions in existing tests.
- Smooth scroll in 1k+ item synthetic dataset.
- Can be toggled off via prop for safety.
