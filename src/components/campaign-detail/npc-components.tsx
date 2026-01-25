/* eslint-disable max-lines */
// NPC components - EditableNPCs and NPCCard are tightly coupled

import { ChevronDown, Map, Plus, Trash2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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

  const handleBlur = () => {
    onUpdate(localNPC);
  };

  const addTag = () => {
    if (tagInput.trim() && !localNPC.tags.includes(tagInput.trim())) {
      const newTags = [...localNPC.tags, tagInput.trim()];
      setLocalNPC({ ...localNPC, tags: newTags });
      onUpdate({ tags: newTags });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = localNPC.tags.filter(t => t !== tag);
    setLocalNPC({ ...localNPC, tags: newTags });
    onUpdate({ tags: newTags });
  };

  const addLocation = () => {
    if (
      locationInput.trim() &&
      !localNPC.locations.includes(locationInput.trim())
    ) {
      const newLocations = [...localNPC.locations, locationInput.trim()];
      setLocalNPC({ ...localNPC, locations: newLocations });
      onUpdate({ locations: newLocations });
      setLocationInput('');
    }
  };

  const removeLocation = (location: string) => {
    const newLocations = localNPC.locations.filter(l => l !== location);
    setLocalNPC({ ...localNPC, locations: newLocations });
    onUpdate({ locations: newLocations });
  };

  const statusColor = {
    active: 'bg-green-500/20 text-green-700 dark:text-green-400',
    deceased: 'bg-red-500/20 text-red-700 dark:text-red-400',
    missing: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    retired: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
                <div>
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
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 h-7 w-7"
                onClick={e => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <AlertDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Character</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{npc.name}"? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  value={localNPC.name}
                  onChange={e =>
                    setLocalNPC({ ...localNPC, name: e.target.value })
                  }
                  onBlur={handleBlur}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Title / Role</Label>
                <Input
                  value={localNPC.title}
                  onChange={e =>
                    setLocalNPC({ ...localNPC, title: e.target.value })
                  }
                  onBlur={handleBlur}
                  placeholder="The Merchant Prince, Village Elder..."
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs">Status</Label>
                <Select
                  value={localNPC.status}
                  onValueChange={v => {
                    const newStatus = v as CampaignNPC['status'];
                    setLocalNPC({ ...localNPC, status: newStatus });
                    onUpdate({ status: newStatus });
                  }}
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
              <div>
                <Label className="text-xs">Faction / Group</Label>
                <Input
                  value={localNPC.faction}
                  onChange={e =>
                    setLocalNPC({ ...localNPC, faction: e.target.value })
                  }
                  onBlur={handleBlur}
                  placeholder="Guild, kingdom, organization..."
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={localNPC.description}
                onChange={e =>
                  setLocalNPC({ ...localNPC, description: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Physical appearance, mannerisms..."
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">Personality</Label>
              <Textarea
                value={localNPC.personality}
                onChange={e =>
                  setLocalNPC({ ...localNPC, personality: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="How do they act? What quirks do they have?"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">Motivation</Label>
              <Textarea
                value={localNPC.motivation}
                onChange={e =>
                  setLocalNPC({ ...localNPC, motivation: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="What drives them? What do they want?"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">Secrets (GM Only)</Label>
              <Textarea
                value={localNPC.secrets}
                onChange={e =>
                  setLocalNPC({ ...localNPC, secrets: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Hidden information players don't know..."
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">Known Locations</Label>
              <div className="mt-1 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {localNPC.locations.map(location => (
                    <Badge
                      key={location}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      <Map className="h-3 w-3" />
                      {location}
                      <button
                        type="button"
                        onClick={() => removeLocation(location)}
                        className="hover:bg-muted ml-1 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={locationInput}
                    onChange={e => setLocationInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLocation();
                      }
                    }}
                    placeholder="Add a location..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={addLocation}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs">Tags</Label>
              <div className="mt-1 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {localNPC.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="gap-1 pr-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-muted ml-1 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag (villain, ally, merchant...)"
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs">Additional Notes</Label>
              <Textarea
                value={localNPC.notes}
                onChange={e =>
                  setLocalNPC({ ...localNPC, notes: e.target.value })
                }
                onBlur={handleBlur}
                rows={3}
                placeholder="Any other notes about this character..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
