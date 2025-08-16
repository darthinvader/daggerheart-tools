# Active Context - Daggerheart Tools

Updated: August 16, 2025

## Current Work Focus

Aug 16, 2025 (new – Experiences section):

- Added `ExperiencesCard` to `/characters/$id` (after Resources, before Class). Users can adjust total XP and manage narrative Experiences (name, optional trait, +1/+2, notes). Data persists per character with new storage keys: `experience` and `experiences`. Tests added and full suite PASS; typecheck PASS.

Aug 16, 2025 (final – mobile header chips order/gating and labels):

- Mobile-only progressive header finalized in `src/components/layout/sheet-header.tsx`.
- Section pass detection tightened: a section counts as "passed" only when its `getBoundingClientRect().bottom` is above the header (with a small buffer). Outcome: chips appear strictly after fully passing a section.
- Chip order and gating (mobile): Traits → Core → Thresholds → Class/Subclass (with Level) → Resources → Gold.
  - Thresholds chip appears together with Core (showThresholds = showCore) and is rendered BEFORE Class.
  - Thresholds labels now use colons: "M: X / S: Y / MD: Z" (MD only when enabled in settings). Clicking 1/2/3/(4) applies -1/-2/-3/(-4 when critical enabled) HP via `onDeltaHp`.
  - Class chip shows class/subclass and current level; appears only after passing Class section.
  - Resources chip includes quick +/- for HP, Stress, Hope, and Armor Score current (no Gold here).
  - Gold is a separate compact chip (emoji summary), revealed only after passing the Gold section.
- Duplicate thresholds chip removed; header stays hidden until at least one chip is visible.
- Tests/typecheck: PASS (49/49 tests).
  Also addressed lingering type/lint issues in the main sheet route `$id.tsx` (imports/props). Typecheck and tests remain green after the cleanup.
- Note: This supersedes earlier Aug 16 notes that temporarily included Gold inside the Resources chip; final behavior keeps Gold as its own chip gated by the Gold section.

Aug 16, 2025 (mobile topbar progressive info):

- Added a mobile-only progressive info bar inside the sticky `SheetHeader`. As users scroll past sections, compact chips appear in order: Traits (Agi/Str/Fin/Inst/Pres/Know with numbers), Core (Evasion, Proficiency), Class/Subclass names, Resources (HP/Stress/Hope numbers), and Thresholds summary (1 | M≤X | 2 | S≤Y | 3 | DS≥Z | 4 without the trailing 4 chip). Thresholds values are sourced from `useThresholdsSettings` (auto/manual with DS override). The bar is horizontally scrollable, subtle (bg-muted/60), and hidden on md+.
- Scroll detection uses header height vs section `getBoundingClientRect().top` for a lightweight solution. If a `#thresholds` section is absent, the last milestone falls back to `#equipment` so the bar still reveals thresholds after Resources.
- Files: `src/components/layout/sheet-header.tsx` (UI + logic). Typecheck and tests PASS (49/49).

Aug 16, 2025 (follow-up – header gating + gold):

- Thresholds chip now appears as soon as Core is passed (with the Core chip) rather than waiting for the Thresholds section, per spec.
- Updated later: Gold is not summarized inside Resources; see "final – mobile header chips" above for the final separation and gating.

Aug 16, 2025 (mobile header polish + resources):

- Top bar stays hidden until you scroll past the first section; earlier top-crossing gating has been replaced by the stricter bottom-crossing rule (see final above).
- Resources chip uses `resources.armorScore.current` instead of armor base score. Gold is no longer shown inside Resources; it’s a separate chip gated by the Gold section.
- `Resources` storage/actions include `armorScore` current/max and `gold` helpers (see `features/characters/logic/resources.ts`): `updateArmorScore`, `updateArmorScoreMax`, `updateGold`, `setGold`.
- Thresholds chip in the header shows clickable 1/2/3 and an optional 4 (MD) when `enableCritical` is on; tapping applies HP deltas identical to the thresholds inline component.

Aug 16, 2025 (latest – Leveling flow change to record-only):

- Leveling flow is now record-only. The Level Up Drawer records the target level, notes, and selection counts into per-character leveling history and updates the current level number, but it does not mutate any other character data (Resources, Traits, etc.). Players manually apply HP/Stress/Evasion/Proficiency/Traits changes outside the leveling UI per table preference. Undo/Reset only affect the level history and current level, not other fields.
- Implementation: removed side-effects in `$id.tsx` `onSaveLevelUp` and undo handlers; storage continues to use `level` and `leveling` keys. Tests/typecheck remain PASS.

Aug 16, 2025 — Level Up Drawer Spent calculation:

