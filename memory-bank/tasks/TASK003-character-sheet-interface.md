# [TASK003] - Character sheet interface

**Status:** Pending
**Added:** August 9, 2025
**Updated:** August 9, 2025

## Original Request

Build a responsive, accessible character sheet UI that reflects the PlayerCharacter data model. Support read-only view initially with hooks for future editing and live validation.

## Thought Process

Start with a clean, mobile-first layout that maps 1:1 to core character concepts (Identity, Traits, Class/Subclass, Domains, Equipment, Resources). Use shadcn/ui primitives and Tailwind for layout; avoid premature interactivity until the creation flow is ready. Plan for modular panels so sections can be reused in the creation wizard review step.

## Implementation Plan

- [ ] Create route and layout container (`/characters/:id` and `/characters`)
- [ ] Sheet header with name/level/class badges and quick actions
- [ ] Identity panel (ancestry, community, background)
- [ ] Traits grid with modifiers and computed values
- [ ] Class/subclass summary with domain access display
- [ ] Domains panel: selected cards grouped by level/type
- [ ] Equipment + inventory summary
- [ ] Resources (HP/Stress/Armor/Gold) display
- [ ] Responsive/mobile layout and print-friendly view
- [ ] Wire to PlayerCharacter types; placeholder data initially
- [ ] Tests: render smoke + a11y checks

## Progress Tracking

**Overall Status:** Not Started - 0%

### Subtasks

| ID   | Description                    | Status      | Updated | Notes |
| ---- | ------------------------------ | ----------- | ------- | ----- |
| 3.1  | Routing and base layout        | Not Started | -       |       |
| 3.2  | Header with badges and actions | Not Started | -       |       |
| 3.3  | Identity panel                 | Not Started | -       |       |
| 3.4  | Traits grid                    | Not Started | -       |       |
| 3.5  | Class/Subclass summary         | Not Started | -       |       |
| 3.6  | Domains panel                  | Not Started | -       |       |
| 3.7  | Equipment + inventory          | Not Started | -       |       |
| 3.8  | Resources display              | Not Started | -       |       |
| 3.9  | Responsive + print view        | Not Started | -       |       |
| 3.10 | Type wiring + tests            | Not Started | -       |       |

## Progress Log

### August 9, 2025

- Task created and scoped. Pending until character creation wizard scaffolding begins.
