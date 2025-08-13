type Props = {
  usageType: string;
  setUsageType: (v: string) => void;
  charges: number | '';
  setCharges: (v: number | '') => void;
  recharge: string;
  setRecharge: (v: string) => void;
};

export function UtilityFields({
  usageType,
  setUsageType,
  charges,
  setCharges,
  recharge,
  setRecharge,
}: Props) {
  return (
    <>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Usage</span>
        <select
          className="rounded border px-2 py-1"
          value={usageType}
          onChange={e => setUsageType(e.target.value)}
        >
          <option value="unlimited">unlimited</option>
          <option value="limited">limited</option>
          <option value="consumable">consumable</option>
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Charges</span>
        <input
          type="number"
          className="rounded border px-2 py-1"
          value={charges}
          onChange={e =>
            setCharges(e.target.value === '' ? '' : Number(e.target.value))
          }
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Recharge</span>
        <input
          className="rounded border px-2 py-1"
          value={recharge}
          onChange={e => setRecharge(e.target.value)}
        />
      </label>
    </>
  );
}
