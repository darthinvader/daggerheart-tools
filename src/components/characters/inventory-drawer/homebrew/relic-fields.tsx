type Props = {
  relicTrait: string;
  setRelicTrait: (v: string) => void;
  relicTraitBonus: number | '';
  setRelicTraitBonus: (v: number | '') => void;
  relicXPTrack: string;
  setRelicXPTrack: (v: string) => void;
  relicXPBonus: number | '';
  setRelicXPBonus: (v: number | '') => void;
};

export function RelicFields({
  relicTrait,
  setRelicTrait,
  relicTraitBonus,
  setRelicTraitBonus,
  relicXPTrack,
  setRelicXPTrack,
  relicXPBonus,
  setRelicXPBonus,
}: Props) {
  return (
    <>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Trait bonus</span>
        <div className="flex items-center gap-1">
          <input
            className="w-28 rounded border px-2 py-1"
            placeholder="Trait"
            value={relicTrait}
            onChange={e => setRelicTrait(e.target.value)}
          />
          <input
            type="number"
            className="w-20 rounded border px-2 py-1"
            placeholder="+"
            value={relicTraitBonus}
            onChange={e =>
              setRelicTraitBonus(
                e.target.value === '' ? '' : Number(e.target.value)
              )
            }
          />
        </div>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">XP bonus</span>
        <div className="flex items-center gap-1">
          <input
            className="w-40 rounded border px-2 py-1"
            placeholder="Track"
            value={relicXPTrack}
            onChange={e => setRelicXPTrack(e.target.value)}
          />
          <input
            type="number"
            className="w-20 rounded border px-2 py-1"
            placeholder="+"
            value={relicXPBonus}
            onChange={e =>
              setRelicXPBonus(
                e.target.value === '' ? '' : Number(e.target.value)
              )
            }
          />
        </div>
      </label>
    </>
  );
}
