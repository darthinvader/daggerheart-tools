// Quest card section components - extracted to reduce complexity

import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Circle,
  Edit2,
  Eye,
  Gift,
  Map,
  Plus,
  Scroll,
  Target,
  Trash2,
  User,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
  QuestNPCInvolvement,
  SessionNote,
} from '@/lib/schemas/campaign';
import { DeleteConfirmDialog, type NPCPickerResult } from './entity-card-utils';
import {
  LocationPickerModal,
  NPCPickerModal,
  OrganizationPickerModal,
} from './entity-modals';

// =====================================================================================
// Constants
// =====================================================================================

export const QUEST_TYPE_OPTIONS: Array<{
  value: CampaignQuest['type'];
  label: string;
  color: string;
}> = [
  {
    value: 'main',
    label: 'Main Quest',
    color: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
  },
  {
    value: 'side',
    label: 'Side Quest',
    color: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  },
  {
    value: 'personal',
    label: 'Personal Quest',
    color: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  },
  {
    value: 'faction',
    label: 'Faction Quest',
    color: 'bg-green-500/20 text-green-600 border-green-500/30',
  },
  {
    value: 'rumor',
    label: 'Rumor',
    color: 'bg-slate-500/20 text-slate-600 border-slate-500/30',
  },
  {
    value: 'hook',
    label: 'Plot Hook',
    color: 'bg-pink-500/20 text-pink-600 border-pink-500/30',
  },
];

export const QUEST_STATUS_OPTIONS: Array<{
  value: CampaignQuest['status'];
  label: string;
  color: string;
  icon: typeof Circle;
}> = [
  {
    value: 'available',
    label: 'Available',
    color: 'bg-yellow-500/20 text-yellow-600',
    icon: Circle,
  },
  {
    value: 'active',
    label: 'Active',
    color: 'bg-blue-500/20 text-blue-600',
    icon: Circle,
  },
  {
    value: 'completed',
    label: 'Completed',
    color: 'bg-green-500/20 text-green-600',
    icon: CheckCircle2,
  },
  {
    value: 'failed',
    label: 'Failed',
    color: 'bg-red-500/20 text-red-600',
    icon: X,
  },
  {
    value: 'abandoned',
    label: 'Abandoned',
    color: 'bg-gray-500/20 text-gray-600',
    icon: X,
  },
];

export const QUEST_PRIORITY_OPTIONS: Array<{
  value: CampaignQuest['priority'];
  label: string;
  color: string;
}> = [
  { value: 'low', label: 'Low', color: 'text-gray-500' },
  { value: 'medium', label: 'Medium', color: 'text-blue-500' },
  { value: 'high', label: 'High', color: 'text-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-500' },
];

// =====================================================================================
// Header Component
// =====================================================================================

interface QuestCardHeaderProps {
  quest: CampaignQuest;
  isExpanded: boolean;
  completedCount: number;
  totalCount: number;
  onOpenDeleteModal: () => void;
}

