// Storage layer with cohesive CRUD operations for campaigns - splitting would fragment the API

import { z } from 'zod';

import { createCampaignFrameFromTemplate } from '@/lib/data/campaign-frames';
import { BattleStateSchema } from '@/lib/schemas/battle';
import type {
  BattleState,
  Campaign,
  CampaignFrame,
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
  SessionNote,
} from '@/lib/schemas/campaign';
/**
 * Campaign storage using Supabase.
 * Provides CRUD operations for campaigns and their nested entities.
 */
import { supabase } from '@/lib/supabase';

// =====================================================================================
// Types for database row mapping
// =====================================================================================

interface CampaignRow {
  id: string;
  name: string;
  frame: CampaignFrame;
  gm_id: string;
  players: Campaign['players'];
  sessions: SessionNote[];
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  organizations: CampaignOrganization[];
  story_threads: Campaign['storyThreads'];
  battles: BattleState[];
  session_prep_checklist: Campaign['sessionPrepChecklist'];
  invite_code: string | null;
  status: Campaign['status'];
  notes: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface TrashedCampaign extends Campaign {
  deletedAt: string;
}

interface CampaignInvitePreviewRow {
  id: string;
  name: string;
  status: Campaign['status'];
  gm_id: string;
}

interface StandaloneBattleRow {
  id: string;
  owner_id: string;
  name: string;
  state: BattleState;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

const CampaignInvitePreviewSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['draft', 'active', 'paused', 'completed']),
  gm_id: z.string(),
});

export interface CampaignInvitePreview {
  id: string;
  name: string;
  status: Campaign['status'];
  gmId: string;
}

// =====================================================================================
// Helper functions
// =====================================================================================

function rowToCampaign(row: CampaignRow): Campaign {
  return {
    id: row.id,
    name: row.name,
    frame: row.frame,
    gmId: row.gm_id,
    players: row.players ?? [],
    sessions: row.sessions ?? [],
    npcs: row.npcs ?? [],
    locations: row.locations ?? [],
    quests: row.quests ?? [],
    organizations: row.organizations ?? [],
    storyThreads: row.story_threads ?? [],
    battles: row.battles ?? [],
    sessionPrepChecklist: row.session_prep_checklist ?? [],
    inviteCode: row.invite_code ?? undefined,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToTrashedCampaign(row: CampaignRow): TrashedCampaign {
  return {
    ...rowToCampaign(row),
    deletedAt: row.deleted_at!,
  };
}

function rowToCampaignInvitePreview(
  row: CampaignInvitePreviewRow
): CampaignInvitePreview {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    gmId: row.gm_id,
  };
}

/** Field mapping from Campaign to CampaignRow */
const CAMPAIGN_TO_ROW_FIELDS: Record<string, string> = {
  name: 'name',
  frame: 'frame',
  gmId: 'gm_id',
  players: 'players',
  sessions: 'sessions',
  npcs: 'npcs',
  locations: 'locations',
  quests: 'quests',
  organizations: 'organizations',
  storyThreads: 'story_threads',
  battles: 'battles',
  sessionPrepChecklist: 'session_prep_checklist',
  inviteCode: 'invite_code',
  status: 'status',
  notes: 'notes',
};

function campaignToRow(
  campaign: Partial<Campaign> & { gmId?: string }
): Partial<CampaignRow> {
  const row: Partial<CampaignRow> = {};
  const campaignRecord = campaign as Record<string, unknown>;

  for (const [campaignKey, rowKey] of Object.entries(CAMPAIGN_TO_ROW_FIELDS)) {
    if (campaignRecord[campaignKey] !== undefined) {
      (row as Record<string, unknown>)[rowKey] = campaignRecord[campaignKey];
    }
  }

  return row;
}

/**
 * Generate a short invite code
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

// =====================================================================================
// Campaign invites
// =====================================================================================

export async function fetchCampaignInvitePreview(
  inviteCode: string
): Promise<CampaignInvitePreview | undefined> {
  const { data, error } = await supabase.rpc('campaign_invite_preview', {
    invite_code: inviteCode,
  });

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error fetching campaign invite preview:', error);
    throw error;
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return undefined;

  const parsed = CampaignInvitePreviewSchema.parse(row);
  return rowToCampaignInvitePreview(parsed);
}

export async function joinCampaignByInviteCode(params: {
  inviteCode: string;
  playerName: string;
  characterId: string | null;
  characterName: string | null;
}): Promise<string> {
  const { inviteCode, playerName, characterId, characterName } = params;
  const { data, error } = await supabase.rpc('join_campaign_by_invite', {
    invite_code: inviteCode,
    player_name: playerName,
    character_id: characterId,
    character_name: characterName,
  });

  if (error) {
    console.error('Error joining campaign via invite:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Join campaign failed without a response');
  }

  return data as string;
}

// =====================================================================================
// Campaign CRUD
// =====================================================================================

/**
 * List all active campaigns for the current user
 */
export async function listCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error listing campaigns:', error);
    throw error;
  }

  return (data as CampaignRow[]).map(rowToCampaign);
}

