-- Homebrew Content System Migration
-- Allows users to create, share, and manage custom game content

-- =====================================================================================
-- Enums
-- =====================================================================================

-- Content type enum for polymorphic storage
CREATE TYPE homebrew_content_type AS ENUM (
  'adversary',
  'environment',
  'domain_card',
  'class',
  'subclass',
  'ancestry',
  'community',
  'equipment',
  'item'
);

-- Visibility enum for access control
CREATE TYPE homebrew_visibility AS ENUM (
  'private',      -- Only owner can see
  'public',       -- Anyone can view and fork
  'campaign_only' -- Only linked campaign members can see
);

-- =====================================================================================
-- Homebrew Content Table
-- =====================================================================================

CREATE TABLE IF NOT EXISTS homebrew_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Owner (auth.users)
  owner_id UUID NOT NULL,

  -- Content classification
  content_type homebrew_content_type NOT NULL,
  visibility homebrew_visibility NOT NULL DEFAULT 'private',

  -- Basic info (denormalized for search/display)
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',

  -- Polymorphic content storage - matches respective schema based on content_type
  content JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Categorization
  tags TEXT[] NOT NULL DEFAULT '{}',

  -- Forking support - tracks origin of copied content
  forked_from UUID REFERENCES homebrew_content(id) ON DELETE SET NULL,

  -- Campaign linking - array of campaign IDs this content is linked to
  campaign_links UUID[] NOT NULL DEFAULT '{}',

  -- Usage statistics (for public content ranking)
  fork_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,

  -- Soft delete timestamp (NULL = not deleted)
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- Indexes
-- =====================================================================================

-- Owner lookup
CREATE INDEX IF NOT EXISTS idx_homebrew_owner_id ON homebrew_content(owner_id);

-- Content type filtering
CREATE INDEX IF NOT EXISTS idx_homebrew_content_type ON homebrew_content(content_type);

-- Visibility filtering
CREATE INDEX IF NOT EXISTS idx_homebrew_visibility ON homebrew_content(visibility);

-- Name search
CREATE INDEX IF NOT EXISTS idx_homebrew_name ON homebrew_content(name);

-- Soft delete filtering
CREATE INDEX IF NOT EXISTS idx_homebrew_deleted_at ON homebrew_content(deleted_at);

-- Campaign links (GIN for array containment queries)
CREATE INDEX IF NOT EXISTS idx_homebrew_campaign_links ON homebrew_content USING GIN(campaign_links);

-- Tags search (GIN for array containment queries)
CREATE INDEX IF NOT EXISTS idx_homebrew_tags ON homebrew_content USING GIN(tags);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_homebrew_owner_type ON homebrew_content(owner_id, content_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_homebrew_public ON homebrew_content(visibility, content_type) WHERE visibility = 'public' AND deleted_at IS NULL;

-- Fork tracking
CREATE INDEX IF NOT EXISTS idx_homebrew_forked_from ON homebrew_content(forked_from) WHERE forked_from IS NOT NULL;

-- =====================================================================================
-- Triggers
-- =====================================================================================

-- Updated at trigger
DROP TRIGGER IF EXISTS update_homebrew_content_updated_at ON homebrew_content;
CREATE TRIGGER update_homebrew_content_updated_at
  BEFORE UPDATE ON homebrew_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- Row Level Security
-- =====================================================================================

ALTER TABLE homebrew_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Homebrew: owner can select own content" ON homebrew_content;
DROP POLICY IF EXISTS "Homebrew: public content is viewable by all" ON homebrew_content;
DROP POLICY IF EXISTS "Homebrew: campaign members can view linked content" ON homebrew_content;
DROP POLICY IF EXISTS "Homebrew: owner can insert" ON homebrew_content;
DROP POLICY IF EXISTS "Homebrew: owner can update" ON homebrew_content;
DROP POLICY IF EXISTS "Homebrew: owner can delete" ON homebrew_content;

-- SELECT policies

-- Owner can always see their own content
CREATE POLICY "Homebrew: owner can select own content" ON homebrew_content
  FOR SELECT USING (
    auth.uid() = owner_id
    AND deleted_at IS NULL
  );

-- Anyone authenticated can see public content
CREATE POLICY "Homebrew: public content is viewable by all" ON homebrew_content
  FOR SELECT USING (
    visibility = 'public'
    AND deleted_at IS NULL
  );

-- Campaign members (GM or players) can see campaign-linked content
CREATE POLICY "Homebrew: campaign members can view linked content" ON homebrew_content
  FOR SELECT USING (
    visibility IN ('campaign_only', 'private')
    AND deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.deleted_at IS NULL
        AND campaigns.id = ANY(homebrew_content.campaign_links)
        AND (
          -- User is GM
          campaigns.gm_id = auth.uid()
          OR
          -- User is a player in the campaign
          campaigns.players @> jsonb_build_array(jsonb_build_object('id', auth.uid()::text))
        )
    )
  );

