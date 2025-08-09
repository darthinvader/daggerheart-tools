# Active Context - Daggerheart Tools

Updated: August 9, 2025

## Current Work Focus

### Library Schema Development

We're focused on the core data models and validation schemas that form the foundation of the application. The schemas are consolidated and type-safe across game systems.

Recent cleanups (verified today):

- Consolidated subclass schemas to a single BaseSubclassSchema across all classes; optional companion supported for Ranger Beastbound.
- Merged ancestry/community logic into `src/lib/schemas/identity.ts`; removed stale `schemas/classes.ts`.
- Consolidated `core/*` into `src/lib/schemas/core.ts` and removed legacy forwarders.
- Consolidated equipment and domain schemas into `src/lib/schemas/equipment.ts` and `src/lib/schemas/domains.ts`.
- Domain card data lives under `src/lib/data/domains/*` (one file per domain), not under `src/lib/schemas`.

### Recently Completed

- Domain Card System: All 9 core domains present under `src/lib/data/domains/` with SRD-aligned data; future domains (Chaos, Moon, Sun, Blood, Fate) stubbed as empty arrays.
- Class System Foundation: 9 classes with subclass variants and progression rules; multiclassing scaffolding in place; Ranger companion supported.

### Current Sprint

Schema completion and validation

- Finalize and verify PlayerCharacter schema coverage (file exists and compiles)
- Cross-validation between classes, domains, and equipment
- Tighten validation messages and edge cases

## Next Immediate Steps

1. Character schema finishing touches

- Confirm all fields and defaults in `player-character.ts`
- Ensure equipment/inventory models cover UI needs

2. Schema integration testing

- Validate class↔domain access rules and multiclassing
- Verify level-up point calculations

3. UI component planning

- Sketch character creation flow and character sheet layout

## Active Decisions & Considerations

Schema design patterns

- Discriminated unions for class/subclass selection
- Const assertions (`as const`) for data immutability
- Schema composition and reusable helpers (`MetadataSchema`, `ScoreSchema`, `unionWithString`)

Data architecture choices

- Domain data organized per-domain in `src/lib/data/domains`
- Standardized exports; minimal barrels to avoid duplication

Performance considerations

- Reuse compiled schemas; consider route-level code-splitting later

## Technical Debt & Known Issues

- Some domain cards may need formatting polish
- No persistence layer yet
- UI not started; mobile responsiveness untested

## Decision Log

Recent decisions

1. Zod for validation with full TypeScript integration
2. File-per-domain data organization
3. Immutable game data via const assertions
4. Discriminated unions over inheritance

Pending decisions

- Persistence strategy (localStorage vs IndexedDB)
- UI state management (Context vs external)
- Offline capabilities scope

## Notes (Current Session)

- Audited memory bank for accuracy and aligned paths (domain data under `src/lib/data/domains`).
- Ran type-check: PASS. Build path compiles.
- Verified `PlayerCharacterSchema` exists and compiles; integration validation still to do.

## Context for Next Session

- Start integration tests for class↔domain rules and level-up math
- Begin UI scaffolding for character creation
- Map persistence requirements (MVP: localStorage)