/**
 * Get a campaign by ID
 */
export async function getCampaign(id: string): Promise<Campaign | undefined> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined; // Not found
    console.error('Error getting campaign:', error);
    throw error;
  }

  return rowToCampaign(data as CampaignRow);
}

/**
 * Find the campaign that contains a specific character
 * Returns the first campaign found (characters should only belong to one campaign)
 */
export async function getCampaignForCharacter(
  characterId: string
): Promise<Campaign | undefined> {
  // Query campaigns where the players array contains an object with this characterId
  // Use raw filter with @> operator for JSONB containment
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .is('deleted_at', null)
    .filter('players', 'cs', JSON.stringify([{ characterId }]));

  if (error) {
    console.error('Error finding campaign for character:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return undefined;
  }

  // Return the first matching campaign
  return rowToCampaign(data[0] as CampaignRow);
}

/**
 * Create a new campaign from a template
 */
export async function createCampaign(
  templateId: string,
  name?: string
): Promise<Campaign> {
  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Must be logged in to create a campaign');
  }

  const frame = createCampaignFrameFromTemplate(
    templateId,
    crypto.randomUUID()
  );

  if (!frame) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const campaignData: Partial<CampaignRow> = {
    name: name ?? frame.name,
    frame,
    gm_id: user.id,
    players: [],
    sessions: [],
    npcs: [],
    locations: [],
    quests: [],
    organizations: [],
    story_threads: [],
    invite_code: generateInviteCode(),
    status: 'draft',
    notes: '',
  };

  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaignData)
    .select()
    .single();

  if (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }

  return rowToCampaign(data as CampaignRow);
}

/**
 * Update a campaign
 */
export async function updateCampaign(
  id: string,
  updates: Partial<
    Pick<
      Campaign,
      'name' | 'status' | 'notes' | 'players' | 'sessionPrepChecklist'
    >
  >
): Promise<Campaign | undefined> {
  const row = campaignToRow(updates);

  const { data, error } = await supabase
    .from('campaigns')
    .update(row)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error updating campaign:', error);
    throw error;
  }

  return rowToCampaign(data as CampaignRow);
}

/**
 * Update a campaign's frame
 */
export async function updateCampaignFrame(
  id: string,
  frame: CampaignFrame
): Promise<Campaign | undefined> {
  const { data, error } = await supabase
    .from('campaigns')
    .update({
      frame: { ...frame, updatedAt: new Date().toISOString() },
    })
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error updating campaign frame:', error);
    throw error;
  }

  return rowToCampaign(data as CampaignRow);
}

/**
 * Soft delete a campaign (move to trash)
 */
export async function deleteCampaign(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('campaigns')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null);

  if (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }

  return true;
}

/**
 * List trashed campaigns
 */
export async function listTrashedCampaigns(): Promise<TrashedCampaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false });

  if (error) {
    console.error('Error listing trashed campaigns:', error);
    throw error;
  }

  return (data as CampaignRow[]).map(rowToTrashedCampaign);
}

/**
 * Restore a campaign from trash
 */
export async function restoreCampaign(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('campaigns')
    .update({ deleted_at: null })
    .eq('id', id)
    .not('deleted_at', 'is', null);

  if (error) {
    console.error('Error restoring campaign:', error);
    throw error;
  }

  return true;
}

