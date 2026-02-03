/**
 * Organization Card Sections
 *
 * Extracted section components for the OrganizationCard to reduce complexity.
 */
import {
  Building2,
  Calendar,
  ChevronDown,
  Crown,
  Heart,
  Key,
  Map,
  Plus,
  Scroll,
  Swords,
  Target,
  Trash2,
  User,
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
import type { CampaignOrganization } from '@/lib/schemas/campaign';

import { EntityBadgeList, RemovableBadge } from './entity-modals';
import { TagInputSection } from './entity-tag-input';

// =====================================================================================
// Types
// =====================================================================================

type OrganizationType = CampaignOrganization['type'];

export interface OrganizationTypeOption {
  value: OrganizationType;
  label: string;
  Icon: (props: { className?: string }) => ReactNode;
  color: string;
}

interface CardHeaderSectionProps {
  localOrg: CampaignOrganization;
  isExpanded: boolean;
  typeInfo?: OrganizationTypeOption;
  onOpenDeleteModal: () => void;
}

export function OrganizationCardHeader({
  localOrg,
  isExpanded,
  typeInfo,
  onOpenDeleteModal,
}: CardHeaderSectionProps) {
  const TypeIcon = typeInfo?.Icon ?? Building2;

  return (
    <CardHeader className="bg-muted/30 py-3">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="h-auto flex-1 justify-start p-0">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${typeInfo?.color ?? 'bg-gray-500/20'}`}
              >
                <TypeIcon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-medium">{localOrg.name}</div>
                <div className="text-muted-foreground text-sm">
                  {typeInfo?.label ?? 'Organization'}
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
            <TooltipContent>Delete Organization</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </CardHeader>
  );
}

interface BasicInfoSectionProps {
  localOrg: CampaignOrganization;
  typeOptions: OrganizationTypeOption[];
  handleTextChange: (field: keyof CampaignOrganization, value: string) => void;
  handleBlur: () => void;
  handleTypeChange: (value: OrganizationType) => void;
}

export function OrganizationBasicInfoSection({
  localOrg,
  typeOptions,
  handleTextChange,
  handleBlur,
  handleTypeChange,
}: BasicInfoSectionProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs">
            <Building2 className="h-3 w-3 text-blue-500" />
            Name
          </Label>
          <Input
            value={localOrg.name}
            onChange={e => handleTextChange('name', e.target.value)}
            onBlur={handleBlur}
            placeholder="Organization name..."
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Type</Label>
          <Select
            value={localOrg.type}
            onValueChange={value => handleTypeChange(value as OrganizationType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map(option => (
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
          value={localOrg.description}
          onChange={e => handleTextChange('description', e.target.value)}
          onBlur={handleBlur}
          placeholder="What is this organization about?"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs">
          <Target className="h-3 w-3 text-amber-500" />
          Goals & Objectives
        </Label>
        <Textarea
          value={localOrg.goalsObjectives}
          onChange={e => handleTextChange('goalsObjectives', e.target.value)}
          onBlur={handleBlur}
          placeholder="What does this organization want to achieve?"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs">
          <Key className="h-3 w-3 text-purple-500" />
          Secrets (GM Only)
        </Label>
        <Textarea
          value={localOrg.secrets}
          onChange={e => handleTextChange('secrets', e.target.value)}
          onBlur={handleBlur}
          placeholder="Hidden information about this organization..."
          rows={2}
        />
      </div>
    </>
  );
}

interface MembersSectionProps {
  keyMemberIds: string[];
  getNpcName: (id: string) => string;
  onOpenKeyMembersPicker: () => void;
  onRemoveKeyMember: (id: string) => void;
}

export function OrganizationMembersSection({
  keyMemberIds,
  getNpcName,
  onOpenKeyMembersPicker,
  onRemoveKeyMember,
}: MembersSectionProps) {
  return (
    <EntityBadgeList
      label="Key Members"
      icon={<Crown className="h-3 w-3" />}
      iconColor="text-yellow-500"
      emptyText="No key members assigned"
      onAdd={onOpenKeyMembersPicker}
      addLabel="Add Member"
    >
      {keyMemberIds.map(id => (
        <RemovableBadge
          key={id}
          icon={<User className="h-3 w-3" />}
          onRemove={() => onRemoveKeyMember(id)}
        >
          {getNpcName(id)}
        </RemovableBadge>
      ))}
    </EntityBadgeList>
  );
}

interface HeadquartersSectionProps {
  headquartersId?: string;
  getLocationName: (id: string) => string;
  onOpenHQPicker: () => void;
  onClearHQ: () => void;
}

export function OrganizationHeadquartersSection({
  headquartersId,
  getLocationName,
  onOpenHQPicker,
  onClearHQ,
}: HeadquartersSectionProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs">
        <Map className="h-3 w-3 text-green-500" />
        Headquarters
      </Label>
      {headquartersId ? (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Map className="h-3 w-3" />
            {getLocationName(headquartersId)}
            <button
              type="button"
              onClick={onClearHQ}
              className="hover:bg-muted ml-1 rounded-full p-0.5"
            >
              <Map className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={onOpenHQPicker}>
          <Plus className="mr-1 h-3 w-3" />
          Set Headquarters
        </Button>
      )}
    </div>
  );
}

interface LocationsQuestsSectionProps {
  locationIds: string[];
  questIds: string[];
  getLocationName: (id: string) => string;
  getQuestTitle: (id: string) => string;
  onOpenLocationsPicker: () => void;
  onOpenQuestsPicker: () => void;
  onRemoveLocation: (id: string) => void;
  onRemoveQuest: (id: string) => void;
}

export function OrganizationLocationsQuestsSection({
  locationIds,
  questIds,
  getLocationName,
  getQuestTitle,
  onOpenLocationsPicker,
  onOpenQuestsPicker,
  onRemoveLocation,
  onRemoveQuest,
}: LocationsQuestsSectionProps) {
  return (
    <>
      <EntityBadgeList
        label="Other Locations"
        icon={<Map className="h-3 w-3" />}
        iconColor="text-emerald-500"
        emptyText="No locations linked"
        onAdd={onOpenLocationsPicker}
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

      <EntityBadgeList
        label="Related Quests"
        icon={<Scroll className="h-3 w-3" />}
        iconColor="text-amber-500"
        emptyText="No quests linked"
        onAdd={onOpenQuestsPicker}
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
    </>
  );
}

interface RelationshipsSectionProps {
  allyNpcIds: string[];
  enemyNpcIds: string[];
  allyOrganizationIds: string[];
  enemyOrganizationIds: string[];
  getNpcName: (id: string) => string;
  getOrgName: (id: string) => string;
  onOpenAllyNpcsPicker: () => void;
  onOpenEnemyNpcsPicker: () => void;
  onOpenAllyOrgsPicker: () => void;
  onOpenEnemyOrgsPicker: () => void;
  onRemoveAllyNpc: (id: string) => void;
  onRemoveEnemyNpc: (id: string) => void;
  onRemoveAllyOrg: (id: string) => void;
  onRemoveEnemyOrg: (id: string) => void;
}

export function OrganizationRelationshipsSection({
  allyNpcIds,
  enemyNpcIds,
  allyOrganizationIds,
  enemyOrganizationIds,
  getNpcName,
  getOrgName,
  onOpenAllyNpcsPicker,
  onOpenEnemyNpcsPicker,
  onOpenAllyOrgsPicker,
  onOpenEnemyOrgsPicker,
  onRemoveAllyNpc,
  onRemoveEnemyNpc,
  onRemoveAllyOrg,
  onRemoveEnemyOrg,
}: RelationshipsSectionProps) {
  return (
    <>
      {/* Allies */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Heart className="h-4 w-4 text-green-500" />
          Allies
        </Label>
        <div className="grid gap-4 md:grid-cols-2">
          <EntityBadgeList
            label="Allied NPCs"
            icon={<User className="h-3 w-3" />}
            iconColor="text-green-500"
            emptyText="No allied NPCs"
            onAdd={onOpenAllyNpcsPicker}
            addLabel="Add Ally"
          >
            {allyNpcIds.map(id => (
              <RemovableBadge
                key={id}
                icon={<User className="h-3 w-3" />}
                onRemove={() => onRemoveAllyNpc(id)}
                className="bg-green-500/10"
              >
                {getNpcName(id)}
              </RemovableBadge>
            ))}
          </EntityBadgeList>

          <EntityBadgeList
            label="Allied Organizations"
            icon={<Building2 className="h-3 w-3" />}
            iconColor="text-green-500"
            emptyText="No allied organizations"
            onAdd={onOpenAllyOrgsPicker}
            addLabel="Add Ally"
          >
            {allyOrganizationIds.map(id => (
              <RemovableBadge
                key={id}
                icon={<Building2 className="h-3 w-3" />}
                onRemove={() => onRemoveAllyOrg(id)}
                className="bg-green-500/10"
              >
                {getOrgName(id)}
              </RemovableBadge>
            ))}
          </EntityBadgeList>
        </div>
      </div>

      {/* Enemies */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Swords className="h-4 w-4 text-red-500" />
          Enemies
        </Label>
        <div className="grid gap-4 md:grid-cols-2">
          <EntityBadgeList
            label="Enemy NPCs"
            icon={<User className="h-3 w-3" />}
            iconColor="text-red-500"
            emptyText="No enemy NPCs"
            onAdd={onOpenEnemyNpcsPicker}
            addLabel="Add Enemy"
          >
            {enemyNpcIds.map(id => (
              <RemovableBadge
                key={id}
                icon={<User className="h-3 w-3" />}
                onRemove={() => onRemoveEnemyNpc(id)}
                className="bg-red-500/10"
              >
                {getNpcName(id)}
              </RemovableBadge>
            ))}
          </EntityBadgeList>

          <EntityBadgeList
            label="Enemy Organizations"
            icon={<Building2 className="h-3 w-3" />}
            iconColor="text-red-500"
            emptyText="No enemy organizations"
            onAdd={onOpenEnemyOrgsPicker}
            addLabel="Add Enemy"
          >
            {enemyOrganizationIds.map(id => (
              <RemovableBadge
                key={id}
                icon={<Building2 className="h-3 w-3" />}
                onRemove={() => onRemoveEnemyOrg(id)}
                className="bg-red-500/10"
              >
                {getOrgName(id)}
              </RemovableBadge>
            ))}
          </EntityBadgeList>
        </div>
      </div>
    </>
  );
}

interface SessionAppearancesSectionProps {
  sessionIds: string[];
}

export function OrganizationSessionAppearancesSection({
  sessionIds,
}: SessionAppearancesSectionProps) {
  if (sessionIds.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs">
        <Calendar className="h-3 w-3 text-blue-500" />
        Session Appearances
      </Label>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="gap-1">
          <Calendar className="h-3 w-3" />
          {sessionIds.length} session{sessionIds.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      <p className="text-muted-foreground text-xs">
        This organization appears in sessions where it was linked.
      </p>
    </div>
  );
}

interface NotesSectionProps {
  localOrg: CampaignOrganization;
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  handleTextChange: (field: keyof CampaignOrganization, value: string) => void;
  handleBlur: () => void;
}

export function OrganizationNotesSection({
  localOrg,
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  handleTextChange,
  handleBlur,
}: NotesSectionProps) {
  return (
    <>
      <TagInputSection
        tags={tags}
        tagInput={tagInput}
        onInputChange={onTagInputChange}
        onAdd={onAddTag}
        onRemove={onRemoveTag}
      />

      <div className="space-y-2">
        <Label className="text-xs">Additional Notes</Label>
        <Textarea
          value={localOrg.notes}
          onChange={e => handleTextChange('notes', e.target.value)}
          onBlur={handleBlur}
          placeholder="Additional notes..."
          rows={2}
        />
      </div>
    </>
  );
}
