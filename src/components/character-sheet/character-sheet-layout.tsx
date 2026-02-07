import { Loader2, PawPrint, Unlink, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

import { UndoRedoControls } from '@/components/battle-tracker/undo-redo-controls';
import { CharacterOnboardingWizard } from '@/components/character-onboarding';
import {
  CombatTab,
  IdentityTab,
  ItemsTab,
  OverviewTab,
  QuickViewTab,
  SessionTab,
} from '@/components/demo/demo-tabs';
import type { LevelUpResult } from '@/components/level-up';
import { LevelUpModal } from '@/components/level-up';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useBeastformState } from '@/hooks/use-beastform';
import { getSubclassByName } from '@/lib/data/classes';
import { Backpack, BarChart3, Dice5, Swords, User, Zap } from '@/lib/icons';
import type { Campaign } from '@/lib/schemas/campaign';
import type { UndoActions } from '@/lib/undo';
import { cn } from '@/lib/utils';

import { CharacterSettingsDialog } from './character-settings-dialog';
import { CharacterStatusBar } from './character-status-bar';
import { EnhancedCharacterHeader } from './enhanced-header';
import { MobileBottomNav } from './mobile-bottom-nav';
import { ResponsiveTabsList } from './responsive-tabs';
import type { CharacterSheetHandlers, CharacterSheetState } from './types.ts';
import { UndoRedoFab } from './undo-redo-fab';

interface CharacterSheetLayoutProps {
  activeTab: string;
  handlers: CharacterSheetHandlers;
  isHydrated: boolean;
  isLevelUpOpen: boolean;
  isOnboardingOpen: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  onDismissOnboarding: () => void;
  onLevelUpClose: () => void;
  onTabChange: (tab: string) => void;
  readOnly: boolean;
  setIsNewCharacter: (value: boolean) => void;
  state: CharacterSheetState;
  handleLevelUpConfirm: (result: LevelUpResult) => void;
  currentTraitsForModal: { name: string; marked: boolean }[];
  currentExperiencesForModal: { id: string; name: string; value: number }[];
  ownedCardNames: string[];
  campaignId?: string;
  campaignSummary: Array<{
    id: string;
    name: string;
    status: Campaign['status'];
    role?: Campaign['players'][number]['role'];
  }>;
  inviteCode: string;
  onInviteCodeChange: (value: string) => void;
  onJoinCampaign: () => void;
  canJoinCampaign: boolean;
  isJoiningCampaign: boolean;
  joinCampaignError: Error | null;
  joinCampaignSuccess: boolean;
  onUnlinkCampaign: (campaignId: string) => void;
  isUnlinkingCampaign: boolean;
  undoActions?: UndoActions;
}

