import { estimateItemCost } from '@/features/characters/logic/cost';
import type { Item } from '@/lib/schemas/equipment';

export function CostChips({ item }: { item: Item }) {
  const c = estimateItemCost(item);
  return (
    <span className="rounded bg-emerald-100 px-1 py-0.5 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200">
      🪙 {c.handfuls} • 💰 {c.bags} • 🧰 {c.chests}
    </span>
  );
}
