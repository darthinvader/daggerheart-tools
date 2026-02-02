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
    <div className={cn('bg-card rounded-lg border p-2 sm:p-3', className)}>
      <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
        <Dna className="size-4 sm:size-5" />
        <span className="text-sm font-semibold sm:text-base">{name}</span>
      </div>
      <ExpandableFeaturesList features={features} />
    </div>
  );
}
