# TASK031 - IndexedDB adapter migration (idb-keyval)

**Status:** Pending  
**Added:** 2025-08-17  
**Updated:** 2025-08-17

## Original Request

Migrate heavy client data from localStorage to IndexedDB for scalability and offline-first without breaking existing users.

## Thought Process

`idb-keyval` offers a tiny, promise-based KV over IndexedDB. We'll add a read-through + write-through adapter with a feature flag. Start with caches (inventory/domains), later per-character blobs.

## Implementation Plan

- Add `src/features/characters/persistence/idb.ts` with read/write helpers
- Implement additive write-through: localStorage + IDB under a feature flag
- Provide a one-time sync util to seed IDB from LS on first run
- Scope to large datasets first; measure perf; expand gradually
- Tests: seed/migrate behavior; fallback to LS when IDB unavailable

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

| ID  | Description                             | Status      | Updated    | Notes |
| --- | --------------------------------------- | ----------- | ---------- | ----- |
| 2.1 | Implement idb adapter with feature flag | Not Started | 2025-08-17 |       |
| 2.2 | Add write-through + initial seeding     | Not Started | 2025-08-17 |       |
| 2.3 | Integrate with caches first             | Not Started | 2025-08-17 |       |
| 2.4 | Add tests for error/fallback paths      | Not Started | 2025-08-17 |       |
| 2.5 | Measure perf and document               | Not Started | 2025-08-17 |       |

## Progress Log
