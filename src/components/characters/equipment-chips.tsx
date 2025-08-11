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
      <Badge
        variant="outline"
        className={cn(
          'border-violet-300 px-1 py-0 text-violet-700 dark:border-violet-600/50 dark:text-violet-300',
          badgeClassName
        )}
      >
        <Tag className="mr-1 inline size-3" aria-hidden />
        {weapon.trait}
      </Badge>
      <Badge
        variant="outline"
        className={cn(
          'border-sky-300 px-1 py-0 text-sky-700 dark:border-sky-600/50 dark:text-sky-300',
          badgeClassName
        )}
      >
        <Ruler className="mr-1 inline size-3" aria-hidden />
        {weapon.range}
      </Badge>
      <Badge
        variant="secondary"
        className={cn(
          'px-1 py-0 text-amber-900 dark:text-amber-200',
          badgeClassName
        )}
      >
        <Dice5 className="mr-1 inline size-3" aria-hidden />
        {`${weapon.damage.count}d${weapon.damage.diceType}${weapon.damage.modifier ? `+${weapon.damage.modifier}` : ''} ${weapon.damage.type}`}
      </Badge>
      <Badge
        variant="outline"
        className={cn(
          'border-slate-300 px-1 py-0 text-slate-700 dark:border-slate-600/50 dark:text-slate-300',
          badgeClassName
        )}
      >
        <Hand className="mr-1 inline size-3" aria-hidden />
        {weapon.burden}
      </Badge>
      {weapon.domainAffinity ? (
        <Badge
          variant="outline"
          className={cn(
            'border-indigo-300 px-1 py-0 text-indigo-700 dark:border-indigo-600/50 dark:text-indigo-300',
            badgeClassName
          )}
        >
          {weapon.domainAffinity}
        </Badge>
      ) : null}
      {(weapon as unknown as { metadata?: { homebrew?: boolean } })?.metadata
        ?.homebrew ? (
        <Badge
          variant="outline"
          className={cn(
            'border-fuchsia-300 px-1 py-0 text-fuchsia-700 dark:border-fuchsia-600/50 dark:text-fuchsia-300',
            badgeClassName
          )}
        >
          Homebrew
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
  const isStandard = (armor as unknown as { isStandard?: boolean })?.isStandard;
  const material = (armor as unknown as { materialType?: string })
    ?.materialType;
  const isHomebrew = (
    armor as unknown as {
      metadata?: { homebrew?: boolean };
    }
  )?.metadata?.homebrew;
  return (
    <div
      className={cn(
        'text-muted-foreground mt-1 flex flex-wrap gap-1',
        textSize,
        className
      )}
    >
      <Badge variant="secondary" className={cn('px-1 py-0', badgeClassName)}>
        🛡️ Base {armor.baseScore}
      </Badge>
      <Badge variant="secondary" className={cn('px-1 py-0', badgeClassName)}>
        🚧 M{armor.baseThresholds.major}/S{armor.baseThresholds.severe}
      </Badge>
      {armor.evasionModifier ? (
        <Badge
          variant="outline"
          className={cn(
            'border-cyan-300 px-1 py-0 text-cyan-700 dark:border-cyan-600/50 dark:text-cyan-300',
            badgeClassName
          )}
        >
          🎯 Evasion{' '}
          {armor.evasionModifier >= 0
            ? `+${armor.evasionModifier}`
            : armor.evasionModifier}
        </Badge>
      ) : null}
      {armor.agilityModifier ? (
        <Badge
          variant="outline"
          className={cn(
            'border-lime-300 px-1 py-0 text-lime-700 dark:border-lime-600/50 dark:text-lime-300',
            badgeClassName
          )}
        >
          🏃 Agility{' '}
          {armor.agilityModifier >= 0
            ? `+${armor.agilityModifier}`
            : armor.agilityModifier}
        </Badge>
      ) : null}
      {armorType ? (
        <Badge
          variant="outline"
          className={cn(
            'border-teal-300 px-1 py-0 text-teal-700 dark:border-teal-600/50 dark:text-teal-300',
            badgeClassName
          )}
        >
          🪖 {armorType}
        </Badge>
      ) : null}
      {material ? (
        <Badge
          variant="outline"
          className={cn(
            'border-stone-300 px-1 py-0 text-stone-700 dark:border-stone-600/50 dark:text-stone-300',
            badgeClassName
          )}
        >
          🧱 {material}
        </Badge>
      ) : null}
      {isStandard === false ? (
        <Badge
          variant="outline"
          className={cn(
            'border-rose-300 px-1 py-0 text-rose-700 dark:border-rose-600/50 dark:text-rose-300',
            badgeClassName
          )}
        >
          Special
        </Badge>
      ) : null}
      {isHomebrew ? (
        <Badge
          variant="outline"
          className={cn(
            'border-fuchsia-300 px-1 py-0 text-fuchsia-700 dark:border-fuchsia-600/50 dark:text-fuchsia-300',
            badgeClassName
          )}
        >
          Homebrew
        </Badge>
      ) : null}
    </div>
  );
}
