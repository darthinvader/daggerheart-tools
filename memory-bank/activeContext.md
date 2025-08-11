# Active Context - Daggerheart Tools

Updated: August 11, 2025

## Current Work Focus

### Routing & UI Flow

- Decision (revised): Use per-character routes for the sheet. `/characters/new` only generates a fresh UUID and redirects to `/characters/$id`.
- Canonical sheet route: `/characters/$id`. Section editors open as drawers and can be lazy-loaded.

Changes implemented (recent):

- Per-id character sheet at `src/routes/characters/$id.tsx` composed from modular cards (SummaryStats, ResourcesCard, CoreScoresCard, ConditionsCard, IdentityCard, TraitsCard, ClassCard, DomainsCard) with per-id localStorage persistence.
- Identity and Class/Subclass editors implemented as lazy-loaded Drawers (RHF + zod), with Save/Cancel and safe-area aware footers.
- `/characters/new` generates a UUID and redirects to `/characters/$id`; characters index lists entries and links to New.
- Mobile: Ensured drawers appear above the MobileNavBar by lowering navbar z-index to `z-40` and keeping drawers at `z-50`; confirmed footer safe-area padding prevents action buttons from being obscured.
- Global bottom padding remains on `<main>` to avoid overlap with the navbar; drawers sized with 100dvh.
- Character sheet mobile nav: Removed BottomActionBar and eliminated Play Mode; added a compact QuickJump section links bar.
- Typecheck/build/tests pass consistently (chunk-size warnings accepted for now).

Equipment drawer (Aug 11, 2025 - latest):

- Replaced global Pack/Free toggle with per-tab Source filters on Primary and Secondary tabs: Default (slotstandard only), Homebrew (homebrew-only for slot), and All (primary + secondary + both homebrew lists).
- Made Source controls larger and clearly selected using ToggleGroup variant="outline" and size="lg".
- Added live counts to each Source option label (Default/Homebrew/All) so the effect is visible at a glance.
- Added empty-state notice under lists when filters yield no items.
- Fixed onValueChange to ignore empty values so selection always updates; lists now respond reliably to Source changes.
- Accessibility: DrawerScaffold includes a description wired via aria-describedby.
  Updated Aug 11: The description text is now screen-reader-only and no longer references keyboard Tabs (mobile-first). Tabs now horizontally scroll on mobile.

Code structure and size improvements (Aug 11, 2025):

- Added a repository file analyzer script `scripts/size-report.mjs` with pnpm alias `size:report` to find large files. It excludes `src/lib/data`, `src/lib/schemas`, and the demo route `src/routes/showcase.tsx`. Supports `--by=size|loc`, `--top`, `--minKB`, and `--json`.
- Refactored `src/routes/characters/$id.tsx` earlier to move storage/schemas into `src/features/characters/storage.ts` (kept typecheck green).
- Split `src/components/ui/sidebar.tsx` into:
  - `src/components/ui/sidebar/context.tsx` (constants, provider, hook) wrapped with `TooltipProvider` and with react-refresh rule scoped.
  - `src/components/ui/sidebar/variants.ts` for CVA variants.
  - `src/components/ui/sidebar/menu.tsx` for menu primitives.
    Result: `sidebar.tsx` shrank from ~21.3 KB to ~7.9 KB after further group extraction. New `menu.tsx` remains ~6.9 KB.
- Reduced `src/components/characters/domains-drawer.tsx` by extracting:
  - `useLoadoutLists` hook (centralizes add/remove/inLoadout logic)
  - `AvailableCardsSection` and `TypeSummaryChips` small components
    Result: domains-drawer.tsx down to ~15.1 KB.

We're focused on the core data models and validation schemas, while incrementally wiring the mobile-first character sheet with modular components and drawer editors.

Recent cleanups:

- Consolidated subclass schemas to a single BaseSubclassSchema across all classes; optional companion supported for Ranger Beastbound.
- Merged ancestry/community logic into `src/lib/schemas/identity.ts`; removed stale `schemas/classes.ts`.
- Consolidated `core/*` into `src/lib/schemas/core.ts` and removed legacy forwarders.
- Consolidated equipment and domain schemas into `src/lib/schemas/equipment.ts` and `src/lib/schemas/domains.ts`.
- Domain card data lives under `src/lib/data/domains/*` (one file per domain), not under `src/lib/schemas`.

Domain management and resources (latest changes):

