/**
 * Homebrew Content Storage Layer
 *
 * Provides CRUD operations for homebrew content using Supabase.
 * Handles visibility, campaign linking, and forking functionality.
 */

import type {
  HomebrewCollection,
  HomebrewCollectionItem,
  HomebrewComment,
  HomebrewContent,
  HomebrewContentRow,
  HomebrewContentType,
  HomebrewVisibility,
} from '@/lib/schemas/homebrew';
import { rowToHomebrewContent } from '@/lib/schemas/homebrew';
import { supabase } from '@/lib/supabase';

// =====================================================================================
// Types
// =====================================================================================

export interface ListHomebrewOptions {
  /** Filter by content type */
  contentType?: HomebrewContentType;
  /** Filter by visibility */
  visibility?: HomebrewVisibility;
  /** Filter by campaign ID */
  campaignId?: string;
  /** Search by name */
  search?: string;
  /** Filter by tags */
  tags?: string[];
  /** Sort field */
  sortBy?:
    | 'name'
    | 'created_at'
    | 'updated_at'
    | 'fork_count'
    | 'view_count'
    | 'star_count';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Pagination limit */
  limit?: number;
  /** Pagination offset */
  offset?: number;
}

export interface HomebrewListResult {
  items: HomebrewContent[];
  total: number;
  hasMore: boolean;
}

// =====================================================================================
// CRUD Operations
// =====================================================================================

/**
 * Create a new homebrew content item
 */
export interface CreateHomebrewContentInput {
  contentType: HomebrewContentType;
  content: HomebrewContent['content'];
  name: string;
  description?: string;
  visibility?: HomebrewVisibility;
  tags?: string[];
  campaignLinks?: string[];
  forkedFrom?: string | null;
}

export async function createHomebrewContent(
  content: CreateHomebrewContentInput
): Promise<HomebrewContent> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Must be logged in to create homebrew content');
  }

  const row: Partial<HomebrewContentRow> = {
    content_type: content.contentType,
    owner_id: user.id,
    visibility: content.visibility ?? 'private',
    name: content.name ?? 'Untitled',
    description: content.description ?? '',
    content: (content.content ?? {}) as Record<string, unknown>,
    tags: content.tags ?? [],
    forked_from: content.forkedFrom ?? null,
    campaign_links: content.campaignLinks ?? [],
  };

  const { data, error } = await supabase
    .from('homebrew_content')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('Error creating homebrew content:', error);
    throw error;
  }

  return rowToHomebrewContent(data as HomebrewContentRow);
}

/**
 * Get a single homebrew content item by ID
 */
export async function getHomebrewContent(
  id: string
): Promise<HomebrewContent | undefined> {
  const { data, error } = await supabase
    .from('homebrew_content')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error getting homebrew content:', error);
    throw error;
  }

  // Increment view count for public content
  if (data && data.visibility === 'public') {
    await supabase.rpc('increment_homebrew_view', { homebrew_id: id });
  }

  return rowToHomebrewContent(data as HomebrewContentRow);
}

/**
 * Update an existing homebrew content item
 */
export async function updateHomebrewContent(
  id: string,
  updates: Partial<
    Omit<
      HomebrewContent,
      'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >
  >
): Promise<HomebrewContent | undefined> {
  const row: Partial<HomebrewContentRow> = {};

  if (updates.contentType) row.content_type = updates.contentType;
  if (updates.visibility) row.visibility = updates.visibility;
  if (updates.name) row.name = updates.name;
  if (updates.description !== undefined) row.description = updates.description;
  if (updates.content) row.content = updates.content as Record<string, unknown>;
  if (updates.tags) row.tags = updates.tags;
  if (updates.campaignLinks) row.campaign_links = updates.campaignLinks;

  const { data, error } = await supabase
    .from('homebrew_content')
    .update(row)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error('Error updating homebrew content:', error);
    throw error;
  }

  return rowToHomebrewContent(data as HomebrewContentRow);
}

