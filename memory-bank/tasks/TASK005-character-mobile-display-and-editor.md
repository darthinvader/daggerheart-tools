# [TASK005] - Mobile character display and editor (research-first)

**Status:** In Progress (Milestone 1 shipped)
**Added:** August 9, 2025
**Updated:** August 11, 2025 (later)

## Original Request

Design the character display with default values so it renders immediately, and include actual ways to edit it on mobile. We need every schema data point researched for how to present it on mobile and how to edit it on mobile. Create small, concrete steps (no oversized tasks like "make the character page"). Prioritize research and a mobile-first UX.

## Design Decision Guidelines (researched)

- Target sizes: Minimum 44×44 CSS px (WCAG 2.5.5 AAA); Apple HIG 44pt; Material 48dp. Favor larger for frequent/critical actions; provide ≥8px spacing between adjacent targets.
- Thumb reach: Place primary actions within bottom/easy reach zones; avoid essential actions in top corners; prefer bottom sheets/drawers for edits.
- Dialogs/sheets: Use accessible primitives (Radix/Dialog or shadcn wrappers) with focus trap, aria-label/aria-describedby, escape/overlay click behavior, and focus return.
- Lists and density: Prefer list items with clear affordances and adequate padding (min 44px row height), progressive disclosure for complex groups.
- Validation UX: Inline errors near fields, concise messages, prevent commit on invalid; show remaining budgets (traits/cards) and constraints proactively.
- Feedback: Use toasts for non-blocking confirmations; avoid disruptive modals for success states.
- Performance: Defer heavy card lists (virtualize if needed), lazy-load domain/equipment data per section.

## Thought Process

- The PlayerCharacter schema is our source of truth; we must enumerate every field and decide: 1) how it’s shown on a small screen, and 2) how it’s edited on a small screen.
- Start with a skeleton that renders a realistic default character snapshot so we can iterate visually, then progressively wire real editing controls validated by Zod.
- Keep interactions thumb-friendly and chunked into bite-sized panels with clear affordances (drawer, bottom sheets, stepper forms).
- Use shadcn/ui + Tailwind for consistent, accessible controls; prefer native mobile patterns (touch targets ≥44px CSS as a minimum; 48dp/44pt guidance).
- Validation should happen inline via react-hook-form + zodResolver, but first we’ll research control types and micro-interactions per field.

## Implementation Plan (small steps with sub-subtasks)

Research (schema → UI mapping)

1. Inventory PlayerCharacter schema fields (top-level and nested).
   - 1.1 Extract top-level keys from PlayerCharacterSchema.
   - 1.2 List nested identity fields: name, pronouns, ancestry, community, description, calling, abilities[] (name/desc).
   - 1.3 List classDetails fields: name, subclass, features[], domains[] (name, cards[]).
   - 1.4 List core stats: traits{trait→{value,marked}}, hp{current,max,thresholds}, stress, armorScore, evasion, hope, proficiency, rallyDie.
   - 1.5 List domain collections: domainCards, vault, loadout (arrays of cards).
   - 1.6 List equipment/inventory: equipment, inventory, armorStatus, weapons[], armor[], gold{handfuls,bags,chests}, conditions[].
   - 1.7 List progression/experience: experience, experiences[], connections[], progression?, companion?.
   - 1.8 Capture required vs optional and defaults per field.

2. Classify each field (edit frequency).
   - 2.1 Tag fields: display-only vs frequent vs occasional edits.
   - 2.2 Note context sensitivity (creation-only constraints vs ongoing sheet).
   - 2.3 Flag fields needing quick-access in-session (HP, Stress, Conditions, Loadout).

3. Choose control types per field.
   - 3.1 Map text inputs: name, pronouns, description, calling, notes.
   - 3.2 Map pickers/comboboxes: ancestry, community, class, subclass, conditions.
   - 3.3 Map numeric steppers/segmented: level, traits, hp/stress/armorScore/evasion/hope/proficiency/gold.
   - 3.4 Map multi-select/tag chips: domain cards, conditions.
   - 3.5 Map special: rallyDie (segment for d6/d8/etc.), experiences (repeater rows), features (read-only list), companion (conditional form).

4. Define mobile presentation per field/group.
   - 4.1 Decide section cards: Identity, Class, Traits, Resources, Domains, Equipment, Notes.
   - 4.2 Choose per-section list vs accordion vs card grid.
   - 4.3 Pick drawer vs modal for edits; default to bottom sheet/drawer on mobile.
   - 4.4 Specify sticky summary (name, class, level, hp/stress) at top.

5. Define validation and hints per field.
   - 5.1 Write min/max/caps (e.g., level 1–10, trait budgets, hp >= 0).
   - 5.2 Author helper text per control; specify error copy.
   - 5.3 Note creation-specific rules (starting domain card counts, class domain access).

6. Grouping & navigation
   - 6.1 Finalize section order (most frequently edited first for mobile).
   - 6.2 Add quick-jump menu with anchors.
   - 6.3 Define per-section Edit entry and breadcrumb.

7. Default values for an immediately-rendered character.
   - 7.1 Select valid ancestry/community combo from SRD list.
   - 7.2 Pick a default class/subclass with 2 domains.
   - 7.3 Set trait defaults within budget.
   - 7.4 Choose starting equipment (pack mode) and a minimal domain loadout.
   - 7.5 Define baseline resources (hp/stress/armor/hope/evasion/proficiency/gold) from schema defaults.

