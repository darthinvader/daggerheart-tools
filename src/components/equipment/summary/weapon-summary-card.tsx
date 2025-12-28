import { Badge } from '@/components/ui/badge';

import { FeatureDisplay, StatBadges } from './shared';

interface WeaponSummaryCardProps {
  icon: string;
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
  icon,
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
        icon={icon}
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
  icon,
  label,
  isHomebrew,
  tier,
}: {
  icon: string;
  label: string;
  isHomebrew: boolean;
  tier?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {isHomebrew && (
          <Badge variant="outline" className="text-[10px]">
            🔧 Homebrew
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
    <p className="text-sm">
      <span className="text-muted-foreground">Frame:</span>{' '}
      <span className="font-medium">♿ {frameType}</span>
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
