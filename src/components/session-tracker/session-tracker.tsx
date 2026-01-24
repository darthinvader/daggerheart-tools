import { BookOpen, Coins, Plus, Star } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { SessionCard } from './session-card';
import { SessionEditor } from './session-editor';
import {
  createSession,
  getNextSessionNumber,
  getSessionStats,
  sortSessions,
} from './session-utils';
import type { SessionEntry } from './types';

interface SessionTrackerProps {
  sessions: SessionEntry[];
  currentSessionId: string | null;
  onChange: (sessions: SessionEntry[], currentId: string | null) => void;
}

export function SessionTracker({
  sessions,
  currentSessionId,
  onChange,
}: SessionTrackerProps) {
  const safeSessions = sessions ?? [];
  const [editingSession, setEditingSession] = useState<SessionEntry | null>(
    null
  );

  const stats = getSessionStats(safeSessions);
  const sorted = sortSessions(safeSessions);

  const handleNew = () => {
    const session = createSession(getNextSessionNumber(safeSessions));
    onChange([...safeSessions, session], session.id);
    setEditingSession(session);
  };

  const handleSelect = (session: SessionEntry) => {
    onChange(safeSessions, session.id);
    setEditingSession(session);
  };

  const handleDelete = (id: string) => {
    const newSessions = safeSessions.filter(s => s.id !== id);
    const newCurrentId = currentSessionId === id ? null : currentSessionId;
    onChange(newSessions, newCurrentId);
  };

  const handleSave = () => {
    if (!editingSession) return;
    const exists = safeSessions.some(s => s.id === editingSession.id);
    if (exists) {
      onChange(
        safeSessions.map(s =>
          s.id === editingSession.id ? editingSession : s
        ),
        currentSessionId
      );
    } else {
      onChange([...safeSessions, editingSession], editingSession.id);
    }
    setEditingSession(null);
  };

  return (
    <>
      <section className="bg-card hover:border-primary/20 flex h-full flex-col rounded-xl border shadow-sm transition-colors">
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5" />
            <h3 className="text-lg font-semibold">Session Log</h3>
          </div>
          <Button size="sm" onClick={handleNew}>
            <Plus className="mr-1 h-4 w-4" />
            New Session
          </Button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {/* Stats */}
          <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span>{stats.count} sessions</span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500" />
              {stats.totalXp} total XP
            </span>
            <span className="flex items-center gap-1">
              <Coins className="h-4 w-4 text-yellow-500" />
              {stats.totalGold} total gold
            </span>
          </div>

          {/* Sessions List */}
          {sorted.length === 0 ? (
            <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
              No sessions recorded yet
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  isCurrent={session.id === currentSessionId}
                  onSelect={() => handleSelect(session)}
                  onDelete={() => handleDelete(session.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog
        open={editingSession !== null}
        onOpenChange={() => setEditingSession(null)}
      >
        <DialogContent className="flex max-h-[90vh] w-[98vw] max-w-4xl flex-col overflow-hidden sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingSession && `Session ${editingSession.number}`}
            </DialogTitle>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-1">
            {editingSession && (
              <SessionEditor
                session={editingSession}
                onChange={setEditingSession}
              />
            )}
          </div>
          <DialogFooter className="shrink-0 border-t pt-4">
            <Button variant="outline" onClick={() => setEditingSession(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
