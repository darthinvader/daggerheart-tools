import { Check, Loader2, Unlink, Users } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';

import { UndoRedoControls } from '@/components/battle-tracker/undo-redo-controls';
import type { LevelUpResult } from '@/components/level-up';

// Lazy-load all tabs — only the active tab is rendered so the rest don't need to be in the initial bundle
const QuickViewTab = lazy(() =>
  import('@/components/quick-view/quick-view-tab').then(m => ({
    default: m.QuickViewTab,
  }))
);
const OverviewTab = lazy(() =>
  import('@/components/demo/tabs/overview-tab').then(m => ({
    default: m.OverviewTab,
  }))
);
const IdentityTab = lazy(() =>
  import('@/components/demo/tabs/identity-tab').then(m => ({
    default: m.IdentityTab,
  }))
);
const CombatTab = lazy(() =>
  import('@/components/demo/tabs/combat-tab').then(m => ({
    default: m.CombatTab,
  }))
);
const ItemsTab = lazy(() =>
  import('@/components/demo/tabs/items-tab').then(m => ({
    default: m.ItemsTab,
  }))
);
const SessionTab = lazy(() =>
  import('@/components/demo/tabs/session-tab').then(m => ({
    default: m.SessionTab,
  }))
);

// Lazy-load heavy modals — only opened on user action
const LevelUpModal = lazy(() =>
  import('@/components/level-up/level-up-modal').then(m => ({
    default: m.LevelUpModal,
  }))
);
const CharacterOnboardingWizard = lazy(() =>
  import('@/components/character-onboarding/character-onboarding-wizard').then(
    m => ({ default: m.CharacterOnboardingWizard })
  )
);
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
import { Skeleton } from '@/components/ui/skeleton';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Backpack, BarChart3, Dice5, Swords, User, Zap } from '@/lib/icons';
import type { Campaign, ShopSettings } from '@/lib/schemas/campaign';
import type { UndoActions } from '@/lib/undo';
import { cn } from '@/lib/utils';
import { CharacterSettingsDialog } from './character-settings-dialog';
import { EnhancedCharacterHeader } from './enhanced-header';
import { MobileBottomNav } from './mobile-bottom-nav';
import { ResponsiveTabsList } from './responsive-tabs';
import type { CharacterSheetHandlers, CharacterSheetState } from './types.ts';
import { UndoRedoFab } from './undo-redo-fab';
import { useHasCompanionFeature } from './use-character-sheet-api';

const PRIMARY_TABS = [
  { value: 'quick', label: 'Quick', icon: <Zap className="size-4" /> },
  {
    value: 'overview',
    label: 'Overview',
    icon: <BarChart3 className="size-4" />,
  },
];

const SECONDARY_TABS = [
  { value: 'identity', label: 'Identity', icon: <User className="size-4" /> },
  { value: 'combat', label: 'Combat', icon: <Swords className="size-4" /> },
  { value: 'items', label: 'Items', icon: <Backpack className="size-4" /> },
  { value: 'session', label: 'Session', icon: <Dice5 className="size-4" /> },
];

const ALL_TABS = [...PRIMARY_TABS, ...SECONDARY_TABS];

