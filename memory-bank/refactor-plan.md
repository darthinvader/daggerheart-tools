# Refactor Plan - Daggerheart Tools (2025-08-11)

Purpose: Reduce oversized/complex files, improve maintainability and render performance, and chip away at bundle warnings without changing behavior.

## Constraints & Principles

- Preserve behavior and public APIs; keep type-check/tests/build green after each step.
- Prefer extraction over rewrite. Small, composable modules with clear responsibilities.
- Avoid touching `src/lib/data` and `src/lib/schemas` (excluded by analyzer).
- Treat shadcn UI shells with very long lines as vendor-like; avoid churn unless ergonomics demand fixes.
- Add/keep minimal tests when extracting logic/hooks.

## Top Offenders (from size-report)

By size/LOC combined (Cx = complexity proxy, MaxLine = longest line chars):

- src/components/characters/equipment-drawer.tsx — 19.2 KB, 501 LOC, Cx 47, MaxLine 213
- src/routes/characters/$id.tsx — 19.9 KB, 566 LOC, Cx 15, MaxLine 124
- src/components/characters/domains-drawer.tsx — 14.8 KB, 350 LOC, Cx 22, MaxLine 105
- src/components/characters/inventory-drawer.tsx — 7.4 KB, 252 LOC, Cx 7, MaxLine 85
- src/components/ui/chart.tsx — 9.7 KB, 324 LOC, Cx 52, MaxLine 129
- src/components/ui/menubar.tsx — 8.7 KB, 333 LOC, very long lines (231)
- src/components/ui/dropdown-menu.tsx — 8.6 KB, 318 LOC, very long lines (233)
- src/components/ui/context-menu.tsx — 8.1 KB, 234 LOC, very long lines (630)
- src/components/ui/sidebar.tsx — 7.9 KB, 259 LOC, very long lines (250)
- src/components/ui/sidebar/menu.tsx — 6.6 KB, 219 LOC, Cx 20, very long lines (504)
- src/features/characters/storage.ts — 6.7 KB, 197 LOC, many exports, high fan-in

## Strategies

- Extract UI subcomponents: list items, toolbars, filter groups, selection strips, empty states, headers.
- Extract hooks: selection/add-remove logic, search/filter state, derived counts.
- Move pure logic to `src/features/characters/logic/*` (already used by route) to keep UI thin.
- Split route `$id.tsx` composition and handlers into small helpers/hooks.
- Introduce simple dynamic imports to code-split heavy drawers/routes where helpful.
- Keep long-line UI shells stable unless we actively work inside them; if touched, break long lines and split primitives to reduce MaxLine.

## Phased Plan

Phase 1 — Low-risk extractions (this week)

- equipment-drawer.tsx
  - Already extracted: Filters toolbars, selection strip, results lists.
  - Next: extract tab panels into small components and centralize shared filter/search state into a tiny `useEquipmentFilters` hook to trim duplication.
  - Target: < 18.5 KB, LOC < 460, maintain Cx ≤ 40.
- domains-drawer.tsx
  - Already extracted: loadout lists, available cards section, summary chips.
  - Next: move `getLoadoutLimits` usage and related creation-complete controls into a tiny `LoadoutFooter` component to reduce main file surface.
  - Target: < 13.8 KB, LOC < 320.
- $id.tsx (route)
  - Next: extract mini helpers for subclass list derivation and domain summary calculation into `features/characters/logic` (tiny pure functions).
  - Target: < 18.5 KB size equivalent and LOC < 520.
- inventory-drawer.tsx
  - Already extracted: SlotRow presenter.
  - Next: extract filter/search toolbar if further changes occur; otherwise consider done for now.
  - Target: keep ~7.0–7.4 KB; no change required.

Phase 2 — Organization & fan-in (next)

- features/characters/storage.ts
  - Split by concern: identity-storage.ts, resources-storage.ts, class-storage.ts, traits-storage.ts, domains-storage.ts, equipment-storage.ts.
  - Provide `index.ts` barrel to preserve imports. Avoid breaking public API.
- ui/chart.tsx
  - If actively used by sheet: split into primitives (ChartContainer/Axis/Series) and lazy-load charts where used; otherwise defer.
- ui/sidebar/\*
  - Already split; consider moving remaining group primitives to `sidebar/group.tsx` if we touch it again.

Phase 2.5 — Prefetch & code-splitting hygiene

- Apply `prefetchOnIdle` to Equipment and Inventory drawers as well (already used for Domains) to keep open latency low without test changes.

Phase 3 — Code-splitting & perf (opportunistic)

- Lazy load drawers and heavy components via dynamic import.
- Consider virtualization where lists exceed ~100 rows.
- Memoize expensive derived data; stabilize props with selectors.

## Acceptance Criteria

- All steps compile and pass tests (Vitest) and type-check.
- No user-facing behavior/regressions.
- Analyzer shows target files under stated thresholds.
- Bundle warnings reduced where feasible; no new large chunks introduced.

## Tracking & Reporting

- Run `pnpm run size:report -- --by=size --top=25` and `--by=loc` before/after each refactor.
- Log deltas in Memory Bank progress and TASK006.

```sh
# Optional quick checks
pnpm run size:report -- --by=size --top=25
pnpm run size:report -- --by=loc --top=25
```
