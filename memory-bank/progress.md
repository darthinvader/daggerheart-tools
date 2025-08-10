# Progress Report - Daggerheart Tools

Updated: August 11, 2025

## What's Working

### Core Data Layer

- Domain System: 9 core domains implemented under `src/lib/data/domains/*` with type-safe validation via `schemas/domains.ts`.
- Class System: 9 classes with subclasses; unified subclass schema; Ranger companion support.
- Identity & Core: Consolidated `core.ts` and `identity.ts`; shared helpers reduce duplication.
- Equipment: Unified equipment schemas in `schemas/equipment.ts`; data present in `src/lib/data/equipment/*`.

### Development Infrastructure

- Type Safety: TypeScript strict + Zod. Type-check passes today.
- Build System: Vite. Build path compiles locally.
- Quality: ESLint/Prettier, tests configured with Vitest (coverage present).
- Analyzer: `pnpm run size:report` scans `src/` and `tests/` for largest files, excluding `src/lib/data`, `src/lib/schemas`, and the `showcase` route. Supports flags `--by`, `--top`, `--minKB`, `--json`.

### Routing & UI

- Per-id character screen at `/characters/$id` (mobile-first sheet composed of modular cards). `/characters/new` redirects to a fresh UUID. Characters hub at `/characters` with index child.
- Identity drawer implemented (RHF + zod) and lazy-loaded. Class/Subclass drawer added and lazy-loaded; `ClassCard` shows current selection and opens it.
- Mobile navbar overlap fixed by setting navbar z-index to `z-40`; drawers render at `z-50` and include safe-area footer padding.
- Domains drawer implemented with search and filters (domain/level/type) and non-submit Add/Remove to prevent auto-close; list rows show domain, level, type badge, costs, and tags; preview shows description; by-type summary counts surfaced on `DomainsCard`. Added autosave on drawer close and a Reset button to restore per-open baseline.
- Resources show Hope as current/max with controls; migration from legacy numeric Hope supported.

Refactors and reductions (Aug 11, 2025)

- `src/components/ui/sidebar.tsx` reduced to ~10.1 KB by extracting `context.tsx`, `variants.ts`, and `menu.tsx`.
- `src/components/characters/domains-drawer.tsx` reduced to ~15.1 KB with new `useLoadoutLists` hook and small components (`AvailableCardsSection`, `TypeSummaryChips`).
- Character route `$id.tsx` previously reduced by moving storage/schemas into `src/features/characters/storage.ts` (now ~17.1 KB).

## What's Left to Build

Immediate priorities

1. Equipment & Inventory drawers (pack mode + free mode) with validation and persistence
2. Character creation rules (multiclass at creation, starting card count enforcement)
3. Character creation rules (multiclass at creation, starting card count enforcement)
4. Additional code-splitting to reduce initial bundle

Medium-term 4. Advanced features (multiclassing UI, companion mgmt, inventory) 5. UX polish (mobile, a11y, feedback) 6. Performance/code-splitting and bundle budget

Future 7. Campaign tools, party coordination, homebrew support, print views 8. Integrations (dice, sharing, APIs)

## Current Status

Estimated completion

- Data Layer: ~90%
- Rules Data: ~95%
- UI: ~15%
- Features: ~15%
- Tests: ~20%

Technical health

- Type safety: Excellent
- Lint/format: Good
- Performance/Mobile/A11y: Not yet assessed
- Tests: PASS (12). Build: PASS. Type-check: PASS.

## Known Issues

- Some domain descriptions need formatting polish; bundle has large chunk warnings
- Vault layout still needs visual polish despite narrower width and vertical action buttons
- Edge cases in progression need tests
- Broader persistence layer beyond localStorage is not started
- ESLint shows some warnings (react-refresh only-export-components in UI files; console statements in test scripts); non-blocking.
- Some shadcn-generated UI shells have very long lines; treat as vendor-like and defer changes unless ergonomics need improvement.

## MVP Success Criteria

- [ ] End-to-end character creation (identity → class → traits → domains)
- [ ] Character sheet with core interactions
- [ ] Level-up with points
- [ ] Save/load characters
- [ ] Mobile-friendly layout

## Next Milestone

Target: Domain & Equipment drawers wired into per-id sheet
Timeline: 1–2 weeks
Deliverables: Equipment pack/free modes; schema validation and mobile-friendly drawers; begin code-splitting for heavy lists; continue trimming oversized UI files using analyzer output

## Recent Progress Log

- Audited codebase vs memory bank; aligned paths and scope (domain data in data/domains).
- Ran type-check: PASS. Build path compiles.
- Verified `PlayerCharacterSchema` and equipment/domain schemas exist and are consistent.
- Decisions captured: multiclass during creation; enforce starting card counts at creation; equipment pack + free modes; Tailwind + shadcn/ui for UI.

