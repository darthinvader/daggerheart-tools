// Public Scheduling Vote Page — players access this via a shareable link
// Route: /schedule/$shareCode

import {
  createFileRoute,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import {
  CalendarCheck,
  Check,
  Clock,
  HelpCircle,
  Save,
  Star,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  buildVoteMap,
  computeBestSlots,
  computeSlotSummaries,
} from '@/features/scheduling/scheduling-helpers';
import {
  getSchedulingPollByShareCode,
  submitSchedulingVote,
} from '@/features/scheduling/scheduling-storage';
import type { PollVoteValue, SchedulingPoll } from '@/lib/schemas/scheduling';

export const Route = createFileRoute('/schedule/$shareCode')({
  component: ScheduleVotePage,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
});

// eslint-disable-next-line max-lines-per-function
function ScheduleVotePage() {
  const { shareCode } = Route.useParams();
  const { user } = useAuth();

  const [poll, setPoll] = useState<SchedulingPoll | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Local staged votes: slotId → value
  const [stagedVotes, setStagedVotes] = useState<Map<string, PollVoteValue>>(
    new Map()
  );
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  const currentUserId = user?.id ?? '';

  // Load poll
  useEffect(() => {
    getSchedulingPollByShareCode(shareCode)
      .then(data => {
        if (data) {
          setPoll(data);
          // Pre-populate staged votes from existing votes
          if (currentUserId) {
            const existing = buildVoteMap(data, currentUserId);
            setStagedVotes(existing);
          }
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [shareCode, currentUserId]);

  const slotSummaries = useMemo(
    () => (poll ? computeSlotSummaries(poll) : []),
    [poll]
  );

  const bestSlots = useMemo(() => (poll ? computeBestSlots(poll) : []), [poll]);

  const bestSlotIds = useMemo(
    () => new Set(bestSlots.map(s => s.id)),
    [bestSlots]
  );

  const setVote = useCallback((slotId: string, value: PollVoteValue) => {
    setStagedVotes(prev => {
      const next = new Map(prev);
      next.set(slotId, value);
      return next;
    });
    setHasLocalChanges(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!poll || !currentUserId) return;
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const votes = Array.from(stagedVotes.entries()).map(([slotId, value]) => ({
      slotId,
      value,
    }));

    if (votes.length === 0) {
      toast.error('Please vote on at least one time slot');
      return;
    }

    setSubmitting(true);
    try {
      await submitSchedulingVote(shareCode, playerName.trim(), votes);
      toast.success('Availability submitted!');
      setHasLocalChanges(false);
      // Reload to see updated counts
      const updated = await getSchedulingPollByShareCode(shareCode);
      if (updated) setPoll(updated);
    } catch {
      toast.error('Failed to submit votes');
    } finally {
      setSubmitting(false);
    }
  }, [poll, currentUserId, playerName, stagedVotes, shareCode]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="bg-muted mb-4 h-8 w-64 animate-pulse rounded" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-muted h-20 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !poll) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <CalendarCheck className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h1 className="mb-2 text-2xl font-bold">Poll Not Found</h1>
        <p className="text-muted-foreground">
          This scheduling poll doesn&apos;t exist or has been deleted.
        </p>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <CalendarCheck className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h1 className="mb-2 text-2xl font-bold">{poll.title}</h1>
        <p className="text-muted-foreground mb-4">
          Please log in to vote on this scheduling poll.
        </p>
        <Button asChild>
          <a href="/login">Log In</a>
        </Button>
      </div>
    );
  }

  // Confirmed
  if (poll.status === 'confirmed') {
    const confirmedSlot = poll.slots.find(s => s.id === poll.confirmedSlotId);
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-green-500" />
              Session Confirmed!
            </CardTitle>
            <CardDescription>{poll.title}</CardDescription>
          </CardHeader>
          <CardContent>
            {confirmedSlot && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span>
                  {new Date(confirmedSlot.startTime).toLocaleDateString(
                    undefined,
                    { weekday: 'long', month: 'long', day: 'numeric' }
                  )}
                </span>
                <span className="text-muted-foreground">
                  {new Date(confirmedSlot.startTime).toLocaleTimeString(
                    undefined,
                    { hour: 'numeric', minute: '2-digit' }
                  )}{' '}
                  –{' '}
                  {new Date(confirmedSlot.endTime).toLocaleTimeString(
                    undefined,
                    { hour: 'numeric', minute: '2-digit' }
                  )}
                </span>
                {confirmedSlot.label && (
                  <Badge variant="secondary">{confirmedSlot.label}</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Archived
  if (poll.status === 'archived') {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <CalendarCheck className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h1 className="mb-2 text-2xl font-bold">{poll.title}</h1>
        <p className="text-muted-foreground">
          This poll has been closed. No more votes are being accepted.
        </p>
      </div>
    );
  }

  // Open — voting interface
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-blue-500" />
            {poll.title}
          </CardTitle>
          {poll.description && (
            <CardDescription>{poll.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Player name input */}
          <div className="space-y-2">
            <Label htmlFor="player-name">Your Name</Label>
            <Input
              id="player-name"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Time slots */}
          <div className="space-y-3">
            <Label>When can you play?</Label>
            {slotSummaries.map(summary => {
              const { slot } = summary;
              const currentVote = stagedVotes.get(slot.id);
              const isBest = bestSlotIds.has(slot.id);

              return (
                <div
                  key={slot.id}
                  className={`rounded-lg border p-4 ${isBest ? 'border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-950/20' : ''}`}
                >
                  {/* Slot time */}
                  <div className="mb-3 flex items-center gap-2">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">
                      {new Date(slot.startTime).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {new Date(slot.startTime).toLocaleTimeString(undefined, {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}{' '}
                      –{' '}
                      {new Date(slot.endTime).toLocaleTimeString(undefined, {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                    {slot.label && (
                      <Badge variant="secondary" className="text-xs">
                        {slot.label}
                      </Badge>
                    )}
                    {isBest && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Star className="h-4 w-4 text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent>Best slot so far</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  {/* Vote buttons */}
                  <div className="mb-3 flex gap-2">
                    <Button
                      variant={
                        currentVote === 'available' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setVote(slot.id, 'available')}
                      className="gap-1"
                    >
                      <Check className="h-3 w-3" />
                      Available
                    </Button>
                    <Button
                      variant={currentVote === 'maybe' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVote(slot.id, 'maybe')}
                      className="gap-1"
                    >
                      <HelpCircle className="h-3 w-3" />
                      Maybe
                    </Button>
                    <Button
                      variant={
                        currentVote === 'unavailable'
                          ? 'destructive'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => setVote(slot.id, 'unavailable')}
                      className="gap-1"
                    >
                      <X className="h-3 w-3" />
                      Unavailable
                    </Button>
                  </div>

                  {/* Summary bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {summary.available} available · {summary.maybe} maybe ·{' '}
                        {summary.unavailable} unavailable
                      </span>
                      {summary.meetsQuorum && (
                        <Badge
                          variant="secondary"
                          className="text-xs text-green-600"
                        >
                          Meets quorum
                        </Badge>
                      )}
                    </div>
                    {summary.total > 0 && (
                      <Progress
                        value={
                          (summary.available / Math.max(summary.total, 1)) * 100
                        }
                        className="h-1.5"
                      />
                    )}
                  </div>

                  {/* Existing votes list */}
                  {slot.votes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {slot.votes.map(vote => (
                        <Badge
                          key={vote.playerId}
                          variant="outline"
                          className={`text-xs ${
                            vote.value === 'available'
                              ? 'border-green-300 text-green-700 dark:text-green-400'
                              : vote.value === 'maybe'
                                ? 'border-amber-300 text-amber-700 dark:text-amber-400'
                                : 'border-red-300 text-red-700 dark:text-red-400'
                          }`}
                        >
                          {vote.playerName}:{' '}
                          {vote.value === 'available'
                            ? '✓'
                            : vote.value === 'maybe'
                              ? '?'
                              : '✗'}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={submitting || !hasLocalChanges || !playerName.trim()}
            className="w-full gap-2"
          >
            <Save className="h-4 w-4" />
            {submitting ? 'Submitting...' : 'Submit Availability'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
