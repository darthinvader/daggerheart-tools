# TASK007 - Character Leveling, Thresholds, and Class/Subclass Features

**Status:** In Progress  
**Added:** 2025-08-13  
**Updated:** 2025-08-14 (later)

## Original Request

Lets create a new task, but first we need a plan and what to add to it; right now the things missing from our character sheet are: leveling, the thresholds being shown on their own with proper explanation, and class/subclass features. Ranger companion will be implemented later.

## Thought Process

We’ll deliver the remaining core gameplay loop on the character sheet:

- Leveling: Add level state, a level-up flow, and progression math (points per level, feature unlocks). Integrate with existing schemas so validation is authoritative.
- Thresholds: Present Major/Severe thresholds as their own small section with a clear, rules-aligned explanation and examples; keep numbers in sync with current/max HP.
- Class/Subclass Features: Show what you have now, what unlocks later, and allow choosing options at the appropriate levels. Respect SRD gating rules and subclass dependencies. Persist per-character.
- Ranger companion: Explicitly out-of-scope for this task; tracked as a follow-up.

Reality checks (Aug 13)

- Schemas: `PlayerCharacterSchema` already includes `level` and optional `progression` in `src/lib/schemas/player-character.ts`; `CharacterProgressionSchema`, `LevelUpPointSystemSchema`, and `getTierForLevel` live in `src/lib/schemas/core.ts` and constants in `src/lib/data/core/level-progression.ts`.
- Storage: Per-character storage helpers exist in `src/features/characters/storage.ts`, and centralized keys in `src/lib/storage.ts` (no level/progression/features keys yet—will add).
- Route and patterns: Canonical sheet route is `src/routes/characters/$id.tsx`. Drawers use `src/components/drawers/drawer-scaffold.tsx` with aria-describedby wiring. Idle prefetch helper exists at `src/features/characters/prefetch.ts`.
- Thresholds: `ResourcesCard` currently renders inline Major/Severe chips; we'll move to a dedicated small Thresholds card and remove the inline row to keep one source of truth.

Assumptions

- PlayerCharacter schema already contains or can be extended to include level/xp; thresholds are derived (not stored) from max HP.
- Feature data is derivable from existing class/subclass schemas (or we’ll add a light-weight Feature model pointing to SRD text keys).
- Per-id persistence via localStorage continues to be the MVP approach.

## Implementation Plan (complete and actionable)

1. Data & Schemas
   Target files:

- `src/lib/schemas/player-character.ts`
- `src/lib/schemas/core.ts` (progression types already exist)
- `src/lib/data/core/level-progression.ts` (constants already present)
- New: `src/features/characters/logic/progression.ts`

Steps:
1.1 PlayerCharacter fields

- Confirm `level` and `experience` exist (confirmed present Aug 13). Keep optional `progression` aligned with `LevelUpPointSystemSchema` and `CharacterProgressionSchema`.
- Define a narrow `LevelUpDecisions` type in the logic layer to capture choices (avoid schema churn): trait bumps, evasion/hp/stress increments, experience picks, domain card grants, subclass upgrade pick, multiclass pick.

  1.2 Feature/Unlock modeling (lightweight)

- Reuse `BaseFeatureSchema` and `SubclassFeatureSchema`. Create a logic-layer `FeatureUnlock` type: `{ featureName: string; level: number; source: 'class'|'subclass'; choiceId?: string; requiresChoice?: boolean }`.
- Derive unlocks from `classDetails.features` plus selected subclass features where `availability?.minLevel <= pc.level`.

  1.3 Progression helpers (new file)

- `getThresholds(maxHp: number): { major: number; severe: number }` → floor(max/2), floor(max/4). Edge cases: max>=1.
- `getTierForLevel(level: number)` → import from `core.ts` to avoid duplication.
- `getPointsForLevel(level: number)` → returns `LEVEL_UP_OPTIONS.POINTS_PER_LEVEL`.
- `getAvailableOptionsForTier(tier)` → return the correct map (TIER_2/3/4) from constants.
- `getAvailableUnlocks(pc)` → union from class/subclass based on level gate; mark `requiresChoice` if multiple variants.
- `applyLevelUp(pc, decisions)` → pure: validates total cost ≤ points; applies increments to hp.max/stress.max/evasion/traits/experiences/domain additions/features; increments `pc.level`; updates rally die and automatic benefits per `LEVEL_PROGRESSION`.

  1.4 Unit tests

