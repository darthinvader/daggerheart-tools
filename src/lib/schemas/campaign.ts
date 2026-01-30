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
// Session NPC Involvement - Tracks NPC participation in sessions with metadata
// =====================================================================================

export const SessionNPCInvolvementSchema = z.object({
  id: z.string(),
  npcId: z.string(),
  npcName: z.string().optional(), // Denormalized for display
  role: z.string().default(''),
  actionsTaken: z.string().default(''),
  notes: z.string().default(''),
  locationIds: z.array(z.string()).default([]), // Where the NPC was during the session
  questIds: z.array(z.string()).default([]), // Quests the NPC was involved in
});

// =====================================================================================
// Session Notes - Track what happened each session
// =====================================================================================

export const SessionNoteSchema = z.object({
  id: z.string(),
  sessionNumber: z.number().min(1),
  title: z.string().default(''),
  date: z.string().optional(), // When the session was played (date_played)
  summary: z.string().default(''), // GM's summary of events
  keyHighlights: z.array(z.string()).default([]), // Key moments (renamed from highlights)
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
  // NPCs Involved with full metadata (double-linked with NPC's session appearances)
  npcsInvolved: z.array(SessionNPCInvolvementSchema).default([]),
  // Legacy fields for backwards compatibility
  npcsInvolvedIds: z.array(z.string()).default([]), // NPC IDs (legacy)
  npcsInvolvedCustom: z.array(z.string()).default([]), // Custom NPC labels (legacy)
  // Locations visited
  locationIds: z.array(z.string()).default([]), // Location IDs
  locationsCustom: z.array(z.string()).default([]), // Custom location labels (legacy)
  // Quests involved
  questIds: z.array(z.string()).default([]), // Quest IDs
  questsInvolvedCustom: z.array(z.string()).default([]), // Custom quest labels (legacy)
  // Organizations mentioned
  organizationIds: z.array(z.string()).default([]),
  // Legacy
  questProgress: z.string().default(''), // Notes on quest/story progress (legacy)
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// NPC Session Appearance - Tracks NPC's appearance in sessions (reverse link)
// =====================================================================================

export const NPCSessionAppearanceSchema = z.object({
  sessionId: z.string(),
  sessionNumber: z.number().optional(),
  sessionTitle: z.string().optional(),
  role: z.string().default(''),
  actionsTaken: z.string().default(''),
  notes: z.string().default(''),
  locationIds: z.array(z.string()).default([]),
  questIds: z.array(z.string()).default([]),
});

// =====================================================================================
// NPC Quest Appearance - Tracks NPC's involvement in quests
// =====================================================================================

export const NPCQuestAppearanceSchema = z.object({
  questId: z.string(),
  questTitle: z.string().optional(),
  role: z.string().default(''),
  actionsTaken: z.string().default(''),
  notes: z.string().default(''),
  locationIds: z.array(z.string()).default([]),
  sessionIds: z.array(z.string()).default([]),
});

// =====================================================================================
// Campaign NPCs/Characters - Story characters the GM creates
// =====================================================================================

export const CampaignNPCSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  titleRole: z.string().default(''), // e.g., "The Merchant Prince", "Village Elder" (renamed from title)
  status: z
    .enum(['active', 'deceased', 'missing', 'retired'])
    .default('active'),
  description: z.string().default(''), // Physical appearance, mannerisms
  personality: z.string().default(''), // How they act, their quirks
  motivation: z.string().default(''), // What drives them
  backgroundHistory: z.string().default(''), // Background/History (renamed)
  secrets: z.string().default(''), // Hidden info only GM knows

  // Organization/Faction links
  faction: z.string().default(''), // Legacy field
  organizationIds: z.array(z.string()).default([]), // Link to organizations

  // Location links
  locationIds: z.array(z.string()).default([]),

  // NPC Relationships
  allyNpcIds: z.array(z.string()).default([]),
  enemyNpcIds: z.array(z.string()).default([]),
  allyOrganizationIds: z.array(z.string()).default([]),
  enemyOrganizationIds: z.array(z.string()).default([]),

  // Legacy connections field
  connections: z
    .array(
      z.object({
        npcId: z.string().optional(),
        name: z.string(),
        relationship: z.string(), // e.g., "rival", "ally", "family"
      })
    )
    .default([]),

  // Session and Quest appearances
  sessionAppearances: z.array(NPCSessionAppearanceSchema).default([]),
  questAppearances: z.array(NPCQuestAppearanceSchema).default([]),

  // Metadata
  tags: z.array(z.string()).default([]), // For filtering/organizing
  notes: z.string().default(''), // Free-form notes (renamed from notes)

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Point of Interest - For location sub-elements
// =====================================================================================

export const PointOfInterestSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(''),
  significance: z.string().default(''),
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
  currentState: z.string().default(''), // What's happening there now
  historyLore: z.string().default(''), // Background and lore (renamed from history)
  secrets: z.string().default(''), // Hidden info only GM knows

  // Points of Interest
  pointsOfInterest: z.array(PointOfInterestSchema).default([]),

  // Connected locations
  connectedLocations: z.array(z.string()).default([]), // IDs of connected places

  // NPC links
  npcIds: z.array(z.string()).default([]), // NPC IDs found here
  npcsPresentCustom: z.array(z.string()).default([]), // Custom NPC labels (legacy)

  // Organization links
  organizationIds: z.array(z.string()).default([]),

  // Quest links
  questIds: z.array(z.string()).default([]), // Quest IDs
  questsAvailableCustom: z.array(z.string()).default([]), // Custom quest labels (legacy)

  // Session appearances
  sessionAppearances: z
    .array(
      z.object({
        sessionId: z.string().optional(),
        sessionNumber: z.number().optional(),
        sessionTitle: z.string().optional(),
        notes: z.string().default(''),
      })
    )
    .default([]),

  // Metadata
  tags: z.array(z.string()).default([]),
  notes: z.string().default(''),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Quest NPC Involvement - Tracks NPC participation in quests with metadata
// =====================================================================================

export const QuestNPCInvolvementSchema = z.object({
  id: z.string(),
  npcId: z.string(),
  npcName: z.string().optional(), // Denormalized for display
  role: z.string().default(''),
  actionsTaken: z.string().default(''),
  notes: z.string().default(''),
  locationIds: z.array(z.string()).default([]),
  sessionIds: z.array(z.string()).default([]),
});

// =====================================================================================
// Quest Character (PC) Involvement - Tracks PC participation in quests with metadata
// =====================================================================================

export const QuestCharacterInvolvementSchema = z.object({
  id: z.string(),
  characterId: z.string(),
  characterName: z.string().optional(), // Denormalized for display
  role: z.string().default(''),
  actionsTaken: z.string().default(''),
  notes: z.string().default(''),
  locationIds: z.array(z.string()).default([]),
  sessionIds: z.array(z.string()).default([]),
});

// =====================================================================================
// Campaign Quests/Plot Hooks - Story threads and objectives
// =====================================================================================

export const CampaignQuestSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  status: z
    .enum(['available', 'active', 'completed', 'failed', 'abandoned'])
    .default('available'),
  type: z
    .enum(['main', 'side', 'personal', 'faction', 'rumor', 'hook'])
    .default('side'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  description: z.string().default(''), // What the quest is about

  // Objectives (multiple)
  objectives: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        completed: z.boolean().default(false),
      })
    )
    .default([]),

  // Rewards (multiple)
  rewards: z.array(z.string()).default([]),

  // Story elements
  foreshadowing: z.string().default(''), // Hints to drop before revealing
  consequences: z.string().default(''), // What happens if they fail or ignore
  notes: z.string().default(''), // GM notes

  // NPCs Involved with full metadata
  npcsInvolved: z.array(QuestNPCInvolvementSchema).default([]),

  // Characters (PCs) Involved with full metadata
  charactersInvolved: z.array(QuestCharacterInvolvementSchema).default([]),

  // Location links
  locationIds: z.array(z.string()).default([]),

  // Organization links
  organizationIds: z.array(z.string()).default([]),

  // Session links
  sessionIds: z.array(z.string()).default([]),

  // Legacy fields for backwards compatibility
  giver: z.string().default(''), // NPC who gave the quest (legacy)
  location: z.string().default(''), // Where the quest takes place (legacy)
  relatedNpcs: z.array(z.string()).default([]), // NPCs involved (legacy)
  relatedNpcsCustom: z.array(z.string()).default([]), // Custom NPC labels (legacy)
  relatedLocations: z.array(z.string()).default([]), // Location IDs (legacy)
  relatedLocationsCustom: z.array(z.string()).default([]), // Custom location labels (legacy)
  sessionAppearances: z
    .array(
      z.object({
        sessionId: z.string().optional(),
        sessionNumber: z.number().optional(),
        sessionTitle: z.string().optional(),
        notes: z.string().default(''),
      })
    )
    .default([]),
  sessionIntroduced: z.number().optional(), // When players learned of it (legacy)
  sessionCompleted: z.number().optional(), // When they finished it (legacy)
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
// Campaign Organizations - Factions, Guilds, and other groups
// =====================================================================================

