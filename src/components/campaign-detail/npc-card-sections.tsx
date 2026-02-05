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
  Plus,
  Power,
  RefreshCw,
  Scroll,
  Shield,
  Sparkles,
  Swords,
  Trash2,
  User,
  Users,
  Zap,
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
import { Switch } from '@/components/ui/switch';
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
  NPCFeature,
  NPCRole,
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
// NPC Role Options - Relationship to the party
// =====================================================================================

export interface NPCRoleOption {
  value: NPCRole;
  label: string;
  color: string;
  icon: ReactNode;
}

export const NPC_ROLE_OPTIONS: NPCRoleOption[] = [
  {
    value: 'ally',
    label: 'Ally',
    color: 'bg-green-500/20 text-green-700 dark:text-green-400',
    icon: <Heart className="h-3 w-3" />,
  },
  {
    value: 'neutral',
    label: 'Neutral',
    color: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
    icon: <User className="h-3 w-3" />,
  },
  {
    value: 'rival',
    label: 'Rival',
    color: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    icon: <Swords className="h-3 w-3" />,
  },
  {
    value: 'villain',
    label: 'Villain',
    color: 'bg-red-500/20 text-red-700 dark:text-red-400',
    icon: <Zap className="h-3 w-3" />,
  },
];

// =====================================================================================
// NPC Role Section
// =====================================================================================

interface NPCRoleSectionProps {
  localNPC: CampaignNPC;
  handleRoleChange: (value: NPCRole) => void;
}

