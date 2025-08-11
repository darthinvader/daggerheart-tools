// no React value usage needed here
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type ArmorFiltersToolbarProps = {
  armorType: string;
  onArmorTypeChange: (v: string) => void;
  armorTypes: string[];
  className?: string;
};

export function ArmorFiltersToolbar({
  armorType,
  onArmorTypeChange,
  armorTypes,
  className,
}: ArmorFiltersToolbarProps) {
  return (
    <div
      className={['flex flex-wrap items-center gap-2 text-xs', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Type:</span>
        <ToggleGroup
          type="single"
          value={armorType}
          onValueChange={onArmorTypeChange}
        >
          <ToggleGroupItem value="">All</ToggleGroupItem>
          {armorTypes.map(t => (
            <ToggleGroupItem key={t} value={t}>
              {t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
