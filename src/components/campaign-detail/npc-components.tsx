/* eslint-disable max-lines */
// NPC components - EditableNPCs and NPCCard are tightly coupled

import { ChevronDown, Map, Plus, Trash2, User, X } from 'lucide-react';
import { type MouseEvent, useCallback, useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  addNPC,
  deleteNPC,
  updateNPC,
} from '@/features/campaigns/campaign-storage';
import type { CampaignNPC } from '@/lib/schemas/campaign';

const NPC_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'deceased', label: 'Deceased' },
  { value: 'missing', label: 'Missing' },
  { value: 'retired', label: 'Retired' },
] as const;

type NPCTextFieldKey =
  | 'name'
  | 'title'
  | 'faction'
  | 'description'
  | 'personality'
  | 'motivation'
  | 'secrets'
  | 'notes';

interface NPCCardContentProps {
  npc: CampaignNPC;
  isExpanded: boolean;
  showDeleteConfirm: boolean;
  tagInput: string;
  locationInput: string;
  onToggle: () => void;
  onOpenDelete: () => void;
  onCloseDelete: (open: boolean) => void;
  onConfirmDelete: () => void;
  onTextChange: (field: NPCTextFieldKey, value: string) => void;
  onStatusChange: (value: CampaignNPC['status']) => void;
  onBlur: () => void;
  onTagInputChange: (value: string) => void;
  onLocationInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onAddLocation: () => void;
  onRemoveLocation: (location: string) => void;
}

interface EditableNPCsProps {
  npcs: CampaignNPC[];
  campaignId: string;
  onNPCsChange: () => void;
}

export function EditableNPCs({
  npcs,
  campaignId,
  onNPCsChange,
}: EditableNPCsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const allTags = [...new Set(npcs.flatMap(npc => npc.tags))].sort();

  const filteredNPCs = tagFilter
    ? npcs.filter(npc => npc.tags.includes(tagFilter))
    : npcs;

  const sortedNPCs = [...filteredNPCs].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleAddNPC = async () => {
    await addNPC(campaignId, {
      name: 'New Character',
      title: '',
      description: '',
      personality: '',
      motivation: '',
      secrets: '',
      connections: [],
      locations: [],
      status: 'active',
      faction: '',
      notes: '',
      sessionAppearances: [],
      tags: [],
    });
    onNPCsChange();
  };

  const handleUpdateNPC = async (
    npcId: string,
    updates: Partial<Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    await updateNPC(campaignId, npcId, updates);
    onNPCsChange();
  };

  const handleDeleteNPC = async (npcId: string) => {
    await deleteNPC(campaignId, npcId);
    onNPCsChange();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={handleAddNPC} className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Character
        </Button>
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
        <Card>
          <CardContent className="py-8 text-center">
            <User className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
            <p className="text-muted-foreground">No characters created yet</p>
            <p className="text-muted-foreground text-sm">
              Add NPCs, villains, and allies to track in your campaign
            </p>
          </CardContent>
        </Card>
      ) : (
        sortedNPCs.map(npc => (
          <NPCCard
            key={npc.id}
            npc={npc}
            allNPCs={npcs}
            isExpanded={expandedId === npc.id}
            onToggle={() =>
              setExpandedId(expandedId === npc.id ? null : npc.id)
            }
            onUpdate={updates => handleUpdateNPC(npc.id, updates)}
            onDelete={() => handleDeleteNPC(npc.id)}
          />
        ))
      )}
    </div>
  );
}

