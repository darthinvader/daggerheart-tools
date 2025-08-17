# TASK030 - Introduce Zustand store and selectors

**Status:** Pending  
**Added:** 2025-08-17  
**Updated:** 2025-08-17

## Original Request

Adopt a lightweight global store to reduce prop drilling and re-renders across character sheet sections and drawers, while keeping RHF for forms.

## Thought Process

Zustand provides minimal ceremony, selector-based subscriptions, and persistence middleware. We'll create per-character slices (traits, resources, class, domains, equipment, leveling, experiences) and expose selector hooks with shallow equality.

## Implementation Plan

- Create `src/features/characters/state/store.ts` with slices per concern
- Add localStorage persistence middleware (parity with current keys)
- Replace ad-hoc prop threading where it causes redundant renders
- Keep RHF inside drawers; store manages ephemeral + derived UI state
- Add minimal tests around selectors and a rendering reduction smoke test

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

| ID  | Description                                | Status      | Updated    | Notes |
| --- | ------------------------------------------ | ----------- | ---------- | ----- |
| 1.1 | Create store scaffolding and slices        | Not Started | 2025-08-17 |       |
| 1.2 | Wire persistence middleware (LS)           | Not Started | 2025-08-17 |       |
| 1.3 | Replace prop-drilled state in key surfaces | Not Started | 2025-08-17 |       |
| 1.4 | Add selector-based tests                   | Not Started | 2025-08-17 |       |
| 1.5 | Profiler snapshot before/after             | Not Started | 2025-08-17 |       |

## Progress Log
