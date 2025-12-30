import type { DowntimeActivity, DowntimeMove } from './types';

export function createDowntimeActivity(
  move: DowntimeMove,
  notes: string = ''
): DowntimeActivity {
  return {
    id: crypto.randomUUID(),
    moveId: move.id,
    moveName: move.name,
    notes,
    hoursSpent: move.defaultHoursRequired ?? 0,
    completed: false,
    sessionDate: new Date().toISOString(),
  };
}

export function sortActivities(
  activities: DowntimeActivity[]
): DowntimeActivity[] {
  return [...activities].sort((a, b) => {
    // Incomplete first
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // Then by date (newest first)
    return (
      new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
    );
  });
}

export function getActivityStats(activities: DowntimeActivity[]) {
  const total = activities.length;
  const completed = activities.filter(a => a.completed).length;
  const totalHours = activities.reduce((sum, a) => sum + a.hoursSpent, 0);
  return { total, completed, pending: total - completed, totalHours };
}