UX skeleton (single-route, non-functional or minimal)

8. Create a mobile-first sheet layout with section cards and a sticky summary header.
   - 8.1 Add container and spacing scales suitable for mobile.
   - 8.2 Implement sticky header with name/class/level/hp/stress.
   - 8.3 Render each section as a card with compact content.

9. Add a bottom action bar for Edit/Save and quick actions.

- 9.1 Implement BottomActionBar respecting safe areas and keyboard.
- 9.2 Connect actions to open section edit drawers; include Edit/View toggle.

10. Render default character snapshot using constants.

- 10.1 Create constants for the default character.
- 10.2 Map constants to UI; guard against undefined optional fields.

11. Add per-section Edit buttons opening placeholder drawers.

- 11.1 Wire stubs for Identity, Traits, Resources.
- 11.2 Ensure focus trap and escape to close.
- 11.3 Preserve scroll/focus on return; restore anchor.

Editing controls (wire minimal data + validation)

12. Integrate react-hook-form + zodResolver for a minimal subset.

- 12.1 Scaffold RHF form context at the sheet level.
- 12.2 Add zodResolver with a subset schema (Identity.name, one trait).
- 12.3 Show FormMessage for errors; disable Save until valid.

13. Traits steppers with budget hints.

- 13.1 Add +/- stepper; enforce min/max per trait; long-press accelerates.
- 13.2 Display remaining points; block exceeding budget.

14. Combobox for ancestry/community.

- 14.1 Load options from enums/data.
- 14.2 Add search and clear; commit on select.

15. Save/Cancel flows for the subset.

- 15.1 Wire optimistic Save (toast on success).
- 15.2 Revert on Cancel.

Expand coverage

16. Class/Subclass picker with domain access preview.

- 16.1 Filter subclasses by class.
- 16.2 Show domain badges for selection context.

17. Domain card selector (creation rules enforced).

- 17.1 Filter by accessible domains.
- 17.2 Enforce starting count; show remaining counter.

18. Equipment selector (pack vs free-form).

- 18.1 Prebuilt packs list; one-tap apply.
- 18.2 Free-form search + add; compute load.

19. Resources panel with safe steppers.

- 19.1 HP/current/max constraints with thresholds display.
- 19.2 Stress/Armor/Gold steppers with min 0.

20. Notes/Inventory text areas with autosize.

- 20.1 Basic text area; limit length; persist on save.

Play mode simplification

21. Simple View toggle for play sessions.

- 21.1 Condensed layout: sticky summary + HP/Stress/Conditions/Loadout quick actions only.
- 21.2 Toggle returns to full view with sections; persist preference locally.

Note (Aug 11, 2025): Deferred. We removed the Play Mode feature from the character sheet for simplicity. All sections remain visible; a future lightweight “condensed view” could be explored separately if needed. Also removed the BottomActionBar and extracted the section links bar (QuickJump) into `src/components/layout/quick-jump.tsx` with tighter mobile sizing.

Mobile polish

22. Touch targets & spacing.

- 22.1 Ensure 44x44 CSS min target areas (prefer 48dp/44pt where feasible).
- 22.2 Add spacing between targets (8px+); avoid crowded clusters.
- 22.3 Keep frequent actions in easy thumb zones (bottom area).

23. Sticky headers and quick-jump.

- 23.1 Test scroll positions on mobile; ensure visibility.
- 23.2 Keep critical actions persistent near bottom.

24. A11y for modals/drawers.

- 24.1 Labels, descriptions, focus return; escape to close.
- 24.2 Trap focus and prevent background scroll.

25. Keyboard & safe areas.

- 25.1 Use dvh for full-height overlays; bottom bar pads with env(safe-area-inset-bottom).
- 25.2 Gate safe-area padding when inputs are focus-visible to avoid keyboard gaps.

Persistence (MVP)

26. Local storage persistence and hydration.

- 26.1 Serialize form state to localStorage.
- 26.2 Hydrate on load; validate and fallback to defaults.

27. Reset/Export/Import.

- 27.1 Reset to default snapshot.
- 27.2 Export JSON; Import JSON with validation.

QA, UX metrics & docs

28. Tests for mapping and validation.

- 28.1 Unit: field map extraction aligns with schema.
- 28.2 Unit: zod validation errors map to UI.

29. UX metrics capture.

- 29.1 Instrument time-to-change HP/condition/add card.
- 29.2 Track invalid attempts and backtracks (anonymized).

30. Memory bank docs update.

- 30.1 Commit field map and control decisions.

31. README route docs.

- 31.1 Add how-to-run and known limitations.

## Field Inventory (PlayerCharacter)

Top-level structure and nested fields derived from `src/lib/schemas/player-character.ts`.

- identity (required)
  - name: string (required)
  - pronouns: string (required)
  - ancestry: AncestryName (enum) (required)
  - community: CommunityName (enum) (required)
  - description: string (required)
  - calling: string (required)
  - abilities: Ability[] (required) — Ability = { name: string; description: string }

- level: number int 1..10 (required)

- traits: Record<CharacterTrait, { value: int; marked: boolean = false }> (required)

