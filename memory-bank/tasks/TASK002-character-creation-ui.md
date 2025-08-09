# [TASK002] - Character creation UI implementation

**Status:** In Progress
**Added:** August 9, 2025
**Updated:** August 9, 2025

## Original Request

Design and build a character creation wizard using existing schemas/data, including multiclass at creation, enforcing starting card counts during creation, equipment packs and free mode, Tailwind CSS styling with shadcn/ui components.

## Thought Process

Use TanStack Router for a step-by-step wizard under `/characters/new/*`, TanStack Form for per-step validation integrated with Zod, and autosave drafts to localStorage. Keep components headless where possible but prefer shadcn/ui primitives for inputs and layout.

## User Navigation Map (Web-app first)

Overview

- Entry points: `/characters` (list) and a primary CTA "New Character"
- Wizard shell: `/characters/new` with nested routes per step; steps are deep-linkable
- Draft handling: `draftId` in the query string; autosave to localStorage keyed by `draftId`
- Save completes and routes back to `/characters`; Cancel asks to discard or keep draft

Primary URLs

- `/characters` — list of saved characters; shows any resumable drafts
- `/characters/new` — wizard layout; redirects to the first incomplete step
- `/characters/new/identity` — first step (safe deep link)
- Future steps (names subject to schema): `/characters/new/class`, `/characters/new/traits`, `/characters/new/equipment`, `/characters/new/domains`, `/characters/new/review`

Flow Rules

- Next: Enabled only when the current step is valid; moving forward persists the step
- Back: Always allowed (does not require current validity); unsaved changes are autosaved on change
- Cancel/Exit: From any step, opens a confirm dialog with 3 choices:
  1.  Save draft & Exit → return to `/characters` and keep draft visible under "Drafts"
  2.  Discard draft → delete local draft and return to `/characters`
  3.  Continue editing → stay on current step
- Reload: If `draftId` present, reload restores from localStorage; if missing, layout creates a new `draftId` and updates the URL via `replace` to avoid extra history entries
- Deep Linking: Navigating directly to a later step resolves prerequisites; if unmet, redirect to earliest incomplete step
- History Strategy: Step transitions push state so browser Back navigates to the previous step; query params are preserved; the layout handles hydration

Validation & Gating

- Per-step Zod schemas validate only fields owned by that step
- The Review step runs the full `PlayerCharacterSchema.safeParse`
- Users can jump to completed steps via a sidebar/stepper; jumping to future steps triggers prerequisite checks and possible redirect

Autosave & Drafts

- Draft object shape: `{ id: string, updatedAt: number, data: Partial<PlayerCharacter> }`
- Storage keys: `characters:draft:<draftId>` and index `characters:drafts`
- Debounced autosave on change; manual Save available on Review

Edge Cases

- New tab with same `draftId`: last-writer-wins; show a subtle "draft updated" toast on cross-tab `storage` events
- Invalid/corrupt draft: Start a new draft and notify the user; keep the broken payload under `characters:draft:<draftId>:corrupt` for inspection
- Route not found under `/characters/new/*`: redirect to `/characters/new`

Return Paths

- After Save: navigate to `/characters` and highlight the newly saved character in the list
- After Discard: navigate to `/characters` and remove the draft from the drafts index

Keyboard & Mobile

- Left/Right arrows navigate Back/Next when focus is not in an input
- On mobile, show a sticky footer with Back, Next/Save, and Cancel

Acceptance Criteria (Navigation)

- Browser Back/Forward works intuitively between steps without losing progress
- Cancel flow offers Save draft, Discard, Continue options from any step
- Deep links to steps are supported; unmet prerequisites redirect to the earliest incomplete step
- Refresh preserves progress via `draftId` in the URL
- Review step prevents completion until the full schema validates

## Implementation Plan (Revised)

Phase 1 — Navigation shell

- [ ] Wizard layout route at `/characters/new` with step outlet and top/bottom nav (Back, Next/Save, Cancel)
- [ ] `draftId` lifecycle: ensure presence in URL, load/create, and autosave debounced to localStorage
- [ ] Step guard: redirect to earliest incomplete step when prerequisites unmet
- [ ] Cancel dialog: Save Draft, Discard, Continue
- [ ] Browser history: push on step change; preserve query params

Phase 2 — First step and review wiring

- [ ] Identity step with per-step Zod schema and Next gating
- [ ] Review step with full schema validation and Save action → `/characters`

Phase 3 — Additional steps (iterative)

- [ ] Class/Subclass with multiclass rules and derived domains
- [ ] Traits allocator with constraints
- [ ] Equipment: pack and free modes with validation
- [ ] Domains: card picker filtered by domains/level with starting count enforcement

Tests

- [ ] Route smoke tests: deep-link, back/forward, guard redirects
- [ ] Draft autosave/restore tests (with fake timers)
- [ ] Validation gating tests (per-step + full review)

## Progress Tracking

**Overall Status:** In Progress - 10%

### Subtasks

| ID   | Description                                       | Status      | Updated | Notes         |
| ---- | ------------------------------------------------- | ----------- | ------- | ------------- |
| 2.1  | Wizard layout + step outlet + nav                 | Not Started | -       | Phase 1       |
| 2.2  | `draftId` in URL + autosave/restore               | Not Started | -       | Phase 1       |
| 2.3  | Step guard redirect (earliest incomplete)         | Not Started | -       | Phase 1       |
| 2.4  | Cancel dialog (save/discard/continue)             | Not Started | -       | Phase 1       |
| 2.5  | Identity step + Next gating                       | Not Started | -       | Phase 2       |
| 2.6  | Review step + full validation + Save              | Not Started | -       | Phase 2       |
| 2.7  | Class/Subclass + multiclass rules                 | Not Started | -       | Phase 3       |
| 2.8  | Traits allocator                                  | Not Started | -       | Phase 3       |
| 2.9  | Equipment: pack + free                            | Not Started | -       | Phase 3       |
| 2.10 | Domains: picker + starting count enforcement      | Not Started | -       | Phase 3       |
| 2.11 | Tests: routes, autosave, gating                   | Not Started | -       | All phases    |
| 2.12 | Characters list + draft surfacing + import/export | Not Started | -       | After Phase 2 |

## Progress Log

### August 9, 2025

- Captured decisions: multiclass at creation; enforce starting card counts during creation; support both equipment pack and free mode; Tailwind + shadcn/ui.
- Replaced prior plan with a navigation-first map: defined URLs, back/forward behavior, cancel/save flows, deep links, and draft lifecycle.
