/**
 * Community Form Section Components
 *
 * Extracted section components for the community form to reduce complexity.
 */
import { Home, Plus, Sparkles, Trash2, Users } from 'lucide-react';

import { FeatureModifiersSection } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { FeatureStatModifiers } from '@/lib/schemas/core';

// =====================================================================================
// Constants
// =====================================================================================

export const COMMON_TRAIT_SUGGESTIONS = [
  'amiable',
  'ambitious',
  'benevolent',
  'bold',
  'calculating',
  'candid',
  'clever',
  'composed',
  'conniving',
  'cooperative',
  'direct',
  'eloquent',
  'elusive',
  'enterprising',
  'exuberant',
  'fierce',
  'formidable',
  'hardy',
  'indomitable',
  'innovative',
  'inquisitive',
  'inscrutable',
  'loyal',
  'magnanimous',
  'mirthful',
  'nurturing',
  'ostentatious',
  'patient',
  'pensive',
  'perceptive',
  'prudent',
  'reclusive',
  'reliable',
  'reserved',
  'resolute',
  'resourceful',
  'rhapsodic',
  'sagacious',
  'sardonic',
  'savvy',
  'shrewd',
  'stoic',
  'stubborn',
  'tenacious',
  'unflappable',
  'unorthodox',
  'unpretentious',
  'vibrant',
  'weathered',
  'witty',
] as const;

// =====================================================================================
// CommunityInfoSection
// =====================================================================================

interface CommunityInfoSectionProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

export function CommunityInfoSection({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: CommunityInfoSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Home className="size-4" /> Community Information
      </h3>

      <div className="space-y-2">
        <Label htmlFor="name">Community Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          placeholder="e.g., Stormwatchers"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description ?? ''}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder="Describe this community's culture, values, and way of life..."
          rows={4}
          required
        />
      </div>
    </section>
  );
}

// =====================================================================================
// CommonTraitsSection
// =====================================================================================

interface CommonTraitsSectionProps {
  commonTraits: string[];
  newTrait: string;
  setNewTrait: (value: string) => void;
  addTrait: (trait: string) => void;
  addCustomTrait: () => void;
  removeTrait: (trait: string) => void;
}

export function CommonTraitsSection({
  commonTraits,
  newTrait,
  setNewTrait,
  addTrait,
  addCustomTrait,
  removeTrait,
}: CommonTraitsSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-teal-500/30 bg-teal-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Users className="size-4 text-teal-500" />
        Common Traits
      </h3>
      <p className="text-muted-foreground text-sm">
        Characteristics commonly found among members of this community.
      </p>

      <div className="flex flex-wrap gap-2">
        {commonTraits.map(trait => (
          <Badge key={trait} variant="secondary" className="gap-1 capitalize">
            {trait}
            <button
              type="button"
              onClick={() => removeTrait(trait)}
              className="hover:text-destructive"
            >
              <Trash2 className="size-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs">Quick Add</Label>
        <div className="flex flex-wrap gap-1">
          {COMMON_TRAIT_SUGGESTIONS.filter(t => !commonTraits.includes(t))
            .slice(0, 12)
            .map(trait => (
              <Button
                key={trait}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs capitalize"
                onClick={() => addTrait(trait)}
              >
                <Plus className="mr-1 size-3" /> {trait}
              </Button>
            ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          value={newTrait}
          onChange={e => setNewTrait(e.target.value)}
          placeholder="Custom trait (e.g., Resourceful)"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomTrait();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addCustomTrait}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </section>
  );
}

// =====================================================================================
// CommunityFeatureSection
// =====================================================================================

interface CommunityFeatureSectionProps {
  featureName: string;
  featureDescription: string;
  featureModifiers?: FeatureStatModifiers;
  onFeatureNameChange: (name: string) => void;
  onFeatureDescriptionChange: (description: string) => void;
  onModifiersChange: (modifiers?: FeatureStatModifiers) => void;
}

export function CommunityFeatureSection({
  featureName,
  featureDescription,
  featureModifiers,
  onFeatureNameChange,
  onFeatureDescriptionChange,
  onModifiersChange,
}: CommunityFeatureSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Sparkles className="size-4 text-purple-500" />
        Community Feature
      </h3>
      <p className="text-muted-foreground text-sm">
        The special ability granted to characters from this community.
      </p>

      <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
        <div className="space-y-2">
          <Label htmlFor="featureName">Feature Name *</Label>
          <Input
            id="featureName"
            value={featureName}
            onChange={e => onFeatureNameChange(e.target.value)}
            placeholder="e.g., Storm Reader"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="featureDesc">Description *</Label>
          <Textarea
            id="featureDesc"
            value={featureDescription}
            onChange={e => onFeatureDescriptionChange(e.target.value)}
            placeholder="Describe what this feature does..."
            rows={4}
            required
          />
        </div>

        <FeatureModifiersSection
          modifiers={featureModifiers}
          onChange={onModifiersChange}
          title="Feature Modifiers"
          colorClass="text-purple-500"
          showTraits
        />
      </div>
    </section>
  );
}
