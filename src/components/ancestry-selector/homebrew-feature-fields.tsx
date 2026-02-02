import {
  FeatureIcon,
  FeatureModifiersSection,
  SecondaryFeatureIcon,
} from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { FeatureStatModifiers } from '@/lib/schemas/core';
import type { HomebrewAncestry } from '@/lib/schemas/identity';

interface HomebrewFeatureFieldsProps {
  primaryFeature: HomebrewAncestry['primaryFeature'];
  secondaryFeature: HomebrewAncestry['secondaryFeature'];
  onPrimaryNameChange: (value: string) => void;
  onPrimaryDescChange: (value: string) => void;
  onPrimaryModifiersChange: (value: FeatureStatModifiers | undefined) => void;
  onSecondaryNameChange: (value: string) => void;
  onSecondaryDescChange: (value: string) => void;
  onSecondaryModifiersChange: (value: FeatureStatModifiers | undefined) => void;
}

export function HomebrewFeatureFields({
  primaryFeature,
  secondaryFeature,
  onPrimaryNameChange,
  onPrimaryDescChange,
  onPrimaryModifiersChange,
  onSecondaryNameChange,
  onSecondaryDescChange,
  onSecondaryModifiersChange,
}: HomebrewFeatureFieldsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <h3 className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
          <FeatureIcon />
          Primary Feature
        </h3>

        <div className="space-y-2">
          <Label htmlFor="hb-primary-name">Feature Name *</Label>
          <Input
            id="hb-primary-name"
            value={primaryFeature.name}
            onChange={e => onPrimaryNameChange(e.target.value)}
            placeholder="e.g., Thick Skin, Quick Reactions"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hb-primary-desc">Feature Description *</Label>
          <Textarea
            id="hb-primary-desc"
            value={primaryFeature.description}
            onChange={e => onPrimaryDescChange(e.target.value)}
            placeholder="Describe what this feature does mechanically..."
            className="min-h-25"
          />
        </div>

        <FeatureModifiersSection
          modifiers={primaryFeature.modifiers}
          onChange={onPrimaryModifiersChange}
          title="Primary Feature Modifiers"
          colorClass="text-amber-600 dark:text-amber-400"
          showTraits
        />
      </div>

      <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
        <h3 className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-400">
          <SecondaryFeatureIcon />
          Secondary Feature
        </h3>

        <div className="space-y-2">
          <Label htmlFor="hb-secondary-name">Feature Name *</Label>
          <Input
            id="hb-secondary-name"
            value={secondaryFeature.name}
            onChange={e => onSecondaryNameChange(e.target.value)}
            placeholder="e.g., Elemental Breath, Wings"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hb-secondary-desc">Feature Description *</Label>
          <Textarea
            id="hb-secondary-desc"
            value={secondaryFeature.description}
            onChange={e => onSecondaryDescChange(e.target.value)}
            placeholder="Describe what this feature does mechanically..."
            className="min-h-25"
          />
        </div>

        <FeatureModifiersSection
          modifiers={secondaryFeature.modifiers}
          onChange={onSecondaryModifiersChange}
          title="Secondary Feature Modifiers"
          colorClass="text-blue-600 dark:text-blue-400"
          showTraits
        />
      </div>
    </div>
  );
}
