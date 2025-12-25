import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import type { FeatureUnlockState } from './types';

const FEATURE_TYPE_COLORS: Record<string, string> = {
  foundation: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  specialization: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  mastery: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
};

const FEATURE_TYPE_EMOJIS: Record<string, string> = {
  foundation: '🏛️',
  specialization: '⚡',
  mastery: '👑',
};

function getDefaultUnlockState(featureType: string): boolean {
  return featureType === 'foundation';
}

function getFeatureUnlockInfo(featureType: string, level?: number) {
  if (featureType === 'foundation') {
    return { unlockLevel: 1, tier: '1' };
  }
  if (featureType === 'specialization') {
    return { unlockLevel: level ?? 5, tier: '5-7' };
  }
  if (featureType === 'mastery') {
    return { unlockLevel: level ?? 8, tier: '8-10' };
  }
  return { unlockLevel: 1, tier: '1' };
}

interface SubclassFeaturesCardProps {
  className: string;
  features: ReadonlyArray<{
    readonly name: string;
    readonly description: string;
    readonly type?: string;
    readonly level?: number;
  }>;
  unlockState: FeatureUnlockState;
  onToggleUnlock: (featureName: string) => void;
}

export function SubclassFeaturesCard({
  className,
  features,
  unlockState,
  onToggleUnlock,
}: SubclassFeaturesCardProps) {
  if (!features.length) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="shrink-0">🎯</span>
          <span>Subclass Features</span>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {features.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-64 space-y-2 overflow-y-auto">
        {features.map((feature, idx) => {
          const featureType = feature.type ?? 'foundation';
          const unlockInfo = getFeatureUnlockInfo(featureType, feature.level);
          const typeColor =
            FEATURE_TYPE_COLORS[featureType] ?? FEATURE_TYPE_COLORS.foundation;
          const typeEmoji = FEATURE_TYPE_EMOJIS[featureType] ?? '⭐';
          const featureKey = `${className}:${feature.name}`;
          const isUnlocked =
            unlockState[featureKey] ?? getDefaultUnlockState(featureType);

          return (
            <div
              key={idx}
              className={cn(
                'rounded border p-2',
                isUnlocked ? 'bg-muted/30' : 'bg-muted/10 opacity-70'
              )}
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{feature.name}</span>
                <SmartTooltip
                  content={
                    <p>
                      {featureType === 'foundation' && 'Available at level 1'}
                      {featureType === 'specialization' &&
                        `Unlocks at Tier 5-7 (level ${feature.level ?? 5}+)`}
                      {featureType === 'mastery' &&
                        `Unlocks at Tier 8-10 (level ${feature.level ?? 8}+)`}
                    </p>
                  }
                >
                  <Badge
                    variant="outline"
                    className={cn('cursor-help text-xs', typeColor)}
                  >
                    {typeEmoji} {featureType}
                  </Badge>
                </SmartTooltip>
                <div className="flex items-center gap-2">
                  <SmartTooltip
                    content={
                      <p>
                        Click to toggle unlock status. Tier {unlockInfo.tier}{' '}
                        (Level {unlockInfo.unlockLevel}+)
                      </p>
                    }
                  >
                    <div className="flex items-center gap-1.5">
                      <Switch
                        id={`unlock-${featureKey}`}
                        checked={isUnlocked}
                        onCheckedChange={() => onToggleUnlock(featureKey)}
                        className="scale-75"
                      />
                      <Label
                        htmlFor={`unlock-${featureKey}`}
                        className="cursor-pointer text-xs"
                      >
                        {isUnlocked ? (
                          <Badge
                            variant="outline"
                            className="border-green-500/30 bg-green-500/10 text-xs text-green-700"
                          >
                            ✓ Unlocked
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-gray-500/30 bg-gray-500/10 text-xs text-gray-500"
                          >
                            🔒 Locked
                          </Badge>
                        )}
                      </Label>
                    </div>
                  </SmartTooltip>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">
                {feature.description}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
