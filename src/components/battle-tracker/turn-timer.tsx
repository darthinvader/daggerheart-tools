import {
  Pause,
  Play,
  RotateCcw,
  Settings,
  Timer,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useTurnTimer } from '@/hooks/use-turn-timer';
import { cn } from '@/lib/utils';

// ── Audio helper (Web Audio API beep, no files) ──────────────────────

function playExpiredBeep() {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);

    // 3 short beeps: 440Hz square wave, 150ms each, 100ms gap
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.connect(gain);

      const beepStart = ctx.currentTime + i * 0.25;
      osc.start(beepStart);
      osc.stop(beepStart + 0.15);
    }

    // Close context after all beeps finish
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // Audio not available – fail silently
  }
}

// ── Formatting helper ────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Color helpers ────────────────────────────────────────────────────

function getTimerColor(progress: number): string {
  if (progress > 0.5) return 'text-green-500';
  if (progress > 0.2) return 'text-yellow-500';
  return 'text-red-500';
}

function getBarColor(progress: number): string {
  if (progress > 0.5) return 'bg-green-500';
  if (progress > 0.2) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getStrokeColor(progress: number): string {
  if (progress > 0.5) return 'stroke-green-500';
  if (progress > 0.2) return 'stroke-yellow-500';
  return 'stroke-red-500';
}

// ── Props ────────────────────────────────────────────────────────────

interface TurnTimerProps {
  /** Whether to use the compact (inline bar) display */
  compact?: boolean;
  /** External signal to auto-start (e.g. spotlight changed) */
  spotlightActive?: boolean;
  className?: string;
}

// ── Component ────────────────────────────────────────────────────────

export function TurnTimer({
  compact = false,
  spotlightActive,
  className,
}: TurnTimerProps) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [autoStart, setAutoStart] = useState(false);
  const prevSpotlightRef = useRef(spotlightActive);

  const handleExpire = useCallback(() => {
    if (audioEnabled) playExpiredBeep();
  }, [audioEnabled]);

  const {
    timeRemaining,
    isRunning,
    start,
    pause,
    reset,
    setDuration,
    progress,
    isExpired,
    totalDuration,
  } = useTurnTimer({ onExpire: handleExpire });

  const durationMinutes = Math.round(totalDuration / 60);

  // Auto-start on spotlight change
  useEffect(() => {
    if (!autoStart) {
      prevSpotlightRef.current = spotlightActive;
      return;
    }
    if (spotlightActive !== prevSpotlightRef.current && spotlightActive) {
      reset();
      // Small delay so reset state settles before starting
      queueMicrotask(start);
    }
    prevSpotlightRef.current = spotlightActive;
  }, [spotlightActive, autoStart, reset, start]);

  // ── Compact display (for battle tracker bar) ───────────────────────
  if (compact) {
    return (
      <div
        className={cn('flex items-center gap-2', className)}
        role="timer"
        aria-label={`Turn timer: ${formatTime(timeRemaining)} remaining`}
      >
        <Timer className={cn('size-4', getTimerColor(progress))} />

        {/* Mini progress bar */}
        <div className="bg-muted relative h-1.5 w-20 overflow-hidden rounded-full">
          <div
            className={cn(
              'h-full transition-[width] duration-100',
              getBarColor(progress)
            )}
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <span
          className={cn(
            'min-w-[3ch] font-mono text-xs tabular-nums',
            getTimerColor(progress),
            isExpired && 'animate-pulse'
          )}
        >
          {formatTime(timeRemaining)}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={isRunning ? pause : start}
          disabled={isExpired && !isRunning}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <Pause className="size-3" />
          ) : (
            <Play className="size-3" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={reset}
          aria-label="Reset timer"
        >
          <RotateCcw className="size-3" />
        </Button>
      </div>
    );
  }

  // ── Full display ───────────────────────────────────────────────────

  const circleRadius = 40;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      className={cn('flex flex-col items-center gap-3', className)}
      role="timer"
      aria-label={`Turn timer: ${formatTime(timeRemaining)} remaining`}
    >
      {/* Circular progress indicator */}
      <div className="relative size-28">
        <svg className="-rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={circleRadius}
            fill="none"
            className="stroke-muted"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r={circleRadius}
            fill="none"
            className={cn(
              'transition-[stroke-dashoffset] duration-100',
              getStrokeColor(progress)
            )}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Center time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              'font-mono text-xl font-semibold tabular-nums',
              getTimerColor(progress),
              isExpired && 'animate-pulse'
            )}
          >
            {formatTime(timeRemaining)}
          </span>
          {isExpired && (
            <span className="text-destructive text-[10px] font-medium uppercase">
              Time&apos;s up
            </span>
          )}
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={isRunning ? pause : start}
          disabled={isExpired && !isRunning}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={reset}
          aria-label="Reset timer"
        >
          <RotateCcw className="size-4" />
        </Button>

        {/* Settings popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Timer settings">
              <Settings className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 space-y-4" align="end">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Duration: {durationMinutes} min
              </Label>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[durationMinutes]}
                onValueChange={([val]) => {
                  if (val !== undefined) setDuration(val * 60);
                }}
                aria-label="Timer duration in minutes"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start" className="text-sm">
                Auto-start on spotlight
              </Label>
              <Switch
                id="auto-start"
                checked={autoStart}
                onCheckedChange={setAutoStart}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="audio-alert"
                className="flex items-center gap-1.5 text-sm"
              >
                {audioEnabled ? (
                  <Volume2 className="size-3.5" />
                ) : (
                  <VolumeX className="size-3.5" />
                )}
                Audio alert
              </Label>
              <Switch
                id="audio-alert"
                checked={audioEnabled}
                onCheckedChange={setAudioEnabled}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
