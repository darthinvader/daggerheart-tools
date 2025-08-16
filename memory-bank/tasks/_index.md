# Tasks Index

## In Progress

- [TASK003] Character sheet interface - Build responsive character sheet display
- [TASK004] Data persistence layer - Implement save/load functionality
- [TASK005] Mobile character display and editor - Modular cards; Identity & Class drawers; Domains drawer w/ search+filters; Resources (Hope now current/max + HP thresholds UI); Gold emoji tap-to-set (0–9) with label-to-zero; traits cleanup; navbar z-index fix; removed BottomActionBar & Play Mode; removed QuickJump per user; Equipment & Inventory cards + drawers wired; Equipment drawer Source filters (Default/Homebrew/All) with larger toggles and counts; Reset/Export/Import added; EquipmentCard a11y labels + tests; drawers footer safe-area padding; Items UI enriched with schema fields; Armor filter overflow fixed; Armor filter redesigned (Kind/Tier/Modifiers); Removed Equipment Items tab and card summary (Items via Inventory only); InventoryCard refactor with presenters; Mobile header chips finalized (after-pass gating via rect.bottom, order Traits→Core→Thresholds→Class→Resources→Gold; thresholds labels with colons; Gold as separate chip after Gold section; single thresholds chip)
- [TASK006] Large-file analyzer & refactors - Analyzer upgraded (complexity, fan-in/out, MD/JSON). Started equipment-drawer split (homebrew forms extracted) with tests passing
  - Refactor plan added at `memory-bank/refactor-plan.md`; current top offenders: equipment-drawer.tsx, $id.tsx, inventory-drawer.tsx, domains-drawer.tsx
- [TASK007] Character Leveling, Thresholds, and Class/Subclass Features - ThresholdsCard implemented and wired; inline thresholds removed. Progression helpers (+ tests) and DS override shipped. Class/Subclass Features consolidated (card shows unlocked-and-enabled; drawer embeds full editor); subclass spellcasting trait visible as a badge; ClassSummary refactored to typed accessors. Next: LevelCard & LevelUpDrawer.
- [TASK008] Enhance Identity, Leveling, and Traits - Schema additions for background/description/connections, leveling decisions, trait bonuses; LevelCard + LevelUpDrawer added; Summary removed
- [TASK014] Trim Community Drawer - Completed: presenters extracted and wired; tests/typecheck PASS; analyzer confirms reduction
- [TASK022] Idle Prefetch & Caching - Warm up heavy drawers with dynamic imports; validate cache hits

## Completed

- [TASK000] Domain card system implementation - Completed all 9 domains with full SRD data
- [TASK000] Class system foundation - Completed all 9 classes with subclasses and progression
- [TASK006] Large-file analyzer tool - Script added and validated on Aug 11, 2025
- [TASK012] Trim Thresholds Inline Editor - Extracted `ThresholdsButtonsRow` and `ThresholdsSettingsPanel`; refactored `thresholds-inline.tsx`; tests/typecheck PASS; size report refreshed
- [TASK009] Heavy Modules Refactor Plan & Execution - 100% complete. Extracted presenters/hooks across Domains, Equipment, Inventory, and Thresholds; trimmed `inventory-card.tsx` via `InventorySummaryChips` and `InventoryList`; all tests/typecheck PASS; analyzer snapshot updated.
- [TASK013] Trim Inventory Card - Completed by extracting `InventorySummaryChips` and `InventoryList`, refactoring `inventory-card.tsx` to use them, fixing unicode issues, and keeping behavior parity. Tests/typecheck PASS.
- [TASK015] Trim Equipment Drawer - Completed: added `useHomebrewMeta` and refactored drawer; tests/typecheck PASS; size now ~7.0 KB (from ~10.5 KB).
- [TASK016] Trim Inventory Library Results List - Completed: presenters wired; inline logic removed; tests/typecheck PASS.

## Abandoned

None currently

## Pending

- [TASK017] Trim UI Chart - Extract sub-presenters (Legend/Tooltip/Axis) and pure helpers; keep API stable.
- [TASK018] Trim Inventory Homebrew Item Form - Extract repeated groups and helpers; maintain RHF wiring.
- [TASK019] Virtualize Inventory and Domains Lists - Optional windowing for 150+ items; a11y preserved.
- [TASK020] React 19 Compiler Evaluation - Audit, enable on branch, measure.
- [TASK021] shadcn UI Alignment Audit - Reconcile wrappers with stock.
- [TASK023] Trim Inventory Homebrew Item Form - Reduce complexity; no nested forms.
- [TASK024] Dialog Description A11y Pass - Ensure Description/aria-describedby.
- [TASK025] Bundle Snapshot & Deltas - Refresh and commit reports.
- [TASK026] Domains UI Windowing - Reduce render work for many cards.
- [TASK027] React Profiler Baseline - Capture current perf snapshots.
- [TASK028] Route Splitting & Prefetch - Further reduce initial payload.
