// Location components - EditableLocations and LocationCard are tightly coupled

import {
  Building,
  ChevronDown,
  Map,
  MapPin,
  Mountain,
  Plus,
  Trash2,
  TreePine,
  X,
} from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useState } from 'react';

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
  addLocation,
  deleteLocation,
  updateLocation,
} from '@/features/campaigns/campaign-storage';
import type { CampaignLocation } from '@/lib/schemas/campaign';

type LocationIcon = (props: { className?: string }) => ReactNode;

const LOCATION_TYPE_ICONS: Record<CampaignLocation['type'], LocationIcon> = {
  city: Building,
  town: MapPin,
  village: TreePine,
  dungeon: Mountain,
  wilderness: Map,
  landmark: MapPin,
  building: Building,
  region: Map,
  other: MapPin,
};

const LOCATION_TYPE_COLORS: Record<CampaignLocation['type'], string> = {
  city: 'bg-blue-500/20 text-blue-600',
  town: 'bg-emerald-500/20 text-emerald-600',
  village: 'bg-green-500/20 text-green-600',
  dungeon: 'bg-purple-500/20 text-purple-600',
  wilderness: 'bg-lime-500/20 text-lime-600',
  landmark: 'bg-amber-500/20 text-amber-600',
  building: 'bg-slate-500/20 text-slate-600',
  region: 'bg-sky-500/20 text-sky-600',
  other: 'bg-gray-500/20 text-gray-600',
};

const LOCATION_TYPE_OPTIONS: Array<{
  value: CampaignLocation['type'];
  label: string;
}> = [
  { value: 'city', label: 'City' },
  { value: 'town', label: 'Town' },
  { value: 'village', label: 'Village' },
  { value: 'dungeon', label: 'Dungeon' },
  { value: 'wilderness', label: 'Wilderness' },
  { value: 'landmark', label: 'Landmark' },
  { value: 'building', label: 'Building' },
  { value: 'region', label: 'Region' },
  { value: 'other', label: 'Other' },
];

interface EditableLocationsProps {
  locations: CampaignLocation[];
  campaignId: string;
  onLocationsChange: () => void;
}

export function EditableLocations({
  locations,
  campaignId,
  onLocationsChange,
}: EditableLocationsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<CampaignLocation['type'] | null>(
    null
  );

  const filteredLocations = typeFilter
    ? locations.filter(location => location.type === typeFilter)
    : locations;

  const sortedLocations = [...filteredLocations].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleAddLocation = async () => {
    await addLocation(campaignId, {
      name: 'New Location',
      type: 'other',
      description: '',
      history: '',
      secrets: '',
      currentState: '',
      connectedLocations: [],
      npcsPresent: [],
      pointsOfInterest: [],
      tags: [],
      notes: '',
    });
    onLocationsChange();
  };

  const handleUpdateLocation = async (
    locationId: string,
    updates: Partial<Omit<CampaignLocation, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    await updateLocation(campaignId, locationId, updates);
    onLocationsChange();
  };

  const handleDeleteLocation = async (locationId: string) => {
    await deleteLocation(campaignId, locationId);
    onLocationsChange();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleAddLocation} className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
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
        <Card>
          <CardContent className="py-10 text-center">
            <Map className="text-muted-foreground mx-auto mb-2 h-6 w-6" />
            <p className="text-muted-foreground text-sm">
              Add cities, dungeons, and points of interest
            </p>
          </CardContent>
        </Card>
      ) : (
        sortedLocations.map(location => (
          <LocationCard
            key={location.id}
            location={location}
            isExpanded={expandedId === location.id}
            onToggle={() =>
              setExpandedId(expandedId === location.id ? null : location.id)
            }
            onUpdate={updates => handleUpdateLocation(location.id, updates)}
            onDelete={() => handleDeleteLocation(location.id)}
          />
        ))
      )}
    </div>
  );
}

interface LocationCardProps {
  location: CampaignLocation;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    updates: Partial<Omit<CampaignLocation, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  onDelete: () => void;
}

type LocationTextFieldKey =
  | 'name'
  | 'description'
  | 'currentState'
  | 'history'
  | 'secrets'
  | 'notes';

interface LocationCardContentProps {
  localLocation: CampaignLocation;
  tagInput: string;
  poiName: string;
  poiDesc: string;
  onTagInputChange: (value: string) => void;
  onPoiNameChange: (value: string) => void;
  onPoiDescChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onAddPOI: () => void;
  onRemovePOI: (index: number) => void;
  onTextChange: (field: LocationTextFieldKey, value: string) => void;
  onTypeChange: (value: CampaignLocation['type']) => void;
  onBlur: () => void;
}

