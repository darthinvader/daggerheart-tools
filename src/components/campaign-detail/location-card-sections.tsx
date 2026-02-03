/**
 * Location Card Section Components
 *
 * Extracted section components for LocationCard to reduce complexity.
 */
import {
  Building2,
  Calendar,
  ChevronDown,
  History,
  Key,
  Map,
  Plus,
  Scroll,
  Sparkles,
  Star,
  Trash2,
  User,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import type { CampaignLocation } from '@/lib/schemas/campaign';

import { EntityBadgeList, RemovableBadge } from './entity-modals';
import { LOCATION_TYPE_OPTIONS } from './location-components-new';

// ─────────────────────────────────────────────────────────────────────────────
// Location Card Header
// ─────────────────────────────────────────────────────────────────────────────

interface LocationCardHeaderProps {
  location: CampaignLocation;
  isExpanded: boolean;
  onToggle: () => void;
  onDeleteClick: () => void;
  TypeIcon: React.ComponentType<{ className?: string }>;
  typeColor: string;
}

export function LocationCardHeader({
  location,
  isExpanded,
  onToggle: _onToggle,
  onDeleteClick,
  TypeIcon,
  typeColor,
}: LocationCardHeaderProps) {
  return (
    <CardHeader className="bg-muted/30 py-3">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="h-auto flex-1 justify-start p-0">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${typeColor}`}
              >
                <TypeIcon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-medium">{location.name}</div>
                <div className="text-muted-foreground text-sm capitalize">
                  {location.type}
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
                  onDeleteClick();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Location</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </CardHeader>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Basic Info Section
// ─────────────────────────────────────────────────────────────────────────────

interface LocationBasicInfoSectionProps {
  location: CampaignLocation;
  onTextChange: (field: keyof CampaignLocation, value: string) => void;
  onBlur: () => void;
  onTypeChange: (value: CampaignLocation['type']) => void;
}

export function LocationBasicInfoSection({
  location,
  onTextChange,
  onBlur,
  onTypeChange,
}: LocationBasicInfoSectionProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs">
            <Map className="h-3 w-3 text-emerald-500" />
            Name
          </Label>
          <Input
            value={location.name}
            onChange={e => onTextChange('name', e.target.value)}
            onBlur={onBlur}
            placeholder="Location name..."
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Type</Label>
          <Select
            value={location.type}
            onValueChange={value =>
              onTypeChange(value as CampaignLocation['type'])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCATION_TYPE_OPTIONS.map(option => (
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
          value={location.description}
          onChange={e => onTextChange('description', e.target.value)}
          onBlur={onBlur}
          placeholder="What does this place look like?"
          rows={3}
        />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// State & History Section
// ─────────────────────────────────────────────────────────────────────────────

interface LocationStateHistorySectionProps {
  location: CampaignLocation;
  onTextChange: (field: keyof CampaignLocation, value: string) => void;
  onBlur: () => void;
}

export function LocationStateHistorySection({
  location,
  onTextChange,
  onBlur,
}: LocationStateHistorySectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs">
          <Sparkles className="h-3 w-3 text-blue-500" />
          Current State
        </Label>
        <Textarea
          value={location.currentState}
          onChange={e => onTextChange('currentState', e.target.value)}
          onBlur={onBlur}
          placeholder="What's happening here now?"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs">
          <History className="h-3 w-3 text-amber-500" />
          History & Lore
        </Label>
        <Textarea
          value={location.historyLore}
          onChange={e => onTextChange('historyLore', e.target.value)}
          onBlur={onBlur}
          placeholder="The history and lore of this place..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs">
          <Key className="h-3 w-3 text-amber-600" />
          Secrets (GM Only)
        </Label>
        <Textarea
          value={location.secrets}
          onChange={e => onTextChange('secrets', e.target.value)}
          onBlur={onBlur}
          placeholder="Hidden information about this location..."
          rows={2}
        />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Points of Interest Section
// ─────────────────────────────────────────────────────────────────────────────

interface POI {
  id: string;
  name: string;
  description?: string;
  significance?: string;
}

interface LocationPOISectionProps {
  pointsOfInterest: POI[];
  poiName: string;
  poiDesc: string;
  poiSignificance: string;
  onPoiNameChange: (value: string) => void;
  onPoiDescChange: (value: string) => void;
  onPoiSignificanceChange: (value: string) => void;
  onAddPOI: () => void;
  onRemovePOI: (id: string) => void;
}

export function LocationPOISection({
  pointsOfInterest,
  poiName,
  poiDesc,
  poiSignificance,
  onPoiNameChange,
  onPoiDescChange,
  onPoiSignificanceChange,
  onAddPOI,
  onRemovePOI,
}: LocationPOISectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Star className="h-4 w-4 text-yellow-500" />
          Points of Interest
        </Label>
      </div>

      {pointsOfInterest.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
          No points of interest added yet
        </div>
      ) : (
        <div className="space-y-2">
          {pointsOfInterest.map(poi => (
            <Card key={poi.id} className="bg-muted/30">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 flex-shrink-0 text-yellow-500" />
                      <span className="font-medium">{poi.name}</span>
                    </div>
                    {poi.description && (
                      <p className="text-muted-foreground mt-1 text-sm">
                        {poi.description}
                      </p>
                    )}
                    {poi.significance && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Significance: {poi.significance}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive h-7 w-7"
                    onClick={() => onRemovePOI(poi.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add POI Form */}
      <Card className="bg-muted/20">
        <CardContent className="space-y-3 p-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={poiName}
              onChange={e => onPoiNameChange(e.target.value)}
              placeholder="POI Name..."
            />
            <Input
              value={poiSignificance}
              onChange={e => onPoiSignificanceChange(e.target.value)}
              placeholder="Significance..."
            />
          </div>
          <Textarea
            value={poiDesc}
            onChange={e => onPoiDescChange(e.target.value)}
            placeholder="Description..."
            rows={2}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onAddPOI}
            disabled={!poiName.trim()}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Point of Interest
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Related Entities Section
// ─────────────────────────────────────────────────────────────────────────────

interface LocationEntitiesSectionProps {
  npcIds: string[];
  organizationIds: string[];
  questIds: string[];
  getNpcName: (id: string) => string;
  getOrgName: (id: string) => string;
  getQuestTitle: (id: string) => string;
  onOpenNpcPicker: () => void;
  onOpenOrgPicker: () => void;
  onOpenQuestPicker: () => void;
  onRemoveNpc: (id: string) => void;
  onRemoveOrg: (id: string) => void;
  onRemoveQuest: (id: string) => void;
}

export function LocationEntitiesSection({
  npcIds,
  organizationIds,
  questIds,
  getNpcName,
  getOrgName,
  getQuestTitle,
  onOpenNpcPicker,
  onOpenOrgPicker,
  onOpenQuestPicker,
  onRemoveNpc,
  onRemoveOrg,
  onRemoveQuest,
}: LocationEntitiesSectionProps) {
  return (
    <>
      {/* NPCs */}
      <EntityBadgeList
        label="NPCs Present"
        icon={<User className="h-3 w-3" />}
        iconColor="text-blue-500"
        emptyText="No NPCs linked"
        onAdd={onOpenNpcPicker}
        addLabel="Add NPC"
      >
        {npcIds.map(id => (
          <RemovableBadge
            key={id}
            icon={<User className="h-3 w-3" />}
            onRemove={() => onRemoveNpc(id)}
          >
            {getNpcName(id)}
          </RemovableBadge>
        ))}
      </EntityBadgeList>

      {/* Organizations */}
      <EntityBadgeList
        label="Organizations"
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
            onRemove={() => onRemoveOrg(id)}
          >
            {getOrgName(id)}
          </RemovableBadge>
        ))}
      </EntityBadgeList>

      {/* Quests */}
      <EntityBadgeList
        label="Related Quests"
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
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Session Appearances Section
// ─────────────────────────────────────────────────────────────────────────────

interface SessionAppearance {
  sessionId?: string;
  sessionNumber?: number;
  sessionTitle?: string;
  notes?: string;
}

interface SessionNPCInvolvement {
  id: string;
  npcId: string;
  npcName?: string;
  role?: string;
}

interface SessionData {
  id: string;
  npcsInvolved?: SessionNPCInvolvement[];
  questIds?: string[];
}

interface NPCData {
  id: string;
  name: string;
}

interface QuestData {
  id: string;
  title: string;
}

interface LocationSessionAppearancesSectionProps {
  sessionAppearances: SessionAppearance[];
  sessions: SessionData[];
  npcs: NPCData[];
  quests: QuestData[];
}

export function LocationSessionAppearancesSection({
  sessionAppearances,
  sessions,
  npcs,
  quests,
}: LocationSessionAppearancesSectionProps) {
  if (sessionAppearances.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs">
        <Calendar className="h-3 w-3 text-blue-500" />
        Session Appearances
      </Label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sessionAppearances.map((appearance, idx) => {
          const session = sessions.find(s => s.id === appearance.sessionId);
          const sessionNPCs = session?.npcsInvolved ?? [];
          const sessionQuestIds = session?.questIds ?? [];
          return (
            <Card key={appearance.sessionId ?? idx} className="bg-muted/20">
              <CardContent className="p-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 flex-shrink-0 text-blue-500" />
                  <div className="min-w-0 flex-1 truncate text-sm font-medium">
                    S{appearance.sessionNumber}
                    {appearance.sessionTitle && `: ${appearance.sessionTitle}`}
                  </div>
                </div>
                {appearance.notes && (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                    {appearance.notes}
                  </p>
                )}
                {/* NPCs with roles */}
                {sessionNPCs.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {sessionNPCs.map((npcInv: SessionNPCInvolvement) => {
                      const npc = npcs.find(n => n.id === npcInv.npcId);
                      return (
                        <Badge
                          key={npcInv.id}
                          variant="outline"
                          className="gap-0.5 px-1 py-0 text-[10px]"
                        >
                          <User className="h-2 w-2" />
                          {npc?.name ?? npcInv.npcName ?? 'Unknown'}
                          {npcInv.role && ` (${npcInv.role})`}
                        </Badge>
                      );
                    })}
                  </div>
                )}
                {/* Quests */}
                {sessionQuestIds.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {sessionQuestIds.map((questId: string) => {
                      const quest = quests.find(q => q.id === questId);
                      return (
                        <Badge
                          key={questId}
                          variant="outline"
                          className="gap-0.5 px-1 py-0 text-[10px]"
                        >
                          <Scroll className="h-2 w-2" />
                          {quest?.title ?? 'Unknown'}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
