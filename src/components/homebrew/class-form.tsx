/**
 * Homebrew Class Form
 *
 * Form for creating and editing homebrew classes.
 * Matches BaseClassSchema + HomebrewClassContentSchema properties.
 */
import {
  BookOpen,
  Plus,
  Shield,
  Sparkles,
  Sword,
  Theater,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { FeatureModifiersSection } from '@/components/shared/feature-modifiers-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import {
  ALL_KNOWN_DOMAINS,
  type FeatureStatModifiers,
} from '@/lib/schemas/core';
import { cn } from '@/lib/utils';

// Domain color mapping for visual distinction
const DOMAIN_COLORS: Record<string, string> = {
  Arcana: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
  Blade: 'bg-red-500/20 border-red-500/50 text-red-300',
  Bone: 'bg-gray-500/20 border-gray-500/50 text-gray-300',
  Codex: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
  Grace: 'bg-pink-500/20 border-pink-500/50 text-pink-300',
  Midnight: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300',
  Sage: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
  Splendor: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
  Valor: 'bg-orange-500/20 border-orange-500/50 text-orange-300',
};

/**
 * Data shape that the ClassForm works with.
 * Compatible with both HomebrewClass['content'] (homebrew page)
 * and the character page inline class type.
 */
export interface ClassFormData {
  name: string;
  description: string;
  domains: string[];
  startingHitPoints: number;
  startingEvasion: number;
  classItems: string[];
  hopeFeature: { name: string; description: string; hopeCost: number };
  classFeatures: Array<{
    name: string;
    description: string;
    modifiers?: FeatureStatModifiers;
  }>;
  backgroundQuestions: string[];
  connections: string[];
  startingEquipment: Array<{ name: string; description?: string }>;
  subclasses?: Array<{
    name: string;
    description: string;
    spellcastTrait?: string;
    features: Array<{
      name: string;
      description: string;
      type: string;
      level?: number;
      modifiers?: FeatureStatModifiers;
    }>;
  }>;
  isHomebrew: true;
}

interface ClassFormProps {
  initialData?: ClassFormData;
  /** Called on form submit (dialog mode) */
  onSubmit?: (data: ClassFormData) => void;
  /** Called on cancel (dialog mode) */
  onCancel?: () => void;
  /** Called on every change (inline mode) */
  onChange?: (data: ClassFormData) => void;
  isSubmitting?: boolean;
  /** Show submit/cancel buttons (default: true, set false for inline mode) */
  showActions?: boolean;
  /** Include subclass section (default: false, set true for character page) */
  includeSubclasses?: boolean;
}

interface FeatureState {
  id: string;
  name: string;
  description: string;
  modifiers?: FeatureStatModifiers;
}

interface SubclassState {
  id: string;
  name: string;
  description: string;
  spellcastTrait?: string;
  features: Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    level?: number;
    modifiers?: FeatureStatModifiers;
  }>;
}

const FEATURE_TYPES = ['foundation', 'specialization', 'mastery'] as const;
const FEATURE_TYPE_COLORS: Record<string, string> = {
  foundation: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  specialization: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  mastery: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
};

interface SubclassesSectionProps {
  subclasses: SubclassState[];
  onAddSubclass: () => void;
  onUpdateSubclass: (id: string, updates: Partial<SubclassState>) => void;
  onRemoveSubclass: (id: string) => void;
  onAddFeature: (subclassId: string) => void;
  onUpdateFeature: (
    subclassId: string,
    featureId: string,
    updates: Partial<SubclassState['features'][number]>
  ) => void;
  onRemoveFeature: (subclassId: string, featureId: string) => void;
}