function useLocationCardState(
  location: CampaignLocation,
  onUpdate: LocationCardProps['onUpdate']
) {
  const [localLocation, setLocalLocation] = useState(location);
  const [tagInput, setTagInput] = useState('');
  const [poiName, setPoiName] = useState('');
  const [poiDesc, setPoiDesc] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setLocalLocation(location);
  }, [location]);

  const handleBlur = useCallback(() => {
    onUpdate(localLocation);
  }, [localLocation, onUpdate]);

  const handleTextChange = useCallback(
    (field: LocationTextFieldKey, value: string) => {
      setLocalLocation(current => ({ ...current, [field]: value }));
    },
    []
  );

  const handleTypeChange = useCallback(
    (value: CampaignLocation['type']) => {
      setLocalLocation(current => ({ ...current, type: value }));
      onUpdate({ type: value });
    },
    [onUpdate]
  );

  const addTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (!trimmed || localLocation.tags.includes(trimmed)) {
      return;
    }
    const newTags = [...localLocation.tags, trimmed];
    setLocalLocation(current => ({ ...current, tags: newTags }));
    onUpdate({ tags: newTags });
    setTagInput('');
  }, [localLocation.tags, onUpdate, tagInput]);

  const removeTag = useCallback(
    (tag: string) => {
      const newTags = localLocation.tags.filter(item => item !== tag);
      setLocalLocation(current => ({ ...current, tags: newTags }));
      onUpdate({ tags: newTags });
    },
    [localLocation.tags, onUpdate]
  );

  const addPOI = useCallback(() => {
    const trimmedName = poiName.trim();
    if (!trimmedName) {
      return;
    }
    const newPOIs = [
      ...localLocation.pointsOfInterest,
      { name: trimmedName, description: poiDesc.trim() },
    ];
    setLocalLocation(current => ({ ...current, pointsOfInterest: newPOIs }));
    onUpdate({ pointsOfInterest: newPOIs });
    setPoiName('');
    setPoiDesc('');
  }, [localLocation.pointsOfInterest, onUpdate, poiDesc, poiName]);

  const removePOI = useCallback(
    (index: number) => {
      const newPOIs = localLocation.pointsOfInterest.filter(
        (_, currentIndex) => currentIndex !== index
      );
      setLocalLocation(current => ({ ...current, pointsOfInterest: newPOIs }));
      onUpdate({ pointsOfInterest: newPOIs });
    },
    [localLocation.pointsOfInterest, onUpdate]
  );

  return {
    localLocation,
    tagInput,
    poiName,
    poiDesc,
    showDeleteConfirm,
    setShowDeleteConfirm,
    setTagInput,
    setPoiName,
    setPoiDesc,
    handleBlur,
    handleTextChange,
    handleTypeChange,
    addTag,
    removeTag,
    addPOI,
    removePOI,
  };
}

interface LocationHeaderProps {
  location: CampaignLocation;
  isExpanded: boolean;
  onOpenDelete: () => void;
}

function LocationHeader({
  location,
  isExpanded,
  onOpenDelete,
}: LocationHeaderProps) {
  const TypeIcon = LOCATION_TYPE_ICONS[location.type];

  return (
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="h-auto flex-1 justify-start p-0">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded ${LOCATION_TYPE_COLORS[location.type]}`}
              >
                <TypeIcon className="h-4 w-4" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">{location.name}</h4>
                <p className="text-muted-foreground text-xs capitalize">
                  {location.type}
                </p>
              </div>
              <ChevronDown
                className={`text-muted-foreground h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </Button>
        </CollapsibleTrigger>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenDelete}
          className="text-destructive hover:bg-destructive/10 h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
}

