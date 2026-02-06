import { Dna } from 'lucide-react';

import type { AncestrySelection } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import { ExpandableFeaturesList } from './expandable-feature';

interface QuickAncestryInfoProps {
  selection: AncestrySelection;
  className?: string;
}

function getAncestryName(selection: AncestrySelection): string {
  if (!selection) return 'None';
  switch (selection.mode) {
    case 'standard':
      return selection.ancestry.name;
    case 'mixed':
      return selection.mixedAncestry.name;
    case 'homebrew':
      return selection.homebrew.name;
    case 'custom':
      return selection.custom?.name || 'Custom Ancestry';
  }
}

function getAncestryFeatures(
  selection: AncestrySelection
): { name: string; description: string }[] {
  if (!selection) return [];
  switch (selection.mode) {
    case 'standard':
      return [
        selection.ancestry.primaryFeature,
        selection.ancestry.secondaryFeature,
      ];
    case 'mixed':
      return [
        selection.mixedAncestry.primaryFeature,
        selection.mixedAncestry.secondaryFeature,
      ];
    case 'homebrew':
      return [
        selection.homebrew.primaryFeature,
        selection.homebrew.secondaryFeature,
      ];
    case 'custom':
      return selection.custom
        ? [selection.custom.primaryFeature, selection.custom.secondaryFeature]
        : [];
  }
}

export function QuickAncestryInfo({
  selection,
  className,
}: QuickAncestryInfoProps) {
  const name = getAncestryName(selection);
  const features = getAncestryFeatures(selection);

  return (
    <div className={cn('quick-identity-card', className)}>
      <div className="quick-identity-header">
        <div className="quick-identity-icon-wrap ancestry">
          <Dna className="size-4" />
        </div>
        <div className="quick-identity-title">
          <span className="quick-identity-label">Ancestry</span>
          <span className="quick-identity-name">{name}</span>
        </div>
      </div>
      {features.length > 0 && (
        <div className="quick-identity-features">
          <ExpandableFeaturesList features={features} />
        </div>
      )}
    </div>
  );
}