- The Level Up Drawer footer now shows live Points/Spent. Spent is computed from current in-drawer selections only (not prior tier history): sum(count × cost) over `selections`. Implemented with `react-hook-form` `useWatch` to keep the display reactive during selection changes.

Aug 16, 2025 — Compact level-up summaries in Level card:

- Implemented compact formatter for level-up selections shown in the character sheet: Traits +1×2, Exps +1×2, Domain +1, Evasion +1, HP +1, Stress +1, Prof +1, Subclass ↑, Multiclass. Summaries are joined with a middle dot and omit zero-counts. Applied to both Recent and History in the Level card.

Aug 14, 2025 (latest – Class/Subclass features consolidation):

- Consolidated Class and Subclass presentation into a single experience. Outside card shows ClassSummary plus a compact FeaturesList of currently unlocked-and-enabled features only; the Class drawer contains selection controls, the full ClassSummary (with starting stats), and an embedded features editor (shows all features with availability, unlock level, and tier mapping; Level 1 default enabled; future features dimmed). Custom features CRUD lives alongside and persists with the class section.
- Subclass spellcasting trait now appears as a visible badge row in ClassSummary (both the card and the drawer). This replaces the earlier muted text treatment.
- Refactored ClassSummary to remove unsafe casts and rely on schema-typed properties directly; simplified props and improved readability.
- Persistence: Save is allowed even when only feature toggles/custom features change (no class/subclass change). Default state enables only Level 1 features.
- Feature derivation helpers added under `src/features/characters/logic/features.ts` (gate level from feature, tier mapping 2–4 → Tier 2, 5–7 → Tier 3, 8–10 → Tier 4; L1-first ordering). Outside card renders only unlocked-and-enabled; drawer editor shows all with clear labels.
- Quality gates: typecheck PASS; full test suite PASS. A prior intermittent CommunityCard query flake stabilized on rerun; no changes needed there.

Aug 13, 2025 (latest):

- UI Drawer primitive restored to minimal pass-through (`src/components/ui/drawer.tsx`). Accessibility description now owned by `src/components/drawers/drawer-scaffold.tsx`, which provides a screen-reader-only `DrawerDescription` and wires `aria-describedby` to `DrawerContent`.
- Dialogs: `ui/dialog.tsx` keeps auto-description behavior to mitigate missing-description warnings for DialogContent when callers don’t pass `aria-describedby`.
- Quality gates: Full test suite PASS (28/28). Non-blocking Radix Dialog warnings persist in equipment drawer tests; will be addressed in a dedicated a11y pass. Type-check task exits non-zero in wrapper, but changed files show no diagnostics.
- Size snapshot (by analyzer): `equipment-drawer.tsx` ~9.6 KB; `inventory-drawer.tsx` ~9.0 KB; `inventory-card.tsx` ~12.6 KB; `inventory-drawer/homebrew-item-form.tsx` ~12.3 KB; `inventory-drawer/library-results-list.tsx` ~12.4 KB; `ui/drawer.tsx` ~4.3 KB.

### Routing & UI Flow

- Decision (revised): Use per-character routes for the sheet. `/characters/new` only generates a fresh UUID and redirects to `/characters/$id`.
- Canonical sheet route: `/characters/$id`. Section editors open as drawers and can be lazy-loaded.

Changes implemented (recent):

- Per-id character sheet at `src/routes/characters/$id.tsx` composed from modular cards (SummaryStats, ResourcesCard, CoreScoresCard, ConditionsCard, IdentityCard, TraitsCard, ClassCard, DomainsCard) with per-id localStorage persistence.
- Identity and Class/Subclass editors implemented as lazy-loaded Drawers (RHF + zod), with Save/Cancel and safe-area aware footers.
- `/characters/new` generates a UUID and redirects to `/characters/$id`; characters index lists entries and links to New.
- Mobile: Ensured drawers appear above the MobileNavBar by lowering navbar z-index to `z-40` and keeping drawers at `z-50`; confirmed footer safe-area padding prevents action buttons from being obscured.
- Resources/Gold (Aug 11): Switched Gold controls to emoji tap-to-set with label-to-zero behavior. Narrowed rows for small phones, removed hint text, and used opacity to indicate selection. Emoji set updated for broad support: 🪙 for handfuls, 💰 for bags, 🧰 as a chest stand-in. Horizontal scroll removed in favor of wrapping.
- Global bottom padding remains on `<main>` to avoid overlap with the navbar; drawers sized with 100dvh.
- Character sheet mobile nav: Removed BottomActionBar and eliminated Play Mode; added a compact QuickJump section links bar.
- Typecheck/build/tests pass consistently (chunk-size warnings accepted for now).

Equipment drawer (Aug 11, 2025 - latest):

