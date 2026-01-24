import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { FeatureTypeIcons } from '@/lib/icons';
import type { SubclassFeature } from '@/lib/schemas/core';

const FEATURE_TYPE_COLORS: Record<string, string> = {
  foundation: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  specialization: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  mastery: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
};

const FEATURE_TYPE_DESCRIPTIONS: Record<string, string> = {
  foundation: 'Available at Level 1 - Core abilities',
  specialization: 'Unlocks at Tier 5-7 - Advanced abilities',
  mastery: 'Unlocks at Tier 8-10 - Ultimate abilities',
};

interface FeatureTypeBadgeProps {
  type: string;
  level?: number;
}

export function FeatureTypeBadge({ type, level }: FeatureTypeBadgeProps) {
  const typeColor = FEATURE_TYPE_COLORS[type] ?? FEATURE_TYPE_COLORS.foundation;
  const TypeIcon = FeatureTypeIcons[type] ?? FeatureTypeIcons.default;
  const typeDesc = FEATURE_TYPE_DESCRIPTIONS[type] ?? '';

  return (
    <SmartTooltip
      content={
        <>
          <p className="text-xs font-medium">{type}</p>
          <p className="text-muted-foreground text-xs">{typeDesc}</p>
          {level && <p className="text-xs">Unlocks at Level {level}</p>}
        </>
      }
    >
      <Badge
        variant="outline"
        className={`inline-flex cursor-help items-center gap-1 text-xs ${typeColor}`}
      >
        <TypeIcon className="size-3" /> {type}
      </Badge>
    </SmartTooltip>
  );
}

interface SubclassFeatureListProps {
  features: readonly SubclassFeature[];
  showDetails: boolean;
  onToggleDetails: (open: boolean) => void;
}

export function SubclassFeatureList({
  features,
  showDetails,
  onToggleDetails,
}: SubclassFeatureListProps) {
  if (features.length === 0) return null;

  return (
    <div
      onClick={e => e.stopPropagation()}
      onKeyDown={e => e.stopPropagation()}
      className="flex-1"
    >
      <Collapsible open={showDetails} onOpenChange={onToggleDetails}>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {!showDetails &&
              features.slice(0, 2).map(feature => (
                <SmartTooltip
                  key={feature.name}
                  side="bottom"
                  className="max-w-xs"
                  content={
                    <>
                      <p className="font-medium">{feature.name}</p>
                      <p className="mt-1 text-xs">{feature.description}</p>
                    </>
                  }
                >
                  <Badge variant="outline" className="cursor-help text-xs">
                    {feature.name}
                  </Badge>
                </SmartTooltip>
              ))}
            {!showDetails && features.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{features.length - 2}
              </Badge>
            )}
          </div>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 shrink-0 px-2 text-xs"
            >
              {showDetails ? '▲ Less' : '▼ All'}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="pt-2">
          <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
            {features.map((feature, idx) => {
              const featureType = feature.type ?? 'foundation';

              return (
                <SmartTooltip
                  key={idx}
                  side="bottom"
                  className="max-w-xs"
                  content={
                    <>
                      <p className="font-medium">{feature.name}</p>
                      <p className="mt-1 text-xs">{feature.description}</p>
                    </>
                  }
                >
                  <div className="bg-muted/50 cursor-help rounded border p-2 text-xs">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-medium">{feature.name}</span>
                      <FeatureTypeBadge
                        type={featureType}
                        level={feature.level}
                      />
                      {feature.level && (
                        <Badge variant="secondary" className="text-xs">
                          Lv {feature.level}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-2">
                      {feature.description}
                    </p>
                  </div>
                </SmartTooltip>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
