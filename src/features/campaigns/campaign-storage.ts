// Storage layer with cohesive CRUD operations for campaigns - splitting would fragment the API

import { z } from 'zod';

import { createCampaignFrameFromTemplate } from '@/lib/data/campaign-frames';
import type {
  BattleState,
  Campaign,
  CampaignFrame,
  CampaignLocation,
  CampaignNPC,
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

function campaignToRow(
  campaign: Partial<Campaign> & { gmId?: string }
): Partial<CampaignRow> {
  const row: Partial<CampaignRow> = {};

  if (campaign.name !== undefined) row.name = campaign.name;
  if (campaign.frame !== undefined) row.frame = campaign.frame;
  if (campaign.gmId !== undefined) row.gm_id = campaign.gmId;
  if (campaign.players !== undefined) row.players = campaign.players;
  if (campaign.sessions !== undefined) row.sessions = campaign.sessions;
  if (campaign.npcs !== undefined) row.npcs = campaign.npcs;
  if (campaign.locations !== undefined) row.locations = campaign.locations;
  if (campaign.quests !== undefined) row.quests = campaign.quests;
  if (campaign.storyThreads !== undefined)
    row.story_threads = campaign.storyThreads;
  if (campaign.battles !== undefined) row.battles = campaign.battles;
  if (campaign.sessionPrepChecklist !== undefined)
    row.session_prep_checklist = campaign.sessionPrepChecklist;
  if (campaign.inviteCode !== undefined) row.invite_code = campaign.inviteCode;
  if (campaign.status !== undefined) row.status = campaign.status;
  if (campaign.notes !== undefined) row.notes = campaign.notes;

  return row;
}

/**
 * Generate a short invite code
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(
    { length: 6 },
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
  const { error } = await supabase
    .from('campaigns')
    .update({ sessions })
    .eq('id', campaignId)
    .is('deleted_at', null);

  if (error) {
    console.error('Error updating sessions:', error);
    throw error;
  }
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

async function updateCampaignNpcs(
  campaignId: string,
  npcs: CampaignNPC[]
): Promise<void> {
  const { error } = await supabase
    .from('campaigns')
    .update({ npcs })
    .eq('id', campaignId)
    .is('deleted_at', null);

  if (error) {
    console.error('Error updating npcs:', error);
    throw error;
  }
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
  await updateCampaignNpcs(campaignId, npcs);
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

  await updateCampaignNpcs(campaignId, npcs);
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

  await updateCampaignNpcs(campaignId, filtered);
  return true;
}

// =====================================================================================
// Location CRUD
// =====================================================================================

function generateLocationId(): string {
  return `location-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function updateCampaignLocations(
  campaignId: string,
  locations: CampaignLocation[]
): Promise<void> {
  const { error } = await supabase
    .from('campaigns')
    .update({ locations })
    .eq('id', campaignId)
    .is('deleted_at', null);

  if (error) {
    console.error('Error updating locations:', error);
    throw error;
  }
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
  await updateCampaignLocations(campaignId, locations);
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

  await updateCampaignLocations(campaignId, locations);
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

  await updateCampaignLocations(campaignId, filtered);
  return true;
}

// =====================================================================================
// Quest CRUD
// =====================================================================================

function generateQuestId(): string {
  return `quest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function updateCampaignQuests(
  campaignId: string,
  quests: CampaignQuest[]
): Promise<void> {
  const { error } = await supabase
    .from('campaigns')
    .update({ quests })
    .eq('id', campaignId)
    .is('deleted_at', null);

  if (error) {
    console.error('Error updating quests:', error);
    throw error;
  }
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
  await updateCampaignQuests(campaignId, quests);
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

  await updateCampaignQuests(campaignId, quests);
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

  await updateCampaignQuests(campaignId, filtered);
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
