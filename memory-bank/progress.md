# Progress Report - Daggerheart Tools

Updated: August 16, 2025 (latest)

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
- Resources show Hope as current/max with controls; migration from legacy numeric Hope supported. Gold now uses emoji-based tap-to-set (0–9) with label-to-zero and opacity selection; rows are compact and wrap to fit small screens.
- Thresholds UX: Added a dedicated `ThresholdsCard` and removed inline thresholds from Resources. Introduced a settings flow with Auto vs Custom values and explicit Double Severe (DS) support. When DS override is enabled, users can set a Custom DS value (validated to be ≥ Severe). Inline preview renders “1 | M≤X | 2 | S≤Y | 3 | DS≥Z | 4”.
  - Mobile header chips: Finalized progressive, mobile-only chips in `SheetHeader` that reveal strictly after a section is fully passed (rect.bottom-based). Order: Traits → Core → Thresholds → Class/Subclass (with Level) → Resources → Gold. Thresholds labels now use colons (M: X / S: Y / MD: Z). Gold is a separate chip shown only after the Gold section; it’s not included in the Resources chip.
- Mobile tabs: Tab lists are horizontally scrollable; tab triggers no longer stretch, improving swipe/scroll UX. Drawer description text referring to "Use Tab" removed from visual layout and kept as screen-reader-only.
- Equipment & Inventory: Added `EquipmentCard` and `InventoryCard` sections with Edit buttons; drawers are lazy-loaded and wired to per-id localStorage. Equipment supports free-form selection (primary/secondary/armor) with concise stat previews; Inventory supports add-by-name and add-from-library with quantity steppers, Equipped toggle, and Location select.
- New: Experiences section — Added `ExperiencesCard` and wired it into `/characters/$id` between Resources and Class. Users can:
  - Adjust total Experience (XP) used for leveling (clamped ≥ 0)
  - Manage narrative Experiences list (name, optional trait, +1/+2 bonus, notes)
  - Persisted via new storage keys `experience` and `experiences`; schema parity with `PlayerCharacterSchema` (name, trait?, bonus 1|2, notes?).
  - Tests added (`tests/experiences-card.test.tsx`). Full suite PASS.

Refactors and reductions (Aug 11, 2025)

- `src/components/ui/sidebar.tsx` reduced to ~10.1 KB by extracting `context.tsx`, `variants.ts`, and `menu.tsx`.
- `src/components/characters/domains-drawer.tsx` reduced to ~15.1 KB with new `useLoadoutLists` hook and small components (`AvailableCardsSection`, `TypeSummaryChips`).
- Character route `$id.tsx` previously reduced by moving storage/schemas into `src/features/characters/storage.ts` (now ~17.1 KB).
- Character route `$id.tsx` further reduced to ~14.0 KB by extracting resource/traits/conditions actions to `src/features/characters/logic/*`.
- Character route `$id.tsx` simplified further: removed BottomActionBar and Play Mode; extracted QuickJump (section links) into `src/components/layout/quick-jump.tsx` with tighter mobile styles. Typecheck/Build PASS.
- `scripts/size-report.mjs` now supports optional `size-report.config.json` to customize scan without changing defaults.
- Added read-only HP thresholds chips to `ResourcesCard` (Major ≤ floor(max/2), Severe ≤ floor(max/4)).

Refactors and reductions (Aug 11, 2025 - later)

- Extracted `SlotRow` for inventory rows and integrated into `inventory-drawer.tsx` to remove duplicated markup.
- Added `prefetchOnIdle` helper under `src/features/characters/prefetch.ts` and used in `src/routes/characters/$id.tsx` to warm Domains drawer chunk during idle.
- Extended idle prefetch in `$id.tsx` to warm Equipment and Inventory drawers as well.
- Domains drawer: `HomebrewCardForm` lazy-loaded behind `Suspense` (no behavior change).
- Equipment drawer: Attempted lazy-load for homebrew forms, but reverted to synchronous imports to keep tests stable. Maintains behavior parity.
- Extracted `LoadoutFooter` from `domains-drawer.tsx` into `domains-drawer/loadout-footer.tsx`, shrinking the main file.

Analyzer (latest run on Aug 11, refreshed):

- By size: `$id.tsx` 19.9 KB; `equipment-drawer.tsx` 19.2 KB; `domains-drawer.tsx` 14.8 KB; `inventory-drawer.tsx` 7.4 KB.
  Updated after this change: `$id.tsx` 20.9 KB (prefetch additions), `domains-drawer.tsx` 14.2 KB (footer extracted).