-- INSERT policy - owner must match authenticated user
CREATE POLICY "Homebrew: owner can insert" ON homebrew_content
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- UPDATE policy - only owner can update
CREATE POLICY "Homebrew: owner can update" ON homebrew_content
  FOR UPDATE USING (auth.uid() = owner_id);

-- DELETE policy - only owner can delete
CREATE POLICY "Homebrew: owner can delete" ON homebrew_content
  FOR DELETE USING (auth.uid() = owner_id);

-- =====================================================================================
-- Helper Functions
-- =====================================================================================

-- Fork homebrew content (creates a copy for the current user)
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
  -- Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Get source content (must be public or user must have access)
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

  -- Create the fork
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
    'private', -- Forks start as private
    source_record.name || ' (Copy)',
    source_record.description,
    source_record.content,
    source_record.tags,
    source_id,
    '{}'::uuid[] -- No campaign links initially
  )
  RETURNING id INTO new_id;

  -- Increment fork count on source
  UPDATE homebrew_content
  SET fork_count = fork_count + 1
  WHERE id = source_id;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION fork_homebrew_content(UUID) TO authenticated;

-- Link homebrew content to a campaign
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
  -- Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Verify user owns the homebrew content
  IF NOT EXISTS (
    SELECT 1 FROM homebrew_content
    WHERE id = homebrew_id
      AND owner_id = auth.uid()
      AND deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'homebrew_not_found_or_not_owner';
  END IF;

  -- Verify user is GM of the campaign
  IF NOT EXISTS (
    SELECT 1 FROM campaigns
    WHERE id = campaign_id
      AND gm_id = auth.uid()
      AND deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'campaign_not_found_or_not_gm';
  END IF;

  -- Add campaign to links if not already present
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

-- Unlink homebrew content from a campaign
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
  -- Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Verify user owns the homebrew content OR is GM of the campaign
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

  -- Remove campaign from links
  UPDATE homebrew_content
  SET campaign_links = array_remove(campaign_links, campaign_id)
  WHERE id = homebrew_id;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION unlink_homebrew_from_campaign(UUID, UUID) TO authenticated;

-- Get homebrew content for a campaign (includes owner's content linked to campaign)
CREATE OR REPLACE FUNCTION get_campaign_homebrew(p_campaign_id UUID)
RETURNS SETOF homebrew_content
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Verify user is GM or player in the campaign
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

-- Increment view count (for public content analytics)
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

-- =====================================================================================
-- Homebrew Engagement Features (stars, collections, comments)
-- =====================================================================================

-- Columns on homebrew_content
ALTER TABLE homebrew_content
  ADD COLUMN IF NOT EXISTS star_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comment_count INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_homebrew_star_count ON homebrew_content(star_count);
CREATE INDEX IF NOT EXISTS idx_homebrew_comment_count ON homebrew_content(comment_count);

-- Helper: Can current user view homebrew content?
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

-- Stars (Quicklist)
CREATE TABLE IF NOT EXISTS homebrew_stars (
  homebrew_id UUID NOT NULL REFERENCES homebrew_content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (homebrew_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_homebrew_stars_user_id ON homebrew_stars(user_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_stars_homebrew_id ON homebrew_stars(homebrew_id);

ALTER TABLE homebrew_stars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Homebrew stars: viewable by viewers" ON homebrew_stars;
DROP POLICY IF EXISTS "Homebrew stars: insert by owner" ON homebrew_stars;
DROP POLICY IF EXISTS "Homebrew stars: delete by owner" ON homebrew_stars;

CREATE POLICY "Homebrew stars: viewable by viewers" ON homebrew_stars
  FOR SELECT USING (
    can_view_homebrew_content(homebrew_id)
  );

CREATE POLICY "Homebrew stars: insert by owner" ON homebrew_stars
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND can_view_homebrew_content(homebrew_id)
  );

CREATE POLICY "Homebrew stars: delete by owner" ON homebrew_stars
  FOR DELETE USING (
    auth.uid() = user_id
  );

-- Update star_count when stars change
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

-- Collections
CREATE TABLE IF NOT EXISTS homebrew_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  is_quicklist BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_homebrew_collections_owner_quicklist
  ON homebrew_collections(owner_id)
  WHERE is_quicklist = TRUE AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_homebrew_collections_owner_id ON homebrew_collections(owner_id);

ALTER TABLE homebrew_collections ENABLE ROW LEVEL SECURITY;

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

DROP TRIGGER IF EXISTS update_homebrew_collections_updated_at ON homebrew_collections;
CREATE TRIGGER update_homebrew_collections_updated_at
  BEFORE UPDATE ON homebrew_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS homebrew_collection_items (
  collection_id UUID NOT NULL REFERENCES homebrew_collections(id) ON DELETE CASCADE,
  homebrew_id UUID NOT NULL REFERENCES homebrew_content(id) ON DELETE CASCADE,
  added_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection_id, homebrew_id)
);

CREATE INDEX IF NOT EXISTS idx_homebrew_collection_items_homebrew_id
  ON homebrew_collection_items(homebrew_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_collection_items_collection_id
  ON homebrew_collection_items(collection_id);

ALTER TABLE homebrew_collection_items ENABLE ROW LEVEL SECURITY;

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

-- Update star_count when collection items change (counts toward stars)
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

-- Comments
CREATE TABLE IF NOT EXISTS homebrew_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homebrew_id UUID NOT NULL REFERENCES homebrew_content(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  body TEXT NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_homebrew_comments_homebrew_id ON homebrew_comments(homebrew_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_comments_author_id ON homebrew_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_comments_deleted_at ON homebrew_comments(deleted_at);

ALTER TABLE homebrew_comments ENABLE ROW LEVEL SECURITY;

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

DROP TRIGGER IF EXISTS update_homebrew_comments_updated_at ON homebrew_comments;
CREATE TRIGGER update_homebrew_comments_updated_at
  BEFORE UPDATE ON homebrew_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update comment_count on homebrew_content
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

-- =====================================================================================
-- Homebrew Character Linking
-- =====================================================================================

CREATE TABLE IF NOT EXISTS homebrew_character_links (
  homebrew_id UUID NOT NULL REFERENCES homebrew_content(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  added_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (homebrew_id, character_id)
);

CREATE INDEX IF NOT EXISTS idx_homebrew_character_links_homebrew_id
  ON homebrew_character_links(homebrew_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_character_links_character_id
  ON homebrew_character_links(character_id);

ALTER TABLE homebrew_character_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Homebrew character links: owner can select" ON homebrew_character_links;
DROP POLICY IF EXISTS "Homebrew character links: owner can insert" ON homebrew_character_links;
DROP POLICY IF EXISTS "Homebrew character links: owner can delete" ON homebrew_character_links;

CREATE POLICY "Homebrew character links: owner can select" ON homebrew_character_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM characters
      WHERE characters.id = homebrew_character_links.character_id
        AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Homebrew character links: owner can insert" ON homebrew_character_links
  FOR INSERT WITH CHECK (
    auth.uid() = added_by
    AND EXISTS (
      SELECT 1
      FROM characters
      WHERE characters.id = homebrew_character_links.character_id
        AND characters.user_id = auth.uid()
    )
    AND can_view_homebrew_content(homebrew_id)
  );

CREATE POLICY "Homebrew character links: owner can delete" ON homebrew_character_links
  FOR DELETE USING (
    EXISTS (
      SELECT 1
      FROM characters
      WHERE characters.id = homebrew_character_links.character_id
        AND characters.user_id = auth.uid()
    )
  );

-- Helper functions
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