/**
 * Soft delete a homebrew content item
 */
export async function deleteHomebrewContent(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('homebrew_content')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null);

  if (error) {
    console.error('Error deleting homebrew content:', error);
    throw error;
  }

  return true;
}

/**
 * Permanently delete a homebrew content item
 */
export async function permanentlyDeleteHomebrewContent(
  id: string
): Promise<boolean> {
  const { error } = await supabase
    .from('homebrew_content')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error permanently deleting homebrew content:', error);
    throw error;
  }

  return true;
}

// =====================================================================================
// List Operations
// =====================================================================================

/**
 * List homebrew content for the current user
 */
export async function listMyHomebrewContent(
  options: ListHomebrewOptions = {}
): Promise<HomebrewListResult> {
  const {
    contentType,
    search,
    tags,
    sortBy = 'updated_at',
    sortOrder = 'desc',
    limit = 50,
    offset = 0,
  } = options;

  let query = supabase
    .from('homebrew_content')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1);

  // Owner filter is handled by RLS, but we need to match our own content
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    query = query.eq('owner_id', user.id);
  }

  if (contentType) {
    query = query.eq('content_type', contentType);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (tags && tags.length > 0) {
    query = query.contains('tags', tags);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error listing my homebrew content:', error);
    throw error;
  }

  const items = (data as HomebrewContentRow[]).map(rowToHomebrewContent);
  const total = count ?? 0;

  return {
    items,
    total,
    hasMore: offset + items.length < total,
  };
}

/**
 * List homebrew content starred by the current user
 */
export async function listStarredHomebrewContent(): Promise<HomebrewListResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { items: [], total: 0, hasMore: false };
  }

  const { data, error } = await supabase
    .from('homebrew_stars')
    .select('homebrew_content(*)')
    .eq('user_id', user.id)
    .returns<Array<{ homebrew_content: HomebrewContentRow | null }>>();

  if (error) {
    console.error('Error listing starred homebrew content:', error);
    throw error;
  }

  const rows = data ?? [];
  const items = rows
    .map(row => row.homebrew_content)
    .filter((row): row is HomebrewContentRow => row !== null)
    .map(rowToHomebrewContent);

  return {
    items,
    total: items.length,
    hasMore: false,
  };
}

/**
 * List public homebrew content
 */
export async function listPublicHomebrewContent(
  options: ListHomebrewOptions = {}
): Promise<HomebrewListResult> {
  const {
    contentType,
    search,
    tags,
    sortBy = 'fork_count',
    sortOrder = 'desc',
    limit = 50,
    offset = 0,
  } = options;

  let query = supabase
    .from('homebrew_content')
    .select('*', { count: 'exact' })
    .eq('visibility', 'public')
    .is('deleted_at', null)
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1);

  if (contentType) {
    query = query.eq('content_type', contentType);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (tags && tags.length > 0) {
    query = query.contains('tags', tags);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error listing public homebrew content:', error);
    throw error;
  }

  const items = (data as HomebrewContentRow[]).map(rowToHomebrewContent);
  const total = count ?? 0;

  return {
    items,
    total,
    hasMore: offset + items.length < total,
  };
}

/**
 * List homebrew content linked to a campaign
 */