interface NPCCardProps {
  npc: CampaignNPC;
  allNPCs: CampaignNPC[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  onDelete: () => void;
}

interface NPCHeaderProps {
  npc: CampaignNPC;
  isExpanded: boolean;
  onOpenDelete: (event: MouseEvent<HTMLButtonElement>) => void;
}

function NPCCardHeader({ npc, isExpanded, onOpenDelete }: NPCHeaderProps) {
  const statusColor = {
    active: 'bg-green-500/20 text-green-700 dark:text-green-400',
    deceased: 'bg-red-500/20 text-red-700 dark:text-red-400',
    missing: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    retired: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
  };

  return (
    <CardHeader className="py-3">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="h-auto flex-1 justify-start p-0">
            <div className="flex items-center gap-3">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{npc.name}</span>
                  {npc.title && (
                    <span className="text-muted-foreground text-sm">
                      — {npc.title}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Badge className={statusColor[npc.status]}>
                    {npc.status}
                  </Badge>
                  {npc.faction && (
                    <span className="text-muted-foreground text-xs">
                      {npc.faction}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Button>
        </CollapsibleTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 h-7 w-7"
          onClick={onOpenDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
}

interface NPCDeleteDialogProps {
  npcName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

function NPCDeleteDialog({
  npcName,
  open,
  onOpenChange,
  onConfirmDelete,
}: NPCDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Character</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{npcName}"? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface NPCTextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function NPCTextField({
  label,
  value,
  placeholder,
  onChange,
  onBlur,
}: NPCTextFieldProps) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="mt-1"
      />
    </div>
  );
}

interface NPCTextAreaFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function NPCTextAreaField({
  label,
  value,
  placeholder,
  rows = 2,
  onChange,
  onBlur,
}: NPCTextAreaFieldProps) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        rows={rows}
        placeholder={placeholder}
        className="mt-1"
      />
    </div>
  );
}

interface NPCBadgeListFieldProps {
  label: string;
  items: string[];
  inputValue: string;
  inputPlaceholder: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (value: string) => void;
  icon?: React.ReactNode;
  badgeVariant?: 'secondary' | 'outline';
}

function NPCBadgeListField({
  label,
  items,
  inputValue,
  inputPlaceholder,
  onInputChange,
  onAdd,
  onRemove,
  icon,
  badgeVariant = 'secondary',
}: NPCBadgeListFieldProps) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1 space-y-2">
        <div className="flex flex-wrap gap-1">
          {items.map(item => (
            <Badge key={item} variant={badgeVariant} className="gap-1 pr-1">
              {icon}
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="hover:bg-muted ml-1 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAdd();
              }
            }}
            placeholder={inputPlaceholder}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={onAdd}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function NPCCard({
  npc,
  allNPCs: _allNPCs,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: NPCCardProps) {
  const [localNPC, setLocalNPC] = useState(npc);
  const [tagInput, setTagInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setLocalNPC(npc);
  }, [npc]);

  const handleBlur = useCallback(() => {
    onUpdate(localNPC);
  }, [localNPC, onUpdate]);

  const handleTextChange = useCallback(
    (field: NPCTextFieldKey, value: string) => {
      setLocalNPC(current => ({ ...current, [field]: value }));
    },
    []
  );

  const handleStatusChange = useCallback(
    (value: CampaignNPC['status']) => {
      setLocalNPC(current => ({ ...current, status: value }));
      onUpdate({ status: value });
    },
    [onUpdate]
  );

  const addTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (!trimmed || localNPC.tags.includes(trimmed)) {
      return;
    }
    const newTags = [...localNPC.tags, trimmed];
    setLocalNPC(current => ({ ...current, tags: newTags }));
    onUpdate({ tags: newTags });
    setTagInput('');
  }, [localNPC.tags, tagInput, onUpdate]);

  const removeTag = useCallback(
    (tag: string) => {
      const newTags = localNPC.tags.filter(item => item !== tag);
      setLocalNPC(current => ({ ...current, tags: newTags }));
      onUpdate({ tags: newTags });
    },
    [localNPC.tags, onUpdate]
  );

  const addLocation = useCallback(() => {
    const trimmed = locationInput.trim();
    if (!trimmed || localNPC.locations.includes(trimmed)) {
      return;
    }
    const newLocations = [...localNPC.locations, trimmed];
    setLocalNPC(current => ({ ...current, locations: newLocations }));
    onUpdate({ locations: newLocations });
    setLocationInput('');
  }, [localNPC.locations, locationInput, onUpdate]);

  const removeLocation = useCallback(
    (locationValue: string) => {
      const newLocations = localNPC.locations.filter(
        item => item !== locationValue
      );
      setLocalNPC(current => ({ ...current, locations: newLocations }));
      onUpdate({ locations: newLocations });
    },
    [localNPC.locations, onUpdate]
  );

  return (
    <NPCCardContent
      npc={localNPC}
      isExpanded={isExpanded}
      showDeleteConfirm={showDeleteConfirm}
      tagInput={tagInput}
      locationInput={locationInput}
      onToggle={onToggle}
      onOpenDelete={() => setShowDeleteConfirm(true)}
      onCloseDelete={setShowDeleteConfirm}
      onConfirmDelete={onDelete}
      onTextChange={handleTextChange}
      onStatusChange={handleStatusChange}
      onBlur={handleBlur}
      onTagInputChange={setTagInput}
      onLocationInputChange={setLocationInput}
      onAddTag={addTag}
      onRemoveTag={removeTag}
      onAddLocation={addLocation}
      onRemoveLocation={removeLocation}
    />
  );
}

function NPCCardContent({
  npc,
  isExpanded,
  showDeleteConfirm,
  tagInput,
  locationInput,
  onToggle,
  onOpenDelete,
  onCloseDelete,
  onConfirmDelete,
  onTextChange,
  onStatusChange,
  onBlur,
  onTagInputChange,
  onLocationInputChange,
  onAddTag,
  onRemoveTag,
  onAddLocation,
  onRemoveLocation,
}: NPCCardContentProps) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card>
        <NPCCardHeader
          npc={npc}
          isExpanded={isExpanded}
          onOpenDelete={event => {
            event.stopPropagation();
            onOpenDelete();
          }}
        />

