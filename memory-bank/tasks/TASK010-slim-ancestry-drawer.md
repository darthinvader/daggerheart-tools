# TASK010 - Slim Ancestry Drawer

**Status:** Pending  
**Added:** 2025-08-15  
**Updated:** 2025-08-15

## Original Request

Continue Task009 by targeting `src/components/characters/ancestry-drawer.tsx` (~17.0 KB, Cx 64). Extract non-critical UI into presenters and move stateful wiring into tiny hooks. Preserve behavior; keep tests/typecheck green.

## Thought Process

- Current hotspots: tabs header, list rows, and homebrew/mixed panels. We already split `HomebrewAncestryForm` and `MixedList` but the parent still holds complex RHF wiring and tab controls.
- Approach: extract `AncestryTabsHeader`, `AncestrySelectList`, and a `useAncestryDraft` hook to encapsulate baseline/reset and submit/close logic.

## Implementation Plan

- Create `components/characters/ancestry/ancestry-tabs-header.tsx` (presenter)
- Create `components/characters/ancestry/ancestry-select-list.tsx` (presenter)
- Create `components/characters/ancestry/use-ancestry-draft.ts` (hook for baseline/reset)
- Update `ancestry-drawer.tsx` to consume them
- Validate with tests and typecheck

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

| ID  | Description                                 | Status      | Updated    | Notes |
| --- | ------------------------------------------- | ----------- | ---------- | ----- |
| 1.1 | Extract tabs header presenter               | Not Started | 2025-08-15 |       |
| 1.2 | Extract select list presenter               | Not Started | 2025-08-15 |       |
| 1.3 | Add `useAncestryDraft` hook                 | Not Started | 2025-08-15 |       |
| 1.4 | Wire ancestry-drawer to new pieces          | Not Started | 2025-08-15 |       |
| 1.5 | Run tests/typecheck and refresh size report | Not Started | 2025-08-15 |       |

## Progress Log

- 2025-08-15: Task created and queued after `$id.tsx` slimming.
