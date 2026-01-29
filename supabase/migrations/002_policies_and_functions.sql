-- ============================================================================
-- POLICIES AND FUNCTIONS - RLS, Functions, Triggers, Realtime
-- ============================================================================

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE homebrew_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE homebrew_stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE homebrew_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE homebrew_collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE homebrew_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE homebrew_character_links ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Characters Policies
-- ============================================================================

DROP POLICY IF EXISTS "Characters: owner can select" ON characters;
DROP POLICY IF EXISTS "Characters: owner can insert" ON characters;
DROP POLICY IF EXISTS "Characters: owner can update" ON characters;
DROP POLICY IF EXISTS "Characters: owner can delete" ON characters;
DROP POLICY IF EXISTS "Characters: gm can view campaign characters" ON characters;

CREATE POLICY "Characters: owner can select" ON characters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Characters: owner can insert" ON characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Characters: owner can update" ON characters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Characters: owner can delete" ON characters
  FOR DELETE USING (auth.uid() = user_id);

-- GM can view characters in their campaigns (for battle tracker)
CREATE POLICY "Characters: gm can view campaign characters" ON characters
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM campaigns
      WHERE campaigns.gm_id = auth.uid()
        AND campaigns.deleted_at IS NULL
        AND (
          campaigns.players @> jsonb_build_array(
            jsonb_build_object('characterId', characters.id::text)
          )
          OR EXISTS (
            SELECT 1
            FROM jsonb_array_elements(campaigns.players) AS player
            WHERE player->>'characterId' = characters.id::text
          )
        )
    )
  );

-- ============================================================================
-- Campaigns Policies
-- ============================================================================

DROP POLICY IF EXISTS "Campaigns: owner can select" ON campaigns;
DROP POLICY IF EXISTS "Campaigns: owner can insert" ON campaigns;
DROP POLICY IF EXISTS "Campaigns: owner can update" ON campaigns;
DROP POLICY IF EXISTS "Campaigns: owner can delete" ON campaigns;

CREATE POLICY "Campaigns: owner can select" ON campaigns
  FOR SELECT USING (auth.uid() = gm_id);

CREATE POLICY "Campaigns: owner can insert" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = gm_id);

CREATE POLICY "Campaigns: owner can update" ON campaigns
  FOR UPDATE USING (auth.uid() = gm_id);

CREATE POLICY "Campaigns: owner can delete" ON campaigns
  FOR DELETE USING (auth.uid() = gm_id);

-- ============================================================================
-- Campaign Invite Functions
-- ============================================================================

