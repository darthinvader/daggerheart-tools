/**
 * Local storage for campaigns using idb-keyval.
 * This is a demo implementation - production would use Supabase.
 */
import { idb } from '@/features/persistence/idb';
import { createCampaignFrameFromTemplate } from '@/lib/data/campaign-frames';
import type {
  Campaign,
  CampaignFrame,
  CampaignNPC,
  SessionNote,
} from '@/lib/schemas/campaign';

const CAMPAIGNS_KEY = 'gm-campaigns';

interface CampaignStorageData {
  campaigns: Campaign[];
}

async function getStorageData(): Promise<CampaignStorageData> {
  const data = await idb.get<CampaignStorageData>(CAMPAIGNS_KEY);
  return data ?? { campaigns: [] };
}

async function setStorageData(data: CampaignStorageData): Promise<void> {
  await idb.set(CAMPAIGNS_KEY, data);
}

/**
 * Generate a unique ID for campaigns
 */
export function generateCampaignId(): string {
  return `campaign-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Generate a short invite code
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * List all campaigns
 */
export async function listCampaigns(): Promise<Campaign[]> {
  const data = await getStorageData();
  return data.campaigns.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * Get a campaign by ID
 */
export async function getCampaign(id: string): Promise<Campaign | undefined> {
  const data = await getStorageData();
  return data.campaigns.find(c => c.id === id);
}

/**
 * Create a new campaign from a template
 */
export async function createCampaign(
  templateId: string,
  name?: string
): Promise<Campaign> {
  const id = generateCampaignId();
  const frame = createCampaignFrameFromTemplate(templateId, id);

  if (!frame) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const campaign: Campaign = {
    id,
    name: name ?? frame.name,
    frame,
    gmId: 'local-gm', // Demo: no real user auth
    players: [],
    inviteCode: generateInviteCode(),
    status: 'draft',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const data = await getStorageData();
  data.campaigns.push(campaign);
  await setStorageData(data);

  return campaign;
}

/**
 * Update a campaign
 */
export async function updateCampaign(
  id: string,
  updates: Partial<Pick<Campaign, 'name' | 'status' | 'notes' | 'players'>>
): Promise<Campaign | undefined> {
  const data = await getStorageData();
  const index = data.campaigns.findIndex(c => c.id === id);
  if (index === -1) return undefined;

  data.campaigns[index] = {
    ...data.campaigns[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await setStorageData(data);
  return data.campaigns[index];
}

/**
 * Update a campaign's frame
 */
export async function updateCampaignFrame(
  id: string,
  frame: CampaignFrame
): Promise<Campaign | undefined> {
  const data = await getStorageData();
  const index = data.campaigns.findIndex(c => c.id === id);
  if (index === -1) return undefined;

  data.campaigns[index] = {
    ...data.campaigns[index],
    frame: {
      ...frame,
      updatedAt: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  };

  await setStorageData(data);
  return data.campaigns[index];
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(id: string): Promise<boolean> {
  const data = await getStorageData();
  const index = data.campaigns.findIndex(c => c.id === id);
  if (index === -1) return false;

  data.campaigns.splice(index, 1);
  await setStorageData(data);
  return true;
}

// =====================================================================================
// Session Notes CRUD
// =====================================================================================

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Add a new session note to a campaign
 */
export async function addSession(
  campaignId: string,
  session: Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SessionNote | undefined> {
  const data = await getStorageData();
  const index = data.campaigns.findIndex(c => c.id === campaignId);
  if (index === -1) return undefined;

  const now = new Date().toISOString();
  const newSession: SessionNote = {
    ...session,
    id: generateSessionId(),
    createdAt: now,
    updatedAt: now,
  };

  if (!data.campaigns[index].sessions) {
    data.campaigns[index].sessions = [];
  }
  data.campaigns[index].sessions.push(newSession);
  data.campaigns[index].updatedAt = now;

  await setStorageData(data);
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
  const data = await getStorageData();
  const campaignIndex = data.campaigns.findIndex(c => c.id === campaignId);
  if (campaignIndex === -1) return undefined;

  const sessions = data.campaigns[campaignIndex].sessions ?? [];
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  if (sessionIndex === -1) return undefined;

  const now = new Date().toISOString();
  sessions[sessionIndex] = {
    ...sessions[sessionIndex],
    ...updates,
    updatedAt: now,
  };
  data.campaigns[campaignIndex].sessions = sessions;
  data.campaigns[campaignIndex].updatedAt = now;

  await setStorageData(data);
  return sessions[sessionIndex];
}

/**
 * Delete a session note
 */
export async function deleteSession(
  campaignId: string,
  sessionId: string
): Promise<boolean> {
  const data = await getStorageData();
  const campaignIndex = data.campaigns.findIndex(c => c.id === campaignId);
  if (campaignIndex === -1) return false;

  const sessions = data.campaigns[campaignIndex].sessions ?? [];
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  if (sessionIndex === -1) return false;

  sessions.splice(sessionIndex, 1);
  data.campaigns[campaignIndex].sessions = sessions;
  data.campaigns[campaignIndex].updatedAt = new Date().toISOString();

  await setStorageData(data);
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
  const data = await getStorageData();
  const index = data.campaigns.findIndex(c => c.id === campaignId);
  if (index === -1) return undefined;

  const now = new Date().toISOString();
  const newNpc: CampaignNPC = {
    ...npc,
    id: generateNpcId(),
    createdAt: now,
    updatedAt: now,
  };

  if (!data.campaigns[index].npcs) {
    data.campaigns[index].npcs = [];
  }
  data.campaigns[index].npcs.push(newNpc);
  data.campaigns[index].updatedAt = now;

  await setStorageData(data);
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
  const data = await getStorageData();
  const campaignIndex = data.campaigns.findIndex(c => c.id === campaignId);
  if (campaignIndex === -1) return undefined;

  const npcs = data.campaigns[campaignIndex].npcs ?? [];
  const npcIndex = npcs.findIndex(n => n.id === npcId);
  if (npcIndex === -1) return undefined;

  const now = new Date().toISOString();
  npcs[npcIndex] = {
    ...npcs[npcIndex],
    ...updates,
    updatedAt: now,
  };
  data.campaigns[campaignIndex].npcs = npcs;
  data.campaigns[campaignIndex].updatedAt = now;

  await setStorageData(data);
  return npcs[npcIndex];
}

/**
 * Delete an NPC
 */
export async function deleteNPC(
  campaignId: string,
  npcId: string
): Promise<boolean> {
  const data = await getStorageData();
  const campaignIndex = data.campaigns.findIndex(c => c.id === campaignId);
  if (campaignIndex === -1) return false;

  const npcs = data.campaigns[campaignIndex].npcs ?? [];
  const npcIndex = npcs.findIndex(n => n.id === npcId);
  if (npcIndex === -1) return false;

  npcs.splice(npcIndex, 1);
  data.campaigns[campaignIndex].npcs = npcs;
  data.campaigns[campaignIndex].updatedAt = new Date().toISOString();

  await setStorageData(data);
  return true;
}
