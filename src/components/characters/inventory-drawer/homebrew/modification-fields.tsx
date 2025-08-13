type Props = {
  modType: string;
  setModType: (v: string) => void;
  compatible: string;
  setCompatible: (v: string) => void;
  modTraitChange: string;
  setModTraitChange: (v: string) => void;
  modFeatureName: string;
  setModFeatureName: (v: string) => void;
  modFeatureDesc: string;
  setModFeatureDesc: (v: string) => void;
};

export function ModificationFields({
  modType,
  setModType,
  compatible,
  setCompatible,
  modTraitChange,
  setModTraitChange,
  modFeatureName,
  setModFeatureName,
  modFeatureDesc,
  setModFeatureDesc,
}: Props) {
  return (
    <>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Modification type</span>
        <input
          className="rounded border px-2 py-1"
          value={modType}
          onChange={e => setModType(e.target.value)}
        />
      </label>
      <label className="col-span-2 flex flex-col gap-1 md:col-span-2">
        <span className="text-muted-foreground">
          Compatible with (comma separated)
        </span>
        <input
          className="rounded border px-2 py-1"
          value={compatible}
          onChange={e => setCompatible(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Trait change (trait name)</span>
        <input
          className="rounded border px-2 py-1"
          value={modTraitChange}
          onChange={e => setModTraitChange(e.target.value)}
        />
      </label>
      <label className="col-span-2 flex flex-col gap-1 md:col-span-3">
        <span className="text-muted-foreground">Feature added</span>
        <div className="grid grid-cols-2 gap-1 md:grid-cols-3">
          <input
            className="rounded border px-2 py-1"
            placeholder="Name"
            value={modFeatureName}
            onChange={e => setModFeatureName(e.target.value)}
          />
          <input
            className="col-span-1 rounded border px-2 py-1 md:col-span-2"
            placeholder="Description"
            value={modFeatureDesc}
            onChange={e => setModFeatureDesc(e.target.value)}
          />
        </div>
      </label>
    </>
  );
}
