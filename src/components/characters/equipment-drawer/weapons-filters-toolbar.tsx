// no React value usage needed here
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type WeaponsFiltersToolbarProps = {
  tier: string;
  onTierChange: (v: string) => void;
  burden: string;
  onBurdenChange: (v: string) => void;
  className?: string;
};

export function WeaponsFiltersToolbar({
  tier,
  onTierChange,
  burden,
  onBurdenChange,
  className,
}: WeaponsFiltersToolbarProps) {
  return (
    <div
      className={['flex flex-wrap items-center gap-2 text-xs', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Tier:</span>
        <ToggleGroup type="single" value={tier} onValueChange={onTierChange}>
          <ToggleGroupItem value="">All</ToggleGroupItem>
          <ToggleGroupItem value="1">1</ToggleGroupItem>
          <ToggleGroupItem value="2">2</ToggleGroupItem>
          <ToggleGroupItem value="3">3</ToggleGroupItem>
          <ToggleGroupItem value="4">4</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Burden:</span>
        <ToggleGroup
          type="single"
          value={burden}
          onValueChange={onBurdenChange}
        >
          <ToggleGroupItem value="">All</ToggleGroupItem>
          <ToggleGroupItem value="One-Handed">1H</ToggleGroupItem>
          <ToggleGroupItem value="Two-Handed">2H</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
