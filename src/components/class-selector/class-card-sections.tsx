import { Badge } from '@/components/ui/badge';
import { SmartTooltip } from '@/components/ui/smart-tooltip';

interface ClassFeature {
  name: string;
  description: string;
}

interface HopeFeature {
  name: string;
  description: string;
  hopeCost: number;
}

interface Subclass {
  name: string;
  description: string;
}

function HopeFeatureBadge({ hopeCost }: { hopeCost: number }) {
  return (
    <SmartTooltip
      content={
        <>
          <p className="text-xs">
            <strong>Hope Cost:</strong> {hopeCost}
          </p>
          <p className="text-muted-foreground text-xs">
            Spend this much Hope to activate
          </p>
        </>
      }
    >
      <Badge
        variant="outline"
        className="cursor-help border-amber-500/50 text-xs text-amber-600"
      >
        💫 {hopeCost} Hope
      </Badge>
    </SmartTooltip>
  );
}

export function ClassFeaturesSection({
  features,
}: {
  features: readonly ClassFeature[];
}) {
  if (features.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <div className="bg-card sticky top-0 flex items-center gap-2 py-1">
        <span className="text-sm">⭐</span>
        <span className="text-xs font-medium">Class Features</span>
      </div>
      {features.map((feature, idx) => (
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
            <div className="font-medium">{feature.name}</div>
            <p className="text-muted-foreground mt-0.5 line-clamp-2">
              {feature.description}
            </p>
          </div>
        </SmartTooltip>
      ))}
    </div>
  );
}

export function HopeFeatureSection({
  hopeFeature,
}: {
  hopeFeature: HopeFeature;
}) {
  return (
    <div className="space-y-1.5">
      <div className="bg-card sticky top-0 flex items-center gap-2 py-1">
        <span className="text-sm">💫</span>
        <span className="text-xs font-medium">Hope Feature</span>
        <HopeFeatureBadge hopeCost={hopeFeature.hopeCost} />
      </div>
      <SmartTooltip
        side="bottom"
        className="max-w-xs"
        content={
          <>
            <p className="font-medium">{hopeFeature.name}</p>
            <p className="mt-1 text-xs">{hopeFeature.description}</p>
          </>
        }
      >
        <div className="cursor-help rounded border border-yellow-500/30 bg-yellow-500/10 p-2 text-xs">
          <div className="font-medium">{hopeFeature.name}</div>
          <p className="text-muted-foreground mt-0.5 line-clamp-2">
            {hopeFeature.description}
          </p>
        </div>
      </SmartTooltip>
    </div>
  );
}

export function SubclassesSection({
  subclasses,
}: {
  subclasses: readonly Subclass[];
}) {
  if (subclasses.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <div className="bg-card sticky top-0 flex items-center gap-2 py-1">
        <span className="text-sm">🎭</span>
        <span className="text-xs font-medium">Subclasses</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {subclasses.map((sub, idx) => (
          <SmartTooltip
            key={idx}
            side="bottom"
            className="max-w-xs"
            content={
              <>
                <p className="font-medium">{sub.name}</p>
                <p className="mt-1 text-xs">{sub.description}</p>
              </>
            }
          >
            <Badge variant="outline" className="cursor-help text-xs">
              {sub.name}
            </Badge>
          </SmartTooltip>
        ))}
      </div>
    </div>
  );
}
