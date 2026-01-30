// Entity picker/creator modals for campaign management

import {
  Building2,
  ChevronRight,
  Crown,
  Eye,
  Flag,
  Key,
  Map,
  MapPin,
  Mountain,
  Plus,
  Scroll,
  Search,
  Shield,
  Swords,
  TreePine,
  User,
  Users,
  X,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
} from '@/lib/schemas/campaign';

// =====================================================================================
// Shared Types and Utils
// =====================================================================================

// =====================================================================================
// NPC Status Options
// =====================================================================================

const NPC_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'bg-green-500/20 text-green-700' },
  { value: 'deceased', label: 'Deceased', color: 'bg-red-500/20 text-red-700' },
  {
    value: 'missing',
    label: 'Missing',
    color: 'bg-yellow-500/20 text-yellow-700',
  },
  { value: 'retired', label: 'Retired', color: 'bg-gray-500/20 text-gray-700' },
] as const;

// =====================================================================================
// Location Type Options
// =====================================================================================

const LOCATION_TYPE_OPTIONS = [
  { value: 'city', label: 'City', Icon: Building2 },
  { value: 'town', label: 'Town', Icon: MapPin },
  { value: 'village', label: 'Village', Icon: TreePine },
  { value: 'dungeon', label: 'Dungeon', Icon: Mountain },
  { value: 'wilderness', label: 'Wilderness', Icon: Map },
  { value: 'landmark', label: 'Landmark', Icon: MapPin },
  { value: 'building', label: 'Building', Icon: Building2 },
  { value: 'region', label: 'Region', Icon: Map },
  { value: 'other', label: 'Other', Icon: MapPin },
] as const;

// =====================================================================================
// Organization Type Options
// =====================================================================================

const ORGANIZATION_TYPE_OPTIONS = [
  { value: 'guild', label: 'Guild', Icon: Building2 },
  { value: 'faction', label: 'Faction', Icon: Flag },
  { value: 'government', label: 'Government', Icon: Crown },
  { value: 'religious', label: 'Religious', Icon: Eye },
  { value: 'criminal', label: 'Criminal', Icon: Swords },
  { value: 'mercenary', label: 'Mercenary', Icon: Shield },
  { value: 'merchant', label: 'Merchant', Icon: Building2 },
  { value: 'secret', label: 'Secret Society', Icon: Key },
  { value: 'other', label: 'Other', Icon: Users },
] as const;

// =====================================================================================
// Quest Type and Status Options
// =====================================================================================

const QUEST_TYPE_OPTIONS = [
  { value: 'main', label: 'Main Quest' },
  { value: 'side', label: 'Side Quest' },
  { value: 'personal', label: 'Personal' },
  { value: 'faction', label: 'Faction' },
  { value: 'rumor', label: 'Rumor' },
  { value: 'hook', label: 'Hook' },
] as const;

const QUEST_STATUS_OPTIONS = [
  {
    value: 'available',
    label: 'Available',
    color: 'bg-yellow-500/20 text-yellow-700',
  },
  { value: 'active', label: 'Active', color: 'bg-blue-500/20 text-blue-700' },
  {
    value: 'completed',
    label: 'Completed',
    color: 'bg-green-500/20 text-green-700',
  },
  { value: 'failed', label: 'Failed', color: 'bg-red-500/20 text-red-700' },
  {
    value: 'abandoned',
    label: 'Abandoned',
    color: 'bg-gray-500/20 text-gray-700',
  },
] as const;

// =====================================================================================
// NPC Picker Modal
// =====================================================================================

export interface NPCPickerResult {
  npcId: string;
  npcName: string;
  role: string;
  actionsTaken: string;
  notes: string;
  locationIds: string[];
  questIds: string[];
}

interface NPCPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  selectedNpcIds: string[];
  onSelectNPC: (result: NPCPickerResult) => void;
  onCreateNPC: (name: string) => Promise<string>; // Returns new NPC ID
  title?: string;
  description?: string;
  showInvolvementFields?: boolean;
}

