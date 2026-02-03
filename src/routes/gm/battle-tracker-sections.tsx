/**
 * Battle Tracker Page Section Components
 *
 * Extracted section components for the standalone battle tracker page.
 */
import { Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  LinkIcon,
  Pause,
  Play,
  Plus,
  Save,
  Square,
  Swords,
  User,
  Wand2,
} from 'lucide-react';

import { AddCharacterDialog } from '@/components/battle-tracker/add-character-dialog';
import { AddAdversaryDialogEnhanced } from '@/components/battle-tracker/adversary-dialog-enhanced';
import {
  EditAdversaryDialog,
  EditEnvironmentDialog,
} from '@/components/battle-tracker/edit-dialogs';
import { AddEnvironmentDialogEnhanced } from '@/components/battle-tracker/environment-dialog-enhanced';
import { FightBuilderWizard } from '@/components/battle-tracker/fight-builder-wizard';
import {
  AdversaryCard,
  CharacterCard,
} from '@/components/battle-tracker/roster-cards';
import { RosterColumn } from '@/components/battle-tracker/roster-column';
import type {
  AdversaryTracker,
  EnvironmentTracker,
} from '@/components/battle-tracker/types';
import type {
  useBattleDialogState,
  useBattleRosterState,
} from '@/components/battle-tracker/use-battle-tracker-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Adversary } from '@/lib/schemas/adversaries';
import type { Campaign } from '@/lib/schemas/campaign';
import type { Environment } from '@/lib/schemas/environments';

// Derive types from the hooks
export type RosterState = ReturnType<
  typeof useBattleRosterState
>['rosterState'];
export type RosterActions = ReturnType<
  typeof useBattleRosterState
>['rosterActions'];
export type DialogState = ReturnType<
  typeof useBattleDialogState
>['dialogState'];
export type DialogActions = ReturnType<
  typeof useBattleDialogState
>['dialogActions'];

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

export const STATUS_COLORS: Record<string, string> = {
  planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  active:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  paused:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
};

// ─────────────────────────────────────────────────────────────────────────────
// Header Section
// ─────────────────────────────────────────────────────────────────────────────

interface BattleStatusControlsProps {
  status: string;
  onStart: () => void;
  onPause: () => void;
  onEnd: () => void;
  onNewBattle: () => void;
}

function BattleStatusControls({
  status,
  onStart,
  onPause,
  onEnd,
  onNewBattle,
}: BattleStatusControlsProps) {
  if (status === 'planning') {
    return (
      <Button size="sm" variant="default" onClick={onStart}>
        <Play className="mr-1.5 size-4" /> Start
      </Button>
    );
  }

  if (status === 'active') {
    return (
      <>
        <Button size="sm" variant="outline" onClick={onPause}>
          <Pause className="mr-1.5 size-4" /> Pause
        </Button>
        <Button size="sm" variant="destructive" onClick={onEnd}>
          <Square className="mr-1.5 size-4" /> End
        </Button>
      </>
    );
  }

  if (status === 'paused') {
    return (
      <>
        <Button size="sm" variant="default" onClick={onStart}>
          <Play className="mr-1.5 size-4" /> Resume
        </Button>
        <Button size="sm" variant="destructive" onClick={onEnd}>
          <Square className="mr-1.5 size-4" /> End
        </Button>
      </>
    );
  }

  if (status === 'completed') {
    return (
      <Button size="sm" variant="outline" onClick={onNewBattle}>
        <Plus className="mr-1.5 size-4" /> New Battle
      </Button>
    );
  }

  return null;
}

interface BattleHeaderProps {
  battleName: string;
  battleStatus: string;
  activeBattleId: string | null;
  campaigns: Campaign[];
  isSaving: boolean;
  isLinking: boolean;
  onBattleNameChange: (name: string) => void;
  onStart: () => void;
  onPause: () => void;
  onEnd: () => void;
  onNewBattle: () => void;
  onSave: () => void;
  onLinkClick: () => void;
  onAddCharacterClick: () => void;
  onAddAdversaryClick: () => void;
  onFightBuilderClick: () => void;
}

