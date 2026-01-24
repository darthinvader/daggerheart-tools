import { Clock } from 'lucide-react';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ActivityDialog } from './activity-dialog';
import { DOWNTIME_CATEGORIES, STANDARD_DOWNTIME_MOVES } from './constants';
import { DowntimeActivityCard } from './downtime-activity-card';
import { DowntimeMoveCard } from './downtime-move-card';
import {
  createDowntimeActivity,
  getActivityStats,
  sortActivities,
} from './downtime-utils';
import type { DowntimeActivity, DowntimeMove } from './types';

interface DowntimeMovesProps {
  activities: DowntimeActivity[];
  onChange: (activities: DowntimeActivity[]) => void;
}

export function DowntimeMoves({ activities, onChange }: DowntimeMovesProps) {
  const [selectedMove, setSelectedMove] = useState<DowntimeMove | null>(null);

  const stats = getActivityStats(activities);
  const sorted = sortActivities(activities);

  const handleConfirmActivity = (
    move: DowntimeMove,
    notes: string,
    hours: number
  ) => {
    const activity = createDowntimeActivity(move, notes);
    activity.hoursSpent = hours;
    onChange([...activities, activity]);
    setSelectedMove(null);
  };

  const handleComplete = (id: string) => {
    onChange(
      activities.map(a => (a.id === id ? { ...a, completed: true } : a))
    );
  };

  const handleDelete = (id: string) => {
    onChange(activities.filter(a => a.id !== id));
  };

  return (
    <section className="bg-card hover:border-primary/20 flex h-[400px] flex-col overflow-hidden rounded-xl border shadow-sm transition-colors md:h-112">
      <div className="flex shrink-0 flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">☕</span>
          <h3 className="text-lg font-semibold">Downtime Activities</h3>
        </div>
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <span>
            {stats.completed}/{stats.total} completed
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {stats.totalHours}h total
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-6">
        <Tabs
          defaultValue="activities"
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <TabsList className="grid w-full shrink-0 grid-cols-2">
            <TabsTrigger value="activities">My Activities</TabsTrigger>
            <TabsTrigger value="moves">Available Moves</TabsTrigger>
          </TabsList>

          <TabsContent
            value="activities"
            className="mt-4 min-h-0 flex-1 overflow-y-auto"
          >
            {sorted.length === 0 ? (
              <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
                No downtime activities yet. Start one from the Available Moves
                tab.
              </div>
            ) : (
              <div className="space-y-4">
                {sorted.map(activity => (
                  <DowntimeActivityCard
                    key={activity.id}
                    activity={activity}
                    onComplete={() => handleComplete(activity.id)}
                    onDelete={() => handleDelete(activity.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="moves"
            className="mt-4 min-h-0 flex-1 space-y-6 overflow-y-auto"
          >
            {DOWNTIME_CATEGORIES.map(category => {
              const moves = STANDARD_DOWNTIME_MOVES.filter(
                m => m.category === category.value
              );
              if (moves.length === 0) return null;
              return (
                <div key={category.value} className="space-y-3">
                  <h4 className="flex items-center gap-2 font-medium">
                    <category.icon className="size-4" /> {category.label}
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {moves.map(move => (
                      <DowntimeMoveCard
                        key={move.id}
                        move={move}
                        onSelect={() => setSelectedMove(move)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>

      <ActivityDialog
        selectedMove={selectedMove}
        onClose={() => setSelectedMove(null)}
        onConfirm={handleConfirmActivity}
      />
    </section>
  );
}
