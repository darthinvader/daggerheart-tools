import * as React from 'react';

import type { ResourcesDraft } from '@/features/characters/storage';

export function ResourcesChip({
  resources,
  onDeltaHp,
  onDeltaStress,
  onDeltaHope,
  onDeltaArmorScore,
}: {
  resources: ResourcesDraft;
  onDeltaHp?: (delta: number) => void;
  onDeltaStress?: (delta: number) => void;
  onDeltaHope?: (delta: number) => void;
  onDeltaArmorScore?: (delta: number) => void;
}) {
  return (
    <div className="bg-muted/60 rounded-md px-2 py-1">
      <div className="text-muted-foreground grid grid-cols-4 gap-x-2 text-[10px] leading-3">
        <div className="text-center">HP</div>
        <div className="text-center">Stress</div>
        <div className="text-center">Hope</div>
        <div className="text-center">Armor</div>
      </div>
      <div className="grid grid-cols-4 gap-x-2 text-[11px] leading-4 font-semibold">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            className="rounded border px-1 text-[11px]"
            aria-label="Decrease HP"
            onClick={() => onDeltaHp?.(-1)}
          >
            -
          </button>
          <div className="min-w-8 text-center tabular-nums">
            {resources.hp.current}
          </div>
          <button
            type="button"
            className="rounded border px-1 text-[11px]"
            aria-label="Increase HP"
            onClick={() => onDeltaHp?.(1)}
          >
            +
          </button>
        </div>
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            className="rounded border px-1 text-[11px]"
            aria-label="Decrease Stress"
            onClick={() => onDeltaStress?.(-1)}
          >
            -
          </button>
          <div className="min-w-8 text-center tabular-nums">
            {resources.stress.current}
          </div>
          <button
            type="button"
            className="rounded border px-1 text-[11px]"
            aria-label="Increase Stress"
            onClick={() => onDeltaStress?.(1)}
          >
            +
          </button>
        </div>
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            className="rounded border px-1 text-[11px]"
            aria-label="Decrease Hope"
            onClick={() => onDeltaHope?.(-1)}
          >
            -
          </button>
          <div className="min-w-8 text-center tabular-nums">
            {resources.hope.current}
          </div>
          <button
            type="button"
            className="rounded border px-1 text-[11px]"
            aria-label="Increase Hope"
            onClick={() => onDeltaHope?.(1)}
          >
            +
          </button>
        </div>
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            className="rounded border px-1 text-[11px]"
            aria-label="Decrease Armor Score"
            onClick={() => onDeltaArmorScore?.(-1)}
          >
            -
          </button>
          <div className="min-w-8 text-center tabular-nums">
            {resources.armorScore?.current ?? 0}
          </div>
          <button
            type="button"
            className="rounded border px-1 text-[11px]"
            aria-label="Increase Armor Score"
            onClick={() => onDeltaArmorScore?.(1)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
