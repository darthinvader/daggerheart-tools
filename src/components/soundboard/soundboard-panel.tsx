// Main Soundboard Panel — manages track library, playback, presets, and embedded players.

import {
  Music,
  Search,
  StopCircle,
  Volume2,
  VolumeX,
  Waves,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  createSoundboardPreset,
  createSoundboardTrack,
  type CreateTrackInput,
  deleteSoundboardPreset,
  deleteSoundboardTrack,
  listSoundboardPresets,
  listSoundboardTracks,
  updateSoundboardTrack,
} from '@/features/soundboard/soundboard-storage';
import type {
  SoundboardPreset,
  SoundboardTrack,
  TrackCategory,
} from '@/lib/schemas/soundboard';
import AddTrackDialog from './add-track-dialog';
import EmbedPlayer from './embed-player';
import { formatTime } from './format-time';
import PresetManager from './preset-manager';
import TrackCard from './track-card';
import { useSoundboardPlayer } from './use-soundboard-player';

const CATEGORY_FILTERS: Array<{
  value: TrackCategory | 'all';
  label: string;
  icon: React.ReactNode;
}> = [
  { value: 'all', label: 'All', icon: <Music className="size-3.5" /> },
  { value: 'ambient', label: 'Ambient', icon: <Waves className="size-3.5" /> },
  { value: 'music', label: 'Music', icon: <Music className="size-3.5" /> },
  { value: 'sfx', label: 'SFX', icon: <Zap className="size-3.5" /> },
];

type EmbedTrackInfo = { url: string; name: string; loop: boolean };

