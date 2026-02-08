// Tests for the track URL parsing utility and embed URL builders.

import { describe, expect, it } from 'vitest';

import {
  parseTrackUrl,
  soundcloudEmbedUrl,
  youtubeEmbedUrl,
} from '@/features/soundboard/track-url-utils';

// =====================================================================================
// parseTrackUrl
// =====================================================================================

describe('parseTrackUrl', () => {
  it('detects a standard YouTube watch URL', () => {
    const result = parseTrackUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result.source).toBe('youtube');
    expect(result.videoId).toBe('dQw4w9WgXcQ');
  });

  it('detects a YouTube short URL', () => {
    const result = parseTrackUrl('https://youtu.be/dQw4w9WgXcQ');
    expect(result.source).toBe('youtube');
    expect(result.videoId).toBe('dQw4w9WgXcQ');
  });

  it('detects a YouTube embed URL', () => {
    const result = parseTrackUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(result.source).toBe('youtube');
    expect(result.videoId).toBe('dQw4w9WgXcQ');
  });

  it('detects a YouTube Shorts URL', () => {
    const result = parseTrackUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ');
    expect(result.source).toBe('youtube');
    expect(result.videoId).toBe('dQw4w9WgXcQ');
  });

  it('detects a SoundCloud track URL', () => {
    const result = parseTrackUrl(
      'https://soundcloud.com/artist-name/track-name'
    );
    expect(result.source).toBe('soundcloud');
    expect(result.videoId).toBeUndefined();
  });

  it('detects a direct MP3 URL as direct', () => {
    const result = parseTrackUrl('https://example.com/audio/tavern.mp3');
    expect(result.source).toBe('direct');
    expect(result.videoId).toBeUndefined();
  });

  it('detects a direct OGG URL as direct', () => {
    const result = parseTrackUrl('https://freesound.org/data/rain.ogg');
    expect(result.source).toBe('direct');
  });

  it('falls back to direct for unknown URLs', () => {
    const result = parseTrackUrl('https://example.com/some/random/path');
    expect(result.source).toBe('direct');
  });

  it('preserves the original URL', () => {
    const url = 'https://www.youtube.com/watch?v=abcDEF12345';
    const result = parseTrackUrl(url);
    expect(result.url).toBe(url);
  });
});

// =====================================================================================
// youtubeEmbedUrl
// =====================================================================================

describe('youtubeEmbedUrl', () => {
  it('generates a basic embed URL', () => {
    const url = youtubeEmbedUrl('dQw4w9WgXcQ');
    expect(url).toContain('https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(url).toContain('enablejsapi=1');
    expect(url).toContain('rel=0');
  });

  it('includes autoplay param', () => {
    const url = youtubeEmbedUrl('dQw4w9WgXcQ', { autoplay: true });
    expect(url).toContain('autoplay=1');
  });

  it('includes loop params with playlist', () => {
    const url = youtubeEmbedUrl('dQw4w9WgXcQ', { loop: true });
    expect(url).toContain('loop=1');
    expect(url).toContain('playlist=dQw4w9WgXcQ');
  });

  it('omits autoplay and loop when not specified', () => {
    const url = youtubeEmbedUrl('dQw4w9WgXcQ');
    expect(url).not.toContain('autoplay');
    expect(url).not.toContain('loop');
  });
});

// =====================================================================================
// soundcloudEmbedUrl
// =====================================================================================

describe('soundcloudEmbedUrl', () => {
  it('generates a widget embed URL with the track URL encoded', () => {
    const trackUrl = 'https://soundcloud.com/artist/track';
    const url = soundcloudEmbedUrl(trackUrl);
    expect(url).toContain('https://w.soundcloud.com/player/');
    expect(url).toContain(encodeURIComponent(trackUrl));
  });

  it('includes auto_play when autoplay is true', () => {
    const url = soundcloudEmbedUrl('https://soundcloud.com/a/b', {
      autoplay: true,
    });
    expect(url).toContain('auto_play=true');
  });

  it('sets auto_play to false by default', () => {
    const url = soundcloudEmbedUrl('https://soundcloud.com/a/b');
    expect(url).toContain('auto_play=false');
  });
});
