import { Dice5, Hand, Ruler, Tag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { Armor, Weapon } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

type CommonProps = {
  className?: string;
  badgeClassName?: string;
  size?: 'xs' | 'sm';
};

export function WeaponChips({
  weapon,
  className,
  badgeClassName,
  size = 'sm',
}: { weapon: Weapon } & CommonProps) {
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-[11px]';
  return (
    <div
      className={cn(
        'text-muted-foreground mt-0.5 flex flex-wrap gap-1',
        textSize,
        className
      )}
    >
      <Badge variant="outline" className={cn('px-1 py-0', badgeClassName)}>
        <Tag className="mr-1 inline size-3" aria-hidden />
        {weapon.trait}
      </Badge>
      <Badge variant="outline" className={cn('px-1 py-0', badgeClassName)}>
        <Ruler className="mr-1 inline size-3" aria-hidden />
        {weapon.range}
      </Badge>
      <Badge variant="outline" className={cn('px-1 py-0', badgeClassName)}>
        <Dice5 className="mr-1 inline size-3" aria-hidden />
        {`${weapon.damage.count}d${weapon.damage.diceType}${weapon.damage.modifier ? `+${weapon.damage.modifier}` : ''} ${weapon.damage.type}`}
      </Badge>
      <Badge variant="outline" className={cn('px-1 py-0', badgeClassName)}>
        <Hand className="mr-1 inline size-3" aria-hidden />
        {weapon.burden}
      </Badge>
      {weapon.domainAffinity ? (
        <Badge variant="outline" className={cn('px-1 py-0', badgeClassName)}>
          {weapon.domainAffinity}
        </Badge>
      ) : null}
    </div>
  );
}

export function ArmorChips({
  armor,
  className,
  badgeClassName,
  size = 'sm',
}: { armor: Armor; armorType?: string } & CommonProps) {
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-[11px]';
  const armorType = (armor as unknown as { armorType?: string })?.armorType;
  return (
    <div
      className={cn(
        'text-muted-foreground mt-0.5 flex flex-wrap gap-1',
        textSize,
        className
      )}
    >
      <Badge variant="outline" className={cn('px-1 py-0', badgeClassName)}>
        🛡️ Base {armor.baseScore}
      </Badge>
      <Badge variant="outline" className={cn('px-1 py-0', badgeClassName)}>
        🚧 M{armor.baseThresholds.major}/S{armor.baseThresholds.severe}
      </Badge>
      {armor.evasionModifier ? (
        <Badge variant="outline" className={cn('px-1 py-0', badgeClassName)}>
          🎯 Evasion{' '}
          {armor.evasionModifier >= 0
            ? `+${armor.evasionModifier}`
            : armor.evasionModifier}
        </Badge>
      ) : null}
      {armor.agilityModifier ? (
        <Badge variant="outline" className={cn('px-1 py-0', badgeClassName)}>
          🏃 Agility{' '}
          {armor.agilityModifier >= 0
            ? `+${armor.agilityModifier}`
            : armor.agilityModifier}
        </Badge>
      ) : null}
      {armorType ? (
        <Badge variant="outline" className={cn('px-1 py-0', badgeClassName)}>
          🪖 {armorType}
        </Badge>
      ) : null}
    </div>
  );
}
