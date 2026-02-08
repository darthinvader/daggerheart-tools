// Lightweight audio playback engine for direct audio URLs (MP3/OGG/WAV).
// YouTube and SoundCloud are handled via iframe embeds in the UI layer.

type PlaybackEventMap = {
  play: { trackId: string };
  pause: { trackId: string };
  stop: { trackId: string };
  ended: { trackId: string };
  error: { trackId: string; message: string };
  timeupdate: { trackId: string; currentTime: number; duration: number };
};

type PlaybackEventHandler<K extends keyof PlaybackEventMap> = (
  event: PlaybackEventMap[K]
) => void;

/**
 * Manages multiple simultaneous HTML5 Audio instances for direct-URL tracks.
 * Each track is identified by its ID and can be independently controlled.
 */
class AudioEngine {
  private readonly instances = new Map<string, HTMLAudioElement>();
  private readonly listeners = new Map<
    keyof PlaybackEventMap,
    Set<PlaybackEventHandler<keyof PlaybackEventMap>>
  >();

  /** Master volume multiplier applied to all tracks (0–1). */
  private masterVolume = 1;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  play(trackId: string, url: string, volume = 0.5, loop = false): void {
    this.stop(trackId); // clean up any existing instance

    const audio = new Audio(url);
    audio.volume = Math.min(1, Math.max(0, volume * this.masterVolume));
    audio.loop = loop;
    // Removing crossOrigin = 'anonymous' allows opaque playback from non-CORS sources (e.g. Incompetech)
    // We lose ability to do Web Audio analysis, but we gain compatibility.
    // audio.crossOrigin = 'anonymous';

    audio.addEventListener('ended', () => {
      this.instances.delete(trackId);
      this.emit('ended', { trackId });
    });

    audio.addEventListener('error', () => {
      this.instances.delete(trackId);
      this.emit('error', {
        trackId,
        message: audio.error?.message ?? 'Playback failed',
      });
    });

    audio.addEventListener('timeupdate', () => {
      this.emit('timeupdate', {
        trackId,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      });
    });

    audio.dataset.trackVolume = String(volume);
    this.instances.set(trackId, audio);
    audio.play().catch(() => {
      this.emit('error', { trackId, message: 'Autoplay blocked by browser' });
    });

    this.emit('play', { trackId });
  }

  pause(trackId: string): void {
    const audio = this.instances.get(trackId);
    if (!audio) return;
    audio.pause();
    this.emit('pause', { trackId });
  }

  resume(trackId: string): void {
    const audio = this.instances.get(trackId);
    if (!audio) return;
    audio.play().catch(() => {
      this.emit('error', { trackId, message: 'Resume blocked by browser' });
    });
    this.emit('play', { trackId });
  }

  stop(trackId: string): void {
    const audio = this.instances.get(trackId);
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.src = ''; // release resources
    this.instances.delete(trackId);
    this.emit('stop', { trackId });
  }

  stopAll(): void {
    for (const id of [...this.instances.keys()]) {
      this.stop(id);
    }
  }

  // ---------------------------------------------------------------------------
  // Volume
  // ---------------------------------------------------------------------------

  setVolume(trackId: string, volume: number): void {
    const audio = this.instances.get(trackId);
    if (!audio) return;
    audio.dataset.trackVolume = String(volume);
    audio.volume = Math.min(1, Math.max(0, volume * this.masterVolume));
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.min(1, Math.max(0, volume));
    // Reapply to all playing instances
    for (const [, audio] of this.instances) {
      // We store the desired track volume as a data attribute
      const trackVol = Number(audio.dataset.trackVolume ?? 0.5);
      audio.volume = Math.min(1, Math.max(0, trackVol * this.masterVolume));
    }
  }

  setLoop(trackId: string, loop: boolean): void {
    const audio = this.instances.get(trackId);
    if (!audio) return;
    audio.loop = loop;
  }

  isPlaying(trackId: string): boolean {
    const audio = this.instances.get(trackId);
    return !!audio && !audio.paused;
  }

  isPaused(trackId: string): boolean {
    const audio = this.instances.get(trackId);
    return !!audio && audio.paused;
  }

  /** Get current playback progress for a track (returns 0 values if not found). */
  getProgress(trackId: string): { currentTime: number; duration: number } {
    const audio = this.instances.get(trackId);
    if (!audio) return { currentTime: 0, duration: 0 };
    return { currentTime: audio.currentTime, duration: audio.duration || 0 };
  }

  /** Seek to a specific time (seconds) within a track. */
  seek(trackId: string, time: number): void {
    const audio = this.instances.get(trackId);
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(time, audio.duration || 0));
  }

  // ---------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------

  on<K extends keyof PlaybackEventMap>(
    event: K,
    handler: PlaybackEventHandler<K>
  ): () => void {
    const set =
      this.listeners.get(event) ??
      new Set<PlaybackEventHandler<keyof PlaybackEventMap>>();
    set.add(handler as PlaybackEventHandler<keyof PlaybackEventMap>);
    this.listeners.set(event, set);
    return () => {
      set.delete(handler as PlaybackEventHandler<keyof PlaybackEventMap>);
    };
  }

  private emit<K extends keyof PlaybackEventMap>(
    event: K,
    data: PlaybackEventMap[K]
  ): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const handler of set) {
      handler(data);
    }
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  dispose(): void {
    this.stopAll();
    this.listeners.clear();
  }
}

/** Singleton audio engine instance shared across the app. */
export const audioEngine = new AudioEngine();
