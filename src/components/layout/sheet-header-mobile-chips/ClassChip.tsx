import type { ClassDraft } from '@/features/characters/storage';

export function ClassChip({
  classDraft,
  level,
}: {
  classDraft: ClassDraft;
  level: number;
}) {
  return (
    <div className="bg-muted/60 rounded-md px-2 py-1">
      <div className="text-muted-foreground text-[10px] leading-3">
        Class/Subclass
      </div>
      <div className="text-[11px] leading-4 font-semibold whitespace-nowrap">
        {classDraft.className}
        {classDraft.subclass ? ` / ${classDraft.subclass}` : ''}
        <span className="text-muted-foreground ml-2">Lvl {level}</span>
      </div>
    </div>
  );
}
