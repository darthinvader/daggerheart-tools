import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type {
  CombatWheelchair,
  PrimaryWeapon,
  SecondaryWeapon,
} from '@/lib/schemas/equipment';

import {
  BURDEN_EMOJI,
  DAMAGE_TYPE_EMOJI,
  RANGE_EMOJI,
  formatDamage,
  isCombatWheelchair,
} from './constants';

type WeaponType = PrimaryWeapon | SecondaryWeapon | CombatWheelchair;

interface WeaponCardProps {
  weapon: WeaponType;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function WeaponCard({ weapon, isSelected, onSelect }: WeaponCardProps) {
  const damageEmoji =
    DAMAGE_TYPE_EMOJI[weapon.damage.type as keyof typeof DAMAGE_TYPE_EMOJI] ??
    '⚔️';
  const rangeEmoji =
    RANGE_EMOJI[weapon.range as keyof typeof RANGE_EMOJI] ?? '📍';
  const burdenEmoji =
    BURDEN_EMOJI[weapon.burden as keyof typeof BURDEN_EMOJI] ?? '🤲';

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-primary ring-2' : ''}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{weapon.name}</CardTitle>
          <Badge variant="outline">Tier {weapon.tier}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {damageEmoji} {formatDamage(weapon.damage)}{' '}
            {weapon.damage.type === 'mag' ? 'Magic' : 'Physical'}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {rangeEmoji} {weapon.range}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {burdenEmoji} {weapon.burden}
          </Badge>
        </div>

        <div className="text-muted-foreground text-sm">
          <span className="font-medium">Trait:</span> {weapon.trait}
        </div>

        {weapon.features.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium">✨ Features:</p>
            {weapon.features.map((feature, idx) => (
              <div key={idx} className="bg-muted rounded p-2 text-xs">
                <span className="font-semibold">{feature.name}:</span>{' '}
                {feature.description}
              </div>
            ))}
          </div>
        )}

        {isCombatWheelchair(weapon) && (
          <div className="space-y-1">
            <p className="text-sm font-medium">♿ Frame: {weapon.frameType}</p>
            {weapon.wheelchairFeatures.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {weapon.wheelchairFeatures.map((f, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {f}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {weapon.domainAffinity && (
          <div className="text-muted-foreground text-xs">
            🌐 Domain: {weapon.domainAffinity}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
