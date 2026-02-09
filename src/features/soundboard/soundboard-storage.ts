// CRUD operations for soundboard tracks and presets (Supabase tables)

import { getAuthenticatedUser } from '@/lib/auth';
import {
  type SoundboardPreset,
  SoundboardPresetSchema,
  type SoundboardTrack,
  SoundboardTrackSchema,
  type TrackCategory,
  type TrackSource,
} from '@/lib/schemas/soundboard';
import { supabase } from '@/lib/supabase';

// =====================================================================================
// Row ↔ Domain mapping — Tracks
// =====================================================================================

interface TrackRow {
  id: string;
  gm_id: string;
  campaign_id: string | null;
  name: string;
  url: string;
  source: string;
  category: string;
  tags: unknown;
  volume: number;
  loop: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function rowToTrack(row: TrackRow): SoundboardTrack {
  return SoundboardTrackSchema.parse({
    id: row.id,
    gmId: row.gm_id,
    campaignId: row.campaign_id ?? undefined,
    name: row.name,
    url: row.url,
    source: row.source,
    category: row.category,
    tags: row.tags,
    volume: Number(row.volume),
    loop: row.loop,
    sortOrder: row.sort_order,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  });
}

// =====================================================================================
// Row ↔ Domain mapping — Presets
// =====================================================================================

interface PresetRow {
  id: string;
  gm_id: string;
  campaign_id: string | null;
  name: string;
  description: string;
  tracks: unknown;
  created_at: string;
  updated_at: string;
}

function rowToPreset(row: PresetRow): SoundboardPreset {
  return SoundboardPresetSchema.parse({
    id: row.id,
    gmId: row.gm_id,
    campaignId: row.campaign_id ?? undefined,
    name: row.name,
    description: row.description,
    tracks: row.tracks,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  });
}

// =====================================================================================
// Track CRUD
// =====================================================================================

export interface CreateTrackInput {
  name: string;
  url: string;
  source: TrackSource;
  category: TrackCategory;
  campaignId?: string;
  tags?: string[];
  volume?: number;
  loop?: boolean;
}

export async function listSoundboardTracks(
  campaignId?: string
): Promise<SoundboardTrack[]> {
  let query = supabase
    .from('soundboard_tracks')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (campaignId) {
    query = query.eq('campaign_id', campaignId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Failed to list soundboard tracks:', error);
    throw error;
  }

  return (data as TrackRow[]).map(rowToTrack);
}

export async function createSoundboardTrack(
  input: CreateTrackInput
): Promise<SoundboardTrack> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from('soundboard_tracks')
    .insert({
      gm_id: user.id,
      name: input.name,
      url: input.url,
      source: input.source,
      category: input.category,
      campaign_id: input.campaignId ?? null,
      tags: input.tags ?? [],
      volume: input.volume ?? 0.5,
      loop: input.loop ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create soundboard track:', error);
    throw error;
  }

  return rowToTrack(data as TrackRow);
}

export async function updateSoundboardTrack(
  id: string,
  updates: Partial<
    Pick<
      SoundboardTrack,
      | 'name'
      | 'url'
      | 'source'
      | 'category'
      | 'tags'
      | 'volume'
      | 'loop'
      | 'sortOrder'
    >
  >
): Promise<SoundboardTrack> {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) row.name = updates.name;
  if (updates.url !== undefined) row.url = updates.url;
  if (updates.source !== undefined) row.source = updates.source;
  if (updates.category !== undefined) row.category = updates.category;
  if (updates.tags !== undefined) row.tags = updates.tags;
  if (updates.volume !== undefined) row.volume = updates.volume;
  if (updates.loop !== undefined) row.loop = updates.loop;
  if (updates.sortOrder !== undefined) row.sort_order = updates.sortOrder;

  const { data, error } = await supabase
    .from('soundboard_tracks')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update soundboard track:', error);
    throw error;
  }

  return rowToTrack(data as TrackRow);
}

export async function deleteSoundboardTrack(id: string): Promise<void> {
  const { error } = await supabase
    .from('soundboard_tracks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete soundboard track:', error);
    throw error;
  }
}

// =====================================================================================
// Preset CRUD
// =====================================================================================

export interface CreatePresetInput {
  name: string;
  description?: string;
  campaignId?: string;
  tracks: Array<{ trackId: string; volume: number; loop?: boolean }>;
}

export async function listSoundboardPresets(
  campaignId?: string
): Promise<SoundboardPreset[]> {
  let query = supabase
    .from('soundboard_presets')
    .select('*')
    .order('created_at', { ascending: false });

  if (campaignId) {
    query = query.eq('campaign_id', campaignId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Failed to list soundboard presets:', error);
    throw error;
  }

  return (data as PresetRow[]).map(rowToPreset);
}

export async function createSoundboardPreset(
  input: CreatePresetInput
): Promise<SoundboardPreset> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from('soundboard_presets')
    .insert({
      gm_id: user.id,
      name: input.name,
      description: input.description ?? '',
      campaign_id: input.campaignId ?? null,
      tracks: input.tracks,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create soundboard preset:', error);
    throw error;
  }

  return rowToPreset(data as PresetRow);
}

export async function updateSoundboardPreset(
  id: string,
  updates: Partial<Pick<SoundboardPreset, 'name' | 'description' | 'tracks'>>
): Promise<SoundboardPreset> {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) row.name = updates.name;
  if (updates.description !== undefined) row.description = updates.description;
  if (updates.tracks !== undefined) row.tracks = updates.tracks;

  const { data, error } = await supabase
    .from('soundboard_presets')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update soundboard preset:', error);
    throw error;
  }

  return rowToPreset(data as PresetRow);
}

export async function deleteSoundboardPreset(id: string): Promise<void> {
  const { error } = await supabase
    .from('soundboard_presets')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete soundboard preset:', error);
    throw error;
  }
}
