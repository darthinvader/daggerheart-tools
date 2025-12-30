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
  hopeSlotIndex: z.number().int().min(0).max(5),
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
// Countdown Trackers
// =====================================================================================

export const CountdownSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  currentValue: z.number().int().min(0),
  maxValue: z.number().int().min(1),
  tickOn: z
    .enum(['action_roll', 'fear_roll', 'rest', 'manual'])
    .default('manual'),
  isComplete: z.boolean().default(false),
  type: z.enum(['progress', 'danger', 'project']).default('progress'),
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