- hp: { current: int; max: int; thresholds: DamageThresholds } (required)

- stress: { current: int; max: int } (required, default = { current: 0, max: 6 })

- armorScore: { current: int; max: int } (required)

- evasion: number int min 0 (required, default = 10)

- hope: number int min 0 (required, default = 2)

- proficiency: number int min 1 (required, default = 1)

- rallyDie: RallyDieEnum | string (optional, default = 'd6')

- classDetails (required)
  - name: ClassName (enum) (required)
  - subclass: SubclassName (enum) (required)
  - features: BaseFeature[] (required)
  - domains: PlayerDomain[] (required) — PlayerDomain = { name: DomainName; cards: DomainCard[] }

- multiclass: ClassName[] (optional)

- domainCards: DomainCard[] (required)

- vault: DomainCard[] (required)

- loadout: DomainCard[] (required)

- equipment: EquipmentLoadout (required)

- inventory: InventoryItem[] (required)

- armorStatus: ArmorStatus (optional)

- weapons: Weapon[] (required)

- armor: Armor[] (required)

- gold: { handfuls: int>=0; bags: int>=0; chests: int>=0 } (required, default = { handfuls: 1, bags: 0, chests: 0 })

- conditions: ConditionName[] (required, default = [])

- experience: number int>=0 (required, default = 0)

- experiences: Experience[] (required, default = []) — Experience = { name: string; trait?: CharacterTrait; bonus: 1|2 (default 2); notes?: string }

- connections: string[] (optional)

- progression: { rules: LevelUpPointSystem; state: CharacterProgression } (optional)

- companion: RangerCompanion (optional)

Notes

- ScoreSchema shapes (hp/stress/armorScore) are treated as { current, max } pairs; only hp adds thresholds.
- Required vs Optional reflects schema defaults: fields without defaults are required; defaults listed inline.

## Field Classification (edit frequency) — 1.2

Frequent (in-session)

- hp.current, stress.current, conditions[]
- gold.handfuls/bags/chests, loadout[] (tactical choices), notes/experiences additions
- simple toggles: trait.marked, armorStatus (where applicable)

Occasional (between sessions / setup)

- traits.values, level, hope, proficiency, evasion, armorScore.current/max
- weapons[], armor[], inventory[], equipment pack changes
- domain loadout/vault adjustments, experience total

Rare (initial setup)

- identity (name, pronouns, ancestry, community, description, calling, abilities[])
- classDetails (name, subclass, domains), multiclass, rallyDie, progression, companion, connections

Notes: Frequent items should be one-tap reachable with large steppers/switches; occasional via section drawers; rare via deeper drawers with staged Save.

## Control Type Map — 1.3

- hp: plus/minus Stepper for current and max; thresholds read-only chips
- stress: Stepper (current)
- evasion/hope/proficiency/armorScore: Stepper with min bounds
- traits: Stepper per trait value; Switch/Checkbox for marked
- conditions: Multi-select combobox or chip list with removal x
- level: Stepper (bounded 1..10)
- rallyDie: Segmented control (d6/d8/d10...), show active
- gold: Three steppers (handfuls/bags/chests)
- weapons/armor/inventory: Searchable combobox + list with quantity steppers; remove via trash
- equipment: Radio (pack mode) or search-add (free mode)
- domainCards/vault/loadout: Filterable list with chips; tap to add/remove; enforce limits
- classDetails.name/subclass: Searchable combobox; subclass filtered by class
- identity text fields: Input/Textarea with helper text
- experiences: Repeater rows (Input + optional selects), add/edit in drawer
- connections: Token input (chips)
- companion: Conditional sub-form (drawer)
- progression: Display; specialized editor later

## Mobile Presentation Patterns — 1.4

Sections (order by frequency)

1. Summary (sticky): name, class, level; HP/Stress quick steppers; conditions chips; quick actions
2. Resources: HP/Stress/Evasion/Armor/Hope/Proficiency/Gold
3. Loadout & Domains: Active loadout with add/remove; link to Vault
4. Equipment & Inventory: Weapons/Armor/Items with steppers
5. Traits: Values and marked toggles
6. Class & Subclass: Read-only summary with Edit button
7. Identity: Read-only with Edit button
8. Experiences & Notes: Add/edit entries

Edit entry pattern

- Each section card has an Edit button opening a bottom Drawer (Sheet) scoped to that section
- Frequent micro-edits (HP/Stress/Conditions) are inline with immediate commit
- Save/Cancel in drawer footer; Save disabled until valid

Navigation

- Quick-jump menu to anchors; bottom action bar for context actions (Edit/View or Save/Cancel)
- Preserve scroll/focus when closing drawers

Quick-jump behavior

- Provide a horizontal quick-jump chip row that scrolls to section anchors; ensure ≥44x44 CSS px targets
- Highlight active section while scrolling using IntersectionObserver
- Keep sticky summary compact; avoid overlap with quick-jump; respect safe-area insets

## Validation & Hints Copy — 1.5

Identity

- name: required; helper: “Your character’s name.”
- pronouns: required; helper: “Pronouns used for your character.”
- ancestry/community: required enums; error: “Choose a valid ancestry/community.”
- description/calling: required text; helper: short guidance; cap length ~500 chars
- abilities[]: name/description required per row; confirm before delete

