// Session components - Enhanced with NPC involvement tracking

import {
  Building2,
  Calendar,
  ChevronDown,
  Edit,
  Lightbulb,
  Map,
  Plus,
  Scroll,
  Sparkles,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  addSession,
  deleteSession,
  updateSession,
} from '@/features/campaigns/campaign-storage';
import { useAutoSave } from '@/hooks/use-auto-save';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
  SessionNote,
  SessionNPCInvolvement,
} from '@/lib/schemas/campaign';

import {
  EntityBadgeList,
  LocationPickerModal,
  NPCInvolvementEditorModal,
  NPCPickerModal,
  type NPCPickerResult,
  OrganizationPickerModal,
  QuestPickerModal,
  RemovableBadge,
} from './entity-modals';

// =====================================================================================
// Types
// =====================================================================================

interface EditableSessionsProps {
  sessions: SessionNote[];
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  organizations: CampaignOrganization[];
  campaignId: string;
  onSaveStart: () => void;
  onPendingChange: () => void;
  onSessionsChange: () => void;
  onNPCsChange?: () => void;
  onLocationsChange?: () => void;
  onQuestsChange?: () => void;
  onOrganizationsChange?: () => void;
}

// =====================================================================================
// Main Component
// =====================================================================================

export function EditableSessions({
  sessions,
  npcs,
  locations,
  quests,
  organizations,
  campaignId,
  onSaveStart,
  onPendingChange,
  onSessionsChange,
  onNPCsChange,
  onLocationsChange,
  onQuestsChange,
  onOrganizationsChange,
}: EditableSessionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sortedSessions = [...sessions].sort(
    (a, b) => b.sessionNumber - a.sessionNumber
  );
  const filteredSessions = sortedSessions.filter(session => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return [
      session.title,
      session.summary,
      session.questProgress,
      String(session.sessionNumber),
    ]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  const nextSessionNumber =
    sessions.length > 0
      ? Math.max(...sessions.map(s => s.sessionNumber)) + 1
      : 1;

  const handleAddSession = async () => {
    try {
      setError(null);
      onSaveStart();
      await addSession(campaignId, {
        sessionNumber: nextSessionNumber,
        title: `Session ${nextSessionNumber}`,
        date: new Date().toISOString().split('T')[0],
        summary: '',
        keyHighlights: [],
        playerNotes: [],
        npcsInvolved: [],
        npcsInvolvedIds: [],
        npcsInvolvedCustom: [],
        locationIds: [],
        locationsCustom: [],
        questIds: [],
        questsInvolvedCustom: [],
        organizationIds: [],
        questProgress: '',
      });
      onSessionsChange();
    } catch (err) {
      console.error('Failed to add session:', err);
      setError(err instanceof Error ? err.message : 'Failed to add session');
    }
  };

  const handleUpdateSession = async (
    sessionId: string,
    updates: Partial<Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    if (Object.keys(updates).length === 0) return;
    try {
      setError(null);
      onSaveStart();
      await updateSession(campaignId, sessionId, updates);
      onSessionsChange();
    } catch (err) {
      console.error('Failed to update session:', err);
      setError(err instanceof Error ? err.message : 'Failed to update session');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      setError(null);
      onSaveStart();
      await deleteSession(campaignId, sessionId);
      onSessionsChange();
    } catch (err) {
      console.error('Failed to delete session:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete session');
    }
  };

  // Create handlers for inline entity creation
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
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Session update failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button onClick={handleAddSession} className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Session {nextSessionNumber}
        </Button>
      </div>

      <div className="relative">
        <Input
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          placeholder="Search sessions..."
          className="pl-10"
        />
        <Scroll className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      </div>

      {filteredSessions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Scroll className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="mb-2 font-medium">No sessions recorded yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Start tracking your campaign by adding your first session
            </p>
            <Button onClick={handleAddSession} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add First Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        filteredSessions.map(session => (
          <SessionCard
            key={`${session.id}-${session.updatedAt}`}
            session={session}
            npcs={npcs}
            locations={locations}
            quests={quests}
            organizations={organizations}
            isExpanded={expandedId === session.id}
            onToggle={() =>
              setExpandedId(expandedId === session.id ? null : session.id)
            }
            onUpdate={updates => handleUpdateSession(session.id, updates)}
            onDelete={() => handleDeleteSession(session.id)}
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
// Session Card Component
// =====================================================================================

interface SessionCardProps {
  session: SessionNote;
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  organizations: CampaignOrganization[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>>
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

function normalizeSession(session: SessionNote): SessionNote {
  return {
    ...session,
    npcsInvolved: session.npcsInvolved ?? [],
    npcsInvolvedIds: session.npcsInvolvedIds ?? [],
    npcsInvolvedCustom: session.npcsInvolvedCustom ?? [],
    locationIds: session.locationIds ?? [],
    locationsCustom: session.locationsCustom ?? [],
    questIds: session.questIds ?? [],
    questsInvolvedCustom: session.questsInvolvedCustom ?? [],
    organizationIds: session.organizationIds ?? [],
    keyHighlights: session.keyHighlights ?? [],
  };
}

function SessionCard({
  session,
  npcs,
  locations,
  quests,
  organizations,
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
}: SessionCardProps) {
  const [trackedId, setTrackedId] = useState(session.id);
  const [localSession, setLocalSession] = useState(() =>
    normalizeSession(session)
  );
  const [baseSession, setBaseSession] = useState(() =>
    normalizeSession(session)
  );
  const [highlightInput, setHighlightInput] = useState('');

  // Modal states
  const [showNPCPicker, setShowNPCPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showQuestPicker, setShowQuestPicker] = useState(false);
  const [showOrgPicker, setShowOrgPicker] = useState(false);
  const [editingNpcInvolvement, setEditingNpcInvolvement] =
    useState<SessionNPCInvolvement | null>(null);

  // Sync local state when prop changes (state-based pattern)
  if (trackedId !== session.id) {
    setTrackedId(session.id);
    setLocalSession(normalizeSession(session));
    setBaseSession(normalizeSession(session));
  }

  // Compute updates by comparing local to base
  const getUpdates = useCallback(
    (current: SessionNote) => {
      const base = baseSession;
      const updates: Partial<
        Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>
      > = {};

      if (current.title !== base.title) updates.title = current.title;
      if (current.summary !== base.summary) updates.summary = current.summary;
      if (current.questProgress !== base.questProgress)
        updates.questProgress = current.questProgress;
      if (current.date !== base.date) updates.date = current.date;
      if (
        JSON.stringify(current.keyHighlights) !==
        JSON.stringify(base.keyHighlights)
      ) {
        updates.keyHighlights = current.keyHighlights;
      }
      if (
        JSON.stringify(current.npcsInvolved) !==
        JSON.stringify(base.npcsInvolved)
      ) {
        updates.npcsInvolved = current.npcsInvolved;
      }
      if (
        JSON.stringify(current.locationIds) !== JSON.stringify(base.locationIds)
      ) {
        updates.locationIds = current.locationIds;
      }
      if (JSON.stringify(current.questIds) !== JSON.stringify(base.questIds)) {
        updates.questIds = current.questIds;
      }
      if (
        JSON.stringify(current.organizationIds) !==
        JSON.stringify(base.organizationIds)
      ) {
        updates.organizationIds = current.organizationIds;
      }

      return updates;
    },
    [baseSession]
  );

  const { scheduleAutoSave, flush } = useAutoSave({
    onSave: async (data: SessionNote) => {
      const updates = getUpdates(data);
      if (Object.keys(updates).length === 0) return;
      setBaseSession(prev => ({ ...prev, ...updates }));
      await onUpdate(updates);
    },
    onSaveStart,
    onPendingChange,
  });

  const handleBlur = useCallback(() => {
    flush();
  }, [flush]);

  const handleTextChange = useCallback(
    (field: 'title' | 'summary' | 'questProgress', value: string) => {
      setLocalSession(current => {
        const updated = { ...current, [field]: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleDateChange = useCallback(
    (value: string) => {
      setLocalSession(current => {
        const updated = { ...current, date: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // Key Highlights handlers
  const addHighlight = useCallback(() => {
    const trimmed = highlightInput.trim();
    if (!trimmed) return;
    setLocalSession(current => {
      const newHighlights = [...(current.keyHighlights ?? []), trimmed];
      const updated = { ...current, keyHighlights: newHighlights };
      scheduleAutoSave(updated);
      return updated;
    });
    setHighlightInput('');
  }, [highlightInput, scheduleAutoSave]);

  const removeHighlight = useCallback(
    (index: number) => {
      setLocalSession(current => {
        const newHighlights = (current.keyHighlights ?? []).filter(
          (_, i) => i !== index
        );
        const updated = { ...current, keyHighlights: newHighlights };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // NPC Involvement handlers
  const handleAddNPC = useCallback(
    (result: NPCPickerResult) => {
      setLocalSession(current => {
        const newInvolvement: SessionNPCInvolvement = {
          id: crypto.randomUUID(),
          npcId: result.npcId,
          npcName: result.npcName,
          role: result.role,
          actionsTaken: result.actionsTaken,
          notes: result.notes,
          locationIds: result.locationIds,
          questIds: result.questIds,
        };
        const updated = {
          ...current,
          npcsInvolved: [...(current.npcsInvolved ?? []), newInvolvement],
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleRemoveNPC = useCallback(
    (involvementId: string) => {
      setLocalSession(current => {
        const updated = {
          ...current,
          npcsInvolved: (current.npcsInvolved ?? []).filter(
            n => n.id !== involvementId
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const handleUpdateNPCInvolvement = useCallback(
    (
      involvementId: string,
      data: {
        role: string;
        actionsTaken: string;
        notes: string;
        locationIds: string[];
        questIds: string[];
      }
    ) => {
      setLocalSession(current => {
        const updated = {
          ...current,
          npcsInvolved: (current.npcsInvolved ?? []).map(n =>
            n.id === involvementId ? { ...n, ...data } : n
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
      setLocalSession(current => {
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
      setLocalSession(current => {
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

  // Quest handlers
  const handleAddQuest = useCallback(
    (questId: string) => {
      setLocalSession(current => {
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
      setLocalSession(current => {
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
      setLocalSession(current => {
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
      setLocalSession(current => {
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
  const getLocationName = (id: string) =>
    locations.find(l => l.id === id)?.name ?? 'Unknown';
  const getQuestTitle = (id: string) =>
    quests.find(q => q.id === id)?.title ?? 'Unknown';
  const getOrgName = (id: string) =>
    organizations.find(o => o.id === id)?.name ?? 'Unknown';
  const getNpcInvolvementIds = () =>
    (localSession.npcsInvolved ?? []).map(n => n.npcId);

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
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
                      {localSession.sessionNumber}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {localSession.title}
                        </span>
                      </div>
                      {localSession.date && (
                        <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3" />
                          {localSession.date}
                        </div>
                      )}
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
                        onDelete();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Session</TooltipContent>
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
                    <Scroll className="h-3 w-3" />
                    Session Title
                  </Label>
                  <Input
                    value={localSession.title}
                    onChange={e => handleTextChange('title', e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Session title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    Date Played
                  </Label>
                  <Input
                    type="date"
                    value={localSession.date ?? ''}
                    onChange={e => handleDateChange(e.target.value)}
                  />
                </div>
              </div>

              {/* Session Summary */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Session Summary
                </Label>
                <Textarea
                  value={localSession.summary}
                  onChange={e => handleTextChange('summary', e.target.value)}
                  onBlur={handleBlur}
                  rows={4}
                  placeholder="What happened during this session..."
                />
              </div>

              {/* Key Highlights */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <Lightbulb className="h-3 w-3 text-yellow-500" />
                  Key Highlights
                </Label>
                <div className="flex flex-wrap gap-2">
                  {(localSession.keyHighlights ?? []).map((highlight, idx) => (
                    <Badge key={idx} variant="outline" className="gap-1 pr-1">
                      {highlight}
                      <button
                        type="button"
                        onClick={() => removeHighlight(idx)}
                        className="hover:bg-muted ml-1 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={highlightInput}
                    onChange={e => setHighlightInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHighlight();
                      }
                    }}
                    placeholder="Add a highlight..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={addHighlight}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* NPCs Involved - Enhanced Section */}
              <div className="space-y-3">
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

                {(localSession.npcsInvolved ?? []).length === 0 ? (
                  <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
                    No NPCs added yet. Click "Add NPC" to include characters in
                    this session.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(localSession.npcsInvolved ?? []).map(involvement => (
                      <Card key={involvement.id} className="bg-muted/30">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">
                                  {involvement.npcName}
                                </span>
                                {involvement.role && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {involvement.role}
                                  </Badge>
                                )}
                              </div>
                              {involvement.actionsTaken && (
                                <p className="text-muted-foreground mt-1 text-sm">
                                  {involvement.actionsTaken}
                                </p>
                              )}
                              {(involvement.locationIds?.length > 0 ||
                                involvement.questIds?.length > 0) && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {involvement.locationIds?.map(locId => (
                                    <Badge
                                      key={locId}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      <Map className="mr-1 h-3 w-3" />
                                      {getLocationName(locId)}
                                    </Badge>
                                  ))}
                                  {involvement.questIds?.map(questId => (
                                    <Badge
                                      key={questId}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      <Scroll className="mr-1 h-3 w-3" />
                                      {getQuestTitle(questId)}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() =>
                                        setEditingNpcInvolvement(involvement)
                                      }
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Edit Involvement
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive h-7 w-7"
                                      onClick={() =>
                                        handleRemoveNPC(involvement.id)
                                      }
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Remove NPC</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Locations Visited */}
              <EntityBadgeList
                label="Locations Visited"
                icon={<Map className="h-3 w-3" />}
                iconColor="text-emerald-500"
                emptyText="No locations added"
                onAdd={() => setShowLocationPicker(true)}
                addLabel="Add Location"
              >
                {(localSession.locationIds ?? []).map(id => (
                  <RemovableBadge
                    key={id}
                    icon={<Map className="h-3 w-3" />}
                    onRemove={() => handleRemoveLocation(id)}
                  >
                    {getLocationName(id)}
                  </RemovableBadge>
                ))}
              </EntityBadgeList>

              {/* Quests Involved */}
              <EntityBadgeList
                label="Quests Involved"
                icon={<Scroll className="h-3 w-3" />}
                iconColor="text-amber-500"
                emptyText="No quests linked"
                onAdd={() => setShowQuestPicker(true)}
                addLabel="Add Quest"
              >
                {(localSession.questIds ?? []).map(id => (
                  <RemovableBadge
                    key={id}
                    icon={<Scroll className="h-3 w-3" />}
                    onRemove={() => handleRemoveQuest(id)}
                  >
                    {getQuestTitle(id)}
                  </RemovableBadge>
                ))}
              </EntityBadgeList>

              {/* Organizations Referenced */}
              <EntityBadgeList
                label="Organizations Referenced"
                icon={<Building2 className="h-3 w-3" />}
                iconColor="text-purple-500"
                emptyText="No organizations linked"
                onAdd={() => setShowOrgPicker(true)}
                addLabel="Add Organization"
              >
                {(localSession.organizationIds ?? []).map(id => (
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

              {/* Quest/Story Progress */}
              <div className="space-y-2">
                <Label className="text-xs">Quest/Story Progress Notes</Label>
                <Textarea
                  value={localSession.questProgress}
                  onChange={e =>
                    handleTextChange('questProgress', e.target.value)
                  }
                  onBlur={handleBlur}
                  placeholder="Notes on story or quest advancement..."
                  rows={2}
                />
              </div>

              {/* Player Notes */}
              {(localSession.playerNotes?.length ?? 0) > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <Users className="h-3 w-3" />
                    Player Notes
                  </Label>
                  <div className="space-y-2">
                    {localSession.playerNotes?.map((pn, i) => (
                      <Card key={i} className="bg-muted/50">
                        <CardContent className="py-2">
                          <div className="text-muted-foreground text-xs">
                            {pn.playerName}
                          </div>
                          <p className="text-sm">{pn.note}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Modals */}
      <NPCPickerModal
        open={showNPCPicker}
        onOpenChange={setShowNPCPicker}
        npcs={npcs}
        locations={locations}
        quests={quests}
        selectedNpcIds={getNpcInvolvementIds()}
        onSelectNPC={handleAddNPC}
        onCreateNPC={onCreateNPC}
        title="Add NPC to Session"
        description="Select an existing NPC or create a new one to add to this session"
        showInvolvementFields
      />

      <LocationPickerModal
        open={showLocationPicker}
        onOpenChange={setShowLocationPicker}
        locations={locations}
        selectedLocationIds={localSession.locationIds ?? []}
        onSelectLocation={handleAddLocation}
        onCreateLocation={onCreateLocation}
        title="Add Location to Session"
        description="Select a location that was visited during this session"
      />

      <QuestPickerModal
        open={showQuestPicker}
        onOpenChange={setShowQuestPicker}
        quests={quests}
        selectedQuestIds={localSession.questIds ?? []}
        onSelectQuest={handleAddQuest}
        onCreateQuest={onCreateQuest}
        title="Link Quest to Session"
        description="Select a quest that was involved in this session"
      />

      <OrganizationPickerModal
        open={showOrgPicker}
        onOpenChange={setShowOrgPicker}
        organizations={organizations}
        selectedOrganizationIds={localSession.organizationIds ?? []}
        onSelectOrganization={handleAddOrganization}
        onCreateOrganization={onCreateOrganization}
        title="Link Organization to Session"
        description="Select an organization that was referenced in this session"
      />

      {editingNpcInvolvement && (
        <NPCInvolvementEditorModal
          open={true}
          onOpenChange={() => setEditingNpcInvolvement(null)}
          npcName={editingNpcInvolvement.npcName ?? 'Unknown NPC'}
          role={editingNpcInvolvement.role}
          actionsTaken={editingNpcInvolvement.actionsTaken}
          notes={editingNpcInvolvement.notes}
          locationIds={editingNpcInvolvement.locationIds ?? []}
          questIds={editingNpcInvolvement.questIds ?? []}
          locations={locations}
          quests={quests}
          onSave={data =>
            handleUpdateNPCInvolvement(editingNpcInvolvement.id, data)
          }
        />
      )}
    </>
  );
}
