// Quest components - Enhanced with NPC/PC involvement and organization links

import { Clock, MapPin as Map, Plus, Target, User } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useTagManager } from '@/hooks/use-tag-manager';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
  QuestNPCInvolvement,
  SessionNote,
} from '@/lib/schemas/campaign';
import {
  useEntityCardState,
  useEntityIdListHandlers,
  useModalState,
  useSelectChangeHandler,
} from './entity-card-utils';
import { TagInputSection } from './entity-tag-input';
import {
  QUEST_STATUS_OPTIONS,
  QUEST_TYPE_OPTIONS,
  QuestBasicInfoSection,
  QuestCardHeader,
  QuestLocationsSection,
  QuestModalsSection,
  QuestNPCsSection,
  QuestObjectivesSection,
  QuestOrganizationsSection,
  QuestRewardsSection,
  QuestSessionAppearancesSection,
  QuestStorySection,
} from './quest-card-sections';
import { useQuestCardInputHandlers } from './use-quest-card-input-handlers';
import { useQuestEntityHandlers } from './use-quest-entity-handlers';

// =====================================================================================
// Types
// =====================================================================================

interface EditableQuestsProps {
  quests: CampaignQuest[];
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  sessions: SessionNote[];
  organizations: CampaignOrganization[];
  campaignId: string;
  onSaveStart: () => void;
  onPendingChange: () => void;
  onQuestsChange: () => void;
  onNPCsChange?: () => void;
  onLocationsChange?: () => void;
  onOrganizationsChange?: () => void;
}

// =====================================================================================
// Main Component
// =====================================================================================

