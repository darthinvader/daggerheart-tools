export type InventoryCounts = {
  utility: number;
  consumables: number;
  potions: number;
  relics: number;
  weaponMods: number;
  armorMods: number;
  recipes: number;
};

export function InventorySummaryChips({
  slotsCount,
  totalItems,
  freeRemaining,
  counts,
}: {
  slotsCount: number;
  totalItems: number;
  freeRemaining: number | null;
  counts: InventoryCounts;
}) {
  return (
    <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
      <span className="mr-1">
        {slotsCount} slots • {totalItems} items
        {freeRemaining !== null ? ` • ${freeRemaining} free` : ''}
      </span>
      {counts.utility > 0 && (
        <span
          className="bg-muted rounded px-1 py-0.5"
          aria-label="Utility items count"
        >
          🧰 {counts.utility}
        </span>
      )}
      {counts.consumables > 0 && (
        <span
          className="bg-muted rounded px-1 py-0.5"
          aria-label="Consumables count"
        >
          🍽️ {counts.consumables}
        </span>
      )}
      {counts.potions > 0 && (
        <span
          className="bg-muted rounded px-1 py-0.5"
          aria-label="Potions count"
        >
          🧪 {counts.potions}
        </span>
      )}
      {counts.relics > 0 && (
        <span
          className="bg-muted rounded px-1 py-0.5"
          aria-label="Relics count"
        >
          🗿 {counts.relics}
        </span>
      )}
      {counts.weaponMods > 0 && (
        <span
          className="bg-muted rounded px-1 py-0.5"
          aria-label="Weapon mods count"
        >
          🛠️ {counts.weaponMods}
        </span>
      )}
      {counts.armorMods > 0 && (
        <span
          className="bg-muted rounded px-1 py-0.5"
          aria-label="Armor mods count"
        >
          🛡️ {counts.armorMods}
        </span>
      )}
      {counts.recipes > 0 && (
        <span
          className="bg-muted rounded px-1 py-0.5"
          aria-label="Recipes count"
        >
          📜 {counts.recipes}
        </span>
      )}
    </div>
  );
}
