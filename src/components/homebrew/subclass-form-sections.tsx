/**
 * Subclass Form Section Components
 *
 * Extracted section components for SubclassForm to reduce complexity.
 */
import { Dog, Plus, Shield, Trash2, Wand2 } from 'lucide-react';

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
import { ClassNameEnum } from '@/lib/schemas/core';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const SPELLCAST_TRAITS = [
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
] as const;

const COMPANION_DAMAGE_DICE = ['d6', 'd8', 'd10', 'd12'] as const;
const COMPANION_RANGES = ['Melee', 'Close', 'Far'] as const;
const COMPANION_TYPE_SUGGESTIONS = [
  'Wolf',
  'Bear',
  'Hawk',
  'Cat',
  'Horse',
  'Serpent',
  'Boar',
  'Stag',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface HomebrewClass {
  id: string;
  content: { name: string };
}

interface CompanionData {
  name?: string;
  type?: string;
  evasion?: number;
  damageDie?: 'd6' | 'd8' | 'd10' | 'd12';
  range?: 'Melee' | 'Close' | 'Far';
  standardAttack?: string;
  stressSlots?: number;
  experiences?: Array<{ name: string; bonus?: number }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Basic Info Section
// ─────────────────────────────────────────────────────────────────────────────

interface SubclassBasicInfoSectionProps {
  name: string;
  parentClassName: string | undefined;
  description: string;
  spellcastTrait: string | undefined;
  homebrewClasses: HomebrewClass[];
  onNameChange: (value: string) => void;
  onParentClassChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSpellcastTraitChange: (value: string | undefined) => void;
}

export function SubclassBasicInfoSection({
  name,
  parentClassName,
  description,
  spellcastTrait,
  homebrewClasses,
  onNameChange,
  onParentClassChange,
  onDescriptionChange,
  onSpellcastTraitChange,
}: SubclassBasicInfoSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="font-semibold">Subclass Information</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Subclass Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={e => onNameChange(e.target.value)}
            placeholder="e.g., Way of the Storm"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Shield className="size-4 text-blue-500" />
            Parent Class *
          </Label>
          <Select
            value={parentClassName ?? ''}
            onValueChange={onParentClassChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
                Official Classes
              </div>
              {ClassNameEnum.options.map(cls => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
              {homebrewClasses.length > 0 && (
                <>
                  <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
                    Your Homebrew Classes
                  </div>
                  {homebrewClasses.map(cls => (
                    <SelectItem key={cls.id} value={cls.content.name}>
                      {cls.content.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description ?? ''}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder="Describe the subclass fantasy and how it differs from other subclasses..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="spellcastTrait" className="flex items-center gap-2">
          <Wand2 className="size-4 text-purple-500" />
          Spellcast Trait
        </Label>
        <Select
          value={spellcastTrait ?? ''}
          onValueChange={v =>
            onSpellcastTraitChange(v === '__none__' ? undefined : v)
          }
        >
          <SelectTrigger id="spellcastTrait">
            <SelectValue placeholder="Select trait (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">None</SelectItem>
            {SPELLCAST_TRAITS.map(trait => (
              <SelectItem key={trait} value={trait}>
                {trait}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          The trait used for spellcasting, if applicable.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Companion Section
// ─────────────────────────────────────────────────────────────────────────────

interface SubclassCompanionSectionProps {
  hasCompanion: boolean;
  companion: CompanionData;
  newExperience: string;
  onHasCompanionChange: (value: boolean) => void;
  onCompanionFieldChange: (field: string, value: unknown) => void;
  onNewExperienceChange: (value: string) => void;
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
  onExperienceKeyDown: (e: React.KeyboardEvent) => void;
}

export function SubclassCompanionSection({
  hasCompanion,
  companion,
  newExperience,
  onHasCompanionChange,
  onCompanionFieldChange,
  onNewExperienceChange,
  onAddExperience,
  onRemoveExperience,
  onExperienceKeyDown,
}: SubclassCompanionSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <Dog className="size-4 text-green-500" /> Companion
          </h3>
          <p className="text-muted-foreground text-sm">
            For Ranger-style subclasses that include an animal companion.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="hasCompanion" className="text-sm">
            Include Companion
          </Label>
          <Switch
            id="hasCompanion"
            checked={hasCompanion}
            onCheckedChange={onHasCompanionChange}
          />
        </div>
      </div>

      {hasCompanion && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Companion Name *</Label>
              <Input
                value={companion.name ?? ''}
                onChange={e => onCompanionFieldChange('name', e.target.value)}
                placeholder="e.g., Shadow"
              />
            </div>

            <div className="space-y-2">
              <Label>Companion Type *</Label>
              <Select
                value={companion.type ?? 'Wolf'}
                onValueChange={v => onCompanionFieldChange('type', v)}
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
                min={0}
                value={companion.evasion ?? 10}
                onChange={e =>
                  onCompanionFieldChange(
                    'evasion',
                    parseInt(e.target.value, 10) || 10
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Damage Die</Label>
              <Select
                value={companion.damageDie ?? 'd6'}
                onValueChange={v => onCompanionFieldChange('damageDie', v)}
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
                onValueChange={v => onCompanionFieldChange('range', v)}
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
                value={companion.standardAttack ?? ''}
                onChange={e =>
                  onCompanionFieldChange('standardAttack', e.target.value)
                }
                placeholder="e.g., Bite, Claw"
              />
            </div>

            <div className="space-y-2">
              <Label>Stress Slots</Label>
              <Input
                type="number"
                min={2}
                max={6}
                value={companion.stressSlots ?? 2}
                onChange={e =>
                  onCompanionFieldChange(
                    'stressSlots',
                    Math.max(2, parseInt(e.target.value, 10)) || 2
                  )
                }
              />
            </div>
          </div>

          {/* Companion Experiences */}
          <div className="space-y-2">
            <Label>Experiences (+2 each)</Label>
            <div className="flex flex-wrap gap-2">
              {(companion.experiences ?? []).map((exp, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 border-green-500/50 bg-green-500/20"
                >
                  {exp.name} (+{exp.bonus ?? 2})
                  <button
                    type="button"
                    onClick={() => onRemoveExperience(index)}
                    className="hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newExperience}
                onChange={e => onNewExperienceChange(e.target.value)}
                placeholder="e.g., Tracking, Hunting"
                onKeyDown={onExperienceKeyDown}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onAddExperience}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
