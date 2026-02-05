import { z } from 'zod';

// Import shared safety schemas from session-zero (these are the canonical definitions)
// NOT re-exported here to avoid duplicate export conflicts in index.ts
// Consumers should import SafetyLine/SafetyVeil from session-zero or the main index
import { SafetyLineSchema, SafetyVeilSchema } from './session-zero';

// =====================================================================================
// Safety Tools Schema
// Based on Chapter 3: Session Zero and Safety Tools from the Daggerheart rulebook
// Implements Lines & Veils, X-Card, Content Warnings, and Open Door Policy
// =====================================================================================

/**
 * Content warning - session-specific alerts for potentially sensitive content
 * Used to warn players before a session about content that may appear,
 * allowing them to prepare or opt-out.
 */
export const ContentWarningSchema = z.object({
  id: z.string(),
  warning: z.string().min(1, 'Warning is required'),
  severity: z.enum(['mild', 'moderate', 'intense']).default('moderate'),
  sessionNumber: z.number().optional(), // Which session this applies to (if session-specific)
  isActive: z.boolean().default(true), // Whether this warning is currently active
  description: z.string().default(''), // Additional context about the warning
  createdAt: z.string().datetime().optional(),
});

/**
 * X-Card usage record - tracks when the X-Card was invoked
 * Useful for understanding patterns and improving future sessions
 */
export const XCardUsageSchema = z.object({
  id: z.string(),
  sessionNumber: z.number().optional(),
  timestamp: z.string().datetime(),
  resolved: z.boolean().default(true),
  notes: z.string().default(''), // Anonymous notes about how it was resolved
});

/**
 * Complete Safety Tools schema for campaigns
 * Implements all safety mechanisms from Chapter 3 of the Daggerheart rulebook
 */
