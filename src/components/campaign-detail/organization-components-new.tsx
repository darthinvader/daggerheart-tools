// Organization components - Enhanced with consistent modal-based entity selection

import {
  Building2,
  Calendar,
  ChevronDown,
  Crown,
  Eye,
  Flag,
  Heart,
  Key,
  Map,
  Plus,
  Scroll,
  Shield,
  Swords,
  Target,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';
import { type ReactNode, useCallback, useState } from 'react';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  deleteOrganization,
  updateOrganization,
} from '@/features/campaigns/campaign-storage';
import { useAutoSave } from '@/hooks/use-auto-save';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
} from '@/lib/schemas/campaign';

import {
  EntityBadgeList,
  LocationPickerModal,
  NPCPickerModal,
  type NPCPickerResult,
  OrganizationPickerModal,
  QuestPickerModal,
  RemovableBadge,
} from './entity-modals';

// =====================================================================================
// Constants
// =====================================================================================

type OrganizationType = CampaignOrganization['type'];

const ORGANIZATION_TYPE_OPTIONS: Array<{
  value: OrganizationType;
  label: string;
  Icon: (props: { className?: string }) => ReactNode;
  color: string;
}> = [
  {
    value: 'guild',
    label: 'Guild',
    Icon: Building2,
    color: 'bg-blue-500/20 text-blue-600',
  },
  {
    value: 'faction',
    label: 'Faction',
    Icon: Flag,
    color: 'bg-red-500/20 text-red-600',
  },
  {
    value: 'government',
    label: 'Government',
    Icon: Crown,
    color: 'bg-purple-500/20 text-purple-600',
  },
  {
    value: 'religious',
    label: 'Religious',
    Icon: Eye,
    color: 'bg-amber-500/20 text-amber-600',
  },
  {
    value: 'criminal',
    label: 'Criminal',
    Icon: Swords,
    color: 'bg-slate-500/20 text-slate-600',
  },
  {
    value: 'mercenary',
    label: 'Mercenary',
    Icon: Shield,
    color: 'bg-orange-500/20 text-orange-600',
  },
  {
    value: 'merchant',
    label: 'Merchant',
    Icon: Building2,
    color: 'bg-emerald-500/20 text-emerald-600',
  },
  {
    value: 'secret',
    label: 'Secret Society',
    Icon: Key,
    color: 'bg-indigo-500/20 text-indigo-600',
  },
  {
    value: 'other',
    label: 'Other',
    Icon: Users,
    color: 'bg-gray-500/20 text-gray-600',
  },
];

// =====================================================================================
// Types
// =====================================================================================

interface EditableOrganizationsProps {
  organizations: CampaignOrganization[];
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  campaignId: string;
  onSaveStart: () => void;
  onPendingChange: () => void;
  onOrganizationsChange: () => void;
  onNPCsChange?: () => void;
  onLocationsChange?: () => void;
  onQuestsChange?: () => void;
}

type OrganizationTextFieldKey =
  | 'name'
  | 'description'
  | 'goalsObjectives'
  | 'secrets'
  | 'notes';

// =====================================================================================
// Main Component
// =====================================================================================

