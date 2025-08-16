# TASK022 - Edit affordances refactor

**Status:** Completed  
**Added:** 2025-08-16  
**Updated:** 2025-08-16

## Original Request

Revise the edit button UX/UI. Equipment lacks a standalone Edit button because users tap items directly. Refine the rest of the UI similarly to avoid large Edit buttons or move them near titles, or remove/replace with better affordances.

## Thought Process

- Align with mobile-first, space-efficient design used in Equipment.
- Replace prominent "Edit" text buttons with subtle pencil icon buttons aligned to the title area, or enable tap-to-edit on content when practical.
- Maintain accessibility via aria-labels on icon buttons.
- Keep visual consistency across Ancestry, Community, Identity, Class, Features, Domains, Inventory, and Level cards.

## Implementation Plan

- Move identity-related card actions into headers (`CardScaffold` update).
- Swap text "Edit" buttons for compact ghost icon buttons with Pencil icon.
- Preserve other action buttons (e.g., Undo/Reset in Level card).
- Verify tests and typecheck remain green.

## Progress Tracking

**Overall Status:** Completed - 100%

### Subtasks

| ID  | Description                               | Status   | Updated    | Notes |
| --- | ----------------------------------------- | -------- | ---------- | ----- |
| 1.1 | Update `CardScaffold` actions placement   | Complete | 2025-08-16 |       |
| 1.2 | Replace Edit buttons with icon buttons    | Complete | 2025-08-16 |       |
| 1.3 | Keep Level card secondary actions as text | Complete | 2025-08-16 |       |
| 1.4 | Run tests and typecheck                   | Complete | 2025-08-16 | 49/49 |

## Progress Log

### 2025-08-16

- Updated `CardScaffold` to render actions in header.
- Converted Edit buttons in: Identity, Ancestry, Community, Class, Features, Domains, Inventory, and Level to icon buttons with `aria-label`s.
- Left Level card Undo/Reset as text buttons; replaced Level Up with icon.
- Ran typecheck and tests: PASS (49/49).
