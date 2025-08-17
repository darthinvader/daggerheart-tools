import type { ResourcesDraft } from '@/features/characters/storage';

export function CoreChip({ resources }: { resources: ResourcesDraft }) {
  return (
    <div className="bg-muted/60 rounded-md px-2 py-1">
      <div className="text-muted-foreground grid grid-cols-2 gap-x-2 text-[10px] leading-3">
        <div className="text-center">Prof</div>
        <div className="text-center">Evasion</div>
      </div>
      <div className="grid grid-cols-2 gap-x-2 text-[11px] leading-4 font-semibold">
        <div className="text-center">{resources.proficiency}</div>
        <div className="text-center">{resources.evasion}</div>
      </div>
    </div>
  );
}