Aug 13, 2025 (UX polish):

- Drawers: Added back-button interception. When a drawer opens, we push a history state and close the drawer on popstate. Pressing Back on mobile now closes the drawer first instead of navigating away. Implemented in `src/components/drawers/drawer-scaffold.tsx` with safe cleanup to avoid double back.
- Equipment > Armor filters: Simplified the “Mods” filter from multi-select toggles to explicit checkboxes: “Only show armor that modifies: Evasion, Agility”. Clearer mental model and more compact on mobile. File: `equipment-drawer/armor-filters-toolbar.tsx`.
- Resources/Core: Moved Hope from Core Scores into Resources. Resources now manages HP, Stress, and Hope (each with current/max). Core Scores now shows Evasion and Proficiency only. Route wiring updated accordingly and tests adjusted.
- Inventory visibility: Added an “Inventory Items” subheader and a divider before the Equipped summary so users can distinguish the sections at a glance.
- Inventory list parity: Normalized action button sizes in the Inventory drawer results list to match the Inventory card controls (smaller h-6 icon/sm buttons), improving consistency.
- Identity editor: Converted Description to a multi-line textarea and kept Calling as a dedicated input to better guide players.

- Removed Pack mode entirely. Standardized on free-form selection with per-tab Source filters on Primary and Secondary tabs: Default (slot standard only), Homebrew (homebrew-only for slot), and All (primary + secondary + both homebrew lists).
- Made Source controls larger and clearly selected using ToggleGroup variant="outline" and size="lg".
- Added live counts to each Source option label (Default/Homebrew/All) so the effect is visible at a glance.
- Added empty-state notice under lists when filters yield no items.
- Fixed onValueChange to ignore empty values so selection always updates; lists now respond reliably to Source changes.
- Accessibility: DrawerScaffold includes a description wired via aria-describedby.
  Updated Aug 11: The description text is now screen-reader-only and no longer references keyboard Tabs (mobile-first). Tabs now horizontally scroll on mobile.

Aug 11 (later):

- Extracted a small hook `useEquipmentFilters` at `src/components/characters/equipment-drawer/hooks/use-equipment-filters.ts` to centralize source filters, search queries, counts, and filtered lists for Primary, Secondary, and Armor. Updated `equipment-drawer.tsx` to consume it, eliminating local duplication. Tests unchanged and passing.

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

Aug 14, 2025 (latest):

- Added ThresholdsCard below Resources and removed inline thresholds from ResourcesCard to keep one source of truth. Implemented `getThresholds` helper in `features/characters/logic/progression.ts` and basic progression helpers (tier, points, options, validator) with tests. Added storage keys for `level`, `progression`, and `features` with draft helpers for upcoming leveling flow.

- Damage thresholds UX polish: Implemented a compact inline thresholds preview and a dedicated settings drawer with Auto vs Custom values. Added explicit Double Severe (DS) support with an optional Custom DS override controlled by a switch. Persisted `dsOverride` and `ds` in per-character storage with back-compat migration. Updated `classifyDamage` to accept an optional DS override parameter.

- Replaced native browser alerts with app toasts: Mounted a global `Toaster` in the app root and swapped validation/cancel alerts in thresholds components for `toast` messages.

- Layout: Inline thresholds header now left-aligned with a right-side edit icon; interleaved row centered as “1 | M≤X | 2 | S≤Y | 3 | DS≥Z | 4”. Drawer shows a compact summary instead of a wide table.

- Quality gates: Typecheck PASS; tests PASS (37/37 at latest). Existing non-blocking a11y warnings for equipment drawer dialogs remain and are tracked for a later pass.

Aug 14, 2025 (later):

- Ancestry & Community drawers (mobile polish): Restored a clean, compact, scrollable list UI. Standard list rows use small padding and inline detail expansion; Mixed ancestry uses two compact lists with feature previews and a name field up top. Removed erroneous aria-expanded usage and fixed community data keys to `commonTraits`. All tests and typecheck PASS (39/39).

- Ancestry drawer performance/loop fix: Removed render feedback loops causing slow inputs and occasional "Maximum call stack" on reopen. Consolidated multiple `useWatch` subscriptions into a single watcher, avoided wrapping non-controlled container in `FormField`, guarded redundant `setValue` calls, and switched homebrew nested fields to field-level bindings (name/description) instead of object writes per keystroke. Root cause was also in the character route form reset effects that reset on every identity change - fixed by using refs to capture latest data without triggering dependency loops. Result: inputs are responsive; reopening Mixed/Homebrew no longer over-updates; tests and typecheck PASS.

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

Aug 15, 2025 (latest):

