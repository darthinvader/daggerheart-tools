# TASK029 - Improve header name UX

**Status:** Completed  
**Added:** 2025-08-16  
**Updated:** 2025-08-16

## Original Request

"Set a name" isn’t intuitive. Create a task, plan a fix, and implement it.

## Thought Process

The header currently shows a button with a placeholder string "Set a name" when the character has no name. Users found this phrasing unclear. The action is an edit/add action, so the copy should reflect that. We can improve clarity by:

- Using more common copy like "Add a name" or "Enter a name".
- Adjusting the accessibility label to reflect the state (Add vs Edit).
- Keeping the existing tap-to-edit behavior and hover underline to preserve affordance.

## Implementation Plan

- Replace placeholder text "Set a name" with clearer copy ("Add a name").
- Change title tooltip fallback from "Set a name" to "Add a name".
- Make aria-label dynamic: "Add name" when empty, "Edit name" when present.
- Keep styles and behavior unchanged to avoid layout/test regressions.
- Run typecheck and tests.

## Progress Tracking

**Overall Status:** Completed - 100%

### Subtasks

| ID  | Description                                 | Status   | Updated    | Notes                           |
| --- | ------------------------------------------- | -------- | ---------- | ------------------------------- |
| 1.1 | Create task and plan                        | Complete | 2025-08-16 | Task file + plan created        |
| 1.2 | Update header placeholder and labels        | Complete | 2025-08-16 | Implemented in sheet-header.tsx |
| 1.3 | Update Memory Bank index and progress notes | Complete | 2025-08-16 | Index/progress updated          |
| 1.4 | Typecheck and run tests                     | Complete | 2025-08-16 | Suite green locally             |

## Progress Log

### 2025-08-16

- Replaced placeholder copy with "Add a name" and updated title fallback accordingly.
- aria-label now reads "Add name" when no name is set; remains "Edit name" when a name exists.
- Typecheck PASS; tests PASS.
