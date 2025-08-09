# Active Context - Daggerheart Tools

Updated: August 9, 2025

## Current Work Focus

### Routing & UI Flow

- Decision (revised): Use per-character routes for the sheet. `/characters/new` only generates a fresh UUID and redirects to `/characters/$id`.
- Canonical sheet route: `/characters/$id`. Section editors open as drawers and can be lazy-loaded.

Changes implemented (today):

- Added `src/routes/characters/$id.tsx` (sheet UI with Identity drawer, per-id storage).
- Updated `src/routes/characters/new.tsx` to generate UUID and redirect to `/characters/$id`.
- `src/routes/characters.index.tsx` lists characters area; “New” links to `/characters/new`.
- `src/components/mobile-nav.tsx` FAB default remains `/characters/new`.
- Rebuilt to regenerate `routeTree.gen.ts` (reflects `/characters/$id` + `/characters/new`).

We're focused on the core data models and validation schemas that form the foundation of the application. The schemas are consolidated and type-safe across game systems.

Recent cleanups (verified today):

- Consolidated subclass schemas to a single BaseSubclassSchema across all classes; optional companion supported for Ranger Beastbound.
- Merged ancestry/community logic into `src/lib/schemas/identity.ts`; removed stale `schemas/classes.ts`.
- Consolidated `core/*` into `src/lib/schemas/core.ts` and removed legacy forwarders.
- Consolidated equipment and domain schemas into `src/lib/schemas/equipment.ts` and `src/lib/schemas/domains.ts`.
- Domain card data lives under `src/lib/data/domains/*` (one file per domain), not under `src/lib/schemas`.

### Recently Completed

- Domain Card System: All 9 core domains present under `src/lib/data/domains/` with SRD-aligned data; future domains (Chaos, Moon, Sun, Blood, Fate) stubbed as empty arrays.
- Class System Foundation: 9 classes with subclass variants and progression rules; multiclassing scaffolding in place; Ranger companion supported.
- UI Library Setup: Added missing shadcn components (carousel, chart, drawer, form, input-otp, sidebar) via CLI. Implemented local equivalents for unavailable registry components: `combobox`, `date-picker`, `data-table`, and `typography` under `src/components/ui/`. Installed peer deps (embla-carousel-react, recharts, @tanstack/react-table, input-otp, react-hook-form). Typecheck/build pass.

### Current Sprint

Schema completion and validation

- Finalize and verify PlayerCharacter schema coverage (file exists and compiles)
- Cross-validation between classes, domains, and equipment
- Tighten validation messages and edge cases

## Next Immediate Steps

1. Character schema finishing touches

- Confirm all fields and defaults in `player-character.ts`
- Ensure equipment/inventory models cover UI needs

2. Schema integration testing

- Validate class↔domain access rules and multiclassing
- Verify level-up point calculations

3. UI component planning

- Sketch character creation flow and character sheet layout

### New Decisions (Aug 9, 2025)

- Include multiclassing during initial character creation (not just level-up).
- Enforce SRD starting domain card counts during creation step; relax enforcement after creation.
- Equipment selection: offer both prebuilt class packs and a free-form selection mode, both validated.
- Styling: Tailwind CSS for layout/styles and shadcn/ui for components; do not reinvent component primitives.

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

- Audited memory bank for accuracy and aligned paths (domain data under `src/lib/data/domains`).
- Ran type-check: PASS. Build path compiles.
- Verified `PlayerCharacterSchema` exists and compiles; integration validation still to do.
- Captured UI decisions: multiclass in creation, starting card enforcement, equipment pack+free mode, Tailwind+shadcn.
- Showcase route updated to include missing shadcn components (accordion, alert-dialog, carousel, chart, collapsible, combobox, data-table, date-picker wrapper, drawer, form, input-otp, tooltip, typography) with compact demos.

### In Progress (Character Sheet UI)

- Per-id character sheet at `/characters/$id` with Identity drawer wired via RHF + zod. Next: Traits steppers, Resources quick controls, and BottomActionBar.

## Context for Next Session

- Start integration tests for class↔domain rules and level-up math
- Begin UI scaffolding for character creation
- Map persistence requirements (MVP: localStorage)
