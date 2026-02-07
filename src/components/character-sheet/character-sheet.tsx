import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  joinCampaignByInviteCode,
  unlinkCharacterFromCampaign,
} from '@/features/campaigns/campaign-storage';
import {
  campaignKeys,
  useCampaigns,
  useCharacterCampaign,
} from '@/features/campaigns/use-campaign-query';
import type { Campaign } from '@/lib/schemas/campaign';
import { useUndoShortcuts } from '@/lib/undo';

import { CharacterSheetLayout } from './character-sheet-layout';
import { useCharacterSheetWithApi } from './use-character-sheet-api';
import { useUndoableCharacterState } from './use-undoable-character-state';

interface CharacterSheetProps {
  characterId: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  readOnly?: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

function ErrorDisplay({
  error,
  characterId,
}: {
  error: Error;
  characterId: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="mb-2 text-xl font-semibold text-red-800 dark:text-red-200">
          Failed to load character
        </h2>
        <p className="mb-4 text-red-600 dark:text-red-300">{error.message}</p>
        <p className="mb-4 text-sm text-red-500 dark:text-red-400">
          Character ID: {characterId}
        </p>
        <div className="flex justify-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/character">← Back to Characters</Link>
          </Button>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    </div>
  );
}

export function CharacterSheet({
  characterId,
  activeTab,
  onTabChange,
  readOnly = false,
}: CharacterSheetProps) {
  const { user } = useAuth();
  const [hasDismissedOnboarding, setHasDismissedOnboarding] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const queryClient = useQueryClient();
  const {
    state,
    handlers,
    isLoading,
    error,
    isNewCharacter,
    setIsNewCharacter,
    isLevelUpOpen,
    setIsLevelUpOpen,
    handleLevelUpConfirm,
    currentTraitsForModal,
    currentExperiencesForModal,
    ownedCardNames,
    isSaving,
    lastSaved,
    isHydrated,
  } = useCharacterSheetWithApi(characterId, { readOnly });

  // Wrap handlers with undo/redo capability
  const { undoHandlers, undoActions, pushUndo } = useUndoableCharacterState(
    state,
    handlers,
    { enabled: !readOnly }
  );

  // Wrap level-up with a single undo entry
  const undoableLevelUpConfirm = useCallback(
    (result: import('@/components/level-up').LevelUpResult) => {
      pushUndo(`Level up to ${result.newLevel}`);
      handleLevelUpConfirm(result);
    },
    [pushUndo, handleLevelUpConfirm]
  );

  // Register keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z)
  useUndoShortcuts({
    onUndo: undoActions.undo,
    onRedo: undoActions.redo,
    enabled: !readOnly,
  });

  // Fetch the campaign this character belongs to (if any)
  const { data: campaign } = useCharacterCampaign(characterId);
  const campaignId = campaign?.id;
  const { data: campaigns } = useCampaigns();

  const characterCampaigns = useMemo(() => {
    const allCampaigns = campaigns ?? [];
    return allCampaigns
      .filter(current =>
        current.players?.some(player => player.characterId === characterId)
      )
      .map(current => {
        const playerEntry = current.players?.find(
          player => player.characterId === characterId
        );
        return {
          id: current.id,
          name: current.name,
          status: current.status,
          role: playerEntry?.role,
        } satisfies {
          id: string;
          name: string;
          status: Campaign['status'];
          role?: Campaign['players'][number]['role'];
        };
      });
  }, [campaigns, characterId]);

  const playerName = useMemo(() => {
    const metadata = user?.user_metadata as {
      full_name?: string;
      name?: string;
    };
    return (
      metadata?.full_name ??
      metadata?.name ??
      user?.email?.split('@')[0] ??
      'Player'
    );
  }, [user]);

  const joinMutation = useMutation<string, Error, void>({
    mutationFn: async () =>
      joinCampaignByInviteCode({
        inviteCode: inviteCode.trim(),
        playerName,
        characterId,
        characterName: state.identity.name?.trim() || null,
      }),
    onSuccess: async () => {
      setInviteCode('');
      await queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });

  const unlinkMutation = useMutation<void, Error, string>({
    mutationFn: async (campaignId: string) =>
      unlinkCharacterFromCampaign({
        campaignId,
        characterId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
    onError: err => {
      console.error('[UnlinkCampaign]', err);
      toast.error('Failed to unlink from campaign');
    },
  });

  const canJoin = inviteCode.trim().length >= 6 && !joinMutation.isPending;

  // Auto-open wizard if new character, but don't auto-close
  // once opened - let the user explicitly finish or dismiss
  const shouldAutoOpenOnboarding =
    isHydrated && isNewCharacter && !isLevelUpOpen;
  const isOnboardingOpen = shouldAutoOpenOnboarding && !hasDismissedOnboarding;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <ErrorDisplay error={error as Error} characterId={characterId} />
      </div>
    );
  }

  return (
    <CharacterSheetLayout
      activeTab={activeTab}
      handlers={undoHandlers}
      isHydrated={isHydrated}
      isLevelUpOpen={isLevelUpOpen}
      isOnboardingOpen={isOnboardingOpen}
      isSaving={isSaving}
      lastSaved={lastSaved}
      onDismissOnboarding={() => setHasDismissedOnboarding(true)}
      onLevelUpClose={() => setIsLevelUpOpen(false)}
      onTabChange={onTabChange}
      readOnly={readOnly}
      setIsNewCharacter={setIsNewCharacter}
      state={state}
      undoActions={undoActions}
      handleLevelUpConfirm={undoableLevelUpConfirm}
      currentExperiencesForModal={currentExperiencesForModal}
      currentTraitsForModal={currentTraitsForModal}
      ownedCardNames={ownedCardNames}
      campaignId={campaignId}
      campaignSummary={characterCampaigns}
      inviteCode={inviteCode}
      onInviteCodeChange={value => setInviteCode(value.toUpperCase())}
      onJoinCampaign={() => joinMutation.mutate()}
      canJoinCampaign={canJoin}
      isJoiningCampaign={joinMutation.isPending}
      joinCampaignError={joinMutation.isError ? joinMutation.error : null}
      joinCampaignSuccess={joinMutation.isSuccess}
      onUnlinkCampaign={campaignId => unlinkMutation.mutate(campaignId)}
      isUnlinkingCampaign={unlinkMutation.isPending}
    />
  );
}
