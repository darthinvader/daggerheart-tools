// Location components - Enhanced with POI significance and organization links

import {
  Building,
  Building2,
  ChevronDown,
  History,
  Key,
  Map,
  MapPin,
  Mountain,
  Plus,
  Scroll,
  Sparkles,
  Star,
  Trash2,
  TreePine,
  User,
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
  deleteLocation,
  updateLocation,
} from '@/features/campaigns/campaign-storage';
import { useAutoSave } from '@/hooks/use-auto-save';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
  PointOfInterest,
  SessionNote,
} from '@/lib/schemas/campaign';

import {
  EntityBadgeList,
  NPCPickerModal,
  type NPCPickerResult,
  OrganizationPickerModal,
  QuestPickerModal,
  RemovableBadge,
} from './entity-modals';

// =====================================================================================
// Location Type Config
// =====================================================================================

type LocationIcon = (props: { className?: string }) => ReactNode;

const LOCATION_TYPE_OPTIONS: Array<{
  value: CampaignLocation['type'];
  label: string;
  Icon: LocationIcon;
  color: string;
}> = [
  {
    value: 'city',
    label: 'City',
    Icon: Building,
    color: 'bg-blue-500/20 text-blue-600',
  },
  {
    value: 'town',
    label: 'Town',
    Icon: MapPin,
    color: 'bg-emerald-500/20 text-emerald-600',
  },
  {
    value: 'village',
    label: 'Village',
    Icon: TreePine,
    color: 'bg-green-500/20 text-green-600',
  },
  {
    value: 'dungeon',
    label: 'Dungeon',
    Icon: Mountain,
    color: 'bg-purple-500/20 text-purple-600',
  },
  {
    value: 'wilderness',
    label: 'Wilderness',
    Icon: Map,
    color: 'bg-lime-500/20 text-lime-600',
  },
  {
    value: 'landmark',
    label: 'Landmark',
    Icon: MapPin,
    color: 'bg-amber-500/20 text-amber-600',
  },
  {
    value: 'building',
    label: 'Building',
    Icon: Building,
    color: 'bg-slate-500/20 text-slate-600',
  },
  {
    value: 'region',
    label: 'Region',
    Icon: Map,
    color: 'bg-sky-500/20 text-sky-600',
  },
  {
    value: 'other',
    label: 'Other',
    Icon: MapPin,
    color: 'bg-gray-500/20 text-gray-600',
  },
];

// =====================================================================================
// Types
// =====================================================================================

interface EditableLocationsProps {
  locations: CampaignLocation[];
  npcs: CampaignNPC[];
  quests: CampaignQuest[];
  sessions: SessionNote[];
  organizations: CampaignOrganization[];
  campaignId: string;
  onSaveStart: () => void;
  onPendingChange: () => void;
  onLocationsChange: () => void;
  onNPCsChange?: () => void;
  onQuestsChange?: () => void;
  onOrganizationsChange?: () => void;
}

type LocationTextFieldKey =
  | 'name'
  | 'description'
  | 'currentState'
  | 'historyLore'
  | 'secrets'
  | 'notes';

// =====================================================================================
// Main Component
// =====================================================================================

