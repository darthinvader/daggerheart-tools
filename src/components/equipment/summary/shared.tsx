import { Badge } from '@/components/ui/badge';
import { Grip, Hand, MapPin, Sparkles } from '@/lib/icons';

interface FeatureDisplayProps {
  features: Array<{ name: string; description?: string }>;
}

export function FeatureDisplay({ features }: FeatureDisplayProps) {
  if (features.length === 0) return null;

  return (
    <div className="mt-2 space-y-1">
      <p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
        <Sparkles className="h-3 w-3" /> Features:
      </p>
      {features.map((feature, idx) => (
        <div key={idx} className="bg-muted/50 rounded px-2 py-1.5 text-xs">
          <span className="font-semibold">{feature.name}</span>
          {feature.description && (
            <span className="text-muted-foreground">
              {' '}
              — {feature.description}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

interface StatBadgesProps {
  damage?: string | null;
  range?: string;
  burden?: string;
}

export function StatBadges({ damage, range, burden }: StatBadgesProps) {
  if (!damage && !range && !burden) return null;

  const BurdenIcon = burden === 'Two-Handed' ? Grip : Hand;

  return (
    <div className="flex min-w-0 flex-wrap gap-1.5">
      {damage && (
        <Badge variant="secondary" className="shrink-0">
          {damage}
        </Badge>
      )}
      {range && (
        <Badge variant="secondary" className="flex shrink-0 items-center gap-1">
          <MapPin className="h-3 w-3" /> {range}
        </Badge>
      )}
      {burden && (
        <Badge variant="secondary" className="flex shrink-0 items-center gap-1">
          <BurdenIcon className="h-3 w-3" /> {burden}
        </Badge>
      )}
    </div>
  );
}

interface ModifierDisplayProps {
  label: string;
  value?: number;
}

export function ModifierDisplay({ label, value }: ModifierDisplayProps) {
  if (value === undefined) return null;

  const colorClass =
    value > 0
      ? 'font-medium text-green-600'
      : value < 0
        ? 'font-medium text-red-600'
        : '';

  return (
    <span>
      <span className="text-muted-foreground">{label}:</span>{' '}
      <span className={colorClass}>
        {value > 0 ? '+' : ''}
        {value}
      </span>
    </span>
  );
}
