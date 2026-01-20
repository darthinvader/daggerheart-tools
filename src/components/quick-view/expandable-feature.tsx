import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

interface ExpandableFeatureProps {
  feature?: { name: string; description?: string };
  name?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  label?: string;
}

export function ExpandableFeature({
  feature,
  name: propName,
  description: propDescription,
  icon,
  className,
  label,
}: ExpandableFeatureProps) {
  const name = feature?.name ?? propName ?? '';
  const description = feature?.description ?? propDescription;
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDescription = description && description.trim().length > 0;

  return (
    <div className={cn('text-sm', className)}>
      <button
        type="button"
        onClick={() => hasDescription && setIsExpanded(!isExpanded)}
        className={cn(
          'flex w-full items-center gap-1 text-left',
          hasDescription && 'hover:text-primary cursor-pointer'
        )}
        disabled={!hasDescription}
      >
        {hasDescription ? (
          isExpanded ? (
            <ChevronDown className="size-3 shrink-0 opacity-60" />
          ) : (
            <ChevronRight className="size-3 shrink-0 opacity-60" />
          )
        ) : (
          <span className="w-3 shrink-0 text-center text-xs opacity-60">
            {icon ?? '▸'}
          </span>
        )}
        <span className="font-medium">{name}</span>
        {label && (
          <span className="text-muted-foreground ml-1 text-xs">({label})</span>
        )}
      </button>
      {isExpanded && hasDescription && (
        <p className="text-muted-foreground mt-1 ml-4 text-xs leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

interface ExpandableFeaturesListProps {
  features: { name: string; description?: string }[];
  icon?: React.ReactNode;
  className?: string;
}

export function ExpandableFeaturesList({
  features,
  icon,
  className,
}: ExpandableFeaturesListProps) {
  if (features.length === 0) return null;

  return (
    <div className={cn('space-y-1', className)}>
      {features.map((f, i) => (
        <ExpandableFeature
          key={i}
          name={f.name}
          description={f.description}
          icon={icon}
        />
      ))}
    </div>
  );
}
