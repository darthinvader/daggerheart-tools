import { z } from 'zod';

import { BattleStateSchema } from './battle';

// =====================================================================================
// Campaign Frame Schemas
// =====================================================================================

/**
 * Complexity rating indicates how challenging the campaign is to run.
 * 1 = Low complexity, sits within traditional fantasy genre
 * 2 = Medium complexity, some additional mechanics
 * 3 = High complexity, requires comfortable homebrewing
 */
export const CampaignComplexitySchema = z.enum(['1', '2', '3']);

/**
 * Tone descriptors for campaign feel
 */
export const CampaignToneSchema = z.array(z.string()).default([]);

/**
 * Session zero question to ask players
 */
export const SessionZeroQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  category: z
    .enum(['character', 'world', 'relationships', 'themes', 'custom'])
    .optional(),
});

/**
 * Distinction - unique setting information for the campaign
 */
export const CampaignDistinctionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

/**
 * Campaign mechanic - custom rules for the campaign
 */
export const CampaignMechanicSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  rules: z.array(z.string()).default([]),
});

/**
 * Guidance for communities, ancestries, or classes in the campaign
 */
export const CampaignGuidanceSchema = z.object({
  id: z.string(),
  type: z.enum(['community', 'ancestry', 'class']),
  name: z.string(),
  description: z.string(),
  questions: z.array(z.string()).default([]),
});

/**
 * Principle for players or GMs
 */
export const CampaignPrincipleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  target: z.enum(['player', 'gm', 'both']).default('both'),
});

/**
 * The inciting incident that kicks off the campaign
 */
export const IncitingIncidentSchema = z.object({
  title: z.string().optional(),
  description: z.string(),
  hooks: z.array(z.string()).default([]),
});

/**
 * Complete Campaign Frame schema
 */
export const CampaignFrameSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Campaign name is required'),
  complexity: CampaignComplexitySchema.default('1'),

  // Pitch & Tone
  pitch: z.string().default(''),
  toneAndFeel: CampaignToneSchema,
  themes: z.array(z.string()).default([]),
  touchstones: z.array(z.string()).default([]),

  // Overview
  overview: z.string().default(''),

  // Guidance sections
  communityGuidance: z.array(CampaignGuidanceSchema).default([]),
  ancestryGuidance: z.array(CampaignGuidanceSchema).default([]),
  classGuidance: z.array(CampaignGuidanceSchema).default([]),

  // Principles
  playerPrinciples: z.array(CampaignPrincipleSchema).default([]),
  gmPrinciples: z.array(CampaignPrincipleSchema).default([]),

  // World details
  distinctions: z.array(CampaignDistinctionSchema).default([]),

  // Starting point
  incitingIncident: IncitingIncidentSchema.optional(),

  // Custom mechanics
  mechanics: z.array(CampaignMechanicSchema).default([]),

  // Session zero
  sessionZeroQuestions: z.array(SessionZeroQuestionSchema).default([]),

  // Metadata
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  isTemplate: z.boolean().default(false),
});

// =====================================================================================
// Session Notes - Track what happened each session
// =====================================================================================

export const SessionNoteSchema = z.object({
  id: z.string(),
  sessionNumber: z.number().min(1),
  title: z.string().default(''),
  date: z.string().optional(), // When the session was played
  summary: z.string().default(''), // GM's summary of events
  highlights: z.array(z.string()).default([]), // Key moments
  playerNotes: z
    .array(
      z.object({
        playerId: z.string(),
        playerName: z.string(),
        note: z.string(),
        createdAt: z.string().datetime(),
      })
    )
    .default([]),
  npcsInvolved: z.array(z.string()).default([]), // NPC IDs
  locations: z.array(z.string()).default([]), // Location names
  questProgress: z.string().default(''), // Notes on quest/story progress
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Campaign NPCs/Characters - Story characters the GM creates
// =====================================================================================

export const CampaignNPCSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  title: z.string().default(''), // e.g., "The Merchant Prince", "Village Elder"
  description: z.string().default(''), // Physical appearance, mannerisms
  personality: z.string().default(''), // How they act, their quirks
  motivation: z.string().default(''), // What drives them
  secrets: z.string().default(''), // Hidden info only GM knows
  connections: z
    .array(
      z.object({
        npcId: z.string().optional(),
        name: z.string(),
        relationship: z.string(), // e.g., "rival", "ally", "family"
      })
    )
    .default([]),
  locations: z.array(z.string()).default([]), // Where they can be found
  status: z
    .enum(['active', 'deceased', 'missing', 'retired'])
    .default('active'),
  faction: z.string().default(''), // Which group they belong to
  notes: z.string().default(''), // Free-form notes
  sessionAppearances: z
    .array(
      z.object({
        sessionId: z.string(),
        sessionNumber: z.number(),
        summary: z.string(), // What they did this session
      })
    )
    .default([]),
  tags: z.array(z.string()).default([]), // For filtering/organizing
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Campaign Locations - Places in the world
// =====================================================================================

export const CampaignLocationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z
    .enum([
      'city',
      'town',
      'village',
      'dungeon',
      'wilderness',
      'landmark',
      'building',
      'region',
      'other',
    ])
    .default('other'),
  description: z.string().default(''), // What the place looks like
  history: z.string().default(''), // Background and lore
  secrets: z.string().default(''), // Hidden info only GM knows
  currentState: z.string().default(''), // What's happening there now
  connectedLocations: z.array(z.string()).default([]), // IDs of connected places
  npcsPresent: z.array(z.string()).default([]), // NPC IDs found here
  pointsOfInterest: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .default([]),
  tags: z.array(z.string()).default([]),
  notes: z.string().default(''),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Campaign Quests/Plot Hooks - Story threads and objectives
// =====================================================================================

export const CampaignQuestSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  type: z
    .enum(['main', 'side', 'personal', 'faction', 'rumor', 'hook'])
    .default('side'),
  status: z
    .enum(['available', 'active', 'completed', 'failed', 'abandoned'])
    .default('available'),
  description: z.string().default(''), // What the quest is about
  objectives: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        completed: z.boolean().default(false),
      })
    )
    .default([]),
  rewards: z.string().default(''), // What they get for completing
  giver: z.string().default(''), // NPC who gave the quest (ID or name)
  location: z.string().default(''), // Where the quest takes place (ID or name)
  relatedNpcs: z.array(z.string()).default([]), // NPCs involved
  notes: z.string().default(''), // GM notes
  foreshadowing: z.string().default(''), // Hints to drop before revealing
  consequences: z.string().default(''), // What happens if they fail or ignore
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  sessionIntroduced: z.number().optional(), // When players learned of it
  sessionCompleted: z.number().optional(), // When they finished it
  tags: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Story Threads - For tracking foreshadowing and plot development