export function BattleHeader({
  battleName,
  battleStatus,
  activeBattleId,
  campaigns,
  isSaving,
  isLinking,
  onBattleNameChange,
  onStart,
  onPause,
  onEnd,
  onNewBattle,
  onSave,
  onLinkClick,
  onAddCharacterClick,
  onAddAdversaryClick,
  onFightBuilderClick,
}: BattleHeaderProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link to="/gm/saved-encounters">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Saved Encounters
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Input
              value={battleName}
              onChange={e => onBattleNameChange(e.target.value)}
              className="h-8 w-48 text-sm font-medium"
              placeholder="Battle name..."
            />
            <Badge className={STATUS_COLORS[battleStatus]}>
              {battleStatus}
            </Badge>
            {activeBattleId && (
              <span className="text-muted-foreground text-xs">Saved</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <BattleStatusControls
            status={battleStatus}
            onStart={onStart}
            onPause={onPause}
            onEnd={onEnd}
            onNewBattle={onNewBattle}
          />

          <Button
            size="sm"
            variant="outline"
            onClick={onSave}
            disabled={isSaving}
          >
            <Save className="mr-1.5 size-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>

          {campaigns.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLinkClick}
              disabled={isLinking}
            >
              <LinkIcon className="mr-1.5 size-4" />
              Link to Campaign
            </Button>
          )}

          <div className="border-border flex gap-2 border-l pl-2">
            <Button size="sm" variant="outline" onClick={onAddCharacterClick}>
              <User className="mr-1.5 size-4" /> Character
            </Button>
            <Button size="sm" variant="outline" onClick={onAddAdversaryClick}>
              <Swords className="mr-1.5 size-4" /> Adversary
            </Button>
            <Button size="sm" onClick={onFightBuilderClick} className="gap-1">
              <Wand2 className="size-4" /> Fight Builder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Roster Grid Section
// ─────────────────────────────────────────────────────────────────────────────

interface RosterGridProps {
  rosterState: RosterState;
  rosterActions: RosterActions;
  onEditAdversary: (adversary: AdversaryTracker) => void;
  DetailSidebarComponent: React.ComponentType<{
    item: RosterState['selectedItem'];
    spotlight: RosterState['spotlight'];
    spotlightHistory: RosterState['spotlightHistory'];
    characters: RosterState['characters'];
    adversaries: RosterState['adversaries'];
    environments: RosterState['environments'];
    useMassiveThreshold: boolean;
    onClearSpotlight: () => void;
    onSetSpotlight: RosterActions['setSpotlight'];
    onCharacterChange: RosterActions['updateCharacter'];
    onAdversaryChange: RosterActions['updateAdversary'];
    onEnvironmentChange: RosterActions['updateEnvironment'];
  }>;
}

export function RosterGrid({
  rosterState,
  rosterActions,
  onEditAdversary,
  DetailSidebarComponent,
}: RosterGridProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr_minmax(320px,400px)]">
      <RosterColumn
        title="Characters"
        icon={<User className="size-4" />}
        count={rosterState.characters.length}
        emptyText="No characters added"
      >
        {rosterState.characters.map(character => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={
              rosterState.selection?.id === character.id &&
              rosterState.selection.kind === 'character'
            }
            isSpotlight={
              rosterState.spotlight?.id === character.id &&
              rosterState.spotlight.kind === 'character'
            }
            useMassiveThreshold={rosterState.useMassiveThreshold}
            onSelect={() => rosterActions.handleSelect(character)}
            onRemove={() => rosterActions.handleRemove(character)}
            onSpotlight={() => rosterActions.handleSpotlight(character)}
            onChange={rosterActions.updateCharacter}
          />
        ))}
      </RosterColumn>

      <RosterColumn
        title="Adversaries"
        icon={<Swords className="size-4" />}
        count={rosterState.adversaries.length}
        emptyText="No adversaries added"
      >
        {rosterState.adversaries.map(adversary => (
          <AdversaryCard
            key={adversary.id}
            adversary={adversary}
            isSelected={
              rosterState.selection?.id === adversary.id &&
              rosterState.selection.kind === 'adversary'
            }
            isSpotlight={
              rosterState.spotlight?.id === adversary.id &&
              rosterState.spotlight.kind === 'adversary'
            }
            useMassiveThreshold={rosterState.useMassiveThreshold}
            onSelect={() => rosterActions.handleSelect(adversary)}
            onRemove={() => rosterActions.handleRemove(adversary)}
            onSpotlight={() => rosterActions.handleSpotlight(adversary)}
            onChange={rosterActions.updateAdversary}
            onEdit={() => onEditAdversary(adversary)}
          />
        ))}
      </RosterColumn>

      <DetailSidebarComponent
        item={rosterState.selectedItem}
        spotlight={rosterState.spotlight}
        spotlightHistory={rosterState.spotlightHistory}
        characters={rosterState.characters}
        adversaries={rosterState.adversaries}
        environments={rosterState.environments}
        useMassiveThreshold={rosterState.useMassiveThreshold}
        onClearSpotlight={() => rosterActions.setSpotlight(null)}
        onSetSpotlight={rosterActions.setSpotlight}
        onCharacterChange={rosterActions.updateCharacter}
        onAdversaryChange={rosterActions.updateAdversary}
        onEnvironmentChange={rosterActions.updateEnvironment}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dialogs Section
