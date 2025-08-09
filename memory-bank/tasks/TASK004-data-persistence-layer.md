# [TASK004] - Data persistence layer

**Status:** Pending
**Added:** August 9, 2025
**Updated:** August 9, 2025

## Original Request

Implement save/load functionality for characters, including autosave drafts during character creation. Start with localStorage for MVP, with an abstraction allowing future IndexedDB or server sync.

## Thought Process

Create a storage service with a narrow interface (get, set, remove, list, export/import). Use namespaced keys with versioning. Keep serialization/deserialization behind the service and validate with Zod at the boundary.

## Implementation Plan

- [ ] Define storage interface and versioned key scheme
- [ ] Implement localStorage adapter with namespacing
- [ ] Create draft autosave utility with debounce and conflict handling
- [ ] Export/Import JSON tooling with schema validation
- [ ] Wire character creation wizard to autosave drafts
- [ ] Wire character list page to storage service
- [ ] Tests: unit tests for storage and draft flows

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

| ID  | Description                    | Status      | Updated | Notes |
| --- | ------------------------------ | ----------- | ------- | ----- |
| 4.1 | Storage interface + key scheme | Not Started | -       |       |
| 4.2 | localStorage adapter           | Not Started | -       |       |
| 4.3 | Draft autosave utility         | Not Started | -       |       |
| 4.4 | Export/Import tooling          | Not Started | -       |       |
| 4.5 | Wizard integration             | Not Started | -       |       |
| 4.6 | Characters list integration    | Not Started | -       |       |
| 4.7 | Tests                          | Not Started | -       |       |

## Progress Log

### August 9, 2025

- Task created and scoped. Pending implementation following wizard scaffold.
