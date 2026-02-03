// NPC components - Enhanced with organization links and ally/enemy relationships

import { Building2, MapPin as Map, Plus, User } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTagManager } from '@/hooks/use-tag-manager';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
  SessionNote,
} from '@/lib/schemas/campaign';

import {
  QuestAppearancesSection,
  SessionAppearancesSection,
} from './entity-appearance-sections';
import { useEntityCardState, useModalState } from './entity-card-utils';
import { RemovableBadge } from './entity-modals';
import {
  NPCRelationshipBadgeList,
  OrgRelationshipBadgeList,
} from './entity-relationship-components';
import { TagInputSection } from './entity-tag-input';
import {
  NPCAlliesSection,
  NPCBasicInfoSection,
  NPCCardHeader,
  NPCDescriptionFieldsSection,
  NPCEnemiesSection,
  NPCKnownLocationsSection,
  NPCModalsSection,
  NPCNotesSection,
  NPCOrganizationsSection,
  type NPCStatusOption,
} from './npc-card-sections';
import { useNPCCardHandlers } from './use-npc-card-handlers';
import { useNPCEntityHandlers } from './use-npc-entity-handlers';

// =====================================================================================
// Status Options with Colors
// =====================================================================================

export const NPC_STATUS_OPTIONS: NPCStatusOption[] = [
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
];

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

  // Entity CRUD handlers (extracted hook)
  const {
    handleAddNPC,
    handleUpdateNPC,
    handleDeleteNPC,
    handleCreateLocation,
    handleCreateOrganization,
    handleCreateNPCWithName,
  } = useNPCEntityHandlers({
    campaignId,
    onSaveStart,
    onNPCsChange,
    onLocationsChange,
    onOrganizationsChange,
  });

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

