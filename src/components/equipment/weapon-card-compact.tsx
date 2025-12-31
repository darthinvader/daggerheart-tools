import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type {
  CombatWheelchair,
  PrimaryWeapon,
  SecondaryWeapon,
} from '@/lib/schemas/equipment';

import {
  DAMAGE_TYPE_EMOJI,
  RANGE_EMOJI,
  formatDamage,
  isCombatWheelchair,
} from './constants';

type WeaponType = PrimaryWeapon | SecondaryWeapon | CombatWheelchair;

interface WeaponCardCompactProps {
  weapon: WeaponType;
  isSelected?: boolean;
  onClick?: () => void;
}

export function WeaponCardCompact({
  weapon,
  isSelected,
  onClick,
}: WeaponCardCompactProps) {
  const damageEmoji =
    DAMAGE_TYPE_EMOJI[weapon.damage.type as keyof typeof DAMAGE_TYPE_EMOJI] ??
    '⚔️';
  const rangeEmoji =
    RANGE_EMOJI[weapon.range as keyof typeof RANGE_EMOJI] ?? '📍';

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
        <h4 className="text-base leading-tight font-semibold">{weapon.name}</h4>
        <Badge variant="outline" className="shrink-0 text-xs">
          Tier {weapon.tier}
        </Badge>
      </div>

      {/* Combat Stats */}
      <div className="bg-muted/30 mb-3 rounded-lg border p-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-background flex items-center gap-2 rounded-md p-2">
            <span className="text-lg">{damageEmoji}</span>
            <div>
              <div className="text-muted-foreground text-[10px]">Damage</div>
              <div className="text-sm font-bold">
                {formatDamage(weapon.damage)}
              </div>
            </div>
          </div>
          <div className="bg-background flex items-center gap-2 rounded-md p-2">
            <span className="text-lg">{rangeEmoji}</span>
            <div>
              <div className="text-muted-foreground text-[10px]">Range</div>
              <div className="text-sm font-bold">{weapon.range}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground mb-2 flex gap-2 text-sm">
        <Badge variant="secondary" className="text-xs">
          {weapon.trait}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {weapon.burden}
        </Badge>
      </div>

      {weapon.features.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {weapon.features.slice(0, 3).map((feature, idx) => (
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
          {weapon.features.length > 3 && (
            <span className="text-muted-foreground text-xs">
              +{weapon.features.length - 3} more features
            </span>
          )}
        </div>
      )}

      {isCombatWheelchair(weapon) && (
        <div className="text-muted-foreground mt-3 text-xs">
          ♿ {weapon.frameType} Frame
        </div>
      )}
    </div>
  );
}