// eslint-disable-next-line max-lines-per-function
export default function SoundboardPanel() {
  const [tracks, setTracks] = useState<SoundboardTrack[]>([]);
  const [presets, setPresets] = useState<SoundboardPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TrackCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [embedTracks, setEmbedTracks] = useState<Map<string, EmbedTrackInfo>>(
    new Map()
  );

  const player = useSoundboardPlayer();

  const addEmbed = (id: string, info: EmbedTrackInfo) =>
    setEmbedTracks(prev => {
      const next = new Map(prev);
      next.set(id, info);
      return next;
    });

  const removeEmbed = (id: string) =>
    setEmbedTracks(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });

  // ---------------------------------------------------------------------------
  // Data loading
  // ---------------------------------------------------------------------------

  const loadData = useCallback(async () => {
    try {
      const [trackData, presetData] = await Promise.all([
        listSoundboardTracks(),
        listSoundboardPresets(),
      ]);
      setTracks(trackData);
      setPresets(presetData);
    } catch {
      toast.error('Failed to load soundboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---------------------------------------------------------------------------
  // Filtered tracks
  // ---------------------------------------------------------------------------

  const filteredTracks = useMemo(() => {
    let result = tracks;
    if (filter !== 'all') {
      result = result.filter(t => t.category === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [tracks, filter, searchQuery]);

  // ---------------------------------------------------------------------------
  // Track CRUD
  // ---------------------------------------------------------------------------

  const handleAddTrack = useCallback(
    async (input: Omit<CreateTrackInput, 'volume'>) => {
      try {
        const track = await createSoundboardTrack({ ...input, volume: 0.5 });
        setTracks(prev => [track, ...prev]);
        toast.success(`Added "${track.name}"`);
      } catch {
        toast.error('Failed to add track');
      }
    },
    []
  );

  const handleDeleteTrack = useCallback(
    async (trackId: string) => {
      try {
        player.stop(trackId);
        removeEmbed(trackId);
        await deleteSoundboardTrack(trackId);
        setTracks(prev => prev.filter(t => t.id !== trackId));
        toast.success('Track removed');
      } catch {
        toast.error('Failed to delete track');
      }
    },
    [player]
  );

  // ---------------------------------------------------------------------------
  // Playback
  // ---------------------------------------------------------------------------

  const handlePlay = useCallback(
    (track: SoundboardTrack) => {
      if (track.source === 'direct') {
        player.play(track.id, track.url, track.volume, track.loop);
      } else {
        // YouTube / SoundCloud — open embed player
        addEmbed(track.id, {
          url: track.url,
          name: track.name,
          loop: track.loop,
        });
      }
    },
    [player]
  );

  const handlePause = useCallback(
    (trackId: string) => {
      player.pause(trackId);
    },
    [player]
  );

  const handleResume = useCallback(
    (trackId: string) => {
      player.resume(trackId);
    },
    [player]
  );

  const handleStop = useCallback(
    (trackId: string) => {
      player.stop(trackId);
      removeEmbed(trackId);
    },
    [player]
  );

  const handleVolumeChange = useCallback(
    async (trackId: string, volume: number) => {
      player.setVolume(trackId, volume);
      try {
        await updateSoundboardTrack(trackId, { volume });
        setTracks(prev =>
          prev.map(t => (t.id === trackId ? { ...t, volume } : t))
        );
      } catch {
        // Volume save is non-critical — silent fail
      }
    },
    [player]
  );

  const handleVolumePreview = useCallback(
    (trackId: string, volume: number) => {
      player.setVolume(trackId, volume);
      setTracks(prev =>
        prev.map(t => (t.id === trackId ? { ...t, volume } : t))
      );
    },
    [player]
  );

  const handleLoopChange = useCallback(
    async (trackId: string, loop: boolean) => {
      player.setLoop(trackId, loop);
      try {
        await updateSoundboardTrack(trackId, { loop });
        setTracks(prev =>
          prev.map(t => (t.id === trackId ? { ...t, loop } : t))
        );
      } catch {
        // Loop save is non-critical — silent fail
      }
    },
    [player]
  );

  const handleSeek = useCallback(
    (trackId: string, time: number) => {
      player.seek(trackId, time);
    },
    [player]
  );

  const handleStopAll = useCallback(() => {
    player.stopAll();
    setEmbedTracks(new Map());
  }, [player]);

  // ---------------------------------------------------------------------------
  // Presets
  // ---------------------------------------------------------------------------

  const handleSavePreset = useCallback(
    async (name: string, description: string) => {
      const trackEntries = tracks
        .filter(
          t =>
            player.isPlaying(t.id) ||
            player.isPaused(t.id) ||
            embedTracks.has(t.id)
        )
        .map(t => ({ trackId: t.id, volume: t.volume, loop: t.loop }));

      if (trackEntries.length === 0) {
        toast.error('No tracks are currently playing to save');
        return;
      }

      try {
        const preset = await createSoundboardPreset({
          name,
          description,
          tracks: trackEntries,
        });
        setPresets(prev => [preset, ...prev]);
        toast.success(`Saved scene "${name}"`);
      } catch {
        toast.error('Failed to save scene');
      }
    },
    [tracks, player, embedTracks]
  );

  const handleLoadPreset = useCallback(
    (preset: SoundboardPreset) => {
      // Stop everything first
      handleStopAll();

      // Play each track in the preset
      for (const entry of preset.tracks) {
        const track = tracks.find(t => t.id === entry.trackId);
        if (!track) continue;

        if (track.source === 'direct') {
          player.play(track.id, track.url, entry.volume, entry.loop);
        } else {
          addEmbed(track.id, {
            url: track.url,
            name: track.name,
            loop: entry.loop,
          });
        }
      }

      toast.success(`Loaded scene "${preset.name}"`);
    },
    [tracks, player, handleStopAll]
  );

  const handleDeletePreset = useCallback(async (presetId: string) => {
    try {
      await deleteSoundboardPreset(presetId);
      setPresets(prev => prev.filter(p => p.id !== presetId));
      toast.success('Scene deleted');
    } catch {
      toast.error('Failed to delete scene');
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const renderTrackContent = () => {
    if (filteredTracks.length > 0) {
      return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTracks.map(track => (
            <TrackCard
              key={track.id}
              track={track}
              isPlaying={
                player.isPlaying(track.id) || embedTracks.has(track.id)
              }
              isPaused={player.isPaused(track.id)}
              isEmbed={track.source !== 'direct'}
              progress={player.getProgress(track.id)}
              onPlay={handlePlay}
              onPause={handlePause}
              onResume={handleResume}
              onStop={handleStop}
              onVolumePreview={handleVolumePreview}
              onVolumeChange={handleVolumeChange}
              onLoopChange={handleLoopChange}
              onSeek={handleSeek}
              onDelete={handleDeleteTrack}
            />
          ))}
        </div>
      );
    }

    if (tracks.length === 0) {
      return (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Music className="text-muted-foreground size-12" />
          <div>
            <p className="font-medium">No tracks yet</p>
            <p className="text-muted-foreground text-sm">
              Add YouTube links, SoundCloud tracks, or direct audio URLs to
              build your soundboard.
            </p>
          </div>
          <AddTrackDialog onAdd={handleAddTrack} />
        </div>
      );
    }

    return (
      <p className="text-muted-foreground py-6 text-center text-sm">
        No tracks match your search.
      </p>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-muted h-8 w-48 animate-pulse rounded" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-muted h-28 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Master volume */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() =>
                  player.setMasterVolume(player.masterVolume > 0 ? 0 : 1)
                }
                className="text-muted-foreground hover:text-foreground"
                aria-label="Toggle master mute"
              >
                {player.masterVolume > 0 ? (
                  <Volume2 className="size-4" />
                ) : (
                  <VolumeX className="size-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>Master Volume</TooltipContent>
          </Tooltip>
          <Slider
            value={[player.masterVolume]}
            min={0}
            max={1}
            step={0.05}
            onValueChange={v => player.setMasterVolume(v[0])}
            className="w-24"
            aria-label="Master volume"
          />
          <span className="text-muted-foreground w-8 text-xs">
            {Math.round(player.masterVolume * 100)}%
          </span>
        </div>

        {/* Stop all */}
        {player.playingCount > 0 && (
          <Button
            size="sm"
            variant="destructive"
            onClick={handleStopAll}
            aria-label="Stop all tracks"
          >
            <StopCircle className="mr-1 size-4" />
            Stop All
          </Button>
        )}

        <div className="flex-1" />

        {/* Actions */}
        <PresetManager
          presets={presets}
          tracks={tracks}
          onSave={handleSavePreset}
          onLoad={handleLoadPreset}
          onDelete={handleDeletePreset}
        />
        <AddTrackDialog onAdd={handleAddTrack} />
      </div>

      {/* Search + category filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search tracks…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8"
            aria-label="Search tracks"
          />
        </div>
        <div className="flex gap-1">
          {CATEGORY_FILTERS.map(cat => (
            <Button
              key={cat.value}
              size="sm"
              variant={filter === cat.value ? 'default' : 'outline'}
              onClick={() => setFilter(cat.value)}
              aria-label={`Filter by ${cat.label}`}
            >
              {cat.icon}
              <span className="ml-1 hidden sm:inline">{cat.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Active playing count badge */}
      {(player.playingCount > 0 || embedTracks.size > 0) && (
        <Badge variant="secondary">
          🎵 {player.playingCount + embedTracks.size} track
          {player.playingCount + embedTracks.size !== 1 ? 's' : ''} playing
        </Badge>
      )}

      {/* Now-playing mini bar */}
      {player.playingCount > 0 && (
        <div className="bg-muted/50 flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2">
          <span className="text-muted-foreground text-xs font-medium">
            Now Playing:
          </span>
          {tracks
            .filter(t => player.isPlaying(t.id) || player.isPaused(t.id))
            .map(t => {
              const prog = player.getProgress(t.id);
              return (
                <Badge
                  key={t.id}
                  variant={player.isPaused(t.id) ? 'outline' : 'default'}
                  className="gap-1 text-xs"
                >
                  {t.name}
                  {prog.duration > 0 && (
                    <span className="opacity-70">
                      {formatTime(prog.currentTime)}/{formatTime(prog.duration)}
                    </span>
                  )}
                </Badge>
              );
            })}
        </div>
      )}

      {/* Embed players (YouTube / SoundCloud) */}
      {embedTracks.size > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[...embedTracks.entries()].map(([id, info]) => (
            <EmbedPlayer
              key={id}
              url={info.url}
              trackName={info.name}
              loop={info.loop}
              onClose={() => handleStop(id)}
            />
          ))}
        </div>
      )}

      {/* Track grid */}
      {renderTrackContent()}
    </div>
  );
}
