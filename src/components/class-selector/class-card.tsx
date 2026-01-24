import { memo, useState } from 'react';

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
import type { GameClass } from '@/lib/data/classes';
import {
  ClassIcons,
  DomainIcons,
  Heart,
  HelpCircle,
  ICON_SIZE_LG,
  ICON_SIZE_MD,
  Shield,
  Star,
  Theater,
} from '@/lib/icons';
import { CLASS_BG_COLORS, CLASS_COLORS } from '@/lib/schemas/class-selection';
import { DOMAIN_COLORS } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

import {
  ClassFeaturesSection,
  HopeFeatureSection,
  SubclassesSection,
} from './class-card-sections';

interface ClassCardProps {
  gameClass: GameClass;
  isSelected: boolean;
  onSelect: (gameClass: GameClass) => void;
}

function DomainBadge({ domain }: { domain: string }) {
  const color = DOMAIN_COLORS[domain] ?? '';
  const DomainIcon = DomainIcons[domain] ?? HelpCircle;

  return (
    <SmartTooltip
      content={
        <p className="text-xs">
          <strong>{domain} Domain</strong> - Draw cards from this domain for
          your loadout
        </p>
      }
    >
      <Badge variant="outline" className={cn('cursor-help text-xs', color)}>
        <DomainIcon size={ICON_SIZE_MD} className="mr-1" /> {domain}
      </Badge>
    </SmartTooltip>
  );
}

function StatBadges({ hp, evasion }: { hp: number; evasion: number }) {
  return (
    <div className="flex gap-2">
      <SmartTooltip
        content={
          <>
            <p className="text-xs">
              <strong>Starting Hit Points:</strong> {hp}
            </p>
            <p className="text-muted-foreground text-xs">
              Your initial health pool
            </p>
          </>
        }
      >
        <Badge variant="secondary" className="cursor-help text-xs">
          <Heart size={ICON_SIZE_MD} className="mr-1 text-red-500" /> {hp}
        </Badge>
      </SmartTooltip>
      <SmartTooltip
        content={
          <>
            <p className="text-xs">
              <strong>Starting Evasion:</strong> {evasion}
            </p>
            <p className="text-muted-foreground text-xs">
              Difficulty to hit you with attacks
            </p>
          </>
        }
      >
        <Badge variant="secondary" className="cursor-help text-xs">
          <Shield size={ICON_SIZE_MD} className="mr-1" /> {evasion}
        </Badge>
      </SmartTooltip>
    </div>
  );
}

export function ClassCardComponent({
  gameClass,
  isSelected,
  onSelect,
}: ClassCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const ClassIcon = ClassIcons[gameClass.name] ?? HelpCircle;
  const colorClass = CLASS_COLORS[gameClass.name] ?? 'text-foreground';
  const bgClass = CLASS_BG_COLORS[gameClass.name] ?? '';

  const featureCount = gameClass.classFeatures?.length ?? 0;
  const subclassCount = gameClass.subclasses?.length ?? 0;

  return (
    <Card
      className={cn(
        'flex min-h-72 cursor-pointer flex-col overflow-hidden border-2 transition-all hover:shadow-md',
        isSelected
          ? `${bgClass} ring-primary ring-2`
          : 'hover:border-muted-foreground/50'
      )}
      onClick={() => onSelect(gameClass)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(gameClass);
        }
      }}
      aria-pressed={isSelected}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            <ClassIcon size={ICON_SIZE_LG} className={colorClass} />
          </span>
          <div className="flex-1 space-y-1">
            <CardTitle className={cn('text-lg', colorClass)}>
              {gameClass.name}
            </CardTitle>
            <div className="flex flex-wrap gap-1">
              {gameClass.domains.map(domain => (
                <DomainBadge key={domain} domain={domain} />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-3 pt-0">
        <SmartTooltip
          side="bottom"
          className="max-w-sm"
          content={<p className="text-sm">{gameClass.description}</p>}
        >
          <CardDescription className="line-clamp-2 cursor-help text-sm">
            {gameClass.description}
          </CardDescription>
        </SmartTooltip>

        <div className="flex items-center justify-between">
          <StatBadges
            hp={gameClass.startingHitPoints}
            evasion={gameClass.startingEvasion}
          />
          <div className="flex gap-1">
            {featureCount > 0 && (
              <SmartTooltip
                content={
                  <p className="text-xs">{featureCount} Class Features</p>
                }
              >
                <Badge variant="outline" className="cursor-help text-xs">
                  <Star size={ICON_SIZE_MD} className="mr-1" /> {featureCount}
                </Badge>
              </SmartTooltip>
            )}
            {subclassCount > 0 && (
              <SmartTooltip
                content={
                  <p className="text-xs">
                    {subclassCount} Subclasses available
                  </p>
                }
              >
                <Badge variant="outline" className="cursor-help text-xs">
                  <Theater size={ICON_SIZE_MD} className="mr-1" />{' '}
                  {subclassCount}
                </Badge>
              </SmartTooltip>
            )}
          </div>
        </div>

        <div
          onClick={e => e.stopPropagation()}
          onKeyDown={e => e.stopPropagation()}
          className="flex-1"
        >
          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-full text-xs">
                {showDetails ? '▲ Hide Details' : '▼ Show All Features'}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-2">
              <div className="max-h-48 space-y-3 overflow-y-auto pr-1">
                <ClassFeaturesSection
                  features={gameClass.classFeatures ?? []}
                />
                {gameClass.hopeFeature && (
                  <HopeFeatureSection hopeFeature={gameClass.hopeFeature} />
                )}
                <SubclassesSection subclasses={gameClass.subclasses ?? []} />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}

export const ClassCard = memo(ClassCardComponent);