- New `tests/progression.test.ts`: thresholds, tier mapping, options lookup, overspend rejection, rally die bump at 5+.

  1.5 Resources thresholds single source of truth

- After adding `getThresholds`, refactor `ResourcesCard` to remove its inline thresholds chips and rely on the new `ThresholdsCard` for display. Keep helper colocated in `logic/progression.ts` and re-use anywhere thresholds are needed.

Deep-dive details

- Inputs: a validated `PlayerCharacter`, constant tables, and a typed decisions object. Outputs: a new `PlayerCharacter` (no mutation).
- Error modes: invalid decision keys, exceed `maxSelections`, exceed available points, or tier-option used in wrong tier; throw a descriptive Error.
- Performance: helpers are O(1) or O(n) by small n (feature list sizes). No heavy data.
- Future extension: multiclass gating and companion upgrades can be layered without breaking API.

UI integration in current route ($id.tsx)

- New imports: `ThresholdsCard`, `LevelCard`, `level-up-drawer`, `features-card`, `features-drawer`.
- New lazy imports mirroring Identity/Class/Equipment drawers:
  - `const LevelUpDrawerLazy = React.lazy(() => import('@/components/characters/level-up-drawer').then(m => ({ default: m.LevelUpDrawer })))`
  - `const FeaturesDrawerLazy = React.lazy(() => import('@/components/characters/features-drawer').then(m => ({ default: m.FeaturesDrawer })))`
- Prefetch on idle: call `prefetchOnIdle` to warm LevelUp/Features drawers similar to equipment/inventory.
- New state: `const [level, setLevel] = React.useState(1)`; `const [progression, setProgression] = React.useState(/* default computed */)`; `const [openLevelUp, setOpenLevelUp] = React.useState(false)`; `const [openFeatures, setOpenFeatures] = React.useState(false)`; `const [featureSelections, setFeatureSelections] = React.useState(/* from storage */)`.
- Hydration: in the existing `useEffect` that hydrates per-id slices, also `setLevel(readLevelFromStorage(id)); setProgression(readProgressionFromStorage(id)); setFeatureSelections(readFeaturesFromStorage(id));`.
- Handlers: `onSubmitLevelUp(decisions)` calls `applyLevelUp` with a minimal PC view (level/resources/traits/classDetails/domain context) and persists updates (level/progression/resources/traits/domains/features as needed).
- Sections to add (order):
  1.  After Resources, add a new `<section id="thresholds">` rendering `ThresholdsCard` with `hpMax={resources.hp.max}`.
  2.  After Core Scores, add `<section id="level">` with `LevelCard` showing current level/tier/rally-die and edit action to open LevelUpDrawer.
  3.  After Class, add `<section id="features">` with `FeaturesCard` and an Edit button to open FeaturesDrawer.
- Suspense blocks: wrap new drawers with `<React.Suspense fallback={null}>` as used elsewhere.

Follow-up cleanup

- Once `ThresholdsCard` is rendered, delete the thresholds row from `src/components/characters/resources-card.tsx` to avoid duplication.

2. UI – Thresholds section
   Target files:

- New: `src/components/characters/thresholds-card.tsx`
- Update: `src/routes/characters/$id.tsx` to render beneath Resources

Steps:
2.1 Implement `ThresholdsCard`

- Props: `{ hpMax: number }`. Renders two chips and an Info button to open a Drawer with a concise explanation. Include sr-only description and aria-describedby via DrawerScaffold.
- A small presentational helper can memoize `{major,severe}` from `getThresholds(hpMax)`; no state.
  2.2 Tests
- `tests/thresholds-card.test.tsx`: renders correct values for hpMax=10; updates when prop changes.
  2.3 Remove inline thresholds from `ResourcesCard`
- Delete the thresholds chips row after ThresholdsCard lands. Add a lightweight regression test that `ResourcesCard` no longer renders threshold values (assert absence).

Deep-dive details

- Copy (WHY): Players often miss threshold math; include one-liner and optional mini drawer with examples. Avoid SRD quotes; use paraphrase.
- A11y: buttons have aria-labels; description is referenced by aria-describedby. Ensure contrast for chips and focus ring on controls.
- Edge cases: hpMax=1 shows Major ≤0, Severe ≤0; visually acceptable but we can guard to minimum 1 if desired. Keep as is (display-only).
- Performance: trivial render; memoize computed thresholds if needed, though unnecessary.

Component API (ThresholdsCard)