Class & Subclass

- class/subclass: required; subclass filtered by selected class; error: “Pick a subclass from this class.”
- domains[]: display-only from class; helper: “Domains determine available cards.”

Traits & Level

- level: 1–10; helper: “Levels range from 1 to 10.”
- traits.values: enforce budget (creation); show remaining points; block exceeding
- marked: boolean; helper: “Mark a trait to indicate temporary emphasis.”

Resources

- hp.current/max: ints ≥ 0; current ≤ max; thresholds read-only
- stress.current/max: ints ≥ 0; helper: “Stress ranges 0–6 by default.”
- armorScore.current/max: ints ≥ 0; evasion ≥ 0; hope ≥ 0; proficiency ≥ 1
- rallyDie: one of d6/d8/d10…; helper: “Default d6.”

Domains & Cards

- loadout: enforce SRD max active count; show remaining counter; disable add when limit reached
- vault: no hard limit; removing from loadout returns to vault
- domainCards: reference catalog; filtered by accessible domains

Equipment & Inventory

- equipment: Pack or Free-form; switching modes prompts confirm
- weapons/armor/inventory: quantities ints ≥ 0; confirm destructive remove

Economy & Conditions

- gold.handfuls/bags/chests: ints ≥ 0; helper: “Tap + or – to adjust.”
- conditions[]: choose from enum list; helper: “Tap a chip to remove.”

Experience & Progression

- experience: int ≥ 0; helper: “Total XP.”
- experiences[]: name required; bonus 1–2 (default 2); optional trait & notes; confirm delete
- progression: optional; validated if present
- connections: optional string chips; helper: “People or groups important to your character.”

Companion

- companion: optional; only visible for eligible subclass; validate via RangerCompanionSchema

## Progress Tracking

**Overall Status:** In Progress - 55% Complete

### Subtasks

| ID  | Description                                  | Status      | Updated      | Notes                                                                                                                         |
| --- | -------------------------------------------- | ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | Extract PlayerCharacter field inventory      | Complete    | Aug 9, 2025  | Field inventory documented                                                                                                    |
| 1.2 | Field classification (edit frequency)        | Complete    | Aug 9, 2025  | Frequent/Occasional/Rare lists added                                                                                          |
| 1.3 | Control type decisions per field             | Complete    | Aug 9, 2025  | Control map defined                                                                                                           |
| 1.4 | Presentation pattern per field               | Complete    | Aug 9, 2025  | Section order, edit entry, quick-jump defined                                                                                 |
| 1.5 | Validation/hints copy per field              | Complete    | Aug 9, 2025  | Helper/error guidance added                                                                                                   |
| 1.6 | Section grouping and navigation              | Not Started | -            | -                                                                                                                             |
| 1.7 | Default valid character snapshot             | Not Started | -            | -                                                                                                                             |
| 2.1 | Mobile skeleton layout                       | Complete    | Aug 9, 2025  | `/characters/new` scaffolded → now lives at per-id route                                                                      |
| 2.2 | BottomActionBar (Edit/Save)                  | Not Started | -            | -                                                                                                                             |
| 2.3 | Section edit entry points                    | In Progress | Aug 10, 2025 | Identity & Class drawers wired; Domains drawer added (autosave-on-close + Reset)                                              |
| 3.1 | Hook form + zod for Identity/Traits subset   | Complete    | Aug 9, 2025  | Identity form with zodResolver                                                                                                |
| 3.2 | Inline validation + messages                 | Complete    | Aug 9, 2025  | Name/pronouns required; enum validation                                                                                       |
| 3.3 | Save/Cancel flows (local state)              | Complete    | Aug 9, 2025  | Save persists; Cancel closes without commit                                                                                   |
| 4.1 | Class/Subclass picker                        | Complete    | Aug 10, 2025 | Drawer implemented, lazy-loaded                                                                                               |
| 4.2 | Domain card selector                         | In Progress | Aug 10, 2025 | Drawer with search/filters; add/remove UX wired; autosave-on-close + Reset added; Vault layout narrowed with vertical actions |
| 4.3 | Equipment selector (pack/free)               | Not Started | -            | -                                                                                                                             |
| 4.4 | Resources panel (HP/Stress/Armor/Gold)       | In Progress | Aug 10, 2025 | Hope now Score with current/max; handlers wired                                                                               |
| 4.5 | Notes/Inventory text                         | Not Started | -            | -                                                                                                                             |
| 4.6 | Simple View play mode                        | Not Started | -            | -                                                                                                                             |
| 5.1 | Mobile polish (touch targets, headers, a11y) | Not Started | -            | -                                                                                                                             |
| 5.2 | Keyboard & safe areas                        | Not Started | -            | -                                                                                                                             |
| 6.1 | LocalStorage persistence + hydrate           | Complete    | Aug 9, 2025  | Per-id storage key: `dh:characters:{id}:identity:v1`                                                                          |
| 6.2 | Reset/Export/Import actions                  | Not Started | -            | -                                                                                                                             |
| 7.1 | Tests for mapping and validation             | Not Started | -            | -                                                                                                                             |
| 7.2 | UX metrics instrumentation                   | Not Started | -            | -                                                                                                                             |
| 7.3 | Memory bank docs update                      | In Progress | Aug 10, 2025 | Active context and progress updated                                                                                           |
| 7.4 | README route docs                            | Not Started | -            | -                                                                                                                             |