/**
 * Permanently delete a campaign from trash
 */
export async function permanentlyDeleteCampaign(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id)
    .not('deleted_at', 'is', null);

  if (error) {
    console.error('Error permanently deleting campaign:', error);
    throw error;
  }

  return true;
}

/**
 * Empty the trash (permanently delete all trashed campaigns)
 */
export async function emptyTrash(): Promise<void> {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .not('deleted_at', 'is', null);

  if (error) {
    console.error('Error emptying trash:', error);
    throw error;
  }
}

// =====================================================================================
// Session Notes CRUD
// =====================================================================================

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function updateCampaignSessions(
  campaignId: string,
  sessions: SessionNote[]
): Promise<void> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return;
  const rebuilt = rebuildCampaignLinks({ ...campaign, sessions });

  const { error } = await supabase
    .from('campaigns')
    .update({
      sessions,
      npcs: rebuilt.npcs,
      locations: rebuilt.locations,
      quests: rebuilt.quests,
      organizations: rebuilt.organizations,
    })
    .eq('id', campaignId)
    .is('deleted_at', null);

  if (error) {
    console.error('Error updating sessions:', error);
    throw error;
  }
}

function rebuildCampaignLinks(
  campaign: Campaign
): Pick<Campaign, 'npcs' | 'locations' | 'quests' | 'organizations'> {
  const sessions = campaign.sessions ?? [];
  const quests = campaign.quests ?? [];
  const npcs = campaign.npcs ?? [];
  const locations = campaign.locations ?? [];
  const organizations = campaign.organizations ?? [];

  const updatedNPCs = npcs.map(npc => {
    // Build session appearances from sessions that reference this NPC
    const sessionAppearances = sessions
      .filter(session =>
        session.npcsInvolved?.some(inv => inv.npcId === npc.id)
      )
      .map(session => {
        const involvement = session.npcsInvolved?.find(
          inv => inv.npcId === npc.id
        );
        return {
          sessionId: session.id,
          sessionNumber: session.sessionNumber,
          sessionTitle: session.title,
          role: involvement?.role ?? '',
          actionsTaken: involvement?.actionsTaken ?? '',
          notes: involvement?.notes ?? '',
          locationIds: involvement?.locationIds ?? [],
          questIds: involvement?.questIds ?? [],
        };
      });

    // Build quest appearances from quests that reference this NPC
    const questAppearances = quests
      .filter(quest => quest.npcsInvolved?.some(inv => inv.npcId === npc.id))
      .map(quest => {
        const involvement = quest.npcsInvolved?.find(
          inv => inv.npcId === npc.id
        );
        return {
          questId: quest.id,
          questTitle: quest.title,
          role: involvement?.role ?? '',
          actionsTaken: involvement?.actionsTaken ?? '',
          notes: involvement?.notes ?? '',
          locationIds: involvement?.locationIds ?? [],
          sessionIds: involvement?.sessionIds ?? [],
        };
      });

    return {
      ...npc,
      sessionAppearances,
      questAppearances,
    };
  });

  const updatedLocations = locations.map(location => {
    // Find NPCs linked to this location
    const npcIds = npcs
      .filter(npc => npc.locationIds?.includes(location.id))
      .map(npc => npc.id);

    // Find quests linked to this location
    const questIds = quests
      .filter(quest => quest.locationIds?.includes(location.id))
      .map(quest => quest.id);

    // Build session appearances
    const sessionAppearances = sessions
      .filter(session => session.locationIds?.includes(location.id))
      .map(session => ({
        sessionId: session.id,
        sessionNumber: session.sessionNumber,
        sessionTitle: session.title,
        notes: '',
      }));

    return {
      ...location,
      npcIds,
      questIds,
      sessionAppearances,
    };
  });

  const updatedQuests = quests.map(quest => {
    // Build session appearances
    const sessionAppearances = sessions
      .filter(session => session.questIds?.includes(quest.id))
      .map(session => ({
        sessionId: session.id,
        sessionNumber: session.sessionNumber,
        sessionTitle: session.title,
        notes: '',
      }));

    return {
      ...quest,
      sessionAppearances,
    };
  });

  const updatedOrganizations = organizations.map(org => {
    // Build sessionIds from sessions that reference this organization
    const sessionIds = sessions
      .filter(session => session.organizationIds?.includes(org.id))
      .map(session => session.id);

    return {
      ...org,
      sessionIds,
    };
  });

  return {
    npcs: updatedNPCs,
    locations: updatedLocations,
    quests: updatedQuests,
    organizations: updatedOrganizations,
  };
}