- Props: `{ id?: string; hpMax: number; className?: string }`.
- Behavior: computes `{ major, severe } = getThresholds(hpMax)` from logic helper.
- Layout: small Card with title “Damage Thresholds”, horizontal chips (Major/Severe), and an Info icon button to open a Drawer with a short explainer and examples.

3. UI – Leveling flow
   Target files:

- New: `src/components/characters/level-card.tsx`
- New: `src/components/characters/level-up-drawer.tsx`
- Update: `src/features/characters/storage.ts` (read/write level + progression)
- Update: `src/routes/characters/$id.tsx`

Steps:
3.1 Storage helpers

- Implement `readLevelFromStorage`, `writeLevelToStorage`, `readProgressionFromStorage`, `writeProgressionToStorage` (see section 5 for keys).
  3.2 LevelCard
- Show current level, tier, rally die, and “Level Up” (disabled at 10). Indicate available points.
  3.3 LevelUpDrawer
- RHF + zod per-tier option schemas with maxSelections/cost enforcement. UI shows remaining points and disables options when limits reached. On Save: compile `LevelUpDecisions`, call `applyLevelUp`, persist, close.
  3.4 Tests
- `tests/level-up-flow.test.tsx`: happy path spend, overspend error; state persisted via mocked storage.

Deep-dive details

- Form design: separate sections by option name with count steppers or toggles; inline errors for over-limit; sticky footer with Save/Cancel.
- Data binding: Controlled inputs; on change, recompute points remaining; disable Save if negative.
- Back handling: DrawerScaffold’s history push/pop is already in place; ensure unmount cleanup.
- Edge cases: Level 10 disables button; zero-point state (should not happen) still validates to no-op.
- A11y: label every control; announce errors; set initial focus on drawer title; Esc closes; Back closes first.

Component APIs and form schemas

- LevelCard props: `{ level: number; tier: string; rallyDie: string; pointsAvailable: number; onEdit(): void }`.
- LevelUpDrawer props: `{ open: boolean; onOpenChange(v:boolean): void; level: number; tier: string; progression: CharacterProgression; onSave(decisions: LevelUpDecisions): void; onCancel(): void }`.
- Zod schemas per tier enforce:
  - sum(cost(selection)) ≤ POINTS_PER_LEVEL
  - each option count ≤ maxSelections
  - structural constraints (two unmarked traits, etc.)
- UI widgets:
  - Trait picker: multiselect limited to two; disallow marked traits.
  - Experiences: list with count steppers up to two total bonuses; persist as name→+1/+2.
  - Evasion/HP/Stress: checkboxes or steppers adding fixed +1 to max.
  - Domain card grant: domain select limited to `accessibleDomains` and level ≤ allowed.
  - Subclass upgrade / Multiclass: radios; when chosen, disable the other option for this tier.

4. UI – Class/Subclass features
   Target files:

- New: `src/components/characters/features-card.tsx`
- New: `src/components/characters/features-drawer.tsx`
- Update: `src/features/characters/storage.ts`

Steps:
4.1 FeaturesCard

- Group unlocked features by source and level; dim future features; add level chips.
  4.2 FeaturesDrawer
- Full list and choice UIs for pick-based features. Save persists selections for later reference.
  4.3 Tests
- `tests/features-view.test.tsx`: current vs future visibility; selection persisted.

Deep-dive details

- Data source: `classDetails` from player character; selection state saved separately (features storage) to avoid mutating SRD data.
- Choice modeling: when a feature has variants, persist `choiceId` or selected variant name; render as radios or select.
- A11y: use role=list and role=listitem where helpful; ensure keyboard navigation; keep descriptions in accessible markup.
- Performance: lists are small; no virtualization needed.

Component APIs

- FeaturesCard props: `{ currentLevel: number; className: string; subclass: string; classFeatures: BaseFeature[]; subclassFeatures: SubclassFeature[]; selections: Record<string, string|number|boolean>; onEdit(): void }`.
- FeaturesDrawer props: `{ open: boolean; onOpenChange(v:boolean): void; currentLevel: number; classFeatures: BaseFeature[]; subclassFeatures: SubclassFeature[]; selections: Record<string, string>; onSave(nextSelections): void; onCancel(): void }`.
- Rendering: group by source and sort by level/minLevel; show a small level chip on each; dim items above current level.

5. Persistence & Migration
   Target files:

