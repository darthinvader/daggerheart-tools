-- ============================================================================
-- ENABLE REALTIME FOR BATTLE TRACKER
-- ============================================================================
-- Run this script in your Supabase SQL Editor to enable realtime updates
-- for the battle tracker. This allows the GM to see live character updates
-- when players modify their HP, stress, conditions, etc.
-- ============================================================================

-- Step 1: Add characters table to realtime publication
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE characters;
  RAISE NOTICE 'Added characters table to supabase_realtime publication';
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'characters table already in supabase_realtime publication (OK)';
END;
$$;

-- Step 2: Add campaigns table to realtime publication
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE campaigns;
  RAISE NOTICE 'Added campaigns table to supabase_realtime publication';
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'campaigns table already in supabase_realtime publication (OK)';
END;
$$;

-- Step 3: Set REPLICA IDENTITY to FULL for complete row data in updates
ALTER TABLE characters REPLICA IDENTITY FULL;
ALTER TABLE campaigns REPLICA IDENTITY FULL;

-- Step 4: Verify the setup
SELECT
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- ============================================================================
-- EXPECTED OUTPUT:
-- ============================================================================
-- schemaname | tablename
-- -----------+-----------
-- public     | campaigns
-- public     | characters
-- ============================================================================

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================
-- If realtime still doesn't work after running this:
--
-- 1. Check Supabase Dashboard → Database → Replication
--    Ensure characters and campaigns are listed under supabase_realtime
--
-- 2. Verify RLS policies allow SELECT for the GM:
--    The GM needs "Characters: gm can view campaign characters" policy
--
-- 3. Check browser console for subscription status:
--    Look for "[BattleRealtime] Subscription status: SUBSCRIBED"
--
-- 4. Ensure the character is actually in a campaign:
--    The GM can only see characters that are linked to their campaign
--
-- 5. For Supabase local development, restart Docker:
--    supabase stop && supabase start
-- ============================================================================
