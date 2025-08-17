import type { ResourcesDraft } from '@/features/characters/storage';

export function GoldChip({ resources }: { resources: ResourcesDraft }) {
  return (
    <div className="bg-muted/60 rounded-md px-2 py-1">
      <div className="text-muted-foreground text-center text-[10px] leading-3">
        Gold
      </div>
      <div className="flex items-center justify-center gap-2 text-[11px] leading-4">
        <span title="Handfuls">🪙 {resources.gold?.handfuls ?? 0}</span>
        <span title="Bags">💰 {resources.gold?.bags ?? 0}</span>
        <span title="Chests">🧰 {resources.gold?.chests ?? 0}</span>
      </div>
    </div>
  );
}