// ─────────────────────────────────────────────────────────────────────────────

interface BattleDialogsProps {
  dialogState: DialogState;
  dialogActions: DialogActions;
  editingAdversary: AdversaryTracker | null;
  editingEnvironment: EnvironmentTracker | null;
  isFightBuilderOpen: boolean;
  characterCount: number;
  onAddCharacter: () => void;
  onAddAdversary: (adversary: Adversary) => void;
  onAddEnvironment: (environment: Environment) => void;
  onAddFromWizard: (
    adversaries: { adversary: Adversary; count: number }[]
  ) => void;
  onSaveAdversary: (updates: Partial<AdversaryTracker>) => void;
  onSaveEnvironment: (updates: Partial<EnvironmentTracker>) => void;
  setEditingAdversary: (adversary: AdversaryTracker | null) => void;
  setEditingEnvironment: (environment: EnvironmentTracker | null) => void;
  setIsFightBuilderOpen: (open: boolean) => void;
}

export function BattleDialogs({
  dialogState,
  dialogActions,
  editingAdversary,
  editingEnvironment,
  isFightBuilderOpen,
  characterCount,
  onAddCharacter,
  onAddAdversary,
  onAddEnvironment,
  onAddFromWizard,
  onSaveAdversary,
  onSaveEnvironment,
  setEditingAdversary,
  setEditingEnvironment,
  setIsFightBuilderOpen,
}: BattleDialogsProps) {
  return (
    <>
      <AddCharacterDialog
        isOpen={dialogState.isAddCharacterOpen}
        onOpenChange={dialogActions.setIsAddCharacterOpen}
        characterDraft={dialogState.characterDraft}
        onDraftChange={dialogActions.setCharacterDraft}
        onAdd={onAddCharacter}
        onCancel={() => dialogActions.setIsAddCharacterOpen(false)}
      />

      <AddAdversaryDialogEnhanced
        isOpen={dialogState.isAddAdversaryOpen}
        onOpenChange={dialogActions.setIsAddAdversaryOpen}
        adversaries={dialogState.filteredAdversaries}
        onAdd={onAddAdversary}
      />

      <AddEnvironmentDialogEnhanced
        isOpen={dialogState.isAddEnvironmentOpen}
        onOpenChange={dialogActions.setIsAddEnvironmentOpen}
        environments={dialogState.filteredEnvironments}
        onAdd={onAddEnvironment}
      />

      <EditAdversaryDialog
        adversary={editingAdversary}
        isOpen={editingAdversary !== null}
        onOpenChange={open => !open && setEditingAdversary(null)}
        onSave={onSaveAdversary}
      />

      <EditEnvironmentDialog
        environment={editingEnvironment}
        isOpen={editingEnvironment !== null}
        onOpenChange={open => !open && setEditingEnvironment(null)}
        onSave={onSaveEnvironment}
      />

      <FightBuilderWizard
        isOpen={isFightBuilderOpen}
        onOpenChange={setIsFightBuilderOpen}
        onAddAdversaries={onAddFromWizard}
        currentCharacterCount={characterCount}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Link Campaign Dialog
// ─────────────────────────────────────────────────────────────────────────────

interface LinkCampaignDialogProps {
  isOpen: boolean;
  campaigns: Campaign[];
  selectedCampaignId: string;
  isLinking: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignSelect: (id: string) => void;
  onLink: () => void;
}

export function LinkCampaignDialog({
  isOpen,
  campaigns,
  selectedCampaignId,
  isLinking,
  onOpenChange,
  onCampaignSelect,
  onLink,
}: LinkCampaignDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link to Campaign</DialogTitle>
          <DialogDescription>
            Copy this battle to a campaign. The standalone battle will be
            deleted and you'll be redirected to the campaign battle tracker.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="campaign-select">Select Campaign</Label>
            <Select value={selectedCampaignId} onValueChange={onCampaignSelect}>
              <SelectTrigger id="campaign-select">
                <SelectValue placeholder="Choose a campaign..." />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map(campaign => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onLink} disabled={!selectedCampaignId || isLinking}>
            {isLinking ? 'Linking...' : 'Link to Campaign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
