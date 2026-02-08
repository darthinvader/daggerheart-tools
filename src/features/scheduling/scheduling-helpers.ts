// Pure helper functions for session scheduling polls

import type {
  PollSlot,
  PollVote,
  PollVoteValue,
  SchedulingPoll,
} from '@/lib/schemas';

// =====================================================================================
// Vote analysis
// =====================================================================================

export interface SlotSummary {
  slot: PollSlot;
  available: number;
  maybe: number;
  unavailable: number;
  total: number;
  meetsQuorum: boolean;
}

export function computeSlotSummaries(poll: SchedulingPoll): SlotSummary[] {
  return poll.slots.map(slot => {
    const available = slot.votes.filter(v => v.value === 'available').length;
    const maybe = slot.votes.filter(v => v.value === 'maybe').length;
    const unavailable = slot.votes.filter(
      v => v.value === 'unavailable'
    ).length;
    return {
      slot,
      available,
      maybe,
      unavailable,
      total: slot.votes.length,
      meetsQuorum: available >= poll.quorum,
    };
  });
}

export function computeBestSlots(poll: SchedulingPoll): PollSlot[] {
  const summaries = computeSlotSummaries(poll);
  const viable = summaries.filter(s => s.meetsQuorum);
  if (viable.length === 0) return [];

  const maxAvailable = Math.max(...viable.map(s => s.available));
  return viable.filter(s => s.available === maxAvailable).map(s => s.slot);
}

export function getRespondedPlayerIds(poll: SchedulingPoll): Set<string> {
  const ids = new Set<string>();
  for (const slot of poll.slots) {
    for (const vote of slot.votes) {
      ids.add(vote.playerId);
    }
  }
  return ids;
}

export function getMissingPlayers<T extends { id: string }>(
  poll: SchedulingPoll,
  players: T[]
): T[] {
  const responded = getRespondedPlayerIds(poll);
  return players.filter(p => !responded.has(p.id));
}

export function hasQuorum(poll: SchedulingPoll): boolean {
  return poll.slots.some(slot => {
    const available = slot.votes.filter(v => v.value === 'available').length;
    return available >= poll.quorum;
  });
}

/** Get a player's current vote for a specific slot, or undefined */
export function getPlayerVote(
  slot: PollSlot,
  playerId: string
): PollVote | undefined {
  return slot.votes.find(v => v.playerId === playerId);
}

/** Build a local vote map (slotId → value) for batch submission */
export function buildVoteMap(
  poll: SchedulingPoll,
  playerId: string
): Map<string, PollVoteValue> {
  const map = new Map<string, PollVoteValue>();
  for (const slot of poll.slots) {
    const vote = getPlayerVote(slot, playerId);
    if (vote) {
      map.set(slot.id, vote.value);
    }
  }
  return map;
}
