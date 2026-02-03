/**
 * Ancestry Form Section Components
 *
 * Extracted section components for AncestryForm to reduce complexity.
 */
import { Dna, Plus, Sparkles, Trash2, Users } from 'lucide-react';

import { FeatureModifiersSection } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { FeatureStatModifiers } from '@/lib/schemas/core';
import { cn } from '@/lib/utils';

// Predefined physical characteristics from official ancestries
export const PHYSICAL_CHARACTERISTIC_SUGGESTIONS = [
  'Pointed ears',
  'Thick protective scales',
  'Luminous eyes',
  'Sharp claws',
  'Natural camouflage',
  'Bioluminescent markings',
  'Thick fur or hair',
  'Horns or antlers',
  'Tail (prehensile or decorative)',
  'Wings (functional or vestigial)',
  'Gills or aquatic features',
  'Elongated limbs',
  'Dense musculature',
  'Crystalline skin',
  'Elemental features',
  'Multiple arms',
  'Extra eyes',
  'Feathers',
  'Natural armor plating',
  'Retractable claws',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Basic Info Section
// ─────────────────────────────────────────────────────────────────────────────

interface BasicInfoSectionProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

export function AncestryBasicInfoSection({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Users className="size-4 text-amber-500" /> Ancestry Information
      </h3>

      <div className="space-y-2">
        <Label htmlFor="name">Ancestry Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          placeholder="e.g., Cloudkin"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder="Describe this ancestry's culture, origins, and typical traits..."
          rows={3}
          required
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Physical Characteristics Section
// ─────────────────────────────────────────────────────────────────────────────

interface PhysicalCharacteristicsSectionProps {
  heightRange: string;
  lifespan: string;
  characteristics: string[];
  newCharacteristic: string;
  onHeightRangeChange: (value: string) => void;
  onLifespanChange: (value: string) => void;
  onAddCharacteristic: (value: string) => void;
  onRemoveCharacteristic: (index: number) => void;
  onNewCharacteristicChange: (value: string) => void;
  onAddCustomCharacteristic: () => void;
}

export function AncestryPhysicalCharacteristicsSection({
  heightRange,
  lifespan,
  characteristics,
  newCharacteristic,
  onHeightRangeChange,
  onLifespanChange,
  onAddCharacteristic,
  onRemoveCharacteristic,
  onNewCharacteristicChange,
  onAddCustomCharacteristic,
}: PhysicalCharacteristicsSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Dna className="size-4 text-cyan-500" /> Physical Characteristics
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="heightRange">Height Range</Label>
          <Input
            id="heightRange"
            value={heightRange}
            onChange={e => onHeightRangeChange(e.target.value)}
            placeholder={'e.g., 5\'0" to 6\'4"'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lifespan">Lifespan</Label>
          <Input
            id="lifespan"
            value={lifespan}
            onChange={e => onLifespanChange(e.target.value)}
            placeholder="e.g., 80-120 years"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Physical Traits</Label>

        {/* Quick-add suggestions */}
        <div className="flex flex-wrap gap-1">
          {PHYSICAL_CHARACTERISTIC_SUGGESTIONS.filter(
            trait => !characteristics.includes(trait)
          )
            .slice(0, 12)
            .map(trait => (
              <Button
                key={trait}
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                  'h-7 text-xs',
                  'border-cyan-500/30 hover:bg-cyan-500/20'
                )}
                onClick={() => onAddCharacteristic(trait)}
              >
                <Plus className="mr-1 size-3" /> {trait}
              </Button>
            ))}
        </div>

        {/* Selected characteristics */}
        <div className="flex flex-wrap gap-2">
          {characteristics.map((char, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="gap-1 border-cyan-500/50 bg-cyan-500/20"
            >
              {char}
              <button
                type="button"
                onClick={() => onRemoveCharacteristic(index)}
                className="hover:text-destructive"
              >
                <Trash2 className="size-3" />
              </button>
            </Badge>
          ))}
        </div>

        {/* Custom input */}
        <div className="flex gap-2">
          <Input
            value={newCharacteristic}
            onChange={e => onNewCharacteristicChange(e.target.value)}
            placeholder="Add custom physical trait..."
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddCustomCharacteristic();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onAddCustomCharacteristic}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature Section (Primary/Secondary)
// ─────────────────────────────────────────────────────────────────────────────

interface FeatureData {
  name: string;
  description: string;
  type: 'primary' | 'secondary';
  modifiers?: FeatureStatModifiers;
}

interface FeatureSectionProps {
  feature: FeatureData;
  onChange: (feature: FeatureData) => void;
  variant: 'primary' | 'secondary';
}

export function AncestryFeatureSection({
  feature,
  onChange,
  variant,
}: FeatureSectionProps) {
  const isPrimary = variant === 'primary';
  const colorClass = isPrimary ? 'purple' : 'indigo';
  const title = isPrimary ? 'Primary Feature' : 'Secondary Feature';
  const subtitle = isPrimary
    ? 'The main ancestry feature that defines this heritage.'
    : 'An additional feature that complements the primary one.';
  const namePlaceholder = isPrimary
    ? 'e.g., Cloud Form'
    : 'e.g., Wind Affinity';

  return (
    <section
      className={`space-y-4 rounded-lg border border-${colorClass}-500/30 bg-${colorClass}-500/10 p-4`}
    >
      <h3 className="flex items-center gap-2 font-semibold">
        <Sparkles className={`size-4 text-${colorClass}-500`} /> {title}
      </h3>
      <p className="text-muted-foreground text-sm">{subtitle}</p>

      <div
        className={`bg-background/50 space-y-3 rounded-lg border border-${colorClass}-500/20 p-4`}
      >
        <div className="space-y-2">
          <Label htmlFor={`${variant}FeatureName`}>Feature Name *</Label>
          <Input
            id={`${variant}FeatureName`}
            value={feature.name}
            onChange={e => onChange({ ...feature, name: e.target.value })}
            placeholder={namePlaceholder}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${variant}FeatureDesc`}>Description *</Label>
          <Textarea
            id={`${variant}FeatureDesc`}
            value={feature.description}
            onChange={e =>
              onChange({ ...feature, description: e.target.value })
            }
            placeholder="Describe what this feature does..."
            rows={3}
            required
          />
        </div>

        <FeatureModifiersSection
          modifiers={feature.modifiers}
          onChange={modifiers => onChange({ ...feature, modifiers })}
          title={`${title} Modifiers`}
          colorClass={`text-${colorClass}-500`}
          showTraits
        />
      </div>
    </section>
  );
}
