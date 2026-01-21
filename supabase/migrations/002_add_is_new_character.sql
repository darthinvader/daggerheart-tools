-- Supabase Migration: Add is_new_character flag
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS is_new_character BOOLEAN NOT NULL DEFAULT true;
