import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { CombatWheelchair } from '@/lib/schemas/equipment';

import { DAMAGE_TYPE_EMOJI, formatDamage, RANGE_EMOJI } from './constants';

interface WheelchairCardCompactProps {
  wheelchair: CombatWheelchair;
  isSelected?: boolean;
  onClick?: () => void;
}

const FRAME_TYPE_COLORS: Record<string, string> = {
  Light: 'text-blue-600 bg-blue-50 border-blue-200',
  Heavy: 'text-amber-600 bg-amber-50 border-amber-200',
  Arcane: 'text-purple-600 bg-purple-50 border-purple-200',
};

export function WheelchairCardCompact({
  wheelchair,
  isSelected,
  onClick,
}: WheelchairCardCompactProps) {
  const damageEmoji =
    DAMAGE_TYPE_EMOJI[
      wheelchair.damage.type as keyof typeof DAMAGE_TYPE_EMOJI
    ] ?? '⚔️';
  const rangeEmoji =
    RANGE_EMOJI[wheelchair.range as keyof typeof RANGE_EMOJI] ?? '📍';
  const frameColorClasses =
    FRAME_TYPE_COLORS[wheelchair.frameType] ??
    'text-gray-600 bg-gray-50 border-gray-200';

  return (
    <div
      onClick={onClick}
      className={`hover:border-primary/50 hover:bg-accent/50 relative cursor-pointer rounded-lg border p-4 transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'bg-card'} `}
    >
      {isSelected && (
        <div className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full">
          <Check className="h-3 w-3" />
        </div>
      )}

      <div className="mb-3 flex items-start justify-between gap-2">
        <h4 className="text-base leading-tight font-semibold">
          ♿ {wheelchair.name}
        </h4>
        <Badge variant="outline" className="shrink-0 text-xs">
          Tier {wheelchair.tier}
        </Badge>
      </div>

      {/* Frame Type Badge - Prominent */}
      <div className="mb-3">
        <Badge className={`border text-sm ${frameColorClasses}`}>
          {wheelchair.frameType} Frame
        </Badge>
      </div>

      {/* Combat Stats */}
      <div className="bg-muted/30 mb-3 rounded-lg border p-3">
        <div className="mb-2 text-xs font-medium">Combat Stats</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-background flex items-center gap-2 rounded-md p-2">
            <span className="text-lg">{damageEmoji}</span>
            <div>
              <div className="text-muted-foreground text-[10px]">Damage</div>
              <div className="text-sm font-bold">
                {formatDamage(wheelchair.damage)}
              </div>
            </div>
          </div>
          <div className="bg-background flex items-center gap-2 rounded-md p-2">
            <span className="text-lg">{rangeEmoji}</span>
            <div>
              <div className="text-muted-foreground text-[10px]">Range</div>
              <div className="text-sm font-bold">{wheelchair.range}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground mb-3 flex gap-2 text-sm">
        <Badge variant="secondary" className="text-xs">
          {wheelchair.trait}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {wheelchair.burden}
        </Badge>
      </div>

      {/* Wheelchair-Specific Features */}
      {wheelchair.wheelchairFeatures.length > 0 && (
        <div className="mb-3">
          <div className="mb-1 text-xs font-medium">Wheelchair Features</div>
          <div className="flex flex-wrap gap-1">
            {wheelchair.wheelchairFeatures.map((feature, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="border-primary/30 bg-primary/5 text-xs"
              >
                ♿ {feature}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Combat Features */}
      {wheelchair.features.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs font-medium">Combat Features</div>
          {wheelchair.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="bg-muted/50 rounded px-2 py-1.5 text-xs">
              <span className="font-semibold">{feature.name}</span>
              {feature.description && (
                <span className="text-muted-foreground">
                  {' — '}
                  {feature.description}
                </span>
              )}
            </div>
          ))}
          {wheelchair.features.length > 3 && (
            <span className="text-muted-foreground text-xs">
              +{wheelchair.features.length - 3} more features
            </span>
          )}
        </div>
      )}
    </div>
  );
}
