type Props = {
  potionType: string;
  setPotionType: (v: string) => void;
  healingAmount: string;
  setHealingAmount: (v: string) => void;
  traitBonusTrait: string;
  setTraitBonusTrait: (v: string) => void;
  traitBonusAmount: number | '';
  setTraitBonusAmount: (v: number | '') => void;
  traitBonusDuration: string;
  setTraitBonusDuration: (v: string) => void;
};

export function PotionFields({
  potionType,
  setPotionType,
  healingAmount,
  setHealingAmount,
  traitBonusTrait,
  setTraitBonusTrait,
  traitBonusAmount,
  setTraitBonusAmount,
  traitBonusDuration,
  setTraitBonusDuration,
}: Props) {
  return (
    <>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Potion type</span>
        <input
          className="rounded border px-2 py-1"
          value={potionType}
          onChange={e => setPotionType(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Healing</span>
        <input
          className="rounded border px-2 py-1"
          value={healingAmount}
          onChange={e => setHealingAmount(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Trait bonus</span>
        <div className="flex items-center gap-1">
          <input
            className="w-28 rounded border px-2 py-1"
            placeholder="Trait"
            value={traitBonusTrait}
            onChange={e => setTraitBonusTrait(e.target.value)}
          />
          <input
            type="number"
            className="w-20 rounded border px-2 py-1"
            placeholder="+"
            value={traitBonusAmount}
            onChange={e =>
              setTraitBonusAmount(
                e.target.value === '' ? '' : Number(e.target.value)
              )
            }
          />
          <input
            className="w-32 rounded border px-2 py-1"
            placeholder="Duration"
            value={traitBonusDuration}
            onChange={e => setTraitBonusDuration(e.target.value)}
          />
        </div>
      </label>
    </>
  );
}
