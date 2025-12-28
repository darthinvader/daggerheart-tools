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
      className={`hover:border-primary/50 hover:bg-accent/50 relative cursor-pointer rounded-lg border p-3 transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'bg-card'} `}
    >
      {isSelected && (
        <div className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full">
          <Check className="h-3 w-3" />
        </div>
      )}

      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm leading-tight font-semibold">{weapon.name}</h4>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          T{weapon.tier}
        </Badge>
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        <Badge variant="secondary" className="text-[10px]">
          {damageEmoji} {formatDamage(weapon.damage)}
        </Badge>
        <Badge variant="secondary" className="text-[10px]">
          {rangeEmoji} {weapon.range}
        </Badge>
      </div>

      <div className="text-muted-foreground mb-1 text-xs">
        <span className="font-medium">{weapon.trait}</span>
        <span className="mx-1">·</span>
        <span>{weapon.burden}</span>
      </div>

      {weapon.features.length > 0 && (
        <div className="mt-2 space-y-1">
          {weapon.features.slice(0, 2).map((feature, idx) => (
            <div
              key={idx}
              className="bg-muted/50 rounded px-2 py-1 text-[10px]"
            >
              <span className="font-semibold">{feature.name}</span>
              {feature.description && (
                <span className="text-muted-foreground">
                  {' — '}
                  {feature.description}
                </span>
              )}
            </div>
          ))}
          {weapon.features.length > 2 && (
            <span className="text-muted-foreground text-[10px]">
              +{weapon.features.length - 2} more
            </span>
          )}
        </div>
      )}

      {isCombatWheelchair(weapon) && (
        <div className="text-muted-foreground mt-2 text-[10px]">
          ♿ {weapon.frameType} Frame
        </div>
      )}
    </div>
  );
}
