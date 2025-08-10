# TASK006 - Large-file analyzer and refactors

Status: In Progress
Added: 2025-08-11
Updated: 2025-08-11

## Original Request

Identify big files in the codebase (excluding data and schemas) and refactor where it makes sense. Provide a runnable command to track sizes.

## Thought Process

- We need a stable, repo-local tool that can be run via pnpm and respects project constraints (exclude data/schemas and demo showcase).
- Prioritize high-LOC or long-line files that are project code, not vendor shells.
- Keep behavioral parity and type safety; validate with type-check, tests, and a build.

## Implementation Plan

- Add `scripts/size-report.mjs` with options: `--by=size|loc`, `--top`, `--minKB`, `--json`, and exclusions.
- Add `"size:report"` script in package.json.
- Use results to target:
  - `src/components/ui/sidebar.tsx` → extract context, variants, menu primitives
  - `src/components/characters/domains-drawer.tsx` → extract list management hook and small UI sections
  - Keep `src/lib/data` and `src/lib/schemas` intact

## Progress Tracking

Overall Status: In Progress - 70%

### Subtasks

| ID  | Description                                             | Status   | Updated    | Notes                           |
| --- | ------------------------------------------------------- | -------- | ---------- | ------------------------------- |
| 1.1 | Create analyzer script and pnpm alias                   | Complete | 2025-08-11 | `pnpm run size:report`          |
| 1.2 | Sidebar split (context/variants/menu)                   | Complete | 2025-08-11 | `sidebar.tsx` 21.3 KB → 10.1 KB |
| 1.3 | Domains drawer: extract hook + sections                 | Complete | 2025-08-11 | 18.1 KB → 15.1 KB               |
| 1.4 | Re-run analyzer, keep data/schemas/showcase excluded    | Complete | 2025-08-11 |                                 |
| 1.5 | Add tests for new hook                                  | Complete | 2025-08-11 | 12 tests passing                |
| 1.6 | Consider further splits (sidebar group, homebrew panel) | Pending  | 2025-08-11 | Low-risk next steps             |

## Progress Log

### 2025-08-11

- Implemented `scripts/size-report.mjs` with exclusions and CLI flags; added `size:report` pnpm script.
- Sidebar refactor: moved context/provider and constants to `sidebar/context.tsx` (TooltipProvider wrapper), variants to `sidebar/variants.ts`, and menu primitives to `sidebar/menu.tsx`. Removed `useSidebar` re-export from the main file to satisfy `react-refresh/only-export-components`.
- Domains drawer refactor: added `use-loadout-lists.ts` hook and small UI components `available-cards-section.tsx` and `type-summary-chips.tsx`; updated drawer to use them.
- Validations: Type-check PASS, Tests PASS (12), Build PASS.

## Next Steps

- Optional: Split sidebar group components (header/footer/group/group-label/actions) to `sidebar/group.tsx`.
- Optional: Extract Domains drawer homebrew form into its own module.
- Consider simple code-splitting for heavy UI to reduce initial chunk sizes.
