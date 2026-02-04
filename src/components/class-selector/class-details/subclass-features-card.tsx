import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { Switch } from '@/components/ui/switch';
import { FeatureTypeIcons, Lock, Power, Target } from '@/lib/icons';
import { cn } from '@/lib/utils';

import type { FeatureUnlockState } from './types';

const FEATURE_TYPE_COLORS: Record<string, string> = {
  foundation: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  specialization: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  mastery: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
};

const FEATURE_TYPE_BG: Record<string, string> = {
  foundation: 'bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10',
  specialization: 'bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10',
  mastery: 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10',
};

function getDefaultUnlockState(featureType: string): boolean {
  return featureType === 'foundation';
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
  disabledFeatures?: Set<string>;
  onToggleFeatureActivation?: (featureName: string) => void;
}

export function SubclassFeaturesCard({
  className,
  features,
  unlockState,
  onToggleUnlock,
  disabledFeatures,
  onToggleFeatureActivation,
}: SubclassFeaturesCardProps) {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  if (!features.length) return null;

  const toggleItem = (idx: number) => {
    setOpenItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 px-1 text-sm font-medium">
        <Target className="size-4" />
        <span>Subclass Features</span>
        <Badge variant="secondary" className="text-xs">
          {features.length}
        </Badge>
      </div>
      <div className="space-y-1">
        {features.map((feature, idx) => {
          const featureType = feature.type ?? 'foundation';
          const typeColor =
            FEATURE_TYPE_COLORS[featureType] ?? FEATURE_TYPE_COLORS.foundation;
          const typeBg =
            FEATURE_TYPE_BG[featureType] ?? FEATURE_TYPE_BG.foundation;
          const TypeIcon =
            FeatureTypeIcons[featureType] ?? FeatureTypeIcons.default;
          const featureKey = `${className}:${feature.name}`;
          const isUnlocked =
            unlockState[featureKey] ?? getDefaultUnlockState(featureType);
          const isDisabled = disabledFeatures?.has(feature.name);

          return (
            <Collapsible
              key={idx}
              open={openItems[idx]}
              onOpenChange={() => toggleItem(idx)}
            >
              <div
                className={cn(
                  'flex w-full items-center gap-1 rounded border',
                  typeBg,
                  !isUnlocked && 'opacity-60',
                  isDisabled && 'opacity-50'
                )}
              >
                <CollapsibleTrigger
                  className={cn(
                    'flex flex-1 items-center justify-between px-2.5 py-1.5 text-left text-sm'
                  )}
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-medium">{feature.name}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'inline-flex items-center text-[10px]',
                        typeColor
                      )}
                    >
                      <TypeIcon className="size-3" />
                    </Badge>
                    {isUnlocked ? (
                      <Badge
                        variant="outline"
                        className="border-green-500/30 bg-green-500/10 text-[10px] text-green-700"
                      >
                        ✓
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground inline-flex items-center text-[10px]"
                      >
                        <Lock className="size-3" />
                      </Badge>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-muted-foreground text-xs transition-transform',
                      openItems[idx] && 'rotate-180'
                    )}
                  >
                    ▼
                  </span>
                </CollapsibleTrigger>
                {onToggleFeatureActivation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-1 h-7 w-7 p-0"
                    onClick={e => {
                      e.stopPropagation();
                      onToggleFeatureActivation(feature.name);
                    }}
                    title={
                      isDisabled ? 'Activate feature' : 'Deactivate feature'
                    }
                  >
                    <Power
                      className={cn(
                        'h-4 w-4',
                        !isDisabled ? 'text-green-500' : 'text-muted-foreground'
                      )}
                    />
                  </Button>
                )}
              </div>
              <CollapsibleContent>
                <div className="bg-muted/20 space-y-2 rounded-b border-x border-b px-2.5 py-2">
                  <p className="text-muted-foreground text-xs">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <SmartTooltip content={<p>Toggle unlock status</p>}>
                      <div className="flex items-center gap-1.5">
                        <Switch
                          id={`unlock-${featureKey}`}
                          checked={isUnlocked}
                          onCheckedChange={() => onToggleUnlock(featureKey)}
                          className="scale-75"
                        />
                        <Label
                          htmlFor={`unlock-${featureKey}`}
                          className="text-muted-foreground cursor-pointer text-xs"
                        >
                          {isUnlocked ? 'Unlocked' : 'Locked'}
                        </Label>
                      </div>
                    </SmartTooltip>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