interface CampaignSummary {
  id: string;
  name: string;
  status: Campaign['status'];
  role?: Campaign['players'][number]['role'];
}

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
  campaignSummary: CampaignSummary[];
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
  /** Full campaign object for shop settings */
  campaign?: Campaign;
  /** Push a single undo entry before compound mutations */
  pushUndo?: (label: string) => void;
  /** Currently selected campaign ID for shop pricing */
  selectedCampaignId?: string;
  /** Callback to select a different campaign */
  onSelectCampaign?: (campaignId: string) => void;
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
  campaign,
  pushUndo,
  selectedCampaignId,
  onSelectCampaign,
}: CharacterSheetLayoutProps) {
  const tier = getTierNumber(state.progression.currentLevel);

  const isNativeDruid =
    (state.classSelection?.className ?? '').toLowerCase() === 'druid';

  const hasCompanionFeature = useHasCompanionFeature(state);

  const settingsSection = !readOnly ? (
    <CharacterSettingsDialog
      beastformEnabled={state.beastformEnabled}
      companionEnabled={state.companionEnabled}
      onBeastformEnabledChange={handlers.setBeastformEnabled}
      onCompanionEnabledChange={handlers.setCompanionEnabled}
      isNativeDruid={isNativeDruid}
      hasNativeCompanion={hasCompanionFeature}
      readOnly={readOnly}
    />
  ) : undefined;

  const undoControls =
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
    ) : undefined;

  const shopSettings = campaign?.shopEnabled
    ? campaign.shopSettings
    : undefined;

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
              selectedCampaignId={selectedCampaignId}
              onSelectCampaign={onSelectCampaign}
            />
          }
          settingsSection={settingsSection}
          undoControls={undoControls}
        />
        <CharacterSheetTabs
          activeTab={activeTab}
          handlers={handlers}
          isHydrated={isHydrated}
          onTabChange={onTabChange}
          readOnly={readOnly}
          state={state}
          pushUndo={pushUndo}
          shopSettings={shopSettings}
          campaignName={campaign?.name}
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
        tabs={ALL_TABS}
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

  if (!isOpen) return null;

  return (
    <Suspense fallback={null}>
      <CharacterOnboardingWizard
        isOpen={isOpen}
        onClose={onDismiss}
        onSkipWizard={handleSkip}
        onFinish={handleSkip}
        state={state}
        handlers={handlers}
        campaignId={campaignId}
      />
    </Suspense>
  );
}

function CampaignListItem({
  campaign,
  isActive,
  multipleCampaigns,
  readOnly,
  isUnlinkingCampaign,
  onSelect,
  onUnlink,
}: {
  campaign: CampaignSummary;
  isActive: boolean;
  multipleCampaigns: boolean;
  readOnly: boolean;
  isUnlinkingCampaign: boolean;
  onSelect: () => void;
  onUnlink: (campaignId: string) => void;
}) {
  const handleUnlink = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUnlink(campaign.id);
  };

  return (
    <button
      type="button"
      className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
        isActive
          ? 'border-primary bg-primary/5 ring-primary/20 ring-1'
          : 'bg-muted/50 hover:bg-muted'
      } ${multipleCampaigns ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        {multipleCampaigns && (
          <div
            className={`flex size-4 items-center justify-center rounded-full border ${
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground/40'
            }`}
          >
            {isActive && <Check className="size-3" />}
          </div>
        )}
        <span className="font-medium">{campaign.name}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {isActive && multipleCampaigns && (
          <Badge variant="default" className="text-[10px]">
            Active
          </Badge>
        )}
        <Badge variant="outline" className="text-xs capitalize">
          {campaign.status}
        </Badge>
        {campaign.role && (
          <Badge variant="secondary" className="text-xs capitalize">
            {campaign.role}
          </Badge>
        )}
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-7 w-7 p-0 text-red-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950"
            onClick={handleUnlink}
            disabled={isUnlinkingCampaign}
          >
            {isUnlinkingCampaign ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Unlink className="size-3.5" />
            )}
            <span className="sr-only">Leave {campaign.name}</span>
          </Button>
        )}
      </div>
    </button>
  );
}

