// Organization components - Enhanced with consistent modal-based entity selection

import {
  Building2,
  Crown,
  Eye,
  Flag,
  Key,
  Plus,
  Shield,
  Swords,
  Users,
} from 'lucide-react';
import { useDeferredValue, useMemo, useState } from 'react';

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
} from '@/lib/schemas/campaign';
import {
  DeleteConfirmDialog,
  type NPCPickerResult,
  useEntityCardState,
  useModalState,
} from './entity-card-utils';
import {
  LocationPickerModal,
  NPCPickerModal,
  OrganizationPickerModal,
  QuestPickerModal,
} from './entity-modals';
import {
  OrganizationBasicInfoSection,
  OrganizationCardHeader,
  OrganizationHeadquartersSection,
  OrganizationLocationsQuestsSection,
  OrganizationMembersSection,
  OrganizationNotesSection,
  OrganizationRelationshipsSection,
  OrganizationSessionAppearancesSection,
  type OrganizationTypeOption,
} from './organization-card-sections';
import { useOrganizationCardHandlers } from './use-organization-card-handlers';
import { useOrganizationEntityHandlers } from './use-organization-entity-handlers';

// =====================================================================================
// Constants
// =====================================================================================

type OrganizationType = CampaignOrganization['type'];

export const ORGANIZATION_TYPE_OPTIONS: OrganizationTypeOption[] = [
  {
    value: 'guild',
    label: 'Guild',
    Icon: Building2,
    color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  },
  {
    value: 'faction',
    label: 'Faction',
    Icon: Flag,
    color: 'bg-red-500/20 text-red-600 dark:text-red-400',
  },
  {
    value: 'government',
    label: 'Government',
    Icon: Crown,
    color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
  },
  {
    value: 'religious',
    label: 'Religious',
    Icon: Eye,
    color: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
  },
  {
    value: 'criminal',
    label: 'Criminal',
    Icon: Swords,
    color: 'bg-slate-500/20 text-slate-600 dark:text-slate-400',
  },
  {
    value: 'mercenary',
    label: 'Mercenary',
    Icon: Shield,
    color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
  },
  {
    value: 'merchant',
    label: 'Merchant',
    Icon: Building2,
    color: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  },
  {
    value: 'secret',
    label: 'Secret Society',
    Icon: Key,
    color: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
  },
  {
    value: 'other',
    label: 'Other',
    Icon: Users,
    color: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
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
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Entity CRUD handlers (extracted hook)
  const {
    handleAddOrganization,
    handleUpdateOrganization,
    handleDeleteOrganization,
    handleCreateNPC,
    handleCreateLocation,
    handleCreateQuest,
    handleCreateOrganization,
  } = useOrganizationEntityHandlers({
    campaignId,
    onSaveStart,
    onOrganizationsChange,
    onNPCsChange,
    onLocationsChange,
    onQuestsChange,
  });

  const filteredOrganizations = useMemo(
    () =>
      organizations
        .filter(org => (typeFilter ? org.type === typeFilter : true))
        .filter(org => {
          const query = deferredSearchQuery.trim().toLowerCase();
          if (!query) return true;
          return [org.name, org.type, org.tags.join(' ')]
            .join(' ')
            .toLowerCase()
            .includes(query);
        }),
    [organizations, typeFilter, deferredSearchQuery]
  );

  const sortedOrganizations = useMemo(
    () =>
      [...filteredOrganizations].sort((a, b) => a.name.localeCompare(b.name)),
    [filteredOrganizations]
  );

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

      {organizations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Building2 className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="mb-2 font-medium">No organizations created yet</h3>
            <p className="text-muted-foreground mx-auto mb-4 max-w-sm text-sm">
              Create the guilds, governments, cults, and factions that shape
              your world. Track their goals, resources, and relationships with
              the party.
            </p>
            <Button onClick={handleAddOrganization} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add First Organization
            </Button>
          </CardContent>
        </Card>
      ) : sortedOrganizations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-sm">
              No results match your search or filters
            </p>
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
  ) => Promise<void>;
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

// Modal keys for OrganizationCard
const ORG_MODAL_KEYS = [
  'deleteConfirm',
  'keyMembersPicker',
  'allyNpcsPicker',
  'enemyNpcsPicker',
  'allyOrgsPicker',
  'enemyOrgsPicker',
  'locationsPicker',
  'questsPicker',
  'hqPicker',
] as const;
type OrgModalKey = (typeof ORG_MODAL_KEYS)[number];

// =====================================================================================
// Organization Card Modals Sub-component
// =====================================================================================

interface OrganizationCardModalsProps {
  modals: Record<OrgModalKey, boolean>;
  setModalOpen: (key: OrgModalKey, open: boolean) => void;
  localOrg: CampaignOrganization;
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  otherOrganizations: CampaignOrganization[];
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
  handleAddKeyMember: (result: NPCPickerResult) => void;
  handleAddAllyNpc: (result: NPCPickerResult) => void;
  handleAddEnemyNpc: (result: NPCPickerResult) => void;
  handleAddAllyOrg: (id: string) => void;
  handleAddEnemyOrg: (id: string) => void;
  handleSetHQ: (id: string) => void;
  handleAddLocation: (id: string) => void;
  handleAddQuest: (id: string) => void;
}

function OrganizationCardModals({
  modals,
  setModalOpen,
  localOrg,
  npcs,
  locations,
  quests,
  otherOrganizations,
  onDelete,
  onCreateNPC,
  onCreateLocation,
  onCreateQuest,
  onCreateOrganization,
  handleAddKeyMember,
  handleAddAllyNpc,
  handleAddEnemyNpc,
  handleAddAllyOrg,
  handleAddEnemyOrg,
  handleSetHQ,
  handleAddLocation,
  handleAddQuest,
}: OrganizationCardModalsProps) {
  return (
    <>
      <DeleteConfirmDialog
        open={modals.deleteConfirm}
        onOpenChange={open => setModalOpen('deleteConfirm', open)}
        entityType="Organization"
        entityName={localOrg.name}
        onDelete={onDelete}
      />

      <NPCPickerModal
        open={modals.keyMembersPicker}
        onOpenChange={open => setModalOpen('keyMembersPicker', open)}
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
        open={modals.allyNpcsPicker}
        onOpenChange={open => setModalOpen('allyNpcsPicker', open)}
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
        open={modals.enemyNpcsPicker}
        onOpenChange={open => setModalOpen('enemyNpcsPicker', open)}
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
        open={modals.allyOrgsPicker}
        onOpenChange={open => setModalOpen('allyOrgsPicker', open)}
        organizations={otherOrganizations}
        selectedOrganizationIds={localOrg.allyOrganizationIds}
        onSelectOrganization={handleAddAllyOrg}
        onCreateOrganization={onCreateOrganization}
        title="Add Allied Organization"
        description="Select an organization that is allied with this one"
      />

      <OrganizationPickerModal
        open={modals.enemyOrgsPicker}
        onOpenChange={open => setModalOpen('enemyOrgsPicker', open)}
        organizations={otherOrganizations}
        selectedOrganizationIds={localOrg.enemyOrganizationIds}
        onSelectOrganization={handleAddEnemyOrg}
        onCreateOrganization={onCreateOrganization}
        title="Add Enemy Organization"
        description="Select an organization that is an enemy of this one"
      />

      <LocationPickerModal
        open={modals.locationsPicker}
        onOpenChange={open => setModalOpen('locationsPicker', open)}
        locations={locations}
        selectedLocationIds={localOrg.locationIds}
        onSelectLocation={handleAddLocation}
        onCreateLocation={onCreateLocation}
        title="Link Location"
        description="Select a location associated with this organization"
      />

      <LocationPickerModal
        open={modals.hqPicker}
        onOpenChange={open => setModalOpen('hqPicker', open)}
        locations={locations}
        selectedLocationIds={
          localOrg.headquartersId ? [localOrg.headquartersId] : []
        }
        onSelectLocation={handleSetHQ}
        onCreateLocation={onCreateLocation}
        title="Set Headquarters"
        description="Select the headquarters location for this organization"
      />

      <QuestPickerModal
        open={modals.questsPicker}
        onOpenChange={open => setModalOpen('questsPicker', open)}
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

// =====================================================================================
// Organization Card Component
// =====================================================================================

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
  // Shared state management hook
  const {
    localEntity: localOrg,
    setLocalEntity: setLocalOrg,
    scheduleAutoSave,
    handleTextChange,
    handleBlur,
  } = useEntityCardState({
    entity: organization,
    normalizer: normalizeOrganization,
    onUpdate,
    onSaveStart,
    onPendingChange,
  });

  // Modal state management
  const { modals, openModal, closeModal, setModalOpen } =
    useModalState<OrgModalKey>(ORG_MODAL_KEYS);

  // Tag management hook
  const { tagInput, setTagInput, addTag, removeTag } = useTagManager({
    entity: localOrg,
    setEntity: setLocalOrg,
    scheduleAutoSave,
  });

  // Consolidated handlers hook
  const {
    keyMemberHandlers,
    allyNpcHandlers,
    enemyNpcHandlers,
    allyOrgHandlers,
    enemyOrgHandlers,
    locationHandlers,
    questHandlers,
    handleAddKeyMember,
    handleAddAllyNpc,
    handleAddEnemyNpc,
    handleAddAllyOrg,
    handleAddEnemyOrg,
    handleTypeChange,
    handleSetHQ,
    handleClearHQ,
    getNpcName,
    getLocationName,
    getQuestTitle,
    getOrgName,
  } = useOrganizationCardHandlers({
    localOrg,
    setLocalOrg,
    scheduleAutoSave,
    closeModal,
    npcs,
    locations,
    quests,
    otherOrganizations,
  });

  // Named callbacks for opening modals
  const handleOpenDeleteModal = () => openModal('deleteConfirm');
  const handleOpenKeyMembersPicker = () => openModal('keyMembersPicker');
  const handleOpenHQPicker = () => openModal('hqPicker');
  const handleOpenLocationsPicker = () => openModal('locationsPicker');
  const handleOpenQuestsPicker = () => openModal('questsPicker');
  const handleOpenAllyNpcsPicker = () => openModal('allyNpcsPicker');
  const handleOpenEnemyNpcsPicker = () => openModal('enemyNpcsPicker');
  const handleOpenAllyOrgsPicker = () => openModal('allyOrgsPicker');
  const handleOpenEnemyOrgsPicker = () => openModal('enemyOrgsPicker');

  const typeInfo = ORGANIZATION_TYPE_OPTIONS.find(
    t => t.value === localOrg.type
  );

  return (
    <>
      <Card className="overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <OrganizationCardHeader
            localOrg={localOrg}
            isExpanded={isExpanded}
            typeInfo={typeInfo}
            onOpenDeleteModal={handleOpenDeleteModal}
          />

          <CollapsibleContent>
            <CardContent className="space-y-6 pt-6">
              <OrganizationBasicInfoSection
                localOrg={localOrg}
                typeOptions={ORGANIZATION_TYPE_OPTIONS}
                handleTextChange={handleTextChange}
                handleBlur={handleBlur}
                handleTypeChange={handleTypeChange}
              />

              <Separator />

              <OrganizationMembersSection
                keyMemberIds={localOrg.keyMemberIds}
                getNpcName={getNpcName}
                onOpenKeyMembersPicker={handleOpenKeyMembersPicker}
                onRemoveKeyMember={keyMemberHandlers.handleRemove}
              />

              <OrganizationHeadquartersSection
                headquartersId={localOrg.headquartersId}
                getLocationName={getLocationName}
                onOpenHQPicker={handleOpenHQPicker}
                onClearHQ={handleClearHQ}
              />

              <OrganizationLocationsQuestsSection
                locationIds={localOrg.locationIds}
                questIds={localOrg.questIds}
                getLocationName={getLocationName}
                getQuestTitle={getQuestTitle}
                onOpenLocationsPicker={handleOpenLocationsPicker}
                onOpenQuestsPicker={handleOpenQuestsPicker}
                onRemoveLocation={locationHandlers.handleRemove}
                onRemoveQuest={questHandlers.handleRemove}
              />

              <Separator />

              <OrganizationRelationshipsSection
                allyNpcIds={localOrg.allyNpcIds}
                enemyNpcIds={localOrg.enemyNpcIds}
                allyOrganizationIds={localOrg.allyOrganizationIds}
                enemyOrganizationIds={localOrg.enemyOrganizationIds}
                getNpcName={getNpcName}
                getOrgName={getOrgName}
                onOpenAllyNpcsPicker={handleOpenAllyNpcsPicker}
                onOpenEnemyNpcsPicker={handleOpenEnemyNpcsPicker}
                onOpenAllyOrgsPicker={handleOpenAllyOrgsPicker}
                onOpenEnemyOrgsPicker={handleOpenEnemyOrgsPicker}
                onRemoveAllyNpc={allyNpcHandlers.handleRemove}
                onRemoveEnemyNpc={enemyNpcHandlers.handleRemove}
                onRemoveAllyOrg={allyOrgHandlers.handleRemove}
                onRemoveEnemyOrg={enemyOrgHandlers.handleRemove}
              />

              <OrganizationSessionAppearancesSection
                sessionIds={localOrg.sessionIds ?? []}
              />

              <Separator />

              <OrganizationNotesSection
                localOrg={localOrg}
                tags={localOrg.tags}
                tagInput={tagInput}
                onTagInputChange={setTagInput}
                onAddTag={addTag}
                onRemoveTag={removeTag}
                handleTextChange={handleTextChange}
                handleBlur={handleBlur}
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <OrganizationCardModals
        modals={modals}
        setModalOpen={setModalOpen}
        localOrg={localOrg}
        npcs={npcs}
        locations={locations}
        quests={quests}
        otherOrganizations={otherOrganizations}
        onDelete={onDelete}
        onCreateNPC={onCreateNPC}
        onCreateLocation={onCreateLocation}
        onCreateQuest={onCreateQuest}
        onCreateOrganization={onCreateOrganization}
        handleAddKeyMember={handleAddKeyMember}
        handleAddAllyNpc={handleAddAllyNpc}
        handleAddEnemyNpc={handleAddEnemyNpc}
        handleAddAllyOrg={handleAddAllyOrg}
        handleAddEnemyOrg={handleAddEnemyOrg}
        handleSetHQ={handleSetHQ}
        handleAddLocation={locationHandlers.handleAdd}
        handleAddQuest={questHandlers.handleAdd}
      />
    </>
  );
}
