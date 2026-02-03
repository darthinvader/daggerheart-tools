/**
 * Class Form Section Components
 *
 * Extracted section components for ClassForm to reduce complexity.
 */
import {
  BookOpen,
  Plus,
  Shield,
  Sparkles,
  Theater,
  Trash2,
  User,
} from 'lucide-react';
import type { ReactNode } from 'react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ALL_KNOWN_DOMAINS } from '@/lib/schemas/core';
import { cn } from '@/lib/utils';

import type { ClassFormData } from './class-form';
import type { SubclassState } from './use-class-form-arrays';

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

// ─────────────────────────────────────────────────────────────────────────────
// Basic Info Section
// ─────────────────────────────────────────────────────────────────────────────

interface BasicInfoSectionProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function ClassBasicInfoSection({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <User className="size-4 text-amber-500" /> Class Information
      </h3>

      <div className="space-y-2">
        <Label htmlFor="name">Class Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          placeholder="e.g., Mystic Guardian"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description ?? ''}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder="Describe the class fantasy and playstyle..."
          rows={3}
          required
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Domains Section
// ─────────────────────────────────────────────────────────────────────────────

interface DomainsSectionProps {
  selectedDomains: string[];
  onToggleDomain: (domain: string) => void;
}

export function ClassDomainsSection({
  selectedDomains,
  onToggleDomain,
}: DomainsSectionProps) {
  return (
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
                ? (DOMAIN_COLORS[domain] ?? 'bg-primary/20 border-primary')
                : 'hover:bg-muted'
            )}
            onClick={() => onToggleDomain(domain)}
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Base Statistics Section
// ─────────────────────────────────────────────────────────────────────────────

interface BaseStatsSectionProps {
  startingHitPoints: number;
  startingEvasion: number;
  onHitPointsChange: (value: number) => void;
  onEvasionChange: (value: number) => void;
}

export function ClassBaseStatsSection({
  startingHitPoints,
  startingEvasion,
  onHitPointsChange,
  onEvasionChange,
}: BaseStatsSectionProps) {
  return (
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
            value={startingHitPoints ?? ''}
            onChange={e => onHitPointsChange(parseInt(e.target.value, 10) || 6)}
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
            value={startingEvasion ?? ''}
            onChange={e => onEvasionChange(parseInt(e.target.value, 10) || 10)}
            placeholder="e.g., 10"
            required
          />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hope Feature Section
// ─────────────────────────────────────────────────────────────────────────────

interface HopeFeatureSectionProps {
  hopeFeature: ClassFormData['hopeFeature'];
  onHopeFeatureChange: (updates: Partial<ClassFormData['hopeFeature']>) => void;
}

export function ClassHopeFeatureSection({
  hopeFeature,
  onHopeFeatureChange,
}: HopeFeatureSectionProps) {
  return (
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
            value={hopeFeature?.name ?? ''}
            onChange={e => onHopeFeatureChange({ name: e.target.value })}
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
            value={hopeFeature?.hopeCost ?? 3}
            onChange={e =>
              onHopeFeatureChange({
                hopeCost: parseInt(e.target.value, 10) || 3,
              })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hopeFeatureDesc">Description *</Label>
          <Textarea
            id="hopeFeatureDesc"
            value={hopeFeature?.description ?? ''}
            onChange={e => onHopeFeatureChange({ description: e.target.value })}
            placeholder="Describe what this feature does..."
            rows={3}
            required
          />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Form Actions Section
// ─────────────────────────────────────────────────────────────────────────────

interface FormActionsSectionProps {
  isSubmitting: boolean;
  isValid: boolean;
  onCancel?: () => void;
  children?: ReactNode;
}

export function ClassFormActionsSection({
  isSubmitting,
  isValid,
  onCancel,
  children,
}: FormActionsSectionProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting || !isValid}>
        {isSubmitting ? 'Saving...' : 'Save Class'}
      </Button>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subclasses Section
// ─────────────────────────────────────────────────────────────────────────────

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

export function SubclassesSection({
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
          <SubclassCard
            key={subclass.id}
            subclass={subclass}
            index={index}
            showRemove={subclasses.length > 1}
            onUpdate={updates => onUpdateSubclass(subclass.id, updates)}
            onRemove={() => onRemoveSubclass(subclass.id)}
            onAddFeature={() => onAddFeature(subclass.id)}
            onUpdateFeature={(featureId, updates) =>
              onUpdateFeature(subclass.id, featureId, updates)
            }
            onRemoveFeature={featureId =>
              onRemoveFeature(subclass.id, featureId)
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subclass Card (single subclass)
// ─────────────────────────────────────────────────────────────────────────────

interface SubclassCardProps {
  subclass: SubclassState;
  index: number;
  showRemove: boolean;
  onUpdate: (updates: Partial<SubclassState>) => void;
  onRemove: () => void;
  onAddFeature: () => void;
  onUpdateFeature: (
    featureId: string,
    updates: Partial<SubclassState['features'][number]>
  ) => void;
  onRemoveFeature: (featureId: string) => void;
}

function SubclassCard({
  subclass,
  index,
  showRemove,
  onUpdate,
  onRemove,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
}: SubclassCardProps) {
  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">Subclass {index + 1}</Badge>
        {showRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
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
            onChange={e => onUpdate({ name: e.target.value })}
            placeholder="e.g., Battle Mage"
          />
        </div>
        <div className="space-y-2">
          <Label>Spellcast Trait (optional)</Label>
          <Select
            value={subclass.spellcastTrait ?? '__none__'}
            onValueChange={v =>
              onUpdate({ spellcastTrait: v === '__none__' ? undefined : v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select trait..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
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
          onChange={e => onUpdate({ description: e.target.value })}
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
            onClick={onAddFeature}
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
              <SubclassFeatureCard
                key={feature.id}
                feature={feature}
                onUpdate={updates => onUpdateFeature(feature.id, updates)}
                onRemove={() => onRemoveFeature(feature.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subclass Feature Card
// ─────────────────────────────────────────────────────────────────────────────

interface SubclassFeatureCardProps {
  feature: SubclassState['features'][number];
  onUpdate: (updates: Partial<SubclassState['features'][number]>) => void;
  onRemove: () => void;
}

function SubclassFeatureCard({
  feature,
  onUpdate,
  onRemove,
}: SubclassFeatureCardProps) {
  return (
    <div className="bg-background space-y-3 rounded border p-3">
      <div className="flex items-center justify-between gap-2">
        <Badge
          variant="outline"
          className={
            FEATURE_TYPE_COLORS[feature.type] ?? FEATURE_TYPE_COLORS.foundation
          }
        >
          {feature.type}
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
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
            onChange={e => onUpdate({ name: e.target.value })}
            placeholder="Feature name..."
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Type</Label>
          <Select
            value={feature.type}
            onValueChange={v => onUpdate({ type: v })}
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
              onUpdate({
                level: e.target.value ? Number(e.target.value) : undefined,
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
          onChange={e => onUpdate({ description: e.target.value })}
          placeholder="Describe what this feature does..."
          rows={2}
        />
      </div>

      <FeatureModifiersSection
        modifiers={feature.modifiers}
        onChange={modifiers => onUpdate({ modifiers })}
        title="Feature Modifiers"
        colorClass="text-purple-500"
        showTraits
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Class Form Actions Section
// ─────────────────────────────────────────────────────────────────────────────

interface ClassFormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  isNameEmpty: boolean;
  hasInvalidDomains: boolean;
}

export function ClassFormActions({
  onCancel,
  isSubmitting,
  isNameEmpty,
  hasInvalidDomains,
}: ClassFormActionsProps) {
  return (
    <>
      <div className="bg-border h-px w-full" />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isNameEmpty || hasInvalidDomains}
        >
          {isSubmitting ? 'Saving...' : 'Save Class'}
        </Button>
      </div>
    </>
  );
}