## Progress Log

### August 9, 2025

- Completed subtask 1.1: Enumerated all PlayerCharacter fields with required/optional states and defaults.
- Added "Field Inventory" section to this task for reference during mapping (1.2–1.5).
- Next: Classify fields by edit frequency and mark quick-access groups (HP, Stress, Conditions, Loadout).

### August 9, 2025 (later)

- Completed 1.2 with frequency categories; completed 1.3 with control type map.
- Began 1.4 defining mobile section order, edit entry (drawer), and navigation patterns.
- Next: Finish 1.4 by adding quick-jump menu behavior and finalize any remaining section details; then proceed to 1.5 validation copy.

### August 9, 2025 (later 2)

- Finished 1.4: added quick-jump behavior and finalized section patterns.
- Completed 1.5: wrote validation constraints and helper/error copy per field group.
- Next: Start 1.6 (section grouping confirmation and navigation details) and 1.7 (default valid snapshot), then begin UI skeleton (8.x).

### August 9, 2025

- Task revised with sub-subtasks grounded in PlayerCharacter schema and mobile UI guidelines (44px/48dp targets, drawers, steppers, combobox).
- Added Design Decision Guidelines referencing WCAG/Apple/Material/Thumb-zone and dialog a11y patterns.
- Enhanced mobile polish sub-subtasks with explicit min sizes, spacing, and thumb placement.
- Next: Execute 1.1–1.8 to produce a concrete field map artifact for review.

### August 9, 2025 (later)

- Added Appendix B — Mobile Optimization Playbook with concrete guidance: Core Web Vitals targets, image strategy, JS/CSS hygiene, inputmode/enterkeyhint usage, virtualization with TanStack Virtual, dvh + safe-area handling (and keyboard caveat), optional haptics with feature detection, and an a11y/testing checklist. This makes the design realistic and implementable on mobile.

### August 9, 2025 (even later)

- Added Appendix C — Mobile Usability & Interaction Playbook focused on optimizing for use: core UX laws (Fitts/Hick), editing model (inline vs drawer with commit strategies), control/affordance standards, list interactions, layout/navigation rules, feedback/state patterns, inclusivity/a11y, ergonomics, microcopy, UX testing metrics, anti-patterns, and immediate reusable components to create (Stepper, BottomActionBar, FormField). This centers the effort on ease, clarity, and speed of change on mobile.

### August 9, 2025 (final today)

- Earlier decision: Single-route creation at `/characters/new` to avoid mid-step entry and enforce completion focus.
- Implemented scaffold and updated navigation; removed previous step route `characters/new/identity`.

### August 9, 2025 (later 3)

- Migrated to per-character routes: added `/characters/$id` as the canonical character screen.
- Updated `/characters/new` to generate a UUID and redirect to `/characters/{uuid}`.
- Implemented Identity drawer with react-hook-form + zodResolver; ancestry/community via Combobox; Save disabled until valid.
- Persistence: per-id localStorage key `dh:characters:{id}:identity:v1`; hydrate on mount with schema validation and safe defaults.
- Routing clean-up: `/characters` shows list (index route); mobile FAB and list “New” both target `/characters/new` (redirects to per-id route).
- Typecheck: PASS. Build: PASS. Route tree includes `/characters/$id` and `/characters/new` (redirect).

- Added Appendix D — TTRPG domain UX takeaways (from D&D Beyond, Pathbuilder 2e, Roll20 PF2) with concrete do/don’t items, simple view toggle, quick-edit clusters, and quality bar (tap-count targets). Revised Implementation Plan to include BottomActionBar, Simple View, keyboard/safe-area handling, and UX metrics instrumentation; updated subtasks accordingly.

### August 9, 2025 (later 4)

### August 10, 2025

- Implemented Domains drawer (mobile-first, lazy where applicable) with:
  - Non-submit Add/Remove buttons to prevent drawer auto-close
  - Search and filters: by domain, by level, and by type (All/Spell/Ability)
  - List rows show domain • level • type badge, costs (hope/recall), and tags
  - Inline expansion: tapping a row shows the description directly under it (also applied in Loadout and Vault lists)
  - `DomainsCard` summary now optionally shows by-type counts (Spell/Ability)
- Resources: Converted Hope from number to Score { current, max } with UI controls to change both values; added migration for older saves.
- Traits: Removed the “Remaining” budget UI.
- Quality gates: Typecheck PASS; Build PASS; Tests PASS (6/6); Lint has warnings only (no errors).

- Implemented Traits inline steppers in `/characters/$id` with per-id persistence.
- Budget logic: Assumed starting pool of 6 points at level 1; Remaining counter shown; + disabled at 0 remaining; max per trait capped at 10.
- Storage keys:
  - Identity: `dh:characters:{id}:identity:v1`
  - Resources: `dh:characters:{id}:resources:v1` (HP/Stress/Evasion/Hope/Proficiency)
  - Traits: `dh:characters:{id}:traits:v1`
- Resources quick controls expanded for Evasion, Hope, Proficiency. HP/Stress include current/max with clamping.
- Mobile polish: steppers sized for thumb use; keyboard overlay mitigated by hiding bottom nav when inputs focus.