/**
 * Add a new session note to a campaign
 */
export async function addSession(
  campaignId: string,
  session: Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SessionNote | undefined> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return undefined;

  const now = new Date().toISOString();
  const newSession: SessionNote = {
    ...session,
    id: generateSessionId(),
    createdAt: now,
    updatedAt: now,
  };

  const sessions = [...(campaign.sessions ?? []), newSession];
  await updateCampaignSessions(campaignId, sessions);
  return newSession;
}

/**
 * Update a session note
 */
export async function updateSession(
  campaignId: string,
  sessionId: string,
  updates: Partial<Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<SessionNote | undefined> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return undefined;

  const sessions = campaign.sessions ?? [];
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  if (sessionIndex === -1) return undefined;

  const now = new Date().toISOString();
  sessions[sessionIndex] = {
    ...sessions[sessionIndex],
    ...updates,
    updatedAt: now,
  };

  await updateCampaignSessions(campaignId, sessions);
  return sessions[sessionIndex];
}

/**
 * Delete a session note
 */
export async function deleteSession(
  campaignId: string,
  sessionId: string
): Promise<boolean> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return false;

  const sessions = campaign.sessions ?? [];
  const filtered = sessions.filter(s => s.id !== sessionId);
  if (filtered.length === sessions.length) return false;

  await updateCampaignSessions(campaignId, filtered);
  return true;
}

// =====================================================================================
// Campaign NPCs CRUD
// =====================================================================================

function generateNpcId(): string {
  return `npc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Add a new NPC to a campaign
 */
export async function addNPC(
  campaignId: string,
  npc: Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CampaignNPC | undefined> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return undefined;

  const now = new Date().toISOString();
  const newNpc: CampaignNPC = {
    ...npc,
    id: generateNpcId(),
    createdAt: now,
    updatedAt: now,
  };

  const npcs = [...(campaign.npcs ?? []), newNpc];
  const rebuilt = rebuildCampaignLinks({ ...campaign, npcs });
  await supabase
    .from('campaigns')
    .update({
      npcs: rebuilt.npcs,
      locations: rebuilt.locations,
      quests: rebuilt.quests,
    })
    .eq('id', campaignId)
    .is('deleted_at', null);
  return newNpc;
}

/**
 * Update an NPC
 */
export async function updateNPC(
  campaignId: string,
  npcId: string,
  updates: Partial<Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<CampaignNPC | undefined> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return undefined;

  const npcs = campaign.npcs ?? [];
  const npcIndex = npcs.findIndex(n => n.id === npcId);
  if (npcIndex === -1) return undefined;

  const now = new Date().toISOString();
  npcs[npcIndex] = {
    ...npcs[npcIndex],
    ...updates,
    updatedAt: now,
  };

  const rebuilt = rebuildCampaignLinks({ ...campaign, npcs });
  await supabase
    .from('campaigns')
    .update({
      npcs: rebuilt.npcs,
      locations: rebuilt.locations,
      quests: rebuilt.quests,
    })
    .eq('id', campaignId)
    .is('deleted_at', null);
  return npcs[npcIndex];
}

/**
 * Delete an NPC
 */
export async function deleteNPC(
  campaignId: string,
  npcId: string
): Promise<boolean> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return false;

  const npcs = campaign.npcs ?? [];
  const filtered = npcs.filter(n => n.id !== npcId);
  if (filtered.length === npcs.length) return false;

  const rebuilt = rebuildCampaignLinks({ ...campaign, npcs: filtered });
  await supabase
    .from('campaigns')
    .update({
      npcs: rebuilt.npcs,
      locations: rebuilt.locations,
      quests: rebuilt.quests,
    })
    .eq('id', campaignId)
    .is('deleted_at', null);
  return true;
}

// =====================================================================================
// Location CRUD
// =====================================================================================

function generateLocationId(): string {
  return `location-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Add a new location to a campaign
 */
export async function addLocation(
  campaignId: string,
  location: Omit<CampaignLocation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CampaignLocation | undefined> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return undefined;

  const now = new Date().toISOString();
  const newLocation: CampaignLocation = {
    ...location,
    id: generateLocationId(),
    createdAt: now,
    updatedAt: now,
  };

  const locations = [...(campaign.locations ?? []), newLocation];
  const rebuilt = rebuildCampaignLinks({ ...campaign, locations });
  await supabase
    .from('campaigns')
    .update({
      npcs: rebuilt.npcs,
      locations: rebuilt.locations,
      quests: rebuilt.quests,
    })
    .eq('id', campaignId)
    .is('deleted_at', null);
  return newLocation;
}

/**
 * Update a location
 */
export async function updateLocation(
  campaignId: string,
  locationId: string,
  updates: Partial<Omit<CampaignLocation, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<CampaignLocation | undefined> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return undefined;

  const locations = campaign.locations ?? [];
  const locationIndex = locations.findIndex(l => l.id === locationId);
  if (locationIndex === -1) return undefined;

  const now = new Date().toISOString();
  locations[locationIndex] = {
    ...locations[locationIndex],
    ...updates,
    updatedAt: now,
  };

  const rebuilt = rebuildCampaignLinks({ ...campaign, locations });
  await supabase
    .from('campaigns')
    .update({
      npcs: rebuilt.npcs,
      locations: rebuilt.locations,
      quests: rebuilt.quests,
    })
    .eq('id', campaignId)
    .is('deleted_at', null);
  return locations[locationIndex];
}

/**
 * Delete a location
 */
export async function deleteLocation(
  campaignId: string,
  locationId: string
): Promise<boolean> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return false;

  const locations = campaign.locations ?? [];
  const filtered = locations.filter(l => l.id !== locationId);
  if (filtered.length === locations.length) return false;

  const rebuilt = rebuildCampaignLinks({ ...campaign, locations: filtered });
  await supabase
    .from('campaigns')
    .update({
      npcs: rebuilt.npcs,
      locations: rebuilt.locations,
      quests: rebuilt.quests,
    })
    .eq('id', campaignId)
    .is('deleted_at', null);
  return true;
}

