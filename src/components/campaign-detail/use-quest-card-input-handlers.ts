// Extracted hook for QuestCard input state and handlers

import { useCallback, useState } from 'react';

import type {
  CampaignQuest,
  QuestNPCInvolvement,
} from '@/lib/schemas/campaign';

import type { NPCPickerResult as NPCPickerResultHook } from './entity-card-utils';
import {
  useNPCInvolvementHandlers,
  useObjectivesHandlers,
  useStringArrayHandlers,
} from './entity-card-utils';

interface UseQuestCardInputHandlersOptions {
  localQuest: CampaignQuest;
  setLocalQuest: React.Dispatch<React.SetStateAction<CampaignQuest>>;
  scheduleAutoSave: (data: CampaignQuest) => void;
}

export function useQuestCardInputHandlers({
  localQuest,
  setLocalQuest,
  scheduleAutoSave,
}: UseQuestCardInputHandlersOptions) {
  // Input state
  const [newObjective, setNewObjective] = useState('');
  const [newReward, setNewReward] = useState('');
  const [editingNPCInvolvement, setEditingNPCInvolvement] =
    useState<QuestNPCInvolvement | null>(null);

  const handlerContext = {
    localEntity: localQuest,
    setLocalEntity: setLocalQuest,
    scheduleAutoSave,
  };

  // String array handler for rewards
  const rewardHandlers = useStringArrayHandlers<CampaignQuest>(
    'rewards',
    handlerContext
  );

  // Objective handlers using extracted hook
  const {
    addObjective: addObjectiveRaw,
    toggleObjective,
    removeObjective,
  } = useObjectivesHandlers<CampaignQuest>({
    setLocalEntity: setLocalQuest,
    scheduleAutoSave,
    objectivesField: 'objectives',
  });

  // Wrapper for addObjective that uses the input state and clears it
  const addObjective = useCallback(() => {
    addObjectiveRaw(newObjective);
    setNewObjective('');
  }, [addObjectiveRaw, newObjective]);

  // Reward handlers - using input state for new reward
  const handleAddReward = useCallback(() => {
    if (!newReward.trim()) return;
    rewardHandlers.handleAdd(newReward);
    setNewReward('');
  }, [newReward, rewardHandlers]);

  // NPC Involvement handlers
  const createQuestNPCInvolvement = useCallback(
    (result: NPCPickerResultHook): QuestNPCInvolvement => ({
      id: crypto.randomUUID(),
      npcId: result.npcId,
      npcName: result.npcName,
      role: result.role ?? '',
      actionsTaken: result.actionsTaken ?? '',
      notes: result.notes ?? '',
      locationIds: result.locationIds ?? [],
      sessionIds: [],
    }),
    []
  );

  const {
    handleAddNPC,
    handleRemoveNPC,
    handleUpdateNPCInvolvement: handleUpdateNPCInvolvementRaw,
  } = useNPCInvolvementHandlers<CampaignQuest, QuestNPCInvolvement>({
    setLocalEntity: setLocalQuest,
    scheduleAutoSave,
    involvementField: 'npcsInvolved',
    createInvolvement: createQuestNPCInvolvement,
  });

  // Wrapper to close modal after updating
  const handleUpdateNPCInvolvement = useCallback(
    (involvement: QuestNPCInvolvement) => {
      handleUpdateNPCInvolvementRaw(involvement);
      setEditingNPCInvolvement(null);
    },
    [handleUpdateNPCInvolvementRaw]
  );

  return {
    // Objective state/handlers
    newObjective,
    setNewObjective,
    addObjective,
    toggleObjective,
    removeObjective,
    // Reward state/handlers
    newReward,
    setNewReward,
    handleAddReward,
    handleRemoveReward: rewardHandlers.handleRemove,
    rewards: rewardHandlers.currentArray,
    // NPC involvement state/handlers
    editingNPCInvolvement,
    setEditingNPCInvolvement,
    handleAddNPC,
    handleRemoveNPC,
    handleUpdateNPCInvolvement,
  };
}
