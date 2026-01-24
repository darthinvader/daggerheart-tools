import type { ComponentType } from 'react';

import { Badge } from '@/components/ui/badge';
import type { LucideProps } from '@/lib/icons';
import { Wheelchair, Wrench } from '@/lib/icons';

import { FeatureDisplay, StatBadges } from './shared';

type IconComponent = ComponentType<LucideProps>;

interface WeaponSummaryCardProps {
  icon: IconComponent;
  label: string;
  name: string;
  isHomebrew: boolean;
  isEmpty: boolean;
  damage?: string | null;
  range?: string;
  trait?: string;
  burden?: string;
  features?: Array<{ name: string; description?: string }>;
  tier?: string;
  frameType?: string;
  wheelchairFeatures?: string[];
  description?: string;
}

export function WeaponSummaryCard({
  icon: Icon,
  label,
  name,
  isHomebrew,
  isEmpty,
  damage,
  range,
  trait,
  burden,
  features = [],
  tier,
  frameType,
  wheelchairFeatures = [],
  description,
}: WeaponSummaryCardProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-lg border p-4 ${isEmpty ? 'border-dashed opacity-60' : 'bg-card'}`}
    >
      <CardHeader
        icon={Icon}
        label={label}
        isHomebrew={isHomebrew}
        tier={tier}
      />
      <CardTitle name={name} isEmpty={isEmpty} />

      {!isEmpty && (
        <div className="mt-3 flex-1 space-y-2">
          {description && (
            <p className="text-muted-foreground text-sm italic">
              {description}
            </p>
          )}
          <StatBadges damage={damage} range={range} burden={burden} />
          <TraitDisplay trait={trait} />
          <FrameDisplay frameType={frameType} />
          <WheelchairFeaturesDisplay features={wheelchairFeatures} />
          <FeatureDisplay features={features} />
        </div>
      )}
    </div>
  );
}

function CardHeader({
  icon: Icon,
  label,
  isHomebrew,
  tier,
}: {
  icon: IconComponent;
  label: string;
  isHomebrew: boolean;
  tier?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {isHomebrew && (
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-[10px]"
          >
            <Wrench className="h-3 w-3" /> Homebrew
          </Badge>
        )}
        {tier && (
          <Badge variant="outline" className="text-[10px]">
            Tier {tier}
          </Badge>
        )}
      </div>
    </div>
  );
}

function CardTitle({ name, isEmpty }: { name: string; isEmpty: boolean }) {
  return (
    <h3
      className={`text-lg font-bold ${isEmpty ? 'text-muted-foreground italic' : ''}`}
    >
      {name}
    </h3>
  );
}

function TraitDisplay({ trait }: { trait?: string }) {
  if (!trait) return null;
  return (
    <p className="text-sm">
      <span className="text-muted-foreground">Trait:</span>{' '}
      <span className="font-medium">{trait}</span>
    </p>
  );
}

function FrameDisplay({ frameType }: { frameType?: string }) {
  if (!frameType) return null;
  return (
    <p className="flex items-center gap-1 text-sm">
      <span className="text-muted-foreground">Frame:</span>{' '}
      <Wheelchair className="h-4 w-4" />
      <span className="font-medium">{frameType}</span>
    </p>
  );
}

function WheelchairFeaturesDisplay({ features }: { features: string[] }) {
  if (features.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {features.map((f, i) => (
        <Badge key={i} variant="outline" className="text-[10px]">
          {f}
        </Badge>
      ))}
    </div>
  );
}
