# TASK032 - Search upgrade + workerization

**Status:** Pending  
**Added:** 2025-08-17  
**Updated:** 2025-08-17

## Original Request

Improve search quality and responsiveness across large lists using better ranking and optional background processing.

## Thought Process

Use `match-sorter` for high-quality ranking with minimal cost. For 5k+ items, offload search/ranking to a Web Worker using Comlink. Preserve a11y and keyboard flows.

## Implementation Plan

- Replace ad-hoc filtering with match-sorter (fields: name, tags, type, level)
- Add feature-flagged Comlink worker for large datasets; cancel prior work on input change
- Keep result markup semantics intact; no UX regressions
- Tests: correctness of top results; worker cancelation; fallback path

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

| ID  | Description                             | Status      | Updated    | Notes |
| --- | --------------------------------------- | ----------- | ---------- | ----- |
| 3.1 | Add match-sorter utilities              | Not Started | 2025-08-17 |       |
| 3.2 | Implement workerized search via Comlink | Not Started | 2025-08-17 |       |
| 3.3 | Wire drawers to new search layer        | Not Started | 2025-08-17 |       |
| 3.4 | Tests for ranking and cancelation       | Not Started | 2025-08-17 |       |

## Progress Log