### August 10, 2025 (later)

- Domains drawer UX polish:
  - Added autosave-on-close: closing the drawer submits changes if valid and within limits. Save/Cancel explicitly skip autosave to avoid double-submit.
  - Added per-open Reset button: restores the form values to the snapshot taken when the drawer opened this time.
  - Vault list layout: narrowed card width and stacked action buttons vertically for better mobile ergonomics. Further visual polish deferred.

## Appendix A — Interaction patterns & Components

This maps schema fields to concrete mobile interactions (add/edit/remove) and the shadcn/ui components we’ll use.

- Identity
  - name, pronouns, description, calling: Edit via Drawer Form → Input/Textarea; Components: Sheet/Drawer, Form, Input, Textarea, Button.
  - ancestry, community: Edit via Drawer → Combobox (searchable, single-select); Components: Command/Combobox, FormField, Button.
  - abilities[] (name/desc rows):
    - Add: “Add ability” button in section → opens inline row editor or Drawer.
    - Edit: Tap row → inline expand or Drawer.
    - Remove: Trash icon button per row (confirm AlertDialog for destructive).
    - Components: Accordion (optional), Form, Input, Textarea, Button, AlertDialog.

- Class & Subclass
  - classDetails.name (class): Edit via Drawer → Combobox; locks available subclasses/domains.
  - classDetails.subclass: Edit via Drawer → Combobox filtered by class.
  - features[]: Display-only list with descriptions; no edit.
  - domains[] (per class; PlayerDomainSchema): Display names; edit via Domain access decisions (see Domains section).
  - Components: Sheet/Drawer, Command/Combobox, Badge, Tooltip, Alert.

- Core Stats
  - level: Stepper (Segmented +/–) with min 1 max 10.
  - traits{trait→{value, marked}}:
    - value: Stepper; enforce budget.
    - marked: Switch/Checkbox inline.
  - hp{current,max,thresholds}: Two steppers for current/max; thresholds read-only list.
  - stress: Stepper with min 0, default 0..6.
  - armorScore, evasion, hope, proficiency: Stepper with safe bounds.
  - rallyDie: SegmentedControl (d6/d8 etc.).
  - Components: Number steppers (Button+Input), Switch, Segmented (Tabs or custom), Form, Badge.

- Domains (collections)
  - domainCards: Full catalog (read-only reference list or “Add to Vault/Loadout”).
  - vault[]: User-owned cards; Add from domainCards; Remove back to catalog.
  - loadout[]: Active cards; Add from vault (or directly during creation) with count limit; Remove to vault.
  - Add/Edit/Remove patterns:
    - Add: Card grid with filters (Domain, Level); tap tile to add (disabled when limit reached).
    - Remove: Tap chip “x” or long-press → context menu → Remove.
    - Reorder (optional later): Drag to reorder loadout.
  - Components: Tabs (domain filters), Badge/Chip (selected), Card, Command for search, DropdownMenu/ContextMenu, Toast.

- Equipment & Inventory
  - equipment (EquipmentLoadoutSchema):
    - Pack mode: Radio list of packs; Apply button.
    - Free-form: Search + add items; quantities via stepper.
  - inventory[]: List of items with quantity steppers; Remove via trash.
  - weapons[] / armor[]: Specialized lists with tags (damage/armor type); Add via search, Remove via icon.
  - armorStatus?: Toggle states where applicable.
  - gold{handfuls,bags,chests}: Three steppers.
  - Components: Command/Combobox, DataTable/List, InputNumber+Buttons, DropdownMenu, AlertDialog, Badge.

- Conditions[] (array of ConditionName)
  - Add: Combobox multi-select or list with checkboxes.
  - Remove: Uncheck or chip “x”.
  - Components: Command multi-select, Checkbox/Chip, Badge.

- Experience & Progression
  - experience (xp total): Stepper.
  - experiences[] (name, trait?, bonus, notes?):
    - Add row: “Add experience” → Drawer with fields.
    - Edit row: Tap → Drawer.
    - Remove row: Trash with confirm.
  - progression? (rules, state): Display; editable later via dedicated flow (deferred).
  - connections[]: Tokenized input (chips) with add/remove.
  - companion?: Conditional sub-form for Ranger.
  - Components: Form, Input, Textarea, NumberInput, Select/Combobox, Chip/Tags, AlertDialog.

- Global actions
  - Edit section: Per-card Edit button opens Drawer pre-scoped to that section.
  - Save/Cancel: Drawer footer buttons; Disable Save if invalid; on Save, optimistic toast.
  - Reset/Import/Export: In overflow menu (DropdownMenu) in header or footer.

Notes

- All destructive actions use AlertDialog confirmation on mobile.
- Ensure 44×44 CSS px targets; keep frequent actions near bottom reach zone.
- Prefer Drawer/Sheet for edits; keep display in cards/lists for scannability.

## Appendix B — Mobile Optimization Playbook (research‑backed)

Performance budgets & Core Web Vitals

- Targets (mobile): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, TBT as low as possible during hydration. Profile with Lighthouse + Web Vitals.
- Budget guardrails: Initial JS ≤ ~150–200KB compressed, CSS ≤ ~50KB; defer non-critical code until a section is opened (drawers).

