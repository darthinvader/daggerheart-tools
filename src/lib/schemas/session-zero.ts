import { z } from 'zod';

// =====================================================================================
// Session Zero Framework Schema
// Based on Chapter 3: Session Zero and Safety Tools from the Daggerheart rulebook
// Implements the CATS Method (Concept, Aim, Tone, Subject) and safety tools
// =====================================================================================

/**
 * Character connection - how PCs are connected to each other
 * From Chapter 3: Character connections form the scaffolding for the campaign
 */
export const CharacterConnectionSchema = z.object({
  id: z.string(),
  fromCharacterId: z.string().optional(), // The character making the connection
  fromCharacterName: z.string().optional(), // Denormalized for display
  toCharacterId: z.string().optional(), // The character they're connected to
  toCharacterName: z.string().optional(), // Denormalized for display
  connectionType: z
    .enum([
      'childhood-friends',
      'rivals',
      'family',
      'mentor-student',
      'shared-trauma',
      'debt-owed',
      'saved-their-life',
      'former-allies',
      'secret-shared',
      'other',
    ])
    .default('other'),
  description: z.string().default(''), // Details about the connection
  isReciprocal: z.boolean().default(true), // Does the other character know?
  notes: z.string().default(''),
});

/**
 * Safety tool line - topics that should NEVER appear in the game
 * From Chapter 3: "Lines are topics that players do not want in the game.
 * They should not appear in any form."
 */
export const SafetyLineSchema = z.object({
  id: z.string(),
  topic: z.string(),
  addedBy: z.string().optional(), // Player who added this line (anonymous if not specified)
  isAnonymous: z.boolean().default(true), // Keep the source anonymous
  notes: z.string().default(''),
});

/**
 * Safety tool veil - topics that exist but happen "off-screen"
 * From Chapter 3: "Veils are topics that players do not want to feature in the game,
 * but can still exist in the world."
 */
export const SafetyVeilSchema = z.object({
  id: z.string(),
  topic: z.string(),
  addedBy: z.string().optional(), // Player who added this veil (anonymous if not specified)
  isAnonymous: z.boolean().default(true), // Keep the source anonymous
  howToHandle: z.string().default(''), // How to handle when it comes up
  notes: z.string().default(''),
});

/**
 * Table agreement - social contract items for the group
 * E.g., scheduling, communication preferences, table etiquette
 */
export const TableAgreementSchema = z.object({
  id: z.string(),
  category: z
    .enum([
      'scheduling',
      'communication',
      'etiquette',
      'gameplay',
      'content',
      'other',
    ])
    .default('other'),
  agreement: z.string(),
  isAgreed: z.boolean().default(false),
  notes: z.string().default(''),
});

/**
 * Session zero question with answer tracking
 * Extended from the existing SessionZeroQuestionSchema
 */
export const SessionZeroQuestionAnswerSchema = z.object({
  id: z.string(),
  question: z.string(),
  category: z
    .enum([
      'character',
      'world',
      'relationships',
      'themes',
      'safety',
      'logistics',
      'custom',
    ])
    .optional(),
  answer: z.string().default(''),
  askedAt: z.string().datetime().optional(),
  answeredBy: z.string().optional(), // Player name or 'group'
});

/**
 * Worldbuilding note from session zero
 * From Chapter 3: Players contribute to worldbuilding during session zero
 */
export const WorldbuildingNoteSchema = z.object({
  id: z.string(),
  category: z
    .enum([
      'geography',
      'culture',
      'history',
      'magic',
      'politics',
      'religion',
      'technology',
      'other',
    ])
    .default('other'),
  title: z.string().default(''),
  description: z.string(),
  contributedBy: z.string().optional(), // Player who contributed this
  isCanon: z.boolean().default(true), // Has the GM approved this for the world?
  notes: z.string().default(''),
});

/**
 * Tone preference - circled, crossed out, or neutral
 * From Chapter 3: "Circle a few everyone is excited to focus on and
 * cross out tones the players want to avoid."
 */
export const TonePreferenceSchema = z.object({
  tone: z.string(),
  preference: z.enum(['desired', 'neutral', 'avoided']).default('neutral'),
});

/**
 * Complete Session Zero schema implementing the CATS Method
 * From Chapter 3 of the Daggerheart rulebook
 */
