import {
  CircleDot,
  Crosshair,
  Dices,
  Flame,
  Gauge,
  Leaf,
  Minus,
  Moon,
  Pencil,
  Plus,
  RotateCcw,
  Skull,
  Sparkles,
  Swords,
  Timer,
  X,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DIFFICULTY_LEVELS } from '@/lib/data/core/difficulty';
import { cn } from '@/lib/utils';
import type { FearGainResult } from '../rest';
import GlobalSaveDC from './global-save-dc';
import { PartyRestDialog } from './party-rest-dialog';
import { TurnTimer } from './turn-timer';
import type {
  AdversaryTracker,
  EnvironmentTracker,
  TrackerSelection,
} from './types';

type Selection = TrackerSelection | null;
type Spotlight = { id: string; kind: string } | null;

// ============== Type Icons ==============
const ENVIRONMENT_TYPE_ICONS: Record<string, string> = {
  Exploration: '🗺️',
  Social: '💬',
  Event: '⚡',
  Traversal: '🚶',
};

function useGmDieRoll() {
  const [gmDieResult, setGmDieResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const rollGmDie = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsRolling(true);
    setGmDieResult(null);
    let count = 0;
    intervalRef.current = setInterval(() => {
      setGmDieResult(Math.floor(Math.random() * 20) + 1);
      count++;
      if (count >= 8) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setGmDieResult(Math.floor(Math.random() * 20) + 1);
        setIsRolling(false);
      }
    }, 80);
  }, []);

  return { gmDieResult, isRolling, rollGmDie };
}