Images & media

- Prefer vector/SVG for UI; for illustrations, use WebP/AVIF with JPEG fallback. Include explicit width/height to prevent CLS.
- Use loading="lazy" and decoding="async" for below-the-fold images; avoid layout thrash.

JavaScript & CSS hygiene

- Code-split per route/section (TanStack Router + Vite dynamic import). Load edit drawers on demand.
- Tree-shake shadcn components (import individual files); avoid unused Radix primitives.
- Keep animations simple (CSS transform/opacity) and short; avoid JS-heavy animations on scroll.
- Minimize third-party deps; prefer standard APIs (Intl, URLPattern) and headless libs you already use.

Mobile inputs & keyboards

- Use inputmode and enterkeyhint to surface the right keyboard and action:
  - Numeric counts (HP, Stress, Gold): inputmode="numeric"; decimals: inputmode="decimal".
  - Search fields: type="search" enterkeyhint="search".
  - Avoid abusing type="number" when leading zeros/format matter; prefer type="text" + inputmode for strict keypad.

Lists at scale (virtualization)

- For long card/equipment lists, use TanStack Virtual (useVirtualizer) with small overscan (2–4) and measureElement for variable heights.
- Maintain a11y: keep item semantics, tab order within the virtual window, and preserve scroll position between drawers.

Viewport height and safe areas

- Use dvh units for full-height sheets and panels (height: 100dvh) with 100vh fallback for older browsers.
- Apply safe-area insets for sticky/bottom bars: padding-bottom: env(safe-area-inset-bottom, 0).
- Known issue: some browsers don’t update safe-area-inset when the keyboard opens; gate inset while an input is :focus-visible as a workaround.

Haptics (subtle and optional)

- Use navigator.vibrate sparingly for meaningful feedback (e.g., error, add-to-loadout success). Always feature-detect ('vibrate' in navigator) and provide a settings toggle to disable.

Accessibility & testing

- Touch targets ≥ 44×44 CSS px (Apple/Material guidance) with ≥8px spacing.
- Focus management: trap/restore focus in drawers; aria-labelledby/aria-describedby; no background scroll.
- Color/contrast per WCAG; large text scales without overflow; landscape sanity check.
- Cross-device QA: iOS Safari, Chrome Android; test with VoiceOver/TalkBack and hardware keyboard.

Immediate low-risk actions for this repo

- Add inputMode/enterKeyHint props to numeric/search fields as we wire RHF controls.
- Use 100dvh for sheets/drawers; add a utility class to apply safe-area padding to bottom bars.
- Lazy-load heavy lists and edit drawers; measure list performance and switch to virtualization when item count > ~100.
- Ensure images (if any) specify width/height and use lazy + async decoding.

References (high-level)

- Apple HIG (touch target minimums); Material Design (48dp) and WCAG 2.5.5 44×44.
- MDN: inputmode, enterkeyhint, Navigator.vibrate.
- TanStack Virtual documentation.
- CSS dvh/svh/lvh notes and safe-area keyboard update caveat (2024–2025 articles/MDN).

## Appendix C — Mobile Usability & Interaction Playbook (optimize for use)

Core principles (why)

- Fitts’ Law: Large, nearby targets reduce effort/time. Make primary actions big and within thumb reach.
- Hick’s Law: Fewer, clearer choices speed decisions. Use progressive disclosure in drawers/accordions.
- Recognition over recall: Visible labels, helper text, and examples reduce memory load.
- Consistency and standards: Reuse control patterns (stepper, combobox, chips) across all sections.
- Error prevention first: Constrain inputs (min/max, filters) and preview outcomes before commit.
- Immediate, clear feedback: State changes should feel obvious (visual + optional subtle haptic + toast).

Editing model (how)

- Default to section-scoped drawers for edits; inline micro-edits allowed for ultra-frequent tweaks (HP/Stress/Conditions) with steppers/switches.
- Commit strategies:
  - Inline micro-edits: commit immediately with undo toast where destructive.
  - Drawer edits: staged commit with Save/Cancel; Save disabled until valid; keep Save within thumb zone.
- Optimistic updates with Undo where possible; on error, revert and show inline error + toast.

Controls & affordances (what)

- Stepper: Big +/– buttons (≥44×44) with a readable number; long-press accelerates; double-tap +1 is acceptable but not required.
- Switch vs Checkbox: Switch for immediate state (Conditions on/off), checkbox for multi-select lists inside drawers.
- Segmented control: For small, exclusive sets (rally die sizes, pack modes). Show active state clearly.
- Combobox: Always searchable; include clear button; show selected as chip; avoid empty states—provide "+ Add new" only where schema allows.
- Chips/Tags: Large touchable area with clear labels; “x” affordance for removal.
- Buttons: Prefer labeled buttons over icon-only for primary actions; amplify hit area via padding.

Lists & item interactions

- Avoid swipe-only destructive actions; provide explicit affordances (menu or trash icon). Optionally support long-press as a shortcut.
- Keep row height ≥44px with obvious tap targets (chevron or primary action button).
- Preserve scroll position when returning from drawers; return focus to the invoking control.

Layout & navigation

