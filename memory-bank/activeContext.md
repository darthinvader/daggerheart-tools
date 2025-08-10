# Active Context - Daggerheart Tools

Updated: August 10, 2025

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
- Typecheck/build/tests pass consistently (chunk-size warnings accepted for now).

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

- Per-id character sheet at `/characters/$id` with modular cards, Identity + Class drawers (lazy), Traits steppers with budget, Resources quick controls, and Summary identity + HP/Stress snapshot. Bottom action bar removed in favor of header actions. Drawers use 100dvh with safe-area padding.
- Next: Implement Domains and Equipment drawers following the same pattern (lazy, per-id persistence, validation).

## Context for Next Session

- Start integration tests for class↔domain rules and level-up math
- Begin UI scaffolding for character creation
- Map persistence requirements (MVP: localStorage)
