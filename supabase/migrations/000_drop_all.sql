-- ============================================================================
-- DROP ALL - Complete Database Reset
-- ============================================================================
-- WARNING: This will delete ALL data and schema objects!
-- Run this ONLY on development databases.
-- ============================================================================

-- Remove from realtime publication first
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime DROP TABLE characters;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime DROP TABLE campaigns;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Drop triggers
DROP TRIGGER IF EXISTS update_homebrew_content_updated_at ON homebrew_content;
DROP TRIGGER IF EXISTS homebrew_stars_count_trigger ON homebrew_stars;
DROP TRIGGER IF EXISTS update_homebrew_collections_updated_at ON homebrew_collections;
DROP TRIGGER IF EXISTS homebrew_collection_items_count_trigger ON homebrew_collection_items;
DROP TRIGGER IF EXISTS update_homebrew_comments_updated_at ON homebrew_comments;
DROP TRIGGER IF EXISTS homebrew_comments_count_trigger ON homebrew_comments;
DROP TRIGGER IF EXISTS update_characters_updated_at ON characters;
DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;

-- Drop functions (CASCADE removes dependent policies)
DROP FUNCTION IF EXISTS soft_delete_homebrew(UUID) CASCADE;
DROP FUNCTION IF EXISTS fork_homebrew_content(UUID) CASCADE;
DROP FUNCTION IF EXISTS link_homebrew_to_campaign(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS unlink_homebrew_from_campaign(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS get_campaign_homebrew(UUID) CASCADE;
DROP FUNCTION IF EXISTS increment_homebrew_view(UUID) CASCADE;
DROP FUNCTION IF EXISTS can_view_homebrew_content(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_homebrew_star_count_from_stars() CASCADE;
DROP FUNCTION IF EXISTS update_homebrew_star_count_from_collections() CASCADE;
DROP FUNCTION IF EXISTS update_homebrew_comment_count() CASCADE;
DROP FUNCTION IF EXISTS link_homebrew_to_character(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS unlink_homebrew_from_character(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS get_character_homebrew(UUID) CASCADE;
DROP FUNCTION IF EXISTS campaign_invite_preview(TEXT) CASCADE;
DROP FUNCTION IF EXISTS join_campaign_by_invite(TEXT, TEXT, UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop tables (order matters due to foreign keys)
DROP TABLE IF EXISTS homebrew_character_links CASCADE;
DROP TABLE IF EXISTS homebrew_comments CASCADE;
DROP TABLE IF EXISTS homebrew_collection_items CASCADE;
DROP TABLE IF EXISTS homebrew_collections CASCADE;
DROP TABLE IF EXISTS homebrew_stars CASCADE;
DROP TABLE IF EXISTS homebrew_content CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS characters CASCADE;

-- Drop enums
DROP TYPE IF EXISTS homebrew_visibility CASCADE;
DROP TYPE IF EXISTS homebrew_content_type CASCADE;

-- ============================================================================
-- Database is now empty. Run 001_schema.sql then 002_policies_and_functions.sql
-- ============================================================================
