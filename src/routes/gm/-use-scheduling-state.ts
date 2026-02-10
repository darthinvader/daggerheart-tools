// Custom hook: scheduling poll state management for the GM dashboard
// Extracted from scheduling.tsx to reduce component complexity

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  type CreatePollInput,
  createSchedulingPoll,
  deleteSchedulingPoll,
  listSchedulingPolls,
  updateSchedulingPoll,
} from '@/features/scheduling/scheduling-storage';
import type { SchedulingPoll } from '@/lib/schemas/scheduling';
import { copyToClipboard } from '@/lib/utils';

// =====================================================================================
// Pure helper functions (extracted data transformations)
// =====================================================================================

interface SlotInput {
  startTime: string;
  endTime: string;
  label?: string;
}

interface CreateOptions {
  description?: string;
  quorum?: number;
}

/** Map form inputs to the storage-layer shape */
function buildCreatePollInput(
  title: string,
  slots: SlotInput[],
  options?: CreateOptions
): CreatePollInput {
  return {
    title,
    slots: slots.map(s => ({
      startTime: s.startTime,
      endTime: s.endTime,
      label: s.label,
    })),
    description: options?.description,
    quorum: options?.quorum,
  };
}

/** Partition polls into open vs. closed (confirmed/archived) */
function partitionPolls(polls: SchedulingPoll[]) {
  const open: SchedulingPoll[] = [];
  const closed: SchedulingPoll[] = [];
  for (const p of polls) {
    if (p.status === 'open') {
      open.push(p);
    } else {
      closed.push(p);
    }
  }
  return { open, closed } as const;
}

/** Build a full shareable voting link from a share code */
function buildShareLink(shareCode: string): string {
  return `${window.location.origin}/schedule/${shareCode}`;
}

// =====================================================================================
// Grouped UI state
// =====================================================================================

interface UIState {
  showCreate: boolean;
  expandedPollId: string | null;
}

const INITIAL_UI: UIState = { showCreate: false, expandedPollId: null };

// =====================================================================================
// Hook
// =====================================================================================

export function useSchedulingState() {
  const [polls, setPolls] = useState<SchedulingPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [ui, setUI] = useState<UIState>(INITIAL_UI);

  // --- Data fetching ---

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

  // --- UI toggles (grouped) ---

  const toggleShowCreate = useCallback(() => {
    setUI(prev => ({ ...prev, showCreate: !prev.showCreate }));
  }, []);

  const openShowCreate = useCallback(() => {
    setUI(prev => ({ ...prev, showCreate: true }));
  }, []);

  const closeShowCreate = useCallback(() => {
    setUI(prev => ({ ...prev, showCreate: false }));
  }, []);

  const toggleExpandPoll = useCallback((pollId: string) => {
    setUI(prev => ({
      ...prev,
      expandedPollId: prev.expandedPollId === pollId ? null : pollId,
    }));
  }, []);

  // --- CRUD handlers ---

  const handleCreate = useCallback(
    async (title: string, slots: SlotInput[], options?: CreateOptions) => {
      const input = buildCreatePollInput(title, slots, options);
      try {
        const created = await createSchedulingPoll(input);
        setPolls(prev => [created, ...prev]);
        setUI(prev => ({ ...prev, showCreate: false }));
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
    await copyToClipboard(
      buildShareLink(shareCode),
      'Voting link copied to clipboard'
    );
  }, []);

  // --- Derived data ---

  const { open: openPolls, closed: closedPolls } = useMemo(
    () => partitionPolls(polls),
    [polls]
  );

  return {
    polls,
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
  } as const;
}