### August 9, 2025

- Shadcn components: Added via CLI `carousel`, `chart`, `drawer`, `form`, `input-otp`, `sidebar`. CLI updated some existing UI files.
- Implemented local UI equivalents for registry-missing items: `combobox`, `date-picker`, `data-table`, `typography` in `src/components/ui/`.
- Installed peer deps: `embla-carousel-react`, `recharts`, `@tanstack/react-table`, `input-otp`, `react-hook-form` (and hookform resolvers). Kept `sonner` for toasts per shadcn deprecation note.
- Verified with type-check and build: PASS.
- Showcase route now demos remaining components not previously showcased: accordion, alert-dialog, carousel, chart, collapsible, combobox (single + multi), data-table, date-picker wrapper, drawer, form with react-hook-form, input-otp, tooltip, and basic typography.

### August 9, 2025 (later)

- Migrated to per-id routing: `/characters/$id` hosts the character sheet; `/characters/new` redirects to UUID.
- Implemented Identity drawer with RHF + zod; per-id localStorage persistence and hydration with safe defaults.
- Verified type-check and build: PASS; route tree includes new dynamic route.

### August 9, 2025 (even later)

- Mobile polish: Added bottom padding to `<main>` using calc(4rem + safe-area inset + 24px) to avoid MobileNavBar overlap across routes.
- Summary card redesign: Two-column on sm+, showing identity snapshot and quick HP/Stress readouts with inline +/- controls.
- Drawer ergonomics: Confirmed 100dvh + safe-area padding and scrollable content mitigate keyboard overlap.
- Quality gates: Type-check PASS; build PASS (with large chunk warnings to address later via code-splitting).
- Header: Title now shows only the character's name in a smaller font; when empty, displays a subtle 'Set a name' placeholder.

### August 10, 2025

- Implemented Class/Subclass editor drawer (`src/components/characters/class-drawer.tsx`) mirroring Identity drawer patterns (RHF + Combobox); lazy-loaded.
- Added per-id localStorage persistence for class selection in `/characters/$id` with `ClassDraft` schema and storage helpers.
- Wired `ClassCard` to display the current class and subclass and open the drawer.
- Fixed mobile navbar overlap with drawers by lowering navbar z-index to `z-40`; drawers at `z-50` include safe-area footer padding so actions remain tappable above the navbar and keyboard.
- Typecheck/build: PASS (chunk-size warnings noted). Route tree generated correctly.

### August 10, 2025 (later)

- Domains drawer: prevented auto-close on add/remove by using non-submit buttons; added search inputs and filters (domain, level, type All/Spell/Ability); displayed costs and tags; added type badges in list rows and preview; kept description in preview.
- Domains summary: extended `DomainsCard` to optionally show by-type counts; route computes and passes counts (Spell/Ability).
- Resources: converted `hope` to Score with current/max across schema, route, and UI; added migration from legacy numeric value in storage.
- Traits: removed Remaining budget UI/state.
- Quality gates: Typecheck PASS; Build PASS; Tests PASS (6/6); Lint shows only warnings (no blocking errors).

### August 10, 2025 (even later)

- Domains drawer UX: Replaced bottom “selected card” preview with inline expansion per row. Tapping a row toggles its description right under the list item (also in Loadout/Vault). This reduces scrolling and keeps context visible.

### August 11, 2025

- Introduced `scripts/size-report.mjs` tool and `size:report` script; excludes data/schemas and the demo showcase. Added hints for refactor candidates.
- Sidebar refactor: extracted `context.tsx` (with provider/hook and TooltipProvider wrapper), `variants.ts` (CVA), and `menu.tsx` (menu primitives). Removed re-export of `useSidebar` from main file to comply with react-refresh rule.
- Domains drawer refactor: extracted `use-loadout-lists.ts`, `available-cards-section.tsx`, `type-summary-chips.tsx`; updated main drawer to use them.
- Tests: added hook tests for `useLoadoutLists`; full suite green (12 tests). Type-check and build pass.

### August 11, 2025 (later)

- Sidebar refactor part 2: extracted group primitives to `src/components/ui/sidebar/group.tsx` (Header, Footer, Group, GroupLabel, GroupAction, GroupContent) and updated `sidebar.tsx` to import/re-export. Type-check and tests remain PASS. Size report now shows:
  - `src/components/ui/sidebar.tsx` ~7.9 KB (down from ~10.1 KB)
  - `src/components/ui/sidebar/menu.tsx` ~6.9 KB
  - `src/routes/characters/$id.tsx` ~17.1 KB; `domains-drawer.tsx` ~15.1 KB
