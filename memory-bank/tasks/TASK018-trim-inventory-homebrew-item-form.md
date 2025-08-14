# TASK018 - Trim Inventory Homebrew Item Form

**Status:** Pending  
**Added:** 2025-08-15  
**Updated:** 2025-08-15

## Original Request

Refactor `src/components/characters/inventory-drawer/homebrew-item-form.tsx` (~8.9 KB) to simplify structure by extracting sub-presenters and pure helpers; preserve behavior.

## Thought Process

- The form composes multiple category-specific sections already; further splitting could isolate validation hints, repeated field groups, and shared labels.
- Ensure RHF wiring remains correct; avoid nested form tags.

## Implementation Plan

- Identify repeated JSX groups (labels, hints, toggles) and extract into `homebrew/` presenters.
- Centralize any shared types/defaults in a small `homebrew/shared.ts` helper.
- Replace inline handlers with small callbacks where it reduces noise.
- Validate with tests/typecheck.

## Acceptance Criteria

- Behavior parity with current tests.
- Typecheck PASS; tests PASS.
- Noticeable reduction in LOC/complexity per analyzer.

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

| ID  | Description                        | Status      | Updated    | Notes |
| --- | ---------------------------------- | ----------- | ---------- | ----- |
| 1.1 | Audit form to find repeated groups | Not Started | 2025-08-15 |       |
| 1.2 | Extract shared presenters/helpers  | Not Started | 2025-08-15 |       |
| 1.3 | Wire presenters back into form     | Not Started | 2025-08-15 |       |
| 1.4 | Run analyzer, tests, typecheck     | Not Started | 2025-08-15 |       |

## Progress Log

### 2025-08-15

- Task created from size report; queued after TASK017.
