// NPC components - Enhanced with organization links and ally/enemy relationships

import {
  Brain,
  Building2,
  Calendar,
  ChevronDown,
  FileText,
  Heart,
  Key,
  Map,
  Plus,
  Scroll,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trash2,
  User,
  Users,
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
  deleteNPC,
  updateNPC,
} from '@/features/campaigns/campaign-storage';
import { useAutoSave } from '@/hooks/use-auto-save';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
  SessionNote,
} from '@/lib/schemas/campaign';

import {
  EntityBadgeList,
  LocationPickerModal,
  NPCPickerModal,
  OrganizationPickerModal,
  RemovableBadge,
} from './entity-modals';

// =====================================================================================
// Status Options with Colors
// =====================================================================================

const NPC_STATUS_OPTIONS = [
  {
    value: 'active',
    label: 'Active',
    color: 'bg-green-500/20 text-green-700 dark:text-green-400',
  },
  {
    value: 'deceased',
    label: 'Deceased',
    color: 'bg-red-500/20 text-red-700 dark:text-red-400',
  },
  {
    value: 'missing',
    label: 'Missing',
    color: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  },
  {
    value: 'retired',
    label: 'Retired',
    color: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
  },
] as const;

// =====================================================================================
// Types
// =====================================================================================

interface EditableNPCsProps {
  npcs: CampaignNPC[];
  quests: CampaignQuest[];
  sessions: SessionNote[];
  locations: CampaignLocation[];
  organizations: CampaignOrganization[];
  campaignId: string;
  onSaveStart: () => void;
  onPendingChange: () => void;
  onNPCsChange: () => void;
  onLocationsChange?: () => void;
  onOrganizationsChange?: () => void;
}

type NPCTextFieldKey =
  | 'name'
  | 'titleRole'
  | 'faction'
  | 'description'
  | 'personality'
  | 'motivation'
  | 'backgroundHistory'
  | 'secrets'
  | 'notes';

// =====================================================================================
// Main Component
// =====================================================================================