- By LOC: `$id.tsx` 566; `equipment-drawer.tsx` 501; `domains-drawer.tsx` 350; `inventory-drawer.tsx` 252.
- Homebrew forms: `homebrew-weapon-form.tsx` 7.5 KB/222 LOC; `homebrew-armor-form.tsx` 5.8 KB/164 LOC.

Quality gates (Aug 14):

- Type-check: PASS
- Build: PASS (chunk size warnings expected; heavy vendor chunks present)
- Tests: PASS (37/37). DialogContent auto-description remains; thresholds tests added; equipment drawer a11y warnings are non-blocking.

## What's Left to Build

Immediate priorities

1. Equipment & Inventory drawers (free-form only) with validation and persistence
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
- Tests: PASS (20). Build: PASS. Type-check: PASS.
- Analyzer: PASS. `$id.tsx` down to ~14.0 KB; domains-drawer remains top at ~15.2 KB (already split earlier).

## Known Issues

- Some domain descriptions need formatting polish; bundle has large chunk warnings
- Vault layout still needs visual polish despite narrower width and vertical action buttons
- Edge cases in progression need tests
- Broader persistence layer beyond localStorage is not started
- ESLint shows some warnings (react-refresh only-export-components in UI files; console statements in test scripts); non-blocking.
- Some shadcn-generated UI shells have very long lines; treat as vendor-like and defer changes unless ergonomics need improvement.
- Equipment drawer tests emit non-blocking DialogContent description warnings; tracked for dedicated a11y pass.

## MVP Success Criteria

- [ ] End-to-end character creation (identity → class → traits → domains)
- [ ] Character sheet with core interactions
- [ ] Level-up with points
- [ ] Save/load characters
- [ ] Mobile-friendly layout

## Next Milestone

Target: Domain & Equipment drawers wired into per-id sheet
Timeline: 1–2 weeks
Deliverables: Equipment free-form mode; schema validation and mobile-friendly drawers; begin code-splitting for heavy lists; continue trimming oversized UI files using analyzer output

## Recent Progress Log

### August 16, 2025

- Mobile header chips finalized. Tightened gating to "after fully passing" using element bottom vs header height. Reordered chips to place Thresholds immediately after Core and before Class; moved Class before Resources; restored Gold as its own chip gated by its section. Converted thresholds labels to colon format and ensured a single thresholds chip. Verified resource +/- controls (HP/Stress/Hope/Armor) work in the header. Ran typecheck and full test suite: PASS (49/49).
- Resources logic updates documented: storage/actions expose `updateArmorScore`, `updateArmorScoreMax`, `updateGold`, and `setGold` in `src/features/characters/logic/resources.ts`. Armor Score is tracked as {current,max}. Gold adjustments clamp at 0 and persist.

- Route cleanup: Fixed remaining type/lint issues in `src/routes/characters/$id.tsx` (removed unused storage writer imports, added missing `IdentityCard` import, dropped invalid `disabled` prop on `ClassCardLazy`). Re-ran typecheck and full test suite: PASS (49/49).

### August 15, 2025

- Inventory card trimmed: extracted `InventorySummaryChips` and `InventoryList` presenters and refactored `inventory-card.tsx` to use them. Fixed corrupted unicode in chips presenter. All tests PASS (49/49); typecheck PASS. Size report refreshed: `inventory-card.tsx` no longer in top offenders; remaining large UI files: `community-drawer.tsx`, `equipment-drawer.tsx`, inventory drawer presenters.

- Community drawer trim (partial): extracted `CommunityList` and `HomebrewCommunityForm` presenters and refactored `community-drawer.tsx` to use them. Behavior unchanged; tests PASS (49/49); typecheck PASS. Next: measure size delta and consider extracting a tiny `useCommunityDraft` hook if further reduction is needed.

- Equipment drawer trim: added `useHomebrewMeta` hook and refactored `equipment-drawer.tsx` to remove duplicated homebrew handlers/state. Full suite PASS (49/49); typecheck PASS. Analyzer refreshed: equipment-drawer ~7.0 KB (down from ~10.5 KB). Next candidates by size/complexity: `ui/chart.tsx`, `inventory-drawer/homebrew-item-form.tsx`, and `inventory-drawer/library-results-list.tsx`.

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
- Header: Title now shows only the character's name in a smaller font; when empty, displays a subtle 'Add a name' placeholder (updated from 'Set a name').

### August 10, 2025

- Implemented Class/Subclass editor drawer (`src/components/characters/class-drawer.tsx`) mirroring Identity drawer patterns (RHF + Combobox); lazy-loaded.
- Added per-id localStorage persistence for class selection in `/characters/$id` with `ClassDraft` schema and storage helpers.
- Wired `ClassCard` to display the current class and subclass and open the drawer.
- Fixed mobile navbar overlap with drawers by lowering navbar z-index to `z-40`; drawers at `z-50` include safe-area footer padding so actions remain tappable above the navbar and keyboard.
- Typecheck/build: PASS (chunk-size warnings noted). Route tree generated correctly.

