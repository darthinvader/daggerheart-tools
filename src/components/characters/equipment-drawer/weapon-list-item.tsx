import { CheckIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Weapon = {
  name: string;
  trait: string;
  range: string;
  damage: { count: number; diceType: number; modifier?: number; type: string };
  burden: string;
  tier: string | number;
  domainAffinity?: string;
  description?: string;
  features?: { name: string; description: string }[];
  metadata?: { homebrew?: boolean };
};

export function WeaponListItem({
  weapon,
  selected,
  onSelect,
}: {
  weapon: Weapon;
  selected: boolean;
  onSelect: (w: Weapon) => void;
}) {
  return (
    <button
      type="button"
      aria-selected={selected}
      className={cn(
        'hover:bg-muted/50 w-full text-left',
        selected && 'bg-accent/30 ring-ring ring-1'
      )}
      onClick={() => onSelect(weapon)}
    >
      <div className="grid grid-cols-[1fr_auto] items-start gap-1 px-3 py-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 truncate font-medium">
            {weapon.name}
            {weapon.metadata?.homebrew ? (
              <Badge variant="outline" className="px-1 py-0 text-[10px]">
                Homebrew
              </Badge>
            ) : null}
            {selected ? (
              <Badge variant="secondary" className="px-1 py-0 text-[10px]">
                Selected
              </Badge>
            ) : null}
          </div>
          <div className="text-muted-foreground mt-0.5 flex flex-wrap gap-1 text-xs">
            <Badge variant="outline" className="px-1 py-0 text-[10px]">
              {weapon.trait}
            </Badge>
            <Badge variant="outline" className="px-1 py-0 text-[10px]">
              {weapon.range}
            </Badge>
            <Badge
              variant="outline"
              className="px-1 py-0 text-[10px]"
            >{`${weapon.damage.count}d${weapon.damage.diceType}${weapon.damage.modifier ? `+${weapon.damage.modifier}` : ''} ${weapon.damage.type}`}</Badge>
            <Badge variant="outline" className="px-1 py-0 text-[10px]">
              {weapon.burden}
            </Badge>
            {weapon.domainAffinity ? (
              <Badge variant="outline" className="px-1 py-0 text-[10px]">
                {weapon.domainAffinity}
              </Badge>
            ) : null}
          </div>
          {weapon.features?.length ? (
            <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5 text-[11px]">
              {weapon.features.map((f, i) => (
                <li key={i}>
                  <span className="font-medium">{f.name}:</span> {f.description}
                </li>
              ))}
            </ul>
          ) : null}
          {weapon.description ? (
            <div className="text-muted-foreground mt-1 text-[11px]">
              {weapon.description}
            </div>
          ) : null}
        </div>
        <div className="text-muted-foreground flex items-start gap-2 text-right text-[11px]">
          <span>T{weapon.tier}</span>
          {selected ? (
            <CheckIcon className="text-primary size-4" aria-hidden />
          ) : null}
        </div>
      </div>
    </button>
  );
}