export function EditableLocations({
  locations,
  npcs,
  quests,
  sessions,
  organizations,
  campaignId,
  onSaveStart,
  onPendingChange,
  onLocationsChange,
  onNPCsChange,
  onQuestsChange,
  onOrganizationsChange,
}: EditableLocationsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<CampaignLocation['type'] | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = locations
    .filter(location => (typeFilter ? location.type === typeFilter : true))
    .filter(location => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      return [location.name, location.type, location.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });

  const sortedLocations = [...filteredLocations].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleAddLocation = async () => {
    onSaveStart();
    await addLocation(campaignId, {
      name: 'New Location',
      type: 'other',
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
    onLocationsChange();
  };

  const handleUpdateLocation = async (
    locationId: string,
    updates: Partial<Omit<CampaignLocation, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    onSaveStart();
    await updateLocation(campaignId, locationId, updates);
    onLocationsChange();
  };

  const handleDeleteLocation = async (locationId: string) => {
    onSaveStart();
    await deleteLocation(campaignId, locationId);
    onLocationsChange();
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
    onOrganizationsChange?.();
    if (!newOrg) throw new Error('Failed to create organization');
    return newOrg.id;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleAddLocation} className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
        <div className="relative flex-1">
          <Input
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Search locations..."
            className="pl-10"
          />
          <Map className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        </div>
        <Select
          value={typeFilter ?? 'all'}
          onValueChange={value =>
            setTypeFilter(
              value === 'all' ? null : (value as CampaignLocation['type'])
            )
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {LOCATION_TYPE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {sortedLocations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Map className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="mb-2 font-medium">No locations created yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Add cities, dungeons, and points of interest
            </p>
            <Button onClick={handleAddLocation} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add First Location
            </Button>
          </CardContent>
        </Card>
      ) : (
        sortedLocations.map(location => (
          <LocationCard
            key={location.id}
            location={location}
            npcs={npcs}
            quests={quests}
            sessions={sessions}
            organizations={organizations}
            isExpanded={expandedId === location.id}
            onToggle={() =>
              setExpandedId(expandedId === location.id ? null : location.id)
            }
            onUpdate={updates => handleUpdateLocation(location.id, updates)}
            onDelete={() => handleDeleteLocation(location.id)}
            onCreateNPC={handleCreateNPC}
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
// Location Card Component
// =====================================================================================

interface LocationCardProps {
  location: CampaignLocation;
  npcs: CampaignNPC[];
  quests: CampaignQuest[];
  sessions: SessionNote[];
  organizations: CampaignOrganization[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<Omit<CampaignLocation, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  onDelete: () => void;
  onCreateNPC: (name: string) => Promise<string>;
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

function normalizeLocation(location: CampaignLocation): CampaignLocation {
  return {
    ...location,
    historyLore: location.historyLore ?? '',
    npcIds: location.npcIds ?? [],
    npcsPresentCustom: location.npcsPresentCustom ?? [],
    organizationIds: location.organizationIds ?? [],
    questIds: location.questIds ?? [],
    questsAvailableCustom: location.questsAvailableCustom ?? [],
    sessionAppearances: location.sessionAppearances ?? [],
    pointsOfInterest: (location.pointsOfInterest ?? []).map(poi => ({
      id: poi.id ?? crypto.randomUUID(),
      name: poi.name,
      description: poi.description ?? '',
      significance: poi.significance ?? '',
    })),
    tags: location.tags ?? [],
  };
}

function LocationCard({
  location,
  npcs,
  quests,
  sessions: _sessions,
  organizations,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  onCreateNPC,
  onCreateQuest,
  onCreateOrganization,
  onSaveStart,
  onPendingChange,
}: LocationCardProps) {
  // _sessions available for future use
  void _sessions;
  const [trackedId, setTrackedId] = useState(location.id);
  const [localLocation, setLocalLocation] = useState(() =>
    normalizeLocation(location)
  );
  const [baseLocation, setBaseLocation] = useState(() =>
    normalizeLocation(location)
  );
  const [tagInput, setTagInput] = useState('');
  const [poiName, setPoiName] = useState('');
  const [poiDesc, setPoiDesc] = useState('');
  const [poiSignificance, setPoiSignificance] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Modal states
  const [showNPCPicker, setShowNPCPicker] = useState(false);
  const [showQuestPicker, setShowQuestPicker] = useState(false);
  const [showOrgPicker, setShowOrgPicker] = useState(false);

  // Sync local state when prop changes (state-based pattern)
  if (trackedId !== location.id) {
    setTrackedId(location.id);
    setLocalLocation(normalizeLocation(location));
    setBaseLocation(normalizeLocation(location));
  }

  // Compute updates
  const getUpdates = useCallback(
    (current: CampaignLocation) => {
      const base = baseLocation;
      const updates: Partial<
        Omit<CampaignLocation, 'id' | 'createdAt' | 'updatedAt'>
      > = {};

      if (current.name !== base.name) updates.name = current.name;
      if (current.description !== base.description)
        updates.description = current.description;
      if (current.currentState !== base.currentState)
        updates.currentState = current.currentState;
      if (current.historyLore !== base.historyLore)
        updates.historyLore = current.historyLore;
      if (current.secrets !== base.secrets) updates.secrets = current.secrets;
      if (current.notes !== base.notes) updates.notes = current.notes;
      if (current.type !== base.type) updates.type = current.type;
      if (JSON.stringify(current.tags) !== JSON.stringify(base.tags))
        updates.tags = current.tags;
      if (
        JSON.stringify(current.pointsOfInterest) !==
        JSON.stringify(base.pointsOfInterest)
      )
        updates.pointsOfInterest = current.pointsOfInterest;
      if (JSON.stringify(current.npcIds) !== JSON.stringify(base.npcIds))
        updates.npcIds = current.npcIds;
      if (
        JSON.stringify(current.organizationIds) !==
        JSON.stringify(base.organizationIds)
      )
        updates.organizationIds = current.organizationIds;
      if (JSON.stringify(current.questIds) !== JSON.stringify(base.questIds))
        updates.questIds = current.questIds;

      return updates;
    },
    [baseLocation]
  );

  const { scheduleAutoSave, flush } = useAutoSave({
    onSave: async (data: CampaignLocation) => {
      const updates = getUpdates(data);
      if (Object.keys(updates).length === 0) return;
      setBaseLocation(prev => ({ ...prev, ...updates }));
      await onUpdate(updates);
    },
    onSaveStart,
    onPendingChange,
  });

  const handleBlur = useCallback(() => {
    flush();
  }, [flush]);

  const handleTextChange = useCallback(
    (field: LocationTextFieldKey, value: string) => {
      setLocalLocation(current => {
        const updated = { ...current, [field]: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleTypeChange = useCallback(
    (value: CampaignLocation['type']) => {
      setLocalLocation(current => {
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
    if (!trimmed || localLocation.tags.includes(trimmed)) return;
    setLocalLocation(current => {
      const updated = { ...current, tags: [...current.tags, trimmed] };
      scheduleAutoSave(updated);
      return updated;
    });
    setTagInput('');
  }, [localLocation.tags, tagInput, scheduleAutoSave]);

  const removeTag = useCallback(
    (tag: string) => {
      setLocalLocation(current => {
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

  // POI handlers
  const addPOI = useCallback(() => {
    const trimmedName = poiName.trim();
    if (!trimmedName) return;
    const newPOI: PointOfInterest = {
      id: crypto.randomUUID(),
      name: trimmedName,
      description: poiDesc.trim(),
      significance: poiSignificance.trim(),
    };
    setLocalLocation(current => {
      const updated = {
        ...current,
        pointsOfInterest: [...current.pointsOfInterest, newPOI],
      };
      scheduleAutoSave(updated);
      return updated;
    });
    setPoiName('');
    setPoiDesc('');
    setPoiSignificance('');
  }, [poiName, poiDesc, poiSignificance, scheduleAutoSave]);

  const removePOI = useCallback(
    (poiId: string) => {
      setLocalLocation(current => {
        const updated = {
          ...current,
          pointsOfInterest: current.pointsOfInterest.filter(
            poi => poi.id !== poiId
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // NPC handlers
  const handleAddNPC = useCallback(
    (result: NPCPickerResult) => {
      setLocalLocation(current => {
        if ((current.npcIds ?? []).includes(result.npcId)) return current;
        const updated = {
          ...current,
          npcIds: [...(current.npcIds ?? []), result.npcId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveNPC = useCallback(
    (npcId: string) => {
      setLocalLocation(current => {
        const updated = {
          ...current,
          npcIds: (current.npcIds ?? []).filter(id => id !== npcId),
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
      setLocalLocation(current => {
        if ((current.questIds ?? []).includes(questId)) return current;
        const updated = {
          ...current,
          questIds: [...(current.questIds ?? []), questId],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveQuest = useCallback(
    (questId: string) => {
      setLocalLocation(current => {
        const updated = {
          ...current,
          questIds: (current.questIds ?? []).filter(id => id !== questId),
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
      setLocalLocation(current => {
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
      setLocalLocation(current => {
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

  // Get entity names for display
  const getNpcName = (id: string) =>
    npcs.find(n => n.id === id)?.name ?? 'Unknown';
  const getQuestTitle = (id: string) =>
    quests.find(q => q.id === id)?.title ?? 'Unknown';
  const getOrgName = (id: string) =>
    organizations.find(o => o.id === id)?.name ?? 'Unknown';

  const typeInfo = LOCATION_TYPE_OPTIONS.find(
    t => t.value === localLocation.type
  );
  const TypeIcon = typeInfo?.Icon ?? MapPin;

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
                      <div className="font-medium">{localLocation.name}</div>
                      <div className="text-muted-foreground text-sm capitalize">
                        {localLocation.type}
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
                  <TooltipContent>Delete Location</TooltipContent>
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
                    <Map className="h-3 w-3 text-emerald-500" />
                    Name
                  </Label>
                  <Input
                    value={localLocation.name}
                    onChange={e => handleTextChange('name', e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Location name..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={localLocation.type}
                    onValueChange={value =>
                      handleTypeChange(value as CampaignLocation['type'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATION_TYPE_OPTIONS.map(option => (
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
                  value={localLocation.description}
                  onChange={e =>
                    handleTextChange('description', e.target.value)
                  }
                  onBlur={handleBlur}
                  placeholder="What does this place look like?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <Sparkles className="h-3 w-3 text-blue-500" />
                  Current State
                </Label>
                <Textarea
                  value={localLocation.currentState}
                  onChange={e =>
                    handleTextChange('currentState', e.target.value)
                  }
                  onBlur={handleBlur}
                  placeholder="What's happening here now?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <History className="h-3 w-3 text-amber-500" />
                  History & Lore
                </Label>
                <Textarea
                  value={localLocation.historyLore}
                  onChange={e =>
                    handleTextChange('historyLore', e.target.value)
                  }
                  onBlur={handleBlur}
                  placeholder="The history and lore of this place..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <Key className="h-3 w-3 text-amber-600" />
                  Secrets (GM Only)
                </Label>
                <Textarea
                  value={localLocation.secrets}
                  onChange={e => handleTextChange('secrets', e.target.value)}
                  onBlur={handleBlur}
                  placeholder="Hidden information about this location..."
                  rows={2}
                />
              </div>

              <Separator />

              {/* Points of Interest */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Points of Interest
                  </Label>
                </div>

                {localLocation.pointsOfInterest.length === 0 ? (
                  <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
                    No points of interest added yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {localLocation.pointsOfInterest.map(poi => (
                      <Card key={poi.id} className="bg-muted/30">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 flex-shrink-0 text-yellow-500" />
                                <span className="font-medium">{poi.name}</span>
                              </div>
                              {poi.description && (
                                <p className="text-muted-foreground mt-1 text-sm">
                                  {poi.description}
                                </p>
                              )}
                              {poi.significance && (
                                <div className="mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    Significance: {poi.significance}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive h-7 w-7"
                              onClick={() => removePOI(poi.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Add POI Form */}
                <Card className="bg-muted/20">
                  <CardContent className="space-y-3 p-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        value={poiName}
                        onChange={e => setPoiName(e.target.value)}
                        placeholder="POI Name..."
                      />
                      <Input
                        value={poiSignificance}
                        onChange={e => setPoiSignificance(e.target.value)}
                        placeholder="Significance..."
                      />
                    </div>
                    <Textarea
                      value={poiDesc}
                      onChange={e => setPoiDesc(e.target.value)}
                      placeholder="Description..."
                      rows={2}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addPOI}
                      disabled={!poiName.trim()}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Point of Interest
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* NPCs */}
              <EntityBadgeList
                label="NPCs Present"
                icon={<User className="h-3 w-3" />}
                iconColor="text-blue-500"
                emptyText="No NPCs linked"
                onAdd={() => setShowNPCPicker(true)}
                addLabel="Add NPC"
              >
                {(localLocation.npcIds ?? []).map(id => (
                  <RemovableBadge
                    key={id}
                    icon={<User className="h-3 w-3" />}
                    onRemove={() => handleRemoveNPC(id)}
                  >
                    {getNpcName(id)}
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
                {(localLocation.organizationIds ?? []).map(id => (
                  <RemovableBadge
                    key={id}
                    icon={<Building2 className="h-3 w-3" />}
                    onRemove={() => handleRemoveOrganization(id)}
                  >
                    {getOrgName(id)}
                  </RemovableBadge>
                ))}
              </EntityBadgeList>

              {/* Quests */}
              <EntityBadgeList
                label="Related Quests"
                icon={<Scroll className="h-3 w-3" />}
                iconColor="text-amber-500"
                emptyText="No quests linked"
                onAdd={() => setShowQuestPicker(true)}
                addLabel="Add Quest"
              >
                {(localLocation.questIds ?? []).map(id => (
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

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-xs">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {localLocation.tags.map(tag => (
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
                  value={localLocation.notes}
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
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{localLocation.name}"? This
              action cannot be undone.
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
        locations={[]}
        quests={[]}
        selectedNpcIds={localLocation.npcIds ?? []}
        onSelectNPC={handleAddNPC}
        onCreateNPC={onCreateNPC}
        title="Add NPC to Location"
        description="Select an NPC that can be found at this location"
        showInvolvementFields={false}
      />

      <QuestPickerModal
        open={showQuestPicker}
        onOpenChange={setShowQuestPicker}
        quests={quests}
        selectedQuestIds={localLocation.questIds ?? []}
        onSelectQuest={handleAddQuest}
        onCreateQuest={onCreateQuest}
        title="Link Quest to Location"
        description="Select a quest related to this location"
      />

      <OrganizationPickerModal
        open={showOrgPicker}
        onOpenChange={setShowOrgPicker}
        organizations={organizations}
        selectedOrganizationIds={localLocation.organizationIds ?? []}
        onSelectOrganization={handleAddOrganization}
        onCreateOrganization={onCreateOrganization}
        title="Link Organization to Location"
        description="Select an organization present at this location"
      />
    </>
  );
}
