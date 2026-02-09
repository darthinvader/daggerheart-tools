import {
  createFileRoute,
  type ErrorComponentProps,
  useSearch,
} from '@tanstack/react-router';
import { useCallback } from 'react';
import { z } from 'zod';
import { DetailSidebar } from '@/components/battle-tracker/detail-sidebar';
import { GMResourcesBar } from '@/components/battle-tracker/gm-resources-bar';
import { useSpendFear } from '@/components/battle-tracker/use-spend-fear';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';
import { useUndoShortcuts } from '@/lib/undo';

import {
  BattleDialogs,
  BattleHeader,
  LinkCampaignDialog,
  RosterGrid,
} from './battle-tracker-sections';
import { useBattleTrackerPageState } from './use-battle-tracker-page-state';

const searchSchema = z.object({
  battleId: z.string().optional(),
});

export const Route = createFileRoute('/gm/battle-tracker')({
  component: BattleTrackerPage,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
  validateSearch: search => searchSchema.parse(search),
});

function BattleTrackerPage() {
  const { battleId: initialBattleId } = useSearch({
    from: '/gm/battle-tracker',
  });

  const {
    rosterState,
    rosterActions,
    undoActions,
    dialogState,
    dialogActions,
    battleName,
    setBattleName,
    battleStatus,
    setBattleStatus,
    activeBattleId,
    campaigns,
    editingAdversary,
    setEditingAdversary,
    editingEnvironment,
    setEditingEnvironment,
    isFightBuilderOpen,
    setIsFightBuilderOpen,
    isLinkDialogOpen,
    setIsLinkDialogOpen,
    selectedCampaignId,
    setSelectedCampaignId,
    saveBattleMutation,
    linkToCampaignMutation,
    handleAddCharacter,
    handleAddAdversary,
    handleAddEnvironment,
    handleAddFromWizard,
    handleSaveAdversary,
    handleSaveEnvironment,
    handleNewBattle,
    handleReduceAllCountdowns,
    handleLinkToCampaign,
  } = useBattleTrackerPageState(initialBattleId);

  useUndoShortcuts({
    onUndo: undoActions.undo,
    onRedo: undoActions.redo,
  });

  const handleStartBattle = () => setBattleStatus('active');
  const handlePauseBattle = () => setBattleStatus('paused');
  const handleEndBattle = () => setBattleStatus('completed');

  const handleSave = useCallback(
    () => saveBattleMutation.mutate(),
    [saveBattleMutation]
  );
  const handleOpenLinkDialog = useCallback(
    () => setIsLinkDialogOpen(true),
    [setIsLinkDialogOpen]
  );
  const handleOpenAddCharacter = useCallback(
    () => dialogActions.setIsAddCharacterOpen(true),
    [dialogActions]
  );
  const handleOpenAddAdversary = useCallback(
    () => dialogActions.setIsAddAdversaryOpen(true),
    [dialogActions]
  );
  const handleOpenFightBuilder = useCallback(
    () => setIsFightBuilderOpen(true),
    [setIsFightBuilderOpen]
  );
  const handleOpenAddEnvironment = useCallback(
    () => dialogActions.setIsAddEnvironmentOpen(true),
    [dialogActions]
  );

  const handleSpendFear = useSpendFear(rosterState, rosterActions);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <BattleHeader
        battleName={battleName}
        battleStatus={battleStatus}
        activeBattleId={activeBattleId}
        campaigns={campaigns}
        isSaving={saveBattleMutation.isPending}
        isLinking={linkToCampaignMutation.isPending}
        onBattleNameChange={setBattleName}
        onStart={handleStartBattle}
        onPause={handlePauseBattle}
        onEnd={handleEndBattle}
        onNewBattle={handleNewBattle}
        onSave={handleSave}
        onLinkClick={handleOpenLinkDialog}
        onAddCharacterClick={handleOpenAddCharacter}
        onAddAdversaryClick={handleOpenAddAdversary}
        onFightBuilderClick={handleOpenFightBuilder}
      />

      <GMResourcesBar
        characterCount={rosterState.characters.length}
        environments={rosterState.environments}
        adversaries={rosterState.adversaries}
        fearPool={rosterState.fearPool}
        maxFear={rosterState.maxFear}
        selection={rosterState.selection}
        spotlight={rosterState.spotlight}
        useMassiveThreshold={rosterState.useMassiveThreshold}
        undoActions={undoActions}
        onFearChange={rosterActions.setFearPool}
        onUseMassiveThresholdChange={rosterActions.setUseMassiveThreshold}
        onAddEnvironment={handleOpenAddEnvironment}
        onSelectEnvironment={rosterActions.handleSelect}
        onRemoveEnvironment={rosterActions.handleRemove}
        onSpotlightEnvironment={rosterActions.handleSpotlight}
        onEditEnvironment={setEditingEnvironment}
        onEnvironmentChange={rosterActions.updateEnvironment}
        onAdversaryChange={rosterActions.updateAdversary}
        onReduceAllCountdowns={handleReduceAllCountdowns}
      />

      <RosterGrid
        rosterState={rosterState}
        rosterActions={rosterActions}
        onEditAdversary={setEditingAdversary}
        onSpendFear={handleSpendFear}
        DetailSidebarComponent={DetailSidebar}
      />

      <BattleDialogs
        dialogState={dialogState}
        dialogActions={dialogActions}
        editingAdversary={editingAdversary}
        editingEnvironment={editingEnvironment}
        isFightBuilderOpen={isFightBuilderOpen}
        characterCount={rosterState.characters.length}
        onAddCharacter={handleAddCharacter}
        onAddAdversary={handleAddAdversary}
        onAddEnvironment={handleAddEnvironment}
        onAddFromWizard={handleAddFromWizard}
        onSaveAdversary={handleSaveAdversary}
        onSaveEnvironment={handleSaveEnvironment}
        setEditingAdversary={setEditingAdversary}
        setEditingEnvironment={setEditingEnvironment}
        setIsFightBuilderOpen={setIsFightBuilderOpen}
      />

      <LinkCampaignDialog
        isOpen={isLinkDialogOpen}
        campaigns={campaigns}
        selectedCampaignId={selectedCampaignId}
        isLinking={linkToCampaignMutation.isPending}
        onOpenChange={setIsLinkDialogOpen}
        onCampaignSelect={setSelectedCampaignId}
        onLink={handleLinkToCampaign}
      />
    </div>
  );
}
