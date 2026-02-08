// Audio/Music Manager — Soundboard schemas for ambient music, SFX, and tracks
import { z } from 'zod';

// =====================================================================================
// Track source type — determines how the audio is played
// =====================================================================================

export const TrackSourceSchema = z.enum([
  'youtube',
  'soundcloud',
  'direct', // direct URL to MP3/OGG/WAV (e.g., freesound.org, CC0 audio)
]);

// =====================================================================================
// Track category — used for filtering and organization
// =====================================================================================

export const TrackCategorySchema = z.enum([
  'ambient', // background atmosphere (rain, tavern, forest)
  'music', // background music tracks
  'sfx', // short sound effects (sword clash, door creak)
]);

// =====================================================================================
// Soundboard Track — a single audio entry with its metadata
// =====================================================================================

export const SoundboardTrackSchema = z.object({
  id: z.string(),
  campaignId: z.string().optional(),
  gmId: z.string(),
  name: z.string().min(1).max(200),
  url: z.string().url(),
  source: TrackSourceSchema,
  category: TrackCategorySchema,
  tags: z.array(z.string()).default([]),
  volume: z.number().min(0).max(1).default(0.5),
  loop: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Soundboard Preset — a saved combination of tracks with volumes (a "scene")
// =====================================================================================

export const SoundboardPresetSchema = z.object({
  id: z.string(),
  campaignId: z.string().optional(),
  gmId: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().default(''),
  /** Track IDs mapped to their volume overrides */
  tracks: z
    .array(
      z.object({
        trackId: z.string(),
        volume: z.number().min(0).max(1),
        loop: z.boolean().default(false),
      })
    )
    .default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// =====================================================================================
// Type exports
// =====================================================================================

export type TrackSource = z.infer<typeof TrackSourceSchema>;
export type TrackCategory = z.infer<typeof TrackCategorySchema>;
export type SoundboardTrack = z.infer<typeof SoundboardTrackSchema>;
export type SoundboardPreset = z.infer<typeof SoundboardPresetSchema>;
