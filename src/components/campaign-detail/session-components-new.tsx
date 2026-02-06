// Session components - Enhanced with NPC involvement tracking

import { Plus, Scroll } from 'lucide-react';
import {
  Fragment,
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
} from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
  SessionNote,
  SessionNPCInvolvement,
} from '@/lib/schemas/campaign';

import {
  useEntityCardState,
  useModalState,
  useNPCInvolvementHandlers,
} from './entity-card-utils';
import {
  SessionBasicInfoSection,
  SessionCardHeader,
  SessionHighlightsSection,
  SessionLocationsSection,
  SessionModalsSection,
  SessionNPCsSection,
  SessionOrganizationsSection,
  SessionPlayerNotesSection,
  SessionQuestProgressSection,
  SessionQuestsSection,
  SessionRewardsSection,
} from './session-card-sections';
import { useHighlightHandlers } from './use-highlight-handlers';
import { useSessionCardHandlers } from './use-session-card-handlers';
import { useSessionEntityHandlers } from './use-session-entity-handlers';

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
// Session Timeline
// =====================================================================================

function SessionTimeline({ sessions }: { sessions: SessionNote[] }) {
  if (sessions.length < 2) return null;

  return (
    <div className="mb-4 overflow-x-auto pb-2">
      <div className="flex min-w-fit items-center gap-1 px-2">
        {sessions.map((s, i) => {
          const color =
            s.status === 'completed'
              ? 'bg-green-500'
              : s.status === 'in-progress'
                ? 'bg-amber-500'
                : 'bg-blue-400';
          return (
            <Fragment key={s.id}>
              {i > 0 && <div className="bg-border h-0.5 w-4 flex-shrink-0" />}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`h-3 w-3 flex-shrink-0 rounded-full ${color} ring-offset-1 transition-all hover:ring-2`}
                    onClick={() =>
                      document
                        .getElementById(`session-${s.id}`)
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                  />
                </TooltipTrigger>
                <TooltipContent>Session {s.sessionNumber}</TooltipContent>
              </Tooltip>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const nextSessionNumber =
    sessions.length > 0
      ? Math.max(...sessions.map(s => s.sessionNumber)) + 1
      : 1;

  // Entity CRUD handlers (extracted hook)
  const {
    error,
    handleAddSession,
    handleUpdateSession,
    handleDeleteSession,
    handleCreateNPC,
    handleCreateLocation,
    handleCreateQuest,
    handleCreateOrganization,
  } = useSessionEntityHandlers({
    campaignId,
    nextSessionNumber,
    onSaveStart,
    onSessionsChange,
    onNPCsChange,
    onLocationsChange,
    onQuestsChange,
    onOrganizationsChange,
  });

  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => b.sessionNumber - a.sessionNumber),
    [sessions]
  );
  const filteredSessions = useMemo(
    () =>
      sortedSessions.filter(session => {
        const query = deferredSearchQuery.trim().toLowerCase();
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
      }),
    [sortedSessions, deferredSearchQuery]
  );

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
            <p className="text-muted-foreground mx-auto mb-4 max-w-sm text-sm">
              Record what happens each session — key events, NPC interactions,
              quest progress, and memorable moments. Great session notes make it
              easy to pick up where you left off.
            </p>
            <Button onClick={handleAddSession} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add First Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <SessionTimeline sessions={filteredSessions} />
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              {filteredSessions.length} sessions
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const allExpanded = filteredSessions.every(s =>
                  expandedIds.has(s.id)
                );
                setExpandedIds(
                  allExpanded
                    ? new Set()
                    : new Set(filteredSessions.map(s => s.id))
                );
              }}
            >
              {filteredSessions.every(s => expandedIds.has(s.id))
                ? 'Collapse All'
                : 'Expand All'}
            </Button>
          </div>
          {filteredSessions.map(session => (
            <div key={session.id} id={`session-${session.id}`}>
              <SessionCard
                session={session}
                npcs={npcs}
                locations={locations}
                quests={quests}
                organizations={organizations}
                isExpanded={expandedIds.has(session.id)}
                onToggle={() =>
                  setExpandedIds(prev => {
                    const next = new Set(prev);
                    if (next.has(session.id)) next.delete(session.id);
                    else next.add(session.id);
                    return next;
                  })
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
            </div>
          ))}
        </>
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

const SESSION_MODAL_KEYS = [
  'npcPicker',
  'locationPicker',
  'questPicker',
  'orgPicker',
] as const;
type SessionModalKey = (typeof SESSION_MODAL_KEYS)[number];

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
  const [editingNpcInvolvement, setEditingNpcInvolvement] =
    useState<SessionNPCInvolvement | null>(null);

  // Use shared entity state hook
  const {
    localEntity: localSession,
    setLocalEntity: setLocalSession,
    scheduleAutoSave,
    handleTextChange,
    handleBlur,
  } = useEntityCardState({
    entity: session,
    normalizer: normalizeSession,
    onUpdate: async updates => {
      await onUpdate(
        updates as Partial<Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>>
      );
    },
    onSaveStart,
    onPendingChange,
  });

  // Use shared modal state hook
  const { modals, openModal, setModalOpen } =
    useModalState<SessionModalKey>(SESSION_MODAL_KEYS);

  // Key Highlights handlers (extracted hook)
  const { highlightInput, setHighlightInput, addHighlight, removeHighlight } =
    useHighlightHandlers({
      setLocalEntity: setLocalSession,
      scheduleAutoSave,
    });

  // Consolidated entity handlers hook
  const {
    locationHandlers,
    questHandlers,
    orgHandlers,
    handleDateChange,
    createSessionNPCInvolvement,
  } = useSessionCardHandlers({
    localSession,
    setLocalSession,
    scheduleAutoSave,
  });

  const {
    handleAddNPC,
    handleRemoveNPCById: handleRemoveNPC,
    handleUpdateNPCInvolvement: handleUpdateNPCInvolvementRaw,
  } = useNPCInvolvementHandlers<SessionNote, SessionNPCInvolvement>({
    setLocalEntity: setLocalSession,
    scheduleAutoSave,
    involvementField: 'npcsInvolved',
    createInvolvement: createSessionNPCInvolvement,
  });

  // Wrapper to match existing signature (involvementId, data) -> full involvement
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
      // Find existing and merge
      const existing = (localSession.npcsInvolved ?? []).find(
        n => n.id === involvementId
      );
      if (existing) {
        handleUpdateNPCInvolvementRaw({ ...existing, ...data });
      }
    },
    [localSession.npcsInvolved, handleUpdateNPCInvolvementRaw]
  );

  return (
    <>
      <Card className="overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <SessionCardHeader
            session={localSession}
            isExpanded={isExpanded}
            onDelete={onDelete}
            onStatusChange={value => handleTextChange('status', value)}
            onGenerateRecap={() => {
              const template = `## Session ${localSession.sessionNumber} Recap\n**Date**: ${localSession.date ?? 'TBD'}\n\n### What Happened\n- \n\n### Key NPCs Encountered\n- \n\n### Important Decisions\n- \n\n### Cliffhanger / Next Session Hook\n- \n\n### Player Highlights\n- `;
              handleTextChange('summary', template);
            }}
          />

          <CollapsibleContent>
            <CardContent className="space-y-6 pt-6">
              <SessionBasicInfoSection
                session={localSession}
                onTextChange={handleTextChange}
                onBlur={handleBlur}
                onDateChange={handleDateChange}
              />

              <SessionHighlightsSection
                highlights={localSession.keyHighlights ?? []}
                highlightInput={highlightInput}
                onInputChange={setHighlightInput}
                onAddHighlight={addHighlight}
                onRemoveHighlight={removeHighlight}
              />

              <Separator />

              <SessionNPCsSection
                npcsInvolved={localSession.npcsInvolved ?? []}
                npcs={npcs}
                onOpenNpcPicker={() => openModal('npcPicker')}
                onEditNPC={setEditingNpcInvolvement}
                onRemoveNPC={npcId => {
                  const inv = (localSession.npcsInvolved ?? []).find(
                    n => n.npcId === npcId
                  );
                  if (inv) handleRemoveNPC(inv.id);
                }}
              />

              <Separator />

              <SessionLocationsSection
                locationIds={localSession.locationIds ?? []}
                locations={locations}
                onOpenLocationPicker={() => openModal('locationPicker')}
                onRemoveLocation={locationHandlers.handleRemove}
              />

              <SessionQuestsSection
                questIds={localSession.questIds ?? []}
                quests={quests}
                onOpenQuestPicker={() => openModal('questPicker')}
                onRemoveQuest={questHandlers.handleRemove}
              />

              <SessionOrganizationsSection
                organizationIds={localSession.organizationIds ?? []}
                organizations={organizations}
                onOpenOrgPicker={() => openModal('orgPicker')}
                onRemoveOrganization={orgHandlers.handleRemove}
              />

              <Separator />

              <SessionQuestProgressSection
                questProgress={localSession.questProgress ?? ''}
                onTextChange={handleTextChange}
                onBlur={handleBlur}
              />

              <SessionRewardsSection
                rewards={localSession.rewards ?? ''}
                onTextChange={handleTextChange}
                onBlur={handleBlur}
              />

              <SessionPlayerNotesSection
                playerNotes={localSession.playerNotes}
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <SessionModalsSection
        modals={modals}
        setModalOpen={setModalOpen}
        npcs={npcs}
        locations={locations}
        quests={quests}
        organizations={organizations}
        session={localSession}
        onAddNPC={handleAddNPC}
        onCreateNPC={onCreateNPC}
        onAddLocation={locationHandlers.handleAdd}
        onCreateLocation={onCreateLocation}
        onAddQuest={questHandlers.handleAdd}
        onCreateQuest={onCreateQuest}
        onAddOrganization={orgHandlers.handleAdd}
        onCreateOrganization={onCreateOrganization}
        editingNpcInvolvement={editingNpcInvolvement}
        onCloseNpcEditor={() => setEditingNpcInvolvement(null)}
        onUpdateNPCInvolvement={handleUpdateNPCInvolvement}
      />
    </>
  );
}