export const SessionZeroSchema = z.object({
  // ─────────────────────────────────────────────────────────────────────────────
  // CATS Method (Concept, Aim, Tone, Subject)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * CONCEPT - The campaign concept/pitch
   * From Chapter 3: "What's the big-picture pitch? If this campaign was a book series,
   * how would you hype it up to a friend?"
   */
  concept: z.string().default(''),

  /**
   * AIM - What the group is trying to achieve
   * From Chapter 3: "Your creative and social goals. Do you have a specific creative
   * agenda? Or do you mostly want to spend a few hours with friends every week?"
   */
  aim: z.string().default(''),

  /**
   * TONE - Tone descriptors with preferences
   * From Chapter 3: Lists like "Adventurous, Cozy, Dramatic, Funny, Goofy, Gritty,
   * Intimate, Lighthearted, Political, Romantic, Scary, Whimsical"
   */
  tonePreferences: z.array(TonePreferenceSchema).default([]),

  /**
   * SUBJECT - Subject matter to explore
   * Topics the group actively wants in the game
   */
  subjectsToExplore: z.array(z.string()).default([]),

  /**
   * SUBJECT - Subject matter to avoid (Lines)
   * From Chapter 3: "Lines are topics that players do not want in the game"
   */
  lines: z.array(SafetyLineSchema).default([]),

  /**
   * SUBJECT - Subject matter to handle carefully (Veils)
   * From Chapter 3: "Veils are topics that players do not want to feature in the game,
   * but can still exist in the world"
   */
  veils: z.array(SafetyVeilSchema).default([]),

  // ─────────────────────────────────────────────────────────────────────────────
  // Safety Tools
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Has the group reviewed safety tools (X-Card, Lines and Veils)?
   */
  safetyToolsReviewed: z.boolean().default(false),

  /**
   * X-Card explained and available
   * From Chapter 3: "The X-Card is a tool that allows any player to remove content
   * from the game."
   */
  xCardEnabled: z.boolean().default(true),

  /**
   * Notes about safety tool usage for this group
   */
  safetyNotes: z.string().default(''),

  // ─────────────────────────────────────────────────────────────────────────────
  // Table Agreements
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Social contract and table agreements
   */
  tableAgreements: z.array(TableAgreementSchema).default([]),

  // ─────────────────────────────────────────────────────────────────────────────
  // Character Connections
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * How characters are connected to each other
   * From Chapter 3: Connection questions are critical for campaign setup
   */
  characterConnections: z.array(CharacterConnectionSchema).default([]),

  // ─────────────────────────────────────────────────────────────────────────────
  // Worldbuilding
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Collaborative worldbuilding notes from session zero
   */
  worldbuildingNotes: z.array(WorldbuildingNoteSchema).default([]),

  /**
   * General worldbuilding summary
   */
  worldbuildingSummary: z.string().default(''),

  // ─────────────────────────────────────────────────────────────────────────────
  // Questions & Discussion
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Questions asked during session zero with answers
   */
  questionsAsked: z.array(SessionZeroQuestionAnswerSchema).default([]),

  // ─────────────────────────────────────────────────────────────────────────────
  // Session Zero Completion Tracking
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Checklist of session zero steps completed
   */
  completedSteps: z
    .object({
      introductions: z.boolean().default(false),
      catsDiscussion: z.boolean().default(false),
      safetyToolsReview: z.boolean().default(false),
      worldbuilding: z.boolean().default(false),
      characterCreation: z.boolean().default(false),
      connections: z.boolean().default(false),
      wrapUp: z.boolean().default(false),
    })
    .default({
      introductions: false,
      catsDiscussion: false,
      safetyToolsReview: false,
      worldbuilding: false,
      characterCreation: false,
      connections: false,
      wrapUp: false,
    }),

  /**
   * Whether session zero has been fully completed
   */
  completed: z.boolean().default(false),

  /**
   * Date session zero was held
   */
  sessionDate: z.string().optional(),

  /**
   * Duration in minutes
   */
  durationMinutes: z.number().optional(),

  /**
   * General notes about session zero
   */
  notes: z.string().default(''),

  // Metadata
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// =====================================================================================
// Default Tone Options
// From Chapter 3: "ADVENTUROUS, COZY, DRAMATIC, FUNNY, GOOFY, GRITTY, INTIMATE,
// LIGHTHEARTED, POLITICAL, ROMANTIC, SCARY, WHIMSICAL"
// =====================================================================================

export const DEFAULT_TONE_OPTIONS = [
  'Adventurous',
  'Cozy',
  'Dramatic',
  'Funny',
  'Goofy',
  'Gritty',
  'Intimate',
  'Lighthearted',
  'Political',
  'Romantic',
  'Scary',
  'Whimsical',
] as const;

// =====================================================================================
// Default Table Agreement Categories
// =====================================================================================

export const TABLE_AGREEMENT_CATEGORIES = [
  { value: 'scheduling', label: 'Scheduling' },
  { value: 'communication', label: 'Communication' },
  { value: 'etiquette', label: 'Table Etiquette' },
  { value: 'gameplay', label: 'Gameplay Style' },
  { value: 'content', label: 'Content Boundaries' },
  { value: 'other', label: 'Other' },
] as const;

// =====================================================================================
// Suggested Table Agreements
// Common agreements groups often make
// =====================================================================================

export const SUGGESTED_TABLE_AGREEMENTS = [
  {
    category: 'scheduling',
    agreements: [
      'We will play on [day] at [time]',
      'Sessions last approximately [X] hours',
      'Give at least 24 hours notice for cancellations',
      'We need at least [X] players to run a session',
    ],
  },
  {
    category: 'communication',
    agreements: [
      'Use [platform] for out-of-game communication',
      'Discuss concerns with the GM privately first',
      'Keep phones on silent during play',
    ],
  },
  {
    category: 'etiquette',
    agreements: [
      'Respect other players speaking time',
      'Stay engaged when not in the spotlight',
      'Be supportive of other players choices',
      'Arrive on time and prepared',
    ],
  },
  {
    category: 'gameplay',
    agreements: [
      'PvP requires consent from all involved',
      'Character death is possible but meaningful',
      'The GM has final say on rules interpretations',
      'Collaborative storytelling is encouraged',
    ],
  },
  {
    category: 'content',
    agreements: [
      'Use safety tools without judgment',
      'Check in before introducing heavy themes',
      'Romantic content fades to black',
    ],
  },
] as const;

// =====================================================================================
// Session Zero Checklist Template
// Based on the "Example Session Zero Breakdown" from Chapter 3
// =====================================================================================

export const SESSION_ZERO_CHECKLIST = [
  {
    id: 'introductions',
    label: 'Player Introductions',
    description: 'Get to know each other and establish pronouns',
    estimatedMinutes: 10,
  },
  {
    id: 'catsDiscussion',
    label: 'CATS Discussion',
    description: 'Discuss Concept, Aim, Tone, and Subject matter',
    estimatedMinutes: 40,
  },
  {
    id: 'safetyToolsReview',
    label: 'Safety Tools Review',
    description: 'Establish Lines, Veils, and the X-Card',
    estimatedMinutes: 15,
  },
  {
    id: 'worldbuilding',
    label: 'Worldbuilding',
    description: 'Collaboratively build the campaign setting',
    estimatedMinutes: 50,
  },
  {
    id: 'characterCreation',
    label: 'Character Creation',
    description: 'Create characters and answer background questions',
    estimatedMinutes: 70,
  },
  {
    id: 'connections',
    label: 'Character Connections',
    description: 'Establish how characters know each other',
    estimatedMinutes: 20,
  },
  {
    id: 'wrapUp',
    label: 'Wrap-Up & Feedback',
    description: 'Gather feedback and answer final questions',
    estimatedMinutes: 10,
  },
] as const;

// =====================================================================================
// Connection Type Options
// =====================================================================================

export const CONNECTION_TYPE_OPTIONS = [
  { value: 'childhood-friends', label: 'Childhood Friends' },
  { value: 'rivals', label: 'Rivals' },
  { value: 'family', label: 'Family' },
  { value: 'mentor-student', label: 'Mentor/Student' },
  { value: 'shared-trauma', label: 'Shared Trauma' },
  { value: 'debt-owed', label: 'Debt Owed' },
  { value: 'saved-their-life', label: 'Saved Their Life' },
  { value: 'former-allies', label: 'Former Allies' },
  { value: 'secret-shared', label: 'Share a Secret' },
  { value: 'other', label: 'Other' },
] as const;

// =====================================================================================
// Type Exports
// =====================================================================================

export type SessionZero = z.infer<typeof SessionZeroSchema>;
export type CharacterConnection = z.infer<typeof CharacterConnectionSchema>;
export type SafetyLine = z.infer<typeof SafetyLineSchema>;
export type SafetyVeil = z.infer<typeof SafetyVeilSchema>;
export type TableAgreement = z.infer<typeof TableAgreementSchema>;
export type SessionZeroQuestionAnswer = z.infer<
  typeof SessionZeroQuestionAnswerSchema
>;
export type WorldbuildingNote = z.infer<typeof WorldbuildingNoteSchema>;
export type TonePreference = z.infer<typeof TonePreferenceSchema>;

// =====================================================================================
// Helper Functions
// =====================================================================================

/**
 * Create an empty session zero with default values
 */
export function createEmptySessionZero(): SessionZero {
  const now = new Date().toISOString();
  return {
    concept: '',
    aim: '',
    tonePreferences: DEFAULT_TONE_OPTIONS.map(tone => ({
      tone,
      preference: 'neutral' as const,
    })),
    subjectsToExplore: [],
    lines: [],
    veils: [],
    safetyToolsReviewed: false,
    xCardEnabled: true,
    safetyNotes: '',
    tableAgreements: [],
    characterConnections: [],
    worldbuildingNotes: [],
    worldbuildingSummary: '',
    questionsAsked: [],
    completedSteps: {
      introductions: false,
      catsDiscussion: false,
      safetyToolsReview: false,
      worldbuilding: false,
      characterCreation: false,
      connections: false,
      wrapUp: false,
    },
    completed: false,
    notes: '',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Calculate session zero completion percentage
 */
export function calculateSessionZeroProgress(sessionZero: SessionZero): number {
  const steps = sessionZero.completedSteps;
  const completedCount = Object.values(steps).filter(Boolean).length;
  const totalSteps = Object.keys(steps).length;
  return Math.round((completedCount / totalSteps) * 100);
}

/**
 * Generate a unique ID for session zero items
 */
export function generateSessionZeroItemId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
