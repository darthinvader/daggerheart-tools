// no React value usage needed here
import { ArmorListItem } from '@/components/characters/equipment-drawer/armor-list-item';

export type ArmorResultsListProps<TArmor> = {
  items: TArmor[];
  isSelected: (a: TArmor) => boolean;
  onSelect: (a: TArmor) => void;
  emptyHint?: string;
};

export function ArmorResultsList<TArmor extends { name: string }>({
  items,
  isSelected,
  onSelect,
  emptyHint,
}: ArmorResultsListProps<TArmor>) {
  return (
    <div className="max-h-72 overflow-auto rounded border">
      {items.map(a => (
        <ArmorListItem
          key={a.name}
          armor={a as never}
          selected={isSelected(a)}
          onSelect={aa => onSelect(aa as never)}
        />
      ))}
      {items.length === 0 ? (
        <div className="text-muted-foreground p-3 text-xs">
          {emptyHint || 'No items match. Try clearing filters.'}
        </div>
      ) : null}
    </div>
  );
}
