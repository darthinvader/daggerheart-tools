/**
 * NPC Card Sections
 *
 * Extracted section components for the NPCCard to reduce complexity.
 */
import {
  Brain,
  Building2,
  ChevronDown,
  FileText,
  Heart,
  Key,
  Map,
  Scroll,
  Shield,
  Sparkles,
  Swords,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardHeader } from '@/components/ui/card';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from '@/lib/schemas/campaign';

import { DeleteConfirmDialog } from './entity-card-utils';
import {
  LocationPickerModal,
  NPCPickerModal,
  OrganizationPickerModal,
} from './entity-modals';

// =====================================================================================
// Types
// =====================================================================================

export interface NPCStatusOption {
  value: CampaignNPC['status'];
  label: string;
  color: string;
}

// =====================================================================================
// Header Section
// =====================================================================================

interface HeaderSectionProps {
  localNPC: CampaignNPC;
  isExpanded: boolean;
  statusInfo?: NPCStatusOption;
  onOpenDeleteModal: () => void;
}

export function NPCCardHeader({
  localNPC,
  isExpanded,
  statusInfo,
  onOpenDeleteModal,
}: HeaderSectionProps) {
  return (
    <CardHeader className="bg-muted/30 py-3">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="h-auto flex-1 justify-start p-0">
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
                  onOpenDeleteModal();
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
  );
}

// =====================================================================================
// Basic Info Section
// =====================================================================================

interface BasicInfoSectionProps {
  localNPC: CampaignNPC;
  statusOptions: NPCStatusOption[];
  handleTextChange: (field: keyof CampaignNPC, value: string) => void;
  handleBlur: () => void;
  handleStatusChange: (value: CampaignNPC['status']) => void;
}

