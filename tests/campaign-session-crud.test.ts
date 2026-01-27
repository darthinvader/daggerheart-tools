import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type { BattleState } from '../src/lib/schemas/battle';
import type { CampaignFrame, SessionNote } from '../src/lib/schemas/campaign';

const { mockSupabase, selectBuilder, updateBuilder } = vi.hoisted(() => {
  const selectBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    single: vi.fn(),
  };

  const updateBuilder = {
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn(),
  };

  const from = vi.fn(() => ({
    select: (...args: unknown[]) => {
      selectBuilder.select(...args);
      return selectBuilder;
    },
    update: (...args: unknown[]) => {
      updateBuilder.update(...args);
      return updateBuilder;
    },
  }));

  return {
    mockSupabase: { from },
    selectBuilder,
    updateBuilder,
  };
});

vi.mock('../src/lib/supabase', () => ({
  supabase: mockSupabase,
}));

let addSession: typeof import('../src/features/campaigns/campaign-storage').addSession;
let updateSession: typeof import('../src/features/campaigns/campaign-storage').updateSession;
let deleteSession: typeof import('../src/features/campaigns/campaign-storage').deleteSession;
let createBattle: typeof import('../src/features/campaigns/campaign-storage').createBattle;
let updateBattle: typeof import('../src/features/campaigns/campaign-storage').updateBattle;
let deleteBattle: typeof import('../src/features/campaigns/campaign-storage').deleteBattle;

const baseFrame: CampaignFrame = {
  id: 'frame-1',
  name: 'Test Frame',
  complexity: '1',
  pitch: '',
  toneAndFeel: [],
  themes: [],
  touchstones: [],
  overview: '',
  communityGuidance: [],
  ancestryGuidance: [],
  classGuidance: [],
  playerPrinciples: [],
  gmPrinciples: [],
  distinctions: [],
  mechanics: [],
  sessionZeroQuestions: [],
  isTemplate: false,
};

