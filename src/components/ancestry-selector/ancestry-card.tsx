import type { Ancestry } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import {
  HeightIcon,
  LifespanIcon,
  PrimaryFeatureIcon,
  SecondaryFeatureIcon,
} from './ancestry-icons';

interface AncestryCardProps {
  ancestry: Ancestry;
  isSelected: boolean;
  onSelect: (ancestry: Ancestry) => void;
}

export function AncestryCard({
  ancestry,
  isSelected,
  onSelect,
}: AncestryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(ancestry)}
      className={cn(
        'w-full rounded-lg border p-4 text-left transition-all',
        'hover:border-primary/50 hover:bg-accent/50',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        isSelected
          ? 'border-primary bg-primary/10 ring-primary/20 ring-2'
          : 'border-border bg-card'
      )}
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{ancestry.name}</h3>

        <div className="text-muted-foreground flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-1">
            <HeightIcon />
            {ancestry.heightRange}
          </span>
          <span className="flex items-center gap-1">
            <LifespanIcon />
            {ancestry.lifespan}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <PrimaryFeatureIcon />
            {ancestry.primaryFeature.name}
          </span>
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <SecondaryFeatureIcon />
            {ancestry.secondaryFeature.name}
          </span>
        </div>

        <p className="text-muted-foreground line-clamp-1 text-sm">
          {ancestry.description}
        </p>
      </div>
    </button>
  );
}
