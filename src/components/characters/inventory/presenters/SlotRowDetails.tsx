import type {
  ArmorModification,
  Consumable,
  InventorySlot,
  Potion,
  Recipe,
  Relic,
  UtilityItem,
  WeaponModification,
} from '@/lib/schemas/equipment';

export function SlotRowDetails({ s }: { s: InventorySlot }) {
  const cat = (s.item as unknown as { category?: string }).category;
  if (cat === 'Utility') {
    const u = s.item as unknown as UtilityItem;
    return (
      <div className="mb-2 space-y-1">
        <div className="font-medium">🧰 Utility</div>
        <div className="text-muted-foreground">
          ⚙️ Usage:{' '}
          <span className="text-foreground">{String(u.usageType)}</span>
          {typeof u.charges === 'number' ? (
            <>
              {' '}
              • 🔋 <span className="text-foreground">{u.charges} charges</span>
            </>
          ) : null}
          {u.rechargePeriod ? (
            <>
              {' '}
              • ♻️{' '}
              <span className="text-foreground">
                {String(u.rechargePeriod)}
              </span>
            </>
          ) : null}
        </div>
      </div>
    );
  }
  if (cat === 'Consumable') {
    const c = s.item as unknown as Consumable | Potion;
    const isPotion = (c as Potion).potionType != null;
    return (
      <div className="mb-2 space-y-1">
        <div className="font-medium">
          {isPotion ? '🧪 Potion' : '🍽️ Consumable'}
        </div>
        <div className="text-muted-foreground space-x-1">
          {isPotion ? (
            <>
              <span>
                ✨ Type:{' '}
                <span className="text-foreground">
                  {String((c as Potion).potionType)}
                </span>
              </span>
              {(c as Potion).healingAmount ? (
                <span>
                  • ❤️ Heal:{' '}
                  <span className="text-foreground">
                    {(c as Potion).healingAmount}
                  </span>
                </span>
              ) : null}
              {(c as Potion).traitBonus ? (
                <span>
                  • 💪 Trait:{' '}
                  <span className="text-foreground">
                    {(c as Potion).traitBonus!.trait} +
                    {(c as Potion).traitBonus!.bonus}
                  </span>{' '}
                  <span className="text-muted-foreground">
                    ({String((c as Potion).traitBonus!.duration)})
                  </span>
                </span>
              ) : null}
            </>
          ) : null}
          {(c as Consumable).effect ? (
            <span>
              • 🎯 Effect:{' '}
              <span className="text-foreground">
                {(c as Consumable).effect}
              </span>
            </span>
          ) : null}
          {(c as Consumable).duration ? (
            <span>
              • ⏳ Duration:{' '}
              <span className="text-foreground">
                {(c as Consumable).duration}
              </span>
            </span>
          ) : null}
          {(c as Consumable).targetType ? (
            <span>
              • 🎯 Target:{' '}
              <span className="text-foreground">
                {String((c as Consumable).targetType)}
              </span>
            </span>
          ) : null}
        </div>
      </div>
    );
  }
  if (cat === 'Relic') {
    const r = s.item as unknown as Relic;
    return (
      <div className="mb-2 space-y-1">
        <div className="font-medium">🏳️ Relic</div>
        <div className="text-muted-foreground space-x-1">
          {r.traitBonus ? (
            <span>
              • 💪 Trait:{' '}
              <span className="text-foreground">
                {r.traitBonus.trait} +{r.traitBonus.bonus}
              </span>
            </span>
          ) : null}
          {r.experienceBonus ? (
            <span>
              • 📚 XP:{' '}
              <span className="text-foreground">
                {r.experienceBonus.experience} +{r.experienceBonus.bonus}
              </span>
            </span>
          ) : null}
          {r.exclusivity ? (
            <span>
              • 🚫 <span className="text-foreground">{r.exclusivity}</span>
            </span>
          ) : null}
        </div>
      </div>
    );
  }
  if (cat === 'Weapon Modification') {
    const w = s.item as unknown as WeaponModification;
    const compat = (w.compatibleWeapons || []).join(', ');
    return (
      <div className="mb-2 space-y-1">
        <div className="font-medium">🛠️ Weapon Mod</div>
        <div className="text-muted-foreground space-x-1">
          <span>
            • 🧪 Type:{' '}
            <span className="text-foreground">
              {String(w.modificationType)}
            </span>
          </span>
          {compat ? (
            <span>
              • 🗡️ For: <span className="text-foreground">{compat}</span>
            </span>
          ) : null}
          {w.traitChange ? (
            <span>
              • 💪 Trait:{' '}
              <span className="text-foreground">{w.traitChange.trait}</span>
            </span>
          ) : null}
          {w.featureAdded ? (
            <span>
              • ✨ Feature:{' '}
              <span className="text-foreground">{w.featureAdded.name}</span>
            </span>
          ) : null}
        </div>
      </div>
    );
  }
  if (cat === 'Armor Modification') {
    const a = s.item as unknown as ArmorModification;
    const compat = (a.compatibleArmor || []).join(', ');
    return (
      <div className="mb-2 space-y-1">
        <div className="font-medium">🛡️ Armor Mod</div>
        <div className="text-muted-foreground space-x-1">
          <span>
            • 🧪 Type:{' '}
            <span className="text-foreground">
              {String(a.modificationType)}
            </span>
          </span>
          {compat ? (
            <span>
              • 🛡️ For: <span className="text-foreground">{compat}</span>
            </span>
          ) : null}
          {a.featureAdded ? (
            <span>
              • ✨ Feature:{' '}
              <span className="text-foreground">{a.featureAdded.name}</span>
            </span>
          ) : null}
        </div>
      </div>
    );
  }
  if (cat === 'Recipe') {
    const rc = s.item as unknown as Recipe;
    const mats = (rc.materials || []).join(', ');
    return (
      <div className="mb-2 space-y-1">
        <div className="font-medium">📜 Recipe</div>
        <div className="text-muted-foreground space-x-1">
          <span>
            • 🎁 Makes:{' '}
            <span className="text-foreground">{rc.craftedItem}</span>
          </span>
          {mats ? (
            <span>
              • 🧱 Materials: <span className="text-foreground">{mats}</span>
            </span>
          ) : null}
          {rc.downtimeRequired ? <span>• ⏳ Downtime required</span> : null}
        </div>
        {rc.instructions ? (
          <div className="text-foreground/90">📝 {rc.instructions}</div>
        ) : null}
      </div>
    );
  }
  return null;
}
