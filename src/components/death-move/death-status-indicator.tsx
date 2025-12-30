import { Heart, Skull } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { DeathMoveState } from './types';

interface DeathStatusIndicatorProps {
  state: DeathMoveState;
  onWakeUp?: () => void;
  onTriggerDeathMove?: () => void;
  className?: string;
}

export function DeathStatusIndicator({
  state,
  onWakeUp,
  onTriggerDeathMove,
  className,
}: DeathStatusIndicatorProps) {
  if (!state.isUnconscious && !state.deathMovePending) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-4',
        state.deathMovePending
          ? 'bg-destructive/10 border-destructive animate-pulse'
          : 'border-yellow-500 bg-yellow-500/10',
        className
      )}
    >
      {state.deathMovePending ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-2">
            <Skull className="text-destructive size-5 shrink-0" />
            <div>
              <div className="text-destructive font-bold">
                Death Move Required!
              </div>
              <p className="text-muted-foreground text-sm">
                You have marked your last Hit Point.
              </p>
            </div>
          </div>
          {onTriggerDeathMove && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onTriggerDeathMove}
              className="w-full sm:w-auto"
            >
              Make Death Move
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-2">
            <Heart className="size-5 shrink-0 text-yellow-500" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-yellow-700 dark:text-yellow-300">
                  Unconscious
                </span>
                <Badge
                  variant="outline"
                  className="border-yellow-500 text-yellow-600"
                >
                  Cannot Act
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                You can't move or act. An ally must clear at least 1 HP, or rest
                to wake up.
              </p>
            </div>
          </div>
          {onWakeUp && (
            <Button
              variant="outline"
              size="sm"
              onClick={onWakeUp}
              className="w-full sm:w-auto"
            >
              Wake Up
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