export function NPCPickerModal({
  open,
  onOpenChange,
  npcs,
  locations,
  quests,
  selectedNpcIds,
  onSelectNPC,
  onCreateNPC,
  title = 'Add NPC',
  description = 'Select an existing NPC or create a new one',
  showInvolvementFields = false,
}: NPCPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNpc, setSelectedNpc] = useState<CampaignNPC | null>(null);
  const [newNpcName, setNewNpcName] = useState('');
  const [role, setRole] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedQuests, setSelectedQuests] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const filteredNpcs = npcs.filter(npc => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    return (
      npc.name.toLowerCase().includes(query) ||
      (npc.titleRole ?? '').toLowerCase().includes(query)
    );
  });

  const availableNpcs = filteredNpcs.filter(
    npc => !selectedNpcIds.includes(npc.id)
  );

  const resetState = () => {
    setSearchQuery('');
    setSelectedNpc(null);
    setNewNpcName('');
    setRole('');
    setActionsTaken('');
    setNotes('');
    setSelectedLocations([]);
    setSelectedQuests([]);
    setIsCreating(false);
  };

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (selectedNpc) {
      onSelectNPC({
        npcId: selectedNpc.id,
        npcName: selectedNpc.name,
        role,
        actionsTaken,
        notes,
        locationIds: selectedLocations,
        questIds: selectedQuests,
      });
      handleClose();
    } else if (newNpcName.trim()) {
      setIsCreating(true);
      try {
        const newId = await onCreateNPC(newNpcName.trim());
        onSelectNPC({
          npcId: newId,
          npcName: newNpcName.trim(),
          role,
          actionsTaken,
          notes,
          locationIds: selectedLocations,
          questIds: selectedQuests,
        });
        handleClose();
      } finally {
        setIsCreating(false);
      }
    }
  };

  const toggleLocation = (locationId: string) => {
    setSelectedLocations(prev =>
      prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  const toggleQuest = (questId: string) => {
    setSelectedQuests(prev =>
      prev.includes(questId)
        ? prev.filter(id => id !== questId)
        : [...prev, questId]
    );
  };

  const canConfirm = selectedNpc !== null || newNpcName.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select Existing</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search NPCs..."
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[200px] rounded-md border p-2">
              {availableNpcs.length === 0 ? (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                  {npcs.length === 0
                    ? 'No NPCs created yet'
                    : 'No matching NPCs'}
                </div>
              ) : (
                <div className="space-y-2">
                  {availableNpcs.map(npc => (
                    <button
                      key={npc.id}
                      type="button"
                      onClick={() =>
                        setSelectedNpc(selectedNpc?.id === npc.id ? null : npc)
                      }
                      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                        selectedNpc?.id === npc.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <User className="h-5 w-5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{npc.name}</div>
                        {npc.titleRole && (
                          <div className="text-sm opacity-80">
                            {npc.titleRole}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          NPC_STATUS_OPTIONS.find(s => s.value === npc.status)
                            ?.color ?? ''
                        }`}
                      >
                        {npc.status}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-2">
              <Label>NPC Name</Label>
              <Input
                value={newNpcName}
                onChange={e => setNewNpcName(e.target.value)}
                placeholder="Enter NPC name..."
              />
            </div>
          </TabsContent>
        </Tabs>

        {showInvolvementFields && (selectedNpc || newNpcName.trim()) && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium">Involvement Details</h4>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs">Role</Label>
                  <Input
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g., Quest Giver, Antagonist..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Actions Taken</Label>
                  <Input
                    value={actionsTaken}
                    onChange={e => setActionsTaken(e.target.value)}
                    placeholder="What did they do?"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Notes</Label>
                <Textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>

              {locations.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs">Locations</Label>
                  <div className="flex flex-wrap gap-2">
                    {locations.map(location => (
                      <Badge
                        key={location.id}
                        variant={
                          selectedLocations.includes(location.id)
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer"
                        onClick={() => toggleLocation(location.id)}
                      >
                        <Map className="mr-1 h-3 w-3" />
                        {location.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {quests.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs">Quests</Label>
                  <div className="flex flex-wrap gap-2">
                    {quests.map(quest => (
                      <Badge
                        key={quest.id}
                        variant={
                          selectedQuests.includes(quest.id)
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer"
                        onClick={() => toggleQuest(quest.id)}
                      >
                        <Scroll className="mr-1 h-3 w-3" />
                        {quest.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!canConfirm || isCreating}>
            {isCreating
              ? 'Creating...'
              : selectedNpc
                ? 'Add NPC'
                : 'Create & Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// =====================================================================================
// Location Picker Modal
// =====================================================================================

interface LocationPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locations: CampaignLocation[];
  selectedLocationIds: string[];
  onSelectLocation: (locationId: string) => void;
  onCreateLocation: (
    name: string,
    type: CampaignLocation['type']
  ) => Promise<string>;
  title?: string;
  description?: string;
  multiSelect?: boolean;
  onSelectMultiple?: (locationIds: string[]) => void;
}

export function LocationPickerModal({
  open,
  onOpenChange,
  locations,
  selectedLocationIds,
  onSelectLocation,
  onCreateLocation,
  title = 'Add Location',
  description = 'Select an existing location or create a new one',
  multiSelect = false,
  onSelectMultiple,
}: LocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationType, setNewLocationType] =
    useState<CampaignLocation['type']>('other');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const filteredLocations = locations.filter(location => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    return location.name.toLowerCase().includes(query);
  });

  const availableLocations = filteredLocations.filter(
    location => !selectedLocationIds.includes(location.id)
  );

  const resetState = () => {
    setSearchQuery('');
    setNewLocationName('');
    setNewLocationType('other');
    setSelectedIds([]);
    setIsCreating(false);
  };

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  const handleToggleSelection = (locationId: string) => {
    if (multiSelect) {
      setSelectedIds(prev =>
        prev.includes(locationId)
          ? prev.filter(id => id !== locationId)
          : [...prev, locationId]
      );
    } else {
      onSelectLocation(locationId);
      handleClose();
    }
  };

  const handleConfirmMultiple = () => {
    if (multiSelect && onSelectMultiple) {
      onSelectMultiple(selectedIds);
      handleClose();
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newLocationName.trim()) return;
    setIsCreating(true);
    try {
      const newId = await onCreateLocation(
        newLocationName.trim(),
        newLocationType
      );
      if (multiSelect && onSelectMultiple) {
        onSelectMultiple([...selectedIds, newId]);
      } else {
        onSelectLocation(newId);
      }
      handleClose();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select Existing</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search locations..."
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[200px] rounded-md border p-2">
              {availableLocations.length === 0 ? (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                  {locations.length === 0
                    ? 'No locations created yet'
                    : 'No matching locations'}
                </div>
              ) : (
                <div className="space-y-2">
                  {availableLocations.map(location => {
                    const typeInfo = LOCATION_TYPE_OPTIONS.find(
                      t => t.value === location.type
                    );
                    const TypeIcon = typeInfo?.Icon ?? MapPin;
                    const isSelected =
                      multiSelect && selectedIds.includes(location.id);

                    return (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => handleToggleSelection(location.id)}
                        className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <TypeIcon className="h-5 w-5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm capitalize opacity-80">
                            {location.type}
                          </div>
                        </div>
                        {!multiSelect && (
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {multiSelect && selectedIds.length > 0 && (
              <div className="flex justify-end">
                <Button onClick={handleConfirmMultiple}>
                  Add {selectedIds.length} Location
                  {selectedIds.length > 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Location Name</Label>
                <Input
                  value={newLocationName}
                  onChange={e => setNewLocationName(e.target.value)}
                  placeholder="Enter location name..."
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newLocationType}
                  onValueChange={v =>
                    setNewLocationType(v as CampaignLocation['type'])
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

            <div className="flex justify-end">
              <Button
                onClick={handleCreateAndAdd}
                disabled={!newLocationName.trim() || isCreating}
              >
                {isCreating ? 'Creating...' : 'Create & Add'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// =====================================================================================
// Quest Picker Modal
// =====================================================================================

interface QuestPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quests: CampaignQuest[];
  selectedQuestIds: string[];
  onSelectQuest: (questId: string) => void;
  onCreateQuest: (
    title: string,
    type: CampaignQuest['type']
  ) => Promise<string>;
  title?: string;
  description?: string;
  multiSelect?: boolean;
  onSelectMultiple?: (questIds: string[]) => void;
}

export function QuestPickerModal({
  open,
  onOpenChange,
  quests,
  selectedQuestIds,
  onSelectQuest,
  onCreateQuest,
  title = 'Add Quest',
  description = 'Select an existing quest or create a new one',
  multiSelect = false,
  onSelectMultiple,
}: QuestPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestType, setNewQuestType] =
    useState<CampaignQuest['type']>('side');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const filteredQuests = quests.filter(quest => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    return quest.title.toLowerCase().includes(query);
  });

  const availableQuests = filteredQuests.filter(
    quest => !selectedQuestIds.includes(quest.id)
  );

  const resetState = () => {
    setSearchQuery('');
    setNewQuestTitle('');
    setNewQuestType('side');
    setSelectedIds([]);
    setIsCreating(false);
  };

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  const handleToggleSelection = (questId: string) => {
    if (multiSelect) {
      setSelectedIds(prev =>
        prev.includes(questId)
          ? prev.filter(id => id !== questId)
          : [...prev, questId]
      );
    } else {
      onSelectQuest(questId);
      handleClose();
    }
  };

  const handleConfirmMultiple = () => {
    if (multiSelect && onSelectMultiple) {
      onSelectMultiple(selectedIds);
      handleClose();
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newQuestTitle.trim()) return;
    setIsCreating(true);
    try {
      const newId = await onCreateQuest(newQuestTitle.trim(), newQuestType);
      if (multiSelect && onSelectMultiple) {
        onSelectMultiple([...selectedIds, newId]);
      } else {
        onSelectQuest(newId);
      }
      handleClose();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scroll className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select Existing</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search quests..."
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[200px] rounded-md border p-2">
              {availableQuests.length === 0 ? (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                  {quests.length === 0
                    ? 'No quests created yet'
                    : 'No matching quests'}
                </div>
              ) : (
                <div className="space-y-2">
                  {availableQuests.map(quest => {
                    const statusInfo = QUEST_STATUS_OPTIONS.find(
                      s => s.value === quest.status
                    );
                    const isSelected =
                      multiSelect && selectedIds.includes(quest.id);

                    return (
                      <button
                        key={quest.id}
                        type="button"
                        onClick={() => handleToggleSelection(quest.id)}
                        className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Scroll className="h-5 w-5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{quest.title}</div>
                          <div className="text-sm capitalize opacity-80">
                            {quest.type}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${statusInfo?.color ?? ''}`}
                        >
                          {quest.status}
                        </Badge>
                        {!multiSelect && (
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {multiSelect && selectedIds.length > 0 && (
              <div className="flex justify-end">
                <Button onClick={handleConfirmMultiple}>
                  Add {selectedIds.length} Quest
                  {selectedIds.length > 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Quest Title</Label>
                <Input
                  value={newQuestTitle}
                  onChange={e => setNewQuestTitle(e.target.value)}
                  placeholder="Enter quest title..."
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newQuestType}
                  onValueChange={v =>
                    setNewQuestType(v as CampaignQuest['type'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUEST_TYPE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleCreateAndAdd}
                disabled={!newQuestTitle.trim() || isCreating}
              >
                {isCreating ? 'Creating...' : 'Create & Add'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// =====================================================================================
// Organization Picker Modal
// =====================================================================================

interface OrganizationPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizations: CampaignOrganization[];
  selectedOrganizationIds: string[];
  onSelectOrganization: (organizationId: string) => void;
  onCreateOrganization: (
    name: string,
    type: CampaignOrganization['type']
  ) => Promise<string>;
  title?: string;
  description?: string;
  multiSelect?: boolean;
  onSelectMultiple?: (organizationIds: string[]) => void;
}

export function OrganizationPickerModal({
  open,
  onOpenChange,
  organizations,
  selectedOrganizationIds,
  onSelectOrganization,
  onCreateOrganization,
  title = 'Add Organization',
  description = 'Select an existing organization or create a new one',
  multiSelect = false,
  onSelectMultiple,
}: OrganizationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgType, setNewOrgType] =
    useState<CampaignOrganization['type']>('other');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const filteredOrganizations = organizations.filter(org => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    return org.name.toLowerCase().includes(query);
  });

  const availableOrganizations = filteredOrganizations.filter(
    org => !selectedOrganizationIds.includes(org.id)
  );

  const resetState = () => {
    setSearchQuery('');
    setNewOrgName('');
    setNewOrgType('other');
    setSelectedIds([]);
    setIsCreating(false);
  };

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  const handleToggleSelection = (orgId: string) => {
    if (multiSelect) {
      setSelectedIds(prev =>
        prev.includes(orgId)
          ? prev.filter(id => id !== orgId)
          : [...prev, orgId]
      );
    } else {
      onSelectOrganization(orgId);
      handleClose();
    }
  };

  const handleConfirmMultiple = () => {
    if (multiSelect && onSelectMultiple) {
      onSelectMultiple(selectedIds);
      handleClose();
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newOrgName.trim()) return;
    setIsCreating(true);
    try {
      const newId = await onCreateOrganization(newOrgName.trim(), newOrgType);
      if (multiSelect && onSelectMultiple) {
        onSelectMultiple([...selectedIds, newId]);
      } else {
        onSelectOrganization(newId);
      }
      handleClose();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select Existing</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search organizations..."
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[200px] rounded-md border p-2">
              {availableOrganizations.length === 0 ? (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                  {organizations.length === 0
                    ? 'No organizations created yet'
                    : 'No matching organizations'}
                </div>
              ) : (
                <div className="space-y-2">
                  {availableOrganizations.map(org => {
                    const typeInfo = ORGANIZATION_TYPE_OPTIONS.find(
                      t => t.value === org.type
                    );
                    const TypeIcon = typeInfo?.Icon ?? Users;
                    const isSelected =
                      multiSelect && selectedIds.includes(org.id);

                    return (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => handleToggleSelection(org.id)}
                        className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <TypeIcon className="h-5 w-5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm capitalize opacity-80">
                            {org.type}
                          </div>
                        </div>
                        {!multiSelect && (
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {multiSelect && selectedIds.length > 0 && (
              <div className="flex justify-end">
                <Button onClick={handleConfirmMultiple}>
                  Add {selectedIds.length} Organization
                  {selectedIds.length > 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input
                  value={newOrgName}
                  onChange={e => setNewOrgName(e.target.value)}
                  placeholder="Enter organization name..."
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newOrgType}
                  onValueChange={v =>
                    setNewOrgType(v as CampaignOrganization['type'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIZATION_TYPE_OPTIONS.map(option => (
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

            <div className="flex justify-end">
              <Button
                onClick={handleCreateAndAdd}
                disabled={!newOrgName.trim() || isCreating}
              >
                {isCreating ? 'Creating...' : 'Create & Add'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// =====================================================================================
// NPC Involvement Editor Modal - For editing NPC details within a session/quest
// =====================================================================================

interface NPCInvolvementEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  npcName: string;
  role: string;
  actionsTaken: string;
  notes: string;
  locationIds: string[];
  questIds: string[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  onSave: (data: {
    role: string;
    actionsTaken: string;
    notes: string;
    locationIds: string[];
    questIds: string[];
  }) => void;
}

export function NPCInvolvementEditorModal({
  open,
  onOpenChange,
  npcName,
  role: initialRole,
  actionsTaken: initialActionsTaken,
  notes: initialNotes,
  locationIds: initialLocationIds,
  questIds: initialQuestIds,
  locations,
  quests,
  onSave,
}: NPCInvolvementEditorProps) {
  const [role, setRole] = useState(initialRole);
  const [actionsTaken, setActionsTaken] = useState(initialActionsTaken);
  const [notes, setNotes] = useState(initialNotes);
  const [selectedLocations, setSelectedLocations] =
    useState<string[]>(initialLocationIds);
  const [selectedQuests, setSelectedQuests] =
    useState<string[]>(initialQuestIds);

  const handleSave = () => {
    onSave({
      role,
      actionsTaken,
      notes,
      locationIds: selectedLocations,
      questIds: selectedQuests,
    });
    onOpenChange(false);
  };

  const toggleLocation = (locationId: string) => {
    setSelectedLocations(prev =>
      prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  const toggleQuest = (questId: string) => {
    setSelectedQuests(prev =>
      prev.includes(questId)
        ? prev.filter(id => id !== questId)
        : [...prev, questId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit NPC Involvement: {npcName}
          </DialogTitle>
          <DialogDescription>
            Update how this NPC was involved in the session
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs">Role</Label>
              <Input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g., Quest Giver, Antagonist, Guide..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Actions Taken</Label>
              <Input
                value={actionsTaken}
                onChange={e => setActionsTaken(e.target.value)}
                placeholder="What did they do?"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Notes</Label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Additional details about this NPC's involvement..."
              rows={3}
            />
          </div>

          {locations.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs">
                <Map className="h-3 w-3" />
                Locations where NPC appeared
              </Label>
              <div className="flex flex-wrap gap-2">
                {locations.map(location => (
                  <Badge
                    key={location.id}
                    variant={
                      selectedLocations.includes(location.id)
                        ? 'default'
                        : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => toggleLocation(location.id)}
                  >
                    <Map className="mr-1 h-3 w-3" />
                    {location.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {quests.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs">
                <Scroll className="h-3 w-3" />
                Quests NPC was involved in
              </Label>
              <div className="flex flex-wrap gap-2">
                {quests.map(quest => (
                  <Badge
                    key={quest.id}
                    variant={
                      selectedQuests.includes(quest.id) ? 'default' : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => toggleQuest(quest.id)}
                  >
                    <Scroll className="mr-1 h-3 w-3" />
                    {quest.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// =====================================================================================
// Entity Badge Display Components
// =====================================================================================

interface EntityBadgeListProps {
  label: string;
  icon?: ReactNode;
  iconColor?: string;
  emptyText?: string;
  children: ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}

export function EntityBadgeList({
  label,
  icon,
  iconColor = 'text-muted-foreground',
  emptyText = 'None selected',
  children,
  onAdd,
  addLabel = 'Add',
}: EntityBadgeListProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-xs">
          {icon && <span className={iconColor}>{icon}</span>}
          {label}
        </Label>
        {onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="mr-1 h-3 w-3" />
            {addLabel}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {children || (
          <span className="text-muted-foreground text-sm">{emptyText}</span>
        )}
      </div>
    </div>
  );
}

interface RemovableBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  onRemove: () => void;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

export function RemovableBadge({
  children,
  icon,
  onRemove,
  onClick,
  variant = 'secondary',
  className,
}: RemovableBadgeProps) {
  return (
    <Badge variant={variant} className={`gap-1 pr-1 ${className ?? ''}`}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="flex items-center gap-1 hover:underline"
        >
          {icon}
          {children}
        </button>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onRemove();
        }}
        className="hover:bg-muted ml-1 rounded-full p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}