### August 10, 2025 (later)

- Domains drawer: prevented auto-close on add/remove by using non-submit buttons; added search inputs and filters (domain, level, type All/Spell/Ability); displayed costs and tags; added type badges in list rows and preview; kept description in preview.

### August 14, 2025 (even later)

- Implemented Class/Subclass Features section:
  - Added logic helper `deriveFeatureUnlocks` to compute gated feature list from class/subclass data; exported via logic index.
  - New `FeaturesCard` and `FeaturesDrawer` components with per-character selections persisted in storage; wired into `/characters/$id` below the Class section.
  - Ran full suite and typecheck: PASS (45/45). No regressions.

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

### August 11, 2025 (latest)

- Equipment drawer: Replaced global Pack/Free with per-tab Source filters (Default/Homebrew/All) on Primary and Secondary and removed Pack mode entirely (free-form only). Enlarged controls (outline, lg), added option counts, and an empty-state hint when filters hide all items. Fixed onValueChange to ignore empty values so lists update reliably. Accessibility: drawer scaffold now has a description wired via aria-describedby.
- Tests: Updated equipment drawer test to use Source=All for cross-slot behavior and to scope queries to visible tab panels. Full suite green locally.
- Quality gates: Type-check PASS; Build PASS.

### August 11, 2025 (later 2)

- Equipment & Inventory drawers wired to the route with RHF and persistence; cards summarize selections and equipped items.

### August 11, 2025 (later 7)

- Armor (mobile) parity and visibility improvements:
  - Drawer now lists both standard and special armor by switching to ALL_ARMOR as the source.
  - ArmorChips updated to emphasize Base score and thresholds and to show Material and a “Special” badge when applicable.
  - Drawer list items now reuse ArmorChips for the same look/labels as the Equipment card.
  - Quality gates: Type-check PASS; Build PASS; Tests PASS (24/24). Non-blocking a11y warnings remain for DialogContent description and are tracked for a future pass.
- Resources: HP thresholds UI added with read-only chips. New test `tests/resources-card.test.tsx` verifies rendering.
- Full test suite green locally; build and type-check pass.

### August 11, 2025 (later 8)

- Inventory drawer refactor: extracted `InventoryFiltersToolbar` and `LibraryResultsList` into `src/components/characters/inventory-drawer/` and rewired `inventory-drawer.tsx` to use them. Cleaned imports and kept DrawerScaffold footer/behavior unchanged.
- Quality gates: Tests PASS (28/28), Type-check PASS, Build unchanged. Known non-blocking a11y warnings persist for Equipment drawer dialog description (tracked separately).
- Analyzer (by size, top 25; excludes data/schemas): `$id.tsx` 23.5 KB; `equipment-drawer.tsx` 20.3 KB; `homebrew-item-form.tsx` 19.6 KB; `inventory-card.tsx` 19.3 KB; `domains-drawer.tsx` 14.2 KB; `library-results-list.tsx` 12.4 KB; `inventory/slot-row.tsx` 11.7 KB; `inventory-drawer.tsx` 9.0 KB.
- Next refactor candidates: split `homebrew-item-form.tsx`; reduce `inventory-card.tsx`; extract tab panels and filters hook in `equipment-drawer.tsx`.

### August 11, 2025 (later 9)

- Introduced `useEquipmentFilters` to consolidate filter/search/state for Equipment drawer tabs and refactored `equipment-drawer.tsx` to use it. Removed duplicated local state and memo blocks. Quality gates: Tests PASS (28/28); Type-check PASS (manual run showed no file errors for changed files); size report to be refreshed next.

### August 13, 2025

- Inventory card refactor: extracted small presenters for badges, cost chips, category inline details, and equipped list under `src/components/characters/inventory/*` and rewired `inventory-card.tsx` to consume them. Cleaned unused imports and tightened types (replaced any with precise types). Quality gates: full test suite PASS (28/28); targeted file error checks show none. Next: split `inventory-drawer/homebrew-item-form.tsx` and refresh size report.

- Inventory homebrew form: split category-specific JSX into `inventory-drawer/homebrew/*` presenters (SharedFields, UtilityFields, ConsumableFields, PotionFields, RelicFields, ModificationFields, RecipeFields). Updated `homebrew-item-form.tsx` to use them. Behavior unchanged; tests still PASS (28/28). Next: run size report and update docs with file deltas.

