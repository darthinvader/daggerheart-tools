import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type ArmorFiltersToolbarProps = {
  kind: '' | 'standard' | 'special';
  onKindChange: (v: '' | 'standard' | 'special') => void;
  tier: '' | '1' | '2' | '3' | '4';
  onTierChange: (v: '' | '1' | '2' | '3' | '4') => void;
  withEvasionMod: boolean;
  onWithEvasionModChange: (v: boolean) => void;
  withAgilityMod: boolean;
  onWithAgilityModChange: (v: boolean) => void;
  className?: string;
};

export function ArmorFiltersToolbar({
  kind,
  onKindChange,
  tier,
  onTierChange,
  withEvasionMod,
  onWithEvasionModChange,
  withAgilityMod,
  onWithAgilityModChange,
  className,
}: ArmorFiltersToolbarProps) {
  return (
    <div
      className={['flex flex-wrap items-center gap-2 text-xs', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex min-w-0 items-center gap-1">
        <span className="text-muted-foreground shrink-0">Kind:</span>
        <ToggleGroup
          type="single"
          value={kind}
          onValueChange={v =>
            onKindChange((v as '' | 'standard' | 'special') || '')
          }
          className="flex flex-wrap gap-1"
        >
          <ToggleGroupItem value="">All</ToggleGroupItem>
          <ToggleGroupItem value="standard">Standard</ToggleGroupItem>
          <ToggleGroupItem value="special">Special</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex min-w-0 items-center gap-1">
        <span className="text-muted-foreground shrink-0">Tier:</span>
        <ToggleGroup
          type="single"
          value={tier}
          onValueChange={v =>
            onTierChange((v as '' | '1' | '2' | '3' | '4') || '')
          }
          className="flex flex-wrap gap-1"
        >
          <ToggleGroupItem value="">All</ToggleGroupItem>
          <ToggleGroupItem value="1">T1</ToggleGroupItem>
          <ToggleGroupItem value="2">T2</ToggleGroupItem>
          <ToggleGroupItem value="3">T3</ToggleGroupItem>
          <ToggleGroupItem value="4">T4</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-muted-foreground shrink-0">
          Only show armor that modifies:
        </span>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-1">
            <Checkbox
              checked={withEvasionMod}
              onCheckedChange={v => onWithEvasionModChange(!!v)}
            />
            <span>Evasion</span>
          </label>
          <label className="inline-flex items-center gap-1">
            <Checkbox
              checked={withAgilityMod}
              onCheckedChange={v => onWithAgilityModChange(!!v)}
            />
            <span>Agility</span>
          </label>
        </div>
      </div>
    </div>
  );
}
