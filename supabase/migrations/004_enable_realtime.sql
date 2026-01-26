-- ============================================================================
-- Migration: Enable Realtime for Characters Table
-- ============================================================================
-- This migration enables Supabase Realtime (postgres_changes) for the
-- characters table so that the battle tracker can receive live updates
-- when players modify their characters.
-- ============================================================================

-- Enable realtime for the characters table
-- This adds the table to the supabase_realtime publication
-- Note: If you get "relation already member of publication", table is already enabled
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE characters;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'characters table already in supabase_realtime publication';
END;
$$;

-- Also enable for campaigns table (for battle state updates if needed)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE campaigns;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'campaigns table already in supabase_realtime publication';
END;
$$;

-- ============================================================================
-- Set REPLICA IDENTITY to FULL for better realtime payloads
-- ============================================================================
-- By default, UPDATE events only include changed columns. With FULL identity,
-- the entire row is sent, which makes it easier to process updates.
ALTER TABLE characters REPLICA IDENTITY FULL;
ALTER TABLE campaigns REPLICA IDENTITY FULL;

-- ============================================================================
-- Ensure RLS policies allow realtime subscriptions
-- ============================================================================
-- Realtime subscriptions require SELECT permission. The existing policies
-- should work, but let's ensure GMs can see campaign character updates.

-- Drop and recreate the GM view policy to ensure it's correct
DROP POLICY IF EXISTS "Characters: gm can view campaign characters" ON characters;

CREATE POLICY "Characters: gm can view campaign characters" ON characters
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM campaigns
      WHERE campaigns.gm_id = auth.uid()
        AND campaigns.deleted_at IS NULL
        AND (
          -- Check if character is in campaign players array
          campaigns.players @> jsonb_build_array(
            jsonb_build_object('characterId', characters.id::text)
          )
          OR
          -- Also check player entries with characterId field
          EXISTS (
            SELECT 1
            FROM jsonb_array_elements(campaigns.players) AS player
            WHERE player->>'characterId' = characters.id::text
          )
        )
    )
  );

-- ============================================================================
-- Verify realtime is enabled
-- ============================================================================
-- Run this query to verify which tables have realtime enabled:
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- ============================================================================
-- Notes:
-- ============================================================================
-- 1. After running this migration, you may need to restart the Supabase
--    Realtime service for changes to take effect (in local dev, restart Docker).
--
-- 2. In Supabase Dashboard, you can also verify via:
--    Database → Replication → supabase_realtime
--
-- 3. Realtime respects RLS policies. The GM must have SELECT permission
--    on characters to receive realtime updates.
--
-- 4. REPLICA IDENTITY FULL ensures the entire row is sent in UPDATE payloads.
--
-- 5. For local development, ensure your supabase config has realtime enabled:
--    supabase/config.toml should have [realtime] enabled = true
-- ============================================================================
