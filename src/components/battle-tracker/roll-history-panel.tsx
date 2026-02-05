import {
  Clock,
  Dices,
  RotateCcw,
  Swords,
  Target,
  TreePine,
  User,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { RollHistoryEntry } from './types';

interface RollHistoryPanelProps {
  history: RollHistoryEntry[];
  currentRound: number;
  onClearHistory?: () => void;
  maxEntries?: number;
}

const KIND_ICONS: Record<string, React.ReactNode> = {
  character: <User className="size-3 text-blue-500" />,
  adversary: <Swords className="size-3 text-red-500" />,
  environment: <TreePine className="size-3 text-emerald-500" />,
};

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function RollEntryCard({ entry }: { entry: RollHistoryEntry }) {
  const isAttack = entry.type === 'attack';
  const isCritical = entry.isCritical;
  const isFumble = entry.isFumble;

  return (
    <div
      className={cn(
        'rounded-lg border p-2 transition-all',
        isCritical && 'border-green-500/50 bg-green-500/10',
        isFumble && 'border-red-500/50 bg-red-500/10',
        !isCritical && !isFumble && 'border-muted-foreground/20 bg-muted/20'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {KIND_ICONS[entry.entityKind]}
          <span className="text-xs font-medium">{entry.entityName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {entry.round && (
            <Badge variant="outline" className="text-[10px]">
              R{entry.round}
            </Badge>
          )}
          <Badge
            variant={isAttack ? 'default' : 'secondary'}
            className={cn(
              'text-[10px]',
              isAttack && 'bg-blue-500/80',
              !isAttack && 'bg-orange-500/80 text-white'
            )}
          >
            {isAttack ? (
              <Target className="mr-0.5 size-2.5" />
            ) : (
              <Zap className="mr-0.5 size-2.5" />
            )}
            {isAttack ? 'ATK' : 'DMG'}
          </Badge>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'flex items-center gap-1 rounded px-2 py-1 font-mono text-sm font-bold',
                    isCritical && 'bg-green-500 text-white',
                    isFumble && 'bg-red-500 text-white',
                    !isCritical && !isFumble && 'bg-primary/20 text-primary'
                  )}
                >
                  <Dices className="size-3" />
                  {entry.total}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  {isAttack ? (
                    <p className="font-mono">
                      d20({entry.roll}){' '}
                      {entry.modifier !== undefined && (
                        <>
                          {typeof entry.modifier === 'number'
                            ? entry.modifier >= 0
                              ? '+'
                              : ''
                            : ''}
                          {entry.modifier}
                        </>
                      )}{' '}
                      = {entry.total}
                    </p>
                  ) : (
                    <p className="font-mono">
                      {entry.dice}: [{entry.rolls?.join(', ')}] = {entry.total}
                    </p>
                  )}
                  {isCritical && (
                    <p className="font-bold text-green-400">CRITICAL HIT!</p>
                  )}
                  {isFumble && (
                    <p className="font-bold text-red-400">FUMBLE!</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="text-muted-foreground text-[10px]">
            {isAttack ? (
              <span>
                d20
                {entry.modifier !== undefined && (
                  <>
                    {typeof entry.modifier === 'number'
                      ? entry.modifier >= 0
                        ? '+'
                        : ''
                      : ' '}
                    {entry.modifier}
                  </>
                )}
              </span>
            ) : (
              <span>{entry.dice}</span>
            )}
          </div>
        </div>

        <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
          <Clock className="size-2.5" />
          {formatTimestamp(entry.timestamp)}
        </div>
      </div>

      {isCritical && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400">
          <span className="animate-pulse">CRITICAL HIT!</span>
        </div>
      )}
      {isFumble && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400">
          <span className="animate-pulse">FUMBLE!</span>
        </div>
      )}
    </div>
  );
}

function RollStatsSummary({ history }: { history: RollHistoryEntry[] }) {
  const attacks = history.filter(e => e.type === 'attack');
  const damages = history.filter(e => e.type === 'damage');
  const criticals = attacks.filter(e => e.isCritical).length;
  const fumbles = attacks.filter(e => e.isFumble).length;
  const avgAttack =
    attacks.length > 0
      ? Math.round(
          attacks.reduce((sum, e) => sum + e.total, 0) / attacks.length
        )
      : 0;
  const totalDamage = damages.reduce((sum, e) => sum + e.total, 0);

  if (history.length === 0) return null;

  return (
    <div className="bg-muted/30 grid grid-cols-4 gap-2 rounded-lg border p-2 text-center text-[10px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">
              <p className="text-muted-foreground">Attacks</p>
              <p className="font-bold text-blue-600 dark:text-blue-400">
                {attacks.length}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Avg: {avgAttack} | Crits: {criticals} | Fumbles: {fumbles}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div>
        <p className="text-muted-foreground">Damage</p>
        <p className="font-bold text-orange-600 dark:text-orange-400">
          {totalDamage}
        </p>
      </div>
      <div>
        <p className="text-muted-foreground">Crits</p>
        <p className="font-bold text-green-600 dark:text-green-400">
          {criticals}
        </p>
      </div>
      <div>
        <p className="text-muted-foreground">Fumbles</p>
        <p className="font-bold text-red-600 dark:text-red-400">{fumbles}</p>
      </div>
    </div>
  );
}

export function RollHistoryPanel({
  history,
  currentRound,
  onClearHistory,
  maxEntries = 50,
}: RollHistoryPanelProps) {
  // Limit to most recent entries
  const displayHistory = history.slice(0, maxEntries);

  if (history.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dices className="text-primary size-4" />
            <span className="text-sm font-semibold">Roll History</span>
          </div>
          <Badge variant="outline" className="text-[10px]">
            Round {currentRound}
          </Badge>
        </div>
        <div className="border-muted-foreground/30 bg-muted/20 rounded-lg border-2 border-dashed p-4 text-center">
          <Dices className="text-muted-foreground mx-auto mb-2 size-6 opacity-50" />
          <p className="text-muted-foreground text-xs">No rolls yet</p>
          <p className="text-muted-foreground mt-1 text-[10px]">
            Attack and damage rolls will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dices className="text-primary size-4" />
          <span className="text-sm font-semibold">Roll History</span>
          <Badge variant="secondary" className="text-[10px]">
            {history.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            Round {currentRound}
          </Badge>
          {onClearHistory && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={onClearHistory}
                  >
                    <RotateCcw className="size-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear roll history</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <RollStatsSummary history={history} />

      <ScrollArea className="max-h-80">
        <div className="space-y-2 pr-2">
          {displayHistory.map(entry => (
            <RollEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
