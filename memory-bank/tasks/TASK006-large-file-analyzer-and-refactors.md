# TASK006 - Large-file analyzer and refactors

Status: In Progress
Added: 2025-08-11
Updated: 2025-08-11 (later)

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

Overall Status: In Progress - 88%

### Subtasks

| ID   | Description                                             | Status   | Updated    | Notes                           |
| ---- | ------------------------------------------------------- | -------- | ---------- | ------------------------------- |
| 1.1  | Create analyzer script and pnpm alias                   | Complete | 2025-08-11 | `pnpm run size:report`          |
| 1.2  | Sidebar split (context/variants/menu)                   | Complete | 2025-08-11 | `sidebar.tsx` 21.3 KB → 10.1 KB |
| 1.3  | Domains drawer: extract hook + sections                 | Complete | 2025-08-11 | 18.1 KB → 15.1 KB               |
| 1.4  | Re-run analyzer, keep data/schemas/showcase excluded    | Complete | 2025-08-11 |                                 |
| 1.5  | Add tests for new hook                                  | Complete | 2025-08-11 | 12 tests passing                |
| 1.6  | Consider further splits (sidebar group, homebrew panel) | Pending  | 2025-08-11 | Low-risk next steps             |
| 1.7  | Enhance analyzer (complexity, fan in/out, MD/JSON)      | Complete | 2025-08-11 | Reports saved to repo root      |
| 1.8  | Extract Equipment Drawer homebrew forms                 | Complete | 2025-08-11 | Two files created, wired in     |
| 1.9  | Rewire Equipment Drawer to imports, remove inline forms | Complete | 2025-08-11 | Typecheck/Tests/Build PASS      |
| 1.10 | Next: extract source toggle + list rows                 | Pending  | 2025-08-11 | Keep behavior, shrink file      |
| 1.11 | Extract SourceFilterToggle + wire-in                    | Complete | 2025-08-11 | Duplication removed             |
| 1.12 | Create Weapon/Armor list item components                | Complete | 2025-08-11 | Presentational only             |
| 1.13 | Rewire drawer to use list item components               | Complete | 2025-08-11 | Tests PASS                      |
| 1.14 | Fix analyzer CLI parsing and outDir writes              | Complete | 2025-08-11 | MD+JSON saved under coverage    |
| 1.15 | Extract CharacterJsonMenu from $id route                | Complete | 2025-08-11 | Route size reduced              |
| 1.16 | Extract Inventory SlotRow presenter                     | Complete | 2025-08-11 | inventory-drawer shrank         |
| 1.17 | Add prefetchOnIdle helper and use in route              | Complete | 2025-08-11 | Warms Domains drawer chunk      |
| 1.18 | Lazy-load Domains HomebrewCardForm                      | Complete | 2025-08-11 | Suspense-wrapped, no UX change  |
| 1.19 | Attempt lazy-load Equipment homebrew forms              | Complete | 2025-08-11 | Reverted to keep tests green    |

## Progress Log

### 2025-08-11

- Implemented `scripts/size-report.mjs` with exclusions and CLI flags; added `size:report` pnpm script.
- Sidebar refactor: moved context/provider and constants to `sidebar/context.tsx` (TooltipProvider wrapper), variants to `sidebar/variants.ts`, and menu primitives to `sidebar/menu.tsx`. Removed `useSidebar` re-export from the main file to satisfy `react-refresh/only-export-components`.
- Domains drawer refactor: added `use-loadout-lists.ts` hook and small UI components `available-cards-section.tsx` and `type-summary-chips.tsx`; updated drawer to use them.
- Validations: Type-check PASS, Tests PASS (12), Build PASS.

- Analyzer upgraded: added complexity proxy, long-line stats, fan-in/out, JSON+Markdown outputs with `--md --outDir`. Ran and saved `size-report.json` and `size-report.md`.
- Equipment Drawer: extracted `HomebrewWeaponForm` and `HomebrewArmorForm` to `src/components/characters/equipment-drawer/`. Rewired main drawer to import them and removed inline definitions. File dropped to 40.4 KB, LOC 959, Cx 52 (from ~53.6 KB, 1341 LOC, Cx 66). All tests passing (24), build succeeds.
- Source filter deduped via `SourceFilterToggle`; then rewired primary/secondary/armor lists to use `WeaponListItem` and `ArmorListItem`. Drawer now at ~26.6 KB, 650 LOC, Cx 41; fanOut 12. All tests pass.
- Fixed analyzer `--md/--json --outDir` bug (space-separated flags) and mkdirp for outDir; reports now write to `coverage/size-report.{json,md}`.
- Extracted route export/import dropdown to `CharacterJsonMenu` component; `$id.tsx` dropped to ~20.2 KB, 573 LOC, Cx 19.

## Next Steps

- Optional: Split sidebar group components (header/footer/group/group-label/actions) to `sidebar/group.tsx`.
- Optional: Extract Domains drawer homebrew form into its own module.
- Consider simple code-splitting for heavy UI to reduce initial chunk sizes.

See also: `memory-bank/refactor-plan.md` for prioritized targets and thresholds. Latest analyzer run (Aug 11) top items: `equipment-drawer.tsx` (19.4 KB/505 LOC/Cx 47), `routes/characters/$id.tsx` (19.9 KB/566 LOC/Cx 15), `domains-drawer.tsx` (14.7 KB/350 LOC/Cx 22), `inventory-drawer.tsx` (7.4 KB/252 LOC).