// =====================================================================================
// Quest CRUD
// =====================================================================================

function generateQuestId(): string {
  return `quest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Add a new quest to a campaign
 */
export async function addQuest(
  campaignId: string,
  quest: Omit<CampaignQuest, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CampaignQuest | undefined> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return undefined;

  const now = new Date().toISOString();
  const newQuest: CampaignQuest = {
    ...quest,
    id: generateQuestId(),
    createdAt: now,
    updatedAt: now,
  };

  const quests = [...(campaign.quests ?? []), newQuest];
  const rebuilt = rebuildCampaignLinks({ ...campaign, quests });
  await supabase
    .from('campaigns')
    .update({
      npcs: rebuilt.npcs,
      locations: rebuilt.locations,
      quests: rebuilt.quests,
    })
    .eq('id', campaignId)
    .is('deleted_at', null);
  return newQuest;
}

/**
 * Update a quest
 */
export async function updateQuest(
  campaignId: string,
  questId: string,
  updates: Partial<Omit<CampaignQuest, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<CampaignQuest | undefined> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return undefined;

  const quests = campaign.quests ?? [];
  const questIndex = quests.findIndex(q => q.id === questId);
  if (questIndex === -1) return undefined;

  const now = new Date().toISOString();
  quests[questIndex] = {
    ...quests[questIndex],
    ...updates,
    updatedAt: now,
  };

  const rebuilt = rebuildCampaignLinks({ ...campaign, quests });
  await supabase
    .from('campaigns')
    .update({
      npcs: rebuilt.npcs,
      locations: rebuilt.locations,
      quests: rebuilt.quests,
    })
    .eq('id', campaignId)
    .is('deleted_at', null);
  return quests[questIndex];
}

/**
 * Delete a quest
 */
export async function deleteQuest(
  campaignId: string,
  questId: string
): Promise<boolean> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return false;

  const quests = campaign.quests ?? [];
  const filtered = quests.filter(q => q.id !== questId);
  if (filtered.length === quests.length) return false;

  const rebuilt = rebuildCampaignLinks({ ...campaign, quests: filtered });
  await supabase
    .from('campaigns')
    .update({
      npcs: rebuilt.npcs,
      locations: rebuilt.locations,
      quests: rebuilt.quests,
    })
    .eq('id', campaignId)
    .is('deleted_at', null);
  return true;
}

/**
 * Update a full campaign object (for saving all changes at once)
 */
export async function saveCampaign(
  campaign: Campaign
): Promise<Campaign | undefined> {
  const row = campaignToRow(campaign);

  const { data, error } = await supabase
    .from('campaigns')
    .update(row)
    .eq('id', campaign.id)
    .is('deleted_at', null)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error saving campaign:', error);
    throw error;
  }

  return rowToCampaign(data as CampaignRow);
}

// =====================================================================================
// Organization CRUD
// =====================================================================================

function generateOrganizationId(): string {
  return `org-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Add a new organization to a campaign
 */
export async function addOrganization(
  campaignId: string,
  organization: Omit<CampaignOrganization, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CampaignOrganization | undefined> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return undefined;

  const now = new Date().toISOString();
  const newOrganization: CampaignOrganization = {
    ...organization,
    id: generateOrganizationId(),
    createdAt: now,
    updatedAt: now,
  };

  const organizations = [...(campaign.organizations ?? []), newOrganization];
  await supabase
    .from('campaigns')
    .update({ organizations })
    .eq('id', campaignId)
    .is('deleted_at', null);
  return newOrganization;
}

/**
 * Update an organization
 */
export async function updateOrganization(
  campaignId: string,
  organizationId: string,
  updates: Partial<Omit<CampaignOrganization, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<CampaignOrganization | undefined> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return undefined;

  const organizations = campaign.organizations ?? [];
  const organizationIndex = organizations.findIndex(
    o => o.id === organizationId
  );
  if (organizationIndex === -1) return undefined;

  const now = new Date().toISOString();
  organizations[organizationIndex] = {
    ...organizations[organizationIndex],
    ...updates,
    updatedAt: now,
  };

  await supabase
    .from('campaigns')
    .update({ organizations })
    .eq('id', campaignId)
    .is('deleted_at', null);
  return organizations[organizationIndex];
}

/**
 * Delete an organization
 */
export async function deleteOrganization(
  campaignId: string,
  organizationId: string
): Promise<boolean> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return false;

  const organizations = campaign.organizations ?? [];
  const filtered = organizations.filter(o => o.id !== organizationId);
  if (filtered.length === organizations.length) return false;

  await supabase
    .from('campaigns')
    .update({ organizations: filtered })
    .eq('id', campaignId)
    .is('deleted_at', null);
  return true;
}

