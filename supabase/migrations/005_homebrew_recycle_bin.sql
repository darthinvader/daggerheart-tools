-- ============================================================================
-- Migration: Homebrew Recycle Bin Support
-- ============================================================================
-- This migration adds a policy allowing owners to view their own soft-deleted
-- homebrew content in the recycle bin.
-- ============================================================================

-- Drop the policy if it already exists
DROP POLICY IF EXISTS "Homebrew: owner can select deleted content" ON homebrew_content;

-- Allow owners to view their own deleted content (for recycle bin)
CREATE POLICY "Homebrew: owner can select deleted content" ON homebrew_content
  FOR SELECT USING (
    auth.uid() = owner_id
    AND deleted_at IS NOT NULL
  );
