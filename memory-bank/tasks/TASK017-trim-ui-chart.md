# TASK017 - Trim UI Chart

**Status:** Pending  
**Added:** 2025-08-15  
**Updated:** 2025-08-15

## Original Request

Refactor `src/components/ui/chart.tsx` (~9.7 KB, high complexity) to reduce complexity and improve readability without changing behavior.

## Thought Process

- File is a UI primitive with high complexity; likely candidates: extract small presentational subcomponents (Legend, Tooltip, AxisLabels) and pure helpers for config mapping.
- Keep props and public API stable to avoid ripple effects.

## Implementation Plan

- Identify nested JSX islands and extract into `ui/chart/` subcomponents.
- Move any inline config transforms into pure helpers.
- Ensure no behavioral changes; keep styling and accessibility intact.
- Validate with typecheck and test suite; spot-check showcase if applicable.

## Acceptance Criteria

- Visual/behavioral parity.
- Typecheck PASS; tests PASS.
- Notable reduction in complexity (analyzer Cx drops) and/or size.

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

| ID  | Description                               | Status      | Updated    | Notes |
| --- | ----------------------------------------- | ----------- | ---------- | ----- |
| 1.1 | Audit file, define extraction boundaries  | Not Started | 2025-08-15 |       |
| 1.2 | Extract Legend/Tooltip/Axis presenters    | Not Started | 2025-08-15 |       |
| 1.3 | Factor pure helpers for config mapping    | Not Started | 2025-08-15 |       |
| 1.4 | Wire back in and remove inline duplicates | Not Started | 2025-08-15 |       |
| 1.5 | Run analyzer, tests, typecheck            | Not Started | 2025-08-15 |       |

## Progress Log

### 2025-08-15

- Task created from size report; queued after TASK016.
