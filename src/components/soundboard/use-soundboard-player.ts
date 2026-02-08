// React hook wrapping the AudioEngine singleton with React state for re-renders.

import { useCallback, useEffect, useRef, useState } from 'react';
import { audioEngine } from '@/features/soundboard/audio-engine';

interface PlaybackState {
  /** Set of currently playing track IDs */
  playing: Set<string>;
  /** Set of currently paused track IDs */
  paused: Set<string>;
}

interface TrackProgress {
  currentTime: number;
  duration: number;
}

/**
 * Provides reactive playback controls backed by the singleton AudioEngine.
 * Components calling this hook will re-render when play/pause/stop events occur.
 */
export function useSoundboardPlayer() {
  const [state, setState] = useState<PlaybackState>({
    playing: new Set(),
    paused: new Set(),
  });

  const [masterVolume, setMasterVolumeState] = useState(1);
  const [progress, setProgress] = useState<Map<string, TrackProgress>>(
    new Map()
  );

  // Throttle timeupdate to ~4 fps to avoid excessive re-renders
  const lastUpdate = useRef(0);

  // Subscribe to engine events
  useEffect(() => {
    const unsubPlay = audioEngine.on('play', ({ trackId }) => {
      setState(prev => {
        const playing = new Set(prev.playing);
        const paused = new Set(prev.paused);
        playing.add(trackId);
        paused.delete(trackId);
        return { playing, paused };
      });
    });

    const unsubPause = audioEngine.on('pause', ({ trackId }) => {
      setState(prev => {
        const playing = new Set(prev.playing);
        const paused = new Set(prev.paused);
        playing.delete(trackId);
        paused.add(trackId);
        return { playing, paused };
      });
    });

    const unsubStop = audioEngine.on('stop', ({ trackId }) => {
      setState(prev => {
        const playing = new Set(prev.playing);
        const paused = new Set(prev.paused);
        playing.delete(trackId);
        paused.delete(trackId);
        return { playing, paused };
      });
      setProgress(prev => {
        const next = new Map(prev);
        next.delete(trackId);
        return next;
      });
    });

    const unsubEnded = audioEngine.on('ended', ({ trackId }) => {
      setState(prev => {
        const playing = new Set(prev.playing);
        const paused = new Set(prev.paused);
        playing.delete(trackId);
        paused.delete(trackId);
        return { playing, paused };
      });
      setProgress(prev => {
        const next = new Map(prev);
        next.delete(trackId);
        return next;
      });
    });

    const unsubTime = audioEngine.on(
      'timeupdate',
      ({ trackId, currentTime, duration }) => {
        const now = Date.now();
        if (now - lastUpdate.current < 250) return; // ~4 fps
        lastUpdate.current = now;
        setProgress(prev => {
          const next = new Map(prev);
          next.set(trackId, { currentTime, duration });
          return next;
        });
      }
    );

    return () => {
      unsubPlay();
      unsubPause();
      unsubStop();
      unsubEnded();
      unsubTime();
    };
  }, []);

  const play = useCallback(
    (trackId: string, url: string, volume = 0.5, loop = false) => {
      audioEngine.play(trackId, url, volume, loop);
    },
    []
  );

  const pause = useCallback((trackId: string) => {
    audioEngine.pause(trackId);
  }, []);

  const resume = useCallback((trackId: string) => {
    audioEngine.resume(trackId);
  }, []);

  const stop = useCallback((trackId: string) => {
    audioEngine.stop(trackId);
  }, []);

  const stopAll = useCallback(() => {
    audioEngine.stopAll();
    setProgress(new Map());
  }, []);

  const setVolume = useCallback((trackId: string, volume: number) => {
    audioEngine.setVolume(trackId, volume);
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    setMasterVolumeState(volume);
    audioEngine.setMasterVolume(volume);
  }, []);

  const setLoop = useCallback((trackId: string, loop: boolean) => {
    audioEngine.setLoop(trackId, loop);
  }, []);

  const seek = useCallback((trackId: string, time: number) => {
    audioEngine.seek(trackId, time);
  }, []);

  const isPlaying = useCallback(
    (trackId: string) => state.playing.has(trackId),
    [state.playing]
  );

  const isPaused = useCallback(
    (trackId: string) => state.paused.has(trackId),
    [state.paused]
  );

  const getProgress = useCallback(
    (trackId: string): TrackProgress =>
      progress.get(trackId) ?? { currentTime: 0, duration: 0 },
    [progress]
  );

  return {
    play,
    pause,
    resume,
    stop,
    stopAll,
    setVolume,
    setLoop,
    setMasterVolume,
    seek,
    masterVolume,
    isPlaying,
    isPaused,
    playingCount: state.playing.size,
    getProgress,
  };
}
