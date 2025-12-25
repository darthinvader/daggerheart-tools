/* eslint-disable max-lines, max-lines-per-function */
import { useCallback, useState } from 'react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ALL_DOMAIN_NAMES } from '@/lib/data/domains';
import type {
  HomebrewClass,
  HomebrewSubclass,
} from '@/lib/schemas/class-selection';
import type { ClassFeature, SubclassFeature } from '@/lib/schemas/core';
import { DOMAIN_EMOJIS } from '@/lib/schemas/loadout';

const EMPTY_CLASS_FEATURE: ClassFeature = {
  name: '',
  description: '',
  metadata: { source: 'homebrew' },
};

const FEATURE_TYPES = ['foundation', 'specialization', 'mastery'] as const;
const FEATURE_TYPE_EMOJIS: Record<string, string> = {
  foundation: '🏛️',
  specialization: '⚡',
  mastery: '👑',
};
const FEATURE_TYPE_COLORS: Record<string, string> = {
  foundation: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  specialization: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  mastery: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
};

const EMPTY_FEATURE: SubclassFeature = {
  name: '',
  description: '',
  type: 'foundation',
  level: 1,
  metadata: { source: 'homebrew' },
};

interface HomebrewClassFormProps {
  homebrewClass: HomebrewClass | null;
  onChange: (homebrewClass: HomebrewClass) => void;
}

const EMPTY_SUBCLASS: HomebrewSubclass = {
  isHomebrew: true,
  name: '',
  description: '',
  features: [],
};

const EMPTY_CLASS: HomebrewClass = {
  isHomebrew: true,
  name: '',
  description: '',
  domains: ['Arcana', 'Blade'],
  startingEvasion: 10,
  startingHitPoints: 6,
  classItems: [],
  hopeFeature: { name: '', description: '', hopeCost: 3 },
  classFeatures: [],
  backgroundQuestions: [],
  connections: [],
  subclasses: [{ ...EMPTY_SUBCLASS }],
};

