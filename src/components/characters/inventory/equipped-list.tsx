import type { Item } from '@/lib/schemas/equipment';

type EquippedSlot = { item: Item };

export function EquippedList({
  items,
  getEmoji,
}: {
  items: EquippedSlot[];
  getEmoji: (s: unknown) => string;
}) {
  if (!items.length) {
    return (
      <div className="text-muted-foreground text-xs">No items equipped</div>
    );
  }

  return (
    <div className="text-xs">
      <div className="font-medium">🧷 Equipped</div>
      <ul className="mt-1 space-y-0.5">
        {items.map((s, idx) => {
          const feats = Array.isArray(s.item.features)
            ? s.item.features
            : ([] as Array<{ description?: string }>);
          const emoji = getEmoji(s.item as unknown as { category?: string });
          const featDesc = feats
            .map(f => f.description)
            .filter((t): t is string => !!t && t.trim().length > 0)
            .join(' • ');
          return (
            <li
              key={`${s.item.name}-eq-${idx}`}
              className="flex flex-col sm:flex-row sm:items-center sm:gap-2"
            >
              <div className="flex items-center gap-2">
                <span aria-hidden>{emoji}</span>
                <span className="font-medium">{s.item.name}</span>
              </div>
              {featDesc ? (
                <div className="text-muted-foreground">{featDesc}</div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
