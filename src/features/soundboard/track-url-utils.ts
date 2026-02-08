// Utility to detect track source and extract embed-friendly IDs from URLs.

import type { TrackSource } from '@/lib/schemas/soundboard';

interface ParsedTrackUrl {
  source: TrackSource;
  /** Raw URL passed through — always usable as a fallback */
  url: string;
  /** For YouTube: the video ID. For others, undefined. */
  videoId?: string;
}

const YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

const SOUNDCLOUD_REGEX = /soundcloud\.com\/.+\/.+/;

/**
 * Detect the source type of a URL and extract metadata for embedding.
 * Falls back to 'direct' for any URL that isn't YouTube or SoundCloud.
 */
export function parseTrackUrl(url: string): ParsedTrackUrl {
  const ytMatch = YOUTUBE_REGEX.exec(url);
  if (ytMatch) {
    return { source: 'youtube', url, videoId: ytMatch[1] };
  }

  if (SOUNDCLOUD_REGEX.test(url)) {
    return { source: 'soundcloud', url };
  }

  return { source: 'direct', url };
}

/**
 * Build a YouTube embed URL from a video ID.
 * Enables autoplay, loop, and disables related videos.
 */
export function youtubeEmbedUrl(
  videoId: string,
  options: { autoplay?: boolean; loop?: boolean } = {}
): string {
  const params = new URLSearchParams({
    enablejsapi: '1',
    rel: '0',
    modestbranding: '1',
  });
  // If we are in a browser environment, add origin to fix invalid parameter error (153/etc)
  if (typeof window !== 'undefined') {
    params.set('origin', window.location.origin);
  }
  if (options.autoplay) params.set('autoplay', '1');
  if (options.loop) {
    params.set('loop', '1');
    params.set('playlist', videoId);
  }
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Build a SoundCloud embed URL via their widget.
 */
export function soundcloudEmbedUrl(
  trackUrl: string,
  options: { autoplay?: boolean } = {}
): string {
  const params = new URLSearchParams({
    url: trackUrl,
    color: '#ff5500',
    auto_play: options.autoplay ? 'true' : 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    show_teaser: 'false',
    visual: 'true',
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}
