// Individual track card with play/pause/stop, volume slider, loop toggle, progress bar, and delete.

import {
  ExternalLink,
  Music,
  Pause,
  Play,
  Repeat,
  Square,
  Trash2,
  Volume2,
  Waves,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { SoundboardTrack } from '@/lib/schemas/soundboard';
import { cn } from '@/lib/utils';

const CATEGORY_CONFIG = {
  ambient: { icon: Waves, label: 'Ambient', color: 'text-teal-500' },
  music: { icon: Music, label: 'Music', color: 'text-purple-500' },
  sfx: { icon: Zap, label: 'SFX', color: 'text-amber-500' },
} as const;

const SOURCE_LABELS: Record<string, string> = {
  youtube: 'YouTube',
  soundcloud: 'SoundCloud',
  direct: 'Direct',
};

type TrackProgress = { currentTime: number; duration: number };

/** Format seconds to m:ss */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function TrackHeader({
  track,
  categoryColor,
  CategoryIcon,
}: {
  track: SoundboardTrack;
  categoryColor: string;
  CategoryIcon: typeof Music;
}) {
  return (
    <div className="flex items-center gap-2">
      <CategoryIcon className={cn('size-4 shrink-0', categoryColor)} />
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {track.name}
      </span>
      <Badge variant="outline" className="shrink-0 text-[10px]">
        {SOURCE_LABELS[track.source] ?? track.source}
      </Badge>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground shrink-0"
            aria-label={`Open ${track.name} in new tab`}
          >
            <ExternalLink className="size-3.5" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="top">Open source link</TooltipContent>
      </Tooltip>
    </div>
  );
}

function TrackProgressBar({
  trackName,
  progress,
  onSeek,
}: {
  trackName: string;
  progress: TrackProgress;
  onSeek: (value: number[]) => void;
}) {
  if (!progress.duration) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground w-10 text-right text-[10px] tabular-nums">
        {formatTime(progress.currentTime)}
      </span>
      <Slider
        value={[progress.currentTime]}
        min={0}
        max={progress.duration}
        step={0.5}
        onValueChange={onSeek}
        className="flex-1"
        aria-label={`Seek ${trackName}`}
      />
      <span className="text-muted-foreground w-10 text-[10px] tabular-nums">
        {formatTime(progress.duration)}
      </span>
    </div>
  );
}

function TrackTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map(tag => (
        <Badge key={tag} variant="secondary" className="text-[10px]">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

function PlaybackButtons({
  track,
  isPlaying,
  isPaused,
  isEmbed,
  active,
  onPlay,
  onPause,
  onResume,
  onStop,
}: {
  track: SoundboardTrack;
  isPlaying: boolean;
  isPaused: boolean;
  isEmbed: boolean;
  active: boolean;
  onPlay: (track: SoundboardTrack) => void;
  onPause: (trackId: string) => void;
  onResume: (trackId: string) => void;
  onStop: (trackId: string) => void;
}) {
  return (
    <>
      {!isPlaying && !isPaused && (
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          onClick={() => onPlay(track)}
          aria-label={`Play ${track.name}`}
        >
          <Play className="size-4" />
        </Button>
      )}

      {isPlaying && !isEmbed && (
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          onClick={() => onPause(track.id)}
          aria-label={`Pause ${track.name}`}
        >
          <Pause className="size-4" />
        </Button>
      )}

      {isPaused && (
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          onClick={() => onResume(track.id)}
          aria-label={`Resume ${track.name}`}
        >
          <Play className="size-4" />
        </Button>
      )}

      {active && (
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          onClick={() => onStop(track.id)}
          aria-label={`Stop ${track.name}`}
        >
          <Square className="size-3.5" />
        </Button>
      )}
    </>
  );
}

function VolumeControls({
  track,
  isDirect,
  onValueChange,
  onValueCommit,
}: {
  track: SoundboardTrack;
  isDirect: boolean;
  onValueChange: (value: number[]) => void;
  onValueCommit: (value: number[]) => void;
}) {
  if (!isDirect) return null;
  return (
    <>
      <Volume2 className="text-muted-foreground ml-1 size-3.5 shrink-0" />
      <Slider
        value={[track.volume]}
        min={0}
        max={1}
        step={0.05}
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
        className="w-24"
        aria-label={`Volume for ${track.name}`}
      />
      <span className="text-muted-foreground w-8 text-right text-[10px]">
        {Math.round(track.volume * 100)}%
      </span>
    </>
  );
}

function LoopToggle({
  track,
  isDirect,
  onToggle,
}: {
  track: SoundboardTrack;
  isDirect: boolean;
  onToggle: (checked: boolean) => void;
}) {
  if (!isDirect) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1">
          <Switch
            checked={track.loop}
            onCheckedChange={onToggle}
            className="scale-75"
            aria-label={`Loop ${track.name}`}
          />
          <Repeat
            className={cn(
              'size-3.5',
              track.loop ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        {track.loop ? 'Looping' : 'Play once'}
      </TooltipContent>
    </Tooltip>
  );
}

function EmbedIndicator({
  isEmbed,
  active,
}: {
  isEmbed: boolean;
  active: boolean;
}) {
  if (!isEmbed || !active) return null;
  return (
    <span className="text-muted-foreground ml-1 text-[10px] italic">
      Controlled in player
    </span>
  );
}

function DeleteButton({
  track,
  onDelete,
}: {
  track: SoundboardTrack;
  onDelete: (id: string) => void;
}) {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="text-destructive/70 hover:text-destructive ml-auto size-7"
      onClick={() => onDelete(track.id)}
      aria-label={`Delete ${track.name}`}
    >
      <Trash2 className="size-3.5" />
    </Button>
  );
}

interface TrackCardProps {
  track: SoundboardTrack;
  isPlaying: boolean;
  isPaused: boolean;
  isEmbed: boolean;
  progress?: TrackProgress;
  onPlay: (track: SoundboardTrack) => void;
  onPause: (trackId: string) => void;
  onResume: (trackId: string) => void;
  onStop: (trackId: string) => void;
  onVolumePreview: (trackId: string, volume: number) => void;
  onVolumeChange: (trackId: string, volume: number) => void;
  onLoopChange: (trackId: string, loop: boolean) => void;
  onSeek: (trackId: string, time: number) => void;
  onDelete: (trackId: string) => void;
}

export default function TrackCard({
  track,
  isPlaying,
  isPaused,
  isEmbed,
  progress,
  onPlay,
  onPause,
  onResume,
  onStop,
  onVolumePreview,
  onVolumeChange,
  onLoopChange,
  onSeek,
  onDelete,
}: TrackCardProps) {
  const cat = CATEGORY_CONFIG[track.category];
  const CategoryIcon = cat.icon;

  // Debounce volume persistence to avoid spamming the DB
  const volumeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const handleVolumeChange = useCallback(
    (value: number[]) => {
      const v = value[0];
      if (!isEmbed) onVolumePreview(track.id, v);
      clearTimeout(volumeTimer.current);
      volumeTimer.current = setTimeout(() => {
        onVolumeChange(track.id, v);
      }, 400);
    },
    [track.id, onVolumePreview, onVolumeChange, isEmbed]
  );

  const handleVolumeCommit = useCallback(
    (value: number[]) => {
      const v = value[0];
      clearTimeout(volumeTimer.current);
      onVolumeChange(track.id, v);
    },
    [track.id, onVolumeChange]
  );

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(volumeTimer.current), []);

  const handleLoopToggle = useCallback(
    (checked: boolean) => {
      onLoopChange(track.id, checked);
    },
    [track.id, onLoopChange]
  );

  const handleSeek = useCallback(
    (value: number[]) => {
      onSeek(track.id, value[0]);
    },
    [track.id, onSeek]
  );

  const active = isPlaying || isPaused;
  const isDirect = track.source === 'direct';

  return (
    <Card
      className={cn(
        'transition-all',
        isPlaying && 'ring-primary/40 ring-2',
        isPaused && 'ring-muted-foreground/20 ring-1'
      )}
    >
      <CardContent className="flex flex-col gap-3 py-3">
        <TrackHeader
          track={track}
          categoryColor={cat.color}
          CategoryIcon={CategoryIcon}
        />

        {/* Progress bar — direct tracks only, visible when active */}
        {isDirect && active && progress && (
          <TrackProgressBar
            trackName={track.name}
            progress={progress}
            onSeek={handleSeek}
          />
        )}

        <div className="flex items-center gap-1.5">
          <PlaybackButtons
            track={track}
            isPlaying={isPlaying}
            isPaused={isPaused}
            isEmbed={isEmbed}
            active={active}
            onPlay={onPlay}
            onPause={onPause}
            onResume={onResume}
            onStop={onStop}
          />
          <VolumeControls
            track={track}
            isDirect={isDirect}
            onValueChange={handleVolumeChange}
            onValueCommit={handleVolumeCommit}
          />
          <LoopToggle
            track={track}
            isDirect={isDirect}
            onToggle={handleLoopToggle}
          />
          <EmbedIndicator isEmbed={isEmbed} active={active} />
          <DeleteButton track={track} onDelete={onDelete} />
        </div>

        {/* Tags */}
        <TrackTags tags={track.tags} />
      </CardContent>
    </Card>
  );
}