export function NPCRoleSection({
  localNPC,
  handleRoleChange,
}: NPCRoleSectionProps) {
  const currentRole = NPC_ROLE_OPTIONS.find(
    r => r.value === (localNPC.role ?? 'neutral')
  );

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs">
        <Users className="h-3 w-3 text-indigo-500" />
        Party Relationship
      </Label>
      <Select
        value={localNPC.role ?? 'neutral'}
        onValueChange={value => handleRoleChange(value as NPCRole)}
      >
        <SelectTrigger>
          <SelectValue>
            <div className="flex items-center gap-2">
              {currentRole?.icon}
              <span>{currentRole?.label ?? 'Neutral'}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {NPC_ROLE_OPTIONS.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              <div className="flex items-center gap-2">
                {opt.icon}
                <span>{opt.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// =====================================================================================
// NPC Features Section - Trigger/Effect mechanics per Chapter 3
// =====================================================================================

interface NPCFeaturesSectionProps {
  features: NPCFeature[];
  onAddFeature: () => void;
  onUpdateFeature: (featureId: string, updates: Partial<NPCFeature>) => void;
  onDeleteFeature: (featureId: string) => void;
  onToggleFeatureActive: (featureId: string) => void;
  onResetFeatureUses: (featureId: string) => void;
}

export function NPCFeaturesSection({
  features,
  onAddFeature,
  onUpdateFeature,
  onDeleteFeature,
  onToggleFeatureActive,
  onResetFeatureUses,
}: NPCFeaturesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-medium text-amber-600">
          <Zap className="h-4 w-4" />
          NPC Features
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-muted-foreground cursor-help text-xs">
                  (Chapter 3)
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  NPC Features have a trigger (when it activates) and an effect
                  (what happens). Optionally, a choice can set context for the
                  feature.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h4>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-1 px-2 text-xs"
          onClick={onAddFeature}
        >
          <Plus className="h-3 w-3" />
          Add Feature
        </Button>
      </div>

      {features.length === 0 ? (
        <div className="rounded-lg border border-dashed p-4 text-center">
          <Zap className="text-muted-foreground mx-auto mb-2 h-6 w-6" />
          <p className="text-muted-foreground text-sm">
            No features defined. Add a feature to give this NPC mechanical
            interaction with the game system.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {features.map(feature => (
            <NPCFeatureCard
              key={feature.id}
              feature={feature}
              onUpdate={updates => onUpdateFeature(feature.id, updates)}
              onDelete={() => onDeleteFeature(feature.id)}
              onToggleActive={() => onToggleFeatureActive(feature.id)}
              onResetUses={() => onResetFeatureUses(feature.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================================================
// NPC Feature Card - Individual feature display/edit
// =====================================================================================

interface NPCFeatureCardProps {
  feature: NPCFeature;
  onUpdate: (updates: Partial<NPCFeature>) => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onResetUses: () => void;
}

function NPCFeatureCard({
  feature,
  onUpdate,
  onDelete,
  onToggleActive,
  onResetUses,
}: NPCFeatureCardProps) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        feature.isActive
          ? 'border-amber-500/30 bg-amber-500/5'
          : 'border-gray-300/30 bg-gray-500/5 opacity-60'
      }`}
    >
      {/* Header with name and controls */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          <Zap
            className={`h-4 w-4 ${feature.isActive ? 'text-amber-500' : 'text-gray-400'}`}
          />
          <Input
            value={feature.name}
            onChange={e => onUpdate({ name: e.target.value })}
            placeholder="Feature name..."
            className="h-7 flex-1 font-medium"
          />
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={feature.isActive}
                    onCheckedChange={onToggleActive}
                    className="h-4 w-7"
                  />
                  <Power
                    className={`h-3 w-3 ${feature.isActive ? 'text-green-500' : 'text-gray-400'}`}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {feature.isActive ? 'Feature is active' : 'Feature is inactive'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 h-6 w-6"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Choice (optional) */}
      <div className="mb-2 space-y-1">
        <Label className="text-muted-foreground flex items-center gap-1 text-xs">
          <Sparkles className="h-3 w-3 text-purple-400" />
          Choice (Optional)
        </Label>
        <Input
          value={feature.choice ?? ''}
          onChange={e => onUpdate({ choice: e.target.value || undefined })}
          placeholder="e.g., When battle begins, choose a favored PC..."
          className="h-7 text-xs"
        />
      </div>

      {/* Trigger */}
      <div className="mb-2 space-y-1">
        <Label className="text-muted-foreground flex items-center gap-1 text-xs">
          <Power className="h-3 w-3 text-blue-400" />
          Trigger
          <span className="text-red-400">*</span>
        </Label>
        <Textarea
          value={feature.trigger}
          onChange={e => onUpdate({ trigger: e.target.value })}
          placeholder="e.g., A PC within Very Close range marks at least 2 Hit Points..."
          rows={2}
          className="text-xs"
        />
      </div>

      {/* Effect */}
      <div className="mb-2 space-y-1">
        <Label className="text-muted-foreground flex items-center gap-1 text-xs">
          <Zap className="h-3 w-3 text-amber-400" />
          Effect
          <span className="text-red-400">*</span>
        </Label>
        <Textarea
          value={feature.effect}
          onChange={e => onUpdate({ effect: e.target.value })}
          placeholder="e.g., Roll 1d8. On a 4 or higher, this NPC moves into Melee range and marks one of the Hit Points instead..."
          rows={2}
          className="text-xs"
        />
      </div>

      {/* Uses per rest */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-muted-foreground text-xs">Uses/Rest:</Label>
          <Input
            type="number"
            min={0}
            value={feature.usesPerRest ?? ''}
            onChange={e => {
              const val = e.target.value;
              onUpdate({
                usesPerRest: val ? parseInt(val, 10) : undefined,
              });
            }}
            placeholder="Unlimited"
            className="h-6 w-20 text-xs"
          />
        </div>
        {feature.usesPerRest !== undefined && feature.usesPerRest > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {feature.currentUses ?? 0} / {feature.usesPerRest} used
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={onResetUses}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="mt-2 space-y-1">
        <Label className="text-muted-foreground flex items-center gap-1 text-xs">
          <FileText className="h-3 w-3" />
          Notes
        </Label>
        <Textarea
          value={feature.notes}
          onChange={e => onUpdate({ notes: e.target.value })}
          placeholder="GM notes about this feature..."
          rows={1}
          className="text-xs"
        />
      </div>
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
