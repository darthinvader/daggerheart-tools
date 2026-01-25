import { z } from 'zod';

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
// Campaign (GM's instance of a frame with players)
// =====================================================================================

export const CampaignPlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  characterId: z.string().optional(),
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
export type Campaign = z.infer<typeof CampaignSchema>;
