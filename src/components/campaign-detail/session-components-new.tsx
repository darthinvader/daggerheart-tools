// Session components - Enhanced with NPC involvement tracking

import { Plus, Scroll } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
  const [searchQuery, setSearchQuery] = useState('');

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
