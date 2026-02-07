import { FeatureIcon, TraitsIcon } from '@/components/shared';
import { DynamicIcon } from '@/lib/icons';
import type { Community } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import { getCommunityColors, getCommunityIcon } from './community-config';

interface CommunityCardProps {
  community: Community;
  isSelected: boolean;
  onSelect: (community: Community) => void;
}

export function CommunityCard({
  community,
  isSelected,
  onSelect,
}: CommunityCardProps) {
  const colors = getCommunityColors(community.name);
  const icon = getCommunityIcon(community.name);

  return (
    <button
      type="button"
      onClick={() => onSelect(community)}
      className={cn(
        'w-full rounded-lg border p-4 text-left transition-all',
        'hover:border-primary/50 hover:bg-accent/50',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        isSelected
          ? cn(colors.border, colors.bg, 'ring-opacity-50 ring-2')
          : 'border-border bg-card'
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <DynamicIcon icon={icon} className="size-5" />
          <h3
            className={cn('text-lg font-semibold', isSelected && colors.text)}
          >
            {community.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <FeatureIcon />
          <span
            className={cn(
              'font-medium',
              isSelected ? colors.text : 'text-muted-foreground'
            )}
          >
            {community.feature.name}
          </span>
        </div>

        {isSelected ? (
          <>
            <p className={cn('text-sm', colors.accent)}>
              {community.description}
            </p>

            <div
              className={cn('rounded-lg border p-3', colors.border, colors.bg)}
            >
              <h4
                className={cn(
                  'mb-2 flex items-center gap-2 text-sm font-semibold',
                  colors.text
                )}
              >
                <FeatureIcon /> {community.feature.name}
              </h4>
              <p className={cn('text-sm whitespace-pre-line', colors.accent)}>
                {community.feature.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4
                className={cn(
                  'flex items-center gap-2 text-sm font-medium',
                  colors.text
                )}
              >
                <TraitsIcon /> Common Traits
              </h4>
              <div className="flex flex-wrap gap-2">
                {community.commonTraits.map(trait => (
                  <span
                    key={trait}
                    className={cn(
                      'rounded-full px-2 py-1 text-xs capitalize',
                      colors.border,
                      colors.bg,
                      colors.accent
                    )}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {community.commonTraits.slice(0, 3).map(trait => (
              <span
                key={trait}
                className="text-muted-foreground rounded-full border px-2 py-0.5 text-xs capitalize"
              >
                {trait}
              </span>
            ))}
            {community.commonTraits.length > 3 && (
              <span className="text-muted-foreground text-xs">
                +{community.commonTraits.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
