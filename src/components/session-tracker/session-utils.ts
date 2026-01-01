import { generateId } from '@/lib/utils';

import type { SessionEntry } from './types';

export function createSession(number: number): SessionEntry {
  return {
    id: generateId(),
    number,
    date: new Date().toISOString(),
    xpGained: 0,
    goldGained: 0,
    notableEvents: [],
  };
}

export function getNextSessionNumber(sessions: SessionEntry[]): number {
  if (sessions.length === 0) return 1;
  return Math.max(...sessions.map(s => s.number)) + 1;
}

export function sortSessions(sessions: SessionEntry[]): SessionEntry[] {
  return [...sessions].sort((a, b) => b.number - a.number);
}

export function getSessionStats(sessions: SessionEntry[]) {
  const totalXp = sessions.reduce((sum, s) => sum + s.xpGained, 0);
  const totalGold = sessions.reduce((sum, s) => sum + s.goldGained, 0);
  const totalEvents = sessions.reduce(
    (sum, s) => sum + s.notableEvents.length,
    0
  );
  return { count: sessions.length, totalXp, totalGold, totalEvents };
}

export function formatSessionDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
