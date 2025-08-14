import { estimateItemCost } from '@/features/characters/logic/cost';
import type { Item } from '@/lib/schemas/equipment';

export function ItemBadges({ item }: { item: unknown }) {
  const tier = String((item as { tier?: number | string }).tier);
  const rarity = (item as { rarity?: string }).rarity;
  const cost = estimateItemCost(item as Item);
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px]">
      <span className="rounded bg-blue-100 px-1 py-0.5 text-blue-900 dark:bg-blue-500/20 dark:text-blue-200">
        ⛰️ Tier {tier}
      </span>
      <span className="rounded bg-amber-100 px-1 py-0.5 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
        🎖️ {rarity}
      </span>
      <span className="rounded bg-emerald-100 px-1 py-0.5 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200">
        🪙 {cost.handfuls} • 💰 {cost.bags} • 🧰 {cost.chests}
      </span>
    </div>
  );
}
