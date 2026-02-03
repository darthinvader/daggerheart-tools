/**
 * Battle entity handlers hook
 * Extracted handlers for adding/updating characters, adversaries, and environments
 */
import { useCallback } from 'react';

import type {
  AdversaryTracker,
  EnvironmentTracker,
} from '@/components/battle-tracker/types';
import {
  useBattleDialogState,
  useBattleRosterState,
} from '@/components/battle-tracker/use-battle-tracker-state';
import { DEFAULT_CHARACTER_DRAFT } from '@/components/battle-tracker/utils';

// =====================================================================================
// Hook Types
// =====================================================================================

interface UseBattleEntityHandlersProps {
  rosterActions: ReturnType<typeof useBattleRosterState>['rosterActions'];
  rosterState: ReturnType<typeof useBattleRosterState>['rosterState'];
  dialogState: ReturnType<typeof useBattleDialogState>['dialogState'];
  dialogActions: ReturnType<typeof useBattleDialogState>['dialogActions'];
  editingAdversary: AdversaryTracker | null;
  editingEnvironment: EnvironmentTracker | null;
}

// =====================================================================================
// Main Hook
// =====================================================================================

export function useBattleEntityHandlers({
  rosterActions,
  rosterState,
  dialogState,
  dialogActions,
  editingAdversary,
  editingEnvironment,
}: UseBattleEntityHandlersProps) {
  // Add character handler
  const handleAddCharacter = useCallback(() => {
    const newId = rosterActions.addCharacter(dialogState.characterDraft);
    if (!newId) return;
    dialogActions.setCharacterDraft(DEFAULT_CHARACTER_DRAFT);
    dialogActions.setIsAddCharacterOpen(false);
  }, [rosterActions, dialogState.characterDraft, dialogActions]);

  // Add adversary handler
  const handleAddAdversary = useCallback(
    (adversary: Parameters<typeof rosterActions.addAdversary>[0]) => {
      rosterActions.addAdversary(adversary);
      dialogActions.setIsAddAdversaryOpen(false);
    },
    [rosterActions, dialogActions]
  );

  // Add environment handler
  const handleAddEnvironment = useCallback(
    (environment: Parameters<typeof rosterActions.addEnvironment>[0]) => {
      rosterActions.addEnvironment(environment);
      dialogActions.setIsAddEnvironmentOpen(false);
    },
    [rosterActions, dialogActions]
  );

  // Add from wizard handler
  const handleAddFromWizard = useCallback(
    (
      adversaries: {
        adversary: Parameters<typeof rosterActions.addAdversary>[0];
        count: number;
      }[]
    ) => {
      adversaries.forEach(({ adversary, count }) => {
        Array.from({ length: count }).forEach(() =>
          rosterActions.addAdversary(adversary)
        );
      });
    },
    [rosterActions]
  );

  // Save adversary handler
  const handleSaveAdversary = useCallback(
    (updates: Partial<AdversaryTracker>) => {
      if (!editingAdversary) return;
      rosterActions.updateAdversary(editingAdversary.id, prev => ({
        ...prev,
        ...updates,
      }));
    },
    [editingAdversary, rosterActions]
  );

  // Save environment handler
  const handleSaveEnvironment = useCallback(
    (updates: Partial<EnvironmentTracker>) => {
      if (!editingEnvironment) return;
      rosterActions.updateEnvironment(editingEnvironment.id, prev => ({
        ...prev,
        ...updates,
      }));
    },
    [editingEnvironment, rosterActions]
  );

  // Reduce all countdowns handler
  const handleReduceAllCountdowns = useCallback(() => {
    rosterState.environments.forEach(env => {
      if (env.countdownEnabled && (env.countdown ?? 0) > 0) {
        rosterActions.updateEnvironment(env.id, e => ({
          ...e,
          countdown: Math.max(0, (e.countdown ?? 0) - 1),
        }));
      }
    });
    rosterState.adversaries.forEach(adv => {
      if (adv.countdownEnabled && (adv.countdown ?? 0) > 0) {
        rosterActions.updateAdversary(adv.id, a => ({
          ...a,
          countdown: Math.max(0, (a.countdown ?? 0) - 1),
        }));
      }
    });
  }, [rosterState.environments, rosterState.adversaries, rosterActions]);

  return {
    handleAddCharacter,
    handleAddAdversary,
    handleAddEnvironment,
    handleAddFromWizard,
    handleSaveAdversary,
    handleSaveEnvironment,
    handleReduceAllCountdowns,
  };
}