export function HomebrewClassForm({
  homebrewClass,
  onChange,
}: HomebrewClassFormProps) {
  const [draft, setDraft] = useState<HomebrewClass>(
    homebrewClass ?? { ...EMPTY_CLASS }
  );

  const updateDraft = useCallback(
    (updates: Partial<HomebrewClass>) => {
      const updated = { ...draft, ...updates };
      setDraft(updated);
      onChange(updated);
    },
    [draft, onChange]
  );

  const handleDomainChange = useCallback(
    (index: 0 | 1, domain: string) => {
      const newDomains = [...draft.domains] as [string, string];
      newDomains[index] = domain;
      updateDraft({ domains: newDomains });
    },
    [draft.domains, updateDraft]
  );

  const updateSubclass = useCallback(
    (index: number, updates: Partial<HomebrewSubclass>) => {
      const newSubclasses = [...draft.subclasses];
      newSubclasses[index] = { ...newSubclasses[index], ...updates };
      updateDraft({ subclasses: newSubclasses });
    },
    [draft.subclasses, updateDraft]
  );

  const addSubclass = useCallback(() => {
    updateDraft({
      subclasses: [...draft.subclasses, { ...EMPTY_SUBCLASS }],
    });
  }, [draft.subclasses, updateDraft]);

  const removeSubclass = useCallback(
    (index: number) => {
      if (draft.subclasses.length <= 1) return;
      const newSubclasses = draft.subclasses.filter((_, i) => i !== index);
      updateDraft({ subclasses: newSubclasses });
    },
    [draft.subclasses, updateDraft]
  );

  const addFeature = useCallback(
    (subclassIndex: number) => {
      const subclass = draft.subclasses[subclassIndex];
      const newFeatures = [...subclass.features, { ...EMPTY_FEATURE }];
      updateSubclass(subclassIndex, { features: newFeatures });
    },
    [draft.subclasses, updateSubclass]
  );

  const updateFeature = useCallback(
    (
      subclassIndex: number,
      featureIndex: number,
      updates: Partial<SubclassFeature>
    ) => {
      const subclass = draft.subclasses[subclassIndex];
      const newFeatures = [...subclass.features];
      newFeatures[featureIndex] = { ...newFeatures[featureIndex], ...updates };
      updateSubclass(subclassIndex, { features: newFeatures });
    },
    [draft.subclasses, updateSubclass]
  );

  const removeFeature = useCallback(
    (subclassIndex: number, featureIndex: number) => {
      const subclass = draft.subclasses[subclassIndex];
      const newFeatures = subclass.features.filter(
        (_, i) => i !== featureIndex
      );
      updateSubclass(subclassIndex, { features: newFeatures });
    },
    [draft.subclasses, updateSubclass]
  );

  const addClassFeature = useCallback(() => {
    updateDraft({
      classFeatures: [
        ...(draft.classFeatures ?? []),
        { ...EMPTY_CLASS_FEATURE },
      ],
    });
  }, [draft.classFeatures, updateDraft]);

  const updateClassFeature = useCallback(
    (index: number, updates: Partial<ClassFeature>) => {
      const newFeatures = [...(draft.classFeatures ?? [])];
      newFeatures[index] = { ...newFeatures[index], ...updates };
      updateDraft({ classFeatures: newFeatures });
    },
    [draft.classFeatures, updateDraft]
  );

  const removeClassFeature = useCallback(
    (index: number) => {
      const newFeatures = (draft.classFeatures ?? []).filter(
        (_, i) => i !== index
      );
      updateDraft({ classFeatures: newFeatures });
    },
    [draft.classFeatures, updateDraft]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎨</span>
            <span>Create Homebrew Class</span>
          </CardTitle>
          <CardDescription>
            Design your own custom class with unique abilities and features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="class-name">Class Name</Label>
              <Input
                id="class-name"
                placeholder="Enter class name..."
                value={draft.name}
                onChange={e => updateDraft({ name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="hp">Starting HP</Label>
                <Input
                  id="hp"
                  type="number"
                  min={1}
                  max={20}
                  value={draft.startingHitPoints}
                  onChange={e =>
                    updateDraft({ startingHitPoints: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evasion">Starting Evasion</Label>
                <Input
                  id="evasion"
                  type="number"
                  min={8}
                  max={20}
                  value={draft.startingEvasion}
                  onChange={e =>
                    updateDraft({ startingEvasion: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class-description">Description</Label>
            <Textarea
              id="class-description"
              placeholder="Describe your class..."
              value={draft.description}
              onChange={e => updateDraft({ description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Primary Domain</Label>
              <Select
                value={draft.domains[0]}
                onValueChange={v => handleDomainChange(0, v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_DOMAIN_NAMES.map(domain => (
                    <SelectItem key={domain} value={domain}>
                      {DOMAIN_EMOJIS[domain]} {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Secondary Domain</Label>
              <Select
                value={draft.domains[1]}
                onValueChange={v => handleDomainChange(1, v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_DOMAIN_NAMES.map(domain => (
                    <SelectItem key={domain} value={domain}>
                      {DOMAIN_EMOJIS[domain]} {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">✨ Hope Feature</h4>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hope-name">Feature Name</Label>
                <Input
                  id="hope-name"
                  placeholder="e.g., Inspiring Presence"
                  value={draft.hopeFeature.name}
                  onChange={e =>
                    updateDraft({
                      hopeFeature: {
                        ...draft.hopeFeature,
                        name: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hope-cost">Hope Cost</Label>
                <Input
                  id="hope-cost"
                  type="number"
                  min={1}
                  max={6}
                  value={draft.hopeFeature.hopeCost}
                  onChange={e =>
                    updateDraft({
                      hopeFeature: {
                        ...draft.hopeFeature,
                        hopeCost: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hope-desc">Description</Label>
              <Textarea
                id="hope-desc"
                placeholder="Describe the hope feature effect..."
                value={draft.hopeFeature.description}
                onChange={e =>
                  updateDraft({
                    hopeFeature: {
                      ...draft.hopeFeature,
                      description: e.target.value,
                    },
                  })
                }
                rows={2}
              />
            </div>
          </div>

          {/* Class Features */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>⭐</span>
                <h4 className="font-medium">Class Features</h4>
                <Badge variant="secondary" className="text-xs">
                  {draft.classFeatures?.length ?? 0}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={addClassFeature}>
                ➕ Add Feature
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Class features are always-active abilities unique to this class.
            </p>

            {(draft.classFeatures?.length ?? 0) === 0 ? (
              <p className="text-muted-foreground text-sm italic">
                No class features yet. These are always-on abilities for this
                class.
              </p>
            ) : (
              <div className="space-y-3">
                {(draft.classFeatures ?? []).map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-muted/30 space-y-3 rounded border p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className="border-green-500/30 bg-green-500/10 text-green-700"
                      >
                        ⭐ Class Feature
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeClassFeature(idx)}
                        className="text-destructive hover:text-destructive h-7 w-7 p-0"
                      >
                        ✕
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Name</Label>
                      <Input
                        placeholder="Feature name..."
                        value={feature.name}
                        onChange={e =>
                          updateClassFeature(idx, { name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        placeholder="Describe what this feature does..."
                        value={feature.description}
                        onChange={e =>
                          updateClassFeature(idx, {
                            description: e.target.value,
                          })
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span>🎭</span>
              <span>Subclasses</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addSubclass}>
              ➕ Add Subclass
            </Button>
          </div>
          <CardDescription>
            Create at least one subclass for your homebrew class.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {draft.subclasses.map((subclass, index) => (
            <div
              key={index}
              className="bg-muted/30 space-y-4 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <h5 className="font-medium">Subclass {index + 1}</h5>
                {draft.subclasses.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubclass(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    🗑️ Remove
                  </Button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Subclass Name</Label>
                  <Input
                    placeholder="Enter subclass name..."
                    value={subclass.name}
                    onChange={e =>
                      updateSubclass(index, { name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Spellcast Trait (optional)</Label>
                  <Select
                    value={subclass.spellcastTrait ?? 'none'}
                    onValueChange={v =>
                      updateSubclass(index, {
                        spellcastTrait: v === 'none' ? undefined : v,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trait" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="Agility">Agility</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Finesse">Finesse</SelectItem>
                      <SelectItem value="Instinct">Instinct</SelectItem>
                      <SelectItem value="Presence">Presence</SelectItem>
                      <SelectItem value="Knowledge">Knowledge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe this subclass..."
                  value={subclass.description}
                  onChange={e =>
                    updateSubclass(index, { description: e.target.value })
                  }
                  rows={2}
                />
              </div>

              {/* Subclass Features */}
              <div className="space-y-3 border-t border-dashed pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>⭐</span>
                    <Label className="text-sm font-medium">
                      Subclass Features
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      {subclass.features.length}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addFeature(index)}
                  >
                    ➕ Add Feature
                  </Button>
                </div>

                {subclass.features.length === 0 ? (
                  <p className="text-muted-foreground text-sm italic">
                    No features yet. Add foundation, specialization, or mastery
                    features.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {subclass.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="bg-background space-y-3 rounded border p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            variant="outline"
                            className={
                              FEATURE_TYPE_COLORS[feature.type] ||
                              FEATURE_TYPE_COLORS.foundation
                            }
                          >
                            {FEATURE_TYPE_EMOJIS[feature.type] || '⭐'}{' '}
                            {feature.type}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(index, featureIndex)}
                            className="text-destructive hover:text-destructive h-7 w-7 p-0"
                          >
                            ✕
                          </Button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Name</Label>
                            <Input
                              placeholder="Feature name..."
                              value={feature.name}
                              onChange={e =>
                                updateFeature(index, featureIndex, {
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Type</Label>
                            <Select
                              value={feature.type}
                              onValueChange={v =>
                                updateFeature(index, featureIndex, { type: v })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FEATURE_TYPES.map(type => (
                                  <SelectItem key={type} value={type}>
                                    {FEATURE_TYPE_EMOJIS[type]}{' '}
                                    {type.charAt(0).toUpperCase() +
                                      type.slice(1)}
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
                              placeholder="1-10"
                              value={feature.level ?? ''}
                              onChange={e =>
                                updateFeature(index, featureIndex, {
                                  level: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Description</Label>
                          <Textarea
                            placeholder="Describe what this feature does..."
                            value={feature.description}
                            onChange={e =>
                              updateFeature(index, featureIndex, {
                                description: e.target.value,
                              })
                            }
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
