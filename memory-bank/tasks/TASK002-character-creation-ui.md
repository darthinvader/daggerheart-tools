# [TASK002] - Character creation UI implementation

**Status:** In Progress
**Added:** August 9, 2025
**Updated:** August 9, 2025

## Original Request

Design and build a character creation wizard using existing schemas/data, including multiclass at creation, enforcing starting card counts during creation, equipment packs and free mode, Tailwind CSS styling with shadcn/ui components.

## Thought Process

Use TanStack Router for a step-by-step wizard under `/characters/new/*`, TanStack Form for per-step validation integrated with Zod, and autosave drafts to localStorage. Keep components headless where possible but prefer shadcn/ui primitives for inputs and layout.

## Implementation Plan

- [ ] Scaffold routes: `/characters`, `/characters/new` (layout), and steps: `identity`, `class`, `traits`, `equipment`, `domains`, `review`
- [ ] Draft context at wizard layout; manage `draftId` via search params; debounce autosave to localStorage
- [ ] Identity step with Zod validation and field components
- [ ] Class/Subclass step: show derived domains, enable multiclass selection/resolution rules
- [ ] Traits step: enforce point allocation constraints
- [ ] Equipment step: pack selector and free-form mode with validation
- [ ] Domains step: card picker filtered by accessible domains/level, enforce starting card count limits
- [ ] Review step: run full PlayerCharacterSchema.safeParse and show consolidated errors; Save
- [ ] Characters list page with saved characters, export/import JSON
- [ ] Tests: unit (validators), integration (draft end-to-end), route smoke

## Progress Tracking

**Overall Status:** In Progress - 10%

### Subtasks

| ID   | Description                                 | Status      | Updated | Notes |
| ---- | ------------------------------------------- | ----------- | ------- | ----- |
| 2.1  | Create routes and wizard layout             | Not Started | -       |       |
| 2.2  | Draft context + autosave                    | Not Started | -       |       |
| 2.3  | Identity step                               | Not Started | -       |       |
| 2.4  | Class/Subclass + multiclass rules           | Not Started | -       |       |
| 2.5  | Traits allocator                            | Not Started | -       |       |
| 2.6  | Equipment pack + free mode                  | Not Started | -       |       |
| 2.7  | Domain card picker + starting count enforce | Not Started | -       |       |
| 2.8  | Review & save                               | Not Started | -       |       |
| 2.9  | Characters list + import/export             | Not Started | -       |       |
| 2.10 | Tests: unit/integration/smoke               | Not Started | -       |       |

## Progress Log

### August 9, 2025

- Captured decisions: multiclass at creation; enforce starting card counts during creation; support both equipment pack and free mode; Tailwind + shadcn/ui.
- Outlined routes, validation strategy, autosave, and step-by-step plan.
