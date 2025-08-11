import { CheckIcon } from 'lucide-react';

import { ArmorChips } from '@/components/characters/equipment-chips';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Armor = {
  name: string;
  baseScore: number;
  baseThresholds: { major: number; severe: number };
  evasionModifier?: number;
  agilityModifier?: number;
  tier: string | number;
  armorType?: string;
  description?: string;
  features?: { name: string; description: string }[];
  metadata?: { homebrew?: boolean };
  // Optional special fields from SpecialArmor
  isStandard?: boolean;
  materialType?: string;
};

export function ArmorListItem({
  armor,
  selected,
  onSelect,
}: {
  armor: Armor;
  selected: boolean;
  onSelect: (a: Armor) => void;
}) {
  return (
    <button
      type="button"
      aria-selected={selected}
      className={cn(
        'hover:bg-muted/50 w-full text-left',
        selected && 'bg-accent/30 ring-ring ring-1'
      )}
      onClick={() => onSelect(armor)}
    >
      <div className="grid grid-cols-[1fr_auto] items-start gap-1 px-3 py-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 truncate font-medium">
            {armor.name}
            {armor.metadata?.homebrew ? (
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
          <ArmorChips
            armor={armor as unknown as import('@/lib/schemas/equipment').Armor}
            size="xs"
          />
          {armor.features?.length ? (
            <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5 text-[11px]">
              {armor.features.map((f, i) => (
                <li key={i}>
                  <span className="font-medium">{f.name}:</span> {f.description}
                </li>
              ))}
            </ul>
          ) : null}
          {armor.description ? (
            <div className="text-muted-foreground mt-1 text-[11px]">
              {armor.description}
            </div>
          ) : null}
        </div>
        <div className="text-muted-foreground flex items-start gap-2 text-right text-[11px]">
          <span>T{armor.tier}</span>
          {selected ? (
            <CheckIcon className="text-primary size-4" aria-hidden />
          ) : null}
        </div>
      </div>
    </button>
  );
}
