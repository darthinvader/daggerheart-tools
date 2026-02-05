import {
  Clock,
  RotateCcw,
  Sparkles,
  Swords,
  TreePine,
  User,
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

import type { SpotlightHistoryEntry, TrackerSelection } from './types';

interface SpotlightHistoryTimelineProps {
  history: SpotlightHistoryEntry[];
  currentRound: number;
  spotlight: TrackerSelection | null;
  onSelectSpotlight: (selection: TrackerSelection) => void;
  onClearHistory?: () => void;
}

const KIND_ICONS: Record<string, React.ReactNode> = {
  character: <User className="size-3 text-blue-500" />,
  adversary: <Swords className="size-3 text-red-500" />,
  environment: <TreePine className="size-3 text-emerald-500" />,
};

const KIND_COLORS: Record<string, string> = {
  character: 'border-blue-500/30 bg-blue-500/10',
  adversary: 'border-red-500/30 bg-red-500/10',
  environment: 'border-emerald-500/30 bg-emerald-500/10',
};

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  if (seconds > 10) return `${seconds}s ago`;
  return 'just now';
}

function TimelineEntry({
  entry,
  isFirst: _isFirst,
  isLast,
  isCurrent,
  onSelect,
}: {
  entry: SpotlightHistoryEntry;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="relative flex gap-3">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex size-6 items-center justify-center rounded-full border-2',
            isCurrent
              ? 'border-amber-400 bg-amber-500/20'
              : KIND_COLORS[entry.selection.kind]
          )}
        >
          {KIND_ICONS[entry.selection.kind]}
        </div>
        {!isLast && <div className="bg-muted-foreground/30 w-0.5 flex-1" />}
      </div>

      {/* Content */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onSelect}
              className={cn(
                'mb-3 flex flex-1 flex-col rounded-lg border p-2 text-left transition-all hover:border-amber-400/50',
                isCurrent && 'border-amber-400 shadow-sm shadow-amber-400/20',
                !isCurrent && 'border-muted-foreground/20 hover:bg-muted/30'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'truncate text-sm font-medium',
                    isCurrent && 'text-amber-600 dark:text-amber-400'
                  )}
                >
                  {entry.entityName}
                </span>
                {entry.round && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'shrink-0 text-[10px]',
                      isCurrent &&
                        'border-amber-500/50 bg-amber-500/10 text-amber-600'
                    )}
                  >
                    R{entry.round}
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-[10px]">
                <Clock className="size-2.5" />
                <span>{formatTimestamp(entry.timestamp)}</span>
                <span className="opacity-60">
                  ({formatRelativeTime(entry.timestamp)})
                </span>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to set {entry.entityName} as spotlight</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function SpotlightHistoryTimeline({
  history,
  currentRound,
  spotlight,
  onSelectSpotlight,
  onClearHistory,
}: SpotlightHistoryTimelineProps) {
  if (history.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500" />
            <span className="text-sm font-semibold">Spotlight Timeline</span>
          </div>
          <Badge variant="outline" className="text-[10px]">
            Round {currentRound}
          </Badge>
        </div>
        <div className="border-muted-foreground/30 bg-muted/20 rounded-lg border-2 border-dashed p-4 text-center">
          <Clock className="text-muted-foreground mx-auto mb-2 size-6 opacity-50" />
          <p className="text-muted-foreground text-xs">
            No spotlight history yet
          </p>
          <p className="text-muted-foreground mt-1 text-[10px]">
            Set the spotlight to start tracking
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-amber-500" />
          <span className="text-sm font-semibold">Spotlight Timeline</span>
          <Badge variant="secondary" className="text-[10px]">
            {history.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            Round {currentRound}
          </Badge>
          {onClearHistory && history.length > 0 && (
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
                <TooltipContent>Clear spotlight history</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <ScrollArea className="max-h-64">
        <div className="pr-2">
          {history.map((entry, index) => {
            const isCurrent =
              spotlight &&
              spotlight.kind === entry.selection.kind &&
              spotlight.id === entry.selection.id;
            return (
              <TimelineEntry
                key={`${entry.selection.kind}-${entry.selection.id}-${entry.timestamp}`}
                entry={entry}
                isFirst={index === 0}
                isLast={index === history.length - 1}
                isCurrent={!!isCurrent}
                onSelect={() => onSelectSpotlight(entry.selection)}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
