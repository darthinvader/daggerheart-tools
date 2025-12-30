export interface SessionEntry {
  id: string;
  number: number;
  date: string;
  title?: string;
  summary?: string;
  xpGained: number;
  goldGained: number;
  notableEvents: string[];
}

export interface SessionState {
  sessions: SessionEntry[];
  currentSessionId: string | null;
}
