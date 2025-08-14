# [TASK008] - Enhance Identity, Leveling, and Traits

**Status:** In Progress  
**Added:** 2025-08-14  
**Updated:** 2025-08-14

## Original Request

1. Remove Summary
2. Add to identity section: character background or background Q&A the player answers; description details (eyes, hair, body, skin, clothing, mannerisms, etc.); and connections. Connections are questions and answers that you ask another player. Add these to the schema if they don’t exist.
3. Add a Leveling up section where we can mark our level and the level up options we selected.
4. Add to traits a smaller bonus input below the trait numbers, and add a number on the right that is the sum of the two. Do this for every trait.

## Thought Process

- Reviewed current schemas in `src/lib/schemas/player-character.ts` and `core.ts`.
  - Identity has `description` (single string) and `calling`, plus ancestry/community and abilities. No structured physical description fields yet. No background Q&A structure yet.
  - `connections` exist at top-level as `string[]` (optional), but not as Q&A pairs linked to other players.
  - Level/progression exists: `level` (number) and optional `progression` object (`rules` + `state`). UI-level “Leveling up” section likely not yet present as a dedicated card/drawer.
  - Traits model: per-trait `{ value: number; marked: boolean }`. No per-trait bonus field; total should be derived in UI.
- Assumptions:
  - “Remove Summary” refers to removing the Character Summary card from the sheet UI (not deleting any schema). We’ll track this as a UI task and confirm exact surface (e.g., SummaryStats card) when implementing.
  - For connections, we’ll model Q&A entries and optionally link to another character by ID/name, keeping backward compatibility by migrating existing `string[]` into a `text` field.
  - Trait totals will be computed; we’ll persist `base` and `bonus` to avoid ambiguity.

## Implementation Plan

- Identity enhancements (schema + UI):
  - Add `identity.background` supporting either freeform text or a list of Q&A pairs.
  - Add `identity.descriptionDetails` with structured optional fields: `eyes`, `hair`, `skin`, `body`, `clothing`, `mannerisms`, `other`.
  - Replace/augment `connections` with `identity.connections` as an array of `{ prompt, answer, withPlayer?: { id?: string; name?: string } }`. Keep top-level `connections` for back-compat and migrate into the new structure on read.
- Leveling section (schema + UI):
  - Keep `level` as source of truth; add `leveling` object for per-level decisions selected: `{ level: number; selections: Record<string, number>; notes?: string }[]` or map keyed by level. Align with `progression.state.spentOptions` for consistency.
  - Add a dedicated Level card/drawer in UI to mark level and choose options (tracked here for scope; UI implementation separate task link-able to TASK007).
- Traits bonus (schema + UI):
  - Extend trait state to `{ base: number; bonus?: number; marked: boolean }` (keeping compatibility by mapping `value -> base`).
  - Compute `total = base + (bonus ?? 0)` in UI. Persist only `base` and `bonus`.
- Remove Summary (UI):
  - Remove or hide the Summary card/section from the character sheet; verify no dependent tests rely on it. If data elements are needed elsewhere, ensure alternative surfaces exist (e.g., Snapshot rows on other cards).

### Detailed Plans per Subtask

#### 1.1 Design identity.background and descriptionDetails schema

- Contract
  - Input: existing `PlayerCharacter.identity` object
  - Output: `identity.background` (string | Q&A[]), `identity.descriptionDetails` (all optional fields)
  - Back-compat: no breaking changes when fields absent
- Steps
  1. Define `BackgroundQAPairSchema` and `BackgroundSchema` (Done).
  2. Define `DescriptionDetailsSchema` optional fields (Done).
  3. Add to `IdentitySchema` as optional fields (Done).
  4. Document usage in UI forms; no migrations required.
- Tests
  - Schema parse success with string background and with Q&A[] background.
  - Schema parse success with partial description details.
- Acceptance
  - Typecheck passes, tests pass; existing characters validate unchanged.

#### 1.2 Model identity.connections Q&A with optional player link

- Contract
  - Input: `identity.connections?: Connection[]`; legacy `connections?: string[]` remains
  - Output: validated Q&A entries with optional `{ id, name }`
  - Migration: optional reader that maps legacy strings into `{ prompt: 'Connection', answer: s }`
- Steps
  1. Add `ConnectionSchema` (Done) and include in `IdentitySchema`.
  2. Keep legacy top-level `connections` (Done) for read-only back-compat.
  3. (Optional) Add normalization helper to merge legacy into identity on load.
- Tests
  - Identity with connections Q&A parses.
  - Legacy top-level `connections` can coexist without invalidating schema.
