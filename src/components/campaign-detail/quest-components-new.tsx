// Quest components - Enhanced with NPC/PC involvement and organization links

import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
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
import { useCallback, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  addLocation,
  addNPC,
  addOrganization,
  addQuest,
  deleteQuest,
  updateQuest,
} from '@/features/campaigns/campaign-storage';
import { useAutoSave } from '@/hooks/use-auto-save';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
  QuestNPCInvolvement,
  SessionNote,
} from '@/lib/schemas/campaign';

import {
  EntityBadgeList,
  LocationPickerModal,
  NPCPickerModal,
  type NPCPickerResult,
  OrganizationPickerModal,
  RemovableBadge,
} from './entity-modals';

// =====================================================================================
// Constants
// =====================================================================================

const QUEST_TYPE_OPTIONS: Array<{
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

const QUEST_STATUS_OPTIONS: Array<{
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
    icon: Clock,
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

const QUEST_PRIORITY_OPTIONS: Array<{
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

type QuestTextFieldKey =
  | 'title'
  | 'description'
  | 'foreshadowing'
  | 'consequences'
  | 'notes';

type QuestObjective = CampaignQuest['objectives'][number];

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

  const handleAddQuest = async () => {
    onSaveStart();
    await addQuest(campaignId, {
      title: 'New Quest',
      type: 'side',
      status: 'available',
      priority: 'medium',
      description: '',
      objectives: [],
      rewards: [],
      foreshadowing: '',
      consequences: '',
      notes: '',
      npcsInvolved: [],
      charactersInvolved: [],
      locationIds: [],
      organizationIds: [],
      sessionIds: [],
      giver: '',
      location: '',
      relatedNpcs: [],
      relatedNpcsCustom: [],
      relatedLocations: [],
      relatedLocationsCustom: [],
      sessionAppearances: [],
      tags: [],
    });
    onQuestsChange();
  };

  const handleUpdateQuest = async (
    questId: string,
    updates: Partial<Omit<CampaignQuest, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    onSaveStart();
    await updateQuest(campaignId, questId, updates);
    onQuestsChange();
  };

  const handleDeleteQuest = async (questId: string) => {
    onSaveStart();
    await deleteQuest(campaignId, questId);
    onQuestsChange();
  };

  const handleCreateNPC = async (name: string): Promise<string> => {
    const newNpc = await addNPC(campaignId, {
      name,
      titleRole: '',
      description: '',
      personality: '',
      motivation: '',
      backgroundHistory: '',
      secrets: '',
      connections: [],
      locationIds: [],
      organizationIds: [],
      allyNpcIds: [],
      enemyNpcIds: [],
      allyOrganizationIds: [],
      enemyOrganizationIds: [],
      status: 'active',
      faction: '',
      notes: '',
      sessionAppearances: [],
      questAppearances: [],
      tags: [],
    });
    onNPCsChange?.();
    if (!newNpc) throw new Error('Failed to create NPC');
    return newNpc.id;
  };

  const handleCreateLocation = async (
    name: string,
    type: CampaignLocation['type']
  ): Promise<string> => {
    const newLoc = await addLocation(campaignId, {
      name,
      type,
      description: '',
      historyLore: '',
      secrets: '',
      currentState: '',
      connectedLocations: [],
      npcIds: [],
      npcsPresentCustom: [],
      organizationIds: [],
      questIds: [],
      questsAvailableCustom: [],
      sessionAppearances: [],
      pointsOfInterest: [],
      tags: [],
      notes: '',
    });
    onLocationsChange?.();
    if (!newLoc) throw new Error('Failed to create location');
    return newLoc.id;
  };

  const handleCreateOrganization = async (
    name: string,
    type: CampaignOrganization['type']
  ): Promise<string> => {
    const newOrg = await addOrganization(campaignId, {
      name,
      type,
      description: '',
      goalsObjectives: '',
      secrets: '',
      keyMemberIds: [],
      allyNpcIds: [],
      enemyNpcIds: [],
      allyOrganizationIds: [],
      enemyOrganizationIds: [],
      headquartersId: undefined,
      questIds: [],
      locationIds: [],
      sessionIds: [],
      tags: [],
      notes: '',
    });
    onOrganizationsChange?.();
    if (!newOrg) throw new Error('Failed to create organization');
    return newOrg.id;
  };

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
  ) => void;
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
  const [trackedId, setTrackedId] = useState(quest.id);
  const [localQuest, setLocalQuest] = useState(() => normalizeQuest(quest));
  const [baseQuest, setBaseQuest] = useState(() => normalizeQuest(quest));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newObjective, setNewObjective] = useState('');
  const [newReward, setNewReward] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Modal states
  const [showNPCPicker, setShowNPCPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showOrgPicker, setShowOrgPicker] = useState(false);
  const [editingNPCInvolvement, setEditingNPCInvolvement] =
    useState<QuestNPCInvolvement | null>(null);

  // Sync local state when prop changes (state-based pattern)
  if (trackedId !== quest.id) {
    setTrackedId(quest.id);
    setLocalQuest(normalizeQuest(quest));
    setBaseQuest(normalizeQuest(quest));
  }

  // Compute updates
  const getUpdates = useCallback(
    (current: CampaignQuest) => {
      const base = baseQuest;
      const updates: Partial<
        Omit<CampaignQuest, 'id' | 'createdAt' | 'updatedAt'>
      > = {};

      if (current.title !== base.title) updates.title = current.title;
      if (current.description !== base.description)
        updates.description = current.description;
      if (current.foreshadowing !== base.foreshadowing)
        updates.foreshadowing = current.foreshadowing;
      if (current.consequences !== base.consequences)
        updates.consequences = current.consequences;
      if (current.notes !== base.notes) updates.notes = current.notes;
      if (current.type !== base.type) updates.type = current.type;
      if (current.status !== base.status) updates.status = current.status;
      if (current.priority !== base.priority)
        updates.priority = current.priority;
      if (
        JSON.stringify(current.objectives) !== JSON.stringify(base.objectives)
      )
        updates.objectives = current.objectives;
      if (JSON.stringify(current.rewards) !== JSON.stringify(base.rewards))
        updates.rewards = current.rewards;
      if (
        JSON.stringify(current.npcsInvolved) !==
        JSON.stringify(base.npcsInvolved)
      )
        updates.npcsInvolved = current.npcsInvolved;
      if (
        JSON.stringify(current.locationIds) !== JSON.stringify(base.locationIds)
      )
        updates.locationIds = current.locationIds;
      if (
        JSON.stringify(current.organizationIds) !==
        JSON.stringify(base.organizationIds)
      )
        updates.organizationIds = current.organizationIds;
      if (JSON.stringify(current.tags) !== JSON.stringify(base.tags))
        updates.tags = current.tags;

      return updates;
    },
    [baseQuest]
  );

  const { scheduleAutoSave, flush } = useAutoSave({
    onSave: async (data: CampaignQuest) => {
      const updates = getUpdates(data);
      if (Object.keys(updates).length === 0) return;
      setBaseQuest(prev => ({ ...prev, ...updates }));
      await onUpdate(updates);
    },
    onSaveStart,
    onPendingChange,
  });

  const handleBlur = useCallback(() => {
    flush();
  }, [flush]);

  const handleTextChange = useCallback(
    (field: QuestTextFieldKey, value: string) => {
      setLocalQuest(current => {
        const updated = { ...current, [field]: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleTypeChange = useCallback(
    (value: CampaignQuest['type']) => {
      setLocalQuest(current => {
        const updated = { ...current, type: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleStatusChange = useCallback(
    (value: CampaignQuest['status']) => {
      setLocalQuest(current => {
        const updated = { ...current, status: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handlePriorityChange = useCallback(
    (value: CampaignQuest['priority']) => {
      setLocalQuest(current => {
        const updated = { ...current, priority: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Objective handlers
  const addObjective = useCallback(() => {
    const trimmed = newObjective.trim();
    if (!trimmed) return;
    setLocalQuest(current => {
      const newObj: QuestObjective = {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
      };
      const updated = {
        ...current,
        objectives: [...current.objectives, newObj],
      };
      scheduleAutoSave(updated);
      return updated;
    });
    setNewObjective('');
  }, [newObjective, scheduleAutoSave]);

  const toggleObjective = useCallback(
    (id: string) => {
      setLocalQuest(current => {
        const updated = {
          ...current,
          objectives: current.objectives.map(obj =>
            obj.id === id ? { ...obj, completed: !obj.completed } : obj
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const removeObjective = useCallback(
    (id: string) => {
      setLocalQuest(current => {
        const updated = {
          ...current,
          objectives: current.objectives.filter(obj => obj.id !== id),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Reward handlers
  const addReward = useCallback(() => {
    const trimmed = newReward.trim();
    if (!trimmed) return;
    const currentRewards = Array.isArray(localQuest.rewards)
      ? localQuest.rewards
      : [];
    setLocalQuest(current => {
      const updated = { ...current, rewards: [...currentRewards, trimmed] };
      scheduleAutoSave(updated);
      return updated;
    });
    setNewReward('');
  }, [newReward, localQuest.rewards, scheduleAutoSave]);

  const removeReward = useCallback(
    (reward: string) => {
      const currentRewards = Array.isArray(localQuest.rewards)
        ? localQuest.rewards
        : [];
      setLocalQuest(current => {
        const updated = {
          ...current,
          rewards: currentRewards.filter(r => r !== reward),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [localQuest.rewards, scheduleAutoSave]
  );

  // Tag handlers
  const addTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (!trimmed || localQuest.tags.includes(trimmed)) return;
    setLocalQuest(current => {
      const updated = { ...current, tags: [...current.tags, trimmed] };
      scheduleAutoSave(updated);
      return updated;
    });
    setTagInput('');
  }, [localQuest.tags, tagInput, scheduleAutoSave]);

  const removeTag = useCallback(
    (tag: string) => {
      setLocalQuest(current => {
        const updated = {
          ...current,
          tags: current.tags.filter(t => t !== tag),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // NPC Involvement handlers
  const handleAddNPC = useCallback(
    (result: NPCPickerResult) => {
      setLocalQuest(current => {
        if (current.npcsInvolved.some(inv => inv.npcId === result.npcId))
          return current;
        const newInvolvement: QuestNPCInvolvement = {
          id: crypto.randomUUID(),
          npcId: result.npcId,
          npcName: result.npcName,
          role: result.role ?? '',
          actionsTaken: result.actionsTaken ?? '',
          notes: result.notes ?? '',
          locationIds: result.locationIds ?? [],
          sessionIds: [],
        };
        const updated = {
          ...current,
          npcsInvolved: [...current.npcsInvolved, newInvolvement],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveNPC = useCallback(
    (npcId: string) => {
      setLocalQuest(current => {
        const updated = {
          ...current,
          npcsInvolved: current.npcsInvolved.filter(inv => inv.npcId !== npcId),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleUpdateNPCInvolvement = useCallback(
    (involvement: QuestNPCInvolvement) => {
      setLocalQuest(current => {
        const updated = {
          ...current,
          npcsInvolved: current.npcsInvolved.map(inv =>
            inv.npcId === involvement.npcId ? involvement : inv
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
      setEditingNPCInvolvement(null);
    },
    [scheduleAutoSave]
  );

  // Location handlers
  const handleAddLocation = useCallback(
    (locationId: string) => {
      setLocalQuest(current => {
        if ((current.locationIds ?? []).includes(locationId)) return current;
        const updated = {
          ...current,
          locationIds: [...(current.locationIds ?? []), locationId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveLocation = useCallback(
    (locationId: string) => {
      setLocalQuest(current => {
        const updated = {
          ...current,
          locationIds: (current.locationIds ?? []).filter(
            id => id !== locationId
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Organization handlers
  const handleAddOrganization = useCallback(
    (orgId: string) => {
      setLocalQuest(current => {
        if ((current.organizationIds ?? []).includes(orgId)) return current;
        const updated = {
          ...current,
          organizationIds: [...(current.organizationIds ?? []), orgId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveOrganization = useCallback(
    (orgId: string) => {
      setLocalQuest(current => {
        const updated = {
          ...current,
          organizationIds: (current.organizationIds ?? []).filter(
            id => id !== orgId
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Helper functions
  const getNpcName = (id: string) =>
    npcs.find(n => n.id === id)?.name ?? 'Unknown';
  const getLocationName = (id: string) =>
    locations.find(l => l.id === id)?.name ?? 'Unknown';
  const getOrgName = (id: string) =>
    organizations.find(o => o.id === id)?.name ?? 'Unknown';

  const completedCount = localQuest.objectives.filter(
    obj => obj.completed
  ).length;
  const totalCount = localQuest.objectives.length;

  const typeInfo = QUEST_TYPE_OPTIONS.find(t => t.value === localQuest.type);
  const statusInfo = QUEST_STATUS_OPTIONS.find(
    s => s.value === localQuest.status
  );
  const priorityInfo = QUEST_PRIORITY_OPTIONS.find(
    p => p.value === localQuest.priority
  );

  const rewards = Array.isArray(localQuest.rewards) ? localQuest.rewards : [];

  return (
    <>
      <Card className="overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <CardHeader className="bg-muted/30 py-3">
            <div className="flex items-center justify-between">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto flex-1 justify-start p-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${typeInfo?.color ?? 'bg-gray-500/20'}`}
                    >
                      <Target
                        className={`h-5 w-5 ${priorityInfo?.color ?? ''}`}
                      />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{localQuest.title}</span>
                        <Badge
                          variant="outline"
                          className={statusInfo?.color ?? ''}
                        >
                          {localQuest.status}
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
                        setShowDeleteConfirm(true);
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

          <CollapsibleContent>
            <CardContent className="space-y-6 pt-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <Scroll className="h-3 w-3 text-amber-500" />
                    Title
                  </Label>
                  <Input
                    value={localQuest.title}
                    onChange={e => handleTextChange('title', e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Quest title..."
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={localQuest.type}
                      onValueChange={value =>
                        handleTypeChange(value as CampaignQuest['type'])
                      }
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
                      value={localQuest.status}
                      onValueChange={value =>
                        handleStatusChange(value as CampaignQuest['status'])
                      }
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
                      value={localQuest.priority}
                      onValueChange={value =>
                        handlePriorityChange(value as CampaignQuest['priority'])
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
                  value={localQuest.description}
                  onChange={e =>
                    handleTextChange('description', e.target.value)
                  }
                  onBlur={handleBlur}
                  placeholder="What is this quest about?"
                  rows={3}
                />
              </div>

              <Separator />

              {/* Objectives */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Objectives ({completedCount}/{totalCount})
                </Label>
                {localQuest.objectives.length === 0 ? (
                  <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
                    No objectives added yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {localQuest.objectives.map(obj => (
                      <div
                        key={obj.id}
                        className="bg-muted/30 flex items-center gap-3 rounded-lg p-3"
                      >
                        <button
                          type="button"
                          onClick={() => toggleObjective(obj.id)}
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
                            obj.completed
                              ? 'text-muted-foreground line-through'
                              : ''
                          }
                        >
                          {obj.text}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive ml-auto h-7 w-7"
                          onClick={() => removeObjective(obj.id)}
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
                    onChange={e => setNewObjective(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addObjective();
                      }
                    }}
                    placeholder="Add objective..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={addObjective}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Rewards */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <Gift className="h-3 w-3 text-yellow-500" />
                  Rewards
                </Label>
                <div className="flex flex-wrap gap-2">
                  {rewards.length === 0 ? (
                    <p className="text-muted-foreground text-xs">
                      No rewards specified
                    </p>
                  ) : (
                    rewards.map(reward => (
                      <Badge key={reward} variant="secondary" className="gap-1">
                        <Gift className="h-3 w-3" />
                        {reward}
                        <button
                          type="button"
                          onClick={() => removeReward(reward)}
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
                    onChange={e => setNewReward(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addReward();
                      }
                    }}
                    placeholder="Add reward..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={addReward}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* NPCs Involved */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-blue-500" />
                    NPCs Involved
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNPCPicker(true)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add NPC
                  </Button>
                </div>

                {localQuest.npcsInvolved.length === 0 ? (
                  <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
                    No NPCs involved in this quest
                  </div>
                ) : (
                  <div className="grid gap-2 md:grid-cols-2">
                    {localQuest.npcsInvolved.map(inv => (
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
                                onClick={() => setEditingNPCInvolvement(inv)}
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive h-7 w-7"
                                onClick={() => handleRemoveNPC(inv.npcId)}
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

              {/* Locations */}
              <EntityBadgeList
                label="Related Locations"
                icon={<Map className="h-3 w-3" />}
                iconColor="text-green-500"
                emptyText="No locations linked"
                onAdd={() => setShowLocationPicker(true)}
                addLabel="Add Location"
              >
                {(localQuest.locationIds ?? []).map(id => (
                  <RemovableBadge
                    key={id}
                    icon={<Map className="h-3 w-3" />}
                    onRemove={() => handleRemoveLocation(id)}
                  >
                    {getLocationName(id)}
                  </RemovableBadge>
                ))}
              </EntityBadgeList>

              {/* Organizations */}
              <EntityBadgeList
                label="Organizations"
                icon={<Building2 className="h-3 w-3" />}
                iconColor="text-purple-500"
                emptyText="No organizations linked"
                onAdd={() => setShowOrgPicker(true)}
                addLabel="Add Organization"
              >
                {(localQuest.organizationIds ?? []).map(id => (
                  <RemovableBadge
                    key={id}
                    icon={<Building2 className="h-3 w-3" />}
                    onRemove={() => handleRemoveOrganization(id)}
                  >
                    {getOrgName(id)}
                  </RemovableBadge>
                ))}
              </EntityBadgeList>

              <Separator />

              {/* Story Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <Eye className="h-3 w-3 text-purple-500" />
                    Foreshadowing
                  </Label>
                  <Textarea
                    value={localQuest.foreshadowing}
                    onChange={e =>
                      handleTextChange('foreshadowing', e.target.value)
                    }
                    onBlur={handleBlur}
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
                    value={localQuest.consequences}
                    onChange={e =>
                      handleTextChange('consequences', e.target.value)
                    }
                    onBlur={handleBlur}
                    placeholder="What happens if they fail or succeed..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Session Appearances (Read-only) */}
              {(localQuest.sessionAppearances ?? []).length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3 text-blue-500" />
                    Session Appearances
                  </Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {(localQuest.sessionAppearances ?? []).map(appearance => {
                      const session = sessions.find(
                        s => s.id === appearance.sessionId
                      );
                      const sessionNPCs = session?.npcsInvolved ?? [];
                      const sessionLocationIds = session?.locationIds ?? [];
                      return (
                        <Card
                          key={appearance.sessionId}
                          className="bg-muted/20"
                        >
                          <CardContent className="p-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 flex-shrink-0 text-blue-500" />
                              <div className="min-w-0 flex-1 truncate text-sm font-medium">
                                S{appearance.sessionNumber}
                                {appearance.sessionTitle &&
                                  `: ${appearance.sessionTitle}`}
                              </div>
                            </div>
                            {/* NPCs and Locations inline */}
                            {(sessionNPCs.length > 0 ||
                              sessionLocationIds.length > 0) && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {sessionNPCs.map(npcInv => {
                                  const npc = npcs.find(
                                    n => n.id === npcInv.npcId
                                  );
                                  return (
                                    <Badge
                                      key={npcInv.id}
                                      variant="outline"
                                      className="gap-0.5 px-1 py-0 text-[10px]"
                                    >
                                      <User className="h-2 w-2" />
                                      {npc?.name ?? npcInv.npcName ?? 'Unknown'}
                                    </Badge>
                                  );
                                })}
                                {sessionLocationIds.map(locId => {
                                  const loc = locations.find(
                                    l => l.id === locId
                                  );
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
              )}

              <Separator />

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-xs">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {localQuest.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-muted ml-1 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{localQuest.title}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modals */}
      <NPCPickerModal
        open={showNPCPicker}
        onOpenChange={setShowNPCPicker}
        npcs={npcs}
        locations={locations}
        quests={[]}
        selectedNpcIds={localQuest.npcsInvolved.map(inv => inv.npcId)}
        onSelectNPC={handleAddNPC}
        onCreateNPC={onCreateNPC}
        title="Add NPC to Quest"
        description="Select an NPC involved in this quest"
        showInvolvementFields={true}
      />

      <LocationPickerModal
        open={showLocationPicker}
        onOpenChange={setShowLocationPicker}
        locations={locations}
        selectedLocationIds={localQuest.locationIds ?? []}
        onSelectLocation={handleAddLocation}
        onCreateLocation={onCreateLocation}
        title="Link Location to Quest"
        description="Select a location related to this quest"
      />

      <OrganizationPickerModal
        open={showOrgPicker}
        onOpenChange={setShowOrgPicker}
        organizations={organizations}
        selectedOrganizationIds={localQuest.organizationIds ?? []}
        onSelectOrganization={handleAddOrganization}
        onCreateOrganization={onCreateOrganization}
        title="Link Organization to Quest"
        description="Select an organization involved in this quest"
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
