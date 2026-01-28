-- Homebrew Engagement Features
-- Adds stars, collections, and comments for homebrew content

-- =====================================================================================
-- Columns on homebrew_content
-- =====================================================================================

ALTER TABLE homebrew_content
  ADD COLUMN IF NOT EXISTS star_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comment_count INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_homebrew_star_count ON homebrew_content(star_count);
CREATE INDEX IF NOT EXISTS idx_homebrew_comment_count ON homebrew_content(comment_count);

-- =====================================================================================
-- Helper: Can current user view homebrew content?
-- =====================================================================================

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

-- =====================================================================================
-- Stars (Quicklist)
-- =====================================================================================

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

-- =====================================================================================
-- Collections
-- =====================================================================================

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

-- =====================================================================================
-- Comments
-- =====================================================================================

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
