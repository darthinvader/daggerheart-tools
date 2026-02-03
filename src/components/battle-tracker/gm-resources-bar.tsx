import {
  BookOpen,
  Crosshair,
  Dices,
  Flame,
  Leaf,
  Minus,
  Pencil,
  Plus,
  Sparkles,
  Swords,
  Timer,
  X,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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
  return (
    <div className="flex min-h-13 items-center gap-2 rounded-lg border-2 border-purple-500/30 bg-linear-to-r from-purple-500/10 to-violet-500/10 px-2.5 py-2">
      <div className="flex items-center gap-1">
        <Flame className="size-4 text-purple-500" />
        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
          FEAR
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="outline"
          className="size-6 border-purple-300 hover:bg-purple-500/20"
          onClick={() => onFearChange(Math.max(0, fearPool - 1))}
          disabled={fearPool <= 0}
        >
          <Minus className="size-3" />
        </Button>
        <div className="flex items-baseline gap-0.5">
          <span className="min-w-[2ch] text-center text-xl font-bold text-purple-600 dark:text-purple-400">
            {fearPool}
          </span>
          <span className="text-muted-foreground text-[10px]">/{maxFear}</span>
        </div>
        <Button
          size="icon"
          variant="outline"
          className="size-6 border-purple-300 hover:bg-purple-500/20"
          onClick={() => onFearChange(Math.min(maxFear, fearPool + 1))}
          disabled={fearPool >= maxFear}
        >
          <Plus className="size-3" />
        </Button>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-1.5 text-[10px] text-purple-500 hover:text-purple-600"
              onClick={() => onFearChange(characterCount)}
            >
              Reset
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset to starting Fear ({characterCount} = PC count)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
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
    <div className="flex min-h-13 items-center gap-2 rounded-lg border-2 border-blue-500/30 bg-linear-to-r from-blue-500/10 to-cyan-500/10 px-2.5 py-2">
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
    <div className="flex min-h-13 items-center gap-2 rounded-lg border-2 border-red-500/30 bg-linear-to-r from-red-500/10 to-orange-500/10 px-2.5 py-2">
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
      className={`flex min-h-13 items-center gap-2 rounded-lg border-2 border-emerald-500/30 bg-linear-to-r from-emerald-500/10 to-teal-500/10 px-2.5 py-2 ${
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
      className="flex min-h-13 cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-emerald-500/30 bg-linear-to-r from-emerald-500/5 to-teal-500/5 px-2.5 py-2 transition-colors hover:bg-emerald-500/10"
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
// GM Resources Bar - Fear, GM Die, Environment
// =====================================================================================

export function GMResourcesBar({
  characterCount,
  environments,
  adversaries,
  fearPool,
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
  const maxFear = 12;
  const activeEnvironment = environments[0] ?? null;
  const { gmDieResult, isRolling, rollGmDie } = useGmDieRoll();

  // Count how many enabled countdowns exist
  const enabledCountdowns =
    environments.filter(e => e.countdownEnabled).length +
    adversaries.filter(a => a.countdownEnabled).length;

  return (
    <Card className="border-muted-foreground/20 from-muted/30 via-background to-muted/30 mb-4 border-2 border-dashed bg-linear-to-r">
      <CardContent className="flex flex-wrap items-center justify-center gap-2 px-3 py-3">
        <FearCounter
          fearPool={fearPool}
          maxFear={maxFear}
          characterCount={characterCount}
          onFearChange={onFearChange}
        />
        <GmDieRoller
          gmDieResult={gmDieResult}
          isRolling={isRolling}
          onRoll={rollGmDie}
        />
        <MassiveToggle
          useMassiveThreshold={useMassiveThreshold}
          onUseMassiveThresholdChange={onUseMassiveThresholdChange}
        />
        {/* Reduce All Counters Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="min-h-13 gap-1.5 rounded-lg border-2 border-amber-500/30 bg-linear-to-r from-amber-500/10 to-orange-500/10 px-2.5 text-amber-600 hover:bg-amber-500/20 hover:text-amber-700 dark:text-amber-400"
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
      icon: BookOpen,
      text: 'Spend Fear for features',
      color: 'text-purple-500',
    },
    { icon: Swords, text: 'Mix roles for dynamics', color: 'text-red-500' },
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
