import type { TraitsDraft } from '@/features/characters/storage';

const TRAIT_ABBR: Array<{ key: string; label: string }> = [
  { key: 'Agility', label: 'Agi' },
  { key: 'Strength', label: 'Str' },
  { key: 'Finesse', label: 'Fin' },
  { key: 'Instinct', label: 'Inst' },
  { key: 'Presence', label: 'Pres' },
  { key: 'Knowledge', label: 'Know' },
];

export function TraitsChip({ traits }: { traits: TraitsDraft }) {
  return (
    <div className="bg-muted/60 text-foreground rounded-md px-2 py-1">
      <div className="text-muted-foreground grid grid-cols-6 gap-x-1 text-[10px] leading-3">
        {TRAIT_ABBR.map(t => (
          <div key={t.label} className="text-center">
            <div>{t.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-x-1 text-[11px] leading-4 font-semibold">
        {TRAIT_ABBR.map(t => (
          <div key={t.label} className="text-center">
            {Number(
              (traits as Record<string, { value?: number }>)[String(t.key)]
                ?.value ?? 0
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
