# Tasks Index

## In Progress

- [TASK001] Complete lib schema system - Finalizing player character schema and integration validation
- [TASK002] Character creation UI implementation - Per-id sheet at /characters/$id with section drawers; /characters/new redirects to UUID
- [TASK005] Mobile character display and editor - Modular cards; Identity & Class drawers; Domains drawer w/ search+filters; Resources (Hope now current/max + HP thresholds UI); traits cleanup; navbar z-index fix; removed BottomActionBar & Play Mode; removed QuickJump per user; Equipment & Inventory cards + drawers wired; Equipment drawer Source filters (Default/Homebrew/All) with larger toggles and counts; Export/Import added
- [TASK006] Large-file analyzer & refactors - Analyzer upgraded (complexity, fan-in/out, MD/JSON). Started equipment-drawer split (homebrew forms extracted) with tests passing
  - Refactor plan added at `memory-bank/refactor-plan.md`; current top offenders: equipment-drawer.tsx, $id.tsx, inventory-drawer.tsx, domains-drawer.tsx

## Pending

- [TASK003] Character sheet interface - Build responsive character sheet display
- [TASK004] Data persistence layer - Implement save/load functionality

## Completed

- [TASK000] Domain card system implementation - Completed all 9 domains with full SRD data
- [TASK000] Class system foundation - Completed all 9 classes with subclasses and progression
- [TASK006] Large-file analyzer tool - Script added and validated on Aug 11, 2025

## Abandoned

None currently
