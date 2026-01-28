import {
  CharacteristicsIcon,
  FeatureIcon,
  HeightIcon,
  LifespanIcon,
  SecondaryFeatureIcon,
} from '@/components/shared';
import type { Ancestry } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

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
            <FeatureIcon />
            {ancestry.primaryFeature.name}
          </span>
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <SecondaryFeatureIcon />
            {ancestry.secondaryFeature.name}
          </span>
        </div>

        {isSelected ? (
          <>
            <p className="text-muted-foreground text-sm">
              {ancestry.description}
            </p>

            {/* Primary Feature */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
              <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
                <FeatureIcon /> Primary: {ancestry.primaryFeature.name}
              </h4>
              <p className="text-sm text-amber-900 dark:text-amber-200">
                {ancestry.primaryFeature.description}
              </p>
            </div>

            {/* Secondary Feature */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
              <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400">
                <SecondaryFeatureIcon /> Secondary:{' '}
                {ancestry.secondaryFeature.name}
              </h4>
              <p className="text-sm text-blue-900 dark:text-blue-200">
                {ancestry.secondaryFeature.description}
              </p>
            </div>

            {/* Physical Characteristics */}
            {ancestry.physicalCharacteristics.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-primary flex items-center gap-2 text-sm font-medium">
                  <CharacteristicsIcon /> Physical Characteristics
                </h4>
                <ul className="text-muted-foreground list-inside list-disc space-y-0.5 text-sm">
                  {ancestry.physicalCharacteristics.map(char => (
                    <li key={char}>{char}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted-foreground line-clamp-1 text-sm">
            {ancestry.description}
          </p>
        )}
      </div>
    </button>
  );
}