interface LocationDeleteDialogProps {
  locationName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

function LocationDeleteDialog({
  locationName,
  open,
  onOpenChange,
  onConfirmDelete,
}: LocationDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Location</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{locationName}"? This action cannot
            be undone.
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

interface LocationTextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function LocationTextField({
  label,
  value,
  placeholder,
  onChange,
  onBlur,
}: LocationTextFieldProps) {
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

interface LocationTextAreaFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
  onBlur: () => void;
  icon?: ReactNode;
}

function LocationTextAreaField({
  label,
  value,
  placeholder,
  rows = 2,
  onChange,
  onBlur,
  icon,
}: LocationTextAreaFieldProps) {
  return (
    <div>
      <Label className="flex items-center gap-1 text-xs">
        {icon}
        {label}
      </Label>
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

interface LocationBadgeListFieldProps {
  label: string;
  items: string[];
  inputValue: string;
  inputPlaceholder: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (value: string) => void;
  icon?: ReactNode;
  badgeVariant?: 'secondary' | 'outline';
}

function LocationBadgeListField({
  label,
  items,
  inputValue,
  inputPlaceholder,
  onInputChange,
  onAdd,
  onRemove,
  icon,
  badgeVariant = 'secondary',
}: LocationBadgeListFieldProps) {
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

interface LocationPOIListProps {
  pointsOfInterest: CampaignLocation['pointsOfInterest'];
  poiName: string;
  poiDesc: string;
  onPoiNameChange: (value: string) => void;
  onPoiDescChange: (value: string) => void;
  onAddPOI: () => void;
  onRemovePOI: (index: number) => void;
}

function LocationPOIList({
  pointsOfInterest,
  poiName,
  poiDesc,
  onPoiNameChange,
  onPoiDescChange,
  onAddPOI,
  onRemovePOI,
}: LocationPOIListProps) {
  return (
    <div>
      <Label className="text-xs">Points of Interest</Label>
      <div className="mt-1 space-y-2">
        {pointsOfInterest.map((poi, index) => (
          <div
            key={`${poi.name}-${index}`}
            className="bg-muted/50 rounded-md p-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{poi.name}</p>
                {poi.description && (
                  <p className="text-muted-foreground text-xs">
                    {poi.description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemovePOI(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            value={poiName}
            onChange={e => onPoiNameChange(e.target.value)}
            placeholder="POI name..."
          />
          <Input
            value={poiDesc}
            onChange={e => onPoiDescChange(e.target.value)}
            placeholder="Short description..."
          />
        </div>
        <Button variant="outline" size="sm" onClick={onAddPOI}>
          <Plus className="mr-2 h-4 w-4" />
          Add Point of Interest
        </Button>
      </div>
    </div>
  );
}

function LocationCard({
  location,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: LocationCardProps) {
  const {
    localLocation,
    tagInput,
    poiName,
    poiDesc,
    showDeleteConfirm,
    setShowDeleteConfirm,
    setTagInput,
    setPoiName,
    setPoiDesc,
    handleBlur,
    handleTextChange,
    handleTypeChange,
    addTag,
    removeTag,
    addPOI,
    removePOI,
  } = useLocationCardState(location, onUpdate);

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card>
        <LocationHeader
          location={localLocation}
          isExpanded={isExpanded}
          onOpenDelete={() => setShowDeleteConfirm(true)}
        />

        <LocationDeleteDialog
          locationName={localLocation.name}
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onConfirmDelete={onDelete}
        />

        <CollapsibleContent>
          <LocationCardContent
            localLocation={localLocation}
            tagInput={tagInput}
            poiName={poiName}
            poiDesc={poiDesc}
            onTagInputChange={setTagInput}
            onPoiNameChange={setPoiName}
            onPoiDescChange={setPoiDesc}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            onAddPOI={addPOI}
            onRemovePOI={removePOI}
            onTextChange={handleTextChange}
            onTypeChange={handleTypeChange}
            onBlur={handleBlur}
          />
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function LocationCardContent({
  localLocation,
  tagInput,
  poiName,
  poiDesc,
  onTagInputChange,
  onPoiNameChange,
  onPoiDescChange,
  onAddTag,
  onRemoveTag,
  onAddPOI,
  onRemovePOI,
  onTextChange,
  onTypeChange,
  onBlur,
}: LocationCardContentProps) {
  return (
    <CardContent className="space-y-4 pt-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <LocationTextField
          label="Name"
          value={localLocation.name}
          onChange={value => onTextChange('name', value)}
          onBlur={onBlur}
        />
        <div>
          <Label className="text-xs">Type</Label>
          <Select
            value={localLocation.type}
            onValueChange={value =>
              onTypeChange(value as CampaignLocation['type'])
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="city">City</SelectItem>
              <SelectItem value="town">Town</SelectItem>
              <SelectItem value="village">Village</SelectItem>
              <SelectItem value="dungeon">Dungeon</SelectItem>
              <SelectItem value="wilderness">Wilderness</SelectItem>
              <SelectItem value="landmark">Landmark</SelectItem>
              <SelectItem value="building">Building</SelectItem>
              <SelectItem value="region">Region</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <LocationTextAreaField
        label="Description"
        value={localLocation.description}
        onChange={value => onTextChange('description', value)}
        onBlur={onBlur}
        rows={2}
        placeholder="What does this place look like?"
      />

      <LocationTextAreaField
        label="Current State"
        value={localLocation.currentState}
        onChange={value => onTextChange('currentState', value)}
        onBlur={onBlur}
        rows={2}
        placeholder="What's happening here now?"
      />

      <LocationTextAreaField
        label="History & Lore"
        value={localLocation.history}
        onChange={value => onTextChange('history', value)}
        onBlur={onBlur}
        rows={2}
        placeholder="Background and history..."
      />

      <LocationTextAreaField
        label="Secrets (GM Only)"
        value={localLocation.secrets}
        onChange={value => onTextChange('secrets', value)}
        onBlur={onBlur}
        rows={2}
        placeholder="Hidden information..."
      />

      <LocationPOIList
        pointsOfInterest={localLocation.pointsOfInterest}
        poiName={poiName}
        poiDesc={poiDesc}
        onPoiNameChange={onPoiNameChange}
        onPoiDescChange={onPoiDescChange}
        onAddPOI={onAddPOI}
        onRemovePOI={onRemovePOI}
      />

      <LocationBadgeListField
        label="Tags"
        items={localLocation.tags}
        inputValue={tagInput}
        inputPlaceholder="Add a tag..."
        onInputChange={onTagInputChange}
        onAdd={onAddTag}
        onRemove={onRemoveTag}
      />

      <LocationTextAreaField
        label="Additional Notes"
        value={localLocation.notes}
        onChange={value => onTextChange('notes', value)}
        onBlur={onBlur}
        rows={2}
        placeholder="Any other notes..."
      />
    </CardContent>
  );
}