const baseSession: SessionNote = {
  id: 'session-1',
  sessionNumber: 1,
  title: 'Session 1',
  date: '2025-01-01',
  summary: '',
  highlights: [],
  playerNotes: [],
  npcsInvolved: [],
  locations: [],
  questProgress: '',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const baseBattle: BattleState = {
  id: 'battle-1',
  name: 'Test Battle',
  campaignId: 'campaign-1',
  characters: [],
  adversaries: [],
  environments: [],
  spotlight: null,
  spotlightHistory: [],
  fearPool: 0,
  useMassiveThreshold: false,
  notes: '',
  status: 'planning',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

function buildCampaignRow(
  sessions: SessionNote[],
  battles: BattleState[] = []
) {
  return {
    id: 'campaign-1',
    name: 'Test Campaign',
    frame: baseFrame,
    gm_id: 'gm-1',
    players: [],
    sessions,
    npcs: [],
    locations: [],
    quests: [],
    story_threads: [],
    battles,
    session_prep_checklist: [],
    invite_code: null,
    status: 'active',
    notes: '',
    deleted_at: null,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  };
}

describe('campaign session CRUD', () => {
  beforeAll(async () => {
    const module = await import('../src/features/campaigns/campaign-storage');
    addSession = module.addSession;
    updateSession = module.updateSession;
    deleteSession = module.deleteSession;
    createBattle = module.createBattle;
    updateBattle = module.updateBattle;
    deleteBattle = module.deleteBattle;
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-02-01T00:00:00.000Z'));
    selectBuilder.select.mockClear();
    selectBuilder.eq.mockClear();
    selectBuilder.is.mockClear();
    selectBuilder.single.mockClear();
    updateBuilder.update.mockClear();
    updateBuilder.eq.mockClear();
    updateBuilder.is.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds a session and persists updated sessions', async () => {
    selectBuilder.single.mockResolvedValue({
      data: buildCampaignRow([]),
      error: null,
    });
    updateBuilder.is.mockResolvedValue({ error: null });

    const result = await addSession('campaign-1', {
      sessionNumber: 1,
      title: 'Session 1',
      date: '2025-02-01',
      summary: '',
      highlights: [],
      playerNotes: [],
      npcsInvolved: [],
      locations: [],
      questProgress: '',
    });

    expect(result?.sessionNumber).toBe(1);
    expect(updateBuilder.update).toHaveBeenCalledTimes(1);
    const updateArg = updateBuilder.update.mock.calls[0][0] as {
      sessions: SessionNote[];
    };
    expect(updateArg.sessions).toHaveLength(1);
    expect(updateArg.sessions[0].title).toBe('Session 1');
  });

  it('updates a session and writes the changes', async () => {
    selectBuilder.single.mockResolvedValue({
      data: buildCampaignRow([baseSession]),
      error: null,
    });
    updateBuilder.is.mockResolvedValue({ error: null });

    const result = await updateSession('campaign-1', baseSession.id, {
      title: 'Updated Session',
      summary: 'New summary',
    });

    expect(result?.title).toBe('Updated Session');
    expect(updateBuilder.update).toHaveBeenCalledTimes(1);
    const updateArg = updateBuilder.update.mock.calls[0][0] as {
      sessions: SessionNote[];
    };
    expect(updateArg.sessions[0].summary).toBe('New summary');
    expect(updateArg.sessions[0].updatedAt).toBe('2025-02-01T00:00:00.000Z');
  });

  it('deletes a session and persists the remaining entries', async () => {
    const secondSession: SessionNote = {
      ...baseSession,
      id: 'session-2',
      sessionNumber: 2,
    };
    selectBuilder.single.mockResolvedValue({
      data: buildCampaignRow([baseSession, secondSession]),
      error: null,
    });
    updateBuilder.is.mockResolvedValue({ error: null });

    const result = await deleteSession('campaign-1', baseSession.id);

    expect(result).toBe(true);
    expect(updateBuilder.update).toHaveBeenCalledTimes(1);
    const updateArg = updateBuilder.update.mock.calls[0][0] as {
      sessions: SessionNote[];
    };
    expect(updateArg.sessions).toHaveLength(1);
    expect(updateArg.sessions[0].id).toBe('session-2');
  });

  it('returns undefined when campaign is missing', async () => {
    selectBuilder.single.mockResolvedValue({
      data: null,
      error: { code: 'PGRST116' },
    });

    const result = await updateSession('missing', 'session-1', {
      title: 'Nope',
    });

    expect(result).toBeUndefined();
    expect(updateBuilder.update).not.toHaveBeenCalled();
  });

  it('creates a battle and persists it to the campaign', async () => {
    selectBuilder.single.mockResolvedValue({
      data: buildCampaignRow([], []),
      error: null,
    });
    updateBuilder.is.mockResolvedValue({ error: null });

    const result = await createBattle('campaign-1', {
      name: baseBattle.name,
      characters: [],
      adversaries: [],
      environments: [],
      spotlight: null,
      spotlightHistory: [],
      fearPool: 0,
      useMassiveThreshold: false,
      notes: '',
      status: 'planning',
    });

    expect(result.campaignId).toBe('campaign-1');
    expect(updateBuilder.update).toHaveBeenCalledTimes(1);
    const updateArg = updateBuilder.update.mock.calls[0][0] as {
      battles: BattleState[];
      updated_at: string;
    };
    expect(updateArg.battles).toHaveLength(1);
    expect(updateArg.updated_at).toBe('2025-02-01T00:00:00.000Z');
  });

  it('updates a battle and writes the changes', async () => {
    selectBuilder.single.mockResolvedValue({
      data: buildCampaignRow([], [baseBattle]),
      error: null,
    });
    updateBuilder.is.mockResolvedValue({ error: null });

    const result = await updateBattle('campaign-1', baseBattle.id, {
      status: 'active',
      notes: 'Updated notes',
    });

    expect(result?.status).toBe('active');
    expect(updateBuilder.update).toHaveBeenCalledTimes(1);
    const updateArg = updateBuilder.update.mock.calls[0][0] as {
      battles: BattleState[];
      updated_at: string;
    };
    expect(updateArg.battles[0].notes).toBe('Updated notes');
    expect(updateArg.battles[0].updatedAt).toBe('2025-02-01T00:00:00.000Z');
  });

  it('deletes a battle and persists remaining battles', async () => {
    const secondBattle: BattleState = {
      ...baseBattle,
      id: 'battle-2',
      name: 'Second Battle',
    };
    selectBuilder.single.mockResolvedValue({
      data: buildCampaignRow([], [baseBattle, secondBattle]),
      error: null,
    });
    updateBuilder.is.mockResolvedValue({ error: null });

    const result = await deleteBattle('campaign-1', baseBattle.id);

    expect(result).toBe(true);
    expect(updateBuilder.update).toHaveBeenCalledTimes(1);
    const updateArg = updateBuilder.update.mock.calls[0][0] as {
      battles: BattleState[];
      updated_at: string;
    };
    expect(updateArg.battles).toHaveLength(1);
    expect(updateArg.battles[0].id).toBe('battle-2');
  });
});