export async function listCampaignHomebrewContent(
  campaignId: string,
  options: ListHomebrewOptions = {}
): Promise<HomebrewListResult> {
  const {
    contentType,
    search,
    tags,
    sortBy = 'name',
    sortOrder = 'asc',
    limit = 50,
    offset = 0,
  } = options;

  // Use the RPC function for proper access control
  const { data, error } = await supabase.rpc('get_campaign_homebrew', {
    p_campaign_id: campaignId,
  });

  if (error) {
    console.error('Error listing campaign homebrew content:', error);
    throw error;
  }

  let items = (data as HomebrewContentRow[]).map(rowToHomebrewContent);

  // Apply client-side filters
  if (contentType) {
    items = items.filter(item => item.contentType === contentType);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    items = items.filter(item => item.name.toLowerCase().includes(searchLower));
  }

  if (tags && tags.length > 0) {
    items = items.filter(item => tags.every(tag => item.tags.includes(tag)));
  }

  // Sort
  items.sort((a, b) => {
    const aVal = a[sortBy as keyof HomebrewContent];
    const bVal = b[sortBy as keyof HomebrewContent];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const total = items.length;
  const paginatedItems = items.slice(offset, offset + limit);

  return {
    items: paginatedItems,
    total,
    hasMore: offset + paginatedItems.length < total,
  };
}

// =====================================================================================
// Fork & Link Operations
// =====================================================================================

/**
 * Fork homebrew content (create a copy for the current user)
 */
export async function forkHomebrewContent(
  sourceId: string
): Promise<HomebrewContent> {
  const { data, error } = await supabase.rpc('fork_homebrew_content', {
    source_id: sourceId,
  });

  if (error) {
    console.error('Error forking homebrew content:', error);
    throw error;
  }

  // Fetch the new content
  const forked = await getHomebrewContent(data as string);
  if (!forked) {
    throw new Error('Failed to fetch forked content');
  }

  return forked;
}

/**
 * Link homebrew content to a campaign
 */
export async function linkHomebrewToCampaign(
  homebrewId: string,
  campaignId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('link_homebrew_to_campaign', {
    homebrew_id: homebrewId,
    campaign_id: campaignId,
  });

  if (error) {
    console.error('Error linking homebrew to campaign:', error);
    throw error;
  }

  return data as boolean;
}

/**
 * Unlink homebrew content from a campaign
 */
export async function unlinkHomebrewFromCampaign(
  homebrewId: string,
  campaignId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('unlink_homebrew_from_campaign', {
    homebrew_id: homebrewId,
    campaign_id: campaignId,
  });

  if (error) {
    console.error('Error unlinking homebrew from campaign:', error);
    throw error;
  }

  return data as boolean;
}

// =====================================================================================
// Character Linking Operations
// =====================================================================================

export async function linkHomebrewToCharacter(
  homebrewId: string,
  characterId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('link_homebrew_to_character', {
    homebrew_id: homebrewId,
    character_id: characterId,
  });

  if (error) {
    console.error('Error linking homebrew to character:', error);
    throw error;
  }

  return data as boolean;
}

export async function unlinkHomebrewFromCharacter(
  homebrewId: string,
  characterId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('unlink_homebrew_from_character', {
    homebrew_id: homebrewId,
    character_id: characterId,
  });

  if (error) {
    console.error('Error unlinking homebrew from character:', error);
    throw error;
  }

  return data as boolean;
}

// =====================================================================================
// Visibility Operations
// =====================================================================================

/**
 * Update the visibility of homebrew content
 */
export async function updateHomebrewVisibility(
  id: string,
  visibility: HomebrewVisibility
): Promise<HomebrewContent | undefined> {
  return updateHomebrewContent(id, { visibility });
}

/**
 * Make homebrew content public
 */
export async function publishHomebrewContent(
  id: string
): Promise<HomebrewContent | undefined> {
  return updateHomebrewVisibility(id, 'public');
}

/**
 * Make homebrew content private
 */
export async function unpublishHomebrewContent(
  id: string
): Promise<HomebrewContent | undefined> {
  return updateHomebrewVisibility(id, 'private');
}

// =====================================================================================
// Batch Operations
// =====================================================================================

/**
 * Get multiple homebrew items by ID
 */
export async function getHomebrewContentBatch(
  ids: string[]
): Promise<HomebrewContent[]> {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from('homebrew_content')
    .select('*')
    .in('id', ids)
    .is('deleted_at', null);

  if (error) {
    console.error('Error getting homebrew content batch:', error);
    throw error;
  }

  return (data as HomebrewContentRow[]).map(rowToHomebrewContent);
}

/**
 * Get homebrew content by type for character building
 * Returns content that is either owned by user or linked to their campaigns
 */
export async function getHomebrewForCharacter(
  contentType: HomebrewContentType,
  campaignId?: string
): Promise<HomebrewContent[]> {
  const results: HomebrewContent[] = [];

  // Get user's own content of this type
  const myContent = await listMyHomebrewContent({
    contentType,
    limit: 100,
  });
  results.push(...myContent.items);

  // If character is in a campaign, also get campaign homebrew
  if (campaignId) {
    const campaignContent = await listCampaignHomebrewContent(campaignId, {
      contentType,
      limit: 100,
    });

    // Deduplicate (user might own content that's also linked to campaign)
    const existingIds = new Set(results.map(r => r.id));
    for (const item of campaignContent.items) {
      if (!existingIds.has(item.id)) {
        results.push(item);
      }
    }
  }

  return results;
}

// =====================================================================================
// Stats & Analytics
// =====================================================================================

/**
 * Get homebrew content stats for the current user
 */
export async function getMyHomebrewStats(): Promise<{
  total: number;
  byType: Record<HomebrewContentType, number>;
  public: number;
  forked: number;
  totalForks: number;
  totalViews: number;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      total: 0,
      byType: {} as Record<HomebrewContentType, number>,
      public: 0,
      forked: 0,
      totalForks: 0,
      totalViews: 0,
    };
  }

  const { data, error } = await supabase
    .from('homebrew_content')
    .select('content_type, visibility, forked_from, fork_count, view_count')
    .eq('owner_id', user.id)
    .is('deleted_at', null);

  if (error) {
    console.error('Error getting homebrew stats:', error);
    throw error;
  }

  const stats = {
    total: data.length,
    byType: {} as Record<HomebrewContentType, number>,
    public: 0,
    forked: 0,
    totalForks: 0,
    totalViews: 0,
  };

  for (const row of data) {
    const type = row.content_type as HomebrewContentType;
    stats.byType[type] = (stats.byType[type] || 0) + 1;
    if (row.visibility === 'public') stats.public++;
    if (row.forked_from) stats.forked++;
    stats.totalForks += row.fork_count;
    stats.totalViews += row.view_count;
  }

  return stats;
}

