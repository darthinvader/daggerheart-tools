// Embedded player for YouTube and SoundCloud tracks.
// These sources can't use HTML5 Audio directly — they need iframe embeds.

import { X } from 'lucide-react';
import { useMemo } from 'react';
import {
  soundcloudEmbedUrl,
  youtubeEmbedUrl,
} from '@/features/soundboard/track-url-utils';
import { parseTrackUrl } from '@/features/soundboard/track-url-utils';
import { cn } from '@/lib/utils';

interface EmbedPlayerProps {
  url: string;
  trackName: string;
  autoplay?: boolean;
  loop?: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * Renders an iframe embed for YouTube or SoundCloud tracks.
 * For direct URLs, this component should not be used (use HTML5 Audio via AudioEngine).
 */
export default function EmbedPlayer({
  url,
  trackName,
  autoplay = true,
  loop = false,
  onClose,
  className,
}: EmbedPlayerProps) {
  const parsed = useMemo(() => parseTrackUrl(url), [url]);

  const embedSrc = useMemo(() => {
    if (parsed.source === 'youtube' && parsed.videoId) {
      return youtubeEmbedUrl(parsed.videoId, { autoplay, loop });
    }
    if (parsed.source === 'soundcloud') {
      return soundcloudEmbedUrl(parsed.url, { autoplay });
    }
    return null;
  }, [parsed, autoplay, loop]);

  if (!embedSrc) return null;

  const isYoutube = parsed.source === 'youtube';

  return (
    <div
      className={cn('relative overflow-hidden rounded-lg border', className)}
    >
      <div className="bg-muted flex items-center justify-between px-3 py-1.5">
        <span className="truncate text-xs font-medium">{trackName}</span>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label={`Close ${trackName} player`}
        >
          <X className="size-3.5" />
        </button>
      </div>
      <iframe
        src={embedSrc}
        title={trackName}
        allow="autoplay *; encrypted-media *; fullscreen *"
        allowFullScreen={false}
        className={cn('w-full border-0', isYoutube ? 'aspect-video' : 'h-20')}
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation allow-forms"
      />
    </div>
  );
}
