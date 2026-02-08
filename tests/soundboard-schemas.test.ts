// Tests for the soundboard Zod schemas — parse/reject validation.

import { describe, expect, it } from 'vitest';

import {
  SoundboardPresetSchema,
  SoundboardTrackSchema,
  TrackCategorySchema,
  TrackSourceSchema,
} from '@/lib/schemas/soundboard';

describe('TrackSourceSchema', () => {
  it.each(['youtube', 'soundcloud', 'direct'])('accepts "%s"', value => {
    expect(TrackSourceSchema.parse(value)).toBe(value);
  });

  it('rejects an invalid source', () => {
    expect(() => TrackSourceSchema.parse('spotify')).toThrow();
  });
});

describe('TrackCategorySchema', () => {
  it.each(['ambient', 'music', 'sfx'])('accepts "%s"', value => {
    expect(TrackCategorySchema.parse(value)).toBe(value);
  });

  it('rejects an invalid category', () => {
    expect(() => TrackCategorySchema.parse('voice')).toThrow();
  });
});

describe('SoundboardTrackSchema', () => {
  const validTrack = {
    id: 'track-1',
    gmId: 'gm-123',
    name: 'Tavern Ambience',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    source: 'youtube',
    category: 'ambient',
    tags: ['tavern', 'cozy'],
    volume: 0.7,
    loop: true,
    sortOrder: 0,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };

  it('parses a valid track', () => {
    const result = SoundboardTrackSchema.parse(validTrack);
    expect(result.name).toBe('Tavern Ambience');
    expect(result.source).toBe('youtube');
  });

  it('applies default values', () => {
    const minimal = {
      id: 'track-2',
      gmId: 'gm-456',
      name: 'Rain',
      url: 'https://example.com/rain.mp3',
      source: 'direct',
      category: 'ambient',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    };
    const result = SoundboardTrackSchema.parse(minimal);
    expect(result.tags).toEqual([]);
    expect(result.volume).toBe(0.5);
    expect(result.loop).toBe(false);
    expect(result.sortOrder).toBe(0);
  });

  it('rejects volume > 1', () => {
    expect(() =>
      SoundboardTrackSchema.parse({ ...validTrack, volume: 1.5 })
    ).toThrow();
  });

  it('rejects volume < 0', () => {
    expect(() =>
      SoundboardTrackSchema.parse({ ...validTrack, volume: -0.1 })
    ).toThrow();
  });

  it('rejects an invalid URL', () => {
    expect(() =>
      SoundboardTrackSchema.parse({ ...validTrack, url: 'not-a-url' })
    ).toThrow();
  });

  it('rejects an empty name', () => {
    expect(() =>
      SoundboardTrackSchema.parse({ ...validTrack, name: '' })
    ).toThrow();
  });

  it('allows optional campaignId', () => {
    const result = SoundboardTrackSchema.parse({
      ...validTrack,
      campaignId: 'camp-1',
    });
    expect(result.campaignId).toBe('camp-1');
  });
});

describe('SoundboardPresetSchema', () => {
  const validPreset = {
    id: 'preset-1',
    gmId: 'gm-123',
    name: 'Dark Forest',
    description: 'Ambient rain and owl sounds',
    tracks: [
      { trackId: 'track-1', volume: 0.6, loop: true },
      { trackId: 'track-2', volume: 0.3, loop: false },
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };

  it('parses a valid preset', () => {
    const result = SoundboardPresetSchema.parse(validPreset);
    expect(result.name).toBe('Dark Forest');
    expect(result.tracks).toHaveLength(2);
  });

  it('applies defaults for description and tracks', () => {
    const minimal = {
      id: 'preset-2',
      gmId: 'gm-456',
      name: 'Empty Scene',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    };
    const result = SoundboardPresetSchema.parse(minimal);
    expect(result.description).toBe('');
    expect(result.tracks).toEqual([]);
  });

  it('rejects name over 100 chars', () => {
    expect(() =>
      SoundboardPresetSchema.parse({
        ...validPreset,
        name: 'A'.repeat(101),
      })
    ).toThrow();
  });
});
