import { Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  Cloud,
  CloudOff,
  Loader2,
  Unlink,
  Users,
} from 'lucide-react';
import { useState } from 'react';

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
import { Backpack, BarChart3, Dice5, Swords, User, Zap } from '@/lib/icons';
import type { Campaign } from '@/lib/schemas/campaign';
import { cn } from '@/lib/utils';

import { ResponsiveTabsList } from './responsive-tabs';
import type { CharacterSheetHandlers, CharacterSheetState } from './types.ts';

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
}: CharacterSheetLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="space-y-6">
        <CharacterOnboardingSection
          isOpen={isOnboardingOpen}
          readOnly={readOnly}
          onDismiss={onDismissOnboarding}
          setIsNewCharacter={setIsNewCharacter}
          state={state}
          handlers={handlers}
          campaignId={campaignId}
        />
        <CharacterSheetHeader
          characterName={state.identity.name || 'New Character'}
          characterTitle={state.identity.calling}
          level={state.progression.currentLevel}
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
    </div>
  );
}

function SaveIndicator({
  isSaving,
  lastSaved,
}: {
  isSaving: boolean;
  lastSaved: Date | null;
}) {
  if (isSaving) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Cloud className="h-4 w-4 text-green-500" />
        <span>Saved</span>
      </div>
    );
  }

  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <CloudOff className="h-4 w-4" />
      <span>Not saved</span>
    </div>
  );
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

function CharacterSheetHeader({
  characterName,
  characterTitle,
  level,
  readOnly,
  isSaving,
  lastSaved,
  campaignSection,
}: {
  characterName: string;
  characterTitle?: string;
  level: number;
  readOnly: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  campaignSection?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Button variant="ghost" size="sm" asChild className="w-fit">
          <Link to="/character">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold sm:text-xl">
              {characterName || 'Untitled Character'}
            </span>
            {characterTitle && (
              <Badge
                variant="outline"
                className="border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/30"
              >
                {characterTitle}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Level {level} Character
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {campaignSection}
        {readOnly ? (
          <Badge variant="outline">Read-only</Badge>
        ) : (
          <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
        )}
      </div>
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
            '[&_button]:pointer-events-none [&_button]:opacity-60 [&_input]:pointer-events-none [&_input]:opacity-70 [&_select]:pointer-events-none [&_select]:opacity-70 [&_textarea]:pointer-events-none [&_textarea]:opacity-70 **:[[role=button]]:pointer-events-none **:[[role=button]]:opacity-60'
        )}
      >
        <TabsContent value="quick">
          <QuickViewTab state={state} handlers={handlers} />
        </TabsContent>
        <TabsContent value="overview">
          <OverviewTab
            state={state}
            handlers={handlers}
            isHydrated={isHydrated}
          />
        </TabsContent>
        <TabsContent value="identity">
          <IdentityTab
            state={state}
            handlers={handlers}
            isHydrated={isHydrated}
          />
        </TabsContent>
        <TabsContent value="combat">
          <CombatTab
            state={state}
            handlers={handlers}
            isHydrated={isHydrated}
          />
        </TabsContent>
        <TabsContent value="items">
          <ItemsTab state={state} handlers={handlers} isHydrated={isHydrated} />
        </TabsContent>
        <TabsContent value="session">
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