- Acceptance
  - No regressions; can store structured connections.

#### 2.1 Add leveling decisions structure aligned to progression

- Contract
  - Input: `level` and `progression` already present
  - Output: `leveling[]` capturing per-level `selections` and optional `notes`
  - Align: keys in `selections` mirror `progression.state.spentOptions` keys
- Steps
  1. Add `leveling` array schema with defaults (Done).
  2. Ensure tests cover empty default and populated entries.
  3. UI alignment: Level card/drawer to read/write this array.
- Tests
  - Parse with empty/default.
  - Parse with multiple levels and selection maps.
- Acceptance
  - Schema supports tracking choices by level without breaking existing data.

#### 2.2 Wire Leveling section UI (card/drawer)

- Scope
  - Add Level card to `/characters/$id` below Thresholds/Features.
  - Drawer allows: set current level, show available points/options (from helpers), record selections, add notes.
- Steps
  1. Create `LevelCard` and `LevelUpDrawer` components.
  2. Integrate with existing progression helpers in `features/characters/logic/progression.ts`.
  3. Persist via per-id storage; autosave on close; Reset per open-session baseline.
  4. Tests: rendering, select options, persist writes, helper integration.
- Acceptance
  - Can mark level and record choices; tests pass; a11y checks OK.

#### 3.1 Extend trait schema with bonus field

- Contract
  - Input: current `traits` map values `{ value, marked }`
  - Output: extended `{ value, bonus?, marked }`; total computed in UI
  - Back-compat: `bonus` optional (defaults to 0)
- Steps
  1. Add `bonus?: number` with default 0 (Done).
  2. UI: add small input below each trait numeric; display total at right.
  3. Avoid persisting derived totals.
- Tests
  - Schema parse without bonus (defaults to 0).
  - Schema parse with bonus values.
- Acceptance
  - Traits accept bonuses; UI can display and compute totals.

#### 4.1 Remove Summary card from UI

- Scope
  - Identify and remove/hide the Summary card/section (likely `SummaryStats` or similar) from `/characters/$id`.
  - Ensure key snapshots remain available on other cards (Identity/Resources).
- Steps
  1. Locate Summary component and its usage in the route.
  2. Remove component import/JSX; adjust layout spacing.
  3. Update tests that reference the summary; migrate expectations to other cards if necessary.
  4. Verify mobile layout spacing after removal.
- Acceptance
  - Route builds without the Summary card; tests updated and passing.

## Progress Tracking

**Overall Status:** In Progress - 60%

### Subtasks

| ID  | Description                                              | Status   | Updated    | Notes                                        |
| --- | -------------------------------------------------------- | -------- | ---------- | -------------------------------------------- |
| 1.1 | Design identity.background and descriptionDetails schema | Complete | 2025-08-14 | Implemented in player-character.ts           |
| 1.2 | Model identity.connections Q&A with optional player link | Complete | 2025-08-14 | Back-compat legacy array retained            |
| 2.1 | Add leveling decisions structure aligned to progression  | Complete | 2025-08-14 | Added `leveling[]` alongside `progression`   |
| 2.2 | Wire Leveling section UI (card/drawer)                   | Complete | 2025-08-14 | LevelCard + LevelUpDrawer wired with storage |
| 3.1 | Extend trait schema with bonus field                     | Complete | 2025-08-14 | Compute total in UI                          |
| 4.1 | Remove Summary card from UI                              | Complete | 2025-08-14 | Summary removed from route                   |

## Progress Log

### 2025-08-14

- Created task from user request and documented current schema state and plan.
- Updated `src/lib/schemas/player-character.ts`:
  - Added `identity.background` (string or Q&A array), `identity.descriptionDetails` (eyes, hair, skin, body, clothing, mannerisms, other), and `identity.connections` (Q&A with optional player ref). Kept legacy top-level `connections: string[]` for back-compat.
  - Added `leveling[]` to log per-level selections; kept `level` and optional `progression`.
  - Extended trait state with optional `bonus` (kept `value` as base). Tests PASS.
- Implemented Leveling UI:
  - Added storage helpers `readLevelingFromStorage`/`writeLevelingToStorage` and key in `lib/storage.ts`.
  - Created `LevelCard` and lazy `LevelUpDrawer` (uses progression helpers for options/budget validation).
  - Wired into `/routes/characters/$id.tsx`; persists level and per-level selections; displays recent entry summary.
  - Ran tests/typecheck: PASS. Existing dialog description warnings persist (unrelated).
