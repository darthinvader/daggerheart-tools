// no React import needed with automatic JSX runtime
import { Button } from '@/components/ui/button';
import { estimateItemCost } from '@/features/characters/logic/cost';
import type {
  ArmorModification,
  Consumable,
  Item,
  Potion,
  Recipe,
  Relic,
  UtilityItem,
  WeaponModification,
} from '@/lib/schemas/equipment';

export type LibraryItem =
  | UtilityItem
  | Consumable
  | Potion
  | Relic
  | WeaponModification
  | ArmorModification
  | Recipe;

export type SelectedInfo = {
  quantity: number;
  isEquipped?: boolean;
  location?: string;
};

export type LibraryResultsListProps = {
  items: LibraryItem[];
  selectedByName: Record<string, SelectedInfo | undefined>;
  onAdd: (name: string) => void;
  onDecrement: (name: string) => void;
  onRemoveAll: (name: string) => void;
  onToggleEquipped: (name: string) => void;
};

function emojiFor(item: LibraryItem): string {
  const cat = (item as { category?: string }).category;
  if (cat === 'Utility') return '🧰';
  if (cat === 'Consumable') {
    const sub = (item as unknown as { subcategory?: string }).subcategory;
    return sub === 'Potion' ? '🧪' : '🍽️';
  }
  if (cat === 'Relic') return '🗿';
  if (cat === 'Weapon Modification') return '🛠️';
  if (cat === 'Armor Modification') return '🛡️';
  if (cat === 'Recipe') return '📜';
  return '🎒';
}