- Domains drawer: stopped auto-close on Add/Remove by ensuring non-submit buttons inside the form; added search and filters (by domain, level, and type: All/Spell/Ability); surfaced full card info in list rows and preview (name, domain, level, type badge, costs, tags, description in preview); added type badges (blue=Spell, amber=Ability).
- Domains drawer: stopped auto-close on Add/Remove by ensuring non-submit buttons inside the form; added search and filters (by domain, level, and type: All/Spell/Ability); surfaced full card info in list rows and preview (name, domain, level, type badge, costs, tags, description in preview); added type badges (blue=Spell, amber=Ability). Added autosave-on-close behavior and a Reset button that restores the state from when the drawer was opened.
- Domains summary: extended `DomainsCard` to optionally render by-type counts; route computes counts and passes them in.
- Hope resource: converted `hope` from number to `Score` shape `{ current, max }` across schema (`player-character.ts`), route state, UI (`CoreScoresCard`, `SummaryStats`), and storage migration (upgrade legacy numeric to Score on read). Added handlers to update current and max.
- Traits: removed “Remaining” budget UI and related state.

Small refactors (Aug 11, 2025):

- Extracted character sheet helpers to `src/features/characters/logic/*`:
  - `resources.ts` with `createResourceActions`
  - `traits.ts` with `createTraitActions`
  - `conditions.ts` with `createConditionActions`
    `src/routes/characters/$id.tsx` now imports these, reducing local boilerplate. File size dropped from ~17.1 KB → ~14.0 KB per analyzer.
- Enhanced `scripts/size-report.mjs` to support optional `size-report.config.json` for customizeable include/exclude roots/paths/extensions while preserving defaults (still excludes `src/lib/data`, `src/lib/schemas`, and `src/routes/showcase.tsx`).
- Extracted QuickJump (section links bar) from route to `src/components/layout/quick-jump.tsx`, reduced `$id.tsx` surface and tightened mobile styles (smaller font/padding, reduced gaps). Typecheck/build PASS.

Aug 11, 2025 (later updates):

- Introduced `prefetchOnIdle` helper at `src/features/characters/prefetch.ts` and used it in `src/routes/characters/$id.tsx` to warm the Domains drawer chunk during idle time.
- Domains drawer: `HomebrewCardForm` is now lazy-loaded behind `Suspense` (no behavior change).
- Inventory drawer: extracted `SlotRow` presenter to `src/components/characters/inventory/slot-row.tsx` and rewired usage to reduce duplication.
- Equipment drawer: attempted lazy-load for homebrew forms but reverted to synchronous imports to keep tests reliable; behavior unchanged.

Latest analyzer snapshot (Aug 11, refreshed):

- Top by size/loc (excluding data/schemas):
  - `src/components/characters/equipment-drawer.tsx` — 19.2 KB, 501 LOC, Cx 47
  - `src/routes/characters/$id.tsx` — 19.9 KB, 566 LOC, Cx 15
  - `src/components/characters/domains-drawer.tsx` — 14.8 KB, 350 LOC, Cx 22
  - `src/components/characters/inventory-drawer.tsx` — 7.4 KB, 252 LOC, Cx 7
  - UI vendor-like shells remain large due to long lines (dropdown/menu/context-menu/sidebar).
  - Homebrew forms split: weapon ~7.5 KB (222 LOC), armor ~5.8 KB (164 LOC).

A11y:

- DialogContent now auto-provides an sr-only description and sets aria-describedby when not supplied, eliminating missing-description warnings at source without changing consumers.

Notes: All validations are green after these changes (type-check, build, tests). No file deletions needed.

### Recently Completed

- Domain Card System: All 9 core domains present under `src/lib/data/domains/` with SRD-aligned data; future domains (Chaos, Moon, Sun, Blood, Fate) stubbed as empty arrays.
- Class System Foundation: 9 classes with subclass variants and progression rules; multiclassing scaffolding in place; Ranger companion supported.
- UI Library Setup: Added shadcn components (carousel, chart, drawer, form, input-otp, sidebar) via CLI. Implemented local equivalents for unavailable registry components: `combobox`, `date-picker`, `data-table`, and `typography` under `src/components/ui/`. Installed peer deps (embla-carousel-react, recharts, @tanstack/react-table, input-otp, react-hook-form). Typecheck/build pass.

- Domains UX: Added search and filters (domain/level/type) to Domains drawer; prevented drawer auto-close on add/remove; showed costs/tags and a richer preview; added type badges and by-type summary counts. Implemented autosave-on-close + per-open Reset.
- Resources UX: Hope now shows current/max and can adjust both.
- Traits cleanup: Removed Remaining budget display.

### Current Sprint

Schema completion and validation; mobile-first sheet assembly with drawer editors.

- Finalize and verify PlayerCharacter schema coverage (file exists and compiles)
- Cross-validation between classes, domains, and equipment
- Tighten validation messages and edge cases
- Incrementally add Domains and Equipment drawers with validation and persistence
- Keep splitting oversized UI files into small modules as identified by the analyzer; avoid touching data/schemas.

## Next Immediate Steps

1. Character schema finishing touches

- Confirm all fields and defaults in `player-character.ts`
- Ensure equipment/inventory models cover UI needs

2. Schema integration testing

