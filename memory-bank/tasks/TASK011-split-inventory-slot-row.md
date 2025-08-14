# TASK011 - Split Inventory SlotRow

**Status:** Pending  
**Added:** 2025-08-15  
**Updated:** 2025-08-15

## Original Request

Reduce `src/components/characters/inventory/slot-row.tsx` (~14.1 KB, 389 LOC) by extracting actions and UI chunks into smaller presenters, and encapsulate quick-edit handlers in a small hook.

## Thought Process

- SlotRow renders multiple variants and action clusters. Extract `SlotActions`, `QuantityStepper`, and `LocationSelect` presenters. Move toggle/equip logic into a small `useSlotActions` hook.

## Implementation Plan

- Create presenters under `components/characters/inventory/slot-row/`: `slot-actions.tsx`, `quantity-stepper.tsx`, `location-select.tsx`
- Create `features/characters/logic/inventory-slot-actions.ts` encapsulating equip/location sync
- Refactor `slot-row.tsx` to consume them
- Keep behavior identical; tests/typecheck must remain green

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

| ID  | Description                        | Status      | Updated    | Notes |
| --- | ---------------------------------- | ----------- | ---------- | ----- |
| 1.1 | Extract presenters                 | Not Started | 2025-08-15 |       |
| 1.2 | Add hook for action logic          | Not Started | 2025-08-15 |       |
| 1.3 | Wire `slot-row.tsx` to new modules | Not Started | 2025-08-15 |       |
| 1.4 | Run tests and size report          | Not Started | 2025-08-15 |       |

## Progress Log

- 2025-08-15: Task created and queued.
