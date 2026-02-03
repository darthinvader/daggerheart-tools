// Location components - Enhanced with POI significance and organization links

import {
  Building,
  Map as MapIcon,
  MapPin,
  Mountain,
  Plus,
  TreePine,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
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
import { useTagManager } from '@/hooks/use-tag-manager';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
  SessionNote,
} from '@/lib/schemas/campaign';
import {
  DeleteConfirmDialog,
  useEntityCardState,
  useModalState,
} from './entity-card-utils';
import {
  NPCPickerModal,
  OrganizationPickerModal,
  QuestPickerModal,
} from './entity-modals';
import { TagInputSection } from './entity-tag-input';
import {
  LocationBasicInfoSection,
  LocationCardHeader,
  LocationEntitiesSection,
  LocationPOISection,
  LocationSessionAppearancesSection,
  LocationStateHistorySection,
} from './location-card-sections';
import { useLocationCardHandlers } from './use-location-card-handlers';
import { useLocationEntityHandlers } from './use-location-entity-handlers';
import { usePOIHandlers } from './use-poi-handlers';

// =====================================================================================
// Location Type Config
// =====================================================================================

type LocationIcon = (props: { className?: string }) => ReactNode;

export const LOCATION_TYPE_OPTIONS: Array<{
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
    Icon: MapIcon,
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
    Icon: MapIcon,
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

  // Entity CRUD handlers (extracted hook)
  const {
    handleAddLocation,
    handleUpdateLocation,
    handleDeleteLocation,
    handleCreateNPC,
    handleCreateQuest,
    handleCreateOrganization,
  } = useLocationEntityHandlers({
    campaignId,
    onSaveStart,
    onLocationsChange,
    onNPCsChange,
    onQuestsChange,
    onOrganizationsChange,
  });

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
          <MapIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
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
              <MapIcon className="text-muted-foreground h-6 w-6" />
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

const LOCATION_MODAL_KEYS = [
  'deleteConfirm',
  'npcPicker',
  'questPicker',
  'orgPicker',
] as const;
type LocationModalKey = (typeof LOCATION_MODAL_KEYS)[number];

function LocationCard({
  location,
  npcs,
  quests,
  sessions,
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
  // Use shared entity state hook
  const {
    localEntity: localLocation,
    setLocalEntity: setLocalLocation,
    scheduleAutoSave,
    handleTextChange,
    handleBlur,
  } = useEntityCardState({
    entity: location,
    normalizer: normalizeLocation,
    onUpdate: async updates => {
      await onUpdate(
        updates as Partial<
          Omit<CampaignLocation, 'id' | 'createdAt' | 'updatedAt'>
        >
      );
    },
    onSaveStart,
    onPendingChange,
  });

  // Use shared modal state hook
  const { modals, openModal, setModalOpen } =
    useModalState<LocationModalKey>(LOCATION_MODAL_KEYS);

  // Consolidated handlers hook (entity IDs, type change, name getters)
  const {
    npcHandlers,
    questHandlers,
    orgHandlers,
    handleTypeChange,
    handleAddNPC,
    getNpcName,
    getQuestTitle,
    getOrgName,
  } = useLocationCardHandlers({
    localLocation,
    setLocalLocation,
    scheduleAutoSave,
    npcs,
    quests,
    organizations,
  });

  // Tag management hook
  const { tagInput, setTagInput, addTag, removeTag } = useTagManager({
    entity: localLocation,
    setEntity: setLocalLocation,
    scheduleAutoSave,
  });

  // POI handlers using extracted hook
  const {
    poiName,
    setPoiName,
    poiDesc,
    setPoiDesc,
    poiSignificance,
    setPoiSignificance,
    addPOI,
    removePOI,
  } = usePOIHandlers<CampaignLocation>({
    setLocalEntity: setLocalLocation,
    scheduleAutoSave,
    poiField: 'pointsOfInterest',
  });

  const typeInfo = LOCATION_TYPE_OPTIONS.find(
    t => t.value === localLocation.type
  );
  const TypeIcon = typeInfo?.Icon ?? MapPin;

  return (
    <>
      <Card className="overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <LocationCardHeader
            location={localLocation}
            isExpanded={isExpanded}
            onToggle={onToggle}
            onDeleteClick={() => openModal('deleteConfirm')}
            TypeIcon={TypeIcon}
            typeColor={typeInfo?.color ?? 'bg-gray-500/20'}
          />

          <CollapsibleContent>
            <CardContent className="space-y-6 pt-6">
              {/* Basic Info */}
              <LocationBasicInfoSection
                location={localLocation}
                onTextChange={handleTextChange}
                onBlur={handleBlur}
                onTypeChange={handleTypeChange}
              />

              {/* State & History */}
              <LocationStateHistorySection
                location={localLocation}
                onTextChange={handleTextChange}
                onBlur={handleBlur}
              />

              <Separator />

              {/* Points of Interest */}
              <LocationPOISection
                pointsOfInterest={localLocation.pointsOfInterest}
                poiName={poiName}
                poiDesc={poiDesc}
                poiSignificance={poiSignificance}
                onPoiNameChange={setPoiName}
                onPoiDescChange={setPoiDesc}
                onPoiSignificanceChange={setPoiSignificance}
                onAddPOI={addPOI}
                onRemovePOI={removePOI}
              />

              <Separator />

              {/* Related Entities */}
              <LocationEntitiesSection
                npcIds={localLocation.npcIds ?? []}
                organizationIds={localLocation.organizationIds ?? []}
                questIds={localLocation.questIds ?? []}
                getNpcName={getNpcName}
                getOrgName={getOrgName}
                getQuestTitle={getQuestTitle}
                onOpenNpcPicker={() => openModal('npcPicker')}
                onOpenOrgPicker={() => openModal('orgPicker')}
                onOpenQuestPicker={() => openModal('questPicker')}
                onRemoveNpc={npcHandlers.handleRemove}
                onRemoveOrg={orgHandlers.handleRemove}
                onRemoveQuest={questHandlers.handleRemove}
              />

              {/* Session Appearances */}
              <LocationSessionAppearancesSection
                sessionAppearances={localLocation.sessionAppearances ?? []}
                sessions={sessions}
                npcs={npcs}
                quests={quests}
              />

              <Separator />

              {/* Tags */}
              <TagInputSection
                tags={localLocation.tags}
                tagInput={tagInput}
                onInputChange={setTagInput}
                onAdd={addTag}
                onRemove={removeTag}
              />

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
      <DeleteConfirmDialog
        open={modals.deleteConfirm}
        onOpenChange={open => setModalOpen('deleteConfirm', open)}
        entityType="Location"
        entityName={localLocation.name}
        onDelete={onDelete}
      />

      {/* Modals */}
      <NPCPickerModal
        open={modals.npcPicker}
        onOpenChange={open => setModalOpen('npcPicker', open)}
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
        open={modals.questPicker}
        onOpenChange={open => setModalOpen('questPicker', open)}
        quests={quests}
        selectedQuestIds={localLocation.questIds ?? []}
        onSelectQuest={questHandlers.handleAdd}
        onCreateQuest={onCreateQuest}
        title="Link Quest to Location"
        description="Select a quest related to this location"
      />

      <OrganizationPickerModal
        open={modals.orgPicker}
        onOpenChange={open => setModalOpen('orgPicker', open)}
        organizations={organizations}
        selectedOrganizationIds={localLocation.organizationIds ?? []}
        onSelectOrganization={orgHandlers.handleAdd}
        onCreateOrganization={onCreateOrganization}
        title="Link Organization to Location"
        description="Select an organization present at this location"
      />
    </>
  );
}