- Validate class↔domain access rules and multiclassing
- Verify level-up point calculations

3. UI component planning

4. Verification

- Keep typecheck/build/tests green after Domains/Resources updates; address any regressions promptly.

- Sketch character creation flow and character sheet layout

### Structural Refactors (Aug 10, 2025)

- Removed duplicate character component forwarders under `src/components/characters/pieces/*` (domain-card-item, domain-styles, summary-stats). Canonical sources now live under `src/components/characters/*` and are imported directly.
- Deleted duplicate `src/components/characters/virtual-card-list.tsx` in favor of the version under `domains-drawer/virtual-card-list.tsx` used by the drawer.
- Updated imports accordingly (`DomainsCard` now imports `DomainCardItem` from canonical path; `DomainCardItem` imports `domain-styles` from canonical path).
- Added `.gitignore` entries for analyzer/visualizer outputs and Vite cache.
- Extracted shared mobile keyboard heuristic to `src/utils/mobile.ts` and refactored `MobileNavBar` to use it.
- Added `src/features/characters/logic/domains.ts` with pure helpers for card filtering and counting (not yet wired). This will back future refactors to keep UI components thin.

### Structural Refactors (Aug 11, 2025)

- Introduced `scripts/size-report.mjs` and `pnpm run size:report` for ongoing file-size visibility.
- Sidebar split into context/variants/menu modules; removed re-export of `useSidebar` in `sidebar.tsx` to satisfy react-refresh rule.
- Domains drawer logic/UI extractions: `use-loadout-lists.ts`, `available-cards-section.tsx`, and `type-summary-chips.tsx`.
- Tests added for `useLoadoutLists`; full test suite green.

Refactor plan (Aug 11, 2025):

- Added `memory-bank/refactor-plan.md` capturing prioritized targets based on analyzer output. Top items: `equipment-drawer.tsx`, `$id.tsx`, `inventory-drawer.tsx`, `domains-drawer.tsx`. Goals defined per file for KB/LOC/Cx reduction. Phased approach (extractions, organization/fan-in, and code-splitting).

### New Decisions (Aug 10, 2025)

- Include multiclassing during initial character creation (not just level-up).
- Enforce SRD starting domain card counts during creation step; relax enforcement after creation.
- Equipment selection: offer both prebuilt class packs and a free-form selection mode, both validated.
- Styling: Tailwind CSS for layout/styles and shadcn/ui for components; do not reinvent component primitives.
- Z-index convention: MobileNavBar at `z-40`; Drawer overlay/content at `z-50` to ensure drawers sit above navbar.

## Active Decisions & Considerations

Schema design patterns

- Discriminated unions for class/subclass selection
- Const assertions (`as const`) for data immutability
- Schema composition and reusable helpers (`MetadataSchema`, `ScoreSchema`, `unionWithString`)

Data architecture choices

- Domain data organized per-domain in `src/lib/data/domains`
- Standardized exports; minimal barrels to avoid duplication

Performance considerations

- Reuse compiled schemas; consider route-level code-splitting later

## Technical Debt & Known Issues

- Some domain cards may need formatting polish
- No persistence layer yet
- UI not started; mobile responsiveness untested

## Decision Log

Recent decisions

1. Zod for validation with full TypeScript integration
2. File-per-domain data organization
3. Immutable game data via const assertions
4. Discriminated unions over inheritance

Pending decisions

- Persistence strategy (localStorage vs IndexedDB) — leaning localStorage for MVP
- UI state management (Context at route layout vs external store) — leaning context at wizard layout
- Offline capabilities scope

## Notes (Current Session)

- Identity and Class drawers are lazy-loaded and validated via RHF + zod; per-id localStorage keys:
  - `dh:characters:{id}:identity:v1`
  - `dh:characters:{id}:resources:v1`
  - `dh:characters:{id}:traits:v1`
  - `dh:characters:{id}:class:v1`
- MobileNavBar updated to `z-40`; drawers at `z-50` with safe-area padded footers; verified action buttons remain tappable on mobile keyboards.
- Typecheck/build: PASS; chunk-size warnings to handle later via additional code-splitting.
- Domains Drawer Vault layout: Vault rows narrowed and action buttons stacked vertically for better mobile ergonomics; still slated for visual polish.

### In Progress (Character Sheet UI)

- Per-id character sheet at `/characters/$id` with modular cards, Identity + Class drawers (lazy), Traits steppers with budget, Resources quick controls, and Summary identity + HP/Stress snapshot. Bottom action bar removed; Play Mode removed. QuickJump extracted and styled for mobile. Drawers use 100dvh with safe-area padding.
- Next: Implement Domains and Equipment drawers following the same pattern (lazy, per-id persistence, validation).

## Context for Next Session

- Start integration tests for class↔domain rules and level-up math
- Begin UI scaffolding for character creation
- Map persistence requirements (MVP: localStorage)