function SubclassesSection({
  subclasses,
  onAddSubclass,
  onUpdateSubclass,
  onRemoveSubclass,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
}: SubclassesSectionProps) {
  return (
    <Card className="border-primary/50 border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="inline-flex items-center">
              <Theater className="size-3" />
            </Badge>
            <CardTitle className="text-base">Subclasses</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onAddSubclass}>
            <Plus className="mr-1 size-3" /> Add Subclass
          </Button>
        </div>
        <CardDescription>
          Create at least one subclass for your homebrew class.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subclasses.map((subclass, index) => (
          <div
            key={subclass.id}
            className="bg-muted/30 space-y-4 rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <Badge variant="secondary">Subclass {index + 1}</Badge>
              {subclasses.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveSubclass(subclass.id)}
                  className="text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Subclass Name</Label>
                <Input
                  value={subclass.name}
                  onChange={e =>
                    onUpdateSubclass(subclass.id, { name: e.target.value })
                  }
                  placeholder="e.g., Battle Mage"
                />
              </div>
              <div className="space-y-2">
                <Label>Spellcast Trait (optional)</Label>
                <Select
                  value={subclass.spellcastTrait ?? ''}
                  onValueChange={v =>
                    onUpdateSubclass(subclass.id, {
                      spellcastTrait: v || undefined,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trait..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="Presence">Presence</SelectItem>
                    <SelectItem value="Knowledge">Knowledge</SelectItem>
                    <SelectItem value="Instinct">Instinct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={subclass.description}
                onChange={e =>
                  onUpdateSubclass(subclass.id, { description: e.target.value })
                }
                placeholder="Describe this subclass..."
                rows={2}
              />
            </div>

            {/* Subclass Features */}
            <div className="space-y-3 border-t pt-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Subclass Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddFeature(subclass.id)}
                >
                  <Plus className="mr-1 size-3" /> Add Feature
                </Button>
              </div>

              {subclass.features.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">
                  No features yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {subclass.features.map(feature => (
                    <div
                      key={feature.id}
                      className="bg-background space-y-3 rounded border p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant="outline"
                          className={
                            FEATURE_TYPE_COLORS[feature.type] ??
                            FEATURE_TYPE_COLORS.foundation
                          }
                        >
                          {feature.type}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onRemoveFeature(subclass.id, feature.id)
                          }
                          className="text-destructive h-7 w-7 p-0"
                        >
                          ✕
                        </Button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Name</Label>
                          <Input
                            value={feature.name}
                            onChange={e =>
                              onUpdateFeature(subclass.id, feature.id, {
                                name: e.target.value,
                              })
                            }
                            placeholder="Feature name..."
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={feature.type}
                            onValueChange={v =>
                              onUpdateFeature(subclass.id, feature.id, {
                                type: v,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FEATURE_TYPES.map(type => (
                                <SelectItem key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Level (optional)</Label>
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            value={feature.level ?? ''}
                            onChange={e =>
                              onUpdateFeature(subclass.id, feature.id, {
                                level: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            placeholder="1-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={feature.description}
                          onChange={e =>
                            onUpdateFeature(subclass.id, feature.id, {
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe what this feature does..."
                          rows={2}
                        />
                      </div>

                      <FeatureModifiersSection
                        modifiers={feature.modifiers}
                        onChange={modifiers =>
                          onUpdateFeature(subclass.id, feature.id, {
                            modifiers,
                          })
                        }
                        title="Feature Modifiers"
                        colorClass="text-purple-500"
                        showTraits
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const DEFAULT_FORM_DATA: ClassFormData = {
  name: '',
  description: '',
  domains: ['Arcana', 'Blade'],
  startingHitPoints: 6,
  startingEvasion: 10,
  classItems: [],
  hopeFeature: { name: '', description: '', hopeCost: 3 },
  classFeatures: [],
  backgroundQuestions: [],
  connections: [],
  startingEquipment: [],
  subclasses: [{ name: '', description: '', features: [] }],
  isHomebrew: true,
};

export function ClassForm({
  initialData,
  onSubmit,
  onCancel,
  onChange,
  isSubmitting = false,
  showActions = true,
  includeSubclasses = false,
}: ClassFormProps) {
  const [formData, setFormData] = useState<ClassFormData>(
    initialData ?? { ...DEFAULT_FORM_DATA }
  );
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    initialData?.domains ?? ['Arcana', 'Blade']
  );
  const [classItems, setClassItems] = useState<string[]>(
    initialData?.classItems ?? []
  );
  const [newClassItem, setNewClassItem] = useState('');
  const [classFeatures, setClassFeatures] = useState<FeatureState[]>(
    (initialData?.classFeatures ?? []).map((f, i) => ({
      id: `feature-${i}`,
      name: f.name,
      description: f.description,
      modifiers: f.modifiers,
    }))
  );
  const [backgroundQuestions, setBackgroundQuestions] = useState<string[]>(
    initialData?.backgroundQuestions ?? []
  );
  const [newQuestion, setNewQuestion] = useState('');
  const [connections, setConnections] = useState<string[]>(
    initialData?.connections ?? []
  );
  const [newConnection, setNewConnection] = useState('');
  const [startingEquipment, setStartingEquipment] = useState<
    Array<{ id: string; name: string; description: string }>
  >(
    (initialData?.startingEquipment ?? []).map((e, i) => ({
      id: `equip-${i}`,
      name: e.name,
      description: e.description ?? '',
    }))
  );
  const [subclasses, setSubclasses] = useState<SubclassState[]>(
    (
      initialData?.subclasses ?? [{ name: '', description: '', features: [] }]
    ).map((s, i) => ({
      id: `subclass-${i}`,
      name: s.name,
      description: s.description,
      spellcastTrait: s.spellcastTrait,
      features: (s.features ?? []).map((f, j) => ({
        id: `subclass-${i}-feature-${j}`,
        name: f.name,
        description: f.description,
        type: f.type || 'foundation',
        level: f.level,
        modifiers: f.modifiers,
      })),
    }))
  );

  // Build current data for onChange callback
  const buildCurrentData = useCallback((): ClassFormData => {
    return {
      ...formData,
      domains: selectedDomains,
      classItems: classItems.filter(c => c.trim()),
      classFeatures: classFeatures.map(f => ({
        name: f.name,
        description: f.description,
        modifiers: f.modifiers,
      })),
      backgroundQuestions: backgroundQuestions.filter(q => q.trim()),
      connections: connections.filter(c => c.trim()),
      startingEquipment: startingEquipment
        .filter(e => e.name.trim())
        .map(e => ({
          name: e.name,
          description: e.description || undefined,
        })),
      subclasses: subclasses.map(s => ({
        name: s.name,
        description: s.description,
        spellcastTrait: s.spellcastTrait,
        features: s.features.map(f => ({
          name: f.name,
          description: f.description,
          type: f.type,
          level: f.level,
          modifiers: f.modifiers,
        })),
      })),
      isHomebrew: true,
    };
  }, [
    formData,
    selectedDomains,
    classItems,
    classFeatures,
    backgroundQuestions,
    connections,
    startingEquipment,
    subclasses,
  ]);

  // Notify onChange when data changes
  const notifyChange = useCallback(() => {
    if (onChange) {
      onChange(buildCurrentData());
    }
  }, [onChange, buildCurrentData]);

  // Auto-notify on formData changes (for inline mode)
  useEffect(() => {
    if (onChange) {
      notifyChange();
    }
  }, [
    formData,
    classFeatures,
    classItems,
    backgroundQuestions,
    connections,
    startingEquipment,
    subclasses,
  ]);  

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(buildCurrentData());
      }
    },
    [onSubmit, buildCurrentData]
  );

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev => {
      const newDomains = prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : prev.length < 2
          ? [...prev, domain]
          : [prev[1], domain];

      // Schedule onChange after state update
      setTimeout(() => notifyChange(), 0);
      return newDomains;
    });
  };

  const addListItem = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    clearInput: () => void
  ) => {
    if (value.trim()) {
      setter(prev => [...prev, value.trim()]);
      clearInput();
    }
  };

  const removeListItem = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    setClassFeatures(prev => [
      ...prev,
      { id: `feature-${Date.now()}`, name: '', description: '' },
    ]);
  };

  const removeFeature = (id: string) => {
    setClassFeatures(prev => prev.filter(f => f.id !== id));
  };

  const updateFeature = (id: string, updates: Partial<FeatureState>) => {
    setClassFeatures(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Basic Info */}
          <section className="space-y-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <User className="size-4 text-amber-500" /> Class Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">Class Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Mystic Guardian"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description ?? ''}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the class fantasy and playstyle..."
                rows={3}
                required
              />
            </div>
          </section>

          <Separator />

          {/* Domains */}
          <section className="space-y-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <BookOpen className="size-4 text-purple-500" /> Domains (Select 2)
            </h3>
            <p className="text-muted-foreground text-sm">
              Choose the two domains that define this class.
            </p>

            <div className="flex flex-wrap gap-2">
              {ALL_KNOWN_DOMAINS.map(domain => (
                <Badge
                  key={domain}
                  variant="outline"
                  className={cn(
                    'cursor-pointer transition-all',
                    selectedDomains.includes(domain)
                      ? (DOMAIN_COLORS[domain] ??
                          'bg-primary/20 border-primary')
                      : 'hover:bg-muted'
                  )}
                  onClick={() => toggleDomain(domain)}
                >
                  {domain}
                </Badge>
              ))}
            </div>

            {selectedDomains.length !== 2 && (
              <p className="text-destructive text-sm">
                Please select exactly 2 domains.
              </p>
            )}
          </section>

          <Separator />

          {/* Base Statistics */}
          <section className="space-y-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Shield className="size-4 text-blue-500" /> Base Statistics
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startingHitPoints">Starting Hit Points *</Label>
                <Input
                  id="startingHitPoints"
                  type="number"
                  min={1}
                  value={formData.startingHitPoints ?? ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      startingHitPoints: parseInt(e.target.value, 10) || 6,
                    }))
                  }
                  placeholder="e.g., 6"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startingEvasion">Starting Evasion *</Label>
                <Input
                  id="startingEvasion"
                  type="number"
                  min={1}
                  value={formData.startingEvasion ?? ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      startingEvasion: parseInt(e.target.value, 10) || 10,
                    }))
                  }
                  placeholder="e.g., 10"
                  required
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Hope Feature */}
          <section className="space-y-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Sparkles className="size-4 text-yellow-500" /> Hope Feature
            </h3>
            <p className="text-muted-foreground text-sm">
              The special ability gained when spending Hope.
            </p>

            <div className="bg-background/50 space-y-3 rounded-lg border border-yellow-500/20 p-4">
              <div className="space-y-2">
                <Label htmlFor="hopeFeatureName">Feature Name *</Label>
                <Input
                  id="hopeFeatureName"
                  value={formData.hopeFeature?.name ?? ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      hopeFeature: {
                        ...prev.hopeFeature,
                        name: e.target.value,
                        description: prev.hopeFeature?.description ?? '',
                        hopeCost: prev.hopeFeature?.hopeCost ?? 3,
                      },
                    }))
                  }
                  placeholder="e.g., Mystic Strike"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hopeFeatureCost">Hope Cost *</Label>
                <Input
                  id="hopeFeatureCost"
                  type="number"
                  min={1}
                  value={formData.hopeFeature?.hopeCost ?? 3}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      hopeFeature: {
                        ...prev.hopeFeature,
                        name: prev.hopeFeature?.name ?? '',
                        description: prev.hopeFeature?.description ?? '',
                        hopeCost: parseInt(e.target.value, 10) || 3,
                      },
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hopeFeatureDesc">Description *</Label>
                <Textarea
                  id="hopeFeatureDesc"
                  value={formData.hopeFeature?.description ?? ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      hopeFeature: {
                        ...prev.hopeFeature,
                        name: prev.hopeFeature?.name ?? '',
                        hopeCost: prev.hopeFeature?.hopeCost ?? 3,
                        description: e.target.value,
                      },
                    }))
                  }
                  placeholder="Describe what this feature does..."
                  rows={3}
                  required
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Class Items */}
          <section className="space-y-4 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Sword className="size-4 text-orange-500" /> Class Items
            </h3>
            <p className="text-muted-foreground text-sm">
              Starting equipment options for this class.
            </p>

            <div className="flex flex-wrap gap-2">
              {classItems.map((item, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 border-orange-500/50 bg-orange-500/20"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeListItem(index, setClassItems)}
                    className="hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newClassItem}
                onChange={e => setNewClassItem(e.target.value)}
                placeholder="e.g., Longsword"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addListItem(newClassItem, setClassItems, () =>
                      setNewClassItem('')
                    );
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  addListItem(newClassItem, setClassItems, () =>
                    setNewClassItem('')
                  )
                }
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </section>

          <Separator />

          {/* Class Features */}
          <section className="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold">
                <Sparkles className="size-4 text-emerald-500" /> Class Features
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
              >
                <Plus className="mr-1 size-4" /> Add Feature
              </Button>
            </div>

            {classFeatures.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">
                No features added yet.
              </p>
            ) : (
              <div className="space-y-3">
                {classFeatures.map(feature => (
                  <div
                    key={feature.id}
                    className="bg-background/50 space-y-2 rounded-lg border border-emerald-500/20 p-3"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          value={feature.name}
                          onChange={e =>
                            updateFeature(feature.id, { name: e.target.value })
                          }
                          placeholder="Feature name"
                        />
                        <Textarea
                          value={feature.description}
                          onChange={e =>
                            updateFeature(feature.id, {
                              description: e.target.value,
                            })
                          }
                          placeholder="Feature description..."
                          rows={2}
                        />
                        <FeatureModifiersSection
                          modifiers={feature.modifiers}
                          onChange={modifiers =>
                            updateFeature(feature.id, { modifiers })
                          }
                          title="Feature Modifiers"
                          colorClass="text-emerald-500"
                          showTraits
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(feature.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Subclasses Section (only when includeSubclasses is true) */}
          {includeSubclasses && (
            <>
              <Separator />
              <SubclassesSection
                subclasses={subclasses}
                onAddSubclass={() => {
                  setSubclasses(prev => [
                    ...prev,
                    {
                      id: `subclass-${Date.now()}`,
                      name: '',
                      description: '',
                      features: [],
                    },
                  ]);
                  setTimeout(() => notifyChange(), 0);
                }}
                onUpdateSubclass={(id, updates) => {
                  setSubclasses(prev =>
                    prev.map(s => (s.id === id ? { ...s, ...updates } : s))
                  );
                  setTimeout(() => notifyChange(), 0);
                }}
                onRemoveSubclass={id => {
                  if (subclasses.length <= 1) return;
                  setSubclasses(prev => prev.filter(s => s.id !== id));
                  setTimeout(() => notifyChange(), 0);
                }}
                onAddFeature={subclassId => {
                  setSubclasses(prev =>
                    prev.map(s =>
                      s.id === subclassId
                        ? {
                            ...s,
                            features: [
                              ...s.features,
                              {
                                id: `feature-${Date.now()}`,
                                name: '',
                                description: '',
                                type: 'foundation',
                              },
                            ],
                          }
                        : s
                    )
                  );
                  setTimeout(() => notifyChange(), 0);
                }}
                onUpdateFeature={(subclassId, featureId, updates) => {
                  setSubclasses(prev =>
                    prev.map(s =>
                      s.id === subclassId
                        ? {
                            ...s,
                            features: s.features.map(f =>
                              f.id === featureId ? { ...f, ...updates } : f
                            ),
                          }
                        : s
                    )
                  );
                  setTimeout(() => notifyChange(), 0);
                }}
                onRemoveFeature={(subclassId, featureId) => {
                  setSubclasses(prev =>
                    prev.map(s =>
                      s.id === subclassId
                        ? {
                            ...s,
                            features: s.features.filter(
                              f => f.id !== featureId
                            ),
                          }
                        : s
                    )
                  );
                  setTimeout(() => notifyChange(), 0);
                }}
              />
            </>
          )}

          <Separator />

          {/* Background Questions */}
          <section className="space-y-4 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <BookOpen className="size-4 text-indigo-500" /> Background
              Questions
            </h3>
            <p className="text-muted-foreground text-sm">
              Questions to help players flesh out their character's backstory.
            </p>

            <div className="space-y-2">
              {backgroundQuestions.map((question, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="bg-background/50 flex-1 rounded border border-indigo-500/20 p-2 text-sm">
                    {question}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeListItem(index, setBackgroundQuestions)
                    }
                    className="text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                placeholder="e.g., What drove you to become a guardian?"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addListItem(newQuestion, setBackgroundQuestions, () =>
                      setNewQuestion('')
                    );
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  addListItem(newQuestion, setBackgroundQuestions, () =>
                    setNewQuestion('')
                  )
                }
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </section>

          <Separator />

          {/* Connections */}
          <section className="space-y-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Users className="size-4 text-cyan-500" /> Connection Options
            </h3>
            <p className="text-muted-foreground text-sm">
              Suggested connections between party members.
            </p>

            <div className="space-y-2">
              {connections.map((connection, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="bg-background/50 flex-1 rounded border border-cyan-500/20 p-2 text-sm">
                    {connection}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeListItem(index, setConnections)}
                    className="text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newConnection}
                onChange={e => setNewConnection(e.target.value)}
                placeholder="e.g., This PC saved my life once"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addListItem(newConnection, setConnections, () =>
                      setNewConnection('')
                    );
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  addListItem(newConnection, setConnections, () =>
                    setNewConnection('')
                  )
                }
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </section>

          <Separator />

          {/* Starting Equipment */}
          <section className="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <Sword className="size-4 text-emerald-500" /> Starting
                  Equipment
                </h3>
                <p className="text-muted-foreground text-sm">
                  Equipment that new characters of this class start with.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setStartingEquipment(prev => [
                    ...prev,
                    { id: `equip-${Date.now()}`, name: '', description: '' },
                  ])
                }
              >
                <Plus className="mr-1 size-4" /> Add Item
              </Button>
            </div>

            {startingEquipment.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">
                No starting equipment defined. Click "Add Item" to begin.
              </p>
            ) : (
              <div className="space-y-3">
                {startingEquipment.map(item => (
                  <div
                    key={item.id}
                    className="space-y-2 rounded border border-emerald-500/20 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Input
                        value={item.name}
                        onChange={e =>
                          setStartingEquipment(prev =>
                            prev.map(i =>
                              i.id === item.id
                                ? { ...i, name: e.target.value }
                                : i
                            )
                          )
                        }
                        placeholder="Item name (e.g., Longsword)"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setStartingEquipment(prev =>
                            prev.filter(i => i.id !== item.id)
                          );
                          setTimeout(() => notifyChange(), 0);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={item.description}
                      onChange={e => {
                        setStartingEquipment(prev =>
                          prev.map(i =>
                            i.id === item.id
                              ? { ...i, description: e.target.value }
                              : i
                          )
                        );
                        setTimeout(() => notifyChange(), 0);
                      }}
                      placeholder="Optional description..."
                      className="min-h-16"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </ScrollArea>

      {showActions && (
        <>
          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.name.trim() ||
                selectedDomains.length !== 2
              }
            >
              {isSubmitting ? 'Saving...' : 'Save Class'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
