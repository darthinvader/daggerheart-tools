import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dog, Plus, Trash2, X } from '@/lib/icons';
import type { HomebrewSubclass } from '@/lib/schemas/class-selection';
import type { RangerCompanion, SubclassFeature } from '@/lib/schemas/core';

import { SubclassFeatureItem } from './subclass-feature-item';

const COMPANION_DAMAGE_DICE = ['d6', 'd8', 'd10', 'd12'] as const;
const COMPANION_RANGES = ['Melee', 'Close', 'Far'] as const;
const COMPANION_TYPE_SUGGESTIONS = [
  'Wolf',
  'Bear',
  'Hawk',
  'Panther',
  'Boar',
  'Serpent',
  'Fox',
  'Owl',
  'Stag',
  'Badger',
];

interface SubclassFormCardProps {
  subclass: HomebrewSubclass;
  index: number;
  canRemove: boolean;
  onUpdate: (updates: Partial<HomebrewSubclass>) => void;
  onRemove: () => void;
  onAddFeature: () => void;
  onUpdateFeature: (
    featureIndex: number,
    updates: Partial<SubclassFeature>
  ) => void;
  onRemoveFeature: (featureIndex: number) => void;
}

export function SubclassFormCard({
  subclass,
  index,
  canRemove,
  onUpdate,
  onRemove,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
}: SubclassFormCardProps) {
  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h5 className="font-medium">Subclass {index + 1}</h5>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive inline-flex items-center gap-1"
          >
            <Trash2 className="size-4" /> Remove
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Subclass Name</Label>
          <Input
            placeholder="Enter subclass name..."
            value={subclass.name}
            onChange={e => onUpdate({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Spellcast Trait (optional)</Label>
          <Select
            value={subclass.spellcastTrait ?? 'none'}
            onValueChange={v =>
              onUpdate({ spellcastTrait: v === 'none' ? undefined : v })
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
          onChange={e => onUpdate({ description: e.target.value })}
          rows={2}
        />
      </div>

      {/* Subclass Features */}
      <div className="space-y-3 border-t border-dashed pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⭐</span>
            <Label className="text-sm font-medium">Subclass Features</Label>
            <Badge variant="secondary" className="text-xs">
              {subclass.features.length}
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={onAddFeature}>
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
              <SubclassFeatureItem
                key={featureIndex}
                feature={feature}
                featureIndex={featureIndex}
                onUpdate={updates => onUpdateFeature(featureIndex, updates)}
                onRemove={() => onRemoveFeature(featureIndex)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Companion (Ranger-style) */}
      <CompanionSection
        companion={subclass.companion}
        onUpdate={companion => onUpdate({ companion })}
      />
    </div>
  );
}

interface CompanionSectionProps {
  companion: RangerCompanion | undefined;
  onUpdate: (companion: RangerCompanion | undefined) => void;
}

function CompanionSection({ companion, onUpdate }: CompanionSectionProps) {
  const [hasCompanion, setHasCompanion] = useState(!!companion);
  const [experiences, setExperiences] = useState<
    { name: string; bonus: number }[]
  >(companion?.experiences ?? []);
  const [newExperience, setNewExperience] = useState('');

  const handleToggle = (enabled: boolean) => {
    setHasCompanion(enabled);
    if (!enabled) {
      onUpdate(undefined);
    } else {
      onUpdate({
        name: companion?.name ?? '',
        type: companion?.type ?? 'Wolf',
        evasion: companion?.evasion ?? 10,
        experiences: [],
        standardAttack: companion?.standardAttack ?? '',
        damageDie: companion?.damageDie ?? 'd6',
        range: companion?.range ?? 'Melee',
        stressSlots: companion?.stressSlots ?? 2,
      });
    }
  };

  const updateCompanion = (updates: Partial<RangerCompanion>) => {
    if (!companion) return;
    onUpdate({ ...companion, ...updates });
  };

  const addExperience = () => {
    if (!newExperience.trim() || !companion) return;
    const newExp = { name: newExperience.trim(), bonus: 2 };
    const updated = [...experiences, newExp];
    setExperiences(updated);
    updateCompanion({ experiences: updated });
    setNewExperience('');
  };

  const removeExperience = (idx: number) => {
    const updated = experiences.filter((_, i) => i !== idx);
    setExperiences(updated);
    updateCompanion({ experiences: updated });
  };

  return (
    <div className="space-y-3 border-t border-dashed pt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dog className="size-4 text-amber-500" />
          <Label className="text-sm font-medium">
            Companion (Ranger-style)
          </Label>
        </div>
        <Switch checked={hasCompanion} onCheckedChange={handleToggle} />
      </div>

      {hasCompanion && companion && (
        <div className="space-y-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Companion Name</Label>
              <Input
                value={companion.name}
                placeholder="e.g., Fang, Shadow..."
                onChange={e => updateCompanion({ name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Companion Type</Label>
              <Select
                value={companion.type}
                onValueChange={v => updateCompanion({ type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPANION_TYPE_SUGGESTIONS.map(t => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Evasion</Label>
              <Input
                type="number"
                min={5}
                max={20}
                value={companion.evasion}
                onChange={e =>
                  updateCompanion({ evasion: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Damage Die</Label>
              <Select
                value={companion.damageDie}
                onValueChange={v =>
                  updateCompanion({
                    damageDie: v as 'd6' | 'd8' | 'd10' | 'd12',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPANION_DAMAGE_DICE.map(d => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Range</Label>
              <Select
                value={companion.range ?? 'Melee'}
                onValueChange={v =>
                  updateCompanion({ range: v as 'Melee' | 'Close' | 'Far' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPANION_RANGES.map(r => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Standard Attack</Label>
              <Input
                value={companion.standardAttack}
                placeholder="e.g., Bite, Claw..."
                onChange={e =>
                  updateCompanion({ standardAttack: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Stress Slots</Label>
              <Input
                type="number"
                min={1}
                max={6}
                value={companion.stressSlots}
                onChange={e =>
                  updateCompanion({ stressSlots: Number(e.target.value) })
                }
              />
            </div>
          </div>

          {/* Experiences */}
          <div className="space-y-2">
            <Label>Experiences (+2 bonus each)</Label>
            <div className="flex gap-2">
              <Input
                value={newExperience}
                placeholder="Add experience..."
                onChange={e => setNewExperience(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addExperience()}
              />
              <Button type="button" variant="outline" onClick={addExperience}>
                <Plus className="size-4" />
              </Button>
            </div>
            {experiences.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {experiences.map((exp, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {exp.name} (+{exp.bonus})
                    <button
                      type="button"
                      onClick={() => removeExperience(i)}
                      className="hover:bg-destructive/20 ml-1 rounded-full p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