// =====================================================================================
// Engagement: Stars, Collections, Comments
// =====================================================================================

interface HomebrewCollectionRow {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  is_quicklist: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface HomebrewCollectionItemRow {
  collection_id: string;
  homebrew_id: string;
  added_by: string;
  created_at: string;
}

interface HomebrewCommentRow {
  id: string;
  homebrew_id: string;
  author_id: string;
  body: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapCollectionRow(row: HomebrewCollectionRow): HomebrewCollection {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    description: row.description,
    isQuicklist: row.is_quicklist,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

function mapCollectionItemRow(
  row: HomebrewCollectionItemRow
): HomebrewCollectionItem {
  return {
    collectionId: row.collection_id,
    homebrewId: row.homebrew_id,
    addedBy: row.added_by,
    createdAt: row.created_at,
  };
}

function mapCommentRow(row: HomebrewCommentRow): HomebrewComment {
  return {
    id: row.id,
    homebrewId: row.homebrew_id,
    authorId: row.author_id,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export async function listMyHomebrewStars(
  homebrewIds?: string[]
): Promise<string[]> {
  let query = supabase.from('homebrew_stars').select('homebrew_id');

  if (homebrewIds && homebrewIds.length > 0) {
    query = query.in('homebrew_id', homebrewIds);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error listing homebrew stars:', error);
    throw error;
  }

  return (data ?? []).map(row => row.homebrew_id as string);
}

export async function addHomebrewStar(homebrewId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to star homebrew');

  const { error } = await supabase
    .from('homebrew_stars')
    .insert({ homebrew_id: homebrewId, user_id: user.id });

  if (error && error.code !== '23505') {
    console.error('Error adding homebrew star:', error);
    throw error;
  }
}

export async function removeHomebrewStar(homebrewId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to unstar homebrew');

  const { error } = await supabase
    .from('homebrew_stars')
    .delete()
    .eq('homebrew_id', homebrewId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error removing homebrew star:', error);
    throw error;
  }
}

export async function listMyHomebrewCollections(): Promise<
  HomebrewCollection[]
> {
  const { data, error } = await supabase
    .from('homebrew_collections')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error listing homebrew collections:', error);
    throw error;
  }

  return (data as HomebrewCollectionRow[]).map(mapCollectionRow);
}

export async function createHomebrewCollection(
  name: string,
  description = ''
): Promise<HomebrewCollection> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to create a collection');

  const { data, error } = await supabase
    .from('homebrew_collections')
    .insert({ owner_id: user.id, name, description })
    .select()
    .single();

  if (error) {
    console.error('Error creating homebrew collection:', error);
    throw error;
  }

  return mapCollectionRow(data as HomebrewCollectionRow);
}

export async function getOrCreateQuicklist(): Promise<HomebrewCollection> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to access quicklist');

  const { data: existing, error: fetchError } = await supabase
    .from('homebrew_collections')
    .select('*')
    .eq('owner_id', user.id)
    .eq('is_quicklist', true)
    .is('deleted_at', null)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching quicklist:', fetchError);
    throw fetchError;
  }