export function EditableNPCs({
  npcs,
  quests,
  sessions,
  locations,
  organizations,
  campaignId,
  onSaveStart,
  onPendingChange,
  onNPCsChange,
  onLocationsChange,
  onOrganizationsChange,
}: EditableNPCsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const allTags = [...new Set(npcs.flatMap(npc => npc.tags))].sort();

  const filteredNPCs = npcs
    .filter(npc => (tagFilter ? npc.tags.includes(tagFilter) : true))
    .filter(npc => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      return [npc.name, npc.titleRole, npc.faction, npc.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });

  const sortedNPCs = [...filteredNPCs].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleAddNPC = async () => {
    onSaveStart();
    await addNPC(campaignId, {
      name: 'New Character',
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
    onNPCsChange();
  };

  const handleUpdateNPC = async (
    npcId: string,
    updates: Partial<Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    onSaveStart();
    await updateNPC(campaignId, npcId, updates);
    onNPCsChange();
  };

  const handleDeleteNPC = async (npcId: string) => {
    onSaveStart();
    await deleteNPC(campaignId, npcId);
    onNPCsChange();
  };

  const handleCreateLocation = async (
    name: string,
    type: CampaignLocation['type']
  ): Promise<string> => {
    const newLocation = await addLocation(campaignId, {
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
    if (!newLocation) throw new Error('Failed to create location');
    return newLocation.id;
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

  const handleCreateNPCWithName = async (name: string): Promise<string> => {
    onSaveStart();
    const newNPC = await addNPC(campaignId, {
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
    onNPCsChange();
    if (!newNPC) throw new Error('Failed to create NPC');
    return newNPC.id;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleAddNPC} className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Character
        </Button>
        <div className="relative flex-1">
          <Input
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Search characters..."
            className="pl-10"
          />
          <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        </div>
        {allTags.length > 0 && (
          <Select
            value={tagFilter ?? 'all'}
            onValueChange={v => setTagFilter(v === 'all' ? null : v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {sortedNPCs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <User className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="mb-2 font-medium">No characters created yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Add NPCs, villains, and allies to track in your campaign
            </p>
            <Button onClick={handleAddNPC} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add First Character
            </Button>
          </CardContent>
        </Card>
      ) : (
        sortedNPCs.map(npc => (
          <NPCCard
            key={npc.id}
            npc={npc}
            allNPCs={npcs}
            quests={quests}
            sessions={sessions}
            locations={locations}
            organizations={organizations}
            isExpanded={expandedId === npc.id}
            onToggle={() =>
              setExpandedId(expandedId === npc.id ? null : npc.id)
            }
            onUpdate={updates => handleUpdateNPC(npc.id, updates)}
            onDelete={() => handleDeleteNPC(npc.id)}
            onCreateNPC={handleCreateNPCWithName}
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
// NPC Card Component
// =====================================================================================

interface NPCCardProps {
  npc: CampaignNPC;
  allNPCs: CampaignNPC[];
  quests: CampaignQuest[];
  sessions: SessionNote[];
  locations: CampaignLocation[];
  organizations: CampaignOrganization[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>>
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

function normalizeNPC(npc: CampaignNPC): CampaignNPC {
  return {
    ...npc,
    titleRole: npc.titleRole ?? '',
    backgroundHistory: npc.backgroundHistory ?? '',
    locationIds: npc.locationIds ?? [],
    organizationIds: npc.organizationIds ?? [],
    allyNpcIds: npc.allyNpcIds ?? [],
    enemyNpcIds: npc.enemyNpcIds ?? [],
    allyOrganizationIds: npc.allyOrganizationIds ?? [],
    enemyOrganizationIds: npc.enemyOrganizationIds ?? [],
    tags: npc.tags ?? [],
    sessionAppearances: npc.sessionAppearances ?? [],
    questAppearances: npc.questAppearances ?? [],
  };
}

function NPCCard({
  npc,
  allNPCs,
  quests,
  sessions,
  locations,
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
}: NPCCardProps) {
  const [trackedId, setTrackedId] = useState(npc.id);
  const [localNPC, setLocalNPC] = useState(() => normalizeNPC(npc));
  const [baseNPC, setBaseNPC] = useState(() => normalizeNPC(npc));
  const [tagInput, setTagInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Modal states
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showOrgPicker, setShowOrgPicker] = useState(false);
  const [showAllyNPCPicker, setShowAllyNPCPicker] = useState(false);
  const [showEnemyNPCPicker, setShowEnemyNPCPicker] = useState(false);
  const [showAllyOrgPicker, setShowAllyOrgPicker] = useState(false);
  const [showEnemyOrgPicker, setShowEnemyOrgPicker] = useState(false);

  // Sync local state when prop changes (state-based pattern)
  if (trackedId !== npc.id) {
    setTrackedId(npc.id);
    setLocalNPC(normalizeNPC(npc));
    setBaseNPC(normalizeNPC(npc));
  }

  // Compute updates
  const getUpdates = useCallback(
    (current: CampaignNPC) => {
      const base = baseNPC;
      const updates: Partial<
        Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>
      > = {};

      if (current.name !== base.name) updates.name = current.name;
      if (current.titleRole !== base.titleRole)
        updates.titleRole = current.titleRole;
      if (current.faction !== base.faction) updates.faction = current.faction;
      if (current.description !== base.description)
        updates.description = current.description;
      if (current.personality !== base.personality)
        updates.personality = current.personality;
      if (current.motivation !== base.motivation)
        updates.motivation = current.motivation;
      if (current.backgroundHistory !== base.backgroundHistory)
        updates.backgroundHistory = current.backgroundHistory;
      if (current.secrets !== base.secrets) updates.secrets = current.secrets;
      if (current.notes !== base.notes) updates.notes = current.notes;
      if (current.status !== base.status) updates.status = current.status;
      if (JSON.stringify(current.tags) !== JSON.stringify(base.tags))
        updates.tags = current.tags;
      if (
        JSON.stringify(current.locationIds) !== JSON.stringify(base.locationIds)
      )
        updates.locationIds = current.locationIds;
      if (
        JSON.stringify(current.organizationIds) !==
        JSON.stringify(base.organizationIds)
      )
        updates.organizationIds = current.organizationIds;
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

      return updates;
    },
    [baseNPC]
  );

  const { scheduleAutoSave, flush } = useAutoSave({
    onSave: async (data: CampaignNPC) => {
      const updates = getUpdates(data);
      if (Object.keys(updates).length === 0) return;
      setBaseNPC(prev => ({ ...prev, ...updates }));
      await onUpdate(updates);
    },
    onSaveStart,
    onPendingChange,
  });

  const handleBlur = useCallback(() => {
    flush();
  }, [flush]);

  const handleTextChange = useCallback(
    (field: NPCTextFieldKey, value: string) => {
      setLocalNPC(current => {
        const updated = { ...current, [field]: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleStatusChange = useCallback(
    (value: CampaignNPC['status']) => {
      setLocalNPC(current => {
        const updated = { ...current, status: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Tag handlers
  const addTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (!trimmed || localNPC.tags.includes(trimmed)) return;
    setLocalNPC(current => {
      const updated = { ...current, tags: [...current.tags, trimmed] };
      scheduleAutoSave(updated);
      return updated;
    });
    setTagInput('');
  }, [localNPC.tags, tagInput, scheduleAutoSave]);

  const removeTag = useCallback(
    (tag: string) => {
      setLocalNPC(current => {
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

  // Location handlers
  const handleAddLocation = useCallback(
    (locationId: string) => {
      setLocalNPC(current => {
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
      setLocalNPC(current => {
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
      setLocalNPC(current => {
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
      setLocalNPC(current => {
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

  // Ally/Enemy NPC handlers
  const toggleAllyNpc = useCallback(
    (npcId: string) => {
      setLocalNPC(current => {
        const allyIds = current.allyNpcIds ?? [];
        const newAllyIds = allyIds.includes(npcId)
          ? allyIds.filter(id => id !== npcId)
          : [...allyIds, npcId];
        const updated = { ...current, allyNpcIds: newAllyIds };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const toggleEnemyNpc = useCallback(
    (npcId: string) => {
      setLocalNPC(current => {
        const enemyIds = current.enemyNpcIds ?? [];
        const newEnemyIds = enemyIds.includes(npcId)
          ? enemyIds.filter(id => id !== npcId)
          : [...enemyIds, npcId];
        const updated = { ...current, enemyNpcIds: newEnemyIds };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Ally/Enemy Organization handlers
  const toggleAllyOrg = useCallback(
    (orgId: string) => {
      setLocalNPC(current => {
        const allyIds = current.allyOrganizationIds ?? [];
        const newAllyIds = allyIds.includes(orgId)
          ? allyIds.filter(id => id !== orgId)
          : [...allyIds, orgId];
        const updated = { ...current, allyOrganizationIds: newAllyIds };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const toggleEnemyOrg = useCallback(
    (orgId: string) => {
      setLocalNPC(current => {
        const enemyIds = current.enemyOrganizationIds ?? [];
        const newEnemyIds = enemyIds.includes(orgId)
          ? enemyIds.filter(id => id !== orgId)
          : [...enemyIds, orgId];
        const updated = { ...current, enemyOrganizationIds: newEnemyIds };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Handlers for adding new NPCs as allies/enemies via picker modal
  const handleAddAllyNPC = useCallback(
    (result: { npcId: string }) => {
      const npcId = result.npcId;
      setLocalNPC(current => {
        const allyIds = current.allyNpcIds ?? [];
        if (allyIds.includes(npcId)) return current;
        const updated = { ...current, allyNpcIds: [...allyIds, npcId] };
        scheduleAutoSave(updated);
        return updated;
      });
      setShowAllyNPCPicker(false);
    },
    [scheduleAutoSave]
  );

  const handleAddEnemyNPC = useCallback(
    (result: { npcId: string }) => {
      const npcId = result.npcId;
      setLocalNPC(current => {
        const enemyIds = current.enemyNpcIds ?? [];
        if (enemyIds.includes(npcId)) return current;
        const updated = { ...current, enemyNpcIds: [...enemyIds, npcId] };
        scheduleAutoSave(updated);
        return updated;
      });
      setShowEnemyNPCPicker(false);
    },
    [scheduleAutoSave]
  );

  const handleAddAllyOrg = useCallback(
    (orgId: string) => {
      setLocalNPC(current => {
        const allyIds = current.allyOrganizationIds ?? [];
        if (allyIds.includes(orgId)) return current;
        const updated = {
          ...current,
          allyOrganizationIds: [...allyIds, orgId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
      setShowAllyOrgPicker(false);
    },
    [scheduleAutoSave]
  );

  const handleAddEnemyOrg = useCallback(
    (orgId: string) => {
      setLocalNPC(current => {
        const enemyIds = current.enemyOrganizationIds ?? [];
        if (enemyIds.includes(orgId)) return current;
        const updated = {
          ...current,
          enemyOrganizationIds: [...enemyIds, orgId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
      setShowEnemyOrgPicker(false);
    },
    [scheduleAutoSave]
  );

  // Get entity names for display
  const getLocationName = (id: string) =>
    locations.find(l => l.id === id)?.name ?? 'Unknown';
  const getOrgName = (id: string) =>
    organizations.find(o => o.id === id)?.name ?? 'Unknown';

  const otherNPCs = allNPCs.filter(n => n.id !== npc.id);
  const statusInfo = NPC_STATUS_OPTIONS.find(s => s.value === localNPC.status);

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
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${statusInfo?.color ?? 'bg-gray-500/20'}`}
                    >
                      <User className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{localNPC.name}</span>
                        {localNPC.titleRole && (
                          <span className="text-muted-foreground text-sm">
                            — {localNPC.titleRole}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge className={statusInfo?.color ?? ''}>
                          {localNPC.status}
                        </Badge>
                        {localNPC.faction && (
                          <span className="text-muted-foreground text-xs">
                            {localNPC.faction}
                          </span>
                        )}
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
                  <TooltipContent>Delete Character</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="space-y-6 pt-6">
              {/* Basic Info Section */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <User className="h-3 w-3 text-blue-500" />
                    Name
                  </Label>
                  <Input
                    value={localNPC.name}
                    onChange={e => handleTextChange('name', e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Character name..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <Shield className="h-3 w-3 text-purple-500" />
                    Title / Role
                  </Label>
                  <Input
                    value={localNPC.titleRole || ''}
                    onChange={e =>
                      handleTextChange('titleRole', e.target.value)
                    }
                    onBlur={handleBlur}
                    placeholder="The Merchant Prince, Village Elder..."
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <Sparkles className="h-3 w-3 text-green-500" />
                    Status
                  </Label>
                  <Select
                    value={localNPC.status}
                    onValueChange={value =>
                      handleStatusChange(value as CampaignNPC['status'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NPC_STATUS_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <Users className="h-3 w-3 text-cyan-500" />
                    Faction / Group (Legacy)
                  </Label>
                  <Input
                    value={localNPC.faction}
                    onChange={e => handleTextChange('faction', e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Guild, kingdom, organization..."
                  />
                </div>
              </div>

              {/* Description Fields */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <FileText className="h-3 w-3 text-slate-500" />
                  Description
                </Label>
                <Textarea
                  value={localNPC.description}
                  onChange={e =>
                    handleTextChange('description', e.target.value)
                  }
                  onBlur={handleBlur}
                  placeholder="Physical appearance, mannerisms..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <Brain className="h-3 w-3 text-pink-500" />
                  Personality
                </Label>
                <Textarea
                  value={localNPC.personality}
                  onChange={e =>
                    handleTextChange('personality', e.target.value)
                  }
                  onBlur={handleBlur}
                  placeholder="How do they act? What quirks do they have?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <Heart className="h-3 w-3 text-red-500" />
                  Motivation
                </Label>
                <Textarea
                  value={localNPC.motivation}
                  onChange={e => handleTextChange('motivation', e.target.value)}
                  onBlur={handleBlur}
                  placeholder="What drives them? What do they want?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <Scroll className="h-3 w-3 text-amber-500" />
                  Background / History
                </Label>
                <Textarea
                  value={localNPC.backgroundHistory}
                  onChange={e =>
                    handleTextChange('backgroundHistory', e.target.value)
                  }
                  onBlur={handleBlur}
                  placeholder="Their backstory and history..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <Key className="h-3 w-3 text-amber-600" />
                  Secrets (GM Only)
                </Label>
                <Textarea
                  value={localNPC.secrets}
                  onChange={e => handleTextChange('secrets', e.target.value)}
                  onBlur={handleBlur}
                  placeholder="Hidden information players don't know..."
                  rows={2}
                />
              </div>

              <Separator />

              {/* Organizations */}
              <EntityBadgeList
                label="Organizations"
                icon={<Building2 className="h-3 w-3" />}
                iconColor="text-purple-500"
                emptyText="No organizations linked"
                onAdd={() => setShowOrgPicker(true)}
                addLabel="Add Organization"
              >
                {(localNPC.organizationIds ?? []).map(id => (
                  <RemovableBadge
                    key={id}
                    icon={<Building2 className="h-3 w-3" />}
                    onRemove={() => handleRemoveOrganization(id)}
                  >
                    {getOrgName(id)}
                  </RemovableBadge>
                ))}
              </EntityBadgeList>

              {/* Known Locations */}
              <EntityBadgeList
                label="Known Locations"
                icon={<Map className="h-3 w-3" />}
                iconColor="text-emerald-500"
                emptyText="No locations linked"
                onAdd={() => setShowLocationPicker(true)}
                addLabel="Add Location"
              >
                {(localNPC.locationIds ?? []).map(id => (
                  <RemovableBadge
                    key={id}
                    icon={<Map className="h-3 w-3" />}
                    onRemove={() => handleRemoveLocation(id)}
                  >
                    {getLocationName(id)}
                  </RemovableBadge>
                ))}
              </EntityBadgeList>

              <Separator />

              {/* Allies Section */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-medium text-green-600">
                  <Heart className="h-4 w-4" />
                  Allies
                </h4>

                {/* Ally NPCs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Allied NPCs</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 px-2 text-xs"
                      onClick={() => setShowAllyNPCPicker(true)}
                    >
                      <Plus className="h-3 w-3" />
                      Add NPC
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {otherNPCs.map(otherNpc => (
                      <Badge
                        key={otherNpc.id}
                        variant={
                          (localNPC.allyNpcIds ?? []).includes(otherNpc.id)
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer"
                        onClick={() => toggleAllyNpc(otherNpc.id)}
                      >
                        <User className="mr-1 h-3 w-3" />
                        {otherNpc.name}
                      </Badge>
                    ))}
                    {otherNPCs.length === 0 && (
                      <span className="text-muted-foreground text-sm">
                        No other NPCs
                      </span>
                    )}
                  </div>
                </div>

                {/* Ally Organizations */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Allied Organizations</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 px-2 text-xs"
                      onClick={() => setShowAllyOrgPicker(true)}
                    >
                      <Plus className="h-3 w-3" />
                      Add Organization
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {organizations.map(org => (
                      <Badge
                        key={org.id}
                        variant={
                          (localNPC.allyOrganizationIds ?? []).includes(org.id)
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer"
                        onClick={() => toggleAllyOrg(org.id)}
                      >
                        <Building2 className="mr-1 h-3 w-3" />
                        {org.name}
                      </Badge>
                    ))}
                    {organizations.length === 0 && (
                      <span className="text-muted-foreground text-sm">
                        No organizations
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Enemies Section */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-medium text-red-600">
                  <Swords className="h-4 w-4" />
                  Enemies
                </h4>

                {/* Enemy NPCs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Enemy NPCs</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 px-2 text-xs"
                      onClick={() => setShowEnemyNPCPicker(true)}
                    >
                      <Plus className="h-3 w-3" />
                      Add NPC
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {otherNPCs.map(otherNpc => (
                      <Badge
                        key={otherNpc.id}
                        variant={
                          (localNPC.enemyNpcIds ?? []).includes(otherNpc.id)
                            ? 'destructive'
                            : 'outline'
                        }
                        className="cursor-pointer"
                        onClick={() => toggleEnemyNpc(otherNpc.id)}
                      >
                        <User className="mr-1 h-3 w-3" />
                        {otherNpc.name}
                      </Badge>
                    ))}
                    {otherNPCs.length === 0 && (
                      <span className="text-muted-foreground text-sm">
                        No other NPCs
                      </span>
                    )}
                  </div>
                </div>

                {/* Enemy Organizations */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Enemy Organizations</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 px-2 text-xs"
                      onClick={() => setShowEnemyOrgPicker(true)}
                    >
                      <Plus className="h-3 w-3" />
                      Add Organization
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {organizations.map(org => (
                      <Badge
                        key={org.id}
                        variant={
                          (localNPC.enemyOrganizationIds ?? []).includes(org.id)
                            ? 'destructive'
                            : 'outline'
                        }
                        className="cursor-pointer"
                        onClick={() => toggleEnemyOrg(org.id)}
                      >
                        <Building2 className="mr-1 h-3 w-3" />
                        {org.name}
                      </Badge>
                    ))}
                    {organizations.length === 0 && (
                      <span className="text-muted-foreground text-sm">
                        No organizations
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Session Appearances (Read-only) */}
              {(localNPC.sessionAppearances ?? []).length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3 text-blue-500" />
                    Session Appearances
                  </Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {(localNPC.sessionAppearances ?? []).map(appearance => (
                      <Card key={appearance.sessionId} className="bg-muted/20">
                        <CardContent className="p-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 flex-shrink-0 text-blue-500" />
                            <div className="min-w-0 flex-1 truncate text-sm font-medium">
                              S{appearance.sessionNumber}
                              {appearance.sessionTitle &&
                                `: ${appearance.sessionTitle}`}
                            </div>
                            {appearance.role && (
                              <Badge
                                variant="secondary"
                                className="flex-shrink-0 px-1 py-0 text-[10px]"
                              >
                                {appearance.role}
                              </Badge>
                            )}
                          </div>
                          {appearance.actionsTaken && (
                            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                              {appearance.actionsTaken}
                            </p>
                          )}
                          {/* Linked entities inline */}
                          {((appearance.locationIds ?? []).length > 0 ||
                            (appearance.questIds ?? []).length > 0) && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {(appearance.locationIds ?? []).map(locId => (
                                <Badge
                                  key={locId}
                                  variant="outline"
                                  className="gap-0.5 px-1 py-0 text-[10px]"
                                >
                                  <Map className="h-2 w-2" />
                                  {getLocationName(locId)}
                                </Badge>
                              ))}
                              {(appearance.questIds ?? []).map(questId => {
                                const quest = quests.find(
                                  q => q.id === questId
                                );
                                return (
                                  <Badge
                                    key={questId}
                                    variant="outline"
                                    className="gap-0.5 px-1 py-0 text-[10px]"
                                  >
                                    <Scroll className="h-2 w-2" />
                                    {quest?.title ?? 'Unknown'}
                                  </Badge>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Quest Appearances (Read-only) */}
              {(localNPC.questAppearances ?? []).length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <Target className="h-3 w-3 text-amber-500" />
                    Quest Appearances
                  </Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {(localNPC.questAppearances ?? []).map(appearance => (
                      <Card key={appearance.questId} className="bg-muted/20">
                        <CardContent className="p-2">
                          <div className="flex items-center gap-2">
                            <Target className="h-3 w-3 flex-shrink-0 text-amber-500" />
                            <div className="min-w-0 flex-1 truncate text-sm font-medium">
                              {appearance.questTitle ?? 'Unknown Quest'}
                            </div>
                            {appearance.role && (
                              <Badge
                                variant="secondary"
                                className="flex-shrink-0 px-1 py-0 text-[10px]"
                              >
                                {appearance.role}
                              </Badge>
                            )}
                          </div>
                          {appearance.actionsTaken && (
                            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                              {appearance.actionsTaken}
                            </p>
                          )}
                          {/* Linked entities inline */}
                          {((appearance.locationIds ?? []).length > 0 ||
                            (appearance.sessionIds ?? []).length > 0) && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {(appearance.locationIds ?? []).map(locId => (
                                <Badge
                                  key={locId}
                                  variant="outline"
                                  className="gap-0.5 px-1 py-0 text-[10px]"
                                >
                                  <Map className="h-2 w-2" />
                                  {getLocationName(locId)}
                                </Badge>
                              ))}
                              {(appearance.sessionIds ?? []).map(
                                (sessionId: string) => {
                                  const foundSession = sessions.find(
                                    (s: SessionNote) => s.id === sessionId
                                  );
                                  return (
                                    <Badge
                                      key={sessionId}
                                      variant="outline"
                                      className="gap-0.5 px-1 py-0 text-[10px]"
                                    >
                                      <Calendar className="h-2 w-2" />S
                                      {foundSession?.sessionNumber ?? '?'}
                                    </Badge>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {((localNPC.sessionAppearances ?? []).length > 0 ||
                (localNPC.questAppearances ?? []).length > 0) && <Separator />}

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-xs">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {localNPC.tags.map(tag => (
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
                  value={localNPC.notes}
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
            <AlertDialogTitle>Delete Character</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{localNPC.name}"? This action
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
      <LocationPickerModal
        open={showLocationPicker}
        onOpenChange={setShowLocationPicker}
        locations={locations}
        selectedLocationIds={localNPC.locationIds ?? []}
        onSelectLocation={handleAddLocation}
        onCreateLocation={onCreateLocation}
        title="Add Known Location"
        description="Select a location this NPC is associated with"
      />

      <OrganizationPickerModal
        open={showOrgPicker}
        onOpenChange={setShowOrgPicker}
        organizations={organizations}
        selectedOrganizationIds={localNPC.organizationIds ?? []}
        onSelectOrganization={handleAddOrganization}
        onCreateOrganization={onCreateOrganization}
        title="Add Organization"
        description="Select an organization this NPC belongs to"
      />

      {/* Ally/Enemy NPC Picker Modals */}
      <NPCPickerModal
        open={showAllyNPCPicker}
        onOpenChange={setShowAllyNPCPicker}
        npcs={otherNPCs}
        locations={locations}
        quests={quests}
        selectedNpcIds={localNPC.allyNpcIds ?? []}
        onSelectNPC={handleAddAllyNPC}
        onCreateNPC={onCreateNPC}
        title="Add Allied NPC"
        description="Select an existing NPC or create a new one to add as an ally"
        showInvolvementFields={false}
      />

      <NPCPickerModal
        open={showEnemyNPCPicker}
        onOpenChange={setShowEnemyNPCPicker}
        npcs={otherNPCs}
        locations={locations}
        quests={quests}
        selectedNpcIds={localNPC.enemyNpcIds ?? []}
        onSelectNPC={handleAddEnemyNPC}
        onCreateNPC={onCreateNPC}
        title="Add Enemy NPC"
        description="Select an existing NPC or create a new one to add as an enemy"
        showInvolvementFields={false}
      />

      {/* Ally/Enemy Organization Picker Modals */}
      <OrganizationPickerModal
        open={showAllyOrgPicker}
        onOpenChange={setShowAllyOrgPicker}
        organizations={organizations}
        selectedOrganizationIds={localNPC.allyOrganizationIds ?? []}
        onSelectOrganization={handleAddAllyOrg}
        onCreateOrganization={onCreateOrganization}
        title="Add Allied Organization"
        description="Select an organization to add as an ally"
      />

      <OrganizationPickerModal
        open={showEnemyOrgPicker}
        onOpenChange={setShowEnemyOrgPicker}
        organizations={organizations}
        selectedOrganizationIds={localNPC.enemyOrganizationIds ?? []}
        onSelectOrganization={handleAddEnemyOrg}
        onCreateOrganization={onCreateOrganization}
        title="Add Enemy Organization"
        description="Select an organization to add as an enemy"
      />
    </>
  );
}