export function CharacterSheetLayout({
  activeTab,
  handlers,
  isHydrated,
  isLevelUpOpen,
  isOnboardingOpen,
  isSaving,
  lastSaved,
  onDismissOnboarding,
  onLevelUpClose,
  onTabChange,
  readOnly,
  setIsNewCharacter,
  state,
  handleLevelUpConfirm,
  currentTraitsForModal,
  currentExperiencesForModal,
  ownedCardNames,
  campaignId,
  campaignSummary,
  inviteCode,
  onInviteCodeChange,
  onJoinCampaign,
  canJoinCampaign,
  isJoiningCampaign,
  joinCampaignError,
  joinCampaignSuccess,
  onUnlinkCampaign,
  isUnlinkingCampaign,
  undoActions,
}: CharacterSheetLayoutProps) {
  const tier = getTierNumber(state.progression.currentLevel);

  const beastformState = useBeastformState(
    state.classSelection?.className ?? null,
    state.progression.currentLevel,
    state.beastform,
    state.beastformEnabled
  );

  const isNativeDruid =
    (state.classSelection?.className ?? '').toLowerCase() === 'druid';

  const hasCompanionFeature = useMemo(() => {
    const hasCompanionFlag = (
      value: unknown
    ): value is { companion?: boolean } =>
      Boolean(value && typeof value === 'object' && 'companion' in value);
    const selection = state.classSelection;
    if (!selection?.className || !selection?.subclassName) return false;
    if (selection.isHomebrew && selection.homebrewClass) {
      const homebrewSubclass = selection.homebrewClass.subclasses.find(
        s => s.name === selection.subclassName
      );
      return Boolean(homebrewSubclass?.companion);
    }
    const subclass = getSubclassByName(
      selection.className,
      selection.subclassName
    );
    return hasCompanionFlag(subclass) && Boolean(subclass.companion);
  }, [state.classSelection]);

  const allTabs = [
    { value: 'quick', label: 'Quick', icon: <Zap className="size-4" /> },
    {
      value: 'overview',
      label: 'Overview',
      icon: <BarChart3 className="size-4" />,
    },
    { value: 'identity', label: 'Identity', icon: <User className="size-4" /> },
    { value: 'combat', label: 'Combat', icon: <Swords className="size-4" /> },
    { value: 'items', label: 'Items', icon: <Backpack className="size-4" /> },
    { value: 'session', label: 'Session', icon: <Dice5 className="size-4" /> },
  ];

  // Beastform slot for status bar — just a status indicator icon
  const beastformSlot =
    beastformState.isActive && beastformState.activeForm ? (
      <SmartTooltip content={`Beastform: ${beastformState.activeForm.name}`}>
        <div className="flex items-center">
          <PawPrint
            className="size-4 animate-pulse text-emerald-400"
            aria-hidden
          />
        </div>
      </SmartTooltip>
    ) : undefined;

  return (
    <div
      className={cn(
        'has-bottom-nav container mx-auto px-3 py-3 sm:px-4 sm:py-6',
        `tier-accent-${tier}`
      )}
    >
      <div className="space-y-4 sm:space-y-6">
        <CharacterOnboardingSection
          isOpen={isOnboardingOpen}
          readOnly={readOnly}
          onDismiss={onDismissOnboarding}
          setIsNewCharacter={setIsNewCharacter}
          state={state}
          handlers={handlers}
          campaignId={campaignId}
        />
        <EnhancedCharacterHeader
          characterName={state.identity.name || 'New Character'}
          characterTitle={state.identity.calling}
          level={state.progression.currentLevel}
          tier={tier}
          readOnly={readOnly}
          isSaving={isSaving}
          lastSaved={lastSaved}
          campaignSection={
            <CharacterCampaignSection
              campaigns={campaignSummary}
              inviteCode={inviteCode}
              onInviteCodeChange={onInviteCodeChange}
              onJoinCampaign={onJoinCampaign}
              canJoinCampaign={canJoinCampaign}
              isJoiningCampaign={isJoiningCampaign}
              joinCampaignError={joinCampaignError}
              joinCampaignSuccess={joinCampaignSuccess}
              readOnly={readOnly}
              onUnlinkCampaign={onUnlinkCampaign}
              isUnlinkingCampaign={isUnlinkingCampaign}
            />
          }
          settingsSection={
            !readOnly ? (
              <CharacterSettingsDialog
                beastformEnabled={state.beastformEnabled}
                companionEnabled={state.companionEnabled}
                onBeastformEnabledChange={handlers.setBeastformEnabled}
                onCompanionEnabledChange={handlers.setCompanionEnabled}
                isNativeDruid={isNativeDruid}
                hasNativeCompanion={hasCompanionFeature}
                readOnly={readOnly}
              />
            ) : undefined
          }
          statusBar={
            <CharacterStatusBar state={state} beastformSlot={beastformSlot} />
          }
          undoControls={
            !readOnly && undoActions ? (
              <UndoRedoControls
                canUndo={undoActions.canUndo}
                canRedo={undoActions.canRedo}
                undoStack={undoActions.undoStack}
                redoStack={undoActions.redoStack}
                onUndo={undoActions.undo}
                onRedo={undoActions.redo}
                onClearHistory={undoActions.clearHistory}
                compact
              />
            ) : undefined
          }
        />
        <CharacterSheetTabs
          activeTab={activeTab}
          handlers={handlers}
          isHydrated={isHydrated}
          onTabChange={onTabChange}
          readOnly={readOnly}
          state={state}
        />
        <LevelUpSection
          readOnly={readOnly}
          isOpen={isLevelUpOpen}
          onClose={onLevelUpClose}
          onConfirm={handleLevelUpConfirm}
          state={state}
          currentTraits={currentTraitsForModal}
          currentExperiences={currentExperiencesForModal}
          ownedCardNames={ownedCardNames}
        />
      </div>

      {/* Mobile undo/redo FAB — positioned above bottom nav */}
      {!readOnly && undoActions && (
        <UndoRedoFab
          canUndo={undoActions.canUndo}
          canRedo={undoActions.canRedo}
          onUndo={undoActions.undo}
          onRedo={undoActions.redo}
        />
      )}

      {/* Mobile bottom navigation */}
      <MobileBottomNav
        tabs={allTabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );
}

function getTierNumber(level: number): number {
  if (level <= 1) return 1;
  if (level <= 4) return 2;
  if (level <= 7) return 3;
  return 4;
}

function CharacterOnboardingSection({
  isOpen,
  readOnly,
  onDismiss,
  setIsNewCharacter,
  state,
  handlers,
  campaignId,
}: {
  isOpen: boolean;
  readOnly: boolean;
  onDismiss: () => void;
  setIsNewCharacter: (value: boolean) => void;
  state: CharacterSheetState;
  handlers: CharacterSheetHandlers;
  campaignId?: string;
}) {
  if (readOnly) return null;

  const handleSkip = () => {
    onDismiss();
    setIsNewCharacter(false);
  };

  return (
    <CharacterOnboardingWizard
      isOpen={isOpen}
      onClose={onDismiss}
      onSkipWizard={handleSkip}
      onFinish={handleSkip}
      state={state}
      handlers={handlers}
      campaignId={campaignId}
    />
  );
}

function CharacterCampaignSection({
  campaigns,
  inviteCode,
  onInviteCodeChange,
  onJoinCampaign,
  canJoinCampaign,
  isJoiningCampaign,
  joinCampaignError,
  joinCampaignSuccess,
  readOnly,
  onUnlinkCampaign,
  isUnlinkingCampaign,
}: {
  campaigns: Array<{
    id: string;
    name: string;
    status: Campaign['status'];
    role?: Campaign['players'][number]['role'];
  }>;
  inviteCode: string;
  onInviteCodeChange: (value: string) => void;
  onJoinCampaign: () => void;
  canJoinCampaign: boolean;
  isJoiningCampaign: boolean;
  joinCampaignError: Error | null;
  joinCampaignSuccess: boolean;
  readOnly: boolean;
  onUnlinkCampaign: (campaignId: string) => void;
  isUnlinkingCampaign: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasCampaigns = campaigns.length > 0;
  const campaignLabel = hasCampaigns ? campaigns[0].name : 'No campaign';
  const multipleCampaigns = campaigns.length > 1;

  return (
    <>
      <SmartTooltip content="Manage campaign membership">
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={() => setIsModalOpen(true)}
        >
          <Users className="size-3.5" />
          <span className="hidden sm:inline">{campaignLabel}</span>
          {multipleCampaigns && (
            <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
              +{campaigns.length - 1}
            </Badge>
          )}
        </Button>
      </SmartTooltip>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Campaign Membership</DialogTitle>
            <DialogDescription>
              View your current campaigns or join a new one with an invite code.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current campaigns */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Campaigns</h4>
              {campaigns.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Not part of any campaign yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {campaigns.map(campaign => (
                    <div
                      key={campaign.id}
                      className="bg-muted/50 flex items-center justify-between rounded-lg border p-3"
                    >
                      <span className="font-medium">{campaign.name}</span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-xs capitalize">
                          {campaign.status}
                        </Badge>
                        {campaign.role && (
                          <Badge
                            variant="secondary"
                            className="text-xs capitalize"
                          >
                            {campaign.role}
                          </Badge>
                        )}
                        {!readOnly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-7 w-7 p-0 text-red-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950"
                            onClick={() => onUnlinkCampaign(campaign.id)}
                            disabled={isUnlinkingCampaign}
                          >
                            {isUnlinkingCampaign ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Unlink className="size-3.5" />
                            )}
                            <span className="sr-only">
                              Leave {campaign.name}
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Join campaign */}
            {!readOnly && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Join a Campaign</h4>
                <div className="flex items-center gap-2">
                  <Input
                    id="campaign-invite-code"
                    value={inviteCode}
                    onChange={event => onInviteCodeChange(event.target.value)}
                    placeholder="Enter invite code"
                    maxLength={12}
                    className="font-mono uppercase"
                  />
                  <Button
                    type="button"
                    onClick={onJoinCampaign}
                    disabled={!canJoinCampaign}
                  >
                    {isJoiningCampaign ? 'Joining...' : 'Join'}
                  </Button>
                </div>
                {joinCampaignError && (
                  <p className="text-destructive text-sm">
                    Invalid invite code. Please try again.
                  </p>
                )}
                {joinCampaignSuccess && (
                  <p className="text-sm text-green-600">
                    Successfully joined the campaign!
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CharacterSheetTabs({
  activeTab,
  handlers,
  isHydrated,
  onTabChange,
  readOnly,
  state,
}: {
  activeTab: string;
  handlers: CharacterSheetHandlers;
  isHydrated: boolean;
  onTabChange: (tab: string) => void;
  readOnly: boolean;
  state: CharacterSheetState;
}) {
  const primaryTabs = [
    { value: 'quick', label: 'Quick', icon: <Zap className="size-4" /> },
    {
      value: 'overview',
      label: 'Overview',
      icon: <BarChart3 className="size-4" />,
    },
  ];

  const secondaryTabs = [
    { value: 'identity', label: 'Identity', icon: <User className="size-4" /> },
    { value: 'combat', label: 'Combat', icon: <Swords className="size-4" /> },
    { value: 'items', label: 'Items', icon: <Backpack className="size-4" /> },
    { value: 'session', label: 'Session', icon: <Dice5 className="size-4" /> },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <ResponsiveTabsList
        primaryTabs={primaryTabs}
        secondaryTabs={secondaryTabs}
        value={activeTab}
        onValueChange={onTabChange}
      />

      <div
        className={cn(
          readOnly &&
            'relative opacity-80 [&_[role=slider]]:pointer-events-none [&_button]:pointer-events-none [&_input]:pointer-events-none [&_select]:pointer-events-none [&_textarea]:pointer-events-none'
        )}
      >
        <TabsContent value="quick" className="animate-fade-up">
          <QuickViewTab state={state} handlers={handlers} />
        </TabsContent>
        <TabsContent value="overview" className="animate-fade-up">
          <OverviewTab
            state={state}
            handlers={handlers}
            isHydrated={isHydrated}
          />
        </TabsContent>
        <TabsContent value="identity" className="animate-fade-up">
          <IdentityTab
            state={state}
            handlers={handlers}
            isHydrated={isHydrated}
          />
        </TabsContent>
        <TabsContent value="combat" className="animate-fade-up">
          <CombatTab
            state={state}
            handlers={handlers}
            isHydrated={isHydrated}
          />
        </TabsContent>
        <TabsContent value="items" className="animate-fade-up">
          <ItemsTab state={state} handlers={handlers} isHydrated={isHydrated} />
        </TabsContent>
        <TabsContent value="session" className="animate-fade-up">
          <SessionTab
            state={state}
            handlers={handlers}
            isHydrated={isHydrated}
            activeEffects={state.activeEffects ?? []}
            onActiveEffectsChange={handlers.setActiveEffects}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}

function LevelUpSection({
  readOnly,
  isOpen,
  onClose,
  onConfirm,
  state,
  currentTraits,
  currentExperiences,
  ownedCardNames,
}: {
  readOnly: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: LevelUpResult) => void;
  state: CharacterSheetState;
  currentTraits: { name: string; marked: boolean }[];
  currentExperiences: { id: string; name: string; value: number }[];
  ownedCardNames: string[];
}) {
  if (readOnly) return null;

  return (
    <LevelUpModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      currentLevel={state.progression.currentLevel}
      currentTier={state.progression.currentTier}
      currentTraits={currentTraits}
      currentExperiences={currentExperiences}
      tierHistory={state.progression.tierHistory}
      classSelection={state.classSelection}
      unlockedSubclassFeatures={state.unlockedSubclassFeatures}
      ownedCardNames={ownedCardNames}
      currentCompanionTraining={state.companion?.training}
      hasCompanion={!!state.companion}
      companionName={state.companion?.name}
      companionExperiences={state.companion?.experiences ?? []}
    />
  );
}
