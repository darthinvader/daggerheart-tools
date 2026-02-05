import { createFileRoute, useSearch } from '@tanstack/react-router';
import { z } from 'zod';

import { DetailSidebar } from '@/components/battle-tracker/detail-sidebar';
import { GMResourcesBar } from '@/components/battle-tracker/gm-resources-bar';

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
  validateSearch: search => searchSchema.parse(search),
});

function BattleTrackerPage() {
  const { battleId: initialBattleId } = useSearch({
    from: '/gm/battle-tracker',
  });

  const {
    rosterState,
    rosterActions,
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

  const handleStartBattle = () => setBattleStatus('active');
  const handlePauseBattle = () => setBattleStatus('paused');
  const handleEndBattle = () => setBattleStatus('completed');

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
        onSave={() => saveBattleMutation.mutate()}
        onLinkClick={() => setIsLinkDialogOpen(true)}
        onAddCharacterClick={() => dialogActions.setIsAddCharacterOpen(true)}
        onAddAdversaryClick={() => dialogActions.setIsAddAdversaryOpen(true)}
        onFightBuilderClick={() => setIsFightBuilderOpen(true)}
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
        onFearChange={rosterActions.setFearPool}
        onUseMassiveThresholdChange={rosterActions.setUseMassiveThreshold}
        onAddEnvironment={() => dialogActions.setIsAddEnvironmentOpen(true)}
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
