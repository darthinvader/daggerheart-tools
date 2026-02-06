import { ChevronDown, History, Redo2, Trash2, Undo2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { UndoEntryMeta } from '@/lib/undo';

interface UndoRedoControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  undoStack: readonly UndoEntryMeta[];
  redoStack: readonly UndoEntryMeta[];
  onUndo: () => void;
  onRedo: () => void;
  onClearHistory: () => void;
  /** When true, renders a slimmer variant suitable for tight header rows. */
  compact?: boolean;
}

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function UndoRedoControls({
  canUndo,
  canRedo,
  undoStack,
  redoStack,
  onUndo,
  onRedo,
  onClearHistory,
  compact = false,
}: UndoRedoControlsProps) {
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleUndo = () => {
    onUndo();
  };

  const handleRedo = () => {
    onRedo();
  };

  const nextUndo = undoStack.at(0);
  const nextRedo = redoStack.at(0);

  return (
    <div
      className={
        compact
          ? 'border-border/40 hidden items-center gap-0.5 border-l pl-2 md:flex'
          : 'flex min-h-13 items-center gap-2 rounded-lg border-2 border-slate-500/30 bg-gradient-to-r from-slate-500/10 to-zinc-500/10 px-2.5 py-2'
      }
    >
      {/* Icon + Label (hidden in compact mode) */}
      {!compact && (
        <div className="flex items-center gap-1">
          <History className="size-4 text-slate-500" />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            History
          </span>
        </div>
      )}

      {/* Undo / Redo buttons */}
      <TooltipProvider>
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                disabled={!canUndo}
                onClick={handleUndo}
                aria-label="Undo"
              >
                <Undo2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {nextUndo
                ? `Undo: ${nextUndo.label} (Ctrl+Z)`
                : 'Nothing to undo (Ctrl+Z)'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                disabled={!canRedo}
                onClick={handleRedo}
                aria-label="Redo"
              >
                <Redo2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {nextRedo
                ? `Redo: ${nextRedo.label} (Ctrl+Shift+Z)`
                : 'Nothing to redo (Ctrl+Shift+Z)'}
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* History count badge + dropdown */}
      {undoStack.length > 0 && (
        <Popover open={historyOpen} onOpenChange={setHistoryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 px-1.5"
              aria-label="Show undo history"
            >
              <Badge
                variant="secondary"
                className="h-5 bg-slate-500/20 px-1.5 text-xs"
              >
                {undoStack.length}
              </Badge>
              <ChevronDown className="size-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-72 p-0"
            align={compact ? 'end' : 'start'}
          >
            <div className="border-b bg-gradient-to-r from-slate-500/10 to-zinc-500/10 px-4 py-3">
              <h4 className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                <History className="size-4" />
                Undo History
              </h4>
              <p className="text-muted-foreground mt-1 text-xs">
                {undoStack.length} action{undoStack.length !== 1 ? 's' : ''}{' '}
                recorded
              </p>
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
              {undoStack.map((entry, i) => (
                <div
                  key={entry.id}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors"
                >
                  <span className="truncate">
                    {i === 0 && (
                      <span className="mr-1.5 text-xs font-medium text-slate-500">
                        latest
                      </span>
                    )}
                    {entry.label}
                  </span>
                  <span className="text-muted-foreground ml-2 shrink-0 text-xs">
                    {formatRelativeTime(entry.timestamp)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-1.5 text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400"
                onClick={() => {
                  onClearHistory();
                  setHistoryOpen(false);
                  toast('History cleared');
                }}
              >
                <Trash2 className="size-3.5" />
                Clear History
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