function FearCounter({
  fearPool,
  maxFear,
  characterCount,
  onFearChange,
}: {
  fearPool: number;
  maxFear: number;
  characterCount: number;
  onFearChange: (value: number) => void;
}) {
  const isFull = fearPool >= maxFear;
  const isEmpty = fearPool <= 0;
  const hasSubstantialFear = fearPool >= 3;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex min-h-14 items-center gap-3 rounded-xl border-2 px-4 py-2 shadow-md transition-all',
              hasSubstantialFear
                ? 'animate-glow-fear border-purple-500/60 bg-gradient-to-r from-purple-600/25 via-violet-500/20 to-purple-600/25 shadow-purple-500/20'
                : 'border-purple-500/40 bg-gradient-to-r from-purple-500/15 to-violet-500/15',
              isFull && 'border-purple-400 shadow-lg shadow-purple-500/30'
            )}
          >
            {/* Icon and Label */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg',
                  hasSubstantialFear ? 'bg-purple-500/30' : 'bg-purple-500/20'
                )}
              >
                <Skull
                  className={cn(
                    'size-5',
                    hasSubstantialFear ? 'text-purple-400' : 'text-purple-500'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-base font-black tracking-wide',
                  hasSubstantialFear
                    ? 'text-purple-400'
                    : 'text-purple-600 dark:text-purple-400'
                )}
              >
                FEAR
              </span>
            </div>

            {/* Counter Controls */}
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className={cn(
                  'size-8 border-2 border-purple-400/50 hover:border-purple-400 hover:bg-purple-500/30',
                  !isEmpty && 'bg-purple-500/10'
                )}
                onClick={e => {
                  e.stopPropagation();
                  onFearChange(Math.max(0, fearPool - 1));
                }}
                disabled={isEmpty}
                aria-label="Decrease fear"
              >
                <Minus className="size-4" />
              </Button>

              <div className="flex min-w-[3rem] items-baseline justify-center gap-1">
                <span
                  className={cn(
                    'text-3xl font-black tabular-nums',
                    hasSubstantialFear
                      ? 'text-purple-300'
                      : 'text-purple-600 dark:text-purple-400',
                    isFull && 'text-purple-300'
                  )}
                >
                  {fearPool}
                </span>
              </div>

              <Button
                size="icon"
                variant="outline"
                className={cn(
                  'size-8 border-2 border-purple-400/50 hover:border-purple-400 hover:bg-purple-500/30',
                  !isFull && 'bg-purple-500/10'
                )}
                onClick={e => {
                  e.stopPropagation();
                  onFearChange(Math.min(maxFear, fearPool + 1));
                }}
                disabled={isFull}
                aria-label="Increase fear"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            {/* Reset Button */}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs font-medium text-purple-500 hover:bg-purple-500/20 hover:text-purple-400"
              onClick={e => {
                e.stopPropagation();
                onFearChange(characterCount);
              }}
            >
              Reset
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-popover text-popover-foreground max-w-xs border-purple-500/30 p-3"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b border-purple-500/20 pb-2">
              <Skull className="size-4 text-purple-500" />
              <span className="font-bold text-purple-600 dark:text-purple-400">
                Fear Pool
              </span>
            </div>
            <p className="text-sm">Spend Fear to empower adversaries:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 text-purple-500">•</span>
                <span>
                  <strong>+1 Experience</strong> to an adversary roll per Fear
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 text-purple-500">•</span>
                <span>
                  <strong>Activate Fear Features</strong> on adversaries
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 text-purple-500">•</span>
                <span>
                  <strong>Trigger reactions</strong> outside normal turns
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 text-purple-500">•</span>
                <span>
                  <strong>Escalate tension</strong> with dramatic GM moves
                </span>
              </li>
            </ul>
            <p className="border-t border-purple-500/20 pt-2 text-xs">
              Starting Fear = PC count ({characterCount}). No hard cap in rules.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function GmDieRoller({
  gmDieResult,
  isRolling,
  onRoll,
}: {
  gmDieResult: number | null;
  isRolling: boolean;
  onRoll: () => void;
}) {
  return (
    <div className="flex min-h-13 items-center gap-2 rounded-lg border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-2.5 py-2">
      <div className="flex items-center gap-1">
        <Dices className="size-4 text-blue-500" />
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
          GM Die
        </span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className={`h-7 min-w-12 border-blue-300 hover:bg-blue-500/20 ${isRolling ? 'animate-pulse' : ''}`}
              onClick={onRoll}
              disabled={isRolling}
            >
              {gmDieResult !== null ? (
                <span
                  className={`text-base font-bold ${gmDieResult === 20 ? 'text-green-500' : gmDieResult === 1 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}
                >
                  {gmDieResult}
                </span>
              ) : (
                <span className="text-muted-foreground text-sm">d20</span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Roll the GM's d20 for adversary attacks</p>
            {gmDieResult === 20 && (
              <p className="font-bold text-green-500">Critical Success!</p>
            )}
            {gmDieResult === 1 && (
              <p className="text-red-500">Critical Failure</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function MassiveToggle({
  useMassiveThreshold,
  onUseMassiveThresholdChange,
}: {
  useMassiveThreshold: boolean;
  onUseMassiveThresholdChange: (value: boolean) => void;
}) {
  return (
    <div className="flex min-h-13 items-center gap-2 rounded-lg border-2 border-red-500/30 bg-gradient-to-r from-red-500/10 to-orange-500/10 px-2.5 py-2">
      <div className="flex items-center gap-2">
        <Flame className="size-4 text-red-500" />
        <Label
          htmlFor="massive-toggle"
          className="cursor-pointer text-sm font-bold text-red-600 dark:text-red-400"
        >
          Massive
        </Label>
        <Switch
          id="massive-toggle"
          checked={useMassiveThreshold}
          onCheckedChange={onUseMassiveThresholdChange}
        />
      </div>
    </div>
  );
}

function DifficultyReference() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="min-h-13 gap-1.5 rounded-lg border-2 border-sky-500/30 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 px-2.5 text-sky-600 hover:bg-sky-500/20 hover:text-sky-700 dark:text-sky-400"
        >
          <Gauge className="size-4" />
          <span className="text-sm font-bold">Difficulty</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="border-b bg-gradient-to-r from-sky-500/10 to-cyan-500/10 px-4 py-3">
          <h4 className="flex items-center gap-2 font-semibold text-sky-700 dark:text-sky-300">
            <Gauge className="size-4" />
            Difficulty Quick Reference
          </h4>
          <p className="text-muted-foreground mt-1 text-xs">
            Target numbers for action rolls
          </p>
        </div>
        <div className="grid gap-1 p-2">
          {DIFFICULTY_LEVELS.map(level => (
            <div
              key={level.value}
              className="hover:bg-muted/50 flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
            >
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg font-bold',
                  level.value <= 10
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : level.value <= 15
                      ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400'
                      : level.value <= 20
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        : level.value <= 25
                          ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                          : 'bg-red-500/20 text-red-600 dark:text-red-400'
                )}
              >
                {level.value}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn('text-sm font-medium', level.colorClass)}>
                  {level.name}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {level.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t px-4 py-2">
          <p className="text-muted-foreground text-[10px] leading-tight">
            Values between ladder steps work fine. Let Experiences lower
            effective Difficulty when applicable.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function EnvironmentCountdownControl({
  environment,
  onEnvironmentChange,
}: {
  environment: EnvironmentTracker;
  onEnvironmentChange: (
    id: string,
    fn: (e: EnvironmentTracker) => EnvironmentTracker
  ) => void;
}) {
  const countdown = environment.countdown ?? 0;
  const countdownEnabled = environment.countdownEnabled ?? false;
  const isZero = countdown === 0 && countdownEnabled;

  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded border px-1.5 py-0.5 transition-all',
        countdownEnabled
          ? 'border-emerald-300/50 bg-emerald-500/10'
          : 'border-muted bg-muted/30 opacity-50',
        isZero && 'animate-pulse border-amber-500 bg-amber-500/20'
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() =>
                onEnvironmentChange(environment.id, e => ({
                  ...e,
                  countdownEnabled: !e.countdownEnabled,
                }))
              }
              className={cn(
                'flex size-4 items-center justify-center rounded-sm border transition-colors',
                countdownEnabled
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-muted-foreground'
              )}
            >
              {countdownEnabled && <span className="text-[10px]">✓</span>}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {countdownEnabled ? 'Disable countdown' : 'Enable countdown'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        size="icon"
        variant="ghost"
        className="size-5 hover:bg-emerald-500/20"
        disabled={!countdownEnabled}
        onClick={() =>
          onEnvironmentChange(environment.id, e => ({
            ...e,
            countdown: Math.max(0, (e.countdown ?? 0) - 1),
          }))
        }
        aria-label="Decrease countdown"
      >
        <Minus className="size-3" />
      </Button>
      <span
        className={cn(
          'min-w-[1.5ch] text-center text-sm font-medium',
          countdownEnabled
            ? 'text-emerald-700 dark:text-emerald-400'
            : 'text-muted-foreground',
          isZero && 'text-amber-500'
        )}
      >
        {countdown}
      </span>
      <Button
        size="icon"
        variant="ghost"
        className="size-5 hover:bg-emerald-500/20"
        disabled={!countdownEnabled}
        onClick={() =>
          onEnvironmentChange(environment.id, e => ({
            ...e,
            countdown: (e.countdown ?? 0) + 1,
          }))
        }
        aria-label="Increase countdown"
      >
        <Plus className="size-3" />
      </Button>
    </div>
  );
}

function ActiveEnvironmentPanel({
  environment,
  selection,
  spotlight,
  onSelectEnvironment,
  onRemoveEnvironment,
  onSpotlightEnvironment,
  onEditEnvironment,
  onEnvironmentChange,
}: {
  environment: EnvironmentTracker;
  selection: Selection | null;
  spotlight: Spotlight | null;
  onSelectEnvironment: (env: EnvironmentTracker) => void;
  onRemoveEnvironment: (env: EnvironmentTracker) => void;
  onSpotlightEnvironment: (env: EnvironmentTracker) => void;
  onEditEnvironment: (env: EnvironmentTracker) => void;
  onEnvironmentChange: (
    id: string,
    fn: (e: EnvironmentTracker) => EnvironmentTracker
  ) => void;
}) {
  return (
    <div
      className={`flex min-h-13 items-center gap-2 rounded-lg border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-2.5 py-2 ${
        spotlight?.id === environment.id && spotlight.kind === 'environment'
          ? 'ring-2 ring-amber-400'
          : ''
      } ${selection?.id === environment.id && selection.kind === 'environment' ? 'ring-primary ring-2' : ''}`}
    >
      <button
        onClick={() => onSelectEnvironment(environment)}
        className="flex items-center gap-1.5 text-left"
      >
        <span className="text-base">
          {ENVIRONMENT_TYPE_ICONS[environment.source.type] ?? '🌲'}
        </span>
        <div className="min-w-0">
          <p className="max-w-30 truncate text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {environment.source.name}
          </p>
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <span>T{environment.source.tier}</span>
            <span>·</span>
            <Crosshair className="size-3" />
            <span>{environment.source.difficulty}</span>
            <span>·</span>
            <Zap className="size-3" />
            <span>
              {environment.features.filter(f => f.active).length}/
              {environment.features.length}
            </span>
          </div>
        </div>
      </button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-20 cursor-help text-[10px] text-emerald-600 dark:text-emerald-400">
              <p className="truncate italic">
                "{environment.source.impulses[0]}"
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="mb-1 font-medium">Impulses:</p>
            <ul className="list-inside list-disc space-y-0.5 text-xs">
              {environment.source.impulses.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex items-center gap-0.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-5 text-amber-500 hover:text-amber-600"
                onClick={() => onSpotlightEnvironment(environment)}
              >
                <Sparkles className="size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Spotlight</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground size-5"
          onClick={() => onEditEnvironment(environment)}
        >
          <Pencil className="size-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive size-5"
          onClick={() => onRemoveEnvironment(environment)}
        >
          <X className="size-3" />
        </Button>
      </div>
      <EnvironmentCountdownControl
        environment={environment}
        onEnvironmentChange={onEnvironmentChange}
      />
    </div>
  );
}

function EmptyEnvironmentPanel({
  onAddEnvironment,
}: {
  onAddEnvironment: () => void;
}) {
  return (
    <button
      className="flex min-h-13 cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 px-2.5 py-2 transition-colors hover:bg-emerald-500/10"
      onClick={onAddEnvironment}
    >
      <div className="flex items-center gap-1">
        <Leaf className="size-4 text-emerald-500" />
        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
          Env
        </span>
      </div>
      <Badge variant="outline" className="border-emerald-300 text-emerald-600">
        <Plus className="mr-0.5 size-3" /> Add
      </Badge>
    </button>
  );
}

// =====================================================================================
// Action Token Tracker
// =====================================================================================

function ActionTokenTracker({ characterCount }: { characterCount: number }) {
  const [spentTokens, setSpentTokens] = useState<boolean[]>([]);

  // Derive effective tokens at render time instead of using useEffect+setState
  const effectiveTokens = useMemo(() => {
    if (spentTokens.length === characterCount) return spentTokens;
    return Array.from(
      { length: characterCount },
      (_, i) => spentTokens[i] ?? false
    );
  }, [characterCount, spentTokens]);

  const allSpent =
    characterCount > 0 &&
    effectiveTokens.length === characterCount &&
    effectiveTokens.every(Boolean);
  const spentCount = effectiveTokens.filter(Boolean).length;

  const toggleToken = (index: number) => {
    setSpentTokens(
      Array.from({ length: characterCount }, (_, i) =>
        i === index ? !effectiveTokens[i] : (effectiveTokens[i] ?? false)
      )
    );
  };

  const resetTokens = () => {
    setSpentTokens(Array.from({ length: characterCount }, () => false));
  };

  if (characterCount === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex min-h-14 items-center gap-3 rounded-xl border-2 px-4 py-2 shadow-md transition-all',
              allSpent
                ? 'animate-pulse border-amber-500/60 bg-gradient-to-r from-amber-600/25 via-yellow-500/20 to-amber-600/25 shadow-amber-500/20'
                : 'border-cyan-500/40 bg-gradient-to-r from-cyan-500/15 to-sky-500/15'
            )}
          >
            {/* Icon and Label */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg',
                  allSpent ? 'bg-amber-500/30' : 'bg-cyan-500/20'
                )}
              >
                <CircleDot
                  className={cn(
                    'size-5',
                    allSpent ? 'text-amber-400' : 'text-cyan-500'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-xs font-black tracking-wide',
                  allSpent
                    ? 'text-amber-400'
                    : 'text-cyan-600 dark:text-cyan-400'
                )}
              >
                TOKENS
              </span>
            </div>

            {/* Token Dots */}
            <div className="flex items-center gap-1.5">
              {effectiveTokens.map((spent, i) => (
                <button
                  key={i}
                  onClick={e => {
                    e.stopPropagation();
                    toggleToken(i);
                  }}
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full border-2 transition-all hover:scale-110',
                    spent
                      ? 'border-gray-500/50 bg-gray-500/20 text-gray-500'
                      : 'border-cyan-400/60 bg-cyan-500/20 text-cyan-400 shadow-sm shadow-cyan-500/20'
                  )}
                  aria-label={`Action token ${i + 1}: ${spent ? 'spent' : 'available'}`}
                >
                  <CircleDot className={cn('size-4', spent && 'opacity-30')} />
                </button>
              ))}
            </div>

            {/* Count */}
            <span
              className={cn(
                'text-xs font-bold tabular-nums',
                allSpent ? 'text-amber-400' : 'text-cyan-600 dark:text-cyan-400'
              )}
            >
              {spentCount}/{characterCount}
            </span>

            {/* GM Turn Indicator */}
            {allSpent && (
              <Badge
                variant="outline"
                className="animate-bounce border-amber-400 bg-amber-500/20 text-xs font-bold text-amber-300"
              >
                GM Turn
              </Badge>
            )}

            {/* Reset Button */}
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                'h-7 gap-1 px-2 text-xs font-medium',
                allSpent
                  ? 'text-amber-400 hover:bg-amber-500/20 hover:text-amber-300'
                  : 'text-cyan-500 hover:bg-cyan-500/20 hover:text-cyan-400'
              )}
              onClick={e => {
                e.stopPropagation();
                resetTokens();
              }}
              disabled={spentCount === 0}
            >
              <RotateCcw className="size-3" />
              Reset
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-popover text-popover-foreground max-w-xs border-cyan-500/30 p-3"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
              <CircleDot className="size-4 text-cyan-500" />
              <span className="font-bold text-cyan-600 dark:text-cyan-400">
                Action Tokens
              </span>
            </div>
            <p className="text-sm">
              Click tokens to mark them as spent when players act.
            </p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 text-cyan-500">&bull;</span>
                <span>
                  One token per player character ({characterCount} total)
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 text-cyan-500">&bull;</span>
                <span>When a PC acts, spend their token</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 text-cyan-500">&bull;</span>
                <span>
                  When all tokens are spent, it's the{' '}
                  <strong>GM&apos;s turn</strong>
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5 text-cyan-500">&bull;</span>
                <span>
                  After the GM acts, <strong>Reset</strong> the tokens
                </span>
              </li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// =====================================================================================
// GM Resources Bar - Fear, GM Die, Environment
// =====================================================================================

export function GMResourcesBar({
  characterCount,
  environments,
  adversaries,
  fearPool,
  maxFear: maxFearProp,
  selection,
  spotlight,
  useMassiveThreshold,
  onFearChange,
  onUseMassiveThresholdChange,
  onAddEnvironment,
  onSelectEnvironment,
  onRemoveEnvironment,
  onSpotlightEnvironment,
  onEditEnvironment,
  onEnvironmentChange,
  onAdversaryChange: _onAdversaryChange,
  onReduceAllCountdowns,
}: {
  characterCount: number;
  environments: EnvironmentTracker[];
  adversaries: AdversaryTracker[];
  fearPool: number;
  /**
   * Maximum fear pool size. If not provided, defaults to 2 * characterCount.
   * Per Daggerheart rules, fear caps are typically based on party size.
   */
  maxFear?: number;
  selection: Selection | null;
  spotlight: Spotlight | null;
  useMassiveThreshold: boolean;
  onFearChange: (value: number) => void;
  onUseMassiveThresholdChange: (value: boolean) => void;
  onAddEnvironment: () => void;
  onSelectEnvironment: (env: EnvironmentTracker) => void;
  onRemoveEnvironment: (env: EnvironmentTracker) => void;
  onSpotlightEnvironment: (env: EnvironmentTracker) => void;
  onEditEnvironment: (env: EnvironmentTracker) => void;
  onEnvironmentChange: (
    id: string,
    fn: (e: EnvironmentTracker) => EnvironmentTracker
  ) => void;
  onAdversaryChange: (
    id: string,
    fn: (a: AdversaryTracker) => AdversaryTracker
  ) => void;
  onReduceAllCountdowns: () => void;
}) {
  // Note: onAdversaryChange kept for future use but countdown reduction handled by onReduceAllCountdowns
  // Fear has no hard cap in Daggerheart rules - use a high default (99) for practical display
  // If maxFearProp is provided, use that; otherwise Fear is effectively unlimited
  const maxFear = maxFearProp ?? 99;
  const activeEnvironment = environments[0] ?? null;
  const { gmDieResult, isRolling, rollGmDie } = useGmDieRoll();

  // Party Rest dialog state
  const [isPartyRestOpen, setIsPartyRestOpen] = useState(false);
  // Global Save DC state
  const [saveDC, setSaveDC] = useState(15);

  // Handle party rest completion - auto-add Fear to pool
  const handlePartyRestComplete = useCallback(
    (fearGain: FearGainResult) => {
      const newFear = Math.min(maxFear, fearPool + fearGain.total);
      onFearChange(newFear);
    },
    [fearPool, maxFear, onFearChange]
  );

  // Count how many enabled countdowns exist
  const enabledCountdowns =
    environments.filter(e => e.countdownEnabled).length +
    adversaries.filter(a => a.countdownEnabled).length;

  return (
    <Card className="border-muted-foreground/20 from-muted/30 via-background to-muted/30 mb-4 border-2 border-dashed bg-gradient-to-r">
      <CardContent className="flex flex-wrap items-center justify-center gap-2 px-3 py-3">
        <FearCounter
          fearPool={fearPool}
          maxFear={maxFear}
          characterCount={characterCount}
          onFearChange={onFearChange}
        />
        <ActionTokenTracker characterCount={characterCount} />
        <GmDieRoller
          gmDieResult={gmDieResult}
          isRolling={isRolling}
          onRoll={rollGmDie}
        />
        <MassiveToggle
          useMassiveThreshold={useMassiveThreshold}
          onUseMassiveThresholdChange={onUseMassiveThresholdChange}
        />
        <GlobalSaveDC value={saveDC} onChange={setSaveDC} />
        <TurnTimer compact spotlightActive={!!spotlight} />
        <DifficultyReference />
        {/* Reduce All Counters Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="min-h-13 gap-1.5 rounded-lg border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-2.5 text-amber-600 hover:bg-amber-500/20 hover:text-amber-700 dark:text-amber-400"
                onClick={onReduceAllCountdowns}
                disabled={enabledCountdowns === 0}
              >
                <Timer className="size-4" />
                <span className="text-sm font-bold">Tick</span>
                <Badge
                  variant="secondary"
                  className="h-5 bg-amber-500/20 px-1.5 text-xs"
                >
                  {enabledCountdowns}
                </Badge>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {enabledCountdowns > 0
                ? 'Reduce all enabled countdowns by 1'
                : 'No active countdowns'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* Party Rest Button - triggers Fear gain per Chapter 3 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="min-h-13 gap-1.5 rounded-lg border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 px-2.5 text-indigo-600 hover:bg-indigo-500/20 hover:text-indigo-700 dark:text-indigo-400"
                onClick={() => setIsPartyRestOpen(true)}
                disabled={characterCount === 0}
              >
                <Moon className="size-4" />
                <span className="text-sm font-bold">Rest</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Party takes a rest - GM gains Fear</p>
              <p className="text-muted-foreground text-xs">
                Short: 1d4, Long: {characterCount} PCs + 1d4
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {activeEnvironment ? (
          <ActiveEnvironmentPanel
            environment={activeEnvironment}
            selection={selection}
            spotlight={spotlight}
            onSelectEnvironment={onSelectEnvironment}
            onRemoveEnvironment={onRemoveEnvironment}
            onSpotlightEnvironment={onSpotlightEnvironment}
            onEditEnvironment={onEditEnvironment}
            onEnvironmentChange={onEnvironmentChange}
          />
        ) : (
          <EmptyEnvironmentPanel onAddEnvironment={onAddEnvironment} />
        )}
      </CardContent>

      {/* Party Rest Dialog */}
      <PartyRestDialog
        isOpen={isPartyRestOpen}
        onClose={() => setIsPartyRestOpen(false)}
        partySize={characterCount}
        currentFear={fearPool}
        maxFear={maxFear}
        onRestComplete={handlePartyRestComplete}
      />
    </Card>
  );
}

// =====================================================================================
// Quick Tips Bar
// =====================================================================================

export function QuickTipsBar() {
  const tips = [
    {
      icon: Sparkles,
      text: 'Spotlight flows — no initiative!',
      color: 'text-amber-500',
    },
    {
      icon: Skull,
      text: 'Spend Fear for features',
      color: 'text-purple-500',
    },
    { icon: Swords, text: 'Mix roles for dynamics', color: 'text-red-500' },
    {
      icon: Gauge,
      text: 'Difficulty 5-30 ladder',
      color: 'text-sky-500',
    },
  ];

  return (
    <div className="text-muted-foreground mb-3 flex flex-wrap items-center justify-center gap-4 text-xs">
      {tips.map((tip, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <tip.icon className={`size-3 ${tip.color}`} />
          <span>{tip.text}</span>
        </div>
      ))}
    </div>
  );
}