        <NPCDeleteDialog
          npcName={npc.name}
          open={showDeleteConfirm}
          onOpenChange={onCloseDelete}
          onConfirmDelete={onConfirmDelete}
        />

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <div className="grid gap-4 md:grid-cols-2">
              <NPCTextField
                label="Name"
                value={npc.name}
                onChange={value => onTextChange('name', value)}
                onBlur={onBlur}
              />
              <NPCTextField
                label="Title / Role"
                value={npc.title}
                placeholder="The Merchant Prince, Village Elder..."
                onChange={value => onTextChange('title', value)}
                onBlur={onBlur}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs">Status</Label>
                <Select
                  value={npc.status}
                  onValueChange={value =>
                    onStatusChange(value as CampaignNPC['status'])
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NPC_STATUS_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <NPCTextField
                label="Faction / Group"
                value={npc.faction}
                placeholder="Guild, kingdom, organization..."
                onChange={value => onTextChange('faction', value)}
                onBlur={onBlur}
              />
            </div>

            <NPCTextAreaField
              label="Description"
              value={npc.description}
              placeholder="Physical appearance, mannerisms..."
              onChange={value => onTextChange('description', value)}
              onBlur={onBlur}
            />

            <NPCTextAreaField
              label="Personality"
              value={npc.personality}
              placeholder="How do they act? What quirks do they have?"
              onChange={value => onTextChange('personality', value)}
              onBlur={onBlur}
            />

            <NPCTextAreaField
              label="Motivation"
              value={npc.motivation}
              placeholder="What drives them? What do they want?"
              onChange={value => onTextChange('motivation', value)}
              onBlur={onBlur}
            />

            <NPCTextAreaField
              label="Secrets (GM Only)"
              value={npc.secrets}
              placeholder="Hidden information players don't know..."
              onChange={value => onTextChange('secrets', value)}
              onBlur={onBlur}
            />

            <NPCBadgeListField
              label="Known Locations"
              items={npc.locations}
              inputValue={locationInput}
              inputPlaceholder="Add a location..."
              onInputChange={onLocationInputChange}
              onAdd={onAddLocation}
              onRemove={onRemoveLocation}
              icon={<Map className="h-3 w-3" />}
              badgeVariant="secondary"
            />

            <NPCBadgeListField
              label="Tags"
              items={npc.tags}
              inputValue={tagInput}
              inputPlaceholder="Add a tag (villain, ally, merchant...)"
              onInputChange={onTagInputChange}
              onAdd={onAddTag}
              onRemove={onRemoveTag}
              badgeVariant="outline"
            />

            <NPCTextAreaField
              label="Additional Notes"
              value={npc.notes}
              placeholder="Any other notes about this character..."
              rows={3}
              onChange={value => onTextChange('notes', value)}
              onBlur={onBlur}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