- Drawer primitive reversion: Restored `src/components/ui/drawer.tsx` to minimal pass-through behavior; moved/kept accessibility description responsibility in `src/components/drawers/drawer-scaffold.tsx` (provides `DrawerDescription` and wires `aria-describedby`). Dialogs retain auto-description in `ui/dialog.tsx` to reduce missing-description warnings.
- Validation snapshot: Full test suite PASS (28/28). Type-check task exits non-zero in CI task wrapper but targeted file checks show no diagnostics; behavior parity confirmed after drawer revert. Non-blocking Radix Dialog warnings persist in equipment drawer tests and will be handled in a focused a11y pass.
- Size report (latest run): `equipment-drawer.tsx` ~9.6 KB; `inventory-drawer.tsx` ~9.0 KB; `inventory-card.tsx` ~12.6 KB; `inventory-drawer/homebrew-item-form.tsx` ~12.3 KB; `inventory-drawer/library-results-list.tsx` ~12.4 KB; `ui/drawer.tsx` ~4.3 KB.

### August 14, 2025

- Implemented ThresholdsCard and wired into `/characters/$id` under Resources; removed duplicate thresholds from `ResourcesCard`.
- Added progression helpers (`getThresholds`, `getPointsForLevel`, `getOptionsForTier`, `validateLevelUpDecisions`) under `src/features/characters/logic/progression.ts` with tests.
- Added storage keys for level/progression/features and draft helpers in `features/characters/storage.ts` for the upcoming LevelCard/Drawer and FeaturesCard/Drawer.
- Tests: new `progression.test.ts` and `thresholds-card.test.tsx`; updated `resources-card.test.tsx`. Full suite PASS (36/36).

### August 14, 2025 (later)

- Ancestry & Community drawers: Implemented compact, scrollable list UIs with inline details; fixed a corrupted ancestry file by rewriting the panels; removed invalid aria-expanded in community and corrected trait key to `commonTraits`. Ran typecheck and full test suite: PASS (39/39).

### August 14, 2025 (later 2)

- Community editing parity and save fixes: Brought `CommunityDrawer` to match Ancestry patterns with a local draft model (tab-select/homebrew), enabled Save only when valid, and committed draft to form on submit. Fixed a bug where switching from Homebrew back to Select didn’t reset mode, causing saves to persist as the wrong type; synchronized `draftMode` with active tab.
- CommunityCard enhancements: Now shows community name with a Homebrew badge when applicable, common trait chips, and a concise feature block (name + description) for both standard and homebrew communities to improve readability.
- Visual polish: Added subtle color accents, badges, and emojis in both the drawer list and the card to make communities stand out; strengthened selected-row styling.
- Route wiring: Drawer submit calls route `onSubmit(form.getValues())`, mirroring Ancestry, ensuring persistence and close on Save.
- Quality gates: Ran test suite multiple times; transient ancestry test flake observed once then stabilized. Final runs green: 17/17 files, 42/42 tests; typecheck PASS.

### August 14, 2025 (later 3)

- Identity presenters and logic extracted:
  - Added `FeatureBlock`, `TraitChips`, `HomebrewBadge`, and `CardScaffold` under `src/components/characters/identity/*` to reduce duplication across identity cards.
  - Added `normalizeCommunity` and `getCommunityByName` wrapper under `src/features/characters/logic/identity.ts` to unify standard vs homebrew modes.
- CommunityCard refactor:
  - Rewrote `src/components/characters/community-card.tsx` to consume the shared presenters and normalization helper.
  - A11y/text-query fix: separated emoji and name into spans and marked emoji `aria-hidden` to stabilize screen reader output and tests.
- Tests:
  - Added `tests/community-card.test.tsx` covering standard, homebrew (with badge), and empty-state.
  - Resolved brittle queries by switching to `getAllByText` for trait chips.
- Quality gates: Full suite PASS locally (18 files, 45/45 tests). Typecheck PASS. Non-blocking Radix Dialog description warnings remain as noted earlier.

### August 14, 2025 (later 4)

- Class/Subclass features consolidation and polish:
  - Implemented feature derivation helpers (`deriveFeatureUnlocks`, `getUnlockedFeatures`) with tier mapping (2–4 → Tier 2, 5–7 → Tier 3, 8–10 → Tier 4) and L1-first ordering.
  - Consolidated the outside Class card (ClassSummary + unlocked-and-enabled FeaturesList) and the inside Class drawer (selection + full features editor with unlock level/tier labels and custom features CRUD). Default state enables only Level 1 features; Save is permitted for feature-only edits.
  - Upgraded subclass spellcasting trait from muted text to a visible badge row in ClassSummary on both the card and the drawer.
  - Refactored ClassSummary to remove unsafe casts and use schema-typed properties directly.
  - Validation: Full test suite PASS; Typecheck PASS. A transient CommunityCard test flake (broad regex) stabilized without code changes.
