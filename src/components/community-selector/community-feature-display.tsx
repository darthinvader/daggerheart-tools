import type { CommunityFeature } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import { FeatureIcon, getCommunityColors } from './community-icons';

interface CommunityFeatureDisplayProps {
  feature: CommunityFeature;
  communityName?: string;
  className?: string;
}

export function CommunityFeatureDisplay({
  feature,
  communityName,
  className,
}: CommunityFeatureDisplayProps) {
  const colors = communityName
    ? getCommunityColors(communityName)
    : {
        border: 'border-emerald-200 dark:border-emerald-800',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        accent: 'text-emerald-900 dark:text-emerald-200',
      };

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        colors.border,
        colors.bg,
        className
      )}
    >
      <h4
        className={cn(
          'mb-2 flex items-center gap-2 font-semibold',
          colors.text
        )}
      >
        <FeatureIcon />
        {feature.name}
      </h4>
      <p className={cn('text-sm', colors.accent)}>{feature.description}</p>
    </div>
  );
}
