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
  }
}

export function QuickAncestryInfo({
  selection,
  className,
}: QuickAncestryInfoProps) {
  const name = getAncestryName(selection);
  const features = getAncestryFeatures(selection);

  return (
    <div className={cn('bg-card rounded-lg border p-3', className)}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">🧬</span>
        <span className="font-semibold">{name}</span>
      </div>
      <ExpandableFeaturesList features={features} />
    </div>
  );
}