- Sticky summary (name, class, level, HP/Stress) at top; section cards below ordered by frequency of use.
- Bottom action bar for context actions (Edit/View toggles or Save/Cancel when editing).
- Quick-jump menu to anchors; avoid nesting multiple modals/drawers at once (max one active overlay).

Feedback & state

- Use skeletons/placeholders for first paint; show inline validation next to fields.
- Use toasts for non-blocking confirms; error toasts include a short action (Undo/Retry) when safe.
- Optional haptics: short pulse on success (≤100ms), pattern on errors; always user-toggleable.

Inclusivity & accessibility

- Labels and descriptions for every control; don’t rely on placeholder as label.
- Focus visible, logical tab order, ESC/back behavior consistent; ensure screen reader names/roles/states.
- Respect device settings: reduced motion, large text (wrap instead of truncation), dark/light mode.
- Color contrast meets WCAG AA minimums; avoid color-only distinctions.

Ergonomics

- One-handed zones: prioritize bottom-center controls; avoid critical actions in top corners.
- Hit slop: Increase interactive padding beyond the visual icon; ensure ≥8px spacing between targets.
- Keyboard-aware: Keep save button above keyboard (bottom bar rises); scroll field into view on focus.

Content strategy (microcopy)

- Short, action-led labels ("Add card", "Save changes"); helper text explains constraints (“Max 6 cards in loadout”).
- Use real examples (e.g., “Ancestry: Human”) as supporting text, not placeholders; include units ("HP", "bags").
- Avoid jargon where possible; keep capitalization sentence case.

Testing & UX metrics

- Define task-based success criteria: time-to-change HP, add domain card, toggle condition, change subclass.
- Track interaction errors (invalid attempts), rage taps, and backtracks; inspect logs to refine flows.
- Run small-device checks (iPhone SE width) and large text scaling; test VO/TalkBack flows end-to-end.

Anti-patterns to avoid

- Hidden swipe-only controls, stacked modals/drawers, tiny icon-only primaries, destructive actions without confirm.
- Overloaded forms without segmentation; reliance on hover; scroll-jacking.

Immediate UX actions for this repo

- Create reusable Stepper component with 44×44 buttons and long-press repeat; standardize across stats and counts.
- Add BottomActionBar component that respects safe areas and keyboard; houses Save/Cancel or context actions.
- Provide a FormField wrapper (label, description, error) to keep consistent spacing and a11y wiring.
- Add a utility class for expanded hit area (e.g., .hit-area) and enforce min row heights.
- Establish copy conventions (sentence case, units) and add helper text to critical fields.

## Appendix D — TTRPG mobile character sheet UX takeaways (domain-specific)

What works well in existing apps (D&D Beyond, Pathbuilder 2e, Roll20 PF2 redesign)

- Sticky always-visible summary with HP, conditions, core stats at top; fast tap targets for HP/conditions.
- Sectioned navigation (tabs or quick-jump) for Actions/Inventory/Features; on mobile, prefer drawers over deep pages.
- Inline quick edits for the most frequent actions (HP, slots, conditions) without leaving context.
- Search and filter for large equipment/spell lists with clear chips/badges showing selections.
- Offline-first behavior and fast refresh of server state; pull-to-refresh patterns on iOS/Android.

Common pitfalls to avoid

- App-to-web editing handoffs that break flow or lose context; aim for native in-app edits wherever feasible.
- Overloaded first screen with too many panels; provide a “simple view” that shows only essentials during play.
- Hidden, swipe-only destructive actions; require explicit affordances and confirmations.

Domain-tuned patterns we’ll adopt

- Simple View toggle: condensed play mode showing Name/Class/Level, HP/Stress, Conditions, Loadout quick actions.
- Quick-edit clusters: big steppers for HP/Stress/Gold; chips for Conditions; add/remove from Loadout within one drawer.
- Section drawers mirror tabletop tasks: Identity, Class, Traits, Resources, Domains, Equipment.
- Per-section empty states with guidance (e.g., “No cards in Loadout yet — add from Vault”).

Navigation & bottom bar

- Bottom action bar with up to 3–5 actions, thumb-zone centered. Include Edit/View toggle or Save/Cancel.
- Preserve scroll/focus when returning from drawers; maintain anchor context per section.

Quality bar

- Task benchmarks: HP change ≤ 2 taps; Add condition ≤ 3 taps; Add loadout card ≤ 5 taps including search.
- Readability at small widths; supports large text; clear icon+label pairs.

## Milestone 1 (Aug 11, 2025) — Shipped

- Sticky header with compact title and QuickJump chip row linking to section anchors
- Anchored sections on /characters/$id: summary, conditions, resources, core, identity, class, domains, traits
- BottomActionBar (safe-area aware) with Play Mode toggle and Save
- Per-character Play Mode preference persisted in localStorage (key: dh:characters:{id}:playMode:v1)
- In Play Mode, non-critical sections are hidden (identity/class/domains/traits), keeping Conditions, Resources, Core visible
- Existing drawers and cards (Identity, Class, Domains, Resources, Traits, Conditions) integrated; auto-persist to localStorage remains

### Next (Milestone 2)

- Domain Loadout limits in UI (counters/disable adds at cap)
- Equipment & Inventory panels and editors
- HP thresholds display and richer resource controls
- UX polish: active section highlight in QuickJump via IntersectionObserver
- Tests for QuickJump anchors and playMode persistence
