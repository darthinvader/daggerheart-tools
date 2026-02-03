// Session card section components - extracted to reduce complexity

import {
  Building2,
  Calendar,
  ChevronDown,
  Lightbulb,
  Map,
  Plus,
  Scroll,
  Sparkles,
  Target,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  SessionNote,
  SessionNPCInvolvement,
} from '@/lib/schemas/campaign';
import {
  EntityBadgeList,
  LocationPickerModal,
  NPCInvolvementEditorModal,
  NPCPickerModal,
  OrganizationPickerModal,
  QuestPickerModal,
  RemovableBadge,
} from './entity-modals';

// =====================================================================================
// Header Component
// =====================================================================================

interface SessionCardHeaderProps {
  session: SessionNote;
  isExpanded: boolean;
  onDelete: () => void;
}

export function SessionCardHeader({
  session,
  isExpanded,
  onDelete,
}: SessionCardHeaderProps) {
  return (
    <CardHeader className="bg-muted/30 py-3">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="h-auto flex-1 justify-start p-0">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
                {session.sessionNumber}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{session.title}</span>
                </div>
                {session.date && (
                  <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    {session.date}
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
  );
}

// =====================================================================================
// Basic Info Section
// =====================================================================================

interface SessionBasicInfoSectionProps {
  session: SessionNote;
  onTextChange: <K extends keyof SessionNote>(
    field: K,
    value: SessionNote[K]
  ) => void;
  onBlur: () => void;
  onDateChange: (value: string) => void;
}

export function SessionBasicInfoSection({
  session,
  onTextChange,
  onBlur,
  onDateChange,
}: SessionBasicInfoSectionProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs">
            <Scroll className="h-3 w-3" />
            Session Title
          </Label>
          <Input
            value={session.title}
            onChange={e => onTextChange('title', e.target.value)}
            onBlur={onBlur}
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
            value={session.date ?? ''}
            onChange={e => onDateChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs">
          <Sparkles className="h-3 w-3 text-amber-500" />
          Session Summary
        </Label>
        <Textarea
          value={session.summary}
          onChange={e => onTextChange('summary', e.target.value)}
          onBlur={onBlur}
          rows={4}
          placeholder="What happened during this session..."
        />
      </div>
    </>
  );
}

// =====================================================================================
// Key Highlights Section
// =====================================================================================

interface SessionHighlightsSectionProps {
  highlights: string[];
  highlightInput: string;
  onInputChange: (value: string) => void;
  onAddHighlight: () => void;
  onRemoveHighlight: (index: number) => void;
}

export function SessionHighlightsSection({
  highlights,
  highlightInput,
  onInputChange,
  onAddHighlight,
  onRemoveHighlight,
}: SessionHighlightsSectionProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs">
        <Lightbulb className="h-3 w-3 text-yellow-500" />
        Key Highlights
      </Label>
      <div className="flex flex-wrap gap-2">
        {highlights.map((highlight, idx) => (
          <Badge key={idx} variant="outline" className="gap-1 pr-1">
            {highlight}
            <button
              type="button"
              onClick={() => onRemoveHighlight(idx)}
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
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddHighlight();
            }
          }}
          placeholder="Add a highlight..."
          className="flex-1"
        />
        <Button variant="outline" size="icon" onClick={onAddHighlight}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// =====================================================================================
// NPCs Section
// =====================================================================================

interface SessionNPCsSectionProps {
  npcsInvolved: SessionNPCInvolvement[];
  npcs: CampaignNPC[];
  onOpenNpcPicker: () => void;
  onEditNPC: (inv: SessionNPCInvolvement) => void;
  onRemoveNPC: (npcId: string) => void;
}

export function SessionNPCsSection({
  npcsInvolved,
  npcs,
  onOpenNpcPicker,
  onEditNPC,
  onRemoveNPC,
}: SessionNPCsSectionProps) {
  const getNpcName = (id: string) =>
    npcs.find(n => n.id === id)?.name ?? 'Unknown';

  return (
    <div className="space-y-3">
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
          No NPCs added yet. Click "Add NPC" to include characters in this
          session.
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {npcsInvolved.map(inv => (
            <Card key={inv.id} className="bg-muted/20">
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
                      <Sparkles className="h-3 w-3" />
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
// Plot Hooks Section
// =====================================================================================

interface SessionPlotHooksSectionProps {
  openPlotHooks: string;
  resolvedPlotHooks: string;
  onTextChange: (field: string, value: string) => void;
  onBlur: () => void;
}

export function SessionPlotHooksSection({
  openPlotHooks,
  resolvedPlotHooks,
  onTextChange,
  onBlur,
}: SessionPlotHooksSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs">
          <Target className="h-3 w-3 text-amber-500" />
          Open Plot Hooks
        </Label>
        <Textarea
          value={openPlotHooks}
          onChange={e => onTextChange('openPlotHooks', e.target.value)}
          onBlur={onBlur}
          rows={3}
          placeholder="Unresolved threads for future sessions..."
        />
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs">
          <Target className="h-3 w-3 text-green-500" />
          Resolved Plot Hooks
        </Label>
        <Textarea
          value={resolvedPlotHooks}
          onChange={e => onTextChange('resolvedPlotHooks', e.target.value)}
          onBlur={onBlur}
          rows={3}
          placeholder="Threads resolved in this session..."
        />
      </div>
    </div>
  );
}

// =====================================================================================
// Notes Section
// =====================================================================================

interface SessionNotesSectionProps {
  gmNotes: string;
  onTextChange: (field: string, value: string) => void;
  onBlur: () => void;
}

export function SessionNotesSection({
  gmNotes,
  onTextChange,
  onBlur,
}: SessionNotesSectionProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">GM Notes</Label>
      <Textarea
        value={gmNotes}
        onChange={e => onTextChange('gmNotes', e.target.value)}
        onBlur={onBlur}
        placeholder="Private notes for the GM..."
        rows={2}
      />
    </div>
  );
}

// =====================================================================================
// Locations Section
// =====================================================================================

interface SessionLocationsSectionProps {
  locationIds: string[];
  locations: CampaignLocation[];
  onOpenLocationPicker: () => void;
  onRemoveLocation: (id: string) => void;
}

export function SessionLocationsSection({
  locationIds,
  locations,
  onOpenLocationPicker,
  onRemoveLocation,
}: SessionLocationsSectionProps) {
  const getLocationName = (id: string) =>
    locations.find(l => l.id === id)?.name ?? 'Unknown';

  return (
    <EntityBadgeList
      label="Locations Visited"
      icon={<Map className="h-3 w-3" />}
      iconColor="text-emerald-500"
      emptyText="No locations added"
      onAdd={onOpenLocationPicker}
      addLabel="Add Location"
    >
      {locationIds.map(id => (
        <RemovableBadge
          key={id}
          icon={<Map className="h-3 w-3" />}
          onRemove={() => onRemoveLocation(id)}
        >
          {getLocationName(id)}
        </RemovableBadge>
      ))}
    </EntityBadgeList>
  );
}

// =====================================================================================
// Quests Section
// =====================================================================================

interface SessionQuestsSectionProps {
  questIds: string[];
  quests: CampaignQuest[];
  onOpenQuestPicker: () => void;
  onRemoveQuest: (id: string) => void;
}

export function SessionQuestsSection({
  questIds,
  quests,
  onOpenQuestPicker,
  onRemoveQuest,
}: SessionQuestsSectionProps) {
  const getQuestTitle = (id: string) =>
    quests.find(q => q.id === id)?.title ?? 'Unknown';

  return (
    <EntityBadgeList
      label="Quests Involved"
      icon={<Scroll className="h-3 w-3" />}
      iconColor="text-amber-500"
      emptyText="No quests linked"
      onAdd={onOpenQuestPicker}
      addLabel="Add Quest"
    >
      {questIds.map(id => (
        <RemovableBadge
          key={id}
          icon={<Scroll className="h-3 w-3" />}
          onRemove={() => onRemoveQuest(id)}
        >
          {getQuestTitle(id)}
        </RemovableBadge>
      ))}
    </EntityBadgeList>
  );
}

// =====================================================================================
// Organizations Section
// =====================================================================================

interface SessionOrganizationsSectionProps {
  organizationIds: string[];
  organizations: CampaignOrganization[];
  onOpenOrgPicker: () => void;
  onRemoveOrganization: (id: string) => void;
}

export function SessionOrganizationsSection({
  organizationIds,
  organizations,
  onOpenOrgPicker,
  onRemoveOrganization,
}: SessionOrganizationsSectionProps) {
  const getOrgName = (id: string) =>
    organizations.find(o => o.id === id)?.name ?? 'Unknown';

  return (
    <EntityBadgeList
      label="Organizations Referenced"
      icon={<Building2 className="h-3 w-3" />}
      iconColor="text-purple-500"
      emptyText="No organizations linked"
      onAdd={onOpenOrgPicker}
      addLabel="Add Organization"
    >
      {organizationIds.map(id => (
        <RemovableBadge
          key={id}
          icon={<Building2 className="h-3 w-3" />}
          onRemove={() => onRemoveOrganization(id)}
        >
          {getOrgName(id)}
        </RemovableBadge>
      ))}
    </EntityBadgeList>
  );
}

// =====================================================================================
// Quest Progress Section
// =====================================================================================

interface SessionQuestProgressSectionProps {
  questProgress: string;
  onTextChange: <K extends keyof SessionNote>(
    field: K,
    value: SessionNote[K]
  ) => void;
  onBlur: () => void;
}

export function SessionQuestProgressSection({
  questProgress,
  onTextChange,
  onBlur,
}: SessionQuestProgressSectionProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">Quest/Story Progress Notes</Label>
      <Textarea
        value={questProgress}
        onChange={e => onTextChange('questProgress', e.target.value)}
        onBlur={onBlur}
        placeholder="Notes on story or quest advancement..."
        rows={2}
      />
    </div>
  );
}

// =====================================================================================
// Player Notes Section
// =====================================================================================

interface SessionPlayerNotesSectionProps {
  playerNotes: Array<{ playerName: string; note: string }> | undefined;
}

export function SessionPlayerNotesSection({
  playerNotes,
}: SessionPlayerNotesSectionProps) {
  if (!playerNotes?.length) return null;

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs">
        <Users className="h-3 w-3" />
        Player Notes
      </Label>
      <div className="space-y-2">
        {playerNotes.map((pn, i) => (
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
  );
}

// =====================================================================================
// Modals Section
// =====================================================================================

interface SessionModalsSectionProps {
  modals: {
    npcPicker: boolean;
    locationPicker: boolean;
    questPicker: boolean;
    orgPicker: boolean;
  };
  setModalOpen: (
    key: 'npcPicker' | 'locationPicker' | 'questPicker' | 'orgPicker',
    open: boolean
  ) => void;
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  organizations: CampaignOrganization[];
  session: SessionNote;
  onAddNPC: (result: {
    npcId: string;
    npcName: string;
    role: string;
    actionsTaken: string;
    notes: string;
    locationIds: string[];
  }) => void;
  onCreateNPC: (name: string) => Promise<string>;
  onAddLocation: (id: string) => void;
  onCreateLocation: (
    name: string,
    type: CampaignLocation['type']
  ) => Promise<string>;
  onAddQuest: (id: string) => void;
  onCreateQuest: (
    title: string,
    type: CampaignQuest['type']
  ) => Promise<string>;
  onAddOrganization: (id: string) => void;
  onCreateOrganization: (
    name: string,
    type: CampaignOrganization['type']
  ) => Promise<string>;
  editingNpcInvolvement: SessionNPCInvolvement | null;
  onCloseNpcEditor: () => void;
  onUpdateNPCInvolvement: (
    id: string,
    data: {
      role: string;
      actionsTaken: string;
      notes: string;
      locationIds: string[];
      questIds: string[];
    }
  ) => void;
}

export function SessionModalsSection({
  modals,
  setModalOpen,
  npcs,
  locations,
  quests,
  organizations,
  session,
  onAddNPC,
  onCreateNPC,
  onAddLocation,
  onCreateLocation,
  onAddQuest,
  onCreateQuest,
  onAddOrganization,
  onCreateOrganization,
  editingNpcInvolvement,
  onCloseNpcEditor,
  onUpdateNPCInvolvement,
}: SessionModalsSectionProps) {
  const getNpcInvolvementIds = () =>
    (session.npcsInvolved ?? []).map(n => n.npcId);

  return (
    <>
      <NPCPickerModal
        open={modals.npcPicker}
        onOpenChange={open => setModalOpen('npcPicker', open)}
        npcs={npcs}
        locations={locations}
        quests={quests}
        selectedNpcIds={getNpcInvolvementIds()}
        onSelectNPC={onAddNPC}
        onCreateNPC={onCreateNPC}
        title="Add NPC to Session"
        description="Select an existing NPC or create a new one to add to this session"
        showInvolvementFields
      />

      <LocationPickerModal
        open={modals.locationPicker}
        onOpenChange={open => setModalOpen('locationPicker', open)}
        locations={locations}
        selectedLocationIds={session.locationIds ?? []}
        onSelectLocation={onAddLocation}
        onCreateLocation={onCreateLocation}
        title="Add Location to Session"
        description="Select a location that was visited during this session"
      />

      <QuestPickerModal
        open={modals.questPicker}
        onOpenChange={open => setModalOpen('questPicker', open)}
        quests={quests}
        selectedQuestIds={session.questIds ?? []}
        onSelectQuest={onAddQuest}
        onCreateQuest={onCreateQuest}
        title="Link Quest to Session"
        description="Select a quest that was involved in this session"
      />

      <OrganizationPickerModal
        open={modals.orgPicker}
        onOpenChange={open => setModalOpen('orgPicker', open)}
        organizations={organizations}
        selectedOrganizationIds={session.organizationIds ?? []}
        onSelectOrganization={onAddOrganization}
        onCreateOrganization={onCreateOrganization}
        title="Link Organization to Session"
        description="Select an organization that was referenced in this session"
      />

      {editingNpcInvolvement && (
        <NPCInvolvementEditorModal
          open={true}
          onOpenChange={() => onCloseNpcEditor()}
          npcName={editingNpcInvolvement.npcName ?? 'Unknown NPC'}
          role={editingNpcInvolvement.role}
          actionsTaken={editingNpcInvolvement.actionsTaken}
          notes={editingNpcInvolvement.notes}
          locationIds={editingNpcInvolvement.locationIds ?? []}
          questIds={editingNpcInvolvement.questIds ?? []}
          locations={locations}
          quests={quests}
          onSave={data =>
            onUpdateNPCInvolvement(editingNpcInvolvement.id, data)
          }
        />
      )}
    </>
  );
}