- Trimmed `inventory-drawer/library-results-list.tsx` by extracting presenters and a helper:
  - `presenters/ItemActions.tsx` for quantity/equip/remove controls
  - `presenters/ItemBadges.tsx` for Tier/Rarity/Cost chips (uses estimateItemCost)
  - `presenters/ItemFeatures.tsx` for description + features preview
  - `presenters/emoji.ts` exporting `emojiForItem`
- Updated `library-results-list.tsx` to consume presenters and removed inline logic. Tests/typecheck PASS.
- Refreshed analyzer: `library-results-list.tsx` dropped off the top offenders; next candidates: `ui/chart.tsx` (~9.7 KB, high complexity) and `inventory-drawer/homebrew-item-form.tsx` (~8.9 KB).

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
- Extended idle prefetch in `$id.tsx` to also warm Equipment and Inventory drawers during idle (snappier open, no behavior change).
- Domains drawer: `HomebrewCardForm` is now lazy-loaded behind `Suspense` (no behavior change).
- Inventory drawer: extracted `SlotRow` presenter to `src/components/characters/inventory/slot-row.tsx` and rewired usage to reduce duplication.
- Equipment drawer: attempted lazy-load for homebrew forms but reverted to synchronous imports to keep tests reliable; behavior unchanged.

Latest analyzer snapshot (Aug 11, refreshed):

- Top by size/loc (excluding data/schemas):
  - `src/routes/characters/$id.tsx` — 23.5 KB, 677 LOC, Cx 24
  - `src/components/characters/equipment-drawer.tsx` — 20.3 KB, 516 LOC, Cx 54 (very long lines)
  - `src/components/characters/inventory-drawer/homebrew-item-form.tsx` — 19.6 KB, 421 LOC, Cx 64 (heavy JSX; candidate to split)
  - `src/components/characters/inventory-card.tsx` — 19.3 KB, 396 LOC, Cx 91
  - `src/components/characters/domains-drawer.tsx` — 14.2 KB, 332 LOC, Cx 22
  - `src/components/characters/inventory-drawer/library-results-list.tsx` — 12.4 KB, 291 LOC, Cx 54
  - `src/components/characters/inventory/slot-row.tsx` — 11.7 KB, 288 LOC, Cx 13
  - `src/components/characters/inventory-drawer.tsx` — 9.0 KB, 233 LOC, Cx 32 (post-extraction)
  - UI shells with very long lines remain: menubar, dropdown-menu, context-menu, sidebar.

Armor (mobile) UI updates (Aug 11):

- Expanded drawer source to include non-standard armor (ALL_ARMOR), so special armor appears in search and selection.
- Enhanced ArmorChips to surface Material and a “Special” badge; made Base score and Major/Severe thresholds visually prominent for small screens.
- Unified UI by reusing ArmorChips in drawer list items and the Equipment card, ensuring consistent badges/values.
- Validations: type-check PASS, build PASS, tests PASS (24/24). Note: equipment drawer tests still emit non-blocking DialogContent description warnings; will address separately in a11y pass.

Inventory drawer refactor (Aug 11, 2025 - latest):

- Extracted InventoryFiltersToolbar and LibraryResultsList from `inventory-drawer.tsx` into `src/components/characters/inventory-drawer/`.
- Rewired `inventory-drawer.tsx` to consume them; removed unused imports; kept DrawerScaffold footer.
- Behavior parity verified by tests; size redistributed: main file ~9.0 KB; new list presenter ~12.4 KB.
- Next: consider splitting `homebrew-item-form.tsx` and trimming `inventory-card.tsx`.

Inventory card refactor (Aug 13, 2025 - latest):

- Extracted presentational components to reduce duplication and improve readability while preserving behavior:
  - `src/components/characters/inventory/badges.tsx` (TierBadge, RarityBadge, WeightBadge)
  - `src/components/characters/inventory/cost-chips.tsx` (CostChips using estimateItemCost)
  - `src/components/characters/inventory/category-inline-details.tsx` (per-category inline detail text)
  - `src/components/characters/inventory/equipped-list.tsx` (renders equipped items summary)
- `inventory-card.tsx` updated to use these presenters; removed local helpers and redundant logic. Typecheck clean for changed files; full test suite PASS (28/28).

Inventory homebrew form split (Aug 13, 2025 - latest):

- Extracted category sections into presenters under `src/components/characters/inventory-drawer/homebrew/`:
  - `shared-fields.tsx`, `utility-fields.tsx`, `consumable-fields.tsx`, `potion-fields.tsx`, `relic-fields.tsx`, `modification-fields.tsx`, `recipe-fields.tsx`
- Refactored `homebrew-item-form.tsx` to consume them; behavior unchanged. Tests remain PASS (28/28). Next: refresh size report and capture deltas.

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