// =====================================================================================

export const StoryThreadSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  status: z
    .enum(['seeding', 'developing', 'climax', 'resolved'])
    .default('seeding'),
  description: z.string().default(''), // What this thread is about
  hints: z
    .array(
      z.object({
        hint: z.string(),
        dropped: z.boolean().default(false),
        sessionNumber: z.number().optional(),
      })
    )
    .default([]), // Foreshadowing hints to drop
  relatedQuests: z.array(z.string()).default([]),
  relatedNpcs: z.array(z.string()).default([]),
  notes: z.string().default(''),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Campaign (GM's instance of a frame with players)
// =====================================================================================

export const CampaignPlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  characterId: z.string().optional(),
  characterName: z.string().optional(),
  joinedAt: z.string().datetime(),
  role: z.enum(['player', 'co-gm']).default('player'),
});

export const CampaignSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  frame: CampaignFrameSchema,
  gmId: z.string(),
  players: z.array(CampaignPlayerSchema).default([]),
  sessions: z.array(SessionNoteSchema).default([]),
  npcs: z.array(CampaignNPCSchema).default([]),
  locations: z.array(CampaignLocationSchema).default([]),
  quests: z.array(CampaignQuestSchema).default([]),
  storyThreads: z.array(StoryThreadSchema).default([]),
  battles: z.array(BattleStateSchema).default([]),
  sessionPrepChecklist: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        checked: z.boolean().default(false),
      })
    )
    .default([
      { id: 'default-1', text: 'Review last session notes', checked: false },
      {
        id: 'default-2',
        text: 'Check active quests & objectives',
        checked: false,
      },
      {
        id: 'default-3',
        text: 'Prepare 2-3 NPC voices/mannerisms',
        checked: false,
      },
      {
        id: 'default-4',
        text: 'Have a "yes, and" backup plan',
        checked: false,
      },
      { id: 'default-5', text: 'Note player character goals', checked: false },
      {
        id: 'default-6',
        text: 'Prepare one memorable description',
        checked: false,
      },
      { id: 'default-7', text: 'Check the Fear track', checked: false },
    ]),
  inviteCode: z.string().optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed']).default('draft'),
  notes: z.string().default(''),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Type exports
// =====================================================================================

export type CampaignComplexity = z.infer<typeof CampaignComplexitySchema>;
export type SessionZeroQuestion = z.infer<typeof SessionZeroQuestionSchema>;
export type CampaignDistinction = z.infer<typeof CampaignDistinctionSchema>;
export type CampaignMechanic = z.infer<typeof CampaignMechanicSchema>;
export type CampaignGuidance = z.infer<typeof CampaignGuidanceSchema>;
export type CampaignPrinciple = z.infer<typeof CampaignPrincipleSchema>;
export type IncitingIncident = z.infer<typeof IncitingIncidentSchema>;
export type CampaignFrame = z.infer<typeof CampaignFrameSchema>;
export type CampaignPlayer = z.infer<typeof CampaignPlayerSchema>;
export type SessionNote = z.infer<typeof SessionNoteSchema>;
export type CampaignNPC = z.infer<typeof CampaignNPCSchema>;
export type CampaignLocation = z.infer<typeof CampaignLocationSchema>;
export type CampaignQuest = z.infer<typeof CampaignQuestSchema>;
export type StoryThread = z.infer<typeof StoryThreadSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;

// Re-export battle types for convenience
export type { BattleState } from './battle';