function JoinCampaignForm({
  inviteCode,
  onInviteCodeChange,
  onJoinCampaign,
  canJoinCampaign,
  isJoiningCampaign,
  joinCampaignError,
  joinCampaignSuccess,
}: {
  inviteCode: string;
  onInviteCodeChange: (value: string) => void;
  onJoinCampaign: () => void;
  canJoinCampaign: boolean;
  isJoiningCampaign: boolean;
  joinCampaignError: Error | null;
  joinCampaignSuccess: boolean;
}) {
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInviteCodeChange(event.target.value);
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Join a Campaign</h4>
      <div className="flex items-center gap-2">
        <Input
          id="campaign-invite-code"
          value={inviteCode}
          onChange={handleCodeChange}
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
  selectedCampaignId,
  onSelectCampaign,
}: {
  campaigns: CampaignSummary[];
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
  selectedCampaignId?: string;
  onSelectCampaign?: (campaignId: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeCampaign = selectedCampaignId
    ? campaigns.find(c => c.id === selectedCampaignId)
    : campaigns[0];
  const campaignLabel = activeCampaign?.name ?? 'No campaign';
  const multipleCampaigns = campaigns.length > 1;
  const defaultCampaignId = selectedCampaignId ?? campaigns[0]?.id;

  const handleOpenModal = () => setIsModalOpen(true);

  return (
    <>
      <SmartTooltip content="Manage campaign membership">
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={handleOpenModal}
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
                    <CampaignListItem
                      key={campaign.id}
                      campaign={campaign}
                      isActive={campaign.id === defaultCampaignId}
                      multipleCampaigns={multipleCampaigns}
                      readOnly={readOnly}
                      isUnlinkingCampaign={isUnlinkingCampaign}
                      onSelect={() =>
                        multipleCampaigns && onSelectCampaign?.(campaign.id)
                      }
                      onUnlink={onUnlinkCampaign}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Join campaign */}
            {!readOnly && (
              <JoinCampaignForm
                inviteCode={inviteCode}
                onInviteCodeChange={onInviteCodeChange}
                onJoinCampaign={onJoinCampaign}
                canJoinCampaign={canJoinCampaign}
                isJoiningCampaign={isJoiningCampaign}
                joinCampaignError={joinCampaignError}
                joinCampaignSuccess={joinCampaignSuccess}
              />
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
  pushUndo,
  shopSettings,
  campaignName,
}: {
  activeTab: string;
  handlers: CharacterSheetHandlers;
  isHydrated: boolean;
  onTabChange: (tab: string) => void;
  readOnly: boolean;
  state: CharacterSheetState;
  pushUndo?: (label: string) => void;
  shopSettings?: ShopSettings;
  campaignName?: string;
}) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <ResponsiveTabsList
        primaryTabs={PRIMARY_TABS}
        secondaryTabs={SECONDARY_TABS}
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
          {activeTab === 'quick' && (
            <Suspense fallback={<TabSkeleton />}>
              <QuickViewTab state={state} handlers={handlers} />
            </Suspense>
          )}
        </TabsContent>
        <TabsContent value="overview" className="animate-fade-up">
          {activeTab === 'overview' && (
            <Suspense fallback={<TabSkeleton />}>
              <OverviewTab
                state={state}
                handlers={handlers}
                isHydrated={isHydrated}
                pushUndo={pushUndo}
                shopSettings={shopSettings}
                campaignName={campaignName}
              />
            </Suspense>
          )}
        </TabsContent>
        <TabsContent value="identity" className="animate-fade-up">
          {activeTab === 'identity' && (
            <Suspense fallback={<TabSkeleton />}>
              <IdentityTab
                state={state}
                handlers={handlers}
                isHydrated={isHydrated}
              />
            </Suspense>
          )}
        </TabsContent>
        <TabsContent value="combat" className="animate-fade-up">
          {activeTab === 'combat' && (
            <Suspense fallback={<TabSkeleton />}>
              <CombatTab
                state={state}
                handlers={handlers}
                isHydrated={isHydrated}
              />
            </Suspense>
          )}
        </TabsContent>
        <TabsContent value="items" className="animate-fade-up">
          {activeTab === 'items' && (
            <Suspense fallback={<TabSkeleton />}>
              <ItemsTab
                state={state}
                handlers={handlers}
                isHydrated={isHydrated}
                pushUndo={pushUndo}
                shopSettings={shopSettings}
                campaignName={campaignName}
              />
            </Suspense>
          )}
        </TabsContent>
        <TabsContent value="session" className="animate-fade-up">
          {activeTab === 'session' && (
            <Suspense fallback={<TabSkeleton />}>
              <SessionTab
                state={state}
                handlers={handlers}
                isHydrated={isHydrated}
                activeEffects={state.activeEffects ?? []}
                onActiveEffectsChange={handlers.setActiveEffects}
              />
            </Suspense>
          )}
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
  if (readOnly || !isOpen) return null;

  return (
    <Suspense fallback={null}>
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
    </Suspense>
  );
}

function TabSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
