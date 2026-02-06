/**
 * Story Thread Entity Handlers Hook
 *
 * Consolidates CRUD operations for EditableStoryThreads.
 */
import { useCallback } from 'react';

import {
  addStoryThread,
  deleteStoryThread,
  updateStoryThread,
} from '@/features/campaigns/campaign-storage';
import type { StoryThread } from '@/lib/schemas/campaign';

interface UseStoryThreadEntityHandlersProps {
  campaignId: string;
  onSaveStart: () => void;
  onStoryThreadsChange: () => void;
}

export function useStoryThreadEntityHandlers({
  campaignId,
  onSaveStart,
  onStoryThreadsChange,
}: UseStoryThreadEntityHandlersProps) {
  const handleAddStoryThread = useCallback(async () => {
    onSaveStart();
    await addStoryThread(campaignId, {
      title: 'New Story Thread',
      status: 'seeding',
      description: '',
      hints: [],
      relatedQuests: [],
      relatedNpcs: [],
      notes: '',
    });
    onStoryThreadsChange();
  }, [campaignId, onSaveStart, onStoryThreadsChange]);

  const handleUpdateStoryThread = useCallback(
    async (
      threadId: string,
      updates: Partial<Omit<StoryThread, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      onSaveStart();
      await updateStoryThread(campaignId, threadId, updates);
      onStoryThreadsChange();
    },
    [campaignId, onSaveStart, onStoryThreadsChange]
  );

  const handleDeleteStoryThread = useCallback(
    async (threadId: string) => {
      onSaveStart();
      await deleteStoryThread(campaignId, threadId);
      onStoryThreadsChange();
    },
    [campaignId, onSaveStart, onStoryThreadsChange]
  );

  return {
    handleAddStoryThread,
    handleUpdateStoryThread,
    handleDeleteStoryThread,
  };
}