// Modal keys for useModalState hook
const NPC_MODAL_KEYS = [
  'deleteConfirm',
  'locationPicker',
  'orgPicker',
  'allyNPCPicker',
  'enemyNPCPicker',
  'allyOrgPicker',
  'enemyOrgPicker',
] as const;
type NPCModalKey = (typeof NPC_MODAL_KEYS)[number];

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
  // Shared state management hook
  const {
    localEntity: localNPC,
    setLocalEntity: setLocalNPC,
    scheduleAutoSave,
    handleTextChange,
    handleBlur,
  } = useEntityCardState({
    entity: npc,
    normalizer: normalizeNPC,
    onUpdate,
    onSaveStart,
    onPendingChange,
  });

  // Modal state management
  const { modals, openModal, closeModal, setModalOpen } =
    useModalState<NPCModalKey>(NPC_MODAL_KEYS);

  // Tag management hook
  const { tagInput, setTagInput, addTag, removeTag } = useTagManager({
    entity: localNPC,
    setEntity: setLocalNPC,
    scheduleAutoSave,
  });

  // Consolidated handlers hook
  const {
    locationHandlers,
    orgHandlers,
    allyNpcHandlers,
    enemyNpcHandlers,
    allyOrgHandlers,
    enemyOrgHandlers,
    handleAddAllyNPC,
    handleAddEnemyNPC,
    handleAddAllyOrg,
    handleAddEnemyOrg,
    handleStatusChange,
    getLocationName,
    getOrgName,
    otherNPCs,
  } = useNPCCardHandlers({
    localNPC,
    setLocalNPC,
    scheduleAutoSave,
    closeModal,
    allNPCs,
    locations,
    organizations,
  });

  const statusInfo = NPC_STATUS_OPTIONS.find(s => s.value === localNPC.status);

  return (
    <>
      <Card className="overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <NPCCardHeader
            localNPC={localNPC}
            isExpanded={isExpanded}
            statusInfo={statusInfo}
            onOpenDeleteModal={() => openModal('deleteConfirm')}
          />

          <CollapsibleContent>
            <CardContent className="space-y-6 pt-6">
              <NPCBasicInfoSection
                localNPC={localNPC}
                statusOptions={NPC_STATUS_OPTIONS}
                handleTextChange={handleTextChange}
                handleBlur={handleBlur}
                handleStatusChange={handleStatusChange}
              />

              <NPCDescriptionFieldsSection
                localNPC={localNPC}
                handleTextChange={handleTextChange}
                handleBlur={handleBlur}
              />

              <Separator />

              {/* Organizations */}
              <NPCOrganizationsSection
                onOpenPicker={() => openModal('orgPicker')}
              >
                {(localNPC.organizationIds ?? []).length === 0 ? (
                  <span className="text-muted-foreground text-sm">
                    No organizations linked
                  </span>
                ) : (
                  (localNPC.organizationIds ?? []).map(id => (
                    <RemovableBadge
                      key={id}
                      icon={<Building2 className="h-3 w-3" />}
                      onRemove={() => orgHandlers.handleRemove(id)}
                    >
                      {getOrgName(id)}
                    </RemovableBadge>
                  ))
                )}
              </NPCOrganizationsSection>

              {/* Known Locations */}
              <NPCKnownLocationsSection
                onOpenPicker={() => openModal('locationPicker')}
              >
                {(localNPC.locationIds ?? []).length === 0 ? (
                  <span className="text-muted-foreground text-sm">
                    No locations linked
                  </span>
                ) : (
                  (localNPC.locationIds ?? []).map(id => (
                    <RemovableBadge
                      key={id}
                      icon={<Map className="h-3 w-3" />}
                      onRemove={() => locationHandlers.handleRemove(id)}
                    >
                      {getLocationName(id)}
                    </RemovableBadge>
                  ))
                )}
              </NPCKnownLocationsSection>

              <Separator />

              {/* Allies Section */}
              <NPCAlliesSection
                alliesNPCContent={
                  <NPCRelationshipBadgeList
                    label="Allied NPCs"
                    npcs={otherNPCs}
                    selectedIds={localNPC.allyNpcIds ?? []}
                    onToggle={allyNpcHandlers.handleToggle}
                    onAddClick={() => openModal('allyNPCPicker')}
                  />
                }
                alliesOrgContent={
                  <OrgRelationshipBadgeList
                    label="Allied Organizations"
                    organizations={organizations}
                    selectedIds={localNPC.allyOrganizationIds ?? []}
                    onToggle={allyOrgHandlers.handleToggle}
                    onAddClick={() => openModal('allyOrgPicker')}
                  />
                }
              />

              {/* Enemies Section */}
              <NPCEnemiesSection
                enemiesNPCContent={
                  <NPCRelationshipBadgeList
                    label="Enemy NPCs"
                    npcs={otherNPCs}
                    selectedIds={localNPC.enemyNpcIds ?? []}
                    onToggle={enemyNpcHandlers.handleToggle}
                    onAddClick={() => openModal('enemyNPCPicker')}
                    isEnemy
                  />
                }
                enemiesOrgContent={
                  <OrgRelationshipBadgeList
                    label="Enemy Organizations"
                    organizations={organizations}
                    selectedIds={localNPC.enemyOrganizationIds ?? []}
                    onToggle={enemyOrgHandlers.handleToggle}
                    onAddClick={() => openModal('enemyOrgPicker')}
                    isEnemy
                  />
                }
              />

              <Separator />

              {/* Session Appearances (Read-only) */}
              <SessionAppearancesSection
                appearances={localNPC.sessionAppearances ?? []}
                getLocationName={getLocationName}
                quests={quests}
              />

              {/* Quest Appearances (Read-only) */}
              <QuestAppearancesSection
                appearances={localNPC.questAppearances ?? []}
                getLocationName={getLocationName}
                sessions={sessions}
              />

              {((localNPC.sessionAppearances ?? []).length > 0 ||
                (localNPC.questAppearances ?? []).length > 0) && <Separator />}

              {/* Tags */}
              <TagInputSection
                tags={localNPC.tags}
                tagInput={tagInput}
                onInputChange={setTagInput}
                onAdd={addTag}
                onRemove={removeTag}
              />

              <NPCNotesSection
                localNPC={localNPC}
                handleTextChange={handleTextChange}
                handleBlur={handleBlur}
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <NPCModalsSection
        modals={modals}
        setModalOpen={setModalOpen}
        localNPC={localNPC}
        locations={locations}
        organizations={organizations}
        otherNPCs={otherNPCs}
        quests={quests}
        onDelete={onDelete}
        locationHandlers={locationHandlers}
        orgHandlers={orgHandlers}
        handleAddAllyNPC={handleAddAllyNPC}
        handleAddEnemyNPC={handleAddEnemyNPC}
        handleAddAllyOrg={handleAddAllyOrg}
        handleAddEnemyOrg={handleAddEnemyOrg}
        onCreateLocation={onCreateLocation}
        onCreateOrganization={onCreateOrganization}
        onCreateNPC={onCreateNPC}
      />
    </>
  );
}
