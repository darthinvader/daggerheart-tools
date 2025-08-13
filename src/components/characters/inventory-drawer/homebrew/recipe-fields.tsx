type Props = {
  craftedItem: string;
  setCraftedItem: (v: string) => void;
  materials: string;
  setMaterials: (v: string) => void;
  downtime: boolean;
  setDowntime: (v: boolean) => void;
  instructions: string;
  setInstructions: (v: string) => void;
};

export function RecipeFields({
  craftedItem,
  setCraftedItem,
  materials,
  setMaterials,
  downtime,
  setDowntime,
  instructions,
  setInstructions,
}: Props) {
  return (
    <>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Crafted item</span>
        <input
          className="rounded border px-2 py-1"
          value={craftedItem}
          onChange={e => setCraftedItem(e.target.value)}
        />
      </label>
      <label className="col-span-2 flex flex-col gap-1 md:col-span-2">
        <span className="text-muted-foreground">
          Materials (comma separated)
        </span>
        <input
          className="rounded border px-2 py-1"
          value={materials}
          onChange={e => setMaterials(e.target.value)}
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={downtime}
          onChange={e => setDowntime(e.target.checked)}
        />
        <span className="text-muted-foreground">Downtime required</span>
      </label>
      <label className="col-span-2 flex flex-col gap-1 md:col-span-3">
        <span className="text-muted-foreground">Instructions</span>
        <textarea
          className="min-h-16 rounded border px-2 py-1"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
        />
      </label>
    </>
  );
}