// =====================================================================================
// Battle CRUD operations
// =====================================================================================

function generateBattleId(): string {
  return `battle-${crypto.randomUUID()}`;
}

/**
 * Update the battles array for a campaign
 */
async function updateCampaignBattles(
  campaignId: string,
  battles: BattleState[]
): Promise<void> {
  const { error } = await supabase
    .from('campaigns')
    .update({ battles, updated_at: new Date().toISOString() })
    .eq('id', campaignId)
    .is('deleted_at', null);

  if (error) {
    console.error('Error updating campaign battles:', error);
    throw error;
  }
}

/**
 * Get all battles for a campaign
 */
export async function getCampaignBattles(
  campaignId: string
): Promise<BattleState[]> {
  const campaign = await getCampaign(campaignId);
  return campaign?.battles ?? [];
}

/**
 * Get a single battle by ID
 */
export async function getBattle(
  campaignId: string,
  battleId: string
): Promise<BattleState | undefined> {
  const battles = await getCampaignBattles(campaignId);
  return battles.find(b => b.id === battleId);
}

/**
 * Create a new battle in a campaign
 */
export async function createBattle(
  campaignId: string,
  battle: Omit<BattleState, 'id' | 'campaignId' | 'createdAt' | 'updatedAt'>
): Promise<BattleState> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

  const now = new Date().toISOString();
  const newBattle: BattleState = {
    ...battle,
    id: generateBattleId(),
    campaignId,
    createdAt: now,
    updatedAt: now,
  };

  const battles = [...(campaign.battles ?? []), newBattle];
  await updateCampaignBattles(campaignId, battles);
  return newBattle;
}