export function NPCBasicInfoSection({
  localNPC,
  statusOptions,
  handleTextChange,
  handleBlur,
  handleStatusChange,
}: BasicInfoSectionProps) {
  return (
    <>
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
            onChange={e => handleTextChange('titleRole', e.target.value)}
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
              {statusOptions.map(opt => (
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
    </>
  );
}

// =====================================================================================
// Description Fields Section
// =====================================================================================

interface DescriptionFieldsSectionProps {
  localNPC: CampaignNPC;
  handleTextChange: (field: keyof CampaignNPC, value: string) => void;
  handleBlur: () => void;
}

export function NPCDescriptionFieldsSection({
  localNPC,
  handleTextChange,
  handleBlur,
}: DescriptionFieldsSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs">
          <FileText className="h-3 w-3 text-slate-500" />
          Description
        </Label>
        <Textarea
          value={localNPC.description}
          onChange={e => handleTextChange('description', e.target.value)}
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
          onChange={e => handleTextChange('personality', e.target.value)}
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
          onChange={e => handleTextChange('backgroundHistory', e.target.value)}
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
    </>
  );
}

// =====================================================================================
// Notes Section
// =====================================================================================

interface NotesSectionProps {
  localNPC: CampaignNPC;
  handleTextChange: (field: keyof CampaignNPC, value: string) => void;
  handleBlur: () => void;
}

export function NPCNotesSection({
  localNPC,
  handleTextChange,
  handleBlur,
}: NotesSectionProps) {
  return (
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
  );
}

// =====================================================================================
// Organizations Section
// =====================================================================================

interface NPCOrganizationsSectionProps {
  children: ReactNode;
  onOpenPicker: () => void;
}

export function NPCOrganizationsSection({
  children,
  onOpenPicker,
}: NPCOrganizationsSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Building2 className="h-3 w-3 text-purple-500" />
          Organizations
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-1 px-2 text-xs"
          onClick={onOpenPicker}
        >
          Add Organization
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

// =====================================================================================
// Known Locations Section
// =====================================================================================

interface NPCKnownLocationsSectionProps {
  children: ReactNode;
  onOpenPicker: () => void;
}

export function NPCKnownLocationsSection({
  children,
  onOpenPicker,
}: NPCKnownLocationsSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Map className="h-3 w-3 text-emerald-500" />
          Known Locations
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-1 px-2 text-xs"
          onClick={onOpenPicker}
        >
          Add Location
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

// =====================================================================================
// Allies Section
// =====================================================================================

interface NPCAlliesSectionProps {
  alliesNPCContent: ReactNode;
  alliesOrgContent: ReactNode;
}

export function NPCAlliesSection({
  alliesNPCContent,
  alliesOrgContent,
}: NPCAlliesSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="flex items-center gap-2 font-medium text-green-600">
        <Heart className="h-4 w-4" />
        Allies
      </h4>
      {alliesNPCContent}
      {alliesOrgContent}
    </div>
  );
}

// =====================================================================================
// Enemies Section
// =====================================================================================

interface NPCEnemiesSectionProps {
  enemiesNPCContent: ReactNode;
  enemiesOrgContent: ReactNode;
}

export function NPCEnemiesSection({
  enemiesNPCContent,
  enemiesOrgContent,
}: NPCEnemiesSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="flex items-center gap-2 font-medium text-red-600">
        <Swords className="h-4 w-4" />
        Enemies
      </h4>
      {enemiesNPCContent}
      {enemiesOrgContent}
    </div>
  );
}

// =====================================================================================
// Modals Section
// =====================================================================================

import type { NPCPickerResult } from './entity-modals';

interface NPCModalsSectionProps {
  modals: {
    deleteConfirm: boolean;
    locationPicker: boolean;
    orgPicker: boolean;
    allyNPCPicker: boolean;
    enemyNPCPicker: boolean;
    allyOrgPicker: boolean;
    enemyOrgPicker: boolean;
  };
  setModalOpen: (
    modal:
      | 'deleteConfirm'
      | 'locationPicker'
      | 'orgPicker'
      | 'allyNPCPicker'
      | 'enemyNPCPicker'
      | 'allyOrgPicker'
      | 'enemyOrgPicker',
    open: boolean
  ) => void;
  localNPC: CampaignNPC;
  locations: CampaignLocation[];
  organizations: CampaignOrganization[];
  otherNPCs: CampaignNPC[];
  quests: CampaignQuest[];
  onDelete: () => void;
  locationHandlers: { handleAdd: (id: string) => void };
  orgHandlers: { handleAdd: (id: string) => void };
  handleAddAllyNPC: (result: NPCPickerResult) => void;
  handleAddEnemyNPC: (result: NPCPickerResult) => void;
  handleAddAllyOrg: (orgId: string) => void;
  handleAddEnemyOrg: (orgId: string) => void;
  onCreateLocation: (
    name: string,
    type: CampaignLocation['type']
  ) => Promise<string>;
  onCreateOrganization: (
    name: string,
    type: CampaignOrganization['type']
  ) => Promise<string>;
  onCreateNPC: (name: string) => Promise<string>;
}

export function NPCModalsSection({
  modals,
  setModalOpen,
  localNPC,
  locations,
  organizations,
  otherNPCs,
  quests,
  onDelete,
  locationHandlers,
  orgHandlers,
  handleAddAllyNPC,
  handleAddEnemyNPC,
  handleAddAllyOrg,
  handleAddEnemyOrg,
  onCreateLocation,
  onCreateOrganization,
  onCreateNPC,
}: NPCModalsSectionProps) {
  return (
    <>
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={modals.deleteConfirm}
        onOpenChange={open => setModalOpen('deleteConfirm', open)}
        entityType="Character"
        entityName={localNPC.name}
        onDelete={onDelete}
      />

      {/* Location Picker Modal */}
      <LocationPickerModal
        open={modals.locationPicker}
        onOpenChange={open => setModalOpen('locationPicker', open)}
        locations={locations}
        selectedLocationIds={localNPC.locationIds ?? []}
        onSelectLocation={locationHandlers.handleAdd}
        onCreateLocation={onCreateLocation}
        title="Add Known Location"
        description="Select a location this NPC is associated with"
      />

      {/* Organization Picker Modal */}
      <OrganizationPickerModal
        open={modals.orgPicker}
        onOpenChange={open => setModalOpen('orgPicker', open)}
        organizations={organizations}
        selectedOrganizationIds={localNPC.organizationIds ?? []}
        onSelectOrganization={orgHandlers.handleAdd}
        onCreateOrganization={onCreateOrganization}
        title="Add Organization"
        description="Select an organization this NPC belongs to"
      />

      {/* Ally NPC Picker Modal */}
      <NPCPickerModal
        open={modals.allyNPCPicker}
        onOpenChange={open => setModalOpen('allyNPCPicker', open)}
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

      {/* Enemy NPC Picker Modal */}
      <NPCPickerModal
        open={modals.enemyNPCPicker}
        onOpenChange={open => setModalOpen('enemyNPCPicker', open)}
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

      {/* Ally Organization Picker Modal */}
      <OrganizationPickerModal
        open={modals.allyOrgPicker}
        onOpenChange={open => setModalOpen('allyOrgPicker', open)}
        organizations={organizations}
        selectedOrganizationIds={localNPC.allyOrganizationIds ?? []}
        onSelectOrganization={handleAddAllyOrg}
        onCreateOrganization={onCreateOrganization}
        title="Add Allied Organization"
        description="Select an organization to add as an ally"
      />

      {/* Enemy Organization Picker Modal */}
      <OrganizationPickerModal
        open={modals.enemyOrgPicker}
        onOpenChange={open => setModalOpen('enemyOrgPicker', open)}
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
