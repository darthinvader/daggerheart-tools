import { z } from 'zod';

// =====================================================================================
// Session & Rest State Tracking
// =====================================================================================

/**
 * Tracks which features have been used this session or since last rest
 */
export const FeatureUsageSchema = z.object({
  featureId: z.string(),
  featureName: z.string(),
  usedCount: z.number().int().min(0).default(0),
  maxUses: z.number().int().min(1).default(1),
  refreshOn: z.enum(['short_rest', 'long_rest', 'session']),
});

export const SessionStateSchema = z.object({
  sessionNumber: z.number().int().min(1).default(1),
  shortRestCount: z.number().int().min(0).max(3).default(0),
  featureUsage: z.array(FeatureUsageSchema).default([]),
  tagTeamUsed: z.boolean().default(false),
  lastRestType: z.enum(['short', 'long', 'none']).default('none'),
});

// =====================================================================================
// Death & Scars System
// =====================================================================================

export const ScarSchema = z.object({
  id: z.string(),
  description: z.string(),
  hopeSlotIndex: z.number().int().min(0),
  acquiredAtLevel: z.number().int().min(1).max(10).optional(),
  narrativeImpact: z.string().optional(),
});

export const DeathStateSchema = z.object({
  isUnconscious: z.boolean().default(false),
  scars: z.array(ScarSchema).default([]),
  deathMovesPending: z.boolean().default(false),
});

// =====================================================================================
// Character Notes & Journal
// =====================================================================================

export const NoteEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  sessionNumber: z.number().int().min(1).optional(),
  createdAt: z.string().datetime().optional(),
  tags: z.array(z.string()).default([]),
  pinned: z.boolean().default(false),
});

export const CharacterNotesSchema = z.object({
  entries: z.array(NoteEntrySchema).default([]),
  quickNotes: z.string().default(''),
});

// =====================================================================================
// Countdown Trackers (Enhanced with Dynamic Advancement per Daggerheart Ch. 3)
// =====================================================================================

/**
 * Roll result types for dynamic countdown advancement
 * Based on Daggerheart Chapter 3 rules:
 * - Critical Success: Advance by 3
 * - Success with Hope: Advance by 2
 * - Success with Fear: Advance by 1
 * - Failure: May not advance
 */
export const RollResultSchema = z.enum([
  'critical_success',
  'success_with_hope',
  'success_with_fear',
  'failure',
]);

/**
 * Behavior when countdown reaches completion
 */
export const CountdownBehaviorSchema = z.enum(['once', 'loop', 'pause']);

/**
 * Variance mode for starting position randomization
 */
export const VarianceModeSchema = z.enum(['none', 'low', 'medium', 'high']);

/**
 * Trigger that fires when countdown completes
 */
export const CountdownTriggerSchema = z.object({
  id: z.string(),
  description: z.string(),
  action: z
    .enum(['notify', 'spawn_adversary', 'environment_change', 'custom'])
    .optional(),
  fired: z.boolean().default(false),
});

/**
 * Advancement history entry for tracking/undo
 */
export const AdvancementHistoryEntrySchema = z.object({
  amount: z.number().int(),
  rollResult: RollResultSchema.optional(),
  timestamp: z.string().datetime().optional(),
});

export const CountdownSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),

  // Core countdown values
  segments: z.number().int().min(1).default(6),
  filled: z.number().int().min(0).default(0),
  type: z.enum(['threat', 'opportunity', 'neutral']).default('neutral'),
  createdAt: z.string().datetime().optional(),

  // Dynamic advancement (Daggerheart Ch. 3)
  dynamicAdvancement: z.boolean().default(false),

  // Completion behavior
  behavior: CountdownBehaviorSchema.default('once'),
  loopCount: z.number().int().min(0).default(0),

  // Variance for randomized starting positions
  variance: VarianceModeSchema.default('none'),

  // Trigger when countdown completes
  trigger: CountdownTriggerSchema.optional(),

  // History for undo/tracking
  advancementHistory: z.array(AdvancementHistoryEntrySchema).optional(),
});

export const CountdownsStateSchema = z.array(CountdownSchema).default([]);

// =====================================================================================
// Downtime Actions
// =====================================================================================

export const DowntimeMoveSchema = z.enum([
  'tend_to_wounds',
  'clear_stress',
  'repair_armor',
  'prepare',
  'tend_to_all_wounds',
  'clear_all_stress',
  'repair_all_armor',
  'work_on_project',
]);

export const DowntimeLogEntrySchema = z.object({
  id: z.string(),
  restType: z.enum(['short', 'long']),
  move: DowntimeMoveSchema,
  result: z.string().optional(),
  diceRoll: z.number().int().optional(),
  timestamp: z.string().datetime().optional(),
});

// =====================================================================================
// Type Exports
// =====================================================================================

export type FeatureUsage = z.infer<typeof FeatureUsageSchema>;
export type SessionState = z.infer<typeof SessionStateSchema>;
export type Scar = z.infer<typeof ScarSchema>;
export type DeathState = z.infer<typeof DeathStateSchema>;
export type NoteEntry = z.infer<typeof NoteEntrySchema>;
export type CharacterNotes = z.infer<typeof CharacterNotesSchema>;
export type Countdown = z.infer<typeof CountdownSchema>;
export type CountdownsState = z.infer<typeof CountdownsStateSchema>;
export type DowntimeMove = z.infer<typeof DowntimeMoveSchema>;
export type DowntimeLogEntry = z.infer<typeof DowntimeLogEntrySchema>;

// =====================================================================================
// Default Values
// =====================================================================================

export const DEFAULT_SESSION_STATE: SessionState = {
  sessionNumber: 1,
  shortRestCount: 0,
  featureUsage: [],
  tagTeamUsed: false,
  lastRestType: 'none',
};

export const DEFAULT_DEATH_STATE: DeathState = {
  isUnconscious: false,
  scars: [],
  deathMovesPending: false,
};

export const DEFAULT_CHARACTER_NOTES: CharacterNotes = {
  entries: [],
  quickNotes: '',
};
