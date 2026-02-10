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
import { useCallback, useMemo } from 'react';

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
import type { SchedulingVoteInput } from '@/features/scheduling/scheduling-storage';
import type { SchedulingPoll } from '@/lib/schemas/scheduling';

import { useSchedulingState } from './-use-scheduling-state';

export const Route = createFileRoute('/gm/scheduling')({
  component: SchedulingDashboard,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
});

function SchedulingDashboard() {
  const {
    loading,
    ui,
    openPolls,
    closedPolls,
    toggleShowCreate,
    openShowCreate,
    closeShowCreate,
    toggleExpandPoll,
    handleCreate,
    handleConfirmSlot,
    handleArchivePoll,
    handleDeletePoll,
    copyShareLink,
  } = useSchedulingState();

  const { showCreate, expandedPollId } = ui;
  const hasNoPolls = openPolls.length === 0 && closedPolls.length === 0;

  if (loading) {
    return <SchedulingLoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SchedulingHeader onToggleCreate={toggleShowCreate} />

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
              onCancel={closeShowCreate}
            />
          </CardContent>
        </Card>
      )}

      {hasNoPolls && !showCreate && (
        <SchedulingEmptyState onCreate={openShowCreate} />
      )}

      <PollListSection
        title="Active Polls"
        polls={openPolls}
        expandedPollId={expandedPollId}
        onToggleExpand={toggleExpandPoll}
        onCopyLink={copyShareLink}
        onConfirmSlot={handleConfirmSlot}
        onArchive={handleArchivePoll}
        onDelete={handleDeletePoll}
        className="mb-8"
      />

      <PollListSection
        title="Past Polls"
        titleClassName="text-muted-foreground"
        polls={closedPolls}
        expandedPollId={expandedPollId}
        onToggleExpand={toggleExpandPoll}
        onCopyLink={copyShareLink}
        onConfirmSlot={handleConfirmSlot}
        onArchive={handleArchivePoll}
        onDelete={handleDeletePoll}
      />
    </div>
  );
}

// =====================================================================================
// Sub-components
// =====================================================================================

function SchedulingLoadingSkeleton() {
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

interface SchedulingHeaderProps {
  onToggleCreate: () => void;
}

function SchedulingHeader({ onToggleCreate }: SchedulingHeaderProps) {
  return (
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
      <Button onClick={onToggleCreate} className="gap-2">
        <CalendarPlus className="h-4 w-4" />
        New Poll
      </Button>
    </div>
  );
}

interface SchedulingEmptyStateProps {
  onCreate: () => void;
}

function SchedulingEmptyState({ onCreate }: SchedulingEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <CalendarCheck className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg font-semibold">No scheduling polls yet</h3>
        <p className="text-muted-foreground mb-4 max-w-md text-sm">
          Create a poll with time slots, then share the voting link with your
          players so they can mark their availability.
        </p>
        <Button onClick={onCreate} className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          Create Your First Poll
        </Button>
      </CardContent>
    </Card>
  );
}

interface PollListSectionProps {
  title: string;
  titleClassName?: string;
  polls: SchedulingPoll[];
  expandedPollId: string | null;
  onToggleExpand: (pollId: string) => void;
  onCopyLink: (shareCode: string) => Promise<void>;
  onConfirmSlot: (pollId: string, slotId: string) => Promise<void>;
  onArchive: (pollId: string) => Promise<void>;
  onDelete: (pollId: string) => Promise<void>;
  className?: string;
}

function PollListSection({
  title,
  titleClassName,
  polls,
  expandedPollId,
  onToggleExpand,
  onCopyLink,
  onConfirmSlot,
  onArchive,
  onDelete,
  className,
}: PollListSectionProps) {
  if (polls.length === 0) return null;

  return (
    <div className={className ? `space-y-4 ${className}` : 'space-y-4'}>
      <h2
        className={
          titleClassName
            ? `text-lg font-semibold ${titleClassName}`
            : 'text-lg font-semibold'
        }
      >
        {title}
      </h2>
      {polls.map(poll => (
        <PollCard
          key={poll.id}
          poll={poll}
          isExpanded={expandedPollId === poll.id}
          onToggleExpand={() => onToggleExpand(poll.id)}
          onCopyLink={() => onCopyLink(poll.shareCode)}
          onConfirmSlot={slotId => onConfirmSlot(poll.id, slotId)}
          onArchive={() => onArchive(poll.id)}
          onDelete={() => onDelete(poll.id)}
        />
      ))}
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
