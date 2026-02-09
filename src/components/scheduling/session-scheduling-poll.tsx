// Session Scheduling Poll — orchestrator component
// Renders either the create form, voting card, or confirmed banner based on state.

import {
  CalendarCheck,
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  Clock,
  Trash2,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { SlotSummary } from '@/features/scheduling/scheduling-helpers';
import type { SchedulingVoteInput } from '@/features/scheduling/scheduling-storage';
import type { PollVoteValue, SchedulingPoll } from '@/lib/schemas';

import { PollCreateForm } from './poll-create-form';
import { PollVotingCard } from './poll-voting-card';

type CreateHandler = (
  title: string,
  slots: Array<{ startTime: string; endTime: string; label?: string }>,
  options?: { description?: string; quorum?: number }
) => Promise<void>;

interface SessionSchedulingPollProps {
  activePoll: SchedulingPoll | undefined;
  isGM: boolean;
  slotSummaries: SlotSummary[];
  bestSlots: Array<{ id: string }>;
  missingPlayers: Array<{ id: string; name: string }>;
  myVotes: Map<string, PollVoteValue>;
  submitting: boolean;
  onOpenNewPoll: CreateHandler;
  onConfirmSlot: (slotId: string) => Promise<void>;
  onArchivePoll: () => Promise<void>;
  onClearPoll: () => Promise<void>;
  onSubmitVotes: (votes: SchedulingVoteInput[]) => Promise<void>;
}

/* ── Sub-components ── */

function EmptyState({
  isGM,
  showCreate,
  onShowCreate,
  onHideCreate,
  onSubmit,
}: {
  isGM: boolean;
  showCreate: boolean;
  onShowCreate: () => void;
  onHideCreate: () => void;
  onSubmit: CreateHandler;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarCheck className="h-4 w-4 text-blue-500" />
          Session Scheduling
        </CardTitle>
        <CardDescription>
          Create a poll so players can vote on when the next session should be
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGM && !showCreate && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShowCreate}
            className="gap-2"
          >
            <CalendarPlus className="h-4 w-4" />
            Create Scheduling Poll
          </Button>
        )}
        {!isGM && (
          <p className="text-muted-foreground text-sm">
            No scheduling poll is active. The GM can create one.
          </p>
        )}
        {showCreate && (
          <PollCreateForm onSubmit={onSubmit} onCancel={onHideCreate} />
        )}
      </CardContent>
    </Card>
  );
}

function ConfirmedState({
  poll,
  isGM,
  showCreate,
  onShowCreate,
  onHideCreate,
  onClearPoll,
  onSubmit,
}: {
  poll: SchedulingPoll;
  isGM: boolean;
  showCreate: boolean;
  onShowCreate: () => void;
  onHideCreate: () => void;
  onClearPoll: () => Promise<void>;
  onSubmit: CreateHandler;
}) {
  const confirmedSlot = poll.slots.find(s => s.id === poll.confirmedSlotId);
  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarCheck className="h-4 w-4 text-green-500" />
          Session Confirmed!
        </CardTitle>
        <CardDescription>{poll.title}</CardDescription>
      </CardHeader>
      <CardContent>
        {confirmedSlot && (
          <div className="flex items-center gap-2 text-sm font-medium">
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
            {confirmedSlot.label && (
              <Badge variant="secondary">{confirmedSlot.label}</Badge>
            )}
          </div>
        )}
        {isGM && (
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearPoll}
              className="gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowCreate}
              className="gap-1"
            >
              <CalendarPlus className="h-3 w-3" />
              New Poll
            </Button>
          </div>
        )}
        {showCreate && (
          <div className="mt-4">
            <PollCreateForm onSubmit={onSubmit} onCancel={onHideCreate} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SessionSchedulingPoll({
  activePoll,
  isGM,
  slotSummaries,
  bestSlots,
  missingPlayers,
  myVotes,
  submitting,
  onOpenNewPoll,
  onConfirmSlot,
  onArchivePoll,
  onClearPoll,
  onSubmitVotes,
}: SessionSchedulingPollProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleShowCreate = useCallback(() => setShowCreate(true), []);
  const handleHideCreate = useCallback(() => setShowCreate(false), []);
  const handleToggleCollapse = useCallback(
    (open: boolean) => setIsCollapsed(!open),
    []
  );

  const handleCreate = useCallback(
    async (
      title: string,
      slots: Array<{ startTime: string; endTime: string; label?: string }>,
      options?: { description?: string; quorum?: number }
    ) => {
      await onOpenNewPoll(title, slots, options);
      setShowCreate(false);
    },
    [onOpenNewPoll]
  );

  // No poll = show empty state or create form
  if (!activePoll) {
    return (
      <EmptyState
        isGM={isGM}
        showCreate={showCreate}
        onShowCreate={handleShowCreate}
        onHideCreate={handleHideCreate}
        onSubmit={handleCreate}
      />
    );
  }

  // Confirmed poll
  if (activePoll.status === 'confirmed') {
    return (
      <ConfirmedState
        poll={activePoll}
        isGM={isGM}
        showCreate={showCreate}
        onShowCreate={handleShowCreate}
        onHideCreate={handleHideCreate}
        onClearPoll={onClearPoll}
        onSubmit={handleCreate}
      />
    );
  }

  // Open poll — voting state
  const CollapseIcon = isCollapsed ? ChevronDown : ChevronUp;

  return (
    <Collapsible open={!isCollapsed} onOpenChange={handleToggleCollapse}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarCheck className="h-4 w-4 text-blue-500" />
              {activePoll.title}
              <Badge variant="outline" className="text-xs">
                Open
              </Badge>
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <CollapseIcon className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          {activePoll.description && (
            <CardDescription>{activePoll.description}</CardDescription>
          )}
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <PollVotingCard
              poll={activePoll}
              slotSummaries={slotSummaries}
              bestSlots={bestSlots}
              missingPlayers={missingPlayers}
              myVotes={myVotes}
              isGM={isGM}
              submitting={submitting}
              onSubmitVotes={onSubmitVotes}
              onConfirmSlot={onConfirmSlot}
              onArchivePoll={onArchivePoll}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
