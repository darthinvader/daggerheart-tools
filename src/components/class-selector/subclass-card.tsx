import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { GameSubclass } from '@/lib/data/classes';
import { CLASS_COLORS } from '@/lib/schemas/class-selection';
import { cn } from '@/lib/utils';

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

const FEATURE_TYPE_DESCRIPTIONS: Record<string, string> = {
  foundation: 'Available at Level 1 - Core abilities',
  specialization: 'Unlocks at Tier 5-7 - Advanced abilities',
  mastery: 'Unlocks at Tier 8-10 - Ultimate abilities',
};

interface SubclassCardProps {
  subclass: GameSubclass;
  className: string;
  isSelected: boolean;
  onSelect: (subclass: GameSubclass) => void;
}

function FeatureTypeBadge({ type, level }: { type: string; level?: number }) {
  const typeColor = FEATURE_TYPE_COLORS[type] ?? FEATURE_TYPE_COLORS.foundation;
  const typeEmoji = FEATURE_TYPE_EMOJIS[type] ?? '⭐';
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
      <Badge variant="outline" className={cn('cursor-help text-xs', typeColor)}>
        {typeEmoji} {type}
      </Badge>
    </SmartTooltip>
  );
}

function SpellcastBadge({ trait }: { trait: string }) {
  return (
    <SmartTooltip
      content={
        <>
          <p className="text-xs">
            <strong>Spellcast Trait:</strong> {trait}
          </p>
          <p className="text-muted-foreground text-xs">
            Use this trait for Spellcast Rolls
          </p>
        </>
      }
    >
      <Badge
        variant="outline"
        className="cursor-help border-violet-500/50 text-xs text-violet-600"
      >
        ✨ {trait}
      </Badge>
    </SmartTooltip>
  );
}

function CompanionBadge() {
  return (
    <SmartTooltip
      content={
        <>
          <p className="text-xs">
            <strong>Animal Companion</strong>
          </p>
          <p className="text-muted-foreground text-xs">
            This subclass includes an animal ally
          </p>
        </>
      }
    >
      <Badge variant="secondary" className="cursor-help text-xs">
        🐾 Companion
      </Badge>
    </SmartTooltip>
  );
}

export function SubclassCard({
  subclass,
  className,
  isSelected,
  onSelect,
}: SubclassCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const colorClass = CLASS_COLORS[className] ?? 'text-foreground';
  const featureCount = subclass.features?.length ?? 0;
  const hasCompanion = 'companion' in subclass && subclass.companion;
  const spellcastTrait =
    'spellcastTrait' in subclass ? subclass.spellcastTrait : null;

  const foundationCount =
    subclass.features?.filter(f => (f.type ?? 'foundation') === 'foundation')
      .length ?? 0;
  const specCount =
    subclass.features?.filter(f => f.type === 'specialization').length ?? 0;
  const masteryCount =
    subclass.features?.filter(f => f.type === 'mastery').length ?? 0;

  return (
    <Card
      className={cn(
        'flex min-h-64 cursor-pointer flex-col overflow-hidden border-2 transition-all hover:shadow-md',
        isSelected
          ? 'border-primary ring-primary bg-primary/5 ring-2'
          : 'hover:border-muted-foreground/50'
      )}
      onClick={() => onSelect(subclass)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(subclass);
        }
      }}
      aria-pressed={isSelected}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className={cn('text-base', colorClass)}>
            {subclass.name}
          </CardTitle>
          <div className="flex flex-wrap justify-end gap-1">
            {hasCompanion && <CompanionBadge />}
            {spellcastTrait && (
              <SpellcastBadge trait={spellcastTrait as string} />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-3 pt-0">
        <SmartTooltip
          side="bottom"
          className="max-w-sm"
          content={<p className="text-sm">{subclass.description}</p>}
        >
          <CardDescription className="line-clamp-2 cursor-help text-sm">
            {subclass.description}
          </CardDescription>
        </SmartTooltip>

        {featureCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <SmartTooltip
              content={
                <p className="text-xs">
                  🏛️ {foundationCount} Foundation • ⚡ {specCount}{' '}
                  Specialization • 👑 {masteryCount} Mastery
                </p>
              }
            >
              <Badge variant="outline" className="cursor-help text-xs">
                {featureCount} Features
              </Badge>
            </SmartTooltip>
          </div>
        )}

        {featureCount > 0 && (
          <div
            onClick={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}
            className="flex-1"
          >
            <Collapsible open={showDetails} onOpenChange={setShowDetails}>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {!showDetails &&
                    subclass.features.slice(0, 2).map(feature => (
                      <SmartTooltip
                        key={feature.name}
                        side="bottom"
                        className="max-w-xs"
                        content={
                          <>
                            <p className="font-medium">{feature.name}</p>
                            <p className="mt-1 text-xs">
                              {feature.description}
                            </p>
                          </>
                        }
                      >
                        <Badge
                          variant="outline"
                          className="cursor-help text-xs"
                        >
                          {feature.name}
                        </Badge>
                      </SmartTooltip>
                    ))}
                  {!showDetails && featureCount > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{featureCount - 2}
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
                  {subclass.features.map((feature, idx) => {
                    const featureType = feature.type ?? 'foundation';

                    return (
                      <SmartTooltip
                        key={idx}
                        side="bottom"
                        className="max-w-xs"
                        content={
                          <>
                            <p className="font-medium">{feature.name}</p>
                            <p className="mt-1 text-xs">
                              {feature.description}
                            </p>
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
        )}
      </CardContent>
    </Card>
  );
}
