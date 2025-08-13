import type {
  ArmorModification,
  Consumable,
  Potion,
  Recipe,
  Relic,
  UtilityItem,
  WeaponModification,
} from '@/lib/schemas/equipment';

export function CategoryInlineDetails({ item }: { item: unknown }) {
  const cat = (item as { category?: string } | undefined)?.category;
  const parts: string[] = [];

  if (cat === 'Utility') {
    const u = item as UtilityItem;
    parts.push(`Usage: ${String(u.usageType)}`);
    if (typeof u.charges === 'number') parts.push(`Charges: ${u.charges}`);
    if (u.rechargePeriod) parts.push(`Recharge: ${String(u.rechargePeriod)}`);
  } else if (cat === 'Consumable') {
    const c = item as Consumable | Potion;
    if ((c as Potion).potionType) {
      const p = c as Potion;
      parts.push(`Type: ${String(p.potionType)}`);
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
  } else if (cat === 'Relic') {
    const r = item as Relic;
    if (r.traitBonus)
      parts.push(`Trait: ${r.traitBonus.trait} +${r.traitBonus.bonus}`);
    if (r.experienceBonus)
      parts.push(
        `XP: ${r.experienceBonus.experience} +${r.experienceBonus.bonus}`
      );
  } else if (cat === 'Weapon Modification') {
    const w = item as WeaponModification;
    const compat = (w.compatibleWeapons || []).slice(0, 3).join(', ');
    parts.push(`Type: ${String(w.modificationType)}`);
    if (compat)
      parts.push(
        `For: ${compat}${(w.compatibleWeapons || []).length > 3 ? '…' : ''}`
      );
    if (w.traitChange) parts.push(`Trait: ${w.traitChange.trait}`);
    if (w.featureAdded) parts.push(`Feature: ${w.featureAdded.name}`);
  } else if (cat === 'Armor Modification') {
    const a = item as ArmorModification;
    const compat = (a.compatibleArmor || []).slice(0, 3).join(', ');
    parts.push(`Type: ${String(a.modificationType)}`);
    if (compat)
      parts.push(
        `For: ${compat}${(a.compatibleArmor || []).length > 3 ? '…' : ''}`
      );
    if (a.featureAdded) parts.push(`Feature: ${a.featureAdded.name}`);
  } else if (cat === 'Recipe') {
    const rc = item as Recipe;
    const mats = (rc.materials || []).slice(0, 3).join(', ');
    parts.push(`Makes: ${rc.craftedItem}`);
    if (mats)
      parts.push(
        `Materials: ${mats}${(rc.materials || []).length > 3 ? '…' : ''}`
      );
    if (rc.downtimeRequired) parts.push('Downtime');
  }

  if (!parts.length) return null;
  return (
    <div className="text-muted-foreground mt-1 text-[11px]">
      {parts.join(' • ')}
    </div>
  );
}
