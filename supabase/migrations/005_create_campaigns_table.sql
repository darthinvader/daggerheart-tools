-- Supabase Migration: Create campaigns table
-- Run this in the Supabase SQL Editor or via supabase db push

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Campaign name
  name TEXT NOT NULL,

  -- Campaign frame (pitch, tones, themes, touchstones, etc.)
  frame JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- GM user ID (references auth.users)
  gm_id UUID NOT NULL,

  -- Players array
  players JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Session notes array
  sessions JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- NPCs array
  npcs JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Locations array
  locations JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Quests array
  quests JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Story threads array
  story_threads JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Session prep checklist
  session_prep_checklist JSONB NOT NULL DEFAULT '[
    {"id": "default-1", "text": "Review last session notes", "checked": false},
    {"id": "default-2", "text": "Check active quests & objectives", "checked": false},
    {"id": "default-3", "text": "Prepare 2-3 NPC voices/mannerisms", "checked": false},
    {"id": "default-4", "text": "Have a yes, and backup plan", "checked": false},
    {"id": "default-5", "text": "Note player character goals", "checked": false},
    {"id": "default-6", "text": "Prepare one memorable description", "checked": false},
    {"id": "default-7", "text": "Check the Fear track", "checked": false}
  ]'::jsonb,

  -- Invite code for players to join
  invite_code TEXT,

  -- Campaign status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),

  -- Free-form notes
  notes TEXT NOT NULL DEFAULT '',

  -- Soft delete timestamp (NULL = not deleted)
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_campaigns_gm_id ON campaigns (gm_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_name ON campaigns (name);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns (status);
CREATE INDEX IF NOT EXISTS idx_campaigns_deleted_at ON campaigns (deleted_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_invite_code ON campaigns (invite_code);

-- Apply trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own campaigns
CREATE POLICY "Users can view their own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = gm_id);

-- Policy: Users can insert their own campaigns
CREATE POLICY "Users can insert their own campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = gm_id);

-- Policy: Users can update their own campaigns
CREATE POLICY "Users can update their own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = gm_id);

-- Policy: Users can delete their own campaigns
CREATE POLICY "Users can delete their own campaigns" ON campaigns
  FOR DELETE USING (auth.uid() = gm_id);

-- Policy: Players can view campaigns they are part of (via invite code or player list)
CREATE POLICY "Players can view campaigns they joined" ON campaigns
  FOR SELECT USING (
    players @> jsonb_build_array(jsonb_build_object('id', auth.uid()::text))
  );
