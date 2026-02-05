import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';

import { AddCountdownDialog } from './add-countdown-dialog';
import { CountdownCard } from './countdown-card';
import {
  advanceCountdownWithResult,
  resetCountdown,
  sortCountdowns,
  undoLastAdvancement,
} from './countdown-utils';
import type { Countdown, RollResult } from './types';

interface CountdownTrackerProps {
  countdowns: Countdown[];
  onChange: (countdowns: Countdown[]) => void;
  /** Optional callback when a countdown trigger fires */
  onTriggerFired?: (countdown: Countdown) => void;
  /** Optional callback when a countdown completes */
  onCountdownComplete?: (countdown: Countdown) => void;
  /** Optional callback when a countdown loops */
  onCountdownLoop?: (countdown: Countdown, loopCount: number) => void;
}

export function CountdownTracker({
  countdowns,
  onChange,
  onTriggerFired,
  onCountdownComplete,
  onCountdownLoop,
}: CountdownTrackerProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (countdown: Countdown) => {
    onChange([...countdowns, countdown]);
  };

  const handleAdvance = useCallback(
    (id: string, amount: number, rollResult?: RollResult) => {
      onChange(
        countdowns.map(c => {
          if (c.id !== id) return c;

          const result = advanceCountdownWithResult(c, amount, rollResult);

          // Handle completion callback
          if (result.completed) {
            onCountdownComplete?.(result.countdown);
          }

          // Handle trigger callback
          if (result.triggerFired && result.trigger) {
            onTriggerFired?.(result.countdown);
          }

          // Handle loop callback
          if (result.looped) {
            onCountdownLoop?.(result.countdown, result.countdown.loopCount);
          }

          return result.countdown;
        })
      );
    },
    [countdowns, onChange, onCountdownComplete, onCountdownLoop, onTriggerFired]
  );

  const handleToggleSegment = (id: string, index: number) => {
    onChange(
      countdowns.map(c => {
        if (c.id !== id) return c;
        const newFilled = index < c.filled ? index : index + 1;
        return { ...c, filled: newFilled };
      })
    );
  };

  const handleReset = (id: string) => {
    onChange(countdowns.map(c => (c.id === id ? resetCountdown(c) : c)));
  };

  const handleUndo = (id: string) => {
    onChange(countdowns.map(c => (c.id === id ? undoLastAdvancement(c) : c)));
  };

  const handleDelete = (id: string) => {
    onChange(countdowns.filter(c => c.id !== id));
  };

  const sorted = sortCountdowns(countdowns);

  return (
    <section className="bg-card hover:border-primary/20 flex h-[400px] flex-col overflow-hidden rounded-xl border shadow-sm transition-colors md:h-112">
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">&#9201;</span>
          <h3 className="text-lg font-semibold">Countdowns</h3>
          {countdowns.length > 0 && (
            <span className="text-muted-foreground text-sm">
              ({countdowns.length})
            </span>
          )}
        </div>
        <Button size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        {sorted.length === 0 ? (
          <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
            <p>No active countdowns</p>
            <p className="mt-2 text-xs">
              Track threats, opportunities, and timed events with dynamic
              advancement
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map(countdown => (
              <CountdownCard
                key={countdown.id}
                countdown={countdown}
                onAdvance={(amount, rollResult) =>
                  handleAdvance(countdown.id, amount, rollResult)
                }
                onDelete={() => handleDelete(countdown.id)}
                onToggleSegment={index =>
                  handleToggleSegment(countdown.id, index)
                }
                onReset={() => handleReset(countdown.id)}
                onUndo={() => handleUndo(countdown.id)}
              />
            ))}
          </div>
        )}
      </div>

      <AddCountdownDialog
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onAdd={handleAdd}
      />
    </section>
  );
}