CREATE OR REPLACE FUNCTION campaign_invite_preview(invite_code TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  status TEXT,
  gm_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  RETURN QUERY
  SELECT campaigns.id, campaigns.name, campaigns.status, campaigns.gm_id
  FROM campaigns
  WHERE campaigns.invite_code = campaign_invite_preview.invite_code
    AND campaigns.deleted_at IS NULL
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION campaign_invite_preview(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION join_campaign_by_invite(
  invite_code TEXT,
  player_name TEXT,
  character_id UUID,
  character_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  campaign_record RECORD;
  existing_entry JSONB;
  updated_players JSONB;
  joined_at TEXT;
  role_value TEXT;
  name_value TEXT;
  character_name_value TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT id, players
    INTO campaign_record
  FROM campaigns
  WHERE campaigns.invite_code = join_campaign_by_invite.invite_code
    AND campaigns.deleted_at IS NULL
  LIMIT 1;

  IF campaign_record.id IS NULL THEN
    RAISE EXCEPTION 'invalid_invite';
  END IF;

  SELECT elem
    INTO existing_entry
  FROM jsonb_array_elements(COALESCE(campaign_record.players, '[]'::jsonb)) elem
  WHERE elem->>'id' = auth.uid()::text
  LIMIT 1;

  joined_at := COALESCE(existing_entry->>'joinedAt', NOW()::text);
  role_value := COALESCE(existing_entry->>'role', 'player');
  name_value := COALESCE(NULLIF(player_name, ''), existing_entry->>'name', 'Player');
  character_name_value := NULLIF(character_name, '');

  SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
    INTO updated_players
  FROM jsonb_array_elements(COALESCE(campaign_record.players, '[]'::jsonb)) elem
  WHERE elem->>'id' <> auth.uid()::text;

  updated_players := updated_players || jsonb_build_array(
    jsonb_build_object(
      'id', auth.uid()::text,
      'name', name_value,
      'characterId', CASE WHEN character_id IS NULL THEN NULL ELSE character_id::text END,
      'characterName', character_name_value,
      'joinedAt', joined_at,
      'role', role_value
    )
  );

  UPDATE campaigns
  SET players = updated_players
  WHERE id = campaign_record.id;

  RETURN campaign_record.id;
END;
$$;

GRANT EXECUTE ON FUNCTION join_campaign_by_invite(TEXT, TEXT, UUID, TEXT) TO authenticated;

-- ============================================================================
-- Homebrew Content Helper Function
-- ============================================================================

CREATE OR REPLACE FUNCTION can_view_homebrew_content(target_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM homebrew_content
    WHERE id = target_id
      AND deleted_at IS NULL
      AND (
        visibility = 'public'
        OR owner_id = auth.uid()
        OR (
          visibility IN ('campaign_only', 'private')
          AND EXISTS (
            SELECT 1 FROM campaigns
            WHERE campaigns.deleted_at IS NULL
              AND campaigns.id = ANY(homebrew_content.campaign_links)
              AND (
                campaigns.gm_id = auth.uid()
                OR campaigns.players @> jsonb_build_array(jsonb_build_object('id', auth.uid()::text))
              )
          )
        )
      )
  );
$$;

GRANT EXECUTE ON FUNCTION can_view_homebrew_content(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_view_homebrew_content(UUID) TO anon;

-- ============================================================================
-- Homebrew Content Policies
-- ============================================================================

DROP POLICY IF EXISTS "Homebrew: owner can select own content" ON homebrew_content;
DROP POLICY IF EXISTS "Homebrew: public content is viewable by all" ON homebrew_content;
DROP POLICY IF EXISTS "Homebrew: campaign members can view linked content" ON homebrew_content;
DROP POLICY IF EXISTS "Homebrew: owner can insert" ON homebrew_content;
DROP POLICY IF EXISTS "Homebrew: owner can update" ON homebrew_content;
DROP POLICY IF EXISTS "Homebrew: owner can delete" ON homebrew_content;

-- SELECT policies
CREATE POLICY "Homebrew: owner can select own content" ON homebrew_content
  FOR SELECT USING (
    auth.uid() = owner_id
    AND deleted_at IS NULL
  );

CREATE POLICY "Homebrew: public content is viewable by all" ON homebrew_content
  FOR SELECT USING (
    visibility = 'public'
    AND deleted_at IS NULL
  );

CREATE POLICY "Homebrew: campaign members can view linked content" ON homebrew_content
  FOR SELECT USING (
    visibility IN ('campaign_only', 'private')
    AND deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.deleted_at IS NULL
        AND campaigns.id = ANY(homebrew_content.campaign_links)
        AND (
          campaigns.gm_id = auth.uid()
          OR campaigns.players @> jsonb_build_array(jsonb_build_object('id', auth.uid()::text))
        )
    )
  );

-- INSERT policy
CREATE POLICY "Homebrew: owner can insert" ON homebrew_content
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- UPDATE policy (allows soft-delete by not checking deleted_at in WITH CHECK)
CREATE POLICY "Homebrew: owner can update" ON homebrew_content
  FOR UPDATE
  USING (auth.uid() = owner_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = owner_id);

-- DELETE policy (hard delete)
CREATE POLICY "Homebrew: owner can delete" ON homebrew_content
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================================================
-- Homebrew Content Functions
-- ============================================================================

-- Soft delete (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION soft_delete_homebrew(target_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  UPDATE homebrew_content
  SET deleted_at = NOW()
  WHERE id = target_id
    AND owner_id = auth.uid()
    AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'not_found_or_not_owner';
  END IF;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION soft_delete_homebrew(UUID) TO authenticated;

-- Fork homebrew content
CREATE OR REPLACE FUNCTION fork_homebrew_content(source_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
  source_record homebrew_content%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT * INTO source_record
  FROM homebrew_content
  WHERE id = source_id
    AND deleted_at IS NULL
    AND (
      visibility = 'public'
      OR owner_id = auth.uid()
      OR (
        visibility IN ('campaign_only', 'private')
        AND EXISTS (
          SELECT 1 FROM campaigns
          WHERE campaigns.deleted_at IS NULL
            AND campaigns.id = ANY(homebrew_content.campaign_links)
            AND (
              campaigns.gm_id = auth.uid()
              OR campaigns.players @> jsonb_build_array(jsonb_build_object('id', auth.uid()::text))
            )
        )
      )
    );

  IF source_record.id IS NULL THEN
    RAISE EXCEPTION 'source_not_found';
  END IF;

  -- Prevent forking a fork - must fork the original
  IF source_record.forked_from IS NOT NULL THEN
    RAISE EXCEPTION 'already_forked';
  END IF;

  INSERT INTO homebrew_content (
    owner_id,
    content_type,
    visibility,
    name,
    description,
    content,
    tags,
    forked_from,
    campaign_links
  ) VALUES (
    auth.uid(),
    source_record.content_type,
    'private',
    source_record.name || ' (Copy)',
    source_record.description,
    source_record.content,
    source_record.tags,
    source_id,
    '{}'::uuid[]
  )
  RETURNING id INTO new_id;

  UPDATE homebrew_content
  SET fork_count = fork_count + 1
  WHERE id = source_id
    AND deleted_at IS NULL;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION fork_homebrew_content(UUID) TO authenticated;

-- Increment view count
CREATE OR REPLACE FUNCTION increment_homebrew_view(homebrew_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE homebrew_content
  SET view_count = view_count + 1
  WHERE id = homebrew_id
    AND visibility = 'public'
    AND deleted_at IS NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_homebrew_view(UUID) TO authenticated;

-- ============================================================================
-- Campaign Linking Functions
-- ============================================================================

CREATE OR REPLACE FUNCTION link_homebrew_to_campaign(
  homebrew_id UUID,
  campaign_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM homebrew_content
    WHERE id = homebrew_id
      AND owner_id = auth.uid()
      AND deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'homebrew_not_found_or_not_owner';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM campaigns
    WHERE id = campaign_id
      AND gm_id = auth.uid()
      AND deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'campaign_not_found_or_not_gm';
  END IF;

  UPDATE homebrew_content
  SET campaign_links = array_append(
    array_remove(campaign_links, campaign_id),
    campaign_id
  )
  WHERE id = homebrew_id;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION link_homebrew_to_campaign(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION unlink_homebrew_from_campaign(
  homebrew_id UUID,
  campaign_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM homebrew_content
    WHERE id = homebrew_id
      AND deleted_at IS NULL
      AND (
        owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM campaigns
          WHERE id = campaign_id
            AND gm_id = auth.uid()
            AND deleted_at IS NULL
        )
      )
  ) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  UPDATE homebrew_content
  SET campaign_links = array_remove(campaign_links, campaign_id)
  WHERE id = homebrew_id;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION unlink_homebrew_from_campaign(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION get_campaign_homebrew(p_campaign_id UUID)
RETURNS SETOF homebrew_content
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM campaigns
    WHERE id = p_campaign_id
      AND deleted_at IS NULL
      AND (
        gm_id = auth.uid()
        OR players @> jsonb_build_array(jsonb_build_object('id', auth.uid()::text))
      )
  ) THEN
    RAISE EXCEPTION 'campaign_not_found_or_not_member';
  END IF;

  RETURN QUERY
  SELECT *
  FROM homebrew_content
  WHERE deleted_at IS NULL
    AND p_campaign_id = ANY(campaign_links);
END;
$$;

GRANT EXECUTE ON FUNCTION get_campaign_homebrew(UUID) TO authenticated;

-- ============================================================================
-- Homebrew Stars Policies and Triggers
-- ============================================================================

DROP POLICY IF EXISTS "Homebrew stars: viewable by viewers" ON homebrew_stars;
DROP POLICY IF EXISTS "Homebrew stars: insert by owner" ON homebrew_stars;
DROP POLICY IF EXISTS "Homebrew stars: delete by owner" ON homebrew_stars;

CREATE POLICY "Homebrew stars: viewable by viewers" ON homebrew_stars
  FOR SELECT USING (can_view_homebrew_content(homebrew_id));

CREATE POLICY "Homebrew stars: insert by owner" ON homebrew_stars
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND can_view_homebrew_content(homebrew_id)
  );

CREATE POLICY "Homebrew stars: delete by owner" ON homebrew_stars
  FOR DELETE USING (auth.uid() = user_id);

-- Star count trigger
CREATE OR REPLACE FUNCTION update_homebrew_star_count_from_stars()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE homebrew_content
    SET star_count = star_count + 1
    WHERE id = NEW.homebrew_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE homebrew_content
    SET star_count = GREATEST(star_count - 1, 0)
    WHERE id = OLD.homebrew_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS homebrew_stars_count_trigger ON homebrew_stars;
CREATE TRIGGER homebrew_stars_count_trigger
  AFTER INSERT OR DELETE ON homebrew_stars
  FOR EACH ROW
  EXECUTE FUNCTION update_homebrew_star_count_from_stars();

-- ============================================================================
-- Homebrew Collections Policies
-- ============================================================================

DROP POLICY IF EXISTS "Homebrew collections: owner can select" ON homebrew_collections;
DROP POLICY IF EXISTS "Homebrew collections: owner can insert" ON homebrew_collections;
DROP POLICY IF EXISTS "Homebrew collections: owner can update" ON homebrew_collections;
DROP POLICY IF EXISTS "Homebrew collections: owner can delete" ON homebrew_collections;

CREATE POLICY "Homebrew collections: owner can select" ON homebrew_collections
  FOR SELECT USING (auth.uid() = owner_id AND deleted_at IS NULL);

CREATE POLICY "Homebrew collections: owner can insert" ON homebrew_collections
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Homebrew collections: owner can update" ON homebrew_collections
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Homebrew collections: owner can delete" ON homebrew_collections
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================================================
-- Homebrew Collection Items Policies and Triggers
-- ============================================================================

DROP POLICY IF EXISTS "Homebrew collection items: owner can select" ON homebrew_collection_items;
DROP POLICY IF EXISTS "Homebrew collection items: owner can insert" ON homebrew_collection_items;
DROP POLICY IF EXISTS "Homebrew collection items: owner can delete" ON homebrew_collection_items;

CREATE POLICY "Homebrew collection items: owner can select" ON homebrew_collection_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM homebrew_collections
      WHERE homebrew_collections.id = homebrew_collection_items.collection_id
        AND homebrew_collections.owner_id = auth.uid()
        AND homebrew_collections.deleted_at IS NULL
    )
  );

CREATE POLICY "Homebrew collection items: owner can insert" ON homebrew_collection_items
  FOR INSERT WITH CHECK (
    auth.uid() = added_by
    AND can_view_homebrew_content(homebrew_id)
    AND EXISTS (
      SELECT 1 FROM homebrew_collections
      WHERE homebrew_collections.id = homebrew_collection_items.collection_id
        AND homebrew_collections.owner_id = auth.uid()
        AND homebrew_collections.deleted_at IS NULL
    )
  );

CREATE POLICY "Homebrew collection items: owner can delete" ON homebrew_collection_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM homebrew_collections
      WHERE homebrew_collections.id = homebrew_collection_items.collection_id
        AND homebrew_collections.owner_id = auth.uid()
        AND homebrew_collections.deleted_at IS NULL
    )
  );

-- Collection items count trigger
CREATE OR REPLACE FUNCTION update_homebrew_star_count_from_collections()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE homebrew_content
    SET star_count = star_count + 1
    WHERE id = NEW.homebrew_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE homebrew_content
    SET star_count = GREATEST(star_count - 1, 0)
    WHERE id = OLD.homebrew_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS homebrew_collection_items_count_trigger ON homebrew_collection_items;
CREATE TRIGGER homebrew_collection_items_count_trigger
  AFTER INSERT OR DELETE ON homebrew_collection_items
  FOR EACH ROW
  EXECUTE FUNCTION update_homebrew_star_count_from_collections();

-- ============================================================================
-- Homebrew Comments Policies and Triggers
-- ============================================================================

DROP POLICY IF EXISTS "Homebrew comments: viewable by viewers" ON homebrew_comments;
DROP POLICY IF EXISTS "Homebrew comments: insert by author" ON homebrew_comments;
DROP POLICY IF EXISTS "Homebrew comments: update by author" ON homebrew_comments;
DROP POLICY IF EXISTS "Homebrew comments: delete by author" ON homebrew_comments;

CREATE POLICY "Homebrew comments: viewable by viewers" ON homebrew_comments
  FOR SELECT USING (
    deleted_at IS NULL
    AND can_view_homebrew_content(homebrew_id)
  );

CREATE POLICY "Homebrew comments: insert by author" ON homebrew_comments
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND can_view_homebrew_content(homebrew_id)
  );

CREATE POLICY "Homebrew comments: update by author" ON homebrew_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Homebrew comments: delete by author" ON homebrew_comments
  FOR DELETE USING (auth.uid() = author_id);

-- Comment count trigger
CREATE OR REPLACE FUNCTION update_homebrew_comment_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE homebrew_content
    SET comment_count = comment_count + 1
    WHERE id = NEW.homebrew_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE homebrew_content
    SET comment_count = GREATEST(comment_count - 1, 0)
    WHERE id = OLD.homebrew_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS homebrew_comments_count_trigger ON homebrew_comments;
CREATE TRIGGER homebrew_comments_count_trigger
  AFTER INSERT OR DELETE ON homebrew_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_homebrew_comment_count();

-- ============================================================================
-- Homebrew Character Links Policies and Functions
-- ============================================================================

DROP POLICY IF EXISTS "Homebrew character links: owner can select" ON homebrew_character_links;
DROP POLICY IF EXISTS "Homebrew character links: owner can insert" ON homebrew_character_links;
DROP POLICY IF EXISTS "Homebrew character links: owner can delete" ON homebrew_character_links;

CREATE POLICY "Homebrew character links: owner can select" ON homebrew_character_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = homebrew_character_links.character_id
        AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Homebrew character links: owner can insert" ON homebrew_character_links
  FOR INSERT WITH CHECK (
    auth.uid() = added_by
    AND EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = homebrew_character_links.character_id
        AND characters.user_id = auth.uid()
    )
    AND can_view_homebrew_content(homebrew_id)
  );

CREATE POLICY "Homebrew character links: owner can delete" ON homebrew_character_links
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = homebrew_character_links.character_id
        AND characters.user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION link_homebrew_to_character(
  homebrew_id UUID,
  character_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM characters
    WHERE characters.id = character_id
      AND characters.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'not_owner';
  END IF;

  IF NOT can_view_homebrew_content(homebrew_id) THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  INSERT INTO homebrew_character_links (homebrew_id, character_id, added_by)
  VALUES (homebrew_id, character_id, auth.uid())
  ON CONFLICT DO NOTHING;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION link_homebrew_to_character(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION unlink_homebrew_from_character(
  homebrew_id UUID,
  character_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  DELETE FROM homebrew_character_links
  WHERE homebrew_character_links.homebrew_id = homebrew_id
    AND homebrew_character_links.character_id = character_id
    AND EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = character_id
        AND characters.user_id = auth.uid()
    );

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION unlink_homebrew_from_character(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION get_character_homebrew(p_character_id UUID)
RETURNS SETOF homebrew_content
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT hc.*
  FROM homebrew_content hc
  JOIN homebrew_character_links hcl
    ON hcl.homebrew_id = hc.id
  WHERE hcl.character_id = p_character_id
    AND hc.deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = p_character_id
        AND characters.user_id = auth.uid()
    );
$$;

GRANT EXECUTE ON FUNCTION get_character_homebrew(UUID) TO authenticated;

-- ============================================================================
-- Enable Realtime
-- ============================================================================

-- Add tables to realtime publication
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE characters;
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'characters table already in supabase_realtime publication';
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE campaigns;
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'campaigns table already in supabase_realtime publication';
END $$;

-- Set REPLICA IDENTITY to FULL for complete row data in realtime payloads
ALTER TABLE characters REPLICA IDENTITY FULL;
ALTER TABLE campaigns REPLICA IDENTITY FULL;

-- ============================================================================
-- Policies and functions complete.
-- ============================================================================
