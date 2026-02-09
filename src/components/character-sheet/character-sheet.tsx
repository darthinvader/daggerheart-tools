import { Link } from '@tanstack/react-router';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUndoShortcuts } from '@/lib/undo';

import { CharacterSheetLayout } from './character-sheet-layout';
import { useCampaignManagement } from './use-campaign-management';
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
  const [hasDismissedOnboarding, setHasDismissedOnboarding] = useState(false);
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

  // Campaign management (queries, mutations, derived state)
  const campaignMgmt = useCampaignManagement({
    characterId,
    characterName: state.identity.name,
  });

  // Named callbacks for stable references
  const handleDismissOnboarding = useCallback(() => {
    setHasDismissedOnboarding(true);
  }, []);

  const handleLevelUpClose = useCallback(() => {
    setIsLevelUpOpen(false);
  }, [setIsLevelUpOpen]);

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
      onDismissOnboarding={handleDismissOnboarding}
      onLevelUpClose={handleLevelUpClose}
      onTabChange={onTabChange}
      readOnly={readOnly}
      setIsNewCharacter={setIsNewCharacter}
      state={state}
      undoActions={undoActions}
      handleLevelUpConfirm={undoableLevelUpConfirm}
      currentExperiencesForModal={currentExperiencesForModal}
      currentTraitsForModal={currentTraitsForModal}
      ownedCardNames={ownedCardNames}
      campaignId={campaignMgmt.campaignId}
      campaignSummary={campaignMgmt.characterCampaigns}
      inviteCode={campaignMgmt.inviteCode}
      onInviteCodeChange={campaignMgmt.handleInviteCodeChange}
      onJoinCampaign={campaignMgmt.handleJoinCampaign}
      canJoinCampaign={campaignMgmt.canJoin}
      isJoiningCampaign={campaignMgmt.isJoiningCampaign}
      joinCampaignError={campaignMgmt.joinCampaignError}
      joinCampaignSuccess={campaignMgmt.joinCampaignSuccess}
      onUnlinkCampaign={campaignMgmt.handleUnlinkCampaign}
      isUnlinkingCampaign={campaignMgmt.isUnlinkingCampaign}
      campaign={campaignMgmt.activeCampaign}
      pushUndo={pushUndo}
      selectedCampaignId={campaignMgmt.selectedCampaignId}
      onSelectCampaign={campaignMgmt.onSelectCampaign}
    />
  );
}
