import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicIcon, Sparkles, Wheelchair } from '@/lib/icons';
import type {
  CombatWheelchair,
  PrimaryWeapon,
  SecondaryWeapon,
} from '@/lib/schemas/equipment';

import {
  formatDamage,
  getBurdenIcon,
  getDamageIcon,
  getRangeIcon,
  isCombatWheelchair,
} from './constants';

type WeaponType = PrimaryWeapon | SecondaryWeapon | CombatWheelchair;

interface WeaponCardProps {
  weapon: WeaponType;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function WeaponCard({ weapon, isSelected, onSelect }: WeaponCardProps) {
  const damageIcon = getDamageIcon(weapon.damage.type as 'phy' | 'mag');
  const rangeIcon = getRangeIcon(weapon.range);
  const burdenIcon = getBurdenIcon(weapon.burden);

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
            <DynamicIcon icon={damageIcon} className="mr-1 h-3 w-3" />
            {formatDamage(weapon.damage)}{' '}
            {weapon.damage.type === 'mag' ? 'Magic' : 'Physical'}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <DynamicIcon icon={rangeIcon} className="mr-1 h-3 w-3" />
            {weapon.range}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <DynamicIcon icon={burdenIcon} className="mr-1 h-3 w-3" />
            {weapon.burden}
          </Badge>
        </div>

        <div className="text-muted-foreground text-sm">
          <span className="font-medium">Trait:</span> {weapon.trait}
        </div>

        {weapon.features.length > 0 && (
          <div className="space-y-1">
            <p className="flex items-center gap-1 text-sm font-medium">
              <Sparkles className="h-4 w-4" /> Features:
            </p>
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
            <p className="flex items-center gap-1 text-sm font-medium">
              <Wheelchair className="h-4 w-4" /> Frame: {weapon.frameType}
            </p>
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
            Domain: {weapon.domainAffinity}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
