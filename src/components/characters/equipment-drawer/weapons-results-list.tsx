// no React value usage needed here
import { WeaponListItem } from '@/components/characters/equipment-drawer/weapon-list-item';

export type WeaponsResultsListProps<TWeapon> = {
  items: TWeapon[];
  isSelected: (w: TWeapon) => boolean;
  onSelect: (w: TWeapon) => void;
  emptyHint?: string;
};

export function WeaponsResultsList<TWeapon extends { name: string }>({
  items,
  isSelected,
  onSelect,
  emptyHint = 'No items match. Try switching Source or clearing filters.',
}: WeaponsResultsListProps<TWeapon>) {
  return (
    <div className="max-h-72 overflow-auto rounded border">
      {items.map(w => (
        <WeaponListItem
          key={w.name}
          weapon={w as never}
          selected={isSelected(w)}
          onSelect={ww => onSelect(ww as never)}
        />
      ))}
      {items.length === 0 ? (
        <div className="text-muted-foreground p-3 text-xs">{emptyHint}</div>
      ) : null}
    </div>
  );
}