export const CampaignOrganizationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z
    .enum([
      'guild',
      'faction',
      'government',
      'religious',
      'criminal',
      'mercenary',
      'merchant',
      'secret',
      'other',
    ])
    .default('other'),
  description: z.string().default(''),
  goalsObjectives: z.string().default(''),
  secrets: z.string().default(''),

  // Key Members (NPC links)
  keyMemberIds: z.array(z.string()).default([]),

  // Ally/Enemy NPCs
  allyNpcIds: z.array(z.string()).default([]),
  enemyNpcIds: z.array(z.string()).default([]),

  // Ally/Enemy Organizations
  allyOrganizationIds: z.array(z.string()).default([]),
  enemyOrganizationIds: z.array(z.string()).default([]),

  // Headquarters (single location)
  headquartersId: z.string().optional(),

  // Notable Activities (Quest links)
  questIds: z.array(z.string()).default([]),

  // Location links
  locationIds: z.array(z.string()).default([]),

  // Session appearances
  sessionIds: z.array(z.string()).default([]),

  // Metadata
  tags: z.array(z.string()).default([]),
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
  organizations: z.array(CampaignOrganizationSchema).default([]),
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
export type SessionNPCInvolvement = z.infer<typeof SessionNPCInvolvementSchema>;
export type NPCSessionAppearance = z.infer<typeof NPCSessionAppearanceSchema>;
export type NPCQuestAppearance = z.infer<typeof NPCQuestAppearanceSchema>;
export type CampaignNPC = z.infer<typeof CampaignNPCSchema>;
export type PointOfInterest = z.infer<typeof PointOfInterestSchema>;
export type CampaignLocation = z.infer<typeof CampaignLocationSchema>;
export type QuestNPCInvolvement = z.infer<typeof QuestNPCInvolvementSchema>;
export type QuestCharacterInvolvement = z.infer<
  typeof QuestCharacterInvolvementSchema
>;
export type CampaignQuest = z.infer<typeof CampaignQuestSchema>;
export type CampaignOrganization = z.infer<typeof CampaignOrganizationSchema>;
export type StoryThread = z.infer<typeof StoryThreadSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;

// Re-export battle types for convenience
export type { BattleState } from './battle';