export function EditableQuests({
  quests,
  npcs,
  locations,
  sessions,
  organizations,
  campaignId,
  onSaveStart,
  onPendingChange,
  onQuestsChange,
  onNPCsChange,
  onLocationsChange,
  onOrganizationsChange,
}: EditableQuestsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    CampaignQuest['status'] | null
  >(null);
  const [typeFilter, setTypeFilter] = useState<CampaignQuest['type'] | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Entity CRUD handlers (extracted hook)
  const {
    handleAddQuest,
    handleUpdateQuest,
    handleDeleteQuest,
    handleCreateNPC,
    handleCreateLocation,
    handleCreateOrganization,
  } = useQuestEntityHandlers({
    campaignId,
    onSaveStart,
    onQuestsChange,
    onNPCsChange,
    onLocationsChange,
    onOrganizationsChange,
  });

  const filteredQuests = quests
    .filter(q => (statusFilter ? q.status === statusFilter : true))
    .filter(q => (typeFilter ? q.type === typeFilter : true))
    .filter(q => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      return [q.title, q.description, q.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });

  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  const statusOrder = {
    active: 0,
    available: 1,
    completed: 2,
    failed: 3,
    abandoned: 4,
  };

  const sortedQuests = [...filteredQuests].sort((a, b) => {
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleAddQuest} className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Quest
        </Button>
        <div className="relative flex-1">
          <Input
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Search quests..."
            className="pl-10"
          />
          <Target className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        </div>
        <Select
          value={statusFilter ?? 'all'}
          onValueChange={v =>
            setStatusFilter(v === 'all' ? null : (v as CampaignQuest['status']))
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {QUEST_STATUS_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={typeFilter ?? 'all'}
          onValueChange={v =>
            setTypeFilter(v === 'all' ? null : (v as CampaignQuest['type']))
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {QUEST_TYPE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {sortedQuests.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Target className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="mb-2 font-medium">No quests created yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Add main quests, side quests, and plot hooks
            </p>
            <Button onClick={handleAddQuest} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add First Quest
            </Button>
          </CardContent>
        </Card>
      ) : (
        sortedQuests.map(quest => (
          <QuestCard
            key={quest.id}
            quest={quest}
            npcs={npcs}
            locations={locations}
            sessions={sessions}
            organizations={organizations}
            isExpanded={expandedId === quest.id}
            onToggle={() =>
              setExpandedId(expandedId === quest.id ? null : quest.id)
            }
            onUpdate={updates => handleUpdateQuest(quest.id, updates)}
            onDelete={() => handleDeleteQuest(quest.id)}
            onCreateNPC={handleCreateNPC}
            onCreateLocation={handleCreateLocation}
            onCreateOrganization={handleCreateOrganization}
            onSaveStart={onSaveStart}
            onPendingChange={onPendingChange}
          />
        ))
      )}
    </div>
  );
}

// =====================================================================================
// Quest Card Component
// =====================================================================================

interface QuestCardProps {
  quest: CampaignQuest;
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  sessions: SessionNote[];
  organizations: CampaignOrganization[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<Omit<CampaignQuest, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<void>;
  onDelete: () => void;
  onCreateNPC: (name: string) => Promise<string>;
  onCreateLocation: (
    name: string,
    type: CampaignLocation['type']
  ) => Promise<string>;
  onCreateOrganization: (
    name: string,
    type: CampaignOrganization['type']
  ) => Promise<string>;
  onSaveStart: () => void;
  onPendingChange: () => void;
}

function normalizeQuest(quest: CampaignQuest): CampaignQuest {
  return {
    ...quest,
    objectives: quest.objectives ?? [],
    rewards: Array.isArray(quest.rewards)
      ? quest.rewards
      : quest.rewards
        ? [quest.rewards]
        : [],
    npcsInvolved: quest.npcsInvolved ?? [],
    charactersInvolved: quest.charactersInvolved ?? [],
    locationIds: quest.locationIds ?? [],
    organizationIds: quest.organizationIds ?? [],
    sessionIds: quest.sessionIds ?? [],
    relatedNpcs: quest.relatedNpcs ?? [],
    relatedNpcsCustom: quest.relatedNpcsCustom ?? [],
    relatedLocations: quest.relatedLocations ?? [],
    relatedLocationsCustom: quest.relatedLocationsCustom ?? [],
    sessionAppearances: quest.sessionAppearances ?? [],
    tags: quest.tags ?? [],
  } as CampaignQuest;
}

// Modal keys for QuestCard
const QUEST_MODAL_KEYS = [
  'deleteConfirm',
  'npcPicker',
  'locationPicker',
  'orgPicker',
] as const;
type QuestModalKey = (typeof QUEST_MODAL_KEYS)[number];

function QuestCard({
  quest,
  npcs,
  locations,
  sessions,
  organizations,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  onCreateNPC,
  onCreateLocation,
  onCreateOrganization,
  onSaveStart,
  onPendingChange,
}: QuestCardProps) {
  // Shared state management hook
  const {
    localEntity: localQuest,
    setLocalEntity: setLocalQuest,
    scheduleAutoSave,
    handleTextChange,
    handleBlur,
  } = useEntityCardState({
    entity: quest,
    normalizer: normalizeQuest,
    onUpdate,
    onSaveStart,
    onPendingChange,
  });

  // Modal state management
  const { modals, openModal, setModalOpen } =
    useModalState<QuestModalKey>(QUEST_MODAL_KEYS);

  // Tag management hook
  const { tagInput, setTagInput, addTag, removeTag } = useTagManager({
    entity: localQuest,
    setEntity: setLocalQuest,
    scheduleAutoSave,
  });

  // ID list handlers
  const handlerContext = {
    localEntity: localQuest,
    setLocalEntity: setLocalQuest,
    scheduleAutoSave,
  };
  const locationHandlers = useEntityIdListHandlers(
    'locationIds',
    handlerContext
  );
  const orgHandlers = useEntityIdListHandlers(
    'organizationIds',
    handlerContext
  );

  // Select change handlers using generic hook
  const selectContext = { setLocalEntity: setLocalQuest, scheduleAutoSave };
  const handleTypeChange = useSelectChangeHandler<CampaignQuest, 'type'>(
    'type',
    selectContext
  );
  const handleStatusChange = useSelectChangeHandler<CampaignQuest, 'status'>(
    'status',
    selectContext
  );
  const handlePriorityChange = useSelectChangeHandler<
    CampaignQuest,
    'priority'
  >('priority', selectContext);

  // Input state and handlers (extracted hook)
  const {
    newObjective,
    setNewObjective,
    addObjective,
    toggleObjective,
    removeObjective,
    newReward,
    setNewReward,
    handleAddReward,
    handleRemoveReward,
    rewards,
    editingNPCInvolvement,
    setEditingNPCInvolvement,
    handleAddNPC,
    handleRemoveNPC,
    handleUpdateNPCInvolvement,
  } = useQuestCardInputHandlers({
    localQuest,
    setLocalQuest,
    scheduleAutoSave,
  });

  // Helper functions
  const getNpcName = (id: string) =>
    npcs.find(n => n.id === id)?.name ?? 'Unknown';

  const completedCount = localQuest.objectives.filter(
    obj => obj.completed
  ).length;
  const totalCount = localQuest.objectives.length;

  return (
    <>
      <Card className="overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <QuestCardHeader
            quest={localQuest}
            isExpanded={isExpanded}
            completedCount={completedCount}
            totalCount={totalCount}
            onOpenDeleteModal={() => openModal('deleteConfirm')}
          />

          <CollapsibleContent>
            <CardContent className="space-y-6 pt-6">
              <QuestBasicInfoSection
                quest={localQuest}
                onTextChange={handleTextChange}
                onBlur={handleBlur}
                onTypeChange={handleTypeChange}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
              />

              <Separator />

              <QuestObjectivesSection
                objectives={localQuest.objectives}
                completedCount={completedCount}
                totalCount={totalCount}
                newObjective={newObjective}
                onNewObjectiveChange={setNewObjective}
                onAddObjective={addObjective}
                onToggleObjective={toggleObjective}
                onRemoveObjective={removeObjective}
              />

              <QuestRewardsSection
                rewards={rewards}
                newReward={newReward}
                onNewRewardChange={setNewReward}
                onAddReward={handleAddReward}
                onRemoveReward={handleRemoveReward}
              />

              <Separator />

              <QuestNPCsSection
                npcsInvolved={localQuest.npcsInvolved}
                npcs={npcs}
                onOpenNpcPicker={() => openModal('npcPicker')}
                onEditNPC={setEditingNPCInvolvement}
                onRemoveNPC={handleRemoveNPC}
              />

              <QuestLocationsSection
                locationIds={localQuest.locationIds ?? []}
                locations={locations}
                onAddLocation={() => openModal('locationPicker')}
                onRemoveLocation={locationHandlers.handleRemove}
              />

              <QuestOrganizationsSection
                organizationIds={localQuest.organizationIds ?? []}
                organizations={organizations}
                onAddOrganization={() => openModal('orgPicker')}
                onRemoveOrganization={orgHandlers.handleRemove}
              />

              <Separator />

              <QuestStorySection
                foreshadowing={localQuest.foreshadowing}
                consequences={localQuest.consequences}
                onTextChange={handleTextChange}
                onBlur={handleBlur}
              />

              <QuestSessionAppearancesSection
                sessionAppearances={localQuest.sessionAppearances ?? []}
                sessions={sessions}
                npcs={npcs}
                locations={locations}
              />

              <Separator />

              {/* Tags */}
              <TagInputSection
                tags={localQuest.tags}
                tagInput={tagInput}
                onInputChange={setTagInput}
                onAdd={addTag}
                onRemove={removeTag}
              />

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-xs">Additional Notes</Label>
                <Textarea
                  value={localQuest.notes}
                  onChange={e => handleTextChange('notes', e.target.value)}
                  onBlur={handleBlur}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Modals */}
      <QuestModalsSection
        modals={modals}
        setModalOpen={setModalOpen}
        quest={localQuest}
        npcs={npcs}
        locations={locations}
        organizations={organizations}
        onDelete={onDelete}
        onAddNPC={handleAddNPC}
        onAddLocation={locationHandlers.handleAdd}
        onAddOrganization={orgHandlers.handleAdd}
        onCreateNPC={onCreateNPC}
        onCreateLocation={onCreateLocation}
        onCreateOrganization={onCreateOrganization}
      />

      {/* NPC Involvement Editor Modal */}
      {editingNPCInvolvement && (
        <QuestNPCInvolvementEditorModal
          open={!!editingNPCInvolvement}
          onOpenChange={open => !open && setEditingNPCInvolvement(null)}
          involvement={editingNPCInvolvement}
          npcName={getNpcName(editingNPCInvolvement.npcId)}
          locations={locations}
          sessions={sessions}
          onSave={handleUpdateNPCInvolvement}
        />
      )}
    </>
  );
}

// =====================================================================================
// Quest NPC Involvement Editor Modal
// =====================================================================================

interface QuestNPCInvolvementEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  involvement: QuestNPCInvolvement;
  npcName: string;
  locations: CampaignLocation[];
  sessions: SessionNote[];
  onSave: (involvement: QuestNPCInvolvement) => void;
}

function QuestNPCInvolvementEditorModal({
  open,
  onOpenChange,
  involvement,
  npcName,
  locations,
  sessions,
  onSave,
}: QuestNPCInvolvementEditorModalProps) {
  const [local, setLocal] = useState(involvement);

  const handleSave = () => {
    onSave(local);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Edit NPC Involvement: {npcName}
          </DialogTitle>
          <DialogDescription>
            Update this NPC's role and involvement in the quest
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Role in Quest</Label>
            <Input
              value={local.role ?? ''}
              onChange={e => setLocal({ ...local, role: e.target.value })}
              placeholder="e.g., Quest giver, Antagonist, Ally..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Actions Taken</Label>
            <Textarea
              value={local.actionsTaken ?? ''}
              onChange={e =>
                setLocal({ ...local, actionsTaken: e.target.value })
              }
              placeholder="What has this NPC done in relation to this quest?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Notes</Label>
            <Textarea
              value={local.notes ?? ''}
              onChange={e => setLocal({ ...local, notes: e.target.value })}
              placeholder="Additional notes about their involvement..."
              rows={2}
            />
          </div>

          {/* Related Locations */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs">
              <Map className="h-3 w-3 text-green-500" />
              Related Locations
            </Label>
            <ScrollArea className="h-24">
              <div className="flex flex-wrap gap-1">
                {locations.map(loc => {
                  const isSelected = (local.locationIds ?? []).includes(loc.id);
                  return (
                    <Badge
                      key={loc.id}
                      variant={isSelected ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        setLocal(prev => ({
                          ...prev,
                          locationIds: isSelected
                            ? (prev.locationIds ?? []).filter(
                                id => id !== loc.id
                              )
                            : [...(prev.locationIds ?? []), loc.id],
                        }));
                      }}
                    >
                      {loc.name}
                    </Badge>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Related Sessions */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs">
              <Clock className="h-3 w-3 text-amber-500" />
              Related Sessions
            </Label>
            <ScrollArea className="h-24">
              <div className="flex flex-wrap gap-1">
                {sessions.map(session => {
                  const isSelected = (local.sessionIds ?? []).includes(
                    session.id
                  );
                  return (
                    <Badge
                      key={session.id}
                      variant={isSelected ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        setLocal(prev => ({
                          ...prev,
                          sessionIds: isSelected
                            ? (prev.sessionIds ?? []).filter(
                                id => id !== session.id
                              )
                            : [...(prev.sessionIds ?? []), session.id],
                        }));
                      }}
                    >
                      {session.title || `Session ${session.sessionNumber}`}
                    </Badge>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
