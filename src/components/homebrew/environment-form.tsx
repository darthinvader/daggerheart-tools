/**
 * Homebrew Environment Form
 *
 * Form for creating and editing homebrew environments.
 */
import {
  AlertTriangle,
  Map,
  Plus,
  Skull,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
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
import type { HomebrewEnvironment } from '@/lib/schemas/homebrew';
import { createDefaultEnvironmentContent } from '@/lib/schemas/homebrew';

// Type color mapping for visual distinction
const TYPE_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  Exploration: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-500',
  },
  Event: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-500',
  },
  Social: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-500',
  },
  Traversal: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-500',
  },
};

const TYPES = ['Exploration', 'Event', 'Social', 'Traversal'] as const;
const TIERS = ['1', '2', '3', '4'] as const;

interface EnvironmentFormProps {
  initialData?: HomebrewEnvironment['content'];
  onSubmit: (data: HomebrewEnvironment['content']) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface FeatureState {
  id: string;
  name: string;
  type: string;
  description: string;
}

export function EnvironmentForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EnvironmentFormProps) {
  const [formData, setFormData] = useState(
    initialData ?? createDefaultEnvironmentContent()
  );
  const [features, setFeatures] = useState<FeatureState[]>(
    (initialData?.features ?? []).map((f, i) => ({
      id: `feature-${i}`,
      name: typeof f === 'string' ? f : f.name,
      type: typeof f === 'string' ? 'Feature' : (f.type ?? 'Feature'),
      description: typeof f === 'string' ? '' : f.description,
    }))
  );
  const [impulses, setImpulses] = useState<string[]>(
    initialData?.impulses ?? []
  );
  const [adversaries, setAdversaries] = useState<string[]>(
    initialData?.potentialAdversaries ?? []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const content: HomebrewEnvironment['content'] = {
        ...formData,
        features: features.map(f => ({
          name: f.name,
          type: f.type,
          description: f.description,
        })),
        impulses: impulses.filter(i => i.trim()),
        potentialAdversaries: adversaries.filter(a => a.trim()),
      };

      onSubmit(content);
    },
    [formData, features, impulses, adversaries, onSubmit]
  );

  const addFeature = () => {
    setFeatures(prev => [
      ...prev,
      {
        id: `feature-${Date.now()}`,
        name: '',
        type: 'Feature',
        description: '',
      },
    ]);
  };

  const removeFeature = (id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
  };

  const updateFeature = (id: string, updates: Partial<FeatureState>) => {
    setFeatures(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const addImpulse = () => setImpulses(prev => [...prev, '']);
  const removeImpulse = (index: number) =>
    setImpulses(prev => prev.filter((_, i) => i !== index));
  const updateImpulse = (index: number, value: string) =>
    setImpulses(prev => prev.map((imp, i) => (i === index ? value : imp)));

  const addAdversary = () => setAdversaries(prev => [...prev, '']);
  const removeAdversary = (index: number) =>
    setAdversaries(prev => prev.filter((_, i) => i !== index));
  const updateAdversary = (index: number, value: string) =>
    setAdversaries(prev => prev.map((adv, i) => (i === index ? value : adv)));

  // Get style based on current type
  const typeStyle = TYPE_COLORS[formData.type] ?? TYPE_COLORS.Exploration;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Basic Info */}
          <section
            className={`space-y-4 rounded-lg border p-4 ${typeStyle.border} ${typeStyle.bg}`}
          >
            <h3 className="flex items-center gap-2 font-semibold">
              <Map className={`size-4 ${typeStyle.text}`} /> Basic Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Environment name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Tier *</Label>
                  <Select
                    value={String(formData.tier)}
                    onValueChange={v =>
                      setFormData(prev => ({
                        ...prev,
                        tier: v as typeof formData.tier,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIERS.map(tier => (
                        <SelectItem key={tier} value={tier}>
                          Tier {tier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select
                    value={String(formData.type)}
                    onValueChange={v =>
                      setFormData(prev => ({
                        ...prev,
                        type: v as typeof formData.type,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the environment..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Input
                id="difficulty"
                type="number"
                min={1}
                value={
                  typeof formData.difficulty === 'number'
                    ? formData.difficulty
                    : ''
                }
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    difficulty: e.target.value
                      ? parseInt(e.target.value, 10)
                      : 12,
                  }))
                }
                placeholder="12"
              />
            </div>
          </section>

          <Separator />

          {/* Impulses */}
          <section className="space-y-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="size-4 text-amber-500" /> Impulses
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImpulse}
              >
                <Plus className="mr-1 size-4" /> Add Impulse
              </Button>
            </div>

            <p className="text-muted-foreground text-sm">
              What does this environment want to do? How does it threaten or
              challenge the players?
            </p>

            {impulses.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">
                No impulses added yet.
              </p>
            ) : (
              <div className="space-y-2">
                {impulses.map((impulse, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={impulse}
                      onChange={e => updateImpulse(i, e.target.value)}
                      placeholder="e.g., To trap and confuse intruders"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeImpulse(i)}
                      className="text-destructive"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <Separator />

          {/* Features */}
          <section className="space-y-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold">
                <Sparkles className="size-4 text-purple-500" /> Features
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

            {features.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">
                No features added yet.
              </p>
            ) : (
              <div className="space-y-3">
                {features.map(feature => (
                  <div
                    key={feature.id}
                    className="bg-background/50 space-y-2 rounded-lg border border-purple-500/20 p-3"
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

          {/* Potential Adversaries */}
          <section className="space-y-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold">
                <Skull className="size-4 text-red-500" /> Potential Adversaries
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAdversary}
              >
                <Plus className="mr-1 size-4" /> Add Adversary
              </Button>
            </div>

            {adversaries.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">
                No adversaries added yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {adversaries.map((adv, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <Input
                      value={adv}
                      onChange={e => updateAdversary(i, e.target.value)}
                      placeholder="Adversary name"
                      className="w-40"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAdversary(i)}
                      className="text-destructive"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </ScrollArea>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Environment'}
        </Button>
      </div>
    </form>
  );
}