/**
 * Update an existing battle
 */
export async function updateBattle(
  campaignId: string,
  battleId: string,
  updates: Partial<Omit<BattleState, 'id' | 'campaignId' | 'createdAt'>>
): Promise<BattleState | undefined> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return undefined;

  const battles = campaign.battles ?? [];
  const battleIndex = battles.findIndex(b => b.id === battleId);
  if (battleIndex === -1) return undefined;

  const now = new Date().toISOString();
  battles[battleIndex] = {
    ...battles[battleIndex],
    ...updates,
    updatedAt: now,
  };

  await updateCampaignBattles(campaignId, battles);
  return battles[battleIndex];
}

/**
 * Delete a battle
 */
export async function deleteBattle(
  campaignId: string,
  battleId: string
): Promise<boolean> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) return false;

  const battles = campaign.battles ?? [];
  const filtered = battles.filter(b => b.id !== battleId);
  if (filtered.length === battles.length) return false;

  await updateCampaignBattles(campaignId, filtered);
  return true;
}

// =====================================================================================
// Standalone Battle Tracker CRUD (non-campaign)
// =====================================================================================

export interface StandaloneBattleSummary {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export async function listStandaloneBattles(): Promise<
  StandaloneBattleSummary[]
> {
  const { data, error } = await supabase
    .from('standalone_battles')
    .select('id,name,created_at,updated_at')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error listing standalone battles:', error);
    throw error;
  }

  return (data ?? []).map(row => ({
    id: row.id as string,
    name: row.name as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

export async function getStandaloneBattle(
  battleId: string
): Promise<BattleState | undefined> {
  const { data, error } = await supabase
    .from('standalone_battles')
    .select('id,name,state,created_at,updated_at')
    .eq('id', battleId)
    .is('deleted_at', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error fetching standalone battle:', error);
    throw error;
  }

  const rawState = (data as StandaloneBattleRow).state ?? {};
  const parsed = BattleStateSchema.safeParse(rawState);
  if (!parsed.success) {
    console.error('Failed to parse standalone battle state:', parsed.error);
    return undefined;
  }

  return {
    ...parsed.data,
    id: data.id as string,
    name: data.name as string,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}

export async function createStandaloneBattle(
  battle: Omit<BattleState, 'id' | 'createdAt' | 'updatedAt'>
): Promise<BattleState> {
  const now = new Date().toISOString();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    throw new Error('Must be logged in to create a battle');
  }

  const newBattle: BattleState = {
    ...battle,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  const { data, error } = await supabase
    .from('standalone_battles')
    .insert({
      owner_id: authData.user.id,
      name: newBattle.name,
      state: newBattle,
    })
    .select('id,name,state,created_at,updated_at')
    .single();

  if (error) {
    console.error('Error creating standalone battle:', error);
    throw error;
  }

  return {
    ...newBattle,
    id: data.id as string,
    name: data.name as string,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}

export async function updateStandaloneBattle(
  battleId: string,
  updates: BattleState
): Promise<BattleState | undefined> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('standalone_battles')
    .update({
      name: updates.name,
      state: { ...updates, updatedAt: now },
    })
    .eq('id', battleId)
    .is('deleted_at', null)
    .select('id,name,state,created_at,updated_at')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error updating standalone battle:', error);
    throw error;
  }

  const rawState = (data as StandaloneBattleRow).state ?? {};
  const parsed = BattleStateSchema.safeParse(rawState);
  if (!parsed.success) {
    console.error('Failed to parse standalone battle state:', parsed.error);
    return undefined;
  }

  return {
    ...parsed.data,
    id: data.id as string,
    name: data.name as string,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}

export async function deleteStandaloneBattle(
  battleId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('standalone_battles')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', battleId)
    .is('deleted_at', null);

  if (error) {
    console.error('Error deleting standalone battle:', error);
    throw error;
  }

  return true;
}
