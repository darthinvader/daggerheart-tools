// GM Scheduling Dashboard — list, create, and manage scheduling polls
// Route: /gm/scheduling

import {
  createFileRoute,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import {
  CalendarCheck,
  CalendarPlus,
  Clock,
  Copy,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { PollCreateForm } from '@/components/scheduling/poll-create-form';
import { PollVotingCard } from '@/components/scheduling/poll-voting-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';
import {
  computeBestSlots,
  computeSlotSummaries,
} from '@/features/scheduling/scheduling-helpers';
import {
  type CreatePollInput,
  createSchedulingPoll,
  deleteSchedulingPoll,
  listSchedulingPolls,
  updateSchedulingPoll,
} from '@/features/scheduling/scheduling-storage';
import type { SchedulingVoteInput } from '@/features/scheduling/scheduling-storage';
import type { SchedulingPoll } from '@/lib/schemas/scheduling';

export const Route = createFileRoute('/gm/scheduling')({
  component: SchedulingDashboard,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
});

function SchedulingDashboard() {
  const [polls, setPolls] = useState<SchedulingPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedPollId, setExpandedPollId] = useState<string | null>(null);

  const loadPolls = useCallback(async () => {
    try {
      const data = await listSchedulingPolls();
      setPolls(data);
    } catch {
      toast.error('Failed to load scheduling polls');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  const handleCreate = useCallback(
    async (
      title: string,
      slots: Array<{ startTime: string; endTime: string; label?: string }>,
      options?: { description?: string; quorum?: number }
    ) => {
      const input: CreatePollInput = {
        title,
        slots: slots.map(s => ({
          startTime: s.startTime,
          endTime: s.endTime,
          label: s.label,
        })),
        description: options?.description,
        quorum: options?.quorum,
      };
      try {
        const created = await createSchedulingPoll(input);
        setPolls(prev => [created, ...prev]);
        setShowCreate(false);
        toast.success('Poll created! Share the link with your players.');
      } catch {
        toast.error('Failed to create poll');
      }
    },
    []
  );

  const handleConfirmSlot = useCallback(
    async (pollId: string, slotId: string) => {
      try {
        const updated = await updateSchedulingPoll(pollId, {
          status: 'confirmed',
          confirmedSlotId: slotId,
        });
        if (updated) {
          setPolls(prev => prev.map(p => (p.id === pollId ? updated : p)));
          toast.success('Session time confirmed!');
        }
      } catch {
        toast.error('Failed to confirm slot');
      }
    },
    []
  );

  const handleArchivePoll = useCallback(async (pollId: string) => {
    try {
      const updated = await updateSchedulingPoll(pollId, {
        status: 'archived',
      });
      if (updated) {
        setPolls(prev => prev.map(p => (p.id === pollId ? updated : p)));
        toast.success('Poll archived');
      }
    } catch {
      toast.error('Failed to archive poll');
    }
  }, []);

  const handleDeletePoll = useCallback(async (pollId: string) => {
    try {
      await deleteSchedulingPoll(pollId);
      setPolls(prev => prev.filter(p => p.id !== pollId));
      toast.success('Poll deleted');
    } catch {
      toast.error('Failed to delete poll');
    }
  }, []);

  const copyShareLink = useCallback(async (shareCode: string) => {
    const link = `${window.location.origin}/schedule/${shareCode}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Voting link copied to clipboard');
    } catch {
      toast.error('Failed to copy link');
    }
  }, []);

  const openPolls = useMemo(
    () => polls.filter(p => p.status === 'open'),
    [polls]
  );
  const closedPolls = useMemo(
    () => polls.filter(p => p.status !== 'open'),
    [polls]
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-muted mb-6 h-8 w-48 animate-pulse rounded" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-muted h-24 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <CalendarCheck className="h-6 w-6 text-blue-500" />
            Session Scheduling
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create polls and share voting links with your players
          </p>
        </div>
        <Button onClick={() => setShowCreate(prev => !prev)} className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          New Poll
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Create Scheduling Poll</CardTitle>
            <CardDescription>
              Add time slots for your next session. Players will vote via a
              shareable link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PollCreateForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreate(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {polls.length === 0 && !showCreate && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarCheck className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">
              No scheduling polls yet
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md text-sm">
              Create a poll with time slots, then share the voting link with
              your players so they can mark their availability.
            </p>
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <CalendarPlus className="h-4 w-4" />
              Create Your First Poll
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Open polls */}
      {openPolls.length > 0 && (
        <div className="mb-8 space-y-4">
          <h2 className="text-lg font-semibold">Active Polls</h2>
          {openPolls.map(poll => (
            <PollCard
              key={poll.id}
              poll={poll}
              isExpanded={expandedPollId === poll.id}
              onToggleExpand={() =>
                setExpandedPollId(prev => (prev === poll.id ? null : poll.id))
              }
              onCopyLink={() => copyShareLink(poll.shareCode)}
              onConfirmSlot={slotId => handleConfirmSlot(poll.id, slotId)}
              onArchive={() => handleArchivePoll(poll.id)}
              onDelete={() => handleDeletePoll(poll.id)}
            />
          ))}
        </div>
      )}

      {/* Closed polls */}
      {closedPolls.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-muted-foreground text-lg font-semibold">
            Past Polls
          </h2>
          {closedPolls.map(poll => (
            <PollCard
              key={poll.id}
              poll={poll}
              isExpanded={expandedPollId === poll.id}
              onToggleExpand={() =>
                setExpandedPollId(prev => (prev === poll.id ? null : poll.id))
              }
              onCopyLink={() => copyShareLink(poll.shareCode)}
              onConfirmSlot={slotId => handleConfirmSlot(poll.id, slotId)}
              onArchive={() => handleArchivePoll(poll.id)}
              onDelete={() => handleDeletePoll(poll.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================================================
// Poll card component
// =====================================================================================

interface PollCardProps {
  poll: SchedulingPoll;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCopyLink: () => void;
  onConfirmSlot: (slotId: string) => Promise<void>;
  onArchive: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const STATUS_BADGE: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  open: { label: 'Open', variant: 'default' },
  confirmed: { label: 'Confirmed', variant: 'secondary' },
  archived: { label: 'Archived', variant: 'outline' },
};

function PollCard({
  poll,
  isExpanded,
  onToggleExpand,
  onCopyLink,
  onConfirmSlot,
  onArchive,
  onDelete,
}: PollCardProps) {
  const badge = STATUS_BADGE[poll.status] ?? STATUS_BADGE.open;
  const totalVoters = new Set(
    poll.slots.flatMap(s => s.votes.map(v => v.playerId))
  ).size;

  const slotSummaries = useMemo(() => computeSlotSummaries(poll), [poll]);

  const bestSlots = useMemo(() => computeBestSlots(poll), [poll]);

  const confirmedSlot = poll.confirmedSlotId
    ? poll.slots.find(s => s.id === poll.confirmedSlotId)
    : undefined;

  // Dummy vote handler — GM dashboard is read-only for voting.
  // Voting happens on the public share link page.
  const noopSubmitVotes = useCallback(async (_votes: SchedulingVoteInput[]) => {
    // GM can't vote from dashboard — use the share link
  }, []);

  return (
    <Card
      className={
        poll.status === 'confirmed'
          ? 'border-green-200 dark:border-green-800'
          : undefined
      }
    >
      <CardHeader className="cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarCheck className="h-4 w-4 text-blue-500" />
            {poll.title}
            <Badge variant={badge.variant} className="text-xs">
              {badge.label}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">
              {totalVoters} voter{totalVoters !== 1 ? 's' : ''} ·{' '}
              {poll.slots.length} slot{poll.slots.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        {poll.description && (
          <CardDescription>{poll.description}</CardDescription>
        )}

        {/* Confirmed slot summary */}
        {confirmedSlot && (
          <div className="mt-2 flex items-center gap-2 text-sm font-medium">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span>
              {new Date(confirmedSlot.startTime).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="text-muted-foreground">
              {new Date(confirmedSlot.startTime).toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })}{' '}
              –{' '}
              {new Date(confirmedSlot.endTime).toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
      </CardHeader>

      {/* Actions bar (always visible) */}
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              onCopyLink();
            }}
            className="gap-1"
          >
            <Copy className="h-3 w-3" />
            Copy Voting Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              window.open(`/schedule/${poll.shareCode}`, '_blank');
            }}
            className="gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Open Voting Page
          </Button>
          {poll.status === 'open' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={e => {
                e.stopPropagation();
                onArchive();
              }}
              className="gap-1"
            >
              Archive
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
            className="gap-1 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>
        </div>

        {/* Expanded view: detailed voting card */}
        {isExpanded && (
          <div className="mt-4">
            <PollVotingCard
              poll={poll}
              slotSummaries={slotSummaries}
              bestSlots={bestSlots}
              missingPlayers={[]}
              myVotes={new Map()}
              isGM
              submitting={false}
              onSubmitVotes={noopSubmitVotes}
              onConfirmSlot={onConfirmSlot}
              onArchivePoll={onArchive}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
