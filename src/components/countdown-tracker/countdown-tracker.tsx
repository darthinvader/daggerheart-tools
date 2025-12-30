import { Plus, Timer } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { AddCountdownDialog } from './add-countdown-dialog';
import { CountdownCard } from './countdown-card';
import { advanceCountdown, sortCountdowns } from './countdown-utils';
import type { Countdown } from './types';

interface CountdownTrackerProps {
  countdowns: Countdown[];
  onChange: (countdowns: Countdown[]) => void;
}

export function CountdownTracker({
  countdowns,
  onChange,
}: CountdownTrackerProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (countdown: Countdown) => {
    onChange([...countdowns, countdown]);
  };

  const handleAdvance = (id: string, amount: number) => {
    onChange(
      countdowns.map(c => (c.id === id ? advanceCountdown(c, amount) : c))
    );
  };

  const handleToggleSegment = (id: string, index: number) => {
    onChange(
      countdowns.map(c => {
        if (c.id !== id) return c;
        const newFilled = index < c.filled ? index : index + 1;
        return { ...c, filled: newFilled };
      })
    );
  };

  const handleDelete = (id: string) => {
    onChange(countdowns.filter(c => c.id !== id));
  };

  const sorted = sortCountdowns(countdowns);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold">
            <Timer className="h-5 w-5" />
            Countdowns
          </h3>
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>

        {sorted.length === 0 ? (
          <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
            No active countdowns
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sorted.map(countdown => (
              <CountdownCard
                key={countdown.id}
                countdown={countdown}
                onAdvance={amount => handleAdvance(countdown.id, amount)}
                onDelete={() => handleDelete(countdown.id)}
                onToggleSegment={index =>
                  handleToggleSegment(countdown.id, index)
                }
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
    </>
  );
}
