import type { AncestryFeature } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import { PrimaryFeatureIcon, SecondaryFeatureIcon } from './ancestry-icons';

interface FeatureDisplayProps {
  feature: AncestryFeature;
  variant: 'primary' | 'secondary';
  className?: string;
}

export function FeatureDisplay({
  feature,
  variant,
  className,
}: FeatureDisplayProps) {
  const isPrimary = variant === 'primary';

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        isPrimary
          ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30'
          : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
        className
      )}
    >
      <h4
        className={cn(
          'mb-2 flex items-center gap-2 font-semibold',
          isPrimary
            ? 'text-amber-700 dark:text-amber-400'
            : 'text-blue-700 dark:text-blue-400'
        )}
      >
        {isPrimary ? <PrimaryFeatureIcon /> : <SecondaryFeatureIcon />}
        {isPrimary ? 'Primary' : 'Secondary'}: {feature.name}
      </h4>
      <p
        className={cn(
          'text-sm',
          isPrimary
            ? 'text-amber-900 dark:text-amber-200'
            : 'text-blue-900 dark:text-blue-200'
        )}
      >
        {feature.description}
      </p>
    </div>
  );
}