- `src/lib/storage.ts` — add keys
- `src/features/characters/storage.ts` — add read/write helpers and migrations

Keys:

- `characterKeys.level(id)` → `dh:characters:${id}:level:v1`
- `characterKeys.progression(id)` → `dh:characters:${id}:progression:v1`
- `characterKeys.features(id)` → `dh:characters:${id}:features:v1`

Migrations:

- If missing level, default to 1; progression computed from level with 0 spent.
- If missing features, derive unlocked up to current level from class/subclass.

Deep-dive details

- Validation: use zod schemas for storage values (mirroring drafts pattern). Fail-safe to defaults on parse errors.
- Back-compat: keep existing keys untouched; only add new ones.
- Testability: storage helpers pure-wrapped for mocking in tests.

Storage helpers to add (in `src/features/characters/storage.ts`)

- Level: `readLevelFromStorage(id): number` (default 1), `writeLevelToStorage(id, n)`.
- Progression: `readProgressionFromStorage(id): CharacterProgression` (compute from level if missing), `writeProgressionToStorage(id, p)`.
- Features: `readFeaturesFromStorage(id): Record<string,string>` (keyed by feature name or id), `writeFeaturesToStorage(id, map)`.

6. Tests (summary)

- `progression.test.ts` — helpers + guardrails
- `thresholds-card.test.tsx` — UI values update
- `level-up-flow.test.tsx` — form validation + persistence
- `features-view.test.tsx` — list & choices behavior
- `resources-card.no-thresholds.test.tsx` — ensure thresholds are no longer displayed inline once ThresholdsCard is present

Test strategy

- Use Testing Library + jsdom. Mock storage via an in-memory map. For logic tests, no React needed.
- Cover at least one error case per module (overspend, invalid choice, parse failure fallback).

Test matrix (essentials)

- progression.test.ts: thresholds math; points per level; options-by-tier; overspend throws; rally die at level 5 → d8.
- thresholds-card.test.tsx: hpMax=10 → Major 5 / Severe 2; prop change to 12 → 6/3.
- level-up-flow.test.tsx: select two traits and +1 evasion at Tier 2 within 2 points; overspend with third pick → error; Save persists level+1 and updates resources/traits.
- features-view.test.tsx: current features visible; future dimmed; choosing a variant persists and shows in card after save.

7. Docs

- Update `README.md` and `memory-bank/progress.md` after implementation with screenshots and quick usage.

Sequencing

1. Logic/progression helpers + tests
2. Storage keys/helpers + tests
3. ThresholdsCard + test and wire into `$id.tsx`
4. LevelCard + LevelUpDrawer + tests
5. FeaturesCard + FeaturesDrawer + tests
6. Docs update
7. Remove inline thresholds from `ResourcesCard` and add the regression test

Risks & mitigations

- Ambiguity in feature unlock choices: start minimal (name-based) and expand once SRD choice patterns are enumerated.
- UI complexity in LevelUpDrawer: keep schema-driven validation and constrain pickers to avoid invalid states.
- Potential duplication of thresholds (ResourcesCard shows inline chips): we’ll move thresholds display to the new card and optionally keep a minimal reference in Resources if needed. Keep one source of truth (logic helper).

## Progress Tracking

**Overall Status:** In Progress – 70%

### Subtasks

| ID  | Description                                         | Status      | Updated    | Notes                                                                                                                                                                                |
| --- | --------------------------------------------------- | ----------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.1 | Confirm level/xp fields; align progression          | Complete    | 2025-08-13 | Verified in `player-character.ts` and `core.ts`                                                                                                                                      |
| 1.2 | Progression helpers + applyLevelUp                  | In Progress | 2025-08-14 | Added logic/progression.ts (thresholds, tier, options, validator) + tests                                                                                                            |
| 1.3 | Feature unlock derivation model                     | Not Started | 2025-08-13 | Logic-only types; no schema changes                                                                                                                                                  |
| 2.1 | Implement ThresholdsCard with explanation           | Complete    | 2025-08-14 | thresholds-card.tsx + tests added                                                                                                                                                    |
| 2.2 | Remove inline thresholds from ResourcesCard         | Complete    | 2025-08-14 | Inline chips removed; regression test updated                                                                                                                                        |
| 2.3 | DS override in thresholds and logic                 | Complete    | 2025-08-14 | Added dsOverride/ds storage, UI override switch, and classifyDamage override                                                                                                         |
| 3.1 | Implement LevelCard                                 | Not Started | 2025-08-13 | Shows level/tier/rally die                                                                                                                                                           |
| 3.2 | Implement LevelUpDrawer (RHF+zod)                   | Not Started | 2025-08-13 | Validates costs and selections                                                                                                                                                       |
| 4.1 | Implement FeaturesCard and FeaturesDrawer           | Complete    | 2025-08-14 | Features logic + card/drawer added; wired into $id route; persisted choices; ClassSummary shows subclass spellcasting as a badge; default L1 enabled; Save allows feature-only edits |
| 5.1 | Add storage keys (level, progression, features)     | In Progress | 2025-08-14 | Keys added; helpers stubbed for follow-up                                                                                                                                            |
| 5.2 | Add storage helpers + migrations for level/features | Not Started | 2025-08-13 | Update features/characters/storage.ts                                                                                                                                                |
| 6.1 | Add tests for thresholds/leveling/features          | In Progress | 2025-08-14 | Added progression + thresholds tests; suite 37/37                                                                                                                                    |
| 7.1 | Update README and Memory Bank progress              | Not Started | 2025-08-13 |                                                                                                                                                                                      |

