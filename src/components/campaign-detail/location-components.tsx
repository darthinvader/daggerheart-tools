/* eslint-disable max-lines */
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
  addLocation,
  deleteLocation,
  updateLocation,
} from '@/features/campaigns/campaign-storage';
import type { CampaignLocation } from '@/lib/schemas/campaign';

const LOCATION_TYPE_ICONS = {
  city: Building,
  town: Building,
  village: Building,
  dungeon: Map,
  wilderness: TreePine,
  landmark: Mountain,
  building: Building,
  region: Map,
  other: MapPin,
};

const LOCATION_TYPE_COLORS = {
  city: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
  town: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  village: 'bg-green-500/20 text-green-700 dark:text-green-400',
  dungeon: 'bg-red-500/20 text-red-700 dark:text-red-400',
  wilderness: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  landmark: 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
  building: 'bg-slate-500/20 text-slate-700 dark:text-slate-400',
  region: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
  other: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
};

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
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const allTypes = [...new Set(locations.map(loc => loc.type))].sort();

  const filteredLocations = typeFilter
    ? locations.filter(loc => loc.type === typeFilter)
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
      <div className="flex items-center gap-2">
        <Button onClick={handleAddLocation} className="flex-1">
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
        {allTypes.length > 0 && (
          <Select
            value={typeFilter ?? 'all'}
            onValueChange={v => setTypeFilter(v === 'all' ? null : v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {allTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {sortedLocations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MapPin className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
            <p className="text-muted-foreground">No locations created yet</p>
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

function LocationCard({
  location,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: LocationCardProps) {
  const [localLocation, setLocalLocation] = useState(location);
  const [tagInput, setTagInput] = useState('');
  const [poiName, setPoiName] = useState('');
  const [poiDesc, setPoiDesc] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setLocalLocation(location);
  }, [location]);

  const handleBlur = () => {
    onUpdate(localLocation);
  };

  const addTag = () => {
    if (tagInput.trim() && !localLocation.tags.includes(tagInput.trim())) {
      const newTags = [...localLocation.tags, tagInput.trim()];
      setLocalLocation({ ...localLocation, tags: newTags });
      onUpdate({ tags: newTags });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = localLocation.tags.filter(t => t !== tag);
    setLocalLocation({ ...localLocation, tags: newTags });
    onUpdate({ tags: newTags });
  };

  const addPOI = () => {
    if (poiName.trim()) {
      const newPOIs = [
        ...localLocation.pointsOfInterest,
        { name: poiName.trim(), description: poiDesc.trim() },
      ];
      setLocalLocation({ ...localLocation, pointsOfInterest: newPOIs });
      onUpdate({ pointsOfInterest: newPOIs });
      setPoiName('');
      setPoiDesc('');
    }
  };

  const removePOI = (index: number) => {
    const newPOIs = localLocation.pointsOfInterest.filter(
      (_, i) => i !== index
    );
    setLocalLocation({ ...localLocation, pointsOfInterest: newPOIs });
    onUpdate({ pointsOfInterest: newPOIs });
  };

  const TypeIcon = LOCATION_TYPE_ICONS[localLocation.type];

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto flex-1 justify-start p-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded ${LOCATION_TYPE_COLORS[localLocation.type]}`}
                  >
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">{localLocation.name}</h4>
                    <p className="text-muted-foreground text-xs capitalize">
                      {localLocation.type}
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
              onClick={() => setShowDeleteConfirm(true)}
              className="text-destructive hover:bg-destructive/10 h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <AlertDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Location</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{localLocation.name}"? This
                action cannot be undone.
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
          <CardContent className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  value={localLocation.name}
                  onChange={e =>
                    setLocalLocation({ ...localLocation, name: e.target.value })
                  }
                  onBlur={handleBlur}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select
                  value={localLocation.type}
                  onValueChange={v => {
                    const newType = v as CampaignLocation['type'];
                    setLocalLocation({ ...localLocation, type: newType });
                    onUpdate({ type: newType });
                  }}
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

            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={localLocation.description}
                onChange={e =>
                  setLocalLocation({
                    ...localLocation,
                    description: e.target.value,
                  })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="What does this place look like?"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">Current State</Label>
              <Textarea
                value={localLocation.currentState}
                onChange={e =>
                  setLocalLocation({
                    ...localLocation,
                    currentState: e.target.value,
                  })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="What's happening here now?"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">History & Lore</Label>
              <Textarea
                value={localLocation.history}
                onChange={e =>
                  setLocalLocation({
                    ...localLocation,
                    history: e.target.value,
                  })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Background and history..."
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">Secrets (GM Only)</Label>
              <Textarea
                value={localLocation.secrets}
                onChange={e =>
                  setLocalLocation({
                    ...localLocation,
                    secrets: e.target.value,
                  })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Hidden information..."
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">Points of Interest</Label>
              <div className="mt-1 space-y-2">
                {localLocation.pointsOfInterest.map((poi, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 flex items-start gap-2 rounded-md p-2"
                  >
                    <div className="flex-1">
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
                      onClick={() => removePOI(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={poiName}
                    onChange={e => setPoiName(e.target.value)}
                    placeholder="POI name"
                    className="flex-1"
                  />
                  <Input
                    value={poiDesc}
                    onChange={e => setPoiDesc(e.target.value)}
                    placeholder="Description (optional)"
                    className="flex-1"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addPOI();
                      }
                    }}
                  />
                  <Button variant="outline" size="icon" onClick={addPOI}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs">Tags</Label>
              <div className="mt-1 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {localLocation.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
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
                    placeholder="Add a tag..."
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
                value={localLocation.notes}
                onChange={e =>
                  setLocalLocation({ ...localLocation, notes: e.target.value })
                }
                onBlur={handleBlur}
                rows={2}
                placeholder="Any other notes..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