export function EditableOrganizations({
  organizations,
  npcs,
  locations,
  quests,
  campaignId,
  onSaveStart,
  onPendingChange,
  onOrganizationsChange,
  onNPCsChange,
  onLocationsChange,
  onQuestsChange,
}: EditableOrganizationsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<OrganizationType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrganizations = organizations
    .filter(org => (typeFilter ? org.type === typeFilter : true))
    .filter(org => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      return [org.name, org.type, org.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });

  const sortedOrganizations = [...filteredOrganizations].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleAddOrganization = async () => {
    onSaveStart();
    await addOrganization(campaignId, {
      name: 'New Organization',
      type: 'other',
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
    onOrganizationsChange();
  };

  const handleUpdateOrganization = async (
    organizationId: string,
    updates: Partial<
      Omit<CampaignOrganization, 'id' | 'createdAt' | 'updatedAt'>
    >
  ) => {
    onSaveStart();
    await updateOrganization(campaignId, organizationId, updates);
    onOrganizationsChange();
  };

  const handleDeleteOrganization = async (organizationId: string) => {
    onSaveStart();
    await deleteOrganization(campaignId, organizationId);
    onOrganizationsChange();
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

  const handleCreateQuest = async (
    title: string,
    type: CampaignQuest['type']
  ): Promise<string> => {
    const newQuest = await addQuest(campaignId, {
      title,
      type,
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
    onQuestsChange?.();
    if (!newQuest) throw new Error('Failed to create quest');
    return newQuest.id;
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
    onOrganizationsChange();
    if (!newOrg) throw new Error('Failed to create organization');
    return newOrg.id;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleAddOrganization} className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
        <div className="relative flex-1">
          <Input
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Search organizations..."
            className="pl-10"
          />
          <Building2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        </div>
        <Select
          value={typeFilter ?? 'all'}
          onValueChange={value =>
            setTypeFilter(value === 'all' ? null : (value as OrganizationType))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {ORGANIZATION_TYPE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {sortedOrganizations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Building2 className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="mb-2 font-medium">No organizations created yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Add guilds, factions, and groups that exist in your world
            </p>
            <Button onClick={handleAddOrganization} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add First Organization
            </Button>
          </CardContent>
        </Card>
      ) : (
        sortedOrganizations.map(organization => (
          <OrganizationCard
            key={organization.id}
            organization={organization}
            npcs={npcs}
            locations={locations}
            quests={quests}
            otherOrganizations={organizations.filter(
              o => o.id !== organization.id
            )}
            isExpanded={expandedId === organization.id}
            onToggle={() =>
              setExpandedId(
                expandedId === organization.id ? null : organization.id
              )
            }
            onUpdate={updates =>
              handleUpdateOrganization(organization.id, updates)
            }
            onDelete={() => handleDeleteOrganization(organization.id)}
            onCreateNPC={handleCreateNPC}
            onCreateLocation={handleCreateLocation}
            onCreateQuest={handleCreateQuest}
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
// Organization Card Component
// =====================================================================================

interface OrganizationCardProps {
  organization: CampaignOrganization;
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  otherOrganizations: CampaignOrganization[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<
      Omit<CampaignOrganization, 'id' | 'createdAt' | 'updatedAt'>
    >
  ) => void;
  onDelete: () => void;
  onCreateNPC: (name: string) => Promise<string>;
  onCreateLocation: (
    name: string,
    type: CampaignLocation['type']
  ) => Promise<string>;
  onCreateQuest: (
    title: string,
    type: CampaignQuest['type']
  ) => Promise<string>;
  onCreateOrganization: (
    name: string,
    type: CampaignOrganization['type']
  ) => Promise<string>;
  onSaveStart: () => void;
  onPendingChange: () => void;
}

function normalizeOrganization(
  org: CampaignOrganization
): CampaignOrganization {
  return {
    ...org,
    keyMemberIds: org.keyMemberIds ?? [],
    allyNpcIds: org.allyNpcIds ?? [],
    enemyNpcIds: org.enemyNpcIds ?? [],
    allyOrganizationIds: org.allyOrganizationIds ?? [],
    enemyOrganizationIds: org.enemyOrganizationIds ?? [],
    questIds: org.questIds ?? [],
    locationIds: org.locationIds ?? [],
    sessionIds: org.sessionIds ?? [],
    tags: org.tags ?? [],
  } as CampaignOrganization;
}

function OrganizationCard({
  organization,
  npcs,
  locations,
  quests,
  otherOrganizations,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  onCreateNPC,
  onCreateLocation,
  onCreateQuest,
  onCreateOrganization,
  onSaveStart,
  onPendingChange,
}: OrganizationCardProps) {
  const [trackedId, setTrackedId] = useState(organization.id);
  const [localOrg, setLocalOrg] = useState(() =>
    normalizeOrganization(organization)
  );
  const [baseOrg, setBaseOrg] = useState(() =>
    normalizeOrganization(organization)
  );
  const [tagInput, setTagInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Modal states
  const [showKeyMembersPicker, setShowKeyMembersPicker] = useState(false);
  const [showAllyNpcsPicker, setShowAllyNpcsPicker] = useState(false);
  const [showEnemyNpcsPicker, setShowEnemyNpcsPicker] = useState(false);
  const [showAllyOrgsPicker, setShowAllyOrgsPicker] = useState(false);
  const [showEnemyOrgsPicker, setShowEnemyOrgsPicker] = useState(false);
  const [showLocationsPicker, setShowLocationsPicker] = useState(false);
  const [showQuestsPicker, setShowQuestsPicker] = useState(false);
  const [showHQPicker, setShowHQPicker] = useState(false);

  // Sync local state when prop changes (state-based pattern)
  if (trackedId !== organization.id) {
    setTrackedId(organization.id);
    setLocalOrg(normalizeOrganization(organization));
    setBaseOrg(normalizeOrganization(organization));
  }

  // Compute updates
  const getUpdates = useCallback(
    (current: CampaignOrganization) => {
      const base = baseOrg;
      const updates: Partial<
        Omit<CampaignOrganization, 'id' | 'createdAt' | 'updatedAt'>
      > = {};

      if (current.name !== base.name) updates.name = current.name;
      if (current.description !== base.description)
        updates.description = current.description;
      if (current.goalsObjectives !== base.goalsObjectives)
        updates.goalsObjectives = current.goalsObjectives;
      if (current.secrets !== base.secrets) updates.secrets = current.secrets;
      if (current.notes !== base.notes) updates.notes = current.notes;
      if (current.type !== base.type) updates.type = current.type;
      if (current.headquartersId !== base.headquartersId)
        updates.headquartersId = current.headquartersId;
      if (JSON.stringify(current.tags) !== JSON.stringify(base.tags))
        updates.tags = current.tags;
      if (
        JSON.stringify(current.keyMemberIds) !==
        JSON.stringify(base.keyMemberIds)
      )
        updates.keyMemberIds = current.keyMemberIds;
      if (
        JSON.stringify(current.allyNpcIds) !== JSON.stringify(base.allyNpcIds)
      )
        updates.allyNpcIds = current.allyNpcIds;
      if (
        JSON.stringify(current.enemyNpcIds) !== JSON.stringify(base.enemyNpcIds)
      )
        updates.enemyNpcIds = current.enemyNpcIds;
      if (
        JSON.stringify(current.allyOrganizationIds) !==
        JSON.stringify(base.allyOrganizationIds)
      )
        updates.allyOrganizationIds = current.allyOrganizationIds;
      if (
        JSON.stringify(current.enemyOrganizationIds) !==
        JSON.stringify(base.enemyOrganizationIds)
      )
        updates.enemyOrganizationIds = current.enemyOrganizationIds;
      if (
        JSON.stringify(current.locationIds) !== JSON.stringify(base.locationIds)
      )
        updates.locationIds = current.locationIds;
      if (JSON.stringify(current.questIds) !== JSON.stringify(base.questIds))
        updates.questIds = current.questIds;

      return updates;
    },
    [baseOrg]
  );

  const { scheduleAutoSave, flush } = useAutoSave({
    onSave: async (data: CampaignOrganization) => {
      const updates = getUpdates(data);
      if (Object.keys(updates).length === 0) return;
      setBaseOrg(prev => ({ ...prev, ...updates }));
      await onUpdate(updates);
    },
    onSaveStart,
    onPendingChange,
  });

  const handleBlur = useCallback(() => {
    flush();
  }, [flush]);

  const handleTextChange = useCallback(
    (field: OrganizationTextFieldKey, value: string) => {
      setLocalOrg(current => {
        const updated = { ...current, [field]: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleTypeChange = useCallback(
    (value: OrganizationType) => {
      setLocalOrg(current => {
        const updated = { ...current, type: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Tag handlers
  const addTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (!trimmed || localOrg.tags.includes(trimmed)) return;
    setLocalOrg(current => {
      const updated = { ...current, tags: [...current.tags, trimmed] };
      scheduleAutoSave(updated);
      return updated;
    });
    setTagInput('');
  }, [localOrg.tags, tagInput, scheduleAutoSave]);

  const removeTag = useCallback(
    (tag: string) => {
      setLocalOrg(current => {
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

  // Key Members handlers
  const handleAddKeyMember = useCallback(
    (result: NPCPickerResult) => {
      setLocalOrg(current => {
        if (current.keyMemberIds.includes(result.npcId)) return current;
        const updated = {
          ...current,
          keyMemberIds: [...current.keyMemberIds, result.npcId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveKeyMember = useCallback(
    (npcId: string) => {
      setLocalOrg(current => {
        const updated = {
          ...current,
          keyMemberIds: current.keyMemberIds.filter(id => id !== npcId),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Ally NPCs handlers
  const handleAddAllyNpc = useCallback(
    (result: NPCPickerResult) => {
      setLocalOrg(current => {
        if (current.allyNpcIds.includes(result.npcId)) return current;
        const updated = {
          ...current,
          allyNpcIds: [...current.allyNpcIds, result.npcId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveAllyNpc = useCallback(
    (npcId: string) => {
      setLocalOrg(current => {
        const updated = {
          ...current,
          allyNpcIds: current.allyNpcIds.filter(id => id !== npcId),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Enemy NPCs handlers
  const handleAddEnemyNpc = useCallback(
    (result: NPCPickerResult) => {
      setLocalOrg(current => {
        if (current.enemyNpcIds.includes(result.npcId)) return current;
        const updated = {
          ...current,
          enemyNpcIds: [...current.enemyNpcIds, result.npcId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveEnemyNpc = useCallback(
    (npcId: string) => {
      setLocalOrg(current => {
        const updated = {
          ...current,
          enemyNpcIds: current.enemyNpcIds.filter(id => id !== npcId),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Ally Organizations handlers
  const handleAddAllyOrg = useCallback(
    (orgId: string) => {
      setLocalOrg(current => {
        if (current.allyOrganizationIds.includes(orgId)) return current;
        const updated = {
          ...current,
          allyOrganizationIds: [...current.allyOrganizationIds, orgId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveAllyOrg = useCallback(
    (orgId: string) => {
      setLocalOrg(current => {
        const updated = {
          ...current,
          allyOrganizationIds: current.allyOrganizationIds.filter(
            id => id !== orgId
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Enemy Organizations handlers
  const handleAddEnemyOrg = useCallback(
    (orgId: string) => {
      setLocalOrg(current => {
        if (current.enemyOrganizationIds.includes(orgId)) return current;
        const updated = {
          ...current,
          enemyOrganizationIds: [...current.enemyOrganizationIds, orgId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveEnemyOrg = useCallback(
    (orgId: string) => {
      setLocalOrg(current => {
        const updated = {
          ...current,
          enemyOrganizationIds: current.enemyOrganizationIds.filter(
            id => id !== orgId
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Location handlers
  const handleAddLocation = useCallback(
    (locationId: string) => {
      setLocalOrg(current => {
        if (current.locationIds.includes(locationId)) return current;
        const updated = {
          ...current,
          locationIds: [...current.locationIds, locationId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveLocation = useCallback(
    (locationId: string) => {
      setLocalOrg(current => {
        const updated = {
          ...current,
          locationIds: current.locationIds.filter(id => id !== locationId),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Quest handlers
  const handleAddQuest = useCallback(
    (questId: string) => {
      setLocalOrg(current => {
        if (current.questIds.includes(questId)) return current;
        const updated = {
          ...current,
          questIds: [...current.questIds, questId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveQuest = useCallback(
    (questId: string) => {
      setLocalOrg(current => {
        const updated = {
          ...current,
          questIds: current.questIds.filter(id => id !== questId),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Headquarters handler
  const handleSetHeadquarters = useCallback(
    (locationId: string) => {
      setLocalOrg(current => {
        const updated = { ...current, headquartersId: locationId };
        scheduleAutoSave(updated);
        return updated;
      });
      setShowHQPicker(false);
    },
    [scheduleAutoSave]
  );

  const handleClearHeadquarters = useCallback(() => {
    setLocalOrg(current => {
      const updated = { ...current, headquartersId: undefined };
      scheduleAutoSave(updated);
      return updated;
    });
  }, [scheduleAutoSave]);

  // Helper functions
  const getNpcName = (id: string) =>
    npcs.find(n => n.id === id)?.name ?? 'Unknown';
  const getLocationName = (id: string) =>
    locations.find(l => l.id === id)?.name ?? 'Unknown';
  const getQuestTitle = (id: string) =>
    quests.find(q => q.id === id)?.title ?? 'Unknown';
  const getOrgName = (id: string) =>
    otherOrganizations.find(o => o.id === id)?.name ?? 'Unknown';

  const typeInfo = ORGANIZATION_TYPE_OPTIONS.find(
    t => t.value === localOrg.type
  );
  const TypeIcon = typeInfo?.Icon ?? Building2;

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
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{localOrg.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {typeInfo?.label ?? 'Organization'}
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
                  <TooltipContent>Delete Organization</TooltipContent>
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
                    <Building2 className="h-3 w-3 text-blue-500" />
                    Name
                  </Label>
                  <Input
                    value={localOrg.name}
                    onChange={e => handleTextChange('name', e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Organization name..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={localOrg.type}
                    onValueChange={value =>
                      handleTypeChange(value as OrganizationType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORGANIZATION_TYPE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.Icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={localOrg.description}
                  onChange={e =>
                    handleTextChange('description', e.target.value)
                  }
                  onBlur={handleBlur}
                  placeholder="What is this organization about?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <Target className="h-3 w-3 text-amber-500" />
                  Goals & Objectives
                </Label>
                <Textarea
                  value={localOrg.goalsObjectives}
                  onChange={e =>
                    handleTextChange('goalsObjectives', e.target.value)
                  }
                  onBlur={handleBlur}
                  placeholder="What does this organization want to achieve?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <Key className="h-3 w-3 text-purple-500" />
                  Secrets (GM Only)
                </Label>
                <Textarea
                  value={localOrg.secrets}
                  onChange={e => handleTextChange('secrets', e.target.value)}
                  onBlur={handleBlur}
                  placeholder="Hidden information about this organization..."
                  rows={2}
                />
              </div>

              <Separator />

              {/* Key Members */}
              <EntityBadgeList
                label="Key Members"
                icon={<Crown className="h-3 w-3" />}
                iconColor="text-yellow-500"
                emptyText="No key members assigned"
                onAdd={() => setShowKeyMembersPicker(true)}
                addLabel="Add Member"
              >
                {localOrg.keyMemberIds.map(id => (
                  <RemovableBadge
                    key={id}
                    icon={<User className="h-3 w-3" />}
                    onRemove={() => handleRemoveKeyMember(id)}
                  >
                    {getNpcName(id)}
                  </RemovableBadge>
                ))}
              </EntityBadgeList>

              {/* Headquarters */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <Map className="h-3 w-3 text-green-500" />
                  Headquarters
                </Label>
                {localOrg.headquartersId ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Map className="h-3 w-3" />
                      {getLocationName(localOrg.headquartersId)}
                      <button
                        type="button"
                        onClick={handleClearHeadquarters}
                        className="hover:bg-muted ml-1 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHQPicker(true)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Set Headquarters
                  </Button>
                )}
              </div>

              {/* Locations */}
              <EntityBadgeList
                label="Other Locations"
                icon={<Map className="h-3 w-3" />}
                iconColor="text-emerald-500"
                emptyText="No locations linked"
                onAdd={() => setShowLocationsPicker(true)}
                addLabel="Add Location"
              >
                {localOrg.locationIds.map(id => (
                  <RemovableBadge
                    key={id}
                    icon={<Map className="h-3 w-3" />}
                    onRemove={() => handleRemoveLocation(id)}
                  >
                    {getLocationName(id)}
                  </RemovableBadge>
                ))}
              </EntityBadgeList>

              {/* Quests */}
              <EntityBadgeList
                label="Related Quests"
                icon={<Scroll className="h-3 w-3" />}
                iconColor="text-amber-500"
                emptyText="No quests linked"
                onAdd={() => setShowQuestsPicker(true)}
                addLabel="Add Quest"
              >
                {localOrg.questIds.map(id => (
                  <RemovableBadge
                    key={id}
                    icon={<Scroll className="h-3 w-3" />}
                    onRemove={() => handleRemoveQuest(id)}
                  >
                    {getQuestTitle(id)}
                  </RemovableBadge>
                ))}
              </EntityBadgeList>

              <Separator />

              {/* Relationships - Allies */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Heart className="h-4 w-4 text-green-500" />
                  Allies
                </Label>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Allied NPCs */}
                  <EntityBadgeList
                    label="Allied NPCs"
                    icon={<User className="h-3 w-3" />}
                    iconColor="text-green-500"
                    emptyText="No allied NPCs"
                    onAdd={() => setShowAllyNpcsPicker(true)}
                    addLabel="Add Ally"
                  >
                    {localOrg.allyNpcIds.map(id => (
                      <RemovableBadge
                        key={id}
                        icon={<User className="h-3 w-3" />}
                        onRemove={() => handleRemoveAllyNpc(id)}
                        className="bg-green-500/10"
                      >
                        {getNpcName(id)}
                      </RemovableBadge>
                    ))}
                  </EntityBadgeList>

                  {/* Allied Organizations */}
                  <EntityBadgeList
                    label="Allied Organizations"
                    icon={<Building2 className="h-3 w-3" />}
                    iconColor="text-green-500"
                    emptyText="No allied organizations"
                    onAdd={() => setShowAllyOrgsPicker(true)}
                    addLabel="Add Ally"
                  >
                    {localOrg.allyOrganizationIds.map(id => (
                      <RemovableBadge
                        key={id}
                        icon={<Building2 className="h-3 w-3" />}
                        onRemove={() => handleRemoveAllyOrg(id)}
                        className="bg-green-500/10"
                      >
                        {getOrgName(id)}
                      </RemovableBadge>
                    ))}
                  </EntityBadgeList>
                </div>
              </div>

              {/* Relationships - Enemies */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Swords className="h-4 w-4 text-red-500" />
                  Enemies
                </Label>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Enemy NPCs */}
                  <EntityBadgeList
                    label="Enemy NPCs"
                    icon={<User className="h-3 w-3" />}
                    iconColor="text-red-500"
                    emptyText="No enemy NPCs"
                    onAdd={() => setShowEnemyNpcsPicker(true)}
                    addLabel="Add Enemy"
                  >
                    {localOrg.enemyNpcIds.map(id => (
                      <RemovableBadge
                        key={id}
                        icon={<User className="h-3 w-3" />}
                        onRemove={() => handleRemoveEnemyNpc(id)}
                        className="bg-red-500/10"
                      >
                        {getNpcName(id)}
                      </RemovableBadge>
                    ))}
                  </EntityBadgeList>

                  {/* Enemy Organizations */}
                  <EntityBadgeList
                    label="Enemy Organizations"
                    icon={<Building2 className="h-3 w-3" />}
                    iconColor="text-red-500"
                    emptyText="No enemy organizations"
                    onAdd={() => setShowEnemyOrgsPicker(true)}
                    addLabel="Add Enemy"
                  >
                    {localOrg.enemyOrganizationIds.map(id => (
                      <RemovableBadge
                        key={id}
                        icon={<Building2 className="h-3 w-3" />}
                        onRemove={() => handleRemoveEnemyOrg(id)}
                        className="bg-red-500/10"
                      >
                        {getOrgName(id)}
                      </RemovableBadge>
                    ))}
                  </EntityBadgeList>
                </div>
              </div>

              {/* Session Appearances (Read-only) */}
              {(localOrg.sessionIds ?? []).length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3 text-blue-500" />
                    Session Appearances
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {localOrg.sessionIds.length} session
                      {localOrg.sessionIds.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    This organization appears in sessions where it was linked.
                  </p>
                </div>
              )}

              <Separator />

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-xs">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {localOrg.tags.map(tag => (
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
                  value={localOrg.notes}
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
            <AlertDialogTitle>Delete Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{localOrg.name}"? This action
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
        open={showKeyMembersPicker}
        onOpenChange={setShowKeyMembersPicker}
        npcs={npcs}
        locations={[]}
        quests={[]}
        selectedNpcIds={localOrg.keyMemberIds}
        onSelectNPC={handleAddKeyMember}
        onCreateNPC={onCreateNPC}
        title="Add Key Member"
        description="Select an NPC who is a key member of this organization"
        showInvolvementFields={false}
      />

      <NPCPickerModal
        open={showAllyNpcsPicker}
        onOpenChange={setShowAllyNpcsPicker}
        npcs={npcs}
        locations={[]}
        quests={[]}
        selectedNpcIds={localOrg.allyNpcIds}
        onSelectNPC={handleAddAllyNpc}
        onCreateNPC={onCreateNPC}
        title="Add Allied NPC"
        description="Select an NPC who is an ally of this organization"
        showInvolvementFields={false}
      />

      <NPCPickerModal
        open={showEnemyNpcsPicker}
        onOpenChange={setShowEnemyNpcsPicker}
        npcs={npcs}
        locations={[]}
        quests={[]}
        selectedNpcIds={localOrg.enemyNpcIds}
        onSelectNPC={handleAddEnemyNpc}
        onCreateNPC={onCreateNPC}
        title="Add Enemy NPC"
        description="Select an NPC who is an enemy of this organization"
        showInvolvementFields={false}
      />

      <OrganizationPickerModal
        open={showAllyOrgsPicker}
        onOpenChange={setShowAllyOrgsPicker}
        organizations={otherOrganizations}
        selectedOrganizationIds={localOrg.allyOrganizationIds}
        onSelectOrganization={handleAddAllyOrg}
        onCreateOrganization={onCreateOrganization}
        title="Add Allied Organization"
        description="Select an organization that is allied with this one"
      />

      <OrganizationPickerModal
        open={showEnemyOrgsPicker}
        onOpenChange={setShowEnemyOrgsPicker}
        organizations={otherOrganizations}
        selectedOrganizationIds={localOrg.enemyOrganizationIds}
        onSelectOrganization={handleAddEnemyOrg}
        onCreateOrganization={onCreateOrganization}
        title="Add Enemy Organization"
        description="Select an organization that is an enemy of this one"
      />

      <LocationPickerModal
        open={showLocationsPicker}
        onOpenChange={setShowLocationsPicker}
        locations={locations}
        selectedLocationIds={localOrg.locationIds}
        onSelectLocation={handleAddLocation}
        onCreateLocation={onCreateLocation}
        title="Link Location"
        description="Select a location associated with this organization"
      />

      <LocationPickerModal
        open={showHQPicker}
        onOpenChange={setShowHQPicker}
        locations={locations}
        selectedLocationIds={
          localOrg.headquartersId ? [localOrg.headquartersId] : []
        }
        onSelectLocation={handleSetHeadquarters}
        onCreateLocation={onCreateLocation}
        title="Set Headquarters"
        description="Select the headquarters location for this organization"
      />

      <QuestPickerModal
        open={showQuestsPicker}
        onOpenChange={setShowQuestsPicker}
        quests={quests}
        selectedQuestIds={localOrg.questIds}
        onSelectQuest={handleAddQuest}
        onCreateQuest={onCreateQuest}
        title="Link Quest"
        description="Select a quest related to this organization"
      />
    </>
  );
}
