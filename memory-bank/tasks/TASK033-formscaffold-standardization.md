# TASK033 - FormScaffold standardization (RHF + zod)

**Status:** Pending  
**Added:** 2025-08-17  
**Updated:** 2025-08-17

## Original Request

Reduce duplication and re-render pitfalls across form-based drawers by introducing a standardized scaffold using RHF + zodResolver, safe-area footers, and consistent validation UX.

## Thought Process

Keep RHF, as it's already integrated and performant. Provide a shared scaffold and patterns: field-level bindings, no object writes per keystroke, lazy-loaded drawers, autosave-on-close hooks where appropriate.

## Implementation Plan

- Create `src/components/forms/FormScaffold.tsx` for RHF + zodResolver + footer
- Update existing drawers to use the scaffold incrementally
- Document patterns in `systemPatterns.md`
- Tests: basic form lifecycle and regression snapshots

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

| ID  | Description                      | Status      | Updated    | Notes |
| --- | -------------------------------- | ----------- | ---------- | ----- |
| 4.1 | Add FormScaffold component       | Not Started | 2025-08-17 |       |
| 4.2 | Migrate one drawer as a template | Not Started | 2025-08-17 |       |
| 4.3 | Update patterns documentation    | Not Started | 2025-08-17 |       |

## Progress Log
