// CRUD operations for standalone scheduling polls (Supabase table: scheduling_polls)

import {
  type PollVoteValue,
  type SchedulingPoll,
  SchedulingPollSchema,
} from '@/lib/schemas/scheduling';
import { supabase } from '@/lib/supabase';
import { generateId } from '@/lib/utils';

// =====================================================================================
// Row ↔ Domain mapping
// =====================================================================================

interface SchedulingPollRow {
  id: string;
  gm_id: string;
  campaign_id: string | null;
  title: string;
  description: string;
  status: string;
  slots: unknown;
  quorum: number;
  confirmed_slot_id: string | null;
  share_code: string;
  created_at: string;
  updated_at: string;
}

function rowToPoll(row: SchedulingPollRow): SchedulingPoll {
  return SchedulingPollSchema.parse({
    id: row.id,
    gmId: row.gm_id,
    campaignId: row.campaign_id ?? undefined,
    title: row.title,
    description: row.description,
    status: row.status,
    slots: row.slots,
    quorum: row.quorum,
    confirmedSlotId: row.confirmed_slot_id ?? undefined,
    shareCode: row.share_code,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  });
}

// =====================================================================================
// Queries
// =====================================================================================

/** List all polls owned by the current GM, newest first */
export async function listSchedulingPolls(): Promise<SchedulingPoll[]> {
  const { data, error } = await supabase
    .from('scheduling_polls')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to list scheduling polls:', error);
    throw error;
  }

  return (data as SchedulingPollRow[]).map(rowToPoll);
}

/** Get a single poll by ID (GM-only via RLS) */
export async function getSchedulingPoll(
  id: string
): Promise<SchedulingPoll | undefined> {
  const { data, error } = await supabase
    .from('scheduling_polls')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined; // not found
    console.error('Failed to get scheduling poll:', error);
    throw error;
  }

  return rowToPoll(data as SchedulingPollRow);
}

/** Get a poll by its share code (accessible to any authenticated user) */
export async function getSchedulingPollByShareCode(
  shareCode: string
): Promise<SchedulingPoll | undefined> {
  const { data, error } = await supabase
    .from('scheduling_polls')
    .select('*')
    .eq('share_code', shareCode)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Failed to get scheduling poll by share code:', error);
    throw error;
  }

  return rowToPoll(data as SchedulingPollRow);
}

// =====================================================================================
// Mutations (GM-only)
// =====================================================================================

export interface CreatePollInput {
  title: string;
  description?: string;
  quorum?: number;
  campaignId?: string;
  slots: Array<{ startTime: string; endTime: string; label?: string }>;
}

/** Create a new scheduling poll. Returns the created poll with its share code. */
export async function createSchedulingPoll(
  input: CreatePollInput
): Promise<SchedulingPoll> {
  const slotsJson = input.slots.map(s => ({
    id: generateId(),
    startTime: s.startTime,
    endTime: s.endTime,
    label: s.label ?? '',
    votes: [],
  }));

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('scheduling_polls')
    .insert({
      gm_id: user.id,
      title: input.title,
      description: input.description ?? '',
      quorum: input.quorum ?? 1,
      campaign_id: input.campaignId ?? null,
      slots: slotsJson,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Failed to create scheduling poll:', error);
    throw error;
  }

  return rowToPoll(data as SchedulingPollRow);
}

/** Update a poll's status, confirmed slot, or metadata */
export async function updateSchedulingPoll(
  id: string,
  updates: Partial<
    Pick<
      SchedulingPoll,
      'status' | 'confirmedSlotId' | 'title' | 'description' | 'quorum'
    >
  >
): Promise<SchedulingPoll | undefined> {
  const row: Record<string, unknown> = {};
  if (updates.status !== undefined) row.status = updates.status;
  if (updates.confirmedSlotId !== undefined)
    row.confirmed_slot_id = updates.confirmedSlotId;
  if (updates.title !== undefined) row.title = updates.title;
  if (updates.description !== undefined) row.description = updates.description;
  if (updates.quorum !== undefined) row.quorum = updates.quorum;

  const { data, error } = await supabase
    .from('scheduling_polls')
    .update(row)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Failed to update scheduling poll:', error);
    throw error;
  }

  return rowToPoll(data as SchedulingPollRow);
}

/** Delete a poll */
export async function deleteSchedulingPoll(id: string): Promise<void> {
  const { error } = await supabase
    .from('scheduling_polls')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete scheduling poll:', error);
    throw error;
  }
}

// =====================================================================================
// Player voting (via RPC)
// =====================================================================================

export interface SchedulingVoteInput {
  slotId: string;
  value: PollVoteValue;
}

/** Submit votes on a poll using its share code (any authenticated user) */
export async function submitSchedulingVote(
  shareCode: string,
  playerName: string,
  votes: SchedulingVoteInput[]
): Promise<void> {
  const { error } = await supabase.rpc('submit_scheduling_vote', {
    p_share_code: shareCode,
    p_player_name: playerName,
    p_votes: votes,
  });

  if (error) {
    console.error('Error submitting scheduling vote:', error);
    throw error;
  }
}
