import { useState } from 'react';

import { MixedIcon } from '@/components/shared';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Sparkles, Star } from '@/lib/icons';
import type { Ancestry, MixedAncestry } from '@/lib/schemas/identity';
import { ANCESTRIES } from '@/lib/schemas/identity';

import { FeaturePicker } from './feature-picker';
import { MixedAncestryPreview } from './mixed-ancestry-preview';

interface MixedAncestrySelectorProps {
  mixedAncestry: MixedAncestry | null;
  onChange: (mixedAncestry: MixedAncestry) => void;
}

function findAncestryByPrimaryFeature(featureName: string): Ancestry | null {
  return ANCESTRIES.find(a => a.primaryFeature.name === featureName) ?? null;
}

function findAncestryBySecondaryFeature(featureName: string): Ancestry | null {
  return ANCESTRIES.find(a => a.secondaryFeature.name === featureName) ?? null;
}

export function MixedAncestrySelector({
  mixedAncestry,
  onChange,
}: MixedAncestrySelectorProps) {
  const [name, setName] = useState(mixedAncestry?.name ?? '');
  const [primaryAncestry, setPrimaryAncestry] = useState<Ancestry | null>(
    mixedAncestry
      ? findAncestryByPrimaryFeature(mixedAncestry.primaryFeature.name)
      : null
  );
  const [secondaryAncestry, setSecondaryAncestry] = useState<Ancestry | null>(
    mixedAncestry
      ? findAncestryBySecondaryFeature(mixedAncestry.secondaryFeature.name)
      : null
  );

  const buildMixedAncestry = (
    newName: string,
    primary: Ancestry | null,
    secondary: Ancestry | null
  ): void => {
    if (!primary || !secondary) return;

    // SRD Rule: "You must choose the first feature from one ancestry and the
    // second from another. You can't take both features from the same ancestry."
    if (primary.name === secondary.name) return;

    const displayName =
      newName.trim() || `${primary.name}-${secondary.name} Mix`;

    onChange({
      name: displayName,
      parentAncestries: [primary.name, secondary.name],
      primaryFeature: primary.primaryFeature,
      secondaryFeature: secondary.secondaryFeature,
    });
  };

  const handleNameChange = (value: string) => {
    setName(value);
    buildMixedAncestry(value, primaryAncestry, secondaryAncestry);
  };

  const handlePrimarySelect = (ancestry: Ancestry) => {
    setPrimaryAncestry(ancestry);
    buildMixedAncestry(name, ancestry, secondaryAncestry);
  };

  const handleSecondarySelect = (ancestry: Ancestry) => {
    setSecondaryAncestry(ancestry);
    buildMixedAncestry(name, primaryAncestry, ancestry);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <MixedIcon />
        Create Mixed Ancestry
      </div>

      <div className="space-y-2">
        <Label htmlFor="mixed-name">Mixed Ancestry Name (Optional)</Label>
        <Input
          id="mixed-name"
          value={name}
          onChange={e => handleNameChange(e.target.value)}
          placeholder="e.g., Horned Toad, Flitterin..."
        />
        <p className="text-muted-foreground text-sm">
          Leave empty for an auto-generated name based on parent ancestries
        </p>
      </div>

      <Separator />

      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 lg:hidden">
            <Star className="size-4 text-amber-600 dark:text-amber-400" />
            <span className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Primary Feature Selection
            </span>
          </div>
          <FeaturePicker
            label="Select Primary Feature From"
            selectedAncestry={primaryAncestry?.name ?? null}
            selectedFeature={primaryAncestry?.primaryFeature ?? null}
            featureType="primary"
            onSelect={handlePrimarySelect}
          />
        </div>

        <Separator className="lg:hidden" />

        <div className="space-y-4">
          <div className="flex items-center gap-2 lg:hidden">
            <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
            <span className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Secondary Feature Selection
            </span>
          </div>
          <FeaturePicker
            label="Select Secondary Feature From"
            selectedAncestry={secondaryAncestry?.name ?? null}
            selectedFeature={secondaryAncestry?.secondaryFeature ?? null}
            featureType="secondary"
            onSelect={handleSecondarySelect}
          />
        </div>
      </div>

      {primaryAncestry &&
        secondaryAncestry &&
        primaryAncestry.name === secondaryAncestry.name && (
          <Alert
            variant="destructive"
            className="border-amber-500 bg-amber-50 dark:bg-amber-950/30"
          >
            <AlertTriangle className="size-4 text-amber-600" />
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              Per the rules, you must choose features from{' '}
              <strong>different</strong> ancestries. Both features are currently
              from {primaryAncestry.name}.
            </AlertDescription>
          </Alert>
        )}

      {primaryAncestry &&
        secondaryAncestry &&
        primaryAncestry.name !== secondaryAncestry.name && (
          <>
            <Separator />
            <MixedAncestryPreview
              name={name}
              primaryAncestry={primaryAncestry}
              secondaryAncestry={secondaryAncestry}
            />
          </>
        )}
    </div>
  );
}