export const SafetyToolsSchema = z.object({
  // ─────────────────────────────────────────────────────────────────────────────
  // Lines & Veils
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Lines - Topics that are completely off-limits
   * These topics should never appear in ANY form during the game.
   * No questions asked - if someone has a line, it's respected.
   */
  lines: z.array(z.string()).default([]),

  /**
   * Detailed lines with metadata
   * For when you need to track who added a line or add notes
   */
  linesDetailed: z.array(SafetyLineSchema).default([]),

  /**
   * Veils - Topics that can happen but fade-to-black
   * These topics can exist in the world and be referenced,
   * but the actual content happens "off-screen"
   */
  veils: z.array(z.string()).default([]),

  /**
   * Detailed veils with metadata
   * For when you need to track handling instructions
   */
  veilsDetailed: z.array(SafetyVeilSchema).default([]),

  // ─────────────────────────────────────────────────────────────────────────────
  // Content Warnings
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Content warnings - Active warnings for current/upcoming sessions
   * Should be reviewed at the start of each session
   */
  contentWarnings: z.array(z.string()).default([]),

  /**
   * Detailed content warnings with severity levels
   */
  contentWarningsDetailed: z.array(ContentWarningSchema).default([]),

  // ─────────────────────────────────────────────────────────────────────────────
  // X-Card
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * X-Card enabled - Immediate stop mechanism
   * From Chapter 3: The X-Card allows any player to immediately stop
   * or skip content that makes them uncomfortable, no explanation needed.
   */
  xCardEnabled: z.boolean().default(true),

  /**
   * Track X-Card usage (optional, for reflection)
   * Completely anonymous - no details about content
   */
  xCardUsageHistory: z.array(XCardUsageSchema).default([]),

  // ─────────────────────────────────────────────────────────────────────────────
  // Open Door Policy
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Open Door Policy - Players can leave anytime
   * From Chapter 3: Everyone has the right to leave the game at any time,
   * no questions asked and no justification required.
   */
  openDoorPolicy: z.boolean().default(true),

  /**
   * Open door contact - Who to contact if someone needs to leave
   * Could be the GM or a designated safety coordinator
   */
  openDoorContact: z.string().default(''),

  // ─────────────────────────────────────────────────────────────────────────────
  // Additional Safety Considerations
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Safety notes - Free-form text for additional safety considerations
   * Group-specific agreements, check-in procedures, etc.
   */
  safetyNotes: z.string().default(''),

  /**
   * Has the group reviewed safety tools?
   * Should be checked off during Session Zero
   */
  safetyToolsReviewed: z.boolean().default(false),

  /**
   * Date of last safety tools review
   */
  lastReviewedAt: z.string().datetime().optional(),

  /**
   * Check-in frequency - How often to revisit safety tools
   */
  checkInFrequency: z
    .enum(['every-session', 'monthly', 'as-needed', 'never'])
    .default('as-needed'),

  /**
   * Pause button enabled - Like X-Card but for temporary breaks
   * Allows players to call for a brief pause without ending the scene
   */
  pauseButtonEnabled: z.boolean().default(true),

  /**
   * Recap consent - Ask players before recapping potentially sensitive content
   */
  recapConsent: z.boolean().default(true),

  // Metadata
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// =====================================================================================
// Default Values and Constants
// =====================================================================================

/**
 * Common content warning examples for discussion during Session Zero
 */
export const COMMON_CONTENT_WARNING_TOPICS = [
  'Violence and combat',
  'Blood and gore',
  'Character death',
  'Horror elements',
  'Psychological horror',
  'Body horror',
  'Spiders/insects',
  'Claustrophobia',
  'Heights',
  'Drowning',
  'Fire',
  'Imprisonment',
  'Betrayal',
  'Loss of autonomy',
  'Mind control',
  'Torture',
  'Child endangerment',
  'Animal harm',
  'Addiction',
  'Self-harm references',
  'Suicide references',
  'Domestic abuse',
  'Sexual content',
  'Racism/discrimination themes',
  'Religious trauma',
  'War themes',
  'Natural disasters',
  'Pandemic/disease',
  'Grief and loss',
  'Abandonment',
] as const;

/**
 * Severity level labels and descriptions
 */
export const CONTENT_WARNING_SEVERITY = {
  mild: {
    label: 'Mild',
    description: 'Brief or indirect references',
    color: 'yellow',
  },
  moderate: {
    label: 'Moderate',
    description: 'Present but not graphic',
    color: 'orange',
  },
  intense: {
    label: 'Intense',
    description: 'Detailed or graphic depiction',
    color: 'red',
  },
} as const;

/**
 * Check-in frequency options
 */
export const CHECK_IN_FREQUENCY_OPTIONS = [
  { value: 'every-session', label: 'Every Session' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'as-needed', label: 'As Needed' },
  { value: 'never', label: 'Never (initial only)' },
] as const;

// =====================================================================================
// Type Exports
// =====================================================================================

// SafetyLine and SafetyVeil types are imported and re-exported from session-zero at the top of this file
export type ContentWarning = z.infer<typeof ContentWarningSchema>;
export type XCardUsage = z.infer<typeof XCardUsageSchema>;
export type SafetyTools = z.infer<typeof SafetyToolsSchema>;

// =====================================================================================
// Helper Functions
// =====================================================================================

/**
 * Generate a unique ID for safety tool items
 */
export function generateSafetyItemId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create an empty safety tools configuration with sensible defaults
 */
export function createEmptySafetyTools(): SafetyTools {
  const now = new Date().toISOString();
  return {
    lines: [],
    linesDetailed: [],
    veils: [],
    veilsDetailed: [],
    contentWarnings: [],
    contentWarningsDetailed: [],
    xCardEnabled: true,
    xCardUsageHistory: [],
    openDoorPolicy: true,
    openDoorContact: '',
    safetyNotes: '',
    safetyToolsReviewed: false,
    checkInFrequency: 'as-needed',
    pauseButtonEnabled: true,
    recapConsent: true,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Merge simple string arrays with detailed arrays for display
 * Useful when migrating from simple arrays to detailed schemas
 */
export function getAllLines(safetyTools: SafetyTools): string[] {
  const simpleLines = safetyTools.lines;
  const detailedTopics = safetyTools.linesDetailed.map(l => l.topic);
  return [...new Set([...simpleLines, ...detailedTopics])];
}

export function getAllVeils(safetyTools: SafetyTools): string[] {
  const simpleVeils = safetyTools.veils;
  const detailedTopics = safetyTools.veilsDetailed.map(v => v.topic);
  return [...new Set([...simpleVeils, ...detailedTopics])];
}

export function getActiveContentWarnings(safetyTools: SafetyTools): string[] {
  const simpleWarnings = safetyTools.contentWarnings;
  const activeDetailedWarnings = safetyTools.contentWarningsDetailed
    .filter(w => w.isActive)
    .map(w => w.warning);
  return [...new Set([...simpleWarnings, ...activeDetailedWarnings])];
}

/**
 * Check if a topic conflicts with established lines
 * Useful for GMs planning content
 */
export function checkForLineConflict(
  topic: string,
  safetyTools: SafetyTools
): boolean {
  const allLines = getAllLines(safetyTools).map(l => l.toLowerCase());
  const topicLower = topic.toLowerCase();
  return allLines.some(
    line => topicLower.includes(line) || line.includes(topicLower)
  );
}

/**
 * Check if a topic should be veiled
 */
export function shouldVeilTopic(
  topic: string,
  safetyTools: SafetyTools
): boolean {
  const allVeils = getAllVeils(safetyTools).map(v => v.toLowerCase());
  const topicLower = topic.toLowerCase();
  return allVeils.some(
    veil => topicLower.includes(veil) || veil.includes(topicLower)
  );
}

/**
 * Get safety status summary for display
 */
export function getSafetyToolsSummary(safetyTools: SafetyTools): {
  linesCount: number;
  veilsCount: number;
  activeWarningsCount: number;
  isReviewed: boolean;
  xCardEnabled: boolean;
  openDoorPolicy: boolean;
} {
  return {
    linesCount: getAllLines(safetyTools).length,
    veilsCount: getAllVeils(safetyTools).length,
    activeWarningsCount: getActiveContentWarnings(safetyTools).length,
    isReviewed: safetyTools.safetyToolsReviewed,
    xCardEnabled: safetyTools.xCardEnabled,
    openDoorPolicy: safetyTools.openDoorPolicy,
  };
}
