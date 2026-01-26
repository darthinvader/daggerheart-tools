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
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

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

import type { EnvironmentTracker, TrackerSelection } from './types';

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

  const rollGmDie = () => {
    setIsRolling(true);
    setGmDieResult(null);
    let count = 0;
    const interval = setInterval(() => {
      setGmDieResult(Math.floor(Math.random() * 20) + 1);
      count++;
      if (count >= 8) {
        clearInterval(interval);
        setGmDieResult(Math.floor(Math.random() * 20) + 1);
        setIsRolling(false);
      }
    }, 80);
  };

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
    <div className="flex min-h-15 items-center gap-3 rounded-lg border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-violet-500/10 px-4 py-3">
      <div className="flex items-center gap-1.5">
        <Flame className="size-5 text-purple-500" />
        <span className="font-bold text-purple-600 dark:text-purple-400">
          FEAR
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          size="icon"
          variant="outline"
          className="size-7 border-purple-300 hover:bg-purple-500/20"
          onClick={() => onFearChange(Math.max(0, fearPool - 1))}
          disabled={fearPool <= 0}
        >
          <Minus className="size-3" />
        </Button>
        <div className="flex items-baseline gap-0.5">
          <span className="min-w-[2ch] text-center text-2xl font-bold text-purple-600 dark:text-purple-400">
            {fearPool}
          </span>
          <span className="text-muted-foreground text-xs">/{maxFear}</span>
        </div>
        <Button
          size="icon"
          variant="outline"
          className="size-7 border-purple-300 hover:bg-purple-500/20"
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
              className="h-7 px-2 text-xs text-purple-500 hover:text-purple-600"
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
    <div className="flex min-h-[60px] items-center gap-3 rounded-lg border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-4 py-3">
      <div className="flex items-center gap-1.5">
        <Dices className="size-5 text-blue-500" />
        <span className="font-bold text-blue-600 dark:text-blue-400">
          GM Die
        </span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className={`h-8 min-w-16 border-blue-300 hover:bg-blue-500/20 ${isRolling ? 'animate-pulse' : ''}`}
              onClick={onRoll}
              disabled={isRolling}
            >
              {gmDieResult !== null ? (
                <span
                  className={`text-lg font-bold ${gmDieResult === 20 ? 'text-green-500' : gmDieResult === 1 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}
                >
                  {gmDieResult}
                </span>
              ) : (
                <span className="text-muted-foreground">d20</span>
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
    <div className="flex min-h-[60px] items-center gap-3 rounded-lg border-2 border-red-500/30 bg-gradient-to-r from-red-500/10 to-orange-500/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <Flame className="size-5 text-red-500" />
        <Label
          htmlFor="massive-toggle"
          className="cursor-pointer font-bold text-red-600 dark:text-red-400"
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

function ActiveEnvironmentPanel({
  environment,
  selection,
  spotlight,
  onSelectEnvironment,
  onRemoveEnvironment,
  onSpotlightEnvironment,
  onEditEnvironment,
}: {
  environment: EnvironmentTracker;
  selection: Selection | null;
  spotlight: Spotlight | null;
  onSelectEnvironment: (env: EnvironmentTracker) => void;
  onRemoveEnvironment: (env: EnvironmentTracker) => void;
  onSpotlightEnvironment: (env: EnvironmentTracker) => void;
  onEditEnvironment: (env: EnvironmentTracker) => void;
}) {
  return (
    <div
      className={`flex min-h-[60px] items-center gap-3 rounded-lg border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-3 ${
        spotlight?.id === environment.id && spotlight.kind === 'environment'
          ? 'ring-2 ring-amber-400'
          : ''
      } ${selection?.id === environment.id && selection.kind === 'environment' ? 'ring-primary ring-2' : ''}`}
    >
      <button
        onClick={() => onSelectEnvironment(environment)}
        className="flex items-center gap-2 text-left"
      >
        <span className="text-lg">
          {ENVIRONMENT_TYPE_ICONS[environment.source.type] ?? '🌲'}
        </span>
        <div className="min-w-0">
          <p className="max-w-[150px] truncate font-bold text-emerald-700 dark:text-emerald-400">
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
            <div className="max-w-[120px] cursor-help text-xs text-emerald-600 dark:text-emerald-400">
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
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-6 text-amber-500 hover:text-amber-600"
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
          className="text-muted-foreground hover:text-foreground size-6"
          onClick={() => onEditEnvironment(environment)}
        >
          <Pencil className="size-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive size-6"
          onClick={() => onRemoveEnvironment(environment)}
        >
          <X className="size-3" />
        </Button>
      </div>
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
      className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 px-4 py-2 transition-colors hover:bg-emerald-500/10"
      onClick={onAddEnvironment}
    >
      <div className="flex items-center gap-1.5">
        <Leaf className="size-5 text-emerald-500" />
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          Environment
        </span>
      </div>
      <Badge variant="outline" className="border-emerald-300 text-emerald-600">
        <Plus className="mr-1 size-3" /> Add
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
}: {
  characterCount: number;
  environments: EnvironmentTracker[];
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
}) {
  const maxFear = 12;
  const activeEnvironment = environments[0] ?? null;
  const { gmDieResult, isRolling, rollGmDie } = useGmDieRoll();

  return (
    <Card className="border-muted-foreground/20 from-muted/30 via-background to-muted/30 mb-4 border-2 border-dashed bg-gradient-to-r">
      <CardContent className="flex flex-wrap items-center justify-center gap-4 px-4 py-4">
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
        {activeEnvironment ? (
          <ActiveEnvironmentPanel
            environment={activeEnvironment}
            selection={selection}
            spotlight={spotlight}
            onSelectEnvironment={onSelectEnvironment}
            onRemoveEnvironment={onRemoveEnvironment}
            onSpotlightEnvironment={onSpotlightEnvironment}
            onEditEnvironment={onEditEnvironment}
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
