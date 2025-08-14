import type {
  ArmorModification,
  Consumable,
  Potion,
  Recipe,
  Relic,
  UtilityItem,
  WeaponModification,
} from '@/lib/schemas/equipment';

export type InventoryLibraryItem =
  | UtilityItem
  | Consumable
  | Potion
  | Relic
  | WeaponModification
  | ArmorModification
  | Recipe;

export function ItemMeta({ item }: { item: InventoryLibraryItem }) {
  // Utility
  if ((item as { category?: string }).category === 'Utility') {
    const u = item as UtilityItem;
    const parts: string[] = [];
    parts.push(`Usage: ${String(u.usageType)}`);
    if (typeof u.charges === 'number') parts.push(`Charges: ${u.charges}`);
    if (u.rechargePeriod) parts.push(`Recharge: ${String(u.rechargePeriod)}`);
    return (
      <div className="text-muted-foreground mt-0.5 text-[11px]">
        {parts.join(' • ')}
      </div>
    );
  }

  // Consumable (includes Potion)
  if ((item as { category?: string }).category === 'Consumable') {
    const c = item as Consumable | Potion;
    const parts: string[] = [];
    if ((c as Potion).potionType) {
      const p = c as Potion;
      if (p.potionType) parts.push(`Type: ${String(p.potionType)}`);
      if (p.healingAmount) parts.push(`Heal: ${p.healingAmount}`);
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
      parts.push(`Target: ${String((c as Consumable).targetType)}`);
    return parts.length ? (
      <div className="text-muted-foreground mt-0.5 text-[11px]">
        {parts.join(' • ')}
      </div>
    ) : null;
  }

  // Relic
  if ((item as { category?: string }).category === 'Relic') {
    const r = item as Relic;
    const parts: string[] = [];
    if (r.traitBonus)
      parts.push(`Trait: ${r.traitBonus.trait} +${r.traitBonus.bonus}`);
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
  if ((item as { category?: string }).category === 'Weapon Modification') {
    const w = item as WeaponModification;
    const compat = (w.compatibleWeapons || []).slice(0, 3).join(', ');
    return (
      <div className="text-muted-foreground mt-0.5 text-[11px]">
        Type: {String(w.modificationType)}
        {compat
          ? ` • For: ${compat}${(w.compatibleWeapons || []).length > 3 ? '…' : ''}`
          : ''}
        {w.traitChange ? ` • Trait: ${w.traitChange.trait}` : ''}
        {w.featureAdded ? ` • Feature: ${w.featureAdded.name}` : ''}
      </div>
    );
  }

  // Armor Modification
  if ((item as { category?: string }).category === 'Armor Modification') {
    const a = item as ArmorModification;
    const compat = (a.compatibleArmor || []).slice(0, 3).join(', ');
    return (
      <div className="text-muted-foreground mt-0.5 text-[11px]">
        Type: {String(a.modificationType)}
        {compat
          ? ` • For: ${compat}${(a.compatibleArmor || []).length > 3 ? '…' : ''}`
          : ''}
        {a.featureAdded ? ` • Feature: ${a.featureAdded.name}` : ''}
      </div>
    );
  }

  // Recipe
  if ((item as { category?: string }).category === 'Recipe') {
    const rc = item as Recipe;
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
}
