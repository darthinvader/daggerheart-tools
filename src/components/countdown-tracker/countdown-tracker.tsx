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

// --- Sub-components ---

function CountdownHeader({
  count,
  onAdd,
}: {
  count: number;
  onAdd: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="text-xl">&#9201;</span>
        <h3 className="text-lg font-semibold">Countdowns</h3>
        {count > 0 && (
          <span className="text-muted-foreground text-sm">({count})</span>
        )}
      </div>
      <Button size="sm" onClick={onAdd}>
        <Plus className="mr-1 h-4 w-4" />
        Add
      </Button>
    </div>
  );
}

function CountdownEmptyState() {
  return (
    <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
      <p>No active countdowns</p>
      <p className="mt-2 text-xs">
        Track threats, opportunities, and timed events with dynamic advancement
      </p>
    </div>
  );
}

function CountdownCardList({
  countdowns,
  onAdvance,
  onDelete,
  onToggleSegment,
  onReset,
  onUndo,
}: {
  countdowns: Countdown[];
  onAdvance: (id: string, amount: number, rollResult?: RollResult) => void;
  onDelete: (id: string) => void;
  onToggleSegment: (id: string, index: number) => void;
  onReset: (id: string) => void;
  onUndo: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {countdowns.map(countdown => (
        <CountdownCard
          key={countdown.id}
          countdown={countdown}
          onAdvance={(amount, rollResult) =>
            onAdvance(countdown.id, amount, rollResult)
          }
          onDelete={() => onDelete(countdown.id)}
          onToggleSegment={index => onToggleSegment(countdown.id, index)}
          onReset={() => onReset(countdown.id)}
          onUndo={() => onUndo(countdown.id)}
        />
      ))}
    </div>
  );
}

// --- Main component ---

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

  const handleAdd = useCallback(
    (countdown: Countdown) => {
      onChange([...countdowns, countdown]);
    },
    [countdowns, onChange]
  );

  const handleAdvance = useCallback(
    (id: string, amount: number, rollResult?: RollResult) => {
      onChange(
        countdowns.map(c => {
          if (c.id !== id) return c;

          const result = advanceCountdownWithResult(c, amount, rollResult);

          if (result.completed) {
            onCountdownComplete?.(result.countdown);
          }
          if (result.triggerFired && result.trigger) {
            onTriggerFired?.(result.countdown);
          }
          if (result.looped) {
            onCountdownLoop?.(result.countdown, result.countdown.loopCount);
          }

          return result.countdown;
        })
      );
    },
    [countdowns, onChange, onCountdownComplete, onCountdownLoop, onTriggerFired]
  );

  const handleToggleSegment = useCallback(
    (id: string, index: number) => {
      onChange(
        countdowns.map(c => {
          if (c.id !== id) return c;
          const newFilled = index < c.filled ? index : index + 1;
          return { ...c, filled: newFilled };
        })
      );
    },
    [countdowns, onChange]
  );

  const handleReset = useCallback(
    (id: string) => {
      onChange(countdowns.map(c => (c.id === id ? resetCountdown(c) : c)));
    },
    [countdowns, onChange]
  );

  const handleUndo = useCallback(
    (id: string) => {
      onChange(countdowns.map(c => (c.id === id ? undoLastAdvancement(c) : c)));
    },
    [countdowns, onChange]
  );

  const handleDelete = useCallback(
    (id: string) => {
      onChange(countdowns.filter(c => c.id !== id));
    },
    [countdowns, onChange]
  );

  const openDialog = useCallback(() => setIsAdding(true), []);
  const closeDialog = useCallback(() => setIsAdding(false), []);

  const sorted = sortCountdowns(countdowns);

  return (
    <section className="bg-card hover:border-primary/20 flex h-[400px] flex-col overflow-hidden rounded-xl border shadow-sm transition-colors md:h-112">
      <CountdownHeader count={countdowns.length} onAdd={openDialog} />

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        {sorted.length === 0 ? (
          <CountdownEmptyState />
        ) : (
          <CountdownCardList
            countdowns={sorted}
            onAdvance={handleAdvance}
            onDelete={handleDelete}
            onToggleSegment={handleToggleSegment}
            onReset={handleReset}
            onUndo={handleUndo}
          />
        )}
      </div>

      <AddCountdownDialog
        isOpen={isAdding}
        onClose={closeDialog}
        onAdd={handleAdd}
      />
    </section>
  );
}
