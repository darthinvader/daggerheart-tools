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
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ALL_KNOWN_DOMAINS } from '@/lib/schemas/core';
import type { HomebrewClass } from '@/lib/schemas/homebrew';
import { createDefaultClassContent } from '@/lib/schemas/homebrew';
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

interface ClassFormProps {
  initialData?: HomebrewClass['content'];
  onSubmit: (data: HomebrewClass['content']) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface FeatureState {
  id: string;
  name: string;
  description: string;
}

export function ClassForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ClassFormProps) {
  const [formData, setFormData] = useState(
    initialData ?? createDefaultClassContent()
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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const content: HomebrewClass['content'] = {
        ...formData,
        domains: selectedDomains,
        classItems: classItems.filter(c => c.trim()),
        classFeatures: classFeatures.map(f => ({
          name: f.name,
          description: f.description,
        })),
        backgroundQuestions: backgroundQuestions.filter(q => q.trim()),
        connections: connections.filter(c => c.trim()),
        isHomebrew: true,
      };

      onSubmit(content);
    },
    [
      formData,
      selectedDomains,
      classItems,
      classFeatures,
      backgroundQuestions,
      connections,
      onSubmit,
    ]
  );

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev => {
      if (prev.includes(domain)) {
        return prev.filter(d => d !== domain);
      }
      if (prev.length < 2) {
        return [...prev, domain];
      }
      return [prev[1], domain];
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
        </div>
      </ScrollArea>

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
    </form>
  );
}
