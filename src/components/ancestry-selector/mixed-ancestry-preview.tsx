import type { Ancestry } from '@/lib/schemas/identity';

import { FeatureCard } from './feature-card';

interface MixedAncestryPreviewProps {
  name: string;
  primaryAncestry: Ancestry;
  secondaryAncestry: Ancestry;
}

export function MixedAncestryPreview({
  name,
  primaryAncestry,
  secondaryAncestry,
}: MixedAncestryPreviewProps) {
  const displayName =
    name.trim() || `${primaryAncestry.name}-${secondaryAncestry.name} Mix`;

  return (
    <div className="border-primary/50 bg-primary/5 rounded-lg border p-4">
      <h3 className="mb-2 font-semibold">{displayName}</h3>
      <p className="text-muted-foreground mb-3 text-sm">
        Parent Ancestries: {primaryAncestry.name} & {secondaryAncestry.name}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <FeatureCard
          feature={primaryAncestry.primaryFeature}
          variant="primary"
        />
        <FeatureCard
          feature={secondaryAncestry.secondaryFeature}
          variant="secondary"
        />
      </div>
    </div>
  );
}