## Acceptance Criteria

- Thresholds are displayed in their own section with a concise, accurate explanation and stay in sync with HP changes (ResourcesCard no longer displays thresholds inline).
- Leveling flow allows advancing from 1→10 with validation of required choices; Save persists and updates summary cards.
- Class/Subclass features are listed by level, future features are indicated, and choice-based unlocks enforce selection at unlock time.
- All new logic is covered by unit tests (threshold math + unlock gating + basic UI flows).
- No regressions in existing tests; typecheck/build remain green.
- Ranger companion is not implemented in this task and remains a separate follow-up.

## Out of Scope

- Ranger companion mechanics and UI (tracked as a separate future task).
- Multiclass UI (respect existing decision to include at creation; leveling multiclass choices may be deferred if not in SRD scope).

## Notes

- Follow existing DrawerScaffold pattern (aria-describedby wired via description component; safe-area footer padding; back button closes drawers first).
- Keep code size in check: extract small presenters and hooks as needed; prefer pure helpers in `src/features/characters/logic/*`.

## Progress Log

### 2025-08-13

- Created task with end-to-end plan covering schemas, UI (thresholds/leveling/features), persistence, and tests. Marked Ranger companion as out-of-scope for this task.
- Verified repo alignment: level/progression schemas present; route and drawer scaffolding confirmed; idle prefetch helper available; thresholds currently inline in ResourcesCard—will migrate to dedicated card.

### 2025-08-14

- Implemented thresholds logic helper `getThresholds` and added `progression.ts` with `getPointsForLevel`, `getOptionsForTier`, and `validateLevelUpDecisions`.
- Added `ThresholdsCard` with an Info drawer; wired it into the character route below Resources. Removed duplicate inline thresholds from `ResourcesCard`.
- Added storage keys for level/progression/features and stubbed read/write helpers for future leveling/features work.
- Tests: new `progression.test.ts` and `thresholds-card.test.tsx`; updated `resources-card.test.tsx`. Full suite PASS locally.

### 2025-08-14 (later)

- Damage thresholds UX finalized: compact inline preview with centered interleaved row “1 | M≤X | 2 | S≤Y | 3 | DS≥Z | 4” and a settings drawer.
- Added Double Severe (DS) override: storage schema extended with `dsOverride` and `ds` and migration for legacy shapes; UI switch gates editing the Custom DS input with validation (DS ≥ Severe). `classifyDamage` now supports a `doubleSevereOverride` param.
- Replaced native alerts with toasts: mounted global Toaster and swapped alerts in thresholds components for toast errors/success.
- Tests: Re-ran suite; now PASS (37/37). Typecheck PASS.

### 2025-08-14 (even later)

- Implemented class/subclass feature derivation helpers (`deriveFeatureUnlocks`, `getUnlockedFeatures`).
- Added `FeaturesCard` and `FeaturesDrawer` with per-character selections persisted via storage helpers; wired into `src/routes/characters/$id.tsx` below Class section. Refactored `ClassSummary` to typed accessors and upgraded subclass spellcasting trait from muted text to a visible badge row in both surfaces (card and drawer). Default Level 1 features enabled; higher tiers disabled until unlocked. Save permitted for feature-only edits.
- Exported features helpers from logic index.
- Ran full test suite and typecheck: PASS (45/45). No regressions.