export function LibraryResultsList({
  items,
  selectedByName,
  onAdd,
  onDecrement,
  onRemoveAll,
  onToggleEquipped,
}: LibraryResultsListProps) {
  if (!items.length) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        No items match your search and filters.
      </div>
    );
  }

  return (
    <ul className="divide-border divide-y text-sm">
      {items.map(it => {
        const sel = selectedByName[it.name];
        const selected = !!sel && (sel.quantity ?? 0) > 0;
        const qty = sel?.quantity ?? 0;
        const emoji = emojiFor(it);
        const equipped = !!(sel?.isEquipped || sel?.location === 'equipped');
        return (
          <li key={it.name} className="p-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              {/* Actions */}
              <div className="order-1 flex items-center gap-1 sm:order-2">
                {selected ? (
                  <>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => onDecrement(it.name)}
                      aria-label="Decrease quantity"
                    >
                      –
                    </Button>
                    <div className="w-8 text-center text-xs tabular-nums">
                      {qty}
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => onAdd(it.name)}
                      aria-label="Increase quantity"
                    >
                      +
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={equipped ? 'default' : 'outline'}
                      onClick={() => onToggleEquipped(it.name)}
                      aria-label="Toggle equipped"
                    >
                      {equipped ? 'Equipped' : 'Equip'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveAll(it.name)}
                      aria-label="Remove from inventory"
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onAdd(it.name)}
                    aria-label="Add to inventory"
                  >
                    Add
                  </Button>
                )}
              </div>

              {/* Details */}
              <div className="order-2 min-w-0 flex-1 sm:order-1">
                <div className="text-sm font-semibold break-words">
                  <span className="mr-1" aria-hidden>
                    {emoji}
                  </span>
                  {it.name}
                  {selected && qty > 1 ? (
                    <span className="ml-2 rounded bg-blue-100 px-1 py-0.5 text-[11px] text-blue-900 dark:bg-blue-500/20 dark:text-blue-200">
                      x{qty}
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px]">
                  <span className="rounded bg-blue-100 px-1 py-0.5 text-blue-900 dark:bg-blue-500/20 dark:text-blue-200">
                    ⛰️ Tier {String((it as { tier?: number | string }).tier)}
                  </span>
                  <span className="rounded bg-amber-100 px-1 py-0.5 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
                    🎖️ {(it as { rarity?: string }).rarity}
                  </span>
                  {(() => {
                    const c = estimateItemCost(it as Item);
                    return (
                      <span className="rounded bg-emerald-100 px-1 py-0.5 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200">
                        🪙 {c.handfuls} • 💰 {c.bags} • 🧰 {c.chests}
                      </span>
                    );
                  })()}
                </div>
                {(() => {
                  const meta = it as unknown as {
                    description?: string;
                    features?: Array<{ name: string; description?: string }>;
                  };
                  return (
                    <>
                      {meta.description ? (
                        <div className="text-foreground/90 mt-2 text-xs whitespace-pre-wrap">
                          {meta.description}
                        </div>
                      ) : null}
                      {Array.isArray(meta.features) && meta.features.length ? (
                        <>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {meta.features.map((f, i) => (
                              <span
                                key={i}
                                className="bg-muted text-muted-foreground rounded px-1 py-0.5 text-[11px]"
                              >
                                {f.name}
                              </span>
                            ))}
                          </div>
                          <ul className="mt-1 list-disc pl-4 text-xs">
                            {meta.features.slice(0, 3).map((f, i) => (
                              <li key={i}>
                                <span className="font-medium">{f.name}:</span>{' '}
                                {f.description}
                              </li>
                            ))}
                            {meta.features.length > 3 ? (
                              <li className="text-muted-foreground">…</li>
                            ) : null}
                          </ul>
                        </>
                      ) : null}
                    </>
                  );
                })()}
                {(() => {
                  // Utility
                  if ((it as { category?: string }).category === 'Utility') {
                    const u = it as UtilityItem;
                    const parts: string[] = [];
                    parts.push(`Usage: ${String(u.usageType)}`);
                    if (typeof u.charges === 'number')
                      parts.push(`Charges: ${u.charges}`);
                    if (u.rechargePeriod)
                      parts.push(`Recharge: ${String(u.rechargePeriod)}`);
                    return (
                      <div className="text-muted-foreground mt-0.5 text-[11px]">
                        {parts.join(' • ')}
                      </div>
                    );
                  }
                  // Consumable (includes Potion)
                  if ((it as { category?: string }).category === 'Consumable') {
                    const c = it as Consumable | Potion;
                    const parts: string[] = [];
                    if ((c as Potion).potionType) {
                      const p = c as Potion;
                      if (p.potionType)
                        parts.push(`Type: ${String(p.potionType)}`);
                      if (p.healingAmount)
                        parts.push(`Heal: ${p.healingAmount}`);
                      if (p.traitBonus)
                        parts.push(
                          `Trait: ${p.traitBonus.trait} +${p.traitBonus.bonus} (${String(p.traitBonus.duration)})`
                        );
                    }
                    if ((c as Consumable).effect)
                      parts.push(`Effect: ${(c as Consumable).effect}`);
                    if ((c as Consumable).duration)
                      parts.push(`Duration: ${(c as Consumable).duration}`);
                    if ((c as Consumable).targetType)
                      parts.push(
                        `Target: ${String((c as Consumable).targetType)}`
                      );
                    return parts.length ? (
                      <div className="text-muted-foreground mt-0.5 text-[11px]">
                        {parts.join(' • ')}
                      </div>
                    ) : null;
                  }
                  // Relic
                  if ((it as { category?: string }).category === 'Relic') {
                    const r = it as Relic;
                    const parts: string[] = [];
                    if (r.traitBonus)
                      parts.push(
                        `Trait: ${r.traitBonus.trait} +${r.traitBonus.bonus}`
                      );
                    if (r.experienceBonus)
                      parts.push(
                        `XP: ${r.experienceBonus.experience} +${r.experienceBonus.bonus}`
                      );
                    return parts.length ? (
                      <div className="text-muted-foreground mt-0.5 text-[11px]">
                        {parts.join(' • ')}
                      </div>
                    ) : null;
                  }
                  // Weapon Modification
                  if (
                    (it as { category?: string }).category ===
                    'Weapon Modification'
                  ) {
                    const w = it as WeaponModification;
                    const compat = (w.compatibleWeapons || [])
                      .slice(0, 3)
                      .join(', ');
                    return (
                      <div className="text-muted-foreground mt-0.5 text-[11px]">
                        Type: {String(w.modificationType)}
                        {compat
                          ? ` • For: ${compat}${(w.compatibleWeapons || []).length > 3 ? '…' : ''}`
                          : ''}
                        {w.traitChange
                          ? ` • Trait: ${w.traitChange.trait}`
                          : ''}
                        {w.featureAdded
                          ? ` • Feature: ${w.featureAdded.name}`
                          : ''}
                      </div>
                    );
                  }
                  // Armor Modification
                  if (
                    (it as { category?: string }).category ===
                    'Armor Modification'
                  ) {
                    const a = it as ArmorModification;
                    const compat = (a.compatibleArmor || [])
                      .slice(0, 3)
                      .join(', ');
                    return (
                      <div className="text-muted-foreground mt-0.5 text-[11px]">
                        Type: {String(a.modificationType)}
                        {compat
                          ? ` • For: ${compat}${(a.compatibleArmor || []).length > 3 ? '…' : ''}`
                          : ''}
                        {a.featureAdded
                          ? ` • Feature: ${a.featureAdded.name}`
                          : ''}
                      </div>
                    );
                  }
                  // Recipe
                  if ((it as { category?: string }).category === 'Recipe') {
                    const rc = it as Recipe;
                    const mats = (rc.materials || []).slice(0, 3).join(', ');
                    return (
                      <div className="text-muted-foreground mt-0.5 text-[11px]">
                        Makes: {rc.craftedItem}
                        {mats
                          ? ` • Materials: ${mats}${(rc.materials || []).length > 3 ? '…' : ''}`
                          : ''}
                        {rc.downtimeRequired ? ' • Downtime' : ''}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
