// Voting card — displays slots with vote toggles for the current user,
// summary counts, and GM actions (confirm / archive).

import {
  Archive,
  CalendarCheck,
  Check,
  HelpCircle,
  Save,
  Star,
  X,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { SlotSummary } from '@/features/scheduling/scheduling-helpers';
import type { SchedulingVoteInput } from '@/features/scheduling/scheduling-storage';
import type {
  PollSlot,
  PollVote,
  PollVoteValue,
  SchedulingPoll,
} from '@/lib/schemas';

interface PollVotingCardProps {
  poll: SchedulingPoll;
  slotSummaries: SlotSummary[];
  bestSlots: Array<{ id: string }>;
  missingPlayers: Array<{ id: string; name: string }>;
  myVotes: Map<string, PollVoteValue>;
  isGM: boolean;
  submitting: boolean;
  onSubmitVotes: (votes: SchedulingVoteInput[]) => Promise<void>;
  onConfirmSlot: (slotId: string) => Promise<void>;
  onArchivePoll: () => Promise<void>;
}

const VOTE_OPTIONS: Array<{
  value: PollVoteValue;
  label: string;
  icon: typeof Check;
  className: string;
  activeClassName: string;
}> = [
  {
    value: 'available',
    label: 'Available',
    icon: Check,
    className: 'text-green-600 dark:text-green-400',
    activeClassName:
      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700',
  },
  {
    value: 'maybe',
    label: 'Maybe',
    icon: HelpCircle,
    className: 'text-yellow-600 dark:text-yellow-400',
    activeClassName:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
  },
  {
    value: 'unavailable',
    label: 'Unavailable',
    icon: X,
    className: 'text-red-600 dark:text-red-400',
    activeClassName:
      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-300 dark:border-red-700',
  },
];

// -------------------------------------------------------------------------------------
// Lookup map: vote value → badge CSS class (replaces ternary chain)
// -------------------------------------------------------------------------------------

const VOTE_BADGE_CLASSES: Record<PollVoteValue, string> = {
  available:
    'border-green-200 text-green-700 dark:border-green-800 dark:text-green-300',
  maybe:
    'border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300',
  unavailable:
    'border-red-200 text-red-700 dark:border-red-800 dark:text-red-300',
};

// -------------------------------------------------------------------------------------
// Formatting helpers
// -------------------------------------------------------------------------------------

function formatSlotDate(startTime: string): string {
  return new Date(startTime).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatSlotTime(time: string): string {
  return new Date(time).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatSlotDateShort(startTime: string): string {
  return new Date(startTime).toLocaleDateString();
}

// -------------------------------------------------------------------------------------
// Sub-components
// -------------------------------------------------------------------------------------

function VoteCountTooltip({
  count,
  symbol,
  label,
  colorClass,
}: {
  count: number;
  symbol: string;
  label: string;
  colorClass: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={colorClass}>
            {count}
            {symbol}
          </span>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function VoteCounts({ summary }: { summary: SlotSummary }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <VoteCountTooltip
        count={summary.available}
        symbol="✓"
        label="Available"
        colorClass="text-green-600 dark:text-green-400"
      />
      <VoteCountTooltip
        count={summary.maybe}
        symbol="?"
        label="Maybe"
        colorClass="text-yellow-600 dark:text-yellow-400"
      />
      <VoteCountTooltip
        count={summary.unavailable}
        symbol="✗"
        label="Unavailable"
        colorClass="text-red-600 dark:text-red-400"
      />
    </div>
  );
}

function VoteBadge({ vote }: { vote: PollVote }) {
  return (
    <Badge
      variant="outline"
      className={`text-xs ${VOTE_BADGE_CLASSES[vote.value]}`}
    >
      {vote.playerName}
    </Badge>
  );
}

function VotesBreakdown({ votes }: { votes: PollVote[] }) {
  if (votes.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {votes.map(vote => (
        <VoteBadge key={vote.playerId} vote={vote} />
      ))}
    </div>
  );
}

function GMConfirmButton({
  slotId,
  onConfirmSlot,
}: {
  slotId: string;
  onConfirmSlot: (slotId: string) => Promise<void>;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-auto gap-1 text-xs text-green-600 dark:text-green-400"
            onClick={() => onConfirmSlot(slotId)}
          >
            <CalendarCheck className="h-3 w-3" />
            Confirm
          </Button>
        </TooltipTrigger>
        <TooltipContent>Confirm this time slot for the session</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SlotHeader({ slot, isBest }: { slot: PollSlot; isBest: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {isBest && (
        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      )}
      <span className="text-sm font-medium">
        {formatSlotDate(slot.startTime)}
      </span>
      <span className="text-muted-foreground text-xs">
        {formatSlotTime(slot.startTime)} – {formatSlotTime(slot.endTime)}
      </span>
      {slot.label && (
        <Badge variant="secondary" className="text-xs">
          {slot.label}
        </Badge>
      )}
    </div>
  );
}

function VoteButtons({
  slot,
  stagedVotes,
  isGM,
  meetsQuorum,
  onVote,
  onConfirmSlot,
}: {
  slot: PollSlot;
  stagedVotes: Map<string, PollVoteValue>;
  isGM: boolean;
  meetsQuorum: boolean;
  onVote: (slotId: string, value: PollVoteValue) => void;
  onConfirmSlot: (slotId: string) => Promise<void>;
}) {
  return (
    <div className="flex gap-1.5">
      {VOTE_OPTIONS.map(opt => {
        const Icon = opt.icon;
        const isActive = stagedVotes.get(slot.id) === opt.value;
        return (
          <Button
            key={opt.value}
            type="button"
            variant="outline"
            size="sm"
            className={`gap-1 text-xs ${isActive ? opt.activeClassName : ''}`}
            onClick={() => onVote(slot.id, opt.value)}
            aria-pressed={isActive}
            aria-label={`${opt.label} for ${formatSlotDateShort(slot.startTime)}`}
          >
            <Icon className="h-3 w-3" />
            {opt.label}
          </Button>
        );
      })}

      {isGM && meetsQuorum && (
        <GMConfirmButton slotId={slot.id} onConfirmSlot={onConfirmSlot} />
      )}
    </div>
  );
}

function SlotCard({
  summary,
  isBest,
  totalPlayers,
  stagedVotes,
  isGM,
  onVote,
  onConfirmSlot,
}: {
  summary: SlotSummary;
  isBest: boolean;
  totalPlayers: number;
  stagedVotes: Map<string, PollVoteValue>;
  isGM: boolean;
  onVote: (slotId: string, value: PollVoteValue) => void;
  onConfirmSlot: (slotId: string) => Promise<void>;
}) {
  const { slot } = summary;
  const progressPct =
    totalPlayers > 0 ? Math.round((summary.available / totalPlayers) * 100) : 0;

  const borderClass = isBest
    ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30'
    : '';

  return (
    <div className={`rounded-lg border p-3 ${borderClass}`}>
      {/* Slot header */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <SlotHeader slot={slot} isBest={isBest} />
        <VoteCounts summary={summary} />
      </div>

      {/* Progress bar */}
      <Progress
        value={progressPct}
        className="mb-2 h-1.5"
        aria-label={`${progressPct}% available`}
      />

      {/* Vote buttons for current user */}
      <VoteButtons
        slot={slot}
        stagedVotes={stagedVotes}
        isGM={isGM}
        meetsQuorum={summary.meetsQuorum}
        onVote={onVote}
        onConfirmSlot={onConfirmSlot}
      />

      {/* Individual votes breakdown */}
      <VotesBreakdown votes={slot.votes} />
    </div>
  );
}

function MissingPlayers({
  players,
}: {
  players: Array<{ id: string; name: string }>;
}) {
  if (players.length === 0) return null;

  return (
    <div className="text-muted-foreground text-xs">
      Haven&apos;t voted: {players.map(p => p.name).join(', ')}
    </div>
  );
}

function ActionButtons({
  dirty,
  submitting,
  isGM,
  onSave,
  onArchivePoll,
}: {
  dirty: boolean;
  submitting: boolean;
  isGM: boolean;
  onSave: () => void;
  onArchivePoll: () => Promise<void>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {dirty && (
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={submitting}
          className="gap-1"
        >
          <Save className="h-3.5 w-3.5" />
          {submitting ? 'Saving...' : 'Save Votes'}
        </Button>
      )}
      {isGM && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onArchivePoll}
          className="gap-1"
        >
          <Archive className="h-3.5 w-3.5" />
          Archive Poll
        </Button>
      )}
    </div>
  );
}

// -------------------------------------------------------------------------------------
// Main component
// -------------------------------------------------------------------------------------

export function PollVotingCard({
  poll,
  slotSummaries,
  bestSlots,
  missingPlayers,
  myVotes,
  isGM,
  submitting,
  onSubmitVotes,
  onConfirmSlot,
  onArchivePoll,
}: PollVotingCardProps) {
  // Local staged votes (slotId -> value)
  const [stagedVotes, setStagedVotes] = useState<Map<string, PollVoteValue>>(
    () => new Map(myVotes)
  );
  const [dirty, setDirty] = useState(false);

  const bestSlotIds = new Set(bestSlots.map(s => s.id));

  const handleVote = useCallback((slotId: string, value: PollVoteValue) => {
    setStagedVotes(prev => {
      const next = new Map(prev);
      // Toggle off if already selected
      if (next.get(slotId) === value) {
        next.delete(slotId);
      } else {
        next.set(slotId, value);
      }
      return next;
    });
    setDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    const votes: SchedulingVoteInput[] = [];
    for (const [slotId, value] of stagedVotes) {
      votes.push({ slotId, value });
    }
    if (votes.length === 0) return;
    await onSubmitVotes(votes);
    setDirty(false);
  }, [stagedVotes, onSubmitVotes]);

  const totalPlayers =
    (poll.slots[0]?.votes.length ?? 0) + missingPlayers.length;

  return (
    <div className="space-y-4">
      {/* Slot list */}
      <div className="space-y-3">
        {slotSummaries.map(summary => (
          <SlotCard
            key={summary.slot.id}
            summary={summary}
            isBest={bestSlotIds.has(summary.slot.id)}
            totalPlayers={totalPlayers}
            stagedVotes={stagedVotes}
            isGM={isGM}
            onVote={handleVote}
            onConfirmSlot={onConfirmSlot}
          />
        ))}
      </div>

      <MissingPlayers players={missingPlayers} />

      <ActionButtons
        dirty={dirty}
        submitting={submitting}
        isGM={isGM}
        onSave={handleSave}
        onArchivePoll={onArchivePoll}
      />
    </div>
  );
}
