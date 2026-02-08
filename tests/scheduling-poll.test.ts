import { describe, expect, it } from 'vitest';

import {
  buildVoteMap,
  computeBestSlots,
  computeSlotSummaries,
  getMissingPlayers,
  getPlayerVote,
  getRespondedPlayerIds,
  hasQuorum,
} from '../src/features/scheduling/scheduling-helpers';
import type { PollSlot, SchedulingPoll } from '../src/lib/schemas';
import { SchedulingPollSchema } from '../src/lib/schemas/scheduling';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeSlot(overrides?: Partial<PollSlot>): PollSlot {
  return {
    id: overrides?.id ?? crypto.randomUUID(),
    startTime: overrides?.startTime ?? '2025-07-01T18:00:00Z',
    endTime: overrides?.endTime ?? '2025-07-01T21:00:00Z',
    label: overrides?.label ?? '',
    votes: overrides?.votes ?? [],
  };
}

// eslint-disable-next-line complexity
function makePoll(overrides?: Partial<SchedulingPoll>): SchedulingPoll {
  const now = new Date().toISOString();
  return {
    id: overrides?.id ?? crypto.randomUUID(),
    gmId: overrides?.gmId ?? 'gm-1',
    campaignId: overrides?.campaignId,
    title: overrides?.title ?? 'Test Poll',
    description: overrides?.description ?? '',
    status: overrides?.status ?? 'open',
    slots: overrides?.slots ?? [makeSlot(), makeSlot()],
    quorum: overrides?.quorum ?? 2,
    confirmedSlotId: overrides?.confirmedSlotId,
    shareCode: overrides?.shareCode ?? 'abc123',
    createdAt: overrides?.createdAt ?? now,
    updatedAt: overrides?.updatedAt ?? now,
  };
}

const PLAYERS = [
  { id: 'p1', name: 'Alice' },
  { id: 'p2', name: 'Bob' },
  { id: 'p3', name: 'Carol' },
];

// ---------------------------------------------------------------------------
// Schema validation
// ---------------------------------------------------------------------------

