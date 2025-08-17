# TASK034 - Chart split & lazy-load

**Status:** Pending  
**Added:** 2025-08-17  
**Updated:** 2025-08-17

## Original Request

Reduce size and complexity of `src/components/ui/chart.tsx` and defer cost via lazy-loading at usage sites.

## Thought Process

Keep Recharts, extract primitives (ChartContainer/Legend/Tooltip/Axis), and code-split. Only revisit charting library if necessary for bundle goals.

## Implementation Plan

- Extract primitives from `ui/chart.tsx`
- Update consumers to lazy-load the chart module
- Verify tree-shaking and chunk sizes
- Tests: smoke render and interaction

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

| ID  | Description                 | Status      | Updated    | Notes |
| --- | --------------------------- | ----------- | ---------- | ----- |
| 5.1 | Extract primitives          | Not Started | 2025-08-17 |       |
| 5.2 | Lazy-load consumers         | Not Started | 2025-08-17 |       |
| 5.3 | Measure bundle and document | Not Started | 2025-08-17 |       |

## Progress Log
