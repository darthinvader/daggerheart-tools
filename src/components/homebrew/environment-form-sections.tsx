/**
 * Environment Form Section Components
 *
 * Extracted section components for EnvironmentForm to reduce complexity.
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

import { Button } from '@/components/ui/button';
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
import { TIERS } from '@/lib/constants';
import type { HomebrewEnvironment } from '@/lib/schemas/homebrew';

// Type color mapping for visual distinction
export const TYPE_COLORS: Record<
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

export const TYPES = ['Exploration', 'Event', 'Social', 'Traversal'] as const;
export { TIERS };

export interface FeatureState {
  id: string;
  name: string;
  type: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Basic Info Section
// ─────────────────────────────────────────────────────────────────────────────

interface BasicInfoSectionProps {
  formData: HomebrewEnvironment['content'];
  typeStyle: { bg: string; border: string; text: string };
  onFormDataChange: (
    updater: (
      prev: HomebrewEnvironment['content']
    ) => HomebrewEnvironment['content']
  ) => void;
}

export function EnvironmentBasicInfoSection({
  formData,
  typeStyle,
  onFormDataChange,
}: BasicInfoSectionProps) {
  return (
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
              onFormDataChange(prev => ({ ...prev, name: e.target.value }))
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
                onFormDataChange(prev => ({
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
                onFormDataChange(prev => ({
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
            onFormDataChange(prev => ({
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
            typeof formData.difficulty === 'number' ? formData.difficulty : ''
          }
          onChange={e =>
            onFormDataChange(prev => ({
              ...prev,
              difficulty: e.target.value ? parseInt(e.target.value, 10) : 12,
            }))
          }
          placeholder="12"
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Impulses Section
// ─────────────────────────────────────────────────────────────────────────────

interface ImpulsesSectionProps {
  impulses: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
}

export function EnvironmentImpulsesSection({
  impulses,
  onAdd,
  onRemove,
  onUpdate,
}: ImpulsesSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="size-4 text-amber-500" /> Impulses
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1 size-4" /> Add Impulse
        </Button>
      </div>

      <p className="text-muted-foreground text-sm">
        What does this environment want to do? How does it threaten or challenge
        the players?
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
                onChange={e => onUpdate(i, e.target.value)}
                placeholder="e.g., To trap and confuse intruders"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(i)}
                className="text-destructive"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Features Section
// ─────────────────────────────────────────────────────────────────────────────

interface FeaturesSectionProps {
  features: FeatureState[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FeatureState>) => void;
}

export function EnvironmentFeaturesSection({
  features,
  onAdd,
  onRemove,
  onUpdate,
}: FeaturesSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <Sparkles className="size-4 text-purple-500" /> Features
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
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
                      onUpdate(feature.id, { name: e.target.value })
                    }
                    placeholder="Feature name"
                  />
                  <Textarea
                    value={feature.description}
                    onChange={e =>
                      onUpdate(feature.id, { description: e.target.value })
                    }
                    placeholder="Feature description..."
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(feature.id)}
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Adversaries Section
// ─────────────────────────────────────────────────────────────────────────────

interface AdversariesSectionProps {
  adversaries: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
}

export function EnvironmentAdversariesSection({
  adversaries,
  onAdd,
  onRemove,
  onUpdate,
}: AdversariesSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <Skull className="size-4 text-red-500" /> Potential Adversaries
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
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
                onChange={e => onUpdate(i, e.target.value)}
                placeholder="Adversary name"
                className="w-40"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(i)}
                className="text-destructive"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