describe('SchedulingPollSchema', () => {
  it('validates a well-formed poll', () => {
    const poll = makePoll();
    const result = SchedulingPollSchema.safeParse(poll);
    expect(result.success).toBe(true);
  });

  it('rejects a poll missing title', () => {
    const result = SchedulingPollSchema.safeParse({
      id: 'x',
      gmId: 'gm-1',
      title: '',
      status: 'open',
      slots: [],
      quorum: 1,
      shareCode: 'abc',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid status', () => {
    const poll = makePoll();
    const result = SchedulingPollSchema.safeParse({
      ...poll,
      status: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('validates poll with optional campaignId', () => {
    const poll = makePoll({ campaignId: 'camp-1' });
    const result = SchedulingPollSchema.safeParse(poll);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.campaignId).toBe('camp-1');
    }
  });

  it('validates poll without campaignId', () => {
    const poll = makePoll();
    const result = SchedulingPollSchema.safeParse(poll);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.campaignId).toBeUndefined();
    }
  });
});

// ---------------------------------------------------------------------------
// Vote analysis
// ---------------------------------------------------------------------------

describe('computeSlotSummaries', () => {
  it('counts votes correctly', () => {
    const slot = makeSlot({
      votes: [
        {
          playerId: 'p1',
          playerName: 'Alice',
          value: 'available',
          updatedAt: '2025-07-01T00:00:00Z',
        },
        {
          playerId: 'p2',
          playerName: 'Bob',
          value: 'maybe',
          updatedAt: '2025-07-01T00:00:00Z',
        },
        {
          playerId: 'p3',
          playerName: 'Carol',
          value: 'unavailable',
          updatedAt: '2025-07-01T00:00:00Z',
        },
      ],
    });
    const poll = makePoll({ slots: [slot], quorum: 1 });
    const summaries = computeSlotSummaries(poll);
    expect(summaries).toHaveLength(1);
    expect(summaries[0].available).toBe(1);
    expect(summaries[0].maybe).toBe(1);
    expect(summaries[0].unavailable).toBe(1);
    expect(summaries[0].total).toBe(3);
    expect(summaries[0].meetsQuorum).toBe(true);
  });

  it('meetsQuorum is false when below threshold', () => {
    const slot = makeSlot({
      votes: [
        {
          playerId: 'p1',
          playerName: 'Alice',
          value: 'maybe',
          updatedAt: '2025-07-01T00:00:00Z',
        },
      ],
    });
    const poll = makePoll({ slots: [slot], quorum: 2 });
    const summaries = computeSlotSummaries(poll);
    expect(summaries[0].meetsQuorum).toBe(false);
  });
});

describe('computeBestSlots', () => {
  it('returns slots with the highest available count that meet quorum', () => {
    const slot1 = makeSlot({
      id: 's1',
      votes: [
        {
          playerId: 'p1',
          playerName: 'Alice',
          value: 'available',
          updatedAt: '2025-07-01T00:00:00Z',
        },
        {
          playerId: 'p2',
          playerName: 'Bob',
          value: 'available',
          updatedAt: '2025-07-01T00:00:00Z',
        },
      ],
    });
    const slot2 = makeSlot({
      id: 's2',
      votes: [
        {
          playerId: 'p1',
          playerName: 'Alice',
          value: 'available',
          updatedAt: '2025-07-01T00:00:00Z',
        },
      ],
    });
    const poll = makePoll({ slots: [slot1, slot2], quorum: 1 });
    const best = computeBestSlots(poll);
    expect(best).toHaveLength(1);
    expect(best[0].id).toBe('s1');
  });

  it('returns empty array when no slots meet quorum', () => {
    const slot = makeSlot({ votes: [] });
    const poll = makePoll({ slots: [slot], quorum: 1 });
    const best = computeBestSlots(poll);
    expect(best).toHaveLength(0);
  });
});

describe('getRespondedPlayerIds', () => {
  it('collects unique player ids across all slots', () => {
    const poll = makePoll({
      slots: [
        makeSlot({
          votes: [
            {
              playerId: 'p1',
              playerName: 'Alice',
              value: 'available',
              updatedAt: '2025-07-01T00:00:00Z',
            },
          ],
        }),
        makeSlot({
          votes: [
            {
              playerId: 'p1',
              playerName: 'Alice',
              value: 'maybe',
              updatedAt: '2025-07-01T00:00:00Z',
            },
            {
              playerId: 'p2',
              playerName: 'Bob',
              value: 'available',
              updatedAt: '2025-07-01T00:00:00Z',
            },
          ],
        }),
      ],
    });
    const ids = getRespondedPlayerIds(poll);
    expect(ids.size).toBe(2);
    expect(ids.has('p1')).toBe(true);
    expect(ids.has('p2')).toBe(true);
  });
});

describe('getMissingPlayers', () => {
  it('returns players who have not voted in any slot', () => {
    const poll = makePoll({
      slots: [
        makeSlot({
          votes: [
            {
              playerId: 'p1',
              playerName: 'Alice',
              value: 'available',
              updatedAt: '2025-07-01T00:00:00Z',
            },
          ],
        }),
      ],
    });
    const missing = getMissingPlayers(poll, PLAYERS);
    expect(missing).toHaveLength(2);
    expect(missing.map(p => p.id)).toContain('p2');
    expect(missing.map(p => p.id)).toContain('p3');
  });
});

describe('hasQuorum', () => {
  it('returns true when at least one slot meets quorum', () => {
    const poll = makePoll({
      quorum: 2,
      slots: [
        makeSlot({
          votes: [
            {
              playerId: 'p1',
              playerName: 'Alice',
              value: 'available',
              updatedAt: '2025-07-01T00:00:00Z',
            },
            {
              playerId: 'p2',
              playerName: 'Bob',
              value: 'available',
              updatedAt: '2025-07-01T00:00:00Z',
            },
          ],
        }),
        makeSlot({ votes: [] }),
      ],
    });
    expect(hasQuorum(poll)).toBe(true);
  });

  it('returns false when no slot meets quorum', () => {
    const poll = makePoll({
      quorum: 3,
      slots: [
        makeSlot({
          votes: [
            {
              playerId: 'p1',
              playerName: 'Alice',
              value: 'available',
              updatedAt: '2025-07-01T00:00:00Z',
            },
          ],
        }),
      ],
    });
    expect(hasQuorum(poll)).toBe(false);
  });
});

describe('getPlayerVote', () => {
  it('returns the vote for a given player', () => {
    const slot = makeSlot({
      votes: [
        {
          playerId: 'p1',
          playerName: 'Alice',
          value: 'available',
          updatedAt: '2025-07-01T00:00:00Z',
        },
        {
          playerId: 'p2',
          playerName: 'Bob',
          value: 'maybe',
          updatedAt: '2025-07-01T00:00:00Z',
        },
      ],
    });
    expect(getPlayerVote(slot, 'p1')?.value).toBe('available');
    expect(getPlayerVote(slot, 'p2')?.value).toBe('maybe');
    expect(getPlayerVote(slot, 'p3')).toBeUndefined();
  });
});

describe('buildVoteMap', () => {
  it('builds a map of slotId → value for a given player', () => {
    const slot1 = makeSlot({
      id: 's1',
      votes: [
        {
          playerId: 'p1',
          playerName: 'Alice',
          value: 'available',
          updatedAt: '2025-07-01T00:00:00Z',
        },
      ],
    });
    const slot2 = makeSlot({
      id: 's2',
      votes: [
        {
          playerId: 'p1',
          playerName: 'Alice',
          value: 'maybe',
          updatedAt: '2025-07-01T00:00:00Z',
        },
        {
          playerId: 'p2',
          playerName: 'Bob',
          value: 'available',
          updatedAt: '2025-07-01T00:00:00Z',
        },
      ],
    });
    const poll = makePoll({ slots: [slot1, slot2] });
    const map = buildVoteMap(poll, 'p1');
    expect(map.size).toBe(2);
    expect(map.get('s1')).toBe('available');
    expect(map.get('s2')).toBe('maybe');
  });

  it('returns empty map when player has no votes', () => {
    const poll = makePoll({ slots: [makeSlot()] });
    const map = buildVoteMap(poll, 'p1');
    expect(map.size).toBe(0);
  });
});