  if (existing) return mapCollectionRow(existing as HomebrewCollectionRow);

  const { data, error } = await supabase
    .from('homebrew_collections')
    .insert({
      owner_id: user.id,
      name: 'Quicklist',
      description: 'Your starred homebrew items',
      is_quicklist: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating quicklist:', error);
    throw error;
  }

  return mapCollectionRow(data as HomebrewCollectionRow);
}

export async function addHomebrewToCollection(
  collectionId: string,
  homebrewId: string
): Promise<HomebrewCollectionItem> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to add to collection');

  const { data, error } = await supabase
    .from('homebrew_collection_items')
    .upsert({
      collection_id: collectionId,
      homebrew_id: homebrewId,
      added_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding item to collection:', error);
    throw error;
  }

  return mapCollectionItemRow(data as HomebrewCollectionItemRow);
}

export async function removeHomebrewFromCollection(
  collectionId: string,
  homebrewId: string
): Promise<void> {
  const { error } = await supabase
    .from('homebrew_collection_items')
    .delete()
    .eq('collection_id', collectionId)
    .eq('homebrew_id', homebrewId);

  if (error) {
    console.error('Error removing item from collection:', error);
    throw error;
  }
}

export async function listCollectionItems(
  collectionId: string
): Promise<HomebrewCollectionItem[]> {
  const { data, error } = await supabase
    .from('homebrew_collection_items')
    .select('*')
    .eq('collection_id', collectionId);

  if (error) {
    console.error('Error listing collection items:', error);
    throw error;
  }

  return (data as HomebrewCollectionItemRow[]).map(mapCollectionItemRow);
}

export async function listHomebrewComments(
  homebrewId: string
): Promise<HomebrewComment[]> {
  const { data, error } = await supabase
    .from('homebrew_comments')
    .select('*')
    .eq('homebrew_id', homebrewId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error listing homebrew comments:', error);
    throw error;
  }

  return (data as HomebrewCommentRow[]).map(mapCommentRow);
}

export async function addHomebrewComment(
  homebrewId: string,
  body: string
): Promise<HomebrewComment> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to comment');

  const { data, error } = await supabase
    .from('homebrew_comments')
    .insert({
      homebrew_id: homebrewId,
      author_id: user.id,
      body,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding homebrew comment:', error);
    throw error;
  }

  return mapCommentRow(data as HomebrewCommentRow);
}

export async function deleteHomebrewComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('homebrew_comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting homebrew comment:', error);
    throw error;
  }
}