export function QuestCardHeader({
  quest,
  isExpanded,
  completedCount,
  totalCount,
  onOpenDeleteModal,
}: QuestCardHeaderProps) {
  const typeInfo = QUEST_TYPE_OPTIONS.find(t => t.value === quest.type);
  const statusInfo = QUEST_STATUS_OPTIONS.find(s => s.value === quest.status);
  const priorityInfo = QUEST_PRIORITY_OPTIONS.find(
    p => p.value === quest.priority
  );

  return (
    <CardHeader className="bg-muted/30 py-3">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="h-auto flex-1 justify-start p-0">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${typeInfo?.color ?? 'bg-gray-500/20'}`}
              >
                <Target className={`h-5 w-5 ${priorityInfo?.color ?? ''}`} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{quest.title}</span>
                  <Badge variant="outline" className={statusInfo?.color ?? ''}>
                    {quest.status}
                  </Badge>
                </div>
                <div className="text-muted-foreground text-sm">
                  {typeInfo?.label ?? 'Quest'}
                  {totalCount > 0 &&
                    ` • ${completedCount}/${totalCount} objectives`}
                </div>
              </div>
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </Button>
        </CollapsibleTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 h-8 w-8"
                onClick={e => {
                  e.stopPropagation();
                  onOpenDeleteModal();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Quest</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </CardHeader>
  );
}

// =====================================================================================
// Basic Info Section
// =====================================================================================

interface QuestBasicInfoSectionProps {
  quest: CampaignQuest;
  onTextChange: <K extends keyof CampaignQuest>(
    field: K,
    value: CampaignQuest[K]
  ) => void;
  onBlur: () => void;
  onTypeChange: (value: CampaignQuest['type']) => void;
  onStatusChange: (value: CampaignQuest['status']) => void;
  onPriorityChange: (value: CampaignQuest['priority']) => void;
}

export function QuestBasicInfoSection({
  quest,
  onTextChange,
  onBlur,
  onTypeChange,
  onStatusChange,
  onPriorityChange,
}: QuestBasicInfoSectionProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs">
            <Scroll className="h-3 w-3 text-amber-500" />
            Title
          </Label>
          <Input
            value={quest.title}
            onChange={e => onTextChange('title', e.target.value)}
            onBlur={onBlur}
            placeholder="Quest title..."
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2">
            <Label className="text-xs">Type</Label>
            <Select
              value={quest.type}
              onValueChange={v => onTypeChange(v as CampaignQuest['type'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUEST_TYPE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Status</Label>
            <Select
              value={quest.status}
              onValueChange={v => onStatusChange(v as CampaignQuest['status'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUEST_STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Priority</Label>
            <Select
              value={quest.priority}
              onValueChange={v =>
                onPriorityChange(v as CampaignQuest['priority'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUEST_PRIORITY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className={option.color}>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Description</Label>
        <Textarea
          value={quest.description}
          onChange={e => onTextChange('description', e.target.value)}
          onBlur={onBlur}
          placeholder="What is this quest about?"
          rows={3}
        />
      </div>
    </>
  );
}

// =====================================================================================
// Objectives Section
// =====================================================================================

interface QuestObjectivesSectionProps {
  objectives: CampaignQuest['objectives'];
  completedCount: number;
  totalCount: number;
  newObjective: string;
  onNewObjectiveChange: (value: string) => void;
  onAddObjective: () => void;
  onToggleObjective: (id: string) => void;
  onRemoveObjective: (id: string) => void;
}

export function QuestObjectivesSection({
  objectives,
  completedCount,
  totalCount,
  newObjective,
  onNewObjectiveChange,
  onAddObjective,
  onToggleObjective,
  onRemoveObjective,
}: QuestObjectivesSectionProps) {
  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        Objectives ({completedCount}/{totalCount})
      </Label>
      {objectives.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
          No objectives added yet
        </div>
      ) : (
        <div className="space-y-2">
          {objectives.map(obj => (
            <div
              key={obj.id}
              className="bg-muted/30 flex items-center gap-3 rounded-lg p-3"
            >
              <button
                type="button"
                onClick={() => onToggleObjective(obj.id)}
                className="flex-shrink-0"
              >
                {obj.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="text-muted-foreground h-5 w-5" />
                )}
              </button>
              <span
                className={
                  obj.completed ? 'text-muted-foreground line-through' : ''
                }
              >
                {obj.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive ml-auto h-7 w-7"
                onClick={() => onRemoveObjective(obj.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={newObjective}
          onChange={e => onNewObjectiveChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddObjective();
            }
          }}
          placeholder="Add objective..."
          className="flex-1"
        />
        <Button variant="outline" size="icon" onClick={onAddObjective}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// =====================================================================================
// Rewards Section
// =====================================================================================

interface QuestRewardsSectionProps {
  rewards: string[];
  newReward: string;
  onNewRewardChange: (value: string) => void;
  onAddReward: () => void;
  onRemoveReward: (reward: string) => void;
}

export function QuestRewardsSection({
  rewards,
  newReward,
  onNewRewardChange,
  onAddReward,
  onRemoveReward,
}: QuestRewardsSectionProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs">
        <Gift className="h-3 w-3 text-yellow-500" />
        Rewards
      </Label>
      <div className="flex flex-wrap gap-2">
        {rewards.length === 0 ? (
          <p className="text-muted-foreground text-xs">No rewards specified</p>
        ) : (
          rewards.map(reward => (
            <Badge key={reward} variant="secondary" className="gap-1">
              <Gift className="h-3 w-3" />
              {reward}
              <button
                type="button"
                onClick={() => onRemoveReward(reward)}
                className="hover:bg-muted ml-1 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={newReward}
          onChange={e => onNewRewardChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddReward();
            }
          }}
          placeholder="Add reward..."
          className="flex-1"
        />
        <Button variant="outline" size="icon" onClick={onAddReward}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// =====================================================================================
// NPCs Section
// =====================================================================================

interface QuestNPCsSectionProps {
  npcsInvolved: QuestNPCInvolvement[];
  npcs: CampaignNPC[];
  onOpenNpcPicker: () => void;
  onEditNPC: (inv: QuestNPCInvolvement) => void;
  onRemoveNPC: (npcId: string) => void;
}

export function QuestNPCsSection({
  npcsInvolved,
  npcs,
  onOpenNpcPicker,
  onEditNPC,
  onRemoveNPC,
}: QuestNPCsSectionProps) {
  const getNpcName = (id: string) =>
    npcs.find(n => n.id === id)?.name ?? 'Unknown';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <User className="h-4 w-4 text-blue-500" />
          NPCs Involved
        </Label>
        <Button variant="outline" size="sm" onClick={onOpenNpcPicker}>
          <Plus className="mr-1 h-3 w-3" />
          Add NPC
        </Button>
      </div>

      {npcsInvolved.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
          No NPCs involved in this quest
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {npcsInvolved.map(inv => (
            <Card key={inv.npcId} className="bg-muted/20">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      <span className="truncate font-medium">
                        {getNpcName(inv.npcId)}
                      </span>
                    </div>
                    {inv.role && (
                      <p className="text-muted-foreground mt-1 text-sm">
                        Role: {inv.role}
                      </p>
                    )}
                    {inv.actionsTaken && (
                      <p className="text-muted-foreground truncate text-xs">
                        Actions: {inv.actionsTaken}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEditNPC(inv)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive h-7 w-7"
                      onClick={() => onRemoveNPC(inv.npcId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================================================
// Story Section (Foreshadowing + Consequences)
// =====================================================================================

interface QuestStorySectionProps {
  foreshadowing: string;
  consequences: string;
  onTextChange: <K extends keyof CampaignQuest>(
    field: K,
    value: CampaignQuest[K]
  ) => void;
  onBlur: () => void;
}

export function QuestStorySection({
  foreshadowing,
  consequences,
  onTextChange,
  onBlur,
}: QuestStorySectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs">
          <Eye className="h-3 w-3 text-purple-500" />
          Foreshadowing
        </Label>
        <Textarea
          value={foreshadowing}
          onChange={e => onTextChange('foreshadowing', e.target.value)}
          onBlur={onBlur}
          placeholder="Hints and clues to drop..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs">
          <AlertCircle className="h-3 w-3 text-orange-500" />
          Consequences
        </Label>
        <Textarea
          value={consequences}
          onChange={e => onTextChange('consequences', e.target.value)}
          onBlur={onBlur}
          placeholder="What happens if they fail or succeed..."
          rows={2}
        />
      </div>
    </div>
  );
}

// =====================================================================================
// Session Appearances Section
// =====================================================================================

interface SessionAppearance {
  sessionId?: string;
  sessionNumber?: number;
  sessionTitle?: string;
  notes?: string;
}

interface QuestSessionAppearancesSectionProps {
  sessionAppearances: SessionAppearance[];
  sessions: SessionNote[];
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
}

export function QuestSessionAppearancesSection({
  sessionAppearances,
  sessions,
  npcs,
  locations,
}: QuestSessionAppearancesSectionProps) {
  if (sessionAppearances.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs">
        <Calendar className="h-3 w-3 text-blue-500" />
        Session Appearances
      </Label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sessionAppearances.map((appearance, idx) => {
          const session = sessions.find(s => s.id === appearance.sessionId);
          const sessionNPCs = session?.npcsInvolved ?? [];
          const sessionLocationIds = session?.locationIds ?? [];

          return (
            <Card key={appearance.sessionId ?? idx} className="bg-muted/20">
              <CardContent className="p-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 flex-shrink-0 text-blue-500" />
                  <div className="min-w-0 flex-1 truncate text-sm font-medium">
                    S{appearance.sessionNumber}
                    {appearance.sessionTitle && `: ${appearance.sessionTitle}`}
                  </div>
                </div>
                {appearance.notes && (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                    {appearance.notes}
                  </p>
                )}
                {sessionNPCs.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {sessionNPCs.map(npcInv => {
                      const npc = npcs.find(n => n.id === npcInv.npcId);
                      return (
                        <Badge
                          key={npcInv.id}
                          variant="outline"
                          className="gap-0.5 px-1 py-0 text-[10px]"
                        >
                          <User className="h-2 w-2" />
                          {npc?.name ?? npcInv.npcName ?? 'Unknown'}
                          {npcInv.role && ` (${npcInv.role})`}
                        </Badge>
                      );
                    })}
                  </div>
                )}
                {sessionLocationIds.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {sessionLocationIds.map(locId => {
                      const loc = locations.find(l => l.id === locId);
                      return (
                        <Badge
                          key={locId}
                          variant="outline"
                          className="gap-0.5 px-1 py-0 text-[10px]"
                        >
                          <Map className="h-2 w-2" />
                          {loc?.name ?? 'Unknown'}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quest Locations Section
// ─────────────────────────────────────────────────────────────────────────────

interface QuestLocationsSectionProps {
  locationIds: string[];
  locations: CampaignLocation[];
  onAddLocation: () => void;
  onRemoveLocation: (id: string) => void;
}

export function QuestLocationsSection({
  locationIds,
  locations,
  onAddLocation,
  onRemoveLocation,
}: QuestLocationsSectionProps) {
  const getLocationName = (id: string) =>
    locations.find(l => l.id === id)?.name ?? 'Unknown';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-xs">
          <Map className="h-3 w-3 text-green-500" />
          Related Locations
        </Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddLocation}
          className="h-6 gap-1 px-2 text-xs"
        >
          <Plus className="h-3 w-3" />
          Add Location
        </Button>
      </div>
      {locationIds.length === 0 ? (
        <p className="text-muted-foreground text-xs italic">
          No locations linked
        </p>
      ) : (
        <div className="flex flex-wrap gap-1">
          {locationIds.map(id => (
            <Badge key={id} variant="secondary" className="gap-1 pr-1">
              <Map className="h-3 w-3" />
              {getLocationName(id)}
              <button
                type="button"
                onClick={() => onRemoveLocation(id)}
                className="hover:text-destructive ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quest Organizations Section
// ─────────────────────────────────────────────────────────────────────────────

interface QuestOrganization {
  id: string;
  name: string;
}

interface QuestOrganizationsSectionProps {
  organizationIds: string[];
  organizations: QuestOrganization[];
  onAddOrganization: () => void;
  onRemoveOrganization: (id: string) => void;
}

export function QuestOrganizationsSection({
  organizationIds,
  organizations,
  onAddOrganization,
  onRemoveOrganization,
}: QuestOrganizationsSectionProps) {
  const getOrgName = (id: string) =>
    organizations.find(o => o.id === id)?.name ?? 'Unknown';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-xs">
          <Building2 className="h-3 w-3 text-purple-500" />
          Organizations
        </Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddOrganization}
          className="h-6 gap-1 px-2 text-xs"
        >
          <Plus className="h-3 w-3" />
          Add Organization
        </Button>
      </div>
      {organizationIds.length === 0 ? (
        <p className="text-muted-foreground text-xs italic">
          No organizations linked
        </p>
      ) : (
        <div className="flex flex-wrap gap-1">
          {organizationIds.map(id => (
            <Badge key={id} variant="secondary" className="gap-1 pr-1">
              <Building2 className="h-3 w-3" />
              {getOrgName(id)}
              <button
                type="button"
                onClick={() => onRemoveOrganization(id)}
                className="hover:text-destructive ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================================================
// Quest Modals Section
// =====================================================================================

interface QuestModalsSectionProps {
  modals: {
    deleteConfirm: boolean;
    npcPicker: boolean;
    locationPicker: boolean;
    orgPicker: boolean;
  };
  setModalOpen: (
    key: 'deleteConfirm' | 'npcPicker' | 'locationPicker' | 'orgPicker',
    open: boolean
  ) => void;
  quest: CampaignQuest;
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  organizations: CampaignOrganization[];
  onDelete: () => void;
  onAddNPC: (result: NPCPickerResult) => void;
  onAddLocation: (id: string) => void;
  onAddOrganization: (id: string) => void;
  onCreateNPC: (name: string) => Promise<string>;
  onCreateLocation: (
    name: string,
    type: CampaignLocation['type']
  ) => Promise<string>;
  onCreateOrganization: (
    name: string,
    type: CampaignOrganization['type']
  ) => Promise<string>;
}

export function QuestModalsSection({
  modals,
  setModalOpen,
  quest,
  npcs,
  locations,
  organizations,
  onDelete,
  onAddNPC,
  onAddLocation,
  onAddOrganization,
  onCreateNPC,
  onCreateLocation,
  onCreateOrganization,
}: QuestModalsSectionProps) {
  return (
    <>
      <DeleteConfirmDialog
        open={modals.deleteConfirm}
        onOpenChange={open => setModalOpen('deleteConfirm', open)}
        entityType="Quest"
        entityName={quest.title}
        onDelete={onDelete}
      />

      <NPCPickerModal
        open={modals.npcPicker}
        onOpenChange={open => setModalOpen('npcPicker', open)}
        npcs={npcs}
        locations={locations}
        quests={[]}
        selectedNpcIds={quest.npcsInvolved.map(inv => inv.npcId)}
        onSelectNPC={onAddNPC}
        onCreateNPC={onCreateNPC}
        title="Add NPC to Quest"
        description="Select an NPC involved in this quest"
        showInvolvementFields={true}
      />

      <LocationPickerModal
        open={modals.locationPicker}
        onOpenChange={open => setModalOpen('locationPicker', open)}
        locations={locations}
        selectedLocationIds={quest.locationIds ?? []}
        onSelectLocation={onAddLocation}
        onCreateLocation={onCreateLocation}
        title="Link Location to Quest"
        description="Select a location related to this quest"
      />

      <OrganizationPickerModal
        open={modals.orgPicker}
        onOpenChange={open => setModalOpen('orgPicker', open)}
        organizations={organizations}
        selectedOrganizationIds={quest.organizationIds ?? []}
        onSelectOrganization={onAddOrganization}
        onCreateOrganization={onCreateOrganization}
        title="Link Organization to Quest"
        description="Select an organization involved in this quest"
      />
    </>
  );
}
